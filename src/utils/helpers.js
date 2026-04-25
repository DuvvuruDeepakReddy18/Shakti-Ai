import { format, formatDistanceToNow, differenceInDays, addDays, isToday, isYesterday } from 'date-fns';

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
};

// Format time ago
export const timeAgo = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  return formatDistanceToNow(d, { addSuffix: true });
};

// Get greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Calculate safety score color
export const getSafetyColor = (score) => {
  if (score >= 8) return '#10B981';
  if (score >= 5) return '#F59E0B';
  return '#EF4444';
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Calculate cycle phase
export const getCyclePhase = (lastPeriodDate, cycleLength = 28) => {
  if (!lastPeriodDate) return null;
  const today = new Date();
  const lastPeriod = new Date(lastPeriodDate);
  const daysSincePeriod = differenceInDays(today, lastPeriod) % cycleLength;
  
  if (daysSincePeriod <= 5) return 'period';
  if (daysSincePeriod <= 13) return 'follicular';
  if (daysSincePeriod <= 16) return 'ovulation';
  return 'luteal';
};

// Predict next period
export const predictNextPeriod = (lastPeriodDate, cycleLength = 28) => {
  if (!lastPeriodDate) return null;
  const lastPeriod = new Date(lastPeriodDate);
  const today = new Date();
  let nextPeriod = addDays(lastPeriod, cycleLength);
  while (nextPeriod < today) {
    nextPeriod = addDays(nextPeriod, cycleLength);
  }
  return nextPeriod;
};

// Format currency in INR
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate distance between two coordinates (in km)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Parse JSON safely from AI responses
export const safeParseJSON = (text) => {
  try {
    // Try direct parse
    return JSON.parse(text);
  } catch {
    try {
      // Try extracting JSON from markdown code blocks
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) return JSON.parse(match[1].trim());
      // Try finding JSON array or object
      const jsonMatch = text.match(/[\[{][\s\S]*[\]}]/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
};
