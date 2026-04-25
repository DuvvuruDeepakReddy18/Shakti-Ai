import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio, Users, Shield, Share2, Clock, CheckCircle,
  Navigation, ArrowLeft, Star, Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const DEMO_VOLUNTEERS = [
  { id: 1, name: 'Priya S.', lat: 28.616, lng: 77.212, distance: '0.3 km', rating: 4.9, status: 'online', helped: 42 },
  { id: 2, name: 'Anjali M.', lat: 28.611, lng: 77.205, distance: '0.7 km', rating: 4.8, status: 'online', helped: 28 },
  { id: 3, name: 'Riya K.', lat: 28.618, lng: 77.201, distance: '1.1 km', rating: 5.0, status: 'online', helped: 65 },
  { id: 4, name: 'Neha V.', lat: 28.608, lng: 77.215, distance: '1.5 km', rating: 4.7, status: 'online', helped: 31 },
];

const createUserIcon = () => new L.divIcon({
  html: `<div style="width: 22px; height: 22px; border-radius: 50%; background: #3B82F6; border: 3px solid white; box-shadow: 0 4px 10px rgba(59,130,246,0.3)"></div>`,
  className: '', iconSize: [22, 22], iconAnchor: [11, 11],
});

const createVolunteerIcon = (name) => new L.divIcon({
  html: `<div style="width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #6d28d9, #db2777); border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 700; box-shadow: 0 4px 10px rgba(109,40,217,0.2)">${name.charAt(0)}</div>`,
  className: '', iconSize: [30, 30], iconAnchor: [15, 15],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export default function LiveTracking() {
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

  const [shieldActive, setShieldActive] = useState(false);
  const [destination, setDestination] = useState('');
  const [shieldTime, setShieldTime] = useState(0);
  const [watchers, setWatchers] = useState(0);

  useEffect(() => {
    if (!shieldActive) return;
    const timer = setInterval(() => setShieldTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [shieldActive]);

  const activateShield = () => {
    if (!destination) return toast.error('Enter your destination');
    setShieldActive(true); setShieldTime(0); setWatchers(4);
    toast.success('Crowd Shield activated — 4 volunteers watching your journey');
  };

  const deactivateShield = () => {
    setShieldActive(false); setWatchers(0);
    toast.success('You arrived safely');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

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
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(59,130,246,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(59,130,246,0.25)',
          }}>
            <Radio size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Live Tracking</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Virtual escort from verified volunteers.</p>
          </div>
        </div>
      </motion.div>

      {/* MAP */}
      <div style={{
        borderRadius: '1.5rem', overflow: 'hidden', position: 'relative', height: '280px', marginBottom: '24px',
        boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid var(--color-surface-low)', zIndex: 0
      }}>
        <MapContainer center={[centerLat, centerLng]} zoom={14} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <MapUpdater center={[centerLat, centerLng]} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={[centerLat, centerLng]} icon={createUserIcon()}>
            <Popup>You are here</Popup>
          </Marker>
          <Circle center={[centerLat, centerLng]} radius={800} pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.1, stroke: false }} />

          {DEMO_VOLUNTEERS.map((v) => (
            <Marker key={v.id} position={[v.lat, v.lng]} icon={createVolunteerIcon(v.name)}>
              <Popup>
                <div style={{ padding: '4px', textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{v.name}</p>
                  <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>{v.distance} away</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div style={{
          position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '6px',
          border: '1px solid rgba(59,130,246,0.1)', zIndex: 1000
        }}>
          <Activity size={14} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence mode="wait">
          {shieldActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              style={{
                background: 'var(--color-surface-lowest)', borderRadius: '1.5rem', padding: '24px',
                boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(59,130,246,0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative', display: 'flex', width: '10px', height: '10px' }}>
                    <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: '#60a5fa', opacity: 0.7 }} />
                    <span style={{ position: 'relative', width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shield active</span>
                </div>
                <div style={{
                  padding: '6px 12px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '8px',
                  fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                  border: '1px solid rgba(59,130,246,0.1)'
                }}>
                  <Clock size={13} /> {formatTime(shieldTime)}
                </div>
              </div>

              <div style={{
                background: 'rgba(59,130,246,0.06)', padding: '16px', borderRadius: '16px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(59,130,246,0.1)'
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                  <Navigation size={18} style={{ color: '#3b82f6' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>Destination</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{destination}</p>
                </div>
              </div>

              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>{watchers} volunteers watching</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {DEMO_VOLUNTEERS.slice(0, watchers).map((v) => (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'var(--color-surface-low)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{v.name.charAt(0)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', margin: 0 }}>{v.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-outline)', margin: '2px 0 0' }}>{v.distance} • Watching journey</p>
                    </div>
                    <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                  </div>
                ))}
              </div>

              <button
                onClick={deactivateShield}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-sans)', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(16,185,129,0.25)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
              >
                I've arrived safely <CheckCircle size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="request"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              style={{ background: 'var(--color-surface-lowest)', borderRadius: '1.5rem', padding: '24px', boxShadow: '0 1px 6px rgba(24,20,69,0.03)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Request virtual escort</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '2px 0 0' }}>Notify nearby volunteers of your route</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }}>Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you heading?"
                    style={{
                      width: '100%', padding: '14px 16px', background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)', borderRadius: '12px', color: 'var(--color-shakti-dark-text)', fontSize: '14px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s'
                    }}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid #3b82f6'; e.currentTarget.style.background = 'var(--color-surface-lowest)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(24,20,69,0.05)'; e.currentTarget.style.background = 'var(--color-surface-low)'; }}
                  />
                </div>
                <button
                  onClick={activateShield}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px', background: '#2563eb', color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-sans)', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
                >
                  <Radio size={16} /> Activate Crowd Shield
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ background: 'var(--color-surface-lowest)', borderRadius: '1.5rem', padding: '24px', boxShadow: '0 1px 6px rgba(24,20,69,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: '#10b981' }} /> Volunteers nearby
            </h3>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#047857', background: '#ecfdf5', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.2)' }}>Active now</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DEMO_VOLUNTEERS.map((v) => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'var(--color-surface-low)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-lowest)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface-low)'}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    {v.name.charAt(0)}
                  </div>
                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', background: '#10b981', border: '2px solid white', borderRadius: '50%' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', margin: 0 }}>{v.name}</p>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: 600, color: '#d97706' }}>
                      <Star size={11} fill="#F59E0B" style={{ color: '#f59e0b' }} /> {v.rating}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '2px 0 0' }}>{v.distance} away · <span style={{ color: '#7c3aed', fontWeight: 600 }}>{v.helped} journeys</span> guarded</p>
                </div>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', border: '1px solid rgba(24,20,69,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.color = '#7c3aed'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(24,20,69,0.05)'; }}>
                  <Share2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
