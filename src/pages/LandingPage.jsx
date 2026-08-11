import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Award, CheckCircle2, ExternalLink, Lock, Database, 
  AlertCircle, ChevronDown, Moon, Sun, Briefcase, Calendar, Play, Pause, 
  Volume2, Terminal, Check, X, Search, Sliders, MapPin, Building2, 
  GraduationCap, Clock, User, Sparkles, ArrowRight, FileText, Video, Eye
} from 'lucide-react';

// Custom inline SVG icons for the 3D Bubbles to match the image mockup exactly
const GithubIconBubble = (props) => (
  <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ReactIconBubble = (props) => (
  <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
    <path d="M12 6v12M6 12h12" opacity="0.2" />
  </svg>
);

const PythonIconBubble = (props) => (
  <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm-1 2.05v2.83c0 .62-.38 1.12-1 1.12H7.5A1.5 1.5 0 0 0 6 9.5V11h5v1H6v1.5a1.5 1.5 0 0 0 1.5 1.5H9c.62 0 1 .5 1 1.12v2.83c-2.33-.42-4.14-2.28-4.5-4.65h1.55c.62 0 1-.5 1-1.12v-1.5h5v-1h-5V9.5c0-.62.38-1.12 1-1.12H15c.62 0 1-.5 1-1.12V4.4c1.88.66 3.2 2.37 3.5 4.45h-1.55c-.62 0-1 .5-1 1.12v1.5h-5v1h5v1.5c0 .62-.38 1.12-1 1.12H13c-.62 0-1 .5-1 1.12v2.83" />
  </svg>
);

const CloudUploadBubble = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const DocumentCheckBubble = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);

