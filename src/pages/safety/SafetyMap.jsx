import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Star, AlertTriangle, Shield,
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

const getRatingMeta = (rating) => {
  if (rating === 'safe') return { bg: '#ecfdf5', text: '#047857', border: 'rgba(16,185,129,0.2)' };
  if (rating === 'moderate') return { bg: '#fffbeb', text: '#b45309', border: 'rgba(245,158,11,0.25)' };
  return { bg: '#fef2f2', text: '#b91c1c', border: 'rgba(239,68,68,0.25)' };
};

const createZoneIcon = (score, rating) =>
  new L.divIcon({
    html: `<div style="width: 38px; height: 38px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: white; background: ${getZoneColor(rating)}; box-shadow: 0 4px 14px ${getZoneColor(rating)}55">${score}</div>`,
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
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

  const cardStyle = {
    background: 'var(--color-surface-lowest)',
    borderRadius: '1.5rem',
    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: 'var(--color-outline)', background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '16px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative', borderRadius: '1.5rem', padding: '28px 24px',
          marginBottom: '20px', overflow: 'hidden',
          background: 'var(--color-surface-lowest)',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(16,185,129,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(16,185,129,0.25)',
          }}>
            <MapIcon size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Safety Map</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Predictive safety zones & live community insights.</p>
          </div>
        </div>

        {/* Stat chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '18px', position: 'relative', zIndex: 10 }}>
          <Chip icon={<ShieldCheck size={13} style={{ color: '#10b981' }} />} text={`${safeCount} Safe Zones`} />
          <Chip icon={<Users size={13} style={{ color: '#3b82f6' }} />} text={`${totalUsers} Active Users`} />
          <Chip icon={<Eye size={13} style={{ color: '#f59e0b' }} />} text="Live Data" />
        </div>
      </motion.div>

      {/* MAP */}
      <div style={{
        borderRadius: '1.5rem', overflow: 'hidden', position: 'relative', height: '360px', marginBottom: '24px',
        boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid var(--color-surface-low)', zIndex: 0
      }}>
        <MapContainer center={[centerLat, centerLng]} zoom={12} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <MapUpdater center={[centerLat, centerLng]} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {dynamicZones.map((zone) => (
            <div key={zone.name}>
              <Circle center={[zone.lat, zone.lng]} radius={1200} pathOptions={{ color: getZoneColor(zone.rating), fillColor: getZoneColor(zone.rating), fillOpacity: 0.12, weight: 1.2, opacity: 0.5 }} />
              <Marker position={[zone.lat, zone.lng]} icon={createZoneIcon(zone.score, zone.rating)}>
                <Popup>
                  <div style={{ padding: '4px', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{zone.name}</p>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>{zone.desc}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>{zone.users} active users</p>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>

        {/* Legend */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)', padding: '10px 12px', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid rgba(24,20,69,0.06)',
          zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '6px'
        }}>
          <LegendItem color="#10B981" label="Safe (8+)" />
          <LegendItem color="#F59E0B" label="Moderate (5-7)" />
          <LegendItem color="#EF4444" label="Caution (<5)" />
        </div>

        {/* Live chip */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '6px',
          border: '1px solid rgba(16,185,129,0.18)', zIndex: 1000
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 4px rgba(16,185,129,0.15)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#047857' }}>Live</span>
        </div>
      </div>

      {/* AI Route Navigator */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ ...cardStyle, padding: '24px', marginBottom: '20px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(249,115,22,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} style={{ color: '#d97706' }} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>AI Safety Navigator</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
          <Field
            label="From"
            icon={<MapPin size={15} style={{ color: '#10b981' }} />}
            value={origin}
            onChange={setOrigin}
            placeholder="e.g. My home"
          />
          <Field
            label="To"
            icon={<Navigation size={15} style={{ color: '#6366f1' }} />}
            value={destination}
            onChange={setDestination}
            placeholder="e.g. Metro station"
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <TimeButton icon={Sunrise} label="Morning" active={timeOfDay === 'morning'} onClick={() => setTimeOfDay('morning')} />
          <TimeButton icon={Sun} label="Day" active={timeOfDay === 'day'} onClick={() => setTimeOfDay('day')} />
          <TimeButton icon={Sunset} label="Evening" active={timeOfDay === 'evening'} onClick={() => setTimeOfDay('evening')} />
          <TimeButton icon={Moon} label="Night" active={timeOfDay === 'night'} onClick={() => setTimeOfDay('night')} />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #06b6d4)',
            color: 'white', border: 'none', fontSize: '14px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(37,99,235,0.22)'
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {loading ? 'Analyzing route…' : 'Calculate safe path'}
        </button>

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-surface-low)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: analysis.safetyScore >= 8 ? 'linear-gradient(135deg, #10b981, #059669)' : analysis.safetyScore >= 5 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    fontSize: '24px', fontWeight: 800, flexShrink: 0,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                  }}>
                    {analysis.safetyScore}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Safety Index</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.5 }}>{analysis.recommendation}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {analysis.riskFactors?.length > 0 && (
                    <ListBox
                      icon={<AlertTriangle size={12} />}
                      title="Attention areas"
                      items={analysis.riskFactors}
                      tone="risk"
                    />
                  )}
                  {analysis.tips?.length > 0 && (
                    <ListBox
                      icon={<Shield size={12} />}
                      title="Safety tips"
                      items={analysis.tips}
                      tone="tip"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Highest Rated Zones */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={16} fill="#f59e0b" style={{ color: '#f59e0b' }} /> Highest Rated Zones
        </h2>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Real-time
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
        {[...dynamicZones].sort((a, b) => b.score - a.score).slice(0, 4).map((zone, i) => {
          const meta = getRatingMeta(zone.rating);
          return (
            <motion.div
              key={zone.name}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              style={{
                ...cardStyle, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(24,20,69,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'; }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: `linear-gradient(135deg, ${getZoneColor(zone.rating)}, ${getZoneColor(zone.rating)}dd)`,
                color: 'white', fontSize: '18px', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: `0 4px 12px ${getZoneColor(zone.rating)}33`
              }}>
                {zone.score}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '0 0 2px' }}>{zone.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{zone.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-outline)' }}>
                    <Users size={11} /> {zone.users} active
                  </span>
                  <span style={{
                    padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    background: meta.bg, color: meta.text, border: `1px solid ${meta.border}`
                  }}>
                    {zone.rating}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-outline)', flexShrink: 0 }} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ icon, text }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '6px 10px', borderRadius: '999px',
      background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)',
    }}>
      {icon}
      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-shakti-dark-text)' }}>{text}</span>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: `0 0 0 3px ${color}25` }} />
      <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>{label}</span>
    </div>
  );
}

function Field({ label, icon, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', padding: '12px 14px 12px 38px',
            background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)',
            borderRadius: '12px', fontSize: '14px', color: 'var(--color-shakti-dark-text)',
            boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s',
            fontFamily: 'var(--font-sans)'
          }}
          onFocus={(e) => { e.currentTarget.style.border = '1px solid #06b6d4'; e.currentTarget.style.background = 'var(--color-surface-lowest)'; }}
          onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(24,20,69,0.05)'; e.currentTarget.style.background = 'var(--color-surface-low)'; }}
        />
      </div>
    </div>
  );
}

function TimeButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: active ? 'rgba(6,182,212,0.1)' : 'var(--color-surface-low)',
        color: active ? '#0e7490' : 'var(--color-outline)',
        border: `1px solid ${active ? 'rgba(6,182,212,0.3)' : 'rgba(24,20,69,0.05)'}`,
        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        transition: 'all 0.15s ease', fontFamily: 'var(--font-sans)'
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function ListBox({ icon, title, items, tone }) {
  const bg = tone === 'risk' ? '#fef2f2' : '#ecfdf5';
  const text = tone === 'risk' ? '#b91c1c' : '#047857';
  const dot = tone === 'risk' ? '#ef4444' : '#10b981';
  const border = tone === 'risk' ? 'rgba(239,68,68,0.18)' : 'rgba(16,185,129,0.18)';
  return (
    <div style={{ background: bg, borderRadius: '14px', padding: '14px', border: `1px solid ${border}` }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: text, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
        {icon} {title}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot, marginTop: '7px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.5 }}>{it}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
