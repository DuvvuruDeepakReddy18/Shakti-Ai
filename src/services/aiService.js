import { safeParseJSON } from "../utils/helpers";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = "openrouter/free";

async function fetchOpenRouter(messages) {
  if (!OPENROUTER_API_KEY) {
    console.warn("OpenRouter API Key is missing. Returning demodata.");
    throw new Error("Missing API Key");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin, // Required by OpenRouter
      "X-Title": "She Care AI"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages,
      temperature: 0.7,
      top_p: 0.95
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 1. AI Companion Chat (Mental Health Support)
export async function chatWithCompanion(message, chatHistory = []) {
  try {
    const systemPrompt = `You are SHAKTI, a compassionate AI companion for women's mental health and empowerment.
       You provide emotional support, coping strategies, and wellness advice.
       Be warm, empathetic, encouraging, and conversational.
       Keep responses concise (2-3 paragraphs max).
       If someone expresses crisis thoughts (self-harm, suicide), ALWAYS:
       1. Express genuine care
       2. Provide helpline numbers: Women Helpline (181), iCall (9152987821), AASRA (9820466726)
       3. Encourage them to reach out to someone they trust
       Never diagnose medical conditions. Focus on listening and supporting.
       Use emojis occasionally to feel friendly. Address the user warmly.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map(msg => ({
        role: msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    return await fetchOpenRouter(messages);
  } catch (error) {
    console.error('AI Companion error:', error);
    return "I'm here for you 💜 I had a brief moment of pause, but I'm back. How can I support you today?";
  }
}

// 2. Skill-to-Income Translator
export async function translateSkills(skills, location) {
  try {
    const systemPrompt = `You are a career advisor for women in India. Given a list of skills and location,
       suggest 5-6 realistic income opportunities. Include freelance, part-time, and full-time options.
       Provide estimated earnings in INR (monthly).
       Return RAW JSON array without markdown code blocks: [{ "title": string, "description": string, "estimatedEarning": string, "platform": string, "difficulty": "Beginner"|"Intermediate"|"Advanced", "timeCommitment": string, "startupCost": string }]`;
    
    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Skills: ${skills.join(", ")}. Location: ${location}. Suggest income opportunities.` }
    ]);
    return safeParseJSON(content) || [];
  } catch (error) {
    console.error('Skill translator error:', error);
    return getDemoSkillResults();
  }
}

// 3. Career Growth Simulator
export async function simulateCareer(currentSkills, targetRole) {
  try {
    const systemPrompt = `You are a career growth simulator for women in India. Given current skills and a target role,
       create a 6-month growth plan with milestones, expected salary progression in INR,
       and recommended free courses/certifications.
       Return RAW JSON without markdown code blocks: { "currentLevel": string, "targetLevel": string, "currentSalary": string, "targetSalary": string, "months": [{ "month": number, "skills": [string], "salary": string, "milestone": string, "course": string }] }`;
       
    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Current skills: ${currentSkills}. Target role: ${targetRole}. Create a 6-month career growth plan.` }
    ]);
    return safeParseJSON(content);
  } catch (error) {
    console.error('Career simulator error:', error);
    return getDemoCareerSimulation();
  }
}

// 4. AI Project Generator
export async function generateProjectIdeas(skills, interests) {
  try {
    const systemPrompt = `Suggest 5 tech project ideas for women in tech based on their skills and interests.
       Each idea should be buildable in 1-4 weeks and have social impact.
       Return RAW JSON array without markdown code blocks: [{ "title": string, "description": string, "techStack": [string], "difficulty": "Beginner"|"Intermediate"|"Advanced", "impact": string, "timeEstimate": string, "learningOutcomes": [string] }]`;
       
    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Skills: ${skills}. Interests: ${interests}. Generate project ideas.` }
    ]);
    return safeParseJSON(content) || [];
  } catch (error) {
    console.error('Project generator error:', error);
    return getDemoProjectIdeas();
  }
}

// 5. Emotion Analysis
export async function analyzeEmotion(text) {
  try {
    const systemPrompt = `Analyze the emotional state from this text. Return RAW JSON without markdown code blocks:
       { "primaryEmotion": string, "intensity": number (1-10), "sentiment": "positive"|"neutral"|"negative",
         "suggestion": "brief wellness tip (1-2 sentences)", "needsSupport": boolean }`;
         
    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: text }
    ]);
    return safeParseJSON(content);
  } catch (error) {
    console.error('Emotion analysis error:', error);
    return { primaryEmotion: 'neutral', intensity: 5, sentiment: 'neutral', suggestion: 'Take a moment to breathe deeply.', needsSupport: false };
  }
}

