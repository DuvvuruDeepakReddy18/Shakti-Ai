import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Upload, AlertTriangle, CheckCircle2, Search, HeartPulse, Type } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

export default function FoodScanner() {
  const navigate = useNavigate();
  const { awardPoints } = useAuthStore();
  const fileInputRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [result, setResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [mode, setMode] = useState('choose'); // 'choose' | 'text' | 'image'

  // ── Prompt for text-based analysis ──
  const makePrompt = (foodItems) => `Analyze these food items for women's hormonal health (PCOS, estrogen dominance, thyroid, endocrine disruption): "${foodItems}".
Reply ONLY with valid JSON, no markdown, no code fences:
{"ingredients":["item1","item2"],"flagged":[{"name":"item","impact":"short explanation","severity":"High"|"Medium"|"Low"}],"safeAlternatives":["alternative 1","alternative 2"]}`;

  // ── Vision+analysis combined prompt ──
  const VISION_PROMPT = `Look at this food image. Identify every food item visible, then analyze each for its impact on women's hormonal health (PCOS, estrogen dominance, thyroid, endocrine disruption).
Reply ONLY with valid JSON, no markdown, no code fences:
{"ingredients":["item1","item2"],"flagged":[{"name":"item","impact":"short explanation","severity":"High"|"Medium"|"Low"}],"safeAlternatives":["alternative 1","alternative 2"]}`;

  // ── Parse AI JSON response ──
  const parseAIResponse = (text) => {
    try {
      const cleaned = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.ingredients = parsed.ingredients || [];
      parsed.flagged = parsed.flagged || [];
      parsed.safeAlternatives = parsed.safeAlternatives || [];
      if (!Array.isArray(parsed.ingredients)) return null;
      return parsed;
    } catch (e) {
      console.error('JSON parse failed:', e);
      return null;
    }
  };

  // ── TEXT MODE: Analyze typed food items (FAST, 3-5s, always works) ──
  const analyzeByText = async (foodText) => {
    setIsScanning(true);
    setResult(null);
    setScanStatus('🧬 Analyzing hormonal impact… (3-5 seconds)');

    const models = [
      'deepseek/deepseek-v4-flash:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
      'minimax/minimax-m2.5:free',
    ];

    for (const model of models) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST", signal: controller.signal,
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model, max_tokens: 800,
            messages: [{ role: "user", content: makePrompt(foodText) }]
          })
        });
        clearTimeout(timer);
        const data = await response.json();
        if (data.error) { console.warn(`${model} error:`, data.error.message); continue; }
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          const parsed = parseAIResponse(text);
          if (parsed) {
            awardPoints(15, 'Used Hormone-Safe Scanner');
            toast.success('Scan complete! You earned 15 ShePoints 🌟');
            setResult(parsed);
            setIsScanning(false);
            return;
          }
        }
      } catch (err) {
        console.warn(`${model} failed:`, err.message);
        continue;
      }
    }
    setIsScanning(false);
    toast.error('AI models are temporarily unavailable. Please try again.');
  };

  // ── IMAGE MODE: compress + try OpenRouter vision models, then Gemini serverless ──
  const compressImage = (base64Image) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(800 / img.width, 800 / img.height, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = () => resolve(base64Image);
      img.src = base64Image;
    });
  };

  const analyzeByImage = async (base64Image) => {
    setIsScanning(true);
    setResult(null);
    setScanStatus('📷 Compressing image…');
    const compressed = await compressImage(base64Image);

    setScanStatus('🔍 Identifying food from image… (5-15 sec)');

    // ── Strategy 1: OpenRouter vision models (client-side, same pattern as text) ──
    const visionModels = [
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'google/gemma-4-26b-a4b-it:free',
      'google/gemma-4-31b-it:free',
      'nvidia/nemotron-nano-12b-v2-vl:free',
    ];

    for (const model of visionModels) {
      try {
        console.log(`[Vision] Trying ${model}...`);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 25000);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST", signal: controller.signal,
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model, max_tokens: 800,
            messages: [{
              role: "user",
              content: [
                { type: "text", text: VISION_PROMPT },
                { type: "image_url", image_url: { url: compressed } }
              ]
            }]
          })
        });
        clearTimeout(timer);
        const data = await response.json();
        if (data.error) { console.warn(`${model} error:`, data.error.message); continue; }
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          const parsed = parseAIResponse(text);
          if (parsed) {
            awardPoints(15, 'Used Hormone-Safe Scanner');
            toast.success('Scan complete! You earned 15 ShePoints 🌟');
            setResult(parsed);
            setIsScanning(false);
            return;
          }
        }
      } catch (err) {
        console.warn(`${model} failed:`, err.message);
        continue;
      }
    }

    // ── Strategy 2: Vercel serverless Gemini endpoint as fallback ──
    setScanStatus('🔄 Trying backup scanner…');
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);
      
      const r = await fetch("/api/nvidia-vision", {
        method: "POST", 
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressed })
      });

      clearTimeout(timer);
      const d = await r.json();

      if (r.ok) {
        const text = d.choices?.[0]?.message?.content;
        if (text) {
          const parsed = parseAIResponse(text);
          if (parsed) {
            awardPoints(15, 'Used Hormone-Safe Scanner');
            toast.success('Scan complete! You earned 15 ShePoints 🌟');
            setResult(parsed); 
            setIsScanning(false); 
            return;
          }
        }
      }
    } catch (err) { 
      console.warn('Gemini fallback failed:', err.message); 
    }

    // ── All vision pipelines failed ──
    setIsScanning(false);
    toast.error('Image scan is temporarily unavailable. Please type the food items below instead.', { duration: 5000 });
  };

  const handleUpload = (e) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
        analyzeByImage(ev.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleTextSubmit = () => {
    const text = textInput.trim();
    if (!text) { toast.error('Please enter some food items.'); return; }
    analyzeByText(text);
  };

  return (
    <div style={{ padding: '20px 16px 100px', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: 'var(--color-shakti-dark-text)' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: '0 0 4px', fontFamily: 'var(--font-display)' }}>
            Hormone-Safe Scanner
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: 0 }}>
            Analyze any food for women's health
          </p>
        </div>
      </div>

      <div style={{
        background: 'rgba(180,19,109,0.08)', border: '1px solid rgba(180,19,109,0.2)',
        padding: '16px', borderRadius: '1rem', marginBottom: '24px',
        display: 'flex', gap: '12px', alignItems: 'flex-start'
      }}>
        <HeartPulse size={20} style={{ color: '#B4136D', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-muted)', margin: 0, lineHeight: 1.5 }}>
          Type food names for instant results, or upload a photo for AI-powered scanning.
        </p>
      </div>

      {/* ── Main Scanner Interface ── */}
      {!result && !isScanning && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>

          {/* PRIMARY: Image Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%', minHeight: '200px', borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, #B4136D, #630ed4)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
              border: 'none', color: 'white', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(180,19,109,0.25)',
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1), transparent 60%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <Camera size={36} />
            </div>
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <span style={{ display: 'block', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                📷 Upload Food Photo
              </span>
              <span style={{ fontSize: '13px', opacity: 0.85 }}>
                AI will automatically identify & analyze the food
              </span>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" capture="environment" style={{ display: 'none' }} />

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-outline-variant)' }} />
            <span style={{ fontSize: '12px', color: 'var(--color-outline)', fontWeight: 600 }}>OR TYPE MANUALLY</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-outline-variant)' }} />
          </div>

          {/* SECONDARY: Text Input */}
          <div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g. paneer butter masala, white rice, coke, chocolate cake"
              style={{
                width: '100%', minHeight: '80px', padding: '14px', borderRadius: '1rem',
                background: 'var(--color-surface-lowest)', border: '1px solid var(--color-outline-variant)',
                color: 'var(--color-shakti-dark-text)', fontSize: '14px', fontFamily: 'inherit',
                resize: 'vertical', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <button onClick={handleTextSubmit} style={{
              width: '100%', padding: '14px', borderRadius: '999px', marginTop: '10px',
              background: 'var(--color-surface-container)', color: 'var(--color-shakti-dark-text)',
              border: '1px solid var(--color-outline-variant)', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
            }}>⚡ Analyze Text</button>
          </div>
        </div>
      )}

      {/* Scanning Animation */}
      {isScanning && (
        <div style={{
          position: 'relative', width: '100%', minHeight: imagePreview ? '300px' : '200px',
          borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(24,20,69,0.1)',
          background: imagePreview ? 'transparent' : 'linear-gradient(135deg, #1a1030, #2d1b4e)'
        }}>
          {imagePreview && <img src={imagePreview} alt="Scanning" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }} />
          <motion.div
            initial={{ top: 0 }} animate={{ top: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', left: 0, width: '100%', height: '4px', background: '#10B981', boxShadow: '0 0 20px 4px rgba(16,185,129,0.6)', zIndex: 10 }}
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 20, width: '90%' }}>
            <Search size={40} color="white" style={{ animation: 'pulse 2s infinite' }} />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '16px', textShadow: '0 2px 8px rgba(0,0,0,0.7)', textAlign: 'center' }}>
              {scanStatus || 'Analyzing…'}
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ paddingBottom: '40px' }}>
            {(!result.ingredients || result.ingredients.length === 0) ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={20} color="#F59E0B" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B', margin: '0 0 2px' }}>No Ingredients Detected</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: 0 }}>Try again with different food items.</p>
                </div>
              </div>
            ) : result.flagged.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} color="#10B981" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', margin: '0 0 2px' }}>0 Hormone Disruptors Found</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: 0 }}>This food appears safe for consumption!</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(162,0,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={20} color="#a20017" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#a20017', margin: '0 0 2px' }}>{result.flagged.length} Hormone Disruptors Found</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: 0 }}>Not recommended for daily consumption</p>
                </div>
              </div>
            )}

            {result.ingredients?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-shakti-dark-muted)', marginBottom: '8px' }}>Detected Ingredients: {result.ingredients.join(', ')}</p>
              </div>
            )}

            {result.flagged?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {result.flagged.map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--color-surface-lowest)', padding: '16px', borderRadius: '1.5rem', borderLeft: `4px solid ${item.severity === 'High' ? '#a20017' : '#F59E0B'}`, boxShadow: '0 4px 24px rgba(24,20,69,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)' }}>{item.name}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '999px', background: item.severity === 'High' ? 'rgba(162,0,23,0.1)' : 'rgba(245,158,11,0.1)', color: item.severity === 'High' ? '#a20017' : '#F59E0B' }}>
                        {item.severity} Risk
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.5, margin: 0 }}>{item.impact}</p>
                  </div>
                ))}
              </div>
            )}

            {result.safeAlternatives?.length > 0 && (
              <div style={{ background: 'var(--color-surface-lowest)', padding: '20px', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(24,20,69,0.03)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#10B981" /> Safer Alternatives to Look For
                </h4>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.safeAlternatives.map((alt, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', marginTop: '6px', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.5 }}>{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => { setResult(null); setImagePreview(null); setTextInput(''); }}
              style={{
                width: '100%', padding: '16px', borderRadius: '999px',
                background: 'var(--color-surface-container)', color: 'var(--color-shakti-dark-text)',
                border: 'none', fontWeight: 600, fontSize: '14px', marginTop: '24px', cursor: 'pointer'
              }}
            >
              Scan Another Product
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
