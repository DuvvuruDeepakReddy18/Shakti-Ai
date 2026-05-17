import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Star, AlertTriangle, Clock, Shield,
  Loader2, ArrowLeft, Zap, ShieldCheck, ChevronRight,
  Sun, Moon, Sunset, Sunrise, Map as MapIcon, Users, Eye,
} from 'lucide-react';
import { analyzeRouteSafety } from '../../services/aiService';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const generateDynamicZones = (lat, lng) => [
  { name: 'City Center', lat: lat + 0.001, lng: lng + 0.002, score: 8.7, rating: 'safe', users: 42, desc: 'Well-lit commercial zone' },
  { name: 'North District', lat: lat + 0.02, lng: lng + 0.01, score: 9.1, rating: 'safe', users: 67, desc: 'Residential & patrolled' },
  { name: 'Industrial Area', lat: lat - 0.03, lng: lng - 0.02, score: 3.2, rating: 'unsafe', users: 3, desc: 'Low foot traffic after 7 PM' },
  { name: 'South Market', lat: lat - 0.01, lng: lng + 0.03, score: 7.4, rating: 'moderate', users: 28, desc: 'Busy during market hours' },
  { name: 'Tech Park', lat: lat + 0.015, lng: lng - 0.025, score: 8.2, rating: 'safe', users: 35, desc: 'Gated campus with security' },
  { name: 'Transit Hub', lat: lat - 0.02, lng: lng + 0.01, score: 6.1, rating: 'moderate', users: 18, desc: 'Crowded peak hours' },
];

const getZoneColor = (rating) => {
  if (rating === 'safe') return '#10B981';
  if (rating === 'moderate') return '#F59E0B';
  return '#EF4444';
};

const getZoneGradient = (rating) => {
  if (rating === 'safe') return 'from-emerald-500/10 to-emerald-500/5';
  if (rating === 'moderate') return 'from-amber-500/10 to-amber-500/5';
  return 'from-rose-500/10 to-rose-500/5';
};

const getZoneBadge = (rating) => {
  if (rating === 'safe') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
  if (rating === 'moderate') return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
  return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
};

const getScoreBg = (score) => {
  if (score >= 8) return 'from-emerald-500 to-emerald-600';
  if (score >= 5) return 'from-amber-500 to-amber-600';
  return 'from-rose-500 to-rose-600';
};

