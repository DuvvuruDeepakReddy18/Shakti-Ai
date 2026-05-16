import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, Star, MapPin, IndianRupee, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const listings = [
  { id: 1, name: 'Aarti\'s Spice Box', cat: 'Food', items: 'Pickles · Spice mixes', price: '₹150 – ₹600', rating: 4.9, reviews: 128, location: 'Pune', emoji: '🌶️', color: '#EF4444' },
  { id: 2, name: 'Threadwork by Meera', cat: 'Crafts', items: 'Hand-embroidered scarves', price: '₹800 – ₹3,500', rating: 4.8, reviews: 89, location: 'Jaipur', emoji: '🧵', color: '#db2777' },
  { id: 3, name: 'Sunita\'s Tiffin Service', cat: 'Food', items: 'Daily home-cooked lunch', price: '₹120 / meal', rating: 5.0, reviews: 312, location: 'Bangalore', emoji: '🍱', color: '#F59E0B' },
  { id: 4, name: 'Shreya Designs', cat: 'Fashion', items: 'Sustainable cotton wear', price: '₹1,200 – ₹4,500', rating: 4.7, reviews: 56, location: 'Mumbai', emoji: '👗', color: '#3B82F6' },
  { id: 5, name: 'Plant Mom Garden', cat: 'Home', items: 'Indoor plants & planters', price: '₹250 – ₹1,800', rating: 4.9, reviews: 174, location: 'Hyderabad', emoji: '🌿', color: '#10B981' },
  { id: 6, name: 'Glow by Anya', cat: 'Beauty', items: 'Handmade skincare', price: '₹400 – ₹1,500', rating: 4.8, reviews: 92, location: 'Delhi', emoji: '🌸', color: '#7c3aed' },
];

const cats = ['All', 'Food', 'Crafts', 'Fashion', 'Home', 'Beauty'];

export default function Marketplace() {
  const [active, setActive] = useState('All');
  const [favs, setFavs] = useState([]);

  const filtered = active === 'All' ? listings : listings.filter(l => l.cat === active);
  const toggleFav = (id) => setFavs(favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-amber-600 mb-4">
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-3xl p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-pink-50"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 flex-shrink-0">
            <Store size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1">Women-Owned Marketplace</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Discover and support women entrepreneurs.</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              active === c
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-[var(--color-surface-lowest)] text-[var(--color-text-secondary)] border border-[var(--color-surface-highlight)] hover:border-pink-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(l => (
          <motion.div
            key={l.id}
            whileHover={{ y: -4 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl overflow-hidden border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-md transition-all"
          >
            <div
              className="h-32 flex items-center justify-center text-5xl relative"
              style={{ backgroundColor: `${l.color}15` }}
            >
              {l.emoji}
              <button
                onClick={() => toggleFav(l.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
              >
                <Heart
                  size={16}
                  className={favs.includes(l.id) ? 'fill-rose-500 text-rose-500' : 'text-[var(--color-outline)]'}
                />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1 mb-1">
                <span className="px-1.5 py-0.5 rounded-md bg-[var(--color-surface-low)] text-[var(--color-text-secondary)] text-[10px] font-medium">{l.cat}</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-tight mb-1">{l.name}</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3">{l.items}</p>
              <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                  <IndianRupee size={11} />{l.price.replace('₹', '')}
                </span>
                <span className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  {l.rating} ({l.reviews})
                </span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[11px] text-[var(--color-outline)]">
                <MapPin size={11} /> {l.location}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
