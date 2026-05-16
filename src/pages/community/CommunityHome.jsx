import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, MessageSquare, Heart, Shield,
  Plus, TrendingUp, X, Sparkles, ArrowUpRight,
  Calendar, Briefcase, UserPlus, Flame, ChevronRight, CheckCircle,
} from 'lucide-react';

const tools = [
  { to: '/community/forums', icon: MessageSquare, title: 'Forums', desc: 'Open discussions', color: 'var(--color-shakti-primary)', bg: 'var(--color-shakti-primary-container)' },
  { to: '/community/circle', icon: UserPlus, title: 'Trusted Circle', desc: 'Your network', color: 'var(--color-shakti-tertiary)', bg: 'var(--color-shakti-tertiary-container)' },
  { to: '/community/events', icon: Calendar, title: 'Events', desc: 'Meetups & workshops', color: 'var(--color-shakti-info)', bg: 'var(--color-shakti-info-container)' },
  { to: '/community/skills', icon: Briefcase, title: 'Skill Exchange', desc: 'Trade expertise', color: 'var(--color-shakti-success)', bg: 'var(--color-shakti-success-container)' },
  { to: '/community/volunteers', icon: Users, title: 'Volunteers', desc: 'Help nearby', color: 'var(--color-shakti-warning)', bg: 'var(--color-shakti-warning-container)' },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'safety', label: 'Safety', icon: Shield, color: 'var(--color-shakti-error)' },
  { id: 'health', label: 'Mental Health', icon: Heart, color: 'var(--color-shakti-tertiary)' },
  { id: 'career', label: 'Career', icon: TrendingUp, color: 'var(--color-shakti-warning)' },
];

const posts = [
  { id: 1, author: 'Anonymous_Priya', avatar: 'linear-gradient(135deg, var(--color-shakti-primary), var(--color-shakti-tertiary))', time: '2h ago', category: 'health', title: 'Managing burnout as a working mom', content: "Lately I've been feeling completely overwhelmed juggling my new role and taking care of my 3yo. How do you all manage?", likes: 45, comments: 12, tags: ['Burnout', 'Motherhood'], hot: false },
  { id: 2, author: 'CodeQueen99', avatar: 'linear-gradient(135deg, var(--color-shakti-info), var(--color-shakti-primary))', time: '5h ago', category: 'career', title: 'Negotiating salary for my first dev job', content: 'I just got an offer for a junior frontend role in Bangalore! They offered 8LPA, but the market average seems to be 10LPA. Should I negotiate?', likes: 128, comments: 34, tags: ['Salary', 'Tech'], hot: true },
  { id: 3, author: 'SafeTravels', avatar: 'linear-gradient(135deg, var(--color-shakti-success), var(--color-shakti-secondary))', time: '1d ago', category: 'safety', title: 'Safe routes in Marathahalli?', content: 'Moving to Bangalore next week. Does anyone know which areas around Marathahalli are safest for late-night walks?', likes: 89, comments: 22, tags: ['Bangalore', 'Relocation'], hot: false },
];

