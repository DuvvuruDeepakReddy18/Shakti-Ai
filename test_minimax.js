import fetch from 'node-fetch';

async function test() {
  const extractedText = "Sugar, Water, High Fructose Corn Syrup, BHT, Red 40, Yellow 5, Artificial Flavor";
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer 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`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "minimax/minimax-m2.5:free",
      "messages": [
        {
          "role": "user",
          "content": `Analyze this extracted food ingredient label text: "${extractedText}". Identify any hormone-disrupting ingredients (especially those affecting PCOS, estrogen dominance, etc.). Respond ONLY with a valid JSON object in this exact format: {"ingredients": ["ingredient1", ...], "flagged": [{"name": "...", "impact": "...", "severity": "High"|"Medium"|"Low"}], "safeAlternatives": ["...", "..."]}`
        }
      ]
    })
  });
  const data = await response.json();
  console.log(data.choices[0].message.content);
}

test();