const createCustomIcon = (score, rating) =>
  new L.divIcon({
    html: `<div style="width: 36px; height: 36px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.9); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: white; background: ${getZoneColor(rating)}; box-shadow: 0 4px 20px ${getZoneColor(rating)}80, 0 0 0 4px ${getZoneColor(rating)}30">${score}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
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
    setAnalysis(null);
    try {
      const result = await analyzeRouteSafety(origin, destination, timeOfDay);
      setAnalysis(result);
      toast.success('Route analyzed');
    } catch {
      toast.error('Analysis failed');
    }
    setLoading(false);
  };

  const safeCount = dynamicZones.filter(z => z.rating === 'safe').length;
  const totalUsers = dynamicZones.reduce((sum, z) => sum + z.users, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0d0b1a] to-[#0a0a12] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
      </button>

      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] p-7 md:p-9 mb-6 border border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-500/8 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-teal-400/20 backdrop-blur-md flex items-center justify-center text-cyan-300 flex-shrink-0 border border-cyan-400/20 shadow-lg shadow-cyan-500/10">
            <MapIcon size={30} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 tracking-tight">Safety Map</h1>
            <p className="text-cyan-200/70 text-sm md:text-base font-medium leading-relaxed">Predictive safety zones & live community insights.</p>
          </div>
        </div>
        {/* Quick stats strip */}
        <div className="flex gap-4 mt-5 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span className="text-xs font-semibold text-white/70">{safeCount} Safe Zones</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
            <Users size={13} className="text-cyan-400" />
            <span className="text-xs font-semibold text-white/70">{totalUsers} Active Users</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
            <Eye size={13} className="text-amber-400" />
            <span className="text-xs font-semibold text-white/70">Live Data</span>
          </div>
        </div>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="h-[420px] rounded-2xl overflow-hidden mb-6 shadow-2xl shadow-black/40 border border-white/[0.06] relative z-0"
      >
        <MapContainer center={[centerLat, centerLng]} zoom={11} className="w-full h-full" zoomControl={false}>
          <MapUpdater center={[centerLat, centerLng]} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap"
          />
          {dynamicZones.map((zone) => (
            <div key={zone.name}>
              <Circle center={[zone.lat, zone.lng]} radius={1500} pathOptions={{ color: getZoneColor(zone.rating), fillColor: getZoneColor(zone.rating), fillOpacity: 0.12, weight: 1.5, opacity: 0.6 }} />
              <Marker position={[zone.lat, zone.lng]} icon={createCustomIcon(zone.score, zone.rating)}>
                <Popup>
                  <div className="p-2 text-center">
                    <p className="font-bold text-sm mb-0.5">{zone.name}</p>
                    <p className="text-xs text-gray-500">{zone.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{zone.users} active users</p>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-xl rounded-xl p-3 shadow-xl border border-white/[0.08] z-[1000] space-y-2">
          <LegendItem color="bg-emerald-500" label="Safe (8+)" />
          <LegendItem color="bg-amber-500" label="Moderate (5-7)" />
          <LegendItem color="bg-rose-500" label="Caution (<5)" />
        </div>
      </motion.div>

      {/* AI Route Analyzer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06] shadow-xl mb-8">
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Zap size={16} className="text-amber-400" />
          </div>
          AI Safety Navigator
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2 block ml-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
                <input
                  value={origin} onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. My home"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2 block ml-1">To</label>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                <input
                  value={destination} onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Metro station"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <TimeButton icon={Sunrise} label="Morning" active={timeOfDay === 'morning'} onClick={() => setTimeOfDay('morning')} />
            <TimeButton icon={Sun} label="Day" active={timeOfDay === 'day'} onClick={() => setTimeOfDay('day')} />
            <TimeButton icon={Sunset} label="Evening" active={timeOfDay === 'evening'} onClick={() => setTimeOfDay('evening')} />
            <TimeButton icon={Moon} label="Night" active={timeOfDay === 'night'} onClick={() => setTimeOfDay('night')} />
          </div>

          <button
            onClick={handleAnalyze} disabled={loading}
            className="w-full py-4 mt-1 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:transform-none"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
            {loading ? 'Analyzing route…' : 'Calculate safe path'}
          </button>
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mt-5 pt-5 border-t border-white/[0.06] overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
                <div className="md:col-span-1 flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className={`text-4xl font-black bg-gradient-to-b ${getScoreBg(analysis.safetyScore)} bg-clip-text text-transparent mb-1`}>{analysis.safetyScore}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Safety Index</div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block border ${analysis.safetyScore >= 8 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : analysis.safetyScore >= 5 ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-rose-500/15 text-rose-400 border-rose-500/20'}`}>
                    {analysis.safetyScore >= 8 ? 'Optimal path' : analysis.safetyScore >= 5 ? 'Moderate caution' : 'Alternative recommended'}
                  </span>
                  <p className="text-sm text-white/70 leading-relaxed">{analysis.recommendation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.riskFactors?.length > 0 && (
                  <div className="bg-rose-500/5 rounded-xl p-4 border border-rose-500/10">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <AlertTriangle size={12} /> Attention areas
                    </h4>
                    <div className="space-y-1.5">
                      {analysis.riskFactors.map((r, i) => (
                        <div key={i} className="flex gap-2 text-sm text-white/60">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                          <p>{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.tips?.length > 0 && (
                  <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Shield size={12} /> Safety tips
                    </h4>
                    <div className="space-y-1.5">
                      {analysis.tips.map((t, i) => (
                        <div key={i} className="flex gap-2 text-sm text-white/60">
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

      {/* Top-Rated Zones */}
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
          <Star size={18} className="text-amber-400 fill-amber-400" /> Highest Rated Zones
        </h2>
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Real-time
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[...dynamicZones].sort((a, b) => b.score - a.score).slice(0, 4).map((zone, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-gradient-to-br ${getZoneGradient(zone.rating)} rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all flex items-center gap-4 group cursor-pointer`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg bg-gradient-to-br ${getScoreBg(zone.score)}`}>
              {zone.score}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white mb-0.5">{zone.name}</h4>
              <p className="text-xs text-white/40 mb-1.5 truncate">{zone.desc}</p>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="flex items-center gap-1"><Users size={11} /> {zone.users} active</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold border ${getZoneBadge(zone.rating)}`}>{zone.rating}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`} />
      <span className="text-[11px] font-medium text-white/70">{label}</span>
    </div>
  );
}

function TimeButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border text-sm font-medium ${
        active ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-sm shadow-cyan-500/10' : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:border-white/[0.12] hover:text-white/60'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
