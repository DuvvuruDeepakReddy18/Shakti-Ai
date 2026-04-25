# SHAKTI AI (The Digital Sanctuary) - Comprehensive Project Summary

## Project Overview
SHAKTI AI (formerly She Care AI) is a massive comprehensive women's safety, wellness, and empowerment platform built with React, Vite, Framer Motion, and Tailwind CSS. Over the course of development, we transformed the initial concept into a robust, beautiful, and fully-deployed zero-cost infrastructure platform spanning six core ecosystems.

## 1. Core Infrastructure & Architecture
- **Framework & Routing:** A monolithic React Single Page Application (SPA) built with Vite and React Router (`RootLayout.jsx`, `App.jsx`, `main.jsx`).
- **State Management:** Implemented the Zustand library to handle 5 distinct global states (`authStore`, `healthStore`, `jobStore`, `safetyStore`, `uiStore`) ensuring smooth, dynamic data flow without prop-drilling.
- **Backend & Database:** Integrated with Firebase (`firebase.js`) for user authentication, data persistence, and secure session management.
- **Zero-Cost AI Migration (The OpenRouter Integration):** 
  - Completely removed the expensive `@google/generative-ai` SDK.
  - Created a custom, pure `fetch`-based AI service layer in `src/services/aiService.js`.
  - Integrated the free `minimax/minimax-m2.5:free` model via OpenRouter API.
  - Set up logic to parse standard text outputs from the model to fuel our 8 distinct internal AI components.

## 2. Directory Architecture & The 6 Major Modules

### A. Safety & Emergency Services (`src/pages/safety/`)
- `SafetyHome.jsx` & `SafetyScoreboard.jsx`: Central hub and gamified safety metric tracking.
- `EmergencyContacts.jsx`: Speed-dial and immediate trusted contact outreach.
- `LiveTracking.jsx`: React-Leaflet map implementations for visualizing real-time volunteer movements.
- `SafetyMap.jsx`: OpenStreetMap integrations showing safe zones, hospitals, and police routes using free CartoDB Voyager tiles.
- `EvidenceLocker.jsx`: Secure vault for capturing and holding sensitive incident reports.
- **Global SOS System:** Extracted into `src/components/SOSButton.jsx` to be a pulsing red panic button that fires an immediate emergency overlay globally.

### B. Health & Wellness Sanctuary (`src/pages/health/`)
- `HealthHome.jsx`: The "Digital Sanctuary" hub.
- `AICompanion.jsx`: A highly polished conversational therapist interface featuring smooth auto-scrolling, beautiful dynamic gradients, and precision padding alignment constraints.
- `MoodTracker.jsx`: Interactive UI logging energy levels and deploying 7-day visual Rechart trend graphs based on state persistence.
- `MenstrualTracker.jsx` & `StressDetector.jsx`: Specific, private health logging utilities.
- `WellnessEngine.jsx`: AI-driven personalized health plan generation.

### C. Financial Empowerment & Jobs (`src/pages/jobs/`)
- `JobsHome.jsx`
- `JobExchange.jsx` & `Marketplace.jsx`: Portals for discovering and sharing economic opportunities.
- `CareerSimulator.jsx`: Scenario-based learning and interactive progression UI.
- `MicroInternships.jsx`: Module linking users with short-term remote work.
- `SkillTranslator.jsx`: AI service converting everyday experiences into professional resume formats.

### D. Technological Upskilling (`src/pages/tech/`)
- `TechHome.jsx`
- `ProjectGenerator.jsx`: AI tool generating custom code project frameworks for users to learn with.
- `MentorMatch.jsx`: AI algorithm interface suggesting ideal professional tech mentors.
- `HackathonArena.jsx` & `IdeaIncubator.jsx`: Innovation gamification hubs.
- `Leaderboard.jsx`: Gamified ranking system for the tech learning ecosystem.

### E. Community & Networking (`src/pages/community/`)
- `CommunityHome.jsx`
- `Forums.jsx` & `Events.jsx`: Standard post-and-reply interaction zones for peer support.
- `TrustedCircle.jsx`: Intimate, private friend grouping UI.
- `VolunteerNetwork.jsx`: Access portal linking directly into the `LiveTracking` map systems.
- `SkillExchange.jsx`: A barter system interface for users to swap knowledge over capital.

### F. Authentication & Profile Management (`src/pages/auth/` & `src/pages/profile/`)
- Access gateways: `LoginPage.jsx`, `RegisterPage.jsx`, `ForgotPassword.jsx`.
- `OnboardingPage.jsx`: Custom wizard flow for new users.
- `ProfilePage.jsx` & `SettingsPage.jsx`: Portals to configure personal data and application themes.

## 3. UI/UX "Digital Sanctuary" Overhaul
Focused on creating a comforting, premium, and highly responsive user interface across all devices.
- **Global Theming (`src/style.css` & Tailwind config):** Built a scalable CSS variable system defining a "Deep Space" dark mode and a vibrant light mode using primary purple (`#630ed4`) and accent pink (`#B4136D`) functional tokens.
- **Custom Utilities:** Extensively utilized glassmorphism (`.glass`, `.glass-light`), animated glows (`.glow-purple`, `.glow-pink`), and custom CSS keyframe animations (`.breathe`, `.float`, `.shimmer`).
- **Layout Robustness Constraints:** Refactored multiple core pages to use constrained `max-w-4xl mx-auto` wrappers. This successfully eradicated:
  - Scrollbars overlapping right-aligned UI text in the AI Chat.
  - Broken CSS flex grids on the Mood Tracker mobile views.
  - Destructive UI stretching on ultra-wide desktop monitors.
  - Layouts snapping violently due to `scrollIntoView` React bugs.

## 4. Build, Bundling, & Deployment (CI/CD)
- **Vite Optimization:** Configured Rollup build steps to handle large asset chunk warnings (due to Recharts and React-Leaflet).
- **Netlify Deployments:** Integrated automated CLI deployment toolchains (`npm run build` directly to `netlify deploy`). The application's `dist/` bundle was consistently compiled locally and pushed live to a Netlify domain (via Project ID: `b8f87d52-570a-497c-9ba9-e73de837389a`), ensuring all structural and visual updates were instantly available on the public internet.
