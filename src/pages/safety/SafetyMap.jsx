import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Star, AlertTriangle, Clock, Shield,
  Loader2, ArrowLeft, Zap, ShieldCheck, ChevronRight,
  Sun, Moon, Sunset, Sunrise, Map as MapIcon,
} from 'lucide-react';
import { analyzeRouteSafety } from '../../services/aiService';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const generateDynamicZones = (lat, lng) => [
  { name: 'City Center', lat: lat + 0.001, lng: lng + 0.002, score: 8.7, rating: 'safe', users: 42 },
  { name: 'North District', lat: lat + 0.02, lng: lng + 0.01, score: 9.1, rating: 'safe', users: 67 },
  { name: 'Industrial Area', lat: lat - 0.03, lng: lng - 0.02, score: 3.2, rating: 'unsafe', users: 3 },
  { name: 'South Market', lat: lat - 0.01, lng: lng + 0.03, score: 7.4, rating: 'moderate', users: 28 },
  { name: 'Tech Park', lat: lat + 0.015, lng: lng - 0.025, score: 8.2, rating: 'safe', users: 35 },
  { name: 'Transit Hub', lat: lat - 0.02, lng: lng + 0.01, score: 6.1, rating: 'moderate', users: 18 },
];

const getZoneColor = (rating) => {
  if (rating === 'safe') return '#10B981';
  if (rating === 'moderate') return '#F59E0B';
  return '#EF4444';
};

const getZoneBgColor = (rating) => {
  if (rating === 'safe') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (rating === 'moderate') return 'bg-amber-50 text-amber-700 border-amber-100';
  return 'bg-rose-50 text-rose-700 border-rose-100';
};

