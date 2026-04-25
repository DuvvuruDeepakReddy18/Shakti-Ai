import fetch from 'node-fetch';

async function testVision() {
  const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

  // Test models one at a time with delay
  const models = [
    "google/gemma-3-12b-it:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "google/gemma-3-4b-it:free",
  ];

  for (const model of models) {
    console.log(`\n--- Testing: ${model} ---`);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": model,
          "max_tokens": 800,
          "messages": [
            {
              "role": "user",
              "content": [
                {
                  "type": "text", 
                  "text": "Identify the food items visible in this image. List them as a comma-separated list. If you cannot see food, say 'no food detected'."
                },
                {
                  "type": "image_url",
                  "image_url": { "url": base64Image }
                }
              ]
            }
          ]
        })
      });
      const data = await response.json();
      if (data.error) {
        console.log("ERROR:", data.error.message);
      } else if (data.choices && data.choices[0]) {
        console.log("RESPONSE:", data.choices[0].message.content.substring(0, 400));
      }
    } catch (e) {
      console.log("EXCEPTION:", e.message);
    }
    // small delay between calls
    await new Promise(r => setTimeout(r, 2000));
  }
}

testVision();
