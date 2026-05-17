import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, Star, MapPin, IndianRupee, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACCENT = '#e11d48';
const ACCENT_LIGHT = '#f43f5e';

const listings = [
  { id: 1, name: "Aarti's Spice Box", cat: 'Food', items: 'Pickles · Spice mixes', price: '₹150 – ₹600', rating: 4.9, reviews: 128, location: 'Pune', emoji: '🌶️', color: '#EF4444' },
  { id: 2, name: 'Threadwork by Meera', cat: 'Crafts', items: 'Hand-embroidered scarves', price: '₹800 – ₹3,500', rating: 4.8, reviews: 89, location: 'Jaipur', emoji: '🧵', color: '#db2777' },
  { id: 3, name: "Sunita's Tiffin Service", cat: 'Food', items: 'Daily home-cooked lunch', price: '₹120 / meal', rating: 5.0, reviews: 312, location: 'Bangalore', emoji: '🍱', color: '#F59E0B' },
  { id: 4, name: 'Shreya Designs', cat: 'Fashion', items: 'Sustainable cotton wear', price: '₹1,200 – ₹4,500', rating: 4.7, reviews: 56, location: 'Mumbai', emoji: '👗', color: '#3B82F6' },
  { id: 5, name: 'Plant Mom Garden', cat: 'Home', items: 'Indoor plants & planters', price: '₹250 – ₹1,800', rating: 4.9, reviews: 174, location: 'Hyderabad', emoji: '🌿', color: '#10B981' },
  { id: 6, name: 'Glow by Anya', cat: 'Beauty', items: 'Handmade skincare', price: '₹400 – ₹1,500', rating: 4.8, reviews: 92, location: 'Delhi', emoji: '🌸', color: '#7c3aed' },
];

const cats = ['All', 'Food', 'Crafts', 'Fashion', 'Home', 'Beauty'];

export default function Marketplace() {
  const navigate = useNavigate();
  const [active, setActive] = useState('All');
  const [favs, setFavs] = useState([]);

  const filtered = active === 'All' ? listings : listings.filter(l => l.cat === active);
  const toggleFav = (id) => setFavs(favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: 'var(--color-outline)', background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '16px', fontFamily: 'var(--font-sans)',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative', borderRadius: '1.5rem', padding: '28px 24px',
          marginBottom: '18px', overflow: 'hidden',
          background: 'var(--color-surface-lowest)',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: `${ACCENT}14`, borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 20px ${ACCENT}40`,
          }}>
            <Store size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Women-Owned Marketplace</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Discover and support women entrepreneurs.</p>
          </div>
        </div>
      </motion.div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '18px' }}>
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setActive(c)}
            style={{
              padding: '8px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
              whiteSpace: 'nowrap',
              background: active === c ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})` : 'var(--color-surface-lowest)',
              color: active === c ? 'white' : 'var(--color-outline)',
              border: active === c ? 'none' : '1px solid rgba(24,20,69,0.05)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              boxShadow: active === c ? `0 4px 12px ${ACCENT}33` : 'none',
              transition: 'all 0.15s'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {filtered.map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            style={{
              background: 'var(--color-surface-lowest)', borderRadius: '1.25rem',
              overflow: 'hidden', boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
              cursor: 'pointer', transition: 'box-shadow 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(24,20,69,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'}
          >
            <div
              style={{
                height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '52px', position: 'relative',
                background: `linear-gradient(135deg, ${l.color}1a, ${l.color}0d)`
              }}
            >
              <span>{l.emoji}</span>
              <button
                onClick={() => toggleFav(l.id)}
                style={{
                  position: 'absolute', top: '10px', right: '10px',
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                <Heart
                  size={15}
                  fill={favs.includes(l.id) ? ACCENT : 'none'}
                  style={{ color: favs.includes(l.id) ? ACCENT : 'var(--color-outline)' }}
                />
              </button>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <span style={{
                display: 'inline-block',
                padding: '2px 8px', borderRadius: '6px',
                background: 'var(--color-surface-low)', color: 'var(--color-outline)',
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                marginBottom: '6px'
              }}>
                {l.cat}
              </span>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '0 0 4px', lineHeight: 1.3 }}>{l.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '0 0 10px' }}>{l.items}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '12px', fontWeight: 700, color: '#047857' }}>
                  <IndianRupee size={11} />{l.price.replace('₹', '')}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-outline)' }}>
                  <Star size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                  <span style={{ fontWeight: 700, color: 'var(--color-shakti-dark-text)' }}>{l.rating}</span>
                  <span>({l.reviews})</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '11px', color: 'var(--color-outline)' }}>
                <MapPin size={11} /> {l.location}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