// 6. Safety Route Analysis
export async function analyzeRouteSafety(origin, destination, timeOfDay) {
  try {
    const systemPrompt = `You are a safety advisor for women in India. Given an origin, destination, and time of day,
       provide safety analysis. Rate safety 1-10 and provide practical tips.
       Return RAW JSON without markdown code blocks: { "safetyScore": number, "riskFactors": [string], "tips": [string], "recommendation": string }`;
       
    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Route from ${origin} to ${destination} at ${timeOfDay}. Analyze safety for a woman traveling alone.` }
    ]);
    return safeParseJSON(content);
  } catch (error) {
    console.error('Route safety error:', error);
    return { safetyScore: 7, riskFactors: ['Unknown area'], tips: ['Stay alert', 'Share location'], recommendation: 'Use well-lit main roads' };
  }
}

// 7. Wellness Activity Suggestions
export async function suggestWellnessActivity(mood, energyLevel, timeAvailable) {
  try {
    const systemPrompt = `Suggest a quick wellness activity for a woman based on her current state.
       CRITICAL: The activity MUST be perfectly tailored to EXACTLY ${timeAvailable} minutes. 
       Do not suggest a 15-minute activity if they only have 3 minutes, and do not suggest a 3-minute activity if they have 15 minutes.
       Be specific, warm, and actionable. Include breathing exercises, stretches, or mindfulness. 
       Make sure the suggestion is unique and different every time.
       Return RAW JSON without markdown code blocks: { "activity": string, "duration": string, "steps": [string], "benefits": [string], "encouragement": string }`;
       
    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Mood: ${mood}, Energy: ${energyLevel}/10, Time available: ${timeAvailable} minutes. Give me a fresh, unique wellness activity.` }
    ]);
    const result = safeParseJSON(content);
    if (!result || !result.activity) throw new Error("Invalid response");
    return result;
  } catch (error) {
    console.error('Wellness suggestion error:', error);
    const timeNum = Number(timeAvailable);
    if (timeNum >= 15) {
      return { activity: 'Mindful Body Scan', duration: '15 minutes', steps: ['Lie down comfortably', 'Focus on your toes', 'Slowly move attention up your body', 'Release tension in each area', 'Rest in stillness'], benefits: ['Deep relaxation', 'Body awareness'], encouragement: 'Take this time to truly unwind 💜' };
    } else if (timeNum >= 10) {
      return { activity: 'Journaling & Reflection', duration: '10 minutes', steps: ['Get a notebook', 'Write down 3 things you are grateful for', 'Describe your current feelings', 'Write an affirmation for the day'], benefits: ['Emotional clarity', 'Stress relief'], encouragement: 'Your thoughts are valid and important 💜' };
    } else if (timeNum >= 5) {
      return { activity: 'Gentle Stretching', duration: '5 minutes', steps: ['Stand up straight', 'Roll your shoulders back 5 times', 'Reach your arms up high', 'Gently touch your toes', 'Take 3 deep breaths'], benefits: ['Releases tension', 'Boosts energy'], encouragement: 'Movement is medicine for the soul 💜' };
    }
    return { activity: 'Deep Breathing', duration: '3 minutes', steps: ['Breathe in for 4 counts', 'Hold for 4 counts', 'Breathe out for 6 counts', 'Repeat 5 times'], benefits: ['Reduces stress', 'Calms mind'], encouragement: 'You deserve this moment of peace 💜' };
  }
}

// 8. Mentor Matchmaking Analysis
export async function matchMentor(userProfile) {
  try {
    const systemPrompt = `Given a user profile of a woman in tech, suggest ideal mentor characteristics.
       Return RAW JSON without markdown code blocks: { "idealMentorProfile": string, "matchingSkills": [string], "suggestedTopics": [string], "meetingFrequency": string, "growthAreas": [string] }`;
       
    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(userProfile) }
    ]);
    return safeParseJSON(content);
  } catch (error) {
    console.error('Mentor match error:', error);
    return {
      idealMentorProfile: "Senior Full Stack Developer with 5+ years of experience in product-led companies.",
      matchingSkills: ["React", "System Architecture", "Leadership"],
      suggestedTopics: ["Navigating technical interviews", "Code review best practices", "Salary negotiation"],
      meetingFrequency: "Bi-weekly 45-minute sessions",
      growthAreas: ["System Design", "Backend Scaling", "Confidence in meetings"]
    };
  }
}

