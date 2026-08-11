import { safeParseJSON } from "../utils/helpers";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Verified-working free models on OpenRouter (largest/strongest first).
// The previous list had deprecated/rate-limited models which always fell to demo.
const DEFAULT_MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'nvidia/nemotron-3.5-lightning:free',
  'openai/gpt-oss-20b:free',
  'google/gemma-4-31b-it:free',
];

// Same pool ordered for latency — lightning answers ~5x faster than ultra.
const FAST_MODELS = [
  'nvidia/nemotron-3.5-lightning:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'openai/gpt-oss-20b:free',
  'google/gemma-4-31b-it:free',
];

async function fetchOpenRouter(messages, options = {}) {
  if (!OPENROUTER_API_KEY) {
    console.warn("OpenRouter API Key is missing. Returning demo data.");
    throw new Error("Missing API Key");
  }

  const models = options.fast ? FAST_MODELS : DEFAULT_MODELS;

  // Lower temperature by default — most callers want structured JSON.
  const temperature = options.temperature ?? 0.3;
  const top_p = options.top_p ?? 0.9;

  let lastError = null;
  for (const model of models) {
    try {
      const controller = new AbortController();
      // Free-tier latency varies widely (6s-35s observed) — abort too early and
      // every model in the chain gets killed mid-generation, landing on demo data.
      const timer = setTimeout(() => controller.abort(), 45000);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "She Care AI"
        },
        body: JSON.stringify({
          model, messages, temperature, top_p,
          // Nemotron models are reasoners; low effort cuts latency 2-5x on these JSON tasks.
          ...(model.startsWith('nvidia/') ? { reasoning: { effort: 'low' } } : {}),
        })
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`OpenRouter ${response.status} for ${model}: ${errorText.slice(0, 200)}`);
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      if (data.error) {
        console.warn(`OpenRouter API error for ${model}:`, data.error);
        lastError = new Error(data.error.message || 'API error');
        continue;
      }

      const content = data?.choices?.[0]?.message?.content;
      if (!content || !content.trim()) {
        console.warn(`Empty content from ${model}`);
        lastError = new Error('Empty response');
        continue;
      }

      return content;
    } catch (error) {
      console.warn(`Fetch error for ${model}:`, error?.message || error);
      lastError = error;
      continue;
    }
  }

  throw new Error(lastError?.message || "All available AI models failed.");
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
    const systemPrompt = `You are a career advisor for women in India. Given a list of skills and a city,
       suggest 6 realistic income opportunities that are SPECIFIC to those exact skills — never generic filler
       like tutoring or content writing unless the skills genuinely point there.
       Rules:
       - Every opportunity must directly use at least one of the given skills; name it in "usesSkill".
       - Tailor each to the given city: local demand, realistic local rates in INR per month, and where to find this work in that city.
       - All 6 must be clearly distinct from each other (no near-duplicates).
       - Mix freelance, remote, part-time, full-time, and local in-person options.
       Return RAW JSON array without markdown code blocks: [{ "title": string, "description": string, "usesSkill": string, "estimatedEarning": string, "platform": string, "difficulty": "Beginner"|"Intermediate"|"Advanced", "timeCommitment": string, "startupCost": string, "searchKeywords": string }]
       "searchKeywords" is the 2-4 word phrase someone would type on a job site to find this exact work (e.g. "react developer", "home tuition maths").`;

    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Skills: ${skills.join(", ")}. City: ${location}. Suggest income opportunities.` }
    ], { fast: true });
    const parsed = safeParseJSON(content);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Empty AI result');
    // Drop near-duplicate titles the model may still produce
    const seen = new Set();
    return parsed.filter(r => {
      const key = (r.title || '').toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (error) {
    console.error('Skill translator error:', error);
    return getDemoSkillResults().map(r => ({ ...r, isDemo: true }));
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
    ], { fast: true });
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
    const systemPrompt = `You are an empathetic, supportive, and objective safety advisor for women. 
