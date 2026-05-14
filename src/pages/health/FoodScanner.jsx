import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Upload, AlertTriangle, CheckCircle2, Info, Search, HeartPulse } from 'lucide-react';
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

  // Step 1: Use a vision model to identify food items from the image
  const identifyFoodFromImage = async (base64Image) => {
    setScanStatus('🔍 Step 1/3: Identifying food using Gemma Vision AI... (this may take 15-30 seconds)');
    
    // Try multiple free vision models as fallbacks
    const visionModels = [
      'nvidia/nemotron-nano-12b-v2-vl:free'
    ];

    for (const model of visionModels) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 25000);
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            max_tokens: 500,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Look at this image carefully. List every food item, drink, snack, or ingredient you can see. If it's a packaged food label, extract all the ingredients listed. Return ONLY a simple comma-separated list of the items, nothing else. Example: donuts, burgers, popcorn, candy, french fries"
                  },
                  {
                    type: "image_url",
                    image_url: { url: base64Image }
                  }
                ]
              }
            ]
          })
        });
        clearTimeout(timer);
        
        const data = await response.json();
        if (data.error) {
          console.warn(`Vision model ${model} error:`, data.error.message);
          continue; // try next model
        }
        if (data.choices?.[0]?.message?.content) {
          const foodList = data.choices[0].message.content.trim();
          console.log(`Vision model ${model} identified:`, foodList);
          if (foodList.length > 5 && !foodList.toLowerCase().includes('no food') && !foodList.toLowerCase().includes('cannot')) {
            return foodList;
          }
        }
      } catch (err) {
        console.warn(`Vision model ${model} failed:`, err.message);
        continue;
      }
    }
    return null;
  };

  // Compress image to reduce payload size for API calls
  const compressImage = (base64Image, maxWidth = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve(base64Image); // fallback to original
      img.src = base64Image;
    });
  };

  // Helper: fetch with timeout
  const fetchWithTimeout = (url, options, timeoutMs = 30000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal })
      .finally(() => clearTimeout(timer));
  };

  // Step 2: Use text model to analyze hormonal health impact (with fallbacks)
  const analyzeForHormonalHealth = async (foodItems) => {
    setScanStatus('🧬 Step 3/3: Analyzing hormonal impact with AI... (almost done!)');
    
    const analysisModels = [
      'meta-llama/llama-3.3-70b-instruct:free',
      'minimax/minimax-m2.5:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
    ];

    const prompt = `A user scanned a photo of food. The following food items were detected: "${foodItems}". 

Analyze each food item for its impact on women's hormonal health — especially regarding PCOS, estrogen dominance, thyroid issues, and endocrine disruption.

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks):
{"ingredients": ["item1", "item2", ...], "flagged": [{"name": "item name", "impact": "explanation of hormonal impact", "severity": "High"|"Medium"|"Low"}], "safeAlternatives": ["healthier alternative 1", "healthier alternative 2", ...]}`;

    for (const model of analysisModels) {
      try {
        console.log(`Trying analysis model: ${model}`);
        const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            max_tokens: 1500,
            messages: [{ role: "user", content: prompt }]
          })
        }, 30000);
        
        const data = await response.json();
        if (data.error) {
          console.warn(`Analysis model ${model} error:`, data.error);
          continue;
        }
        if (data?.choices?.[0]?.message?.content) {
          console.log(`Analysis model ${model} succeeded`);
          return data.choices[0].message.content;
        }
      } catch (err) {
        console.warn(`Analysis model ${model} failed:`, err.message);
        continue;
      }
    }
    throw new Error("All analysis models failed. Please try again.");
  };

  // Combined analysis pipeline
  const analyzeFoodImage = async (base64Image) => {
    try {
      // Compress image first to reduce API payload
      setScanStatus('📷 Step 1/3: Compressing image for faster processing...');
      const compressedImage = await compressImage(base64Image);
      console.log('Image compressed for API');

      // Step 1: Identify food using vision
      const foodItems = await identifyFoodFromImage(compressedImage);
      
      if (!foodItems) {
        toast.error("Could not identify food items in the image. Please try a clearer photo.");
        return null;
      }

      console.log('Food items identified:', foodItems);

      // Step 2: Show identified items
      setScanStatus(`✅ Step 2/3: Found food items! Now analyzing hormonal impact...`);
      await new Promise(r => setTimeout(r, 800)); // brief pause so user can read
      
      // Step 3: Analyze with text model
      const analysisText = await analyzeForHormonalHealth(foodItems);
      
      let parsedData = null;
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : analysisText.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(jsonStr);
      } catch (e) {
        console.error('JSON parse failed, trying fallback', e);
        try {
          const fallbackMatch = analysisText.match(/[\[{][\s\S]*[\]}]/);
          if (fallbackMatch) parsedData = JSON.parse(fallbackMatch[0]);
        } catch (e2) {
          throw new Error("Failed to parse AI response");
        }
      }

      if (!parsedData) throw new Error("Could not extract data from AI response");
      
      parsedData.ingredients = parsedData.ingredients || [];
      parsedData.flagged = parsedData.flagged || [];
      parsedData.safeAlternatives = parsedData.safeAlternatives || [];
      
      awardPoints(15, 'Used Hormone-Safe Scanner');
      toast.success('Scan complete! You earned 15 ShePoints 🌟');
      return parsedData;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      toast.error('AI analysis failed: ' + (error.message || 'Please try again.'));
      return null;
    }
  };

  const handleCapture = () => {
    toast.error('Camera API not available on this device. Please upload an image.');
  };

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
          setImagePreview(e.target.result);
          startScan(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const startScan = async (base64) => {
    setIsScanning(true);
    setResult(null);
    
    if (base64) {
      // Overall 60-second timeout for the entire pipeline
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Analysis timed out')), 60000)
      );
      
      try {
        const aiResult = await Promise.race([
          analyzeFoodImage(base64),
          timeoutPromise
        ]);
        setIsScanning(false);
        if (aiResult) {
          setResult(aiResult);
        } else {
          throw new Error('No result from AI');
        }
      } catch (error) {
        console.error('Scan error:', error.message);
        setIsScanning(false);
        toast.error('AI is busy — showing demo results.');
        // Show fallback so user isn't stuck
        setResult({
          ingredients: ['detected food items'],
          flagged: [
            { name: 'Processed Sugar', impact: 'Can spike insulin levels and worsen PCOS symptoms.', severity: 'High' },
            { name: 'Trans Fats', impact: 'Linked to inflammation and hormonal imbalance.', severity: 'Medium' }
          ],
          safeAlternatives: [
            'Replace processed sugar with jaggery or stevia',
            'Choose baked options instead of fried',
            'Add more whole grains and leafy greens'
          ]
        });
      }
    } else {
      setIsScanning(false);
      toast.error("Please provide an image.");
    }
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
          Upload a photo of any food — fresh produce, packaged snacks, or meals — and our AI will analyze its impact on your hormonal health.
        </p>
      </div>

      {!result && !isScanning && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <button 
            onClick={handleCapture}
            style={{
              width: '100%', height: '200px', borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, #B4136D, #630ed4)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
              border: 'none', color: 'white', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(180,19,109,0.2)'
            }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={32} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Take Photo of Food</span>
              <span style={{ fontSize: '13px', opacity: 0.8 }}>Snap any food to scan it</span>
            </div>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%', padding: '16px', borderRadius: '1rem',
              background: 'var(--color-surface-lowest)',
              border: '2px dashed var(--color-outline-variant)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              color: 'var(--color-outline)', cursor: 'pointer', fontWeight: 600
            }}
          >
            <Upload size={20} />
            Upload Image from Gallery
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload}
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
      )}

      {/* Scanning Animation */}
      {isScanning && imagePreview && (
        <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 8px 32px rgba(24,20,69,0.1)' }}>
          <img src={imagePreview} alt="Scanning" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)' }} />
          
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', left: 0, width: '100%', height: '4px',
              background: '#10B981', boxShadow: '0 0 20px 4px rgba(16,185,129,0.6)',
              zIndex: 10
            }}
          />
          
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 20, width: '90%' }}>
            <Search size={40} color="white" style={{ animation: 'pulse 2s infinite' }} />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '16px', textShadow: '0 2px 8px rgba(0,0,0,0.7)', textAlign: 'center', lineHeight: 1.4 }}>
              {scanStatus || 'Analyzing...'}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textShadow: '0 1px 3px rgba(0,0,0,0.5)', textAlign: 'center', marginTop: '4px' }}>
              Please wait — our AI is processing your food image
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ paddingBottom: '40px' }}
          >
            {/* Status Header */}
            {(!result.ingredients || result.ingredients.length === 0) ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={20} color="#F59E0B" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B', margin: '0 0 2px' }}>No Ingredients Detected</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: 0 }}>We couldn't read the label clearly. Please try again with a better photo.</p>
                </div>
              </div>
            ) : result.flagged.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} color="#10B981" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', margin: '0 0 2px' }}>0 Hormone Disruptors Found</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: 0 }}>This product appears to be safe for consumption!</p>
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

            {/* Extracted Ingredients List (Optional info for the user) */}
            {result.ingredients && result.ingredients.length > 0 && (
               <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-shakti-dark-muted)', marginBottom: '8px' }}>Detected Ingredients: {result.ingredients.join(', ')}</p>
               </div>
            )}

            {/* Flagged Items */}
            {result.flagged && result.flagged.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {result.flagged.map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--color-surface-lowest)', padding: '16px', borderRadius: '1.5rem', borderLeft: `4px solid ${item.severity === 'High' ? '#a20017' : '#F59E0B'}`, boxShadow: '0 4px 24px rgba(24,20,69,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)' }}>{item.name}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '999px', background: item.severity === 'High' ? 'rgba(162,0,23,0.1)' : 'rgba(245,158,11,0.1)', color: item.severity === 'High' ? '#a20017' : '#F59E0B' }}>
                        {item.severity} Risk
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.5, margin: 0 }}>
                      {item.impact}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Safe Alternatives */}
            {result.safeAlternatives && result.safeAlternatives.length > 0 && (
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
              onClick={() => { setResult(null); setImagePreview(null); }}
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
