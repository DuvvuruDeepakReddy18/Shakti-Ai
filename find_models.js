import fetch from 'node-fetch';

async function findModels() {
  const res = await fetch("https://openrouter.ai/api/v1/models");
  const data = await res.json();
  const freeGoogle = data.data.filter(m => m.id.includes("google") && m.pricing && parseFloat(m.pricing.prompt) === 0);
  console.log(freeGoogle.map(m => m.id));
}
findModels();