// Mock candidates for the Recruiter Sandbox
const mockCandidates = [
  {
    id: 1,
    name: 'Arjun Sharma',
    college: 'NIT Trichy',
    tier: 'Tier 1 (IIT/NIT/IIM)',
    avatar: 'AS',
    skills: ['React', 'Node.js', 'Python'],
    highestLayer: 4,
    cgpa: '9.42 CGPA',
    project: 'Go API Gateway',
    interviewScore: '8.8/10',
    status: 'Open to Hire',
  },
  {
    id: 2,
    name: 'Neha Gupta',
    college: 'IIT Bombay',
    tier: 'Tier 1 (IIT/NIT/IIM)',
    avatar: 'NG',
    skills: ['Python', 'ML / AI', 'React'],
    highestLayer: 3,
    cgpa: '8.95 CGPA',
    project: 'Neural Net Visualizer',
    interviewScore: 'Not Interviewed',
    status: 'Interviewing',
  },
  {
    id: 3,
    name: 'Sarah Khan',
    college: 'VIT Vellore',
    tier: 'Tier 2/3 (Other)',
    avatar: 'SK',
    skills: ['React', 'Go', 'Docker'],
    highestLayer: 3,
    cgpa: '9.10 CGPA',
    project: 'Microservices Broker',
    interviewScore: 'Not Interviewed',
    status: 'Open to Hire',
  },
  {
    id: 4,
    name: 'Rohan Das',
    college: 'Delhi University',
    tier: 'Tier 2/3 (Other)',
    avatar: 'RD',
    skills: ['React', 'CSS v4', 'Tailwind'],
    highestLayer: 2,
    cgpa: '7.80 CGPA',
    project: 'Unverified Projects',
    interviewScore: 'Not Interviewed',
    status: 'Not Looking',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    college: 'State College of Eng',
    tier: 'Tier 2/3 (Other)',
    avatar: 'VS',
    skills: ['Python', 'Django'],
    highestLayer: 1,
    cgpa: '8.20 CGPA',
    project: 'No projects imported',
    interviewScore: 'Not Interviewed',
    status: 'Open to Hire',
  }
];

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false); // Defaulting to light/cream theme to match the mockup
  const [activeLayer, setActiveLayer] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  // Recruiter Sandbox States
  const [filterLayer, setFilterLayer] = useState(1);
  const [filterSkill, setFilterSkill] = useState('All');
  const [filterCollege, setFilterCollege] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredCandidates = mockCandidates.filter(cand => {
    const matchesLayer = cand.highestLayer >= filterLayer;
    const matchesSkill = filterSkill === 'All' || cand.skills.includes(filterSkill);
    const matchesCollege = filterCollege === 'All' || cand.tier === filterCollege;
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cand.college.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLayer && matchesSkill && matchesCollege && matchesSearch;
  });

  return (
    <div 
      className="transition-colors duration-500 relative overflow-hidden flex flex-col" 
      style={{ 
        minHeight: '100vh', 
        fontFamily: 'var(--font-sans)',
        // Applied the exact mockup gradient colors
        background: isDark 
          ? 'linear-gradient(135deg, #0C0E1B 0%, #121526 50%, #080A12 100%)' 
          : 'linear-gradient(135deg, #FAF7F2 0%, #FFFDFB 50%, #F5EFEB 100%)',
        color: isDark ? '#E2E8F0' : '#191E3B'
      }}
    >
      
      {/* 3D Bubble & Glass Orbit Styles Injection */}
      <style>{`
        /* SPECULAR Specular highlights for 3D liquid bubbles */
        .glass-orb-base {
          border-radius: 50%;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease;
        }

        .glass-orb-light {
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.25) 30%, rgba(218, 190, 255, 0.2) 65%, rgba(255, 185, 205, 0.3) 90%, rgba(255, 255, 255, 0) 100%);
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow: 
            inset -6px -6px 20px rgba(255, 182, 193, 0.3), 
            inset 6px 6px 20px rgba(255, 255, 255, 0.8), 
            0 12px 36px rgba(90, 80, 100, 0.05);
        }

        .glass-orb-dark {
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 35%, rgba(139, 92, 246, 0.15) 70%, rgba(244, 63, 94, 0.15) 95%, rgba(255, 255, 255, 0) 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            inset -6px -6px 20px rgba(244, 63, 94, 0.15), 
            inset 6px 6px 20px rgba(255, 255, 255, 0.2), 
            0 12px 36px rgba(0, 0, 0, 0.4);
        }

        /* 3D Orbit path drawing */
        .orbit-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orbit-ring {
          position: absolute;
          width: 500px;
          height: 250px;
          border: 1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(92, 83, 70, 0.15)'};
          border-radius: 50%;
          transform: rotateX(55deg) rotateY(-10deg);
          pointer-events: none;
          z-index: 1;
        }

        /* Floating animations for the liquid orbs */
        @keyframes float-central {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }

        @keyframes float-bubble {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }

        .anim-central {
          animation: float-central 6s ease-in-out infinite;
        }

        .anim-bubble {
          animation: float-bubble 5s ease-in-out infinite;
        }
      `}</style>

      {/* Dynamic Background Auras (Holographic/Pastel glows) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-5%] left-[-5%] w-[60%] h-[70%] rounded-full blur-[140px] opacity-35 transition-all duration-700 ${isDark ? 'bg-indigo-950/20' : 'bg-orange-100/50'}`} style={{ mixBlendMode: 'multiply' }} />
        <div className={`absolute bottom-[-5%] right-[-5%] w-[60%] h-[70%] rounded-full blur-[140px] opacity-35 transition-all duration-700 ${isDark ? 'bg-purple-950/20' : 'bg-pink-100/40'}`} style={{ mixBlendMode: 'multiply' }} />
        <div className={`absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full blur-[160px] opacity-25 transition-all duration-700 ${isDark ? 'bg-emerald-950/10' : 'bg-purple-100/50'}`} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-500 ${isDark ? 'border-slate-800/80 bg-slate-950/60' : 'border-[#EAE3D9]/60 bg-[#FAF7F2]/60'} px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all ${isDark ? 'bg-indigo-600 text-white' : 'bg-[#1E2240] text-white'}`}>
              <Shield size={19} />
            </div>
            <div>
              <span className={`font-extrabold text-lg tracking-tight ${isDark ? 'text-white' : 'text-[#191E3B]'}`}>
                SkillVerify
              </span>
              <span className={`text-[9px] font-bold tracking-widest uppercase block mt-[-3px] ${isDark ? 'text-indigo-400' : 'text-[#7E766A]'}`}>
                proof-of-skill
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider">
            <a href="#how-it-works" className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-[#5C5346] hover:text-[#191E3B]'}`}>How It Works</a>
            <a href="#portfolio-sandbox" className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-[#5C5346] hover:text-[#191E3B]'}`}>Demo Profile</a>
            <a href="#recruiter-sandbox" className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-[#5C5346] hover:text-[#191E3B]'}`}>Recruiter Panel</a>
            <a href="#institutions" className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-[#5C5346] hover:text-[#191E3B]'}`}>Colleges</a>
            <a href="#faq" className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-[#5C5346] hover:text-[#191E3B]'}`}>FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className={`p-2 rounded-xl border transition-all ${isDark ? 'border-slate-800 bg-slate-900 text-yellow-400 hover:bg-slate-800' : 'border-[#E5DEC3]/80 bg-[#FAF7F2] text-[#5C5346] hover:bg-[#F2ECE2]'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link 
              to="/login" 
              className={`hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${isDark ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-[#EAE3D9] bg-[#FAF7F2] text-[#5C5346] hover:bg-[#F2ECE2]'}`}
            >
              Recruiter Log In
            </Link>
            <Link 
              to="/register" 
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 ${isDark ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10' : 'bg-[#1E2240] hover:bg-[#2C3159] shadow-slate-900/10'}`}
            >
              Claim a profile
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-1 space-y-36">
        
        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-12 gap-12 items-center min-h-[580px] py-6">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-900/40 text-slate-400' : 'border-[#E5DEC3] bg-[#FAF7F2]/60 text-[#5C5346]'}`}>
                <Sparkles size={12} className={isDark ? 'text-indigo-400' : 'text-[#7E766A]'} />
                Layered Evidence-Based Skill Portfolios
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-display">
                  <span className={`block font-medium ${isDark ? 'text-slate-400' : 'text-[#5C5346]'}`}>
                    Resumes are claims.
                  </span>
                  <span className={`${isDark ? 'text-white' : 'text-[#191E3B]'} block mt-1`}>
                    SkillVerify is proof.
                  </span>
                </h1>
              </div>

              <p className={`text-base font-medium leading-relaxed max-w-lg ${isDark ? 'text-slate-400' : 'text-[#5C5346]'}`}>
                A digital skill portfolio for Indian college students where every claim is backed by evidence, not self-rating. Recruiters filter on real instead of stated.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-wrap gap-4"
            >
              <Link 
                to="/register" 
                className={`px-8 py-4 rounded-full text-sm font-bold shadow-lg transition-all hover:-translate-y-1 inline-flex items-center gap-2 text-white ${isDark ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10' : 'bg-[#1E2240] hover:bg-[#2B3058] shadow-slate-950/15'}`}
              >
                Claim a profile
              </Link>
              <a 
                href="#recruiter-sandbox" 
                className={`px-8 py-4 rounded-full text-sm font-bold border transition-all hover:-translate-y-1 inline-flex items-center gap-2 ${isDark ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-100' : 'border-[#E5DEC3] bg-[#FAF7F2]/60 hover:bg-[#F2ECE2] text-[#5C5346]'}`}
              >
                <Sliders size={15} /> Sandbox Roster Filter
              </a>
            </motion.div>
            
            {/* Seeded metrics banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-6 pt-6 text-[#7E766A]"
            >
              <div>
                <span className={`text-xl font-extrabold block ${isDark ? 'text-white' : 'text-[#191E3B]'}`}>255+</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">Indian Colleges</span>
              </div>
              <div className="w-[1px] h-8 bg-[#EAE3D9]" />
              <div>
                <span className={`text-xl font-extrabold block ${isDark ? 'text-white' : 'text-[#191E3B]'}`}>170+</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">Arena challenges</span>
              </div>
              <div className="w-[1px] h-8 bg-[#EAE3D9]" />
              <div>
                <span className={`text-xl font-extrabold block ${isDark ? 'text-white' : 'text-[#191E3B]'}`}>L1 - L4</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">Evidence tiers</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Visuals (Iridescent Trust Orbs Orbit Simulation) */}
          <div className="lg:col-span-6 flex justify-center items-center h-[520px] relative pointer-events-auto">
            
            <div className="orbit-container">
              
              {/* Outer Orbit Loop Line */}
              <div className="orbit-ring" />

              {/* Central Large 3D Glass Trust Orb */}
              <div className={`w-[260px] h-[260px] glass-orb-base anim-central flex flex-col items-center justify-center relative z-10 ${isDark ? 'glass-orb-dark' : 'glass-orb-light'}`}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-indigo-400/5 pointer-events-none" />
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-900/60 text-indigo-400' : 'bg-white/60 text-[#191E3B]'} shadow-sm border border-white/40`}>
                  <Shield size={38} className="stroke-[1.5]" />
                </div>
                <div className="mt-4 text-center">
                  <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-[#191E3B]'}`}>verified trust</span>
                  <span className="text-[9px] block text-[#7E766A] font-bold mt-0.5">PROOF-BASED TIER</span>
                </div>
              </div>

              {/* Orbiting Bubble 1: Graduation Cap (L1 Academic) */}
              <div 
                className="absolute w-[68px] h-[68px] glass-orb-base anim-bubble flex items-center justify-center z-20"
                style={{ 
                  animationDelay: '-0.8s',
                  top: '12%',
                  right: '15%',
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.45)'
                }}
                title="L1 Academic - verified marksheets"
              >
                <div className={`glass-orb-base w-full h-full flex items-center justify-center ${isDark ? 'glass-orb-dark' : 'glass-orb-light'}`}>
                  <GraduationCap size={24} className={isDark ? 'text-indigo-400' : 'text-[#5C5346]'} />
                </div>
              </div>

              {/* Orbiting Bubble 2: Cloud Upload (L2 Certified) */}
              <div 
                className="absolute w-[68px] h-[68px] glass-orb-base anim-bubble flex items-center justify-center z-20"
                style={{ 
                  animationDelay: '-1.6s',
                  top: '32%',
                  right: '3%',
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.45)'
                }}
                title="L2 Certified - issuer API links"
              >
                <div className={`glass-orb-base w-full h-full flex items-center justify-center ${isDark ? 'glass-orb-dark' : 'glass-orb-light'}`}>
                  <CloudUploadBubble className={isDark ? 'text-indigo-400' : 'text-[#5C5346]'} />
                </div>
              </div>

              {/* Orbiting Bubble 3: Document Badge Check (L3 Credentials) */}
              <div 
                className="absolute w-[68px] h-[68px] glass-orb-base anim-bubble flex items-center justify-center z-20"
                style={{ 
                  animationDelay: '-2.4s',
                  bottom: '22%',
                  right: '10%',
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.45)'
                }}
                title="L3 Credentials verified"
              >
                <div className={`glass-orb-base w-full h-full flex items-center justify-center ${isDark ? 'glass-orb-dark' : 'glass-orb-light'}`}>
                  <DocumentCheckBubble className={isDark ? 'text-indigo-400' : 'text-[#5C5346]'} />
                </div>
              </div>

              {/* Orbiting Bubble 4: GitHub logo (L3 GitHub import) */}
              <div 
                className="absolute w-[68px] h-[68px] glass-orb-base anim-bubble flex items-center justify-center z-20"
                style={{ 
                  animationDelay: '-3.2s',
                  bottom: '8%',
                  left: '45%',
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.45)'
                }}
                title="L3 Proven - Shipped GitHub code"
              >
                <div className={`glass-orb-base w-full h-full flex items-center justify-center ${isDark ? 'glass-orb-dark' : 'glass-orb-light'}`}>
                  <GithubIconBubble className={isDark ? 'text-indigo-400' : 'text-[#5C5346]'} />
                </div>
              </div>

              {/* Orbiting Bubble 5: Python logo (Vetted Skill) */}
              <div 
                className="absolute w-[68px] h-[68px] glass-orb-base anim-bubble flex items-center justify-center z-20"
                style={{ 
                  animationDelay: '-4.0s',
                  bottom: '24%',
                  left: '8%',
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.45)'
                }}
                title="Python skill verified"
              >
                <div className={`glass-orb-base w-full h-full flex items-center justify-center ${isDark ? 'glass-orb-dark' : 'glass-orb-light'}`}>
                  <PythonIconBubble className={isDark ? 'text-indigo-400' : 'text-[#5C5346]'} />
                </div>
              </div>

              {/* Orbiting Bubble 6: React logo (Vetted Skill) */}
              <div 
                className="absolute w-[68px] h-[68px] glass-orb-base anim-bubble flex items-center justify-center z-20"
                style={{ 
                  animationDelay: '-4.8s',
                  top: '28%',
                  left: '12%',
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.45)'
                }}
                title="React framework verified"
              >
                <div className={`glass-orb-base w-full h-full flex items-center justify-center ${isDark ? 'glass-orb-dark' : 'glass-orb-light'}`}>
                  <ReactIconBubble className={isDark ? 'text-indigo-400' : 'text-[#5C5346]'} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION: PROBLEM VS SOLUTION */}
        <section className="space-y-8 max-w-6xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">
              Why SkillVerify?
            </h2>
            <p className={`text-sm font-bold max-w-lg mx-auto ${isDark ? 'text-slate-400' : 'text-[#7E766A]'}`}>
              The standard recruitment funnel is broken by inflated claims. SkillVerify rebuilds trust from raw evidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Flawed Resume */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
              isDark ? 'border-red-950/40 bg-red-950/5 text-slate-300' : 'border-[#F2D7D7] bg-[#FAF2F2]/60 text-[#5C5346]'
            }`}>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-extrabold uppercase bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full">
                    Stated Claims (The Legacy Resume)
                  </span>
                  <X size={16} className="text-red-500" />
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-[#191E3B]'}`}>Flawed & Unverifiable</h3>
                <ul className="space-y-4 text-xs font-bold leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Self-assessed stars on skills: "5/5 Stars in Python" (completely subjective).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Academic inflation: Marksheet screenshots are easily manipulated in Photoshop.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Copied certificates: PDF links with names replaced bypass fast checks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Padded internships: Non-existent startups providing experience letters for a fee.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-red-500/10 flex items-center gap-3">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                <p className="text-[11px] font-bold text-red-400">
                  Recruiters spend 80% of screening time identifying the real 5% of candidates.
                </p>
              </div>
            </div>

            {/* The SkillVerify Portfolio */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
              isDark ? 'border-indigo-950/40 bg-indigo-950/5 text-slate-300' : 'border-[#D9EAE1] bg-[#F2FAF6]/60 text-[#5C5346]'
            }`}>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full">
                    Evidence Layers (SkillVerify)
                  </span>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-[#191E3B]'}`}>100% Verifiable Evidence</h3>
                <ul className="space-y-4 text-xs font-bold leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>Actual code performance: Repositories read via GitHub OAuth with tests validated in our runtime.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>Tamper-proof marksheets: OCR scans cross-referenced with EXIF hashing and metadata signatures.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>Certificate validation: Domain verification and issuer whitelist mapping.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>1:1 technical vetting: Structured recordings of interviews with senior staff, paid securely.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-emerald-500/10 flex items-center gap-3">
                <Shield size={18} className="text-emerald-500 flex-shrink-0" />
                <p className="text-[11px] font-bold text-emerald-600">
                  Layered validation enables immediate shortlisting of pre-vetted students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTEGRATED PORTFOLIO SHOWCASE: UNIFIED DASHBOARD CARD */}
        <section id="portfolio-sandbox" className="space-y-8 max-w-6xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">
              The Verified Profile
            </h2>
            <p className={`text-sm font-bold max-w-lg mx-auto ${isDark ? 'text-slate-400' : 'text-[#7E766A]'}`}>
              Click on the verification badges (L1 to L4) in the student card below to inspect the evidence checked at each layer.
            </p>
          </div>

          {/* Unified Desktop App Console Panel */}
          <div className={`rounded-3xl border overflow-hidden shadow-lg grid md:grid-cols-12 items-stretch transition-all duration-300 ${
            isDark ? 'border-slate-800 bg-slate-900/20' : 'border-[#EAE3D9] bg-white/40'
          }`}>
            
            {/* Column 1: Left Dashboard Student Card Panel */}
            <div className={`md:col-span-5 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r transition-all duration-300 ${
              isDark ? 'border-slate-800 bg-slate-950/50' : 'border-[#EAE3D9] bg-[#FAF7F2]/80'
            }`}>
              
              <div>
                {/* Card Header */}
                <div className="flex gap-4 items-center mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm ${
                    isDark ? 'bg-indigo-600' : 'bg-[#1E2240]'
                  }`}>
                    AS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base truncate">Arjun Sharma</h4>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[8px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-400/20 uppercase">
                        Open to Hire
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-bold">
                      <GraduationCap size={12} className={isDark ? 'text-indigo-400' : 'text-[#7E766A]'} />
                      <span className="truncate">NIT Trichy • CSE Class of 2026</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2 mb-8">
                  <span className="text-[9px] font-extrabold uppercase text-[#7E766A] tracking-wider">Verified Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Python', 'Go'].map((skill, idx) => (
                      <span key={idx} className={`text-xs px-3 py-1 rounded-xl font-bold border ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#EAE3D9]'
                      }`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Badges (Interactive Buttons) */}
                <div className="space-y-3">
                  <span className="text-[9px] font-extrabold uppercase text-[#7E766A] tracking-wider block">Verification Layers</span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 1, name: 'L1 Academic Verification', val: '9.42 CGPA Verified', color: 'indigo' },
                      { id: 2, name: 'L2 Certified Verification', val: 'AWS Developer Certified', color: 'indigo' },
                      { id: 3, name: 'L3 Proven (Shipped Work)', val: 'Go API Gateway (12 Tests Passed)', color: 'purple' },
                      { id: 4, name: 'L4 Expert (Video Vetted)', val: '8.8/10 on React Fibers Vetting', color: 'emerald' }
                    ].map((layer) => {
                      const isActive = activeLayer === layer.id;
                      return (
                        <button
                          key={layer.id}
                          onClick={() => setActiveLayer(layer.id)}
                          className={`flex justify-between items-center p-3.5 rounded-xl border text-left transition-all duration-200 ${
                            isActive 
                              ? isDark 
                                ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30 translate-x-1' 
                                : 'border-[#1E2240] bg-[#1E2240]/5 ring-1 ring-[#1E2240]/25 translate-x-1'
                              : isDark ? 'border-slate-800 bg-slate-900/35 hover:bg-slate-900 text-slate-300' : 'border-[#EAE3D9] bg-white hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                              isActive 
                                ? isDark ? 'bg-indigo-600 text-white' : 'bg-[#1E2240] text-white'
                                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                            }`}>
                              L{layer.id}
                            </div>
                            <div>
                              <p className="text-xs font-extrabold">{layer.name}</p>
                              <p className={`text-[10px] font-bold ${isActive ? isDark ? 'text-indigo-400' : 'text-[#1E2240]' : 'text-slate-400'}`}>{layer.val}</p>
                            </div>
                          </div>
                          <CheckCircle2 size={15} className={isActive ? isDark ? 'text-indigo-400' : 'text-[#1E2240]' : 'text-slate-400'} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Footer inside card */}
              <div className="mt-8 pt-4 border-t border-[#EAE3D9]/40 text-[9px] text-[#7E766A] font-semibold leading-normal">
                <span>Roll No: 106122019 verified via college registry portal database.</span>
              </div>
            </div>

            {/* Column 2: Right Evidence Inspection Panel */}
            <div className={`md:col-span-7 p-8 flex flex-col justify-between bg-white/70 transition-all duration-300 ${
              isDark ? 'bg-slate-900/40' : 'bg-white/80'
            }`}>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLayer}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  
                  {/* Layer Explanation */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-black border px-2.5 py-0.5 rounded-lg ${
                        isDark ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' : 'bg-[#1E2240]/5 text-[#1E2240] border-[#1E2240]/15'
                      }`}>
                        Layer {activeLayer}
                      </span>
                      <h4 className="text-base font-extrabold tracking-tight">
                        {activeLayer === 1 && 'Academic Evidence Analysis'}
                        {activeLayer === 2 && 'Certification Link Validation'}
                        {activeLayer === 3 && 'Proven Submissions & Github OAuth'}
                        {activeLayer === 4 && '1:1 Expert Vetting Recording'}
                      </h4>
                    </div>
                    <p className={`text-xs font-semibold leading-normal ${isDark ? 'text-slate-400' : 'text-[#7E766A]'}`}>
                      {activeLayer === 1 && 'Authenticating semester marksheets, grade reports, and course registries via automated AI forensic scan and registrar auditing.'}
                      {activeLayer === 2 && 'Connecting to issuer APIs to cross-verify credential strings, expiration dates, and institution tier guidelines.'}
                      {activeLayer === 3 && 'Analyzing production repos via GitHub API integration and running test builds in virtual sandboxes.'}
                      {activeLayer === 4 && 'A recorded technical interview on specialized architecture conducted with a senior domain engineer.'}
                    </p>
                  </div>

                  {/* Evidence Display Panel */}
                  <div className={`p-5 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-[#EAE3D9] bg-[#FAF7F2]/60'} space-y-4`}>
                    
                    {/* Layer 1 Content */}
                    {activeLayer === 1 && (
                      <div className="space-y-4 text-xs font-semibold">
                        <div className="flex justify-between items-center py-2 border-b border-slate-500/10">
                          <span className="text-slate-400">Credential Source</span>
                          <span>NIT Trichy B.Tech Semester 6 Marksheet</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3 pt-2">
                          <div className={`p-3 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'} space-y-1`}>
                            <div className="flex items-center gap-2 text-indigo-500">
                              <Database size={13} />
                              <span className="font-extrabold uppercase text-[9px] tracking-wider">AI Forensic Scan</span>
                            </div>
                            <p className="text-[10px] text-slate-450 leading-normal">No modifications, font alterations, or cloned stamp pixels detected.</p>
                            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-400/5 border border-emerald-400/10 px-2 py-0.5 rounded-full inline-block mt-1">Pass</span>
                          </div>
                          <div className={`p-3 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'} space-y-1`}>
                            <div className="flex items-center gap-2 text-indigo-500">
                              <FileText size={13} />
                              <span className="font-extrabold uppercase text-[9px] tracking-wider">OCR Verification</span>
                            </div>
                            <p className="text-[10px] text-slate-455 leading-normal">Matched "SGPA: 9.54", "CGPA: 9.42", and Roll "106122..." with 100% confidence.</p>
                            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-400/5 border border-emerald-400/10 px-2 py-0.5 rounded-full inline-block mt-1">Confirmed</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'} flex items-start gap-3`}>
                          <User className="text-slate-400 mt-0.5 flex-shrink-0" size={15} />
                          <div>
                            <span className="font-extrabold block text-[9px] text-[#7E766A] uppercase">Human Auditor Comments</span>
                            <p className="text-[10px] font-semibold leading-relaxed">"Marksheet compared with original template database layout. Academic scores confirm B.Tech Computer Science 6th Semester status." — Sandeep K. (Moderation Queue)</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Layer 2 Content */}
                    {activeLayer === 2 && (
                      <div className="space-y-4 text-xs font-semibold">
                        <div className="flex justify-between items-center py-2 border-b border-slate-500/10">
                          <span className="text-slate-400">Certification Name</span>
                          <span>AWS Certified Developer – Associate</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-500/10">
                          <span className="text-slate-400">Credential ID</span>
                          <span className="font-mono">AWS-DVA-9903</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-500/10">
                          <span className="text-slate-400">Issuer Domain Vetted</span>
                          <span className="flex items-center gap-1.5 text-emerald-600"><Lock size={12} /> aws.amazon.com (Tier 1 Global)</span>
                        </div>
                        <div className={`p-3 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'} flex justify-between items-center`}>
                          <div className="space-y-1">
                            <span className="font-extrabold uppercase text-[9px] text-indigo-500 block tracking-wider">Credential Verification API</span>
                            <p className="text-[10px] text-slate-400">Validation response fetched directly from Amazon Web Services registry endpoint.</p>
                          </div>
                          <span className="text-[9px] font-extrabold bg-emerald-400/5 text-emerald-600 border border-emerald-400/20 px-3 py-1 rounded-lg flex items-center gap-1">
                            <Check size={12} /> Active
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Layer 3 Content */}
                    {activeLayer === 3 && (
                      <div className="space-y-4 text-xs font-semibold">
                        <div className="flex justify-between items-center py-2 border-b border-slate-500/10">
                          <span className="text-slate-400">Repository Imported</span>
                          <a href="https://github.com" className={`flex items-center gap-1 ${isDark ? 'text-indigo-400' : 'text-[#1E2240]'}`}>github.com/arjun-git/go-api-gateway <ExternalLink size={12} /></a>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1">
                          <div className={`p-2.5 rounded-lg border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'} text-center`}>
                            <div className="font-bold text-xs">34</div>
                            <div className="text-[9px] text-[#7E766A] mt-0.5">Commits (90d)</div>
                          </div>
                          <div className={`p-2.5 rounded-lg border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'} text-center`}>
                            <div className="font-bold text-xs">294</div>
                            <div className="text-[9px] text-[#7E766A] mt-0.5">Stars Vetted</div>
                          </div>
                          <div className={`p-2.5 rounded-lg border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'} text-center`}>
                            <div className="font-bold text-xs text-emerald-600">Pass</div>
                            <div className="text-[9px] text-[#7E766A] mt-0.5">Static Tests</div>
                          </div>
                        </div>
                        <div className={`p-3 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'} space-y-2`}>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-extrabold uppercase text-[#7E766A] tracking-wider flex items-center gap-1.5"><Terminal size={11} /> Sandbox Runner Output</span>
                            <span className="text-[8px] font-extrabold text-slate-400 font-mono">1.2s runtime</span>
                          </div>
                          <pre className="font-mono text-[9px] text-slate-400 bg-slate-950 p-2.5 rounded-lg overflow-x-auto select-none">
                            {`$ vitest run\n✓ gateway_route_matching.test.go (6 tests)\n✓ auth_middleware_ratelimit.test.go (6 tests)\n\nTest Files: 2 passed (2 total)\nTests: 12 passed (12 total)`}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Layer 4 Content */}
                    {activeLayer === 4 && (
                      <div className="space-y-4 text-xs font-semibold">
                        <div className="flex justify-between items-center py-2 border-b border-slate-500/10">
                          <span className="text-slate-400">Interviewer</span>
                          <span>Priya Patel (Staff Engineer, Razorpay)</span>
                        </div>
                        
                        {/* Audio Waveform Simulator */}
                        <div className={`p-3.5 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'} space-y-3`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
                                  isDark ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-[#1E2240] hover:bg-[#2B3058]'
                                }`}
                              >
                                {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                              </button>
                              <div>
                                <span className="font-extrabold block text-[10px]">Technical Interview Snippet</span>
                                <span className="text-[9px] text-[#7E766A]">Topic: React Fibers & Reconciler</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[#7E766A]">
                              <Volume2 size={13} />
                              <span className="text-[9px]">0:45 / 2:30</span>
                            </div>
                          </div>

                          {/* Interactive wave animation */}
                          <div className="h-6 flex items-end gap-[3px] px-1 justify-between">
                            {Array.from({ length: 32 }).map((_, i) => {
                              const waveHeight = isPlaying 
                                ? Math.sin((i + Date.now()/150)) * 60 + 40 
                                : [15, 20, 30, 45, 10, 25, 40, 60, 20, 30, 50, 40, 10, 35, 60, 40, 15, 25, 45, 30, 20, 15, 40, 55, 30, 10, 20, 35, 40, 25, 15, 10][i];
                              return (
                                <motion.div
                                  key={i}
                                  animate={{ height: isPlaying ? `${Math.max(4, waveHeight)}%` : `${waveHeight}%` }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                  className={`w-[4.5px] rounded-full ${isDark ? 'bg-indigo-500' : 'bg-[#1E2240]'}`}
                                />
                              );
                            })}
                          </div>
                        </div>

                        <div className={`p-3 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'} space-y-1`}>
                          <span className="font-extrabold block text-[9px] text-[#7E766A] uppercase">Interviewer Assessment score</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-emerald-600">8.8 / 10</span>
                            <span className="text-[10px] text-[#7E766A] font-bold">"Understands scheduling architecture. Solid explanation of React Fiber structure vs stack reconcilers."</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                  
                  {/* Security Statement */}
                  <div className={`flex items-center gap-3 mt-6 text-xs text-[#7E766A] p-3.5 rounded-xl border ${
                    isDark ? 'bg-slate-900/10 border-slate-800' : 'bg-[#FAF7F2]/80 border-[#EAE3D9]'
                  }`}>
                    <Lock size={14} className="text-slate-400 flex-shrink-0" />
                    <span>Every audit generates an immutable digital signature. Credentials and transcripts are encrypted via certified PII configurations.</span>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </section>

        {/* RECRUITER SCREENING SANDBOX: UNIFIED DASHBOARD CARD */}
        <section id="recruiter-sandbox" className="space-y-8 max-w-6xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">
              The Recruiter Sandbox
            </h2>
            <p className={`text-sm font-bold max-w-lg mx-auto ${isDark ? 'text-slate-400' : 'text-[#7E766A]'}`}>
              Simulate how recruiters query profiles. Toggle minimum evidence layers to instantly filter candidate rosters.
            </p>
          </div>

          {/* Unified Recruiter Sandbox Dashboard Card */}
          <div className={`rounded-3xl border overflow-hidden shadow-lg grid md:grid-cols-12 items-stretch transition-all duration-300 ${
            isDark ? 'border-slate-800 bg-slate-900/20' : 'border-[#EAE3D9] bg-white/40'
          }`}>
            
            {/* Left sidebar: Filter Panel */}
            <div className={`md:col-span-4 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r transition-all duration-300 ${
              isDark ? 'border-slate-800 bg-slate-950/50' : 'border-[#EAE3D9] bg-[#FAF7F2]/85'
            }`}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs flex items-center gap-2">
                    <Sliders size={15} className={isDark ? 'text-indigo-400' : 'text-[#1E2240]'} /> Filter Criteria
                  </span>
                  <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full border ${
                    isDark ? 'text-indigo-400 bg-indigo-500/10 border-indigo-400/20' : 'text-[#1E2240] bg-[#1E2240]/5 border-[#1E2240]/10'
                  }`}>
                    Live Demo
                  </span>
                </div>

                {/* Filter 1: Min Layer Badges */}
                <div className="space-y-2">
                  <label className="text-[9px] font-extrabold uppercase text-[#7E766A] tracking-wider block">Minimum Verified Layer</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((layer) => (
                      <button
                        key={layer}
                        onClick={() => setFilterLayer(layer)}
                        className={`py-2 text-xs font-black rounded-lg border transition-all ${
                          filterLayer === layer
                            ? isDark 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                              : 'bg-[#1E2240] border-[#1E2240] text-white shadow-sm'
                            : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850' : 'bg-white border-[#EAE3D9] text-[#5C5346] hover:bg-slate-100'
                        }`}
                      >
                        L{layer}+
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] text-[#7E766A] block leading-normal mt-1 font-semibold">
                    {filterLayer === 1 && 'Showing everyone who uploaded credentials.'}
                    {filterLayer === 2 && 'Vetted certifications checked.'}
                    {filterLayer === 3 && 'Has sandbox-tested GitHub repositories.'}
                    {filterLayer === 4 && 'Pre-interviewed by verified senior engineers.'}
                  </span>
                </div>

                {/* Filter 2: Skills */}
                <div className="space-y-2">
                  <label className="text-[9px] font-extrabold uppercase text-[#7E766A] tracking-wider block">Target Skill</label>
                  <select
                    value={filterSkill}
                    onChange={(e) => setFilterSkill(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isDark ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-[#EAE3D9] bg-white text-[#5C5346]'
                    }`}
                  >
                    <option value="All">All Skills</option>
                    <option value="React">React</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                  </select>
                </div>

                {/* Filter 3: College tier */}
                <div className="space-y-2">
                  <label className="text-[9px] font-extrabold uppercase text-[#7E766A] tracking-wider block">College Tier</label>
                  <select
                    value={filterCollege}
                    onChange={(e) => setFilterCollege(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isDark ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-[#EAE3D9] bg-white text-[#5C5346]'
                    }`}
                  >
                    <option value="All">All Colleges</option>
                    <option value="Tier 1 (IIT/NIT/IIM)">Tier 1 (IIT/NIT/IIM)</option>
                    <option value="Tier 2/3 (Other)">Tier 2/3 (Other)</option>
                  </select>
                </div>
              </div>

              {/* Reset button */}
              <button
                onClick={() => {
                  setFilterLayer(1);
                  setFilterSkill('All');
                  setFilterCollege('All');
                  setSearchQuery('');
                }}
                className={`w-full mt-6 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                  isDark ? 'border-slate-800 hover:bg-slate-900 text-slate-300' : 'border-[#EAE3D9] hover:bg-[#E1D7C6] text-[#5C5346]'
                }`}
              >
                Clear Filters
              </button>
            </div>

            {/* Right panel: Candidates Roster Output */}
            <div className={`md:col-span-8 p-6 flex flex-col justify-between bg-white/70 transition-all duration-300 ${
              isDark ? 'bg-slate-900/40' : 'bg-white/80'
            }`}>
              
              <div>
                {/* Search bar inside Sandbox */}
                <div className="relative mb-4">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
                  <input
                    type="text"
                    placeholder="Search by name, college, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all ${
                      isDark ? 'border-slate-800 bg-slate-950/70 text-slate-100 focus:border-indigo-500' : 'border-[#EAE3D9] bg-[#FAF7F2]/40 text-slate-950 focus:border-[#1E2240]'
                    }`}
                  />
                </div>

                {/* Candidate Roster Grid */}
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  <AnimatePresence mode="popLayout">
                    {filteredCandidates.length > 0 ? (
                      filteredCandidates.map((candidate) => (
                        <motion.div
                          layout
                          key={candidate.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                            isDark ? 'border-slate-800 bg-slate-950/50 hover:bg-slate-900/60' : 'border-[#EAE3D9] bg-white hover:bg-[#FAF7F2]/80'
                          }`}
                        >
                          {/* Candidate Basic details */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`w-9 h-9 rounded-xl font-extrabold flex items-center justify-center flex-shrink-0 text-xs text-white ${
                              isDark ? 'bg-indigo-600/20 text-indigo-400' : 'bg-[#1E2240]'
                            }`}>
                              {candidate.avatar}
                            </div>
                            <div className="min-w-0 font-semibold">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-xs truncate">{candidate.name}</span>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
                                  candidate.status === 'Open to Hire' 
                                    ? 'bg-emerald-500/10 text-emerald-600' 
                                    : candidate.status === 'Interviewing' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-slate-400'
                                }`}>
                                  {candidate.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-bold">
                                <MapPin size={10} className="text-slate-400" />
                                <span className="truncate">{candidate.college} ({candidate.cgpa})</span>
                              </div>
                            </div>
                          </div>

                          {/* Candidate verification level and details preview */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto font-semibold">
                            
                            {/* Badges preview */}
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4].map((layer) => {
                                const isUnlocked = candidate.highestLayer >= layer;
                                return (
                                  <div
                                    key={layer}
                                    title={`Layer ${layer} verification`}
                                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black border ${
                                      isUnlocked 
                                        ? isDark 
                                          ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' 
                                          : 'bg-[#1E2240]/5 text-[#1E2240] border-[#1E2240]/15'
                                        : 'bg-transparent text-slate-350 border-dashed border-slate-300'
                                    }`}
                                  >
                                    L{layer}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="text-right flex-shrink-0 hidden md:block">
                              <span className="text-[8px] block font-extrabold text-slate-400 uppercase">Shipped Project</span>
                              <span className="text-xs font-bold truncate max-w-[120px] block">{candidate.project}</span>
                            </div>

                            <div className="text-right flex-shrink-0 hidden md:block">
                              <span className="text-[8px] block font-extrabold text-slate-400 uppercase">1:1 Interview</span>
                              <span className={`text-xs font-bold ${candidate.interviewScore !== 'Not Interviewed' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {candidate.interviewScore}
                              </span>
                            </div>

                            <Link
                              to="/register"
                              className={`p-2 rounded-lg border transition-all ${
                                isDark ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-indigo-400' : 'border-[#EAE3D9] bg-white hover:bg-slate-50 text-[#1E2240]'
                              }`}
                            >
                              <Eye size={13} />
                            </Link>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-center space-y-3"
                      >
                        <AlertCircle size={32} className="text-slate-400" />
                        <div>
                          <p className="font-extrabold text-sm">No verified students match these constraints</p>
                          <p className="text-xs text-slate-400 max-w-xs mt-1">Try dropping the minimum verification layer or filtering on different skills.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Recruiter sandbox stats */}
              <div className="mt-4 pt-4 border-t border-slate-500/10 flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Roster Count: <strong>{filteredCandidates.length}</strong> matching candidates</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-600" /> Verified proof filters active</span>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION: 4 LAYERS OF TRUTH SHOWCASE */}
        <section id="how-it-works" className="space-y-8 max-w-6xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">
              The 4 Layers of Truth
            </h2>
            <p className={`text-sm font-bold max-w-lg mx-auto ${isDark ? 'text-slate-400' : 'text-[#7E766A]'}`}>
              A structured validation process verifying academic credentials, official courses, open-source code, and developer competence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                layer: 'L1',
                title: 'Academic Evidence',
                evidence: 'Semester marksheets, CGPA certificates, graduation data.',
                check: 'OCR scanning, EXIF hash alignment, AI forgery review, human auditor signoff.',
                color: 'from-blue-600 to-indigo-600'
              },
              {
                layer: 'L2',
                title: 'Certified Badges',
                evidence: 'AWS, NPTEL, Coursera, Google Developer Certifications.',
                check: 'Automatic verification via credential query, domain validator whitelists.',
                color: 'from-indigo-600 to-purple-600'
              },
              {
                layer: 'L3',
                title: 'Proven Projects',
                evidence: 'Shipped GitHub work, arena challenges, hackathon records.',
                check: 'GitHub API OAuth imports, sandbox unit tests running in clean runner pipelines.',
                color: 'from-purple-600 to-pink-600'
              },
              {
                layer: 'L4',
                title: 'Expert Interviewed',
                evidence: '1:1 technical interview with a verified industry veteran.',
                check: 'Video recording logged, audit scoring rules applied, payment held via Razorpay.',
                color: 'from-pink-600 to-emerald-500'
              }
            ].map((l, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl border flex flex-col justify-between hover:shadow-sm transition-all duration-300 ${
                  isDark ? 'border-slate-900 bg-slate-900/20 hover:bg-slate-900/40' : 'border-[#EAE3D9] bg-white/40 hover:bg-white/80'
                }`}
              >
                <div className="space-y-4">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${l.color} flex items-center justify-center font-black text-white text-sm shadow-sm`}>
                    {l.layer}
                  </div>
                  <h3 className="font-extrabold text-base">{l.title}</h3>
                  <div className="space-y-2.5 text-xs font-semibold leading-normal">
                    <p className={isDark ? 'text-slate-400' : 'text-[#7E766A]'}><span className={`uppercase tracking-wider block text-[9px] mb-0.5 font-bold ${isDark ? 'text-indigo-400' : 'text-[#1E2240]'}`}>Evidence Type</span> {l.evidence}</p>
                    <p className={isDark ? 'text-slate-400' : 'text-[#7E766A]'}><span className="text-emerald-600 uppercase tracking-wider block text-[9px] mb-0.5 font-bold">Verification Method</span> {l.check}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INDIA-FIRST FOCUS SECTION */}
        <section id="institutions" className="space-y-12 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Branding copy */}
            <div className="lg:col-span-6 space-y-6">
              <span className={`text-[9px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                isDark ? 'bg-emerald-500/10 text-emerald-450 border-emerald-450/20' : 'bg-emerald-50/60 text-emerald-700 border-emerald-600/20'
              }`}>
                India-First Infrastructure
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight font-display">
                Built for the realities of Indian academia.
              </h2>
              <p className={`text-base font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#5C5346]'}`}>
                From conversion guidelines for SGPA / CGPA, mapping semester grade grids, to verifying institutional domains (iitb.ac.in, nitt.edu). SkillVerify is seeded with <strong>255+ institutions</strong> out of the box.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 font-semibold">
                {[
                  { icon: Building2, title: '255+ seeded colleges', desc: 'IITs, NITs, BITS, and long-tail AISHE state institutes.' },
                  { icon: Clock, title: 'AI + Human workflow', desc: 'AI pre-screens, but a verified reviewer checks and logs structured audits.' },
                  { icon: FileText, title: 'SGPA / CGPA formulas', desc: 'Accurate percentage matching per university rules.' },
                  { icon: Lock, title: 'PII Isolation', desc: 'Private marksheets are isolated via signed-URL configurations.' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-[#1E2240]/5 text-[#1E2240]'
                      }`}>
                        <Icon size={15} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Moderation Audit Log panel visual mockup */}
            <div className="lg:col-span-6">
              <div className={`p-6 rounded-3xl border ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-[#EAE3D9] bg-white/40'} space-y-6`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs flex items-center gap-2"><Lock size={14} className="text-slate-400" /> Auditor Moderation Queue</span>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase">Live Audit Log</span>
                </div>

                <div className="space-y-3 font-semibold">
                  {[
                    { id: '#1089', user: 'Neha G. (IIT Bombay)', status: 'Approved', auditor: 'Madan Mohan', reason: 'CGPA data matched, original metadata authenticated.' },
                    { id: '#1088', user: 'Vikram S. (State Eng Coll)', status: 'Rejected', auditor: 'Anita Sen', reason: 'REJ-04: Marksheet image name mismatch. Student metadata edited.' },
                    { id: '#1087', user: 'Sarah K. (VIT Vellore)', status: 'Approved', auditor: 'Auto-Bot L2', reason: 'AWS certification string confirmed via issuer REST lookup.' }
                  ].map((log, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border text-[11px] space-y-2 ${isDark ? 'bg-slate-950/60 border-slate-805' : 'bg-white border-[#EAE3D9]'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400">{log.id}</span>
                          <span className="font-bold">{log.user}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${
                          log.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>Reviewer: {log.auditor}</span>
                        <span>{log.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`text-[10px] leading-normal flex items-start gap-2 p-3 rounded-xl border font-semibold ${
                  isDark ? 'bg-indigo-500/5 border-indigo-500/10 text-slate-400' : 'bg-[#FAF7F2] border-[#EAE3D9] text-[#7E766A]'
                }`}>
                  <AlertCircle size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>Audit actions are saved in the immutable database audit ledger. Rejected claims write specific rejection reason codes (e.g. metadata-mismatch) to ensure user trust.</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section id="faq" className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">
              Frequently Asked Questions
            </h2>
            <p className={`text-sm font-bold max-w-lg mx-auto ${isDark ? 'text-slate-400' : 'text-[#7E766A]'}`}>
              Clear answers regarding student portfolios, verification workflows, and recruiter subscriptions.
            </p>
          </div>

          <div className="space-y-4 font-semibold">
            {[
              {
                q: 'How does the L1 Academic verification process prevent photo editing?',
                a: 'Students upload high-resolution semester grade sheets. Our backend performs metadata checking (scanning for Photoshop/Canva EXIF markers or edit footprints), runs cryptographic image hash matching (to prevent multiple profiles reusing the same files), executes OCR readings, and routes the document to a verified human moderator for final sign-off.'
              },
              {
                q: 'What is the "Practice Arena" and how is L3 Proven code validated?',
                a: 'The Practice Arena features 170+ challenges across 17 technical tracks. When a student submits solutions, the code executes in an isolated sandbox running compiler test suites. Additionally, for GitHub imports, we hook into repository commits and run static testing scripts to ensure the student actually built and shipped the code.'
              },
              {
                q: 'How are 1:1 expert interviews set up and paid?',
                a: 'Expert technical interviews (L4) are conducted with verified staff engineers from companies like Razorpay, Uber, and Swiggy. The candidate pays a vetting fee via Razorpay. The recording, audio logs, and candidate scorecard are uploaded directly to the platform, and the fee is disbursed to the interviewer once the score sheet and video are reviewed and approved.'
              },
              {
                q: 'Can colleges export placement reports from SkillVerify?',
                a: 'Yes, placement cells and departments can sign up as institutional administrators. This lets them export a unified roster of students filtered by verification layers. It ensures that outgoing class portfolios are backed by authenticated evidence rather than inflated or padded resumes.'
              }
            ].map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-250 overflow-hidden ${
                    isOpen 
                      ? isDark ? 'border-indigo-500' : 'border-[#1E2240]'
                      : isDark ? 'border-slate-800 bg-slate-900/10' : 'border-[#EAE3D9] bg-white'
                  }`}
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full p-5 flex justify-between items-center text-left font-extrabold text-sm sm:text-base focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400 flex-shrink-0"
                    >
                      <ChevronDown size={17} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className={`p-5 pt-0 text-xs sm:text-sm font-semibold leading-relaxed border-t ${
                          isDark ? 'border-slate-850 text-slate-400' : 'border-[#EAE3D9] text-[#7E766A]'
                        }`}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className={`p-8 md:p-12 rounded-3xl text-center space-y-8 relative overflow-hidden transition-all duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800/80 shadow-xl' 
            : 'bg-gradient-to-r from-[#FAF7F2] via-white to-[#F5EFEB] border border-[#EAE3D9] shadow-md'
        }`}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className={`text-3xl font-black tracking-tight leading-tight font-display ${isDark ? 'text-white' : 'text-[#191E3B]'}`}>
              Ready to claim your verified credentials?
            </h2>
            <p className={`text-sm font-bold leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#7E766A]'}`}>
              Students build portfolios backed by real evidence. Recruiters request platform access to query vetted, pre-screened talent pools instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/register"
                className={`px-8 py-4 rounded-full text-xs uppercase font-extrabold tracking-wider text-white shadow-md transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-[#1E2240]'
                }`}
              >
                Claim Your Badge Free
              </Link>
              <Link
                to="/login"
                className={`px-8 py-4 rounded-full text-xs uppercase font-extrabold tracking-wider border transition-all hover:-translate-y-1 ${
                  isDark ? 'border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-100' : 'border-[#EAE3D9] bg-white hover:bg-slate-50 text-[#5C5346]'
                }`}
              >
                Recruiter Log In
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-500 ${isDark ? 'border-slate-900 bg-slate-950 text-slate-400' : 'border-[#EAE3D9] bg-[#FAF7F2] text-[#7E766A]'} px-6 py-12`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${isDark ? 'bg-indigo-600' : 'bg-[#1E2240]'}`}>
                <Shield size={14} />
              </div>
              <span className={`font-extrabold text-base ${isDark ? 'text-slate-100' : 'text-[#191E3B]'}`}>SkillVerify</span>
            </div>
            <p className="text-[11px] font-semibold leading-relaxed">
              Every skill on a student portfolio is verified against real evidence. Verified academic records, GitHub test runs, and 1:1 expert audio-video interviews.
            </p>
          </div>

          <div className="space-y-3 text-xs font-bold uppercase tracking-wider">
            <h4 className={`text-xs ${isDark ? 'text-slate-100 font-black' : 'text-[#191E3B] font-extrabold'}`}>For Students</h4>
            <ul className="space-y-2 normal-case font-semibold text-[#7E766A]">
              <li><Link to="/register" className="hover:text-[#1E2240] transition-colors">Portfolio Signup</Link></li>
              <li><Link to="/jobs" className="hover:text-[#1E2240] transition-colors">Practice Arena</Link></li>
              <li><Link to="/tech/hackathons" className="hover:text-[#1E2240] transition-colors">Contest Ingestion</Link></li>
              <li><Link to="/jobs/internships" className="hover:text-[#1E2240] transition-colors">Micro Internships</Link></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs font-bold uppercase tracking-wider">
            <h4 className={`text-xs ${isDark ? 'text-slate-100 font-black' : 'text-[#191E3B] font-extrabold'}`}>For Recruiters</h4>
            <ul className="space-y-2 normal-case font-semibold text-[#7E766A]">
              <li><a href="#recruiter-sandbox" className="hover:text-[#1E2240] transition-colors">Candidate Screening Demo</a></li>
              <li><Link to="/login" className="hover:text-[#1E2240] transition-colors">Recruiter Portal Access</Link></li>
              <li><Link to="/jobs/exchange" className="hover:text-[#1E2240] transition-colors">Job Posting Dashboard</Link></li>
              <li><span className="text-slate-400">API Documentation (Coming)</span></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs font-bold uppercase tracking-wider">
            <h4 className={`text-xs ${isDark ? 'text-slate-100 font-black' : 'text-[#191E3B] font-extrabold'}`}>Security & Compliance</h4>
            <p className="text-[10px] font-semibold leading-relaxed normal-case text-[#7E766A]">
              Vetting interview payments are securely held in Razorpay and verified by Sentry/PostHog analytics logging.
            </p>
            <div className="flex gap-2.5 pt-2">
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase border ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-[#EAE3D9] bg-white'}`}>Razorpay Vetted</span>
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase border ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-[#EAE3D9] bg-white'}`}>PII ISO-Secure</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-500/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold">
          <span>&copy; {new Date().getFullYear()} SkillVerify. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#1E2240] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1E2240] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1E2240] transition-colors">Audit Disclosures</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