// 9. "Is This Normal?" AI Analyzer
export async function analyzeIncident(description) {
  try {
    const systemPrompt = `You are an expert legal and psychological advisor for women's safety in India. Analyze the following incident description.
       Determine if it's normal workplace/social behavior or a violation of boundaries/laws.
       Return RAW JSON without markdown code blocks:
       {
         "category": "Workplace Harassment" | "Cyberstalking" | "Domestic Abuse" | "Boundary Violation" | "Normal Behavior",
         "isLegallyActionable": boolean,
         "severity": "Low" | "Medium" | "High" | "Critical",
         "analysis": "Brief 2-3 sentence explanation of why this is or isn't normal.",
         "actionSteps": ["Step 1", "Step 2", "Step 3"],
         "helplines": [{"name": "Name of helpline", "number": "Phone number"}]
       }`;
       
    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: description }
    ]);
    return safeParseJSON(content);
  } catch (error) {
    console.error('Incident analysis error:', error);
    return {
      category: "Boundary Violation",
      isLegallyActionable: false,
      severity: "Medium",
      analysis: "This behavior crosses professional boundaries and is not normal. While it may not immediately be legally actionable without a clear policy violation, it is creating an uncomfortable environment.",
      actionSteps: [
        "Document all interactions, keeping screenshots and timestamps.",
        "Set clear, written boundaries with the person involved.",
        "Report to HR if the behavior continues after boundaries are set."
      ],
      helplines: [
        { name: "Women Helpline", number: "1091" },
        { name: "National Cyber Crime Reporting", number: "1930" }
      ]
    };
  }
}

// Demo/Fallback data
function getDemoSkillResults() {
  return [
    { title: 'Online Tutoring', description: 'Teach students online via platforms like Vedantu or Chegg', estimatedEarning: '₹15,000-30,000/month', platform: 'Vedantu, Chegg, Byju\'s', difficulty: 'Beginner', timeCommitment: '3-4 hours/day', startupCost: 'None' },
    { title: 'Freelance Content Writing', description: 'Write articles, blogs, and copy for businesses', estimatedEarning: '₹20,000-50,000/month', platform: 'Upwork, Fiverr, ContentFly', difficulty: 'Intermediate', timeCommitment: '4-5 hours/day', startupCost: 'None' },
    { title: 'Social Media Management', description: 'Manage social media accounts for small businesses', estimatedEarning: '₹10,000-25,000/month', platform: 'Direct clients, Freelancer', difficulty: 'Beginner', timeCommitment: '2-3 hours/day', startupCost: 'None' },
    { title: 'Home-based Tiffin Service', description: 'Prepare and deliver home-cooked meals locally', estimatedEarning: '₹20,000-40,000/month', platform: 'Swiggy Home Chef, WhatsApp', difficulty: 'Beginner', timeCommitment: '5-6 hours/day', startupCost: '₹5,000-10,000' },
    { title: 'Data Entry & Virtual Assistant', description: 'Provide administrative support remotely', estimatedEarning: '₹12,000-20,000/month', platform: 'Belay, Time Etc, Upwork', difficulty: 'Beginner', timeCommitment: '4-6 hours/day', startupCost: 'None' }
  ];
}

function getDemoCareerSimulation() {
  return {
    currentLevel: 'Beginner',
    targetLevel: 'Mid-Level Professional',
    currentSalary: '₹15,000/month',
    targetSalary: '₹45,000/month',
    months: [
      { month: 1, skills: ['HTML/CSS', 'JavaScript basics'], salary: '₹15,000', milestone: 'Complete web fundamentals', course: 'freeCodeCamp Web Development' },
      { month: 2, skills: ['React basics', 'Git'], salary: '₹18,000', milestone: 'Build first React project', course: 'Scrimba React Course (Free)' },
      { month: 3, skills: ['React advanced', 'API integration'], salary: '₹22,000', milestone: 'Build portfolio website', course: 'The Odin Project' },
      { month: 4, skills: ['Node.js', 'Database basics'], salary: '₹28,000', milestone: 'First freelance project', course: 'Coursera Full Stack Course' },
      { month: 5, skills: ['Full stack', 'Testing'], salary: '₹35,000', milestone: 'Complete 3 client projects', course: 'Frontend Masters (Free trial)' },
      { month: 6, skills: ['DevOps basics', 'System design'], salary: '₹45,000', milestone: 'Land mid-level role', course: 'LinkedIn Learning' }
    ]
  };
}

function getDemoProjectIdeas() {
  return [
    { title: 'SafeWalk - Women Safety App', description: 'A community-driven app that maps safe walking routes and lets women share real-time locations', techStack: ['React', 'Firebase', 'Google Maps API'], difficulty: 'Intermediate', impact: 'Improve women\'s mobility safety', timeEstimate: '3 weeks', learningOutcomes: ['Maps API', 'Real-time databases', 'Geolocation'] },
    { title: 'SkillHer - Micro-learning Platform', description: 'A mobile-first platform with 5-minute skill lessons for women entrepreneurs', techStack: ['React Native', 'Node.js', 'MongoDB'], difficulty: 'Intermediate', impact: 'Upskill underserved women', timeEstimate: '4 weeks', learningOutcomes: ['Mobile development', 'Content management', 'User engagement'] },
    { title: 'GreenBasket - Sustainable Shopping Tracker', description: 'Track carbon footprint of purchases and suggest sustainable alternatives', techStack: ['React', 'Python', 'Chart.js'], difficulty: 'Beginner', impact: 'Promote sustainable living', timeEstimate: '2 weeks', learningOutcomes: ['Data visualization', 'API integration', 'Environmental awareness'] }
  ];
}