const createCustomIcon = (score, rating) =>
  new L.divIcon({
    html: `<div style="width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; background: ${getZoneColor(rating)}; box-shadow: 0 4px 14px rgba(0,0,0,0.15)">${score}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function SafetyMap() {
  const navigate = useNavigate();
  const { userProfile } = useAuthStore();

  const [centerLat, setCenterLat] = useState(userProfile?.location?.lat || 28.6139);
  const [centerLng, setCenterLng] = useState(userProfile?.location?.lng || 77.2090);

  useEffect(() => {
    if (userProfile?.city) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(userProfile.city)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setCenterLat(parseFloat(data[0].lat));
            setCenterLng(parseFloat(data[0].lon));
          }
        })
        .catch((err) => console.error('Geocoding error:', err));
    }
  }, [userProfile?.city]);

  const dynamicZones = useMemo(() => generateDynamicZones(centerLat, centerLng), [centerLat, centerLng]);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!origin || !destination) { toast.error('Please enter both origin and destination'); return; }
    setLoading(true);
    try {
      const result = await analyzeRouteSafety(origin, destination, timeOfDay);
      setAnalysis(result);
      toast.success('Route analyzed');
    } catch {
      toast.error('Analysis failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-shakti-light-text)] hover:text-[var(--color-shakti-dark-text)] transition-colors mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-surface-highlight)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[var(--color-surface)] shadow-inner flex items-center justify-center text-[var(--color-shakti-dark-text)] flex-shrink-0">
            <MapIcon size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Safety Map</h1>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Predictive safety zones & live community insights.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="h-[400px] rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 relative z-0"
      >
        <MapContainer center={[centerLat, centerLng]} zoom={11} className="w-full h-full" zoomControl={false}>
          <MapUpdater center={[centerLat, centerLng]} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap"
          />
          {dynamicZones.map((zone) => (
            <div key={zone.name}>
              <Circle center={[zone.lat, zone.lng]} radius={1500} pathOptions={{ color: getZoneColor(zone.rating), fillColor: getZoneColor(zone.rating), fillOpacity: 0.1, stroke: false }} />
              <Marker position={[zone.lat, zone.lng]} icon={createCustomIcon(zone.score, zone.rating)}>
                <Popup>
                  <div className="p-2 text-center">
                    <p className="font-semibold text-gray-900 text-sm mb-1">{zone.name}</p>
                    <p className="text-xs text-gray-500">{zone.users} active users</p>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-md border border-white/60 z-[1000] space-y-2">
          <LegendItem color="bg-emerald-500" label="Safe (8+)" />
          <LegendItem color="bg-amber-500" label="Moderate (5-7)" />
          <LegendItem color="bg-rose-500" label="Caution (<5)" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 border border-[var(--color-surface-highlight)] shadow-md mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap size={18} className="text-amber-500" /> AI safety navigator
        </h3>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[var(--color-shakti-light-text)] uppercase tracking-[0.15em] mb-3 block ml-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input
                  value={origin} onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. My home"
                  className="w-full pl-12 pr-5 py-4 rounded-[1rem] bg-[var(--color-surface)] border border-[var(--color-surface-highlight)] text-[var(--color-text-primary)] text-sm focus:border-[var(--color-shakti-dark-text)] focus:ring-1 focus:ring-[var(--color-shakti-dark-text)] outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[var(--color-shakti-light-text)] uppercase tracking-[0.15em] mb-3 block ml-1">To</label>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                <input
                  value={destination} onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Metro station"
                  className="w-full pl-12 pr-5 py-4 rounded-[1rem] bg-[var(--color-surface)] border border-[var(--color-surface-highlight)] text-[var(--color-text-primary)] text-sm focus:border-[var(--color-shakti-dark-text)] focus:ring-1 focus:ring-[var(--color-shakti-dark-text)] outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <TimeButton icon={Sunrise} label="Morning" active={timeOfDay === 'morning'} onClick={() => setTimeOfDay('morning')} />
            <TimeButton icon={Sun} label="Day" active={timeOfDay === 'day'} onClick={() => setTimeOfDay('day')} />
            <TimeButton icon={Sunset} label="Evening" active={timeOfDay === 'evening'} onClick={() => setTimeOfDay('evening')} />
            <TimeButton icon={Moon} label="Night" active={timeOfDay === 'night'} onClick={() => setTimeOfDay('night')} />
          </div>

          <button
            onClick={handleAnalyze} disabled={loading}
            className="w-full py-4 mt-2 rounded-[1rem] bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[#3A2D80] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[var(--color-shakti-dark-text)]/20 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
            {loading ? 'Analyzing route…' : 'Calculate safe path'}
          </button>
        </div>

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mt-5 pt-5 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
                <div className="md:col-span-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-4xl font-bold text-gray-900 mb-1">{analysis.safetyScore}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Safety index</div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block border ${getZoneBgColor(analysis.safetyScore >= 8 ? 'safe' : analysis.safetyScore >= 5 ? 'moderate' : 'unsafe')}`}>
                    {analysis.safetyScore >= 8 ? 'Optimal path' : analysis.safetyScore >= 5 ? 'Moderate caution' : 'Alternative recommended'}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{analysis.recommendation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.riskFactors?.length > 0 && (
                  <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-100">
                    <h4 className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={12} /> Attention areas
                    </h4>
                    <div className="space-y-1.5">
                      {analysis.riskFactors.map((r, i) => (
                        <div key={i} className="flex gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                          <p>{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.tips?.length > 0 && (
                  <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
                    <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Shield size={12} /> Proactive defense
                    </h4>
                    <div className="space-y-1.5">
                      {analysis.tips.map((t, i) => (
                        <div key={i} className="flex gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                          <p>{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex items-center justify-between mb-5 px-2">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <Star size={20} className="text-amber-500 fill-amber-500" /> Highest rated zones
        </h2>
        <span className="text-xs font-medium text-[var(--color-shakti-light-text)] uppercase tracking-widest">Real-time</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...dynamicZones].sort((a, b) => b.score - a.score).slice(0, 4).map((zone, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[var(--color-surface-lowest)] rounded-[1.25rem] p-5 border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-md hover:border-[var(--color-shakti-dark-text)]/20 transition-all flex items-center gap-4 group"
          >
            <div className={`w-14 h-14 rounded-[1rem] flex items-center justify-center font-bold text-lg shadow-inner border ${getZoneBgColor(zone.rating)}`}>
              {zone.score}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-[var(--color-text-primary)] mb-1">{zone.name}</h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-secondary)] font-medium">
                <span className="flex items-center gap-1"><Clock size={12} /> {zone.users} active</span>
                <span className={`px-2 py-0.5 rounded-[0.5rem] text-[10px] uppercase tracking-wider font-bold border ${getZoneBgColor(zone.rating)}`}>{zone.rating}</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-[var(--color-shakti-dark-text)] transition-colors flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
  );
}

function TimeButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full flex items-center gap-2 transition-all border text-sm font-medium ${
        active ? 'bg-[var(--color-shakti-dark-text)] text-white border-[var(--color-shakti-dark-text)] shadow-md shadow-[var(--color-shakti-dark-text)]/20' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-surface-highlight)] hover:border-[var(--color-shakti-dark-text)] hover:text-[var(--color-shakti-dark-text)] hover:bg-[var(--color-surface-lowest)]'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
