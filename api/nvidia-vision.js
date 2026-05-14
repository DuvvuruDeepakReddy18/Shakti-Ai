export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.VITE_FIREBASE_API_KEY || 'AIzaSyADqFCQbP0Y6TY0IjuxoNtI6NKdhXvPr5k';
    
    const base64Data = image.split(',')[1];
    const mimeType = image.match(/data:(.*?);/)?.[1] || 'image/jpeg';

    // SINGLE-STEP: Gemini sees the image, identifies food, AND analyzes hormonal impact — all at once
    const FULL_PROMPT = `You are a women's health nutrition expert. Look at this food image carefully.

1. Identify every food and drink item visible.
2. Analyze each item for its impact on women's hormonal health — specifically PCOS, estrogen dominance, thyroid disorders, and endocrine disruption.
3. Suggest safer alternatives for any flagged items.

Reply ONLY with valid JSON, no markdown, no code fences, no explanation:
{"ingredients":["item1","item2"],"flagged":[{"name":"item","impact":"short explanation of hormonal impact","severity":"High"|"Medium"|"Low"}],"safeAlternatives":["alternative 1","alternative 2"]}`;

    console.log('[Gemini] Sending image for single-step food + hormonal analysis...');
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: FULL_PROMPT },
              { inline_data: { mime_type: mimeType, data: base64Data } }
            ]
          }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.2 }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('[Gemini] Error:', errText);
      return res.status(500).json({ error: 'Vision analysis failed', details: errText });
    }

    const geminiData = await geminiResponse.json();
    const resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (!resultText) {
      console.error('[Gemini] No response text');
      return res.status(200).json({
        choices: [{
          message: {
            content: JSON.stringify({ ingredients: [], flagged: [], safeAlternatives: [] })
          }
        }]
      });
    }

    console.log('[Gemini] Got analysis result');
    
    // Return in the format the frontend expects
    return res.status(200).json({
      choices: [{
        message: { content: resultText }
      }]
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