Your job is to analyze the situation described by the user and determine if it is "normal", "concerning", or "dangerous".
You must respond ONLY with a valid JSON object in this exact format, with no markdown formatting or extra text outside the JSON:
{
  "verdict": "normal" | "concerning" | "dangerous",
  "title": "A short, supportive, and clear title summarizing your assessment",
  "summary": "A compassionate but objective 2-3 sentence summary explaining why this behavior is or isn't acceptable.",
  "steps": [
    "Actionable, practical step 1",
    "Actionable, practical step 2",
    "Actionable, practical step 3"
  ],
  "helplines": ["Relevant helpline 1", "Relevant helpline 2"]
}
Always include standard Indian women's helplines if the situation is concerning or dangerous (e.g., 'Women Helpline: 181', 'National Emergency: 112', 'NCW: 7827170170'). Keep steps highly practical, emphasizing boundaries, documentation, and safety.`;
       
    const content = await fetchOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: description }
    ]);
    const result = safeParseJSON(content);
    if (!result) throw new Error("Invalid response format");
    return result;
  } catch (error) {
    console.error('Incident analysis error:', error);
    return {
      verdict: "concerning",
      title: "Boundary Violation",
      summary: "This behavior crosses professional boundaries and is not normal. While it may not immediately be legally actionable without a clear policy violation, it is creating an uncomfortable environment.",
      steps: [
        "Document all interactions, keeping screenshots and timestamps.",
        "Set clear, written boundaries with the person involved.",
        "Report to HR if the behavior continues after boundaries are set."
      ],
      helplines: [
        "Women Helpline: 1091",
        "National Cyber Crime Reporting: 1930"
      ]
    };
  }
}

// 10. ATS Resume Analyzer
export async function analyzeResume(extractedText) {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) and career coach. Analyze the resume below and return ONLY a single JSON object — no markdown, no commentary, no leading or trailing text.

REQUIRED FIELDS (all must be present, no nulls):
- "score": integer 0-100 representing overall ATS compatibility
- "roles": array of EXACTLY 3 objects, each with "title" (string) and "matchScore" (integer 0-100), sorted highest matchScore first
- "missingKeywords": array of 3-6 short strings (industry keywords the resume lacks)
- "strengths": array of 3-5 short strings (what the resume does well)
- "improvement": object with "original" (a real bullet from the resume), "rewritten" (a stronger version with metrics), "reason" (one sentence explaining the change)

Example shape (do NOT copy values — derive them from the resume):
{"score":78,"roles":[{"title":"Frontend Developer","matchScore":86},{"title":"UI Designer","matchScore":72},{"title":"Technical Writer","matchScore":55}],"missingKeywords":["TypeScript","Testing","CI/CD"],"strengths":["Action verbs","Clear metrics"],"improvement":{"original":"Worked on web app.","rewritten":"Built a React SPA serving 10k MAU, cut load time by 35%.","reason":"Quantifies scale and impact."}}

Resume text:
"""
${extractedText.substring(0, 4000)}
"""`;

  // Try up to 3 models — bail and try next if response is missing required fields
  const validate = (r) =>
    r &&
    typeof r.score === 'number' &&
    Array.isArray(r.roles) && r.roles.length >= 1 &&
    Array.isArray(r.missingKeywords) &&
    Array.isArray(r.strengths) &&
    r.improvement && typeof r.improvement === 'object';

  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const content = await fetchOpenRouter([
        { role: "system", content: systemPrompt },
        { role: "user", content: "Analyze my resume." }
      ]);
      const result = safeParseJSON(content);
      if (validate(result)) {
        // Clamp score to 0-100 in case the model returned something out of range
        result.score = Math.max(0, Math.min(100, Math.round(result.score)));
        result.roles = result.roles.map((r) => ({
          title: String(r.title || 'Role'),
          matchScore: Math.max(0, Math.min(100, Math.round(Number(r.matchScore) || 0))),
        }));
        return result;
      }
      console.warn('Resume analysis returned incomplete JSON, retrying...', result);
      lastError = new Error('Incomplete JSON');
    } catch (error) {
      console.warn('Resume analysis attempt failed:', error?.message || error);
      lastError = error;
    }
  }
  throw lastError || new Error('Resume analysis failed after retries');
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
