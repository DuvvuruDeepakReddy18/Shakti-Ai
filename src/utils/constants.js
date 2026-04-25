// App-wide constants
export const APP_NAME = "SHAKTI AI";
export const APP_TAGLINE = "Your Intelligent Safety Companion";

// Module definitions
export const MODULES = {
  safety: {
    id: 'safety',
    name: 'Safety',
    icon: 'Shield',
    color: '#EF4444',
    path: '/safety',
    description: 'Smart Safety System'
  },
  jobs: {
    id: 'jobs',
    name: 'Jobs',
    icon: 'Briefcase',
    color: '#F59E0B',
    path: '/jobs',
    description: 'Employment Engine'
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    icon: 'Laptop',
    color: '#3B82F6',
    path: '/tech',
    description: 'Women in Tech'
  },
  health: {
    id: 'health',
    name: 'Health',
    icon: 'Heart',
    color: '#EC4899',
    path: '/health',
    description: 'Health & Wellness'
  },
  community: {
    id: 'community',
    name: 'Community',
    icon: 'Users',
    color: '#10B981',
    path: '/community',
    description: 'Community & Support'
  }
};

// Mood options
export const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#10B981' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: '#3B82F6' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#F59E0B' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#8B5CF6' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#EF4444' }
];

// Skill categories
export const SKILL_CATEGORIES = [
  'Coding', 'Teaching', 'Writing', 'Design', 'Marketing',
  'Cooking', 'Sewing', 'Data Entry', 'Customer Service',
  'Healthcare', 'Photography', 'Video Editing', 'Social Media',
  'Accounting', 'Crafts', 'Music', 'Fitness', 'Consulting',
  'Translation', 'Tutoring', 'Event Planning', 'Gardening'
];

// User modes
export const USER_MODES = [
  { id: 'student', label: 'Student', icon: '🎓', description: 'Focus on learning, internships & tech' },
  { id: 'professional', label: 'Professional', icon: '💼', description: 'Career growth, networking & leadership' },
  { id: 'caregiver', label: 'Caregiver', icon: '🤱', description: 'Flexible work, wellness & support' }
];

// Forum categories
export const FORUM_CATEGORIES = [
  { id: 'safety', label: 'Safety', color: '#EF4444' },
  { id: 'career', label: 'Career', color: '#F59E0B' },
  { id: 'health', label: 'Health', color: '#EC4899' },
  { id: 'tech', label: 'Tech', color: '#3B82F6' },
  { id: 'general', label: 'General', color: '#10B981' }
];

// Menstrual cycle phases
export const CYCLE_PHASES = {
  period: { label: 'Period', color: '#EF4444', description: 'Menstruation phase' },
  follicular: { label: 'Follicular', color: '#10B981', description: 'Growing energy phase' },
  ovulation: { label: 'Ovulation', color: '#3B82F6', description: 'Peak energy phase' },
  luteal: { label: 'Luteal', color: '#F59E0B', description: 'Winding down phase' }
};

// Crisis helpline numbers
export const HELPLINES = [
  { name: 'Women Helpline', number: '181', description: 'National Women Helpline' },
  { name: 'Police', number: '100', description: 'Emergency Police' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', description: 'Mental Health Support' },
  { name: 'iCall', number: '9152987821', description: 'Psychosocial Helpline' },
  { name: 'AASRA', number: '9820466726', description: 'Crisis Intervention' }
];

// Job categories
export const JOB_CATEGORIES = [
  { id: 'all', label: 'All Jobs' },
  { id: 'technology', label: 'Technology' },
  { id: 'design', label: 'Design' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'finance', label: 'Finance' },
  { id: 'content', label: 'Content Writing' },
  { id: 'handicrafts', label: 'Handicrafts' },
  { id: 'food', label: 'Food & Catering' },
  { id: 'consulting', label: 'Consulting' }
];
