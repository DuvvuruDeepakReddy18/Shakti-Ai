# SHAKTI AI — The Digital Sanctuary

> A comprehensive women's safety, wellness, and empowerment platform — built with React, Vite, Firebase, and a zero-cost AI stack powered by OpenRouter.

[![Live Site](https://img.shields.io/badge/Live-Netlify-00C7B7?logo=netlify&logoColor=white)](https://github.com/DuvvuruDeepakReddy18/Shakti-Ai)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Overview

SHAKTI AI (formerly *She Care AI*) is a single-page React application that brings together **safety, health, careers, technology, and community** into one cohesive sanctuary for women. It runs on a fully zero-cost infrastructure stack — Firebase for auth & data, Netlify for hosting, OpenStreetMap for maps, and OpenRouter's free `minimax/minimax-m2.5` model for all AI features.

The platform is organized around **six core ecosystems**, each with its own AI-powered tools, gamified UX, and a "Digital Sanctuary" design language built on glassmorphism, soft glows, and a deep-space color palette.

---

## Key Features

### Safety & Emergency
- **Global SOS Button** — A pulsing panic button that fires an emergency overlay from anywhere in the app.
- **Live Tracking** — Real-time volunteer movement on React-Leaflet maps.
- **Safety Map** — Crowd-sourced safe zones, hospitals, and police routes via OpenStreetMap.
- **Evidence Locker** — Secure vault for sensitive incident reports.
- **Emergency Contacts** — One-tap speed dial to trusted contacts.
- **Safety Scoreboard** — Gamified safety metric tracking.

### Health & Wellness
- **AI Companion** — Conversational therapist with smooth auto-scroll and dynamic gradients.
- **Mood Tracker** — Interactive logging with 7-day Recharts trend visualizations.
- **Menstrual & Stress Tracker** — Private, encrypted health logging.
- **Wellness Engine** — AI-generated personalized health plans.

### Financial Empowerment & Jobs
- **Job Exchange & Marketplace** — Discover and share economic opportunities.
- **Career Simulator** — Scenario-based interactive career progression.
- **Micro-Internships** — Short-term remote work matching.
- **Skill Translator** — AI converts everyday experience into professional resume language.

### Technological Upskilling
- **Project Generator** — AI builds custom code project frameworks for learning.
- **Mentor Match** — AI-powered mentor recommendation engine.
- **Hackathon Arena & Idea Incubator** — Innovation gamification hubs.
- **Leaderboard** — Ranked tech learning progression.

### Community & Networking
- **Forums & Events** — Peer-to-peer support spaces.
- **Trusted Circle** — Private friend grouping for safety check-ins.
- **Volunteer Network** — Connects directly into Live Tracking.
- **Skill Exchange** — Knowledge-bartering marketplace.

### Authentication & Profile
- Login, Register, Forgot Password, custom Onboarding wizard.
- Profile, Settings, and theme management (Dark "Deep Space" + Light mode).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Routing** | React Router 7 |
| **State** | Zustand (5 isolated stores: `auth`, `health`, `job`, `safety`, `ui`) |
| **Styling** | Tailwind CSS 4 + custom glassmorphism utilities |
| **Animation** | Framer Motion 12 |
| **Backend** | Firebase (Auth + Firestore) |
| **Maps** | React-Leaflet + OpenStreetMap (CartoDB Voyager tiles) |
| **Charts** | Recharts 3 |
| **OCR** | Tesseract.js (for the Food Scanner) |
| **AI** | OpenRouter API (`minimax/minimax-m2.5:free`) — pure `fetch`, no SDK |
| **Hosting** | Netlify |
| **Notifications** | react-hot-toast |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Firebase project (free tier is fine)
- An OpenRouter API key (free tier is fine)

### 1. Clone the repo
```bash
git clone https://github.com/DuvvuruDeepakReddy18/Shakti-Ai.git
cd Shakti-Ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:

```env
# Firebase (get from your Firebase project settings)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# OpenRouter (get from https://openrouter.ai/keys)
VITE_OPENROUTER_API_KEY=sk-or-v1-...
```

### 4. Run the dev server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 5. Build for production
```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/         # Shared UI (Navbar, Sidebar, BottomNav, SOSButton, etc.)
├── pages/
│   ├── auth/           # Login, Register, Onboarding, ForgotPassword
│   ├── safety/         # SafetyHome, LiveTracking, SafetyMap, EvidenceLocker...
│   ├── health/         # AICompanion, MoodTracker, MenstrualTracker, WellnessEngine...
│   ├── jobs/           # JobExchange, CareerSimulator, SkillTranslator...
│   ├── tech/           # ProjectGenerator, MentorMatch, HackathonArena...
│   ├── community/      # Forums, Events, TrustedCircle, VolunteerNetwork...
│   └── profile/        # ProfilePage, SettingsPage, MerchandiseStore
├── services/
│   └── aiService.js    # OpenRouter integration (pure fetch, no SDK)
├── store/              # Zustand stores (auth, health, job, safety, ui)
├── styles/             # Global CSS + Tailwind tokens
├── utils/              # Constants and helpers
├── firebase.js         # Firebase initialization
└── App.jsx             # Root component + route definitions

public/                 # Static assets, _redirects for Netlify SPA routing
firestore.rules         # Firestore security rules
firebase.json           # Firebase hosting config
```

---

## Deployment

### Netlify (recommended)
```bash
npm run build
netlify deploy --prod --dir=dist
```

The `public/_redirects` file handles SPA fallback routing automatically.

### Firebase Hosting (alternative)
```bash
npm run build
firebase deploy
```

---

## Design System

The "Digital Sanctuary" theme uses CSS variables for a token-based palette:

- **Primary:** `#630ed4` (deep purple)
- **Accent:** `#B4136D` (vibrant pink)
- **Modes:** Deep Space dark mode + Vibrant light mode

**Custom utilities:**
- `.glass`, `.glass-light` — glassmorphism backgrounds
- `.glow-purple`, `.glow-pink` — animated halos
- `.breathe`, `.float`, `.shimmer` — keyframe animations

All major pages use a constrained `max-w-4xl mx-auto` wrapper to prevent layout breakage on ultra-wide displays.

---

## Security Notes

- **Firestore rules** are defined in `firestore.rules` — review them before going to production.
- The Firebase web SDK config is **safe to expose** publicly (it's designed that way), but your security ultimately depends on Firestore rules and Firebase Auth.
- The `.env` file is git-ignored. Never commit API keys.

---

## Roadmap

- [ ] Push notifications for SOS events
- [ ] Offline-first PWA support
- [ ] End-to-end encryption for Evidence Locker
- [ ] Multi-language support (Hindi, Telugu, Tamil priority)
- [ ] Voice-activated SOS trigger

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **OpenRouter** for free-tier access to the MiniMax model.
- **OpenStreetMap & CartoDB** for free map tiles.
- **Firebase** for the free Spark plan.
- **Netlify** for free static hosting and serverless functions.
- Every woman whose story shaped a feature in this app.

---

**Built with care by [Duvvuru Deepak Reddy](https://github.com/DuvvuruDeepakReddy18).**