export default function CommunityHome() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState([]);

  const filteredPosts = posts.filter((post) => {
    if (activeTab !== 'all' && post.category !== activeTab) return false;
    if (search && !post.title.toLowerCase().includes(search.toLowerCase()) && !post.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleLike = (id) => setLiked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div>
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
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'var(--color-shakti-success-container)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-30px', width: '160px', height: '160px', background: 'var(--color-shakti-success-container)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--color-shakti-success), var(--color-shakti-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px color-mix(in srgb, var(--color-shakti-success) 25%, transparent)',
              }}>
                <Users size={24} color="var(--color-shakti-success-on)" strokeWidth={2.2} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>SHAKTI Circles</h1>
                <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Safe, anonymous space to connect & share.</p>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline-variant)' }} />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search discussions…"
                style={{
                  width: '100%', paddingLeft: '40px', paddingRight: search ? '36px' : '14px',
                  paddingTop: '10px', paddingBottom: '10px',
                  background: 'var(--color-surface-low)', border: '1px solid var(--color-surface-container)',
                  borderRadius: '12px', fontSize: '13px', color: 'var(--color-shakti-dark-text)',
                  outline: 'none', fontFamily: 'var(--font-sans)',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <Link to="/community/forums" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--color-shakti-success), var(--color-shakti-secondary))',
              color: 'var(--color-shakti-success-on)', textDecoration: 'none', fontSize: '13px', fontWeight: 700,
              fontFamily: 'var(--font-sans)',
            }}>
              <Plus size={16} /> New
            </Link>
          </div>
        </div>
      </motion.div>

      {/* TOOLS GRID */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', margin: '0 0 12px 4px' }}>Connect</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
          {tools.map((t, i) => {
            const Icon = t.icon;
            return (
              <Link key={t.to} to={t.to} style={{ textDecoration: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -2 }}
                  style={{
                    background: 'var(--color-surface-lowest)',
                    borderRadius: '1rem', overflow: 'hidden',
                    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
                    transition: 'box-shadow 0.3s', height: '100%',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 24px rgba(24,20,69,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'}
                >
                  <div style={{ height: '2px', background: t.color, opacity: 0, transition: 'opacity 0.2s' }} />
                  <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} style={{ color: t.color }} strokeWidth={2.2} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.3 }}>{t.title}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '2px 0 0' }}>{t.desc}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--color-outline-variant)', flexShrink: 0 }} />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CATEGORY CHIPS */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id} onClick={() => setActiveTab(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '999px',
                fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap',
                border: isActive ? 'none' : '1px solid var(--color-surface-container)',
                background: isActive ? 'linear-gradient(135deg, var(--color-shakti-success), var(--color-shakti-secondary))' : 'var(--color-surface-lowest)',
                color: isActive ? 'var(--color-shakti-success-on)' : 'var(--color-shakti-dark-muted)',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 12px color-mix(in srgb, var(--color-shakti-success) 20%, transparent)' : 'none',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {Icon && <Icon size={13} style={{ color: isActive ? 'var(--color-shakti-success-on)' : cat.color }} />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* SAFETY NOTE */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 16px', borderRadius: '1rem', marginBottom: '16px',
        background: 'var(--color-surface-lowest)',
        boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--color-shakti-primary), var(--color-shakti-tertiary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: '0 4px 12px color-mix(in srgb, var(--color-shakti-primary) 20%, transparent)',
        }}>
          <Shield size={18} color="var(--color-shakti-primary-on)" />
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.5, margin: 0 }}>
          Safe, anonymous space. Harassment results in an instant ban. Let's keep our circle supportive.
        </p>
      </div>

      {/* POSTS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        <AnimatePresence mode="popLayout">
          {filteredPosts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '48px 0', background: 'var(--color-surface-lowest)', borderRadius: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'var(--color-surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--color-outline)' }}>
                <MessageSquare size={20} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-outline)' }}>No discussions found in this circle.</p>
            </motion.div>
          ) : (
            filteredPosts.map((post, i) => (
              <motion.div
                key={post.id} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                style={{
                  background: 'var(--color-surface-lowest)',
                  borderRadius: '1rem', padding: '18px',
                  boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
                  transition: 'box-shadow 0.3s', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 24px rgba(24,20,69,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'}
              >
                {post.hot && (
                  <div style={{
                    position: 'absolute', top: 0, right: '20px',
                    padding: '2px 8px', borderRadius: '0 0 6px 6px',
                    background: 'linear-gradient(135deg, var(--color-shakti-warning), var(--color-shakti-error))',
                    color: 'white', fontSize: '10px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Flame size={10} fill="white" /> Hot
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: post.avatar,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0,
                    }}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>{post.author}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-outline)', margin: '1px 0 0' }}>{post.time}</p>
                    </div>
                  </div>
                  <span style={{ padding: '4px 8px', background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>{post.category}</span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '0 0 8px', lineHeight: 1.4, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ flex: 1 }}>{post.title}</span>
                  <ArrowUpRight size={16} style={{ color: 'var(--color-outline-variant)', flexShrink: 0, marginTop: '2px' }} />
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-outline)', lineHeight: 1.6, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-surface-container)' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer',
                        color: liked.includes(post.id) ? 'var(--color-shakti-tertiary)' : 'var(--color-outline)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      <Heart size={14} fill={liked.includes(post.id) ? 'currentColor' : 'none'} />
                      {post.likes + (liked.includes(post.id) ? 1 : 0)}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', fontFamily: 'var(--font-sans)' }}>
                      <MessageSquare size={14} /> {post.comments}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {post.tags.map((tag, j) => (
                      <span key={j} style={{ padding: '2px 8px', background: 'var(--color-surface-low)', fontSize: '11px', color: 'var(--color-shakti-dark-muted)', borderRadius: '6px', fontWeight: 600 }}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* INSIGHT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{
          background: 'var(--color-surface-lowest)',
          borderRadius: '1.25rem', padding: '20px',
          boxShadow: '0 1px 8px rgba(24,20,69,0.03)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'var(--color-shakti-success-container)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--color-shakti-success), var(--color-shakti-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px color-mix(in srgb, var(--color-shakti-success) 20%, transparent)',
          }}>
            <Sparkles size={18} color="var(--color-shakti-success-on)" />
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.6, margin: 0, position: 'relative', zIndex: 10 }}>
            The <span style={{ color: 'var(--color-shakti-success)', fontWeight: 700 }}>Career</span> circle is very active this week — many are discussing salary negotiation in tech.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
