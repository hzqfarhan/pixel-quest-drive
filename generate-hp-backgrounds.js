const fs = require('fs');
const path = require('path');

const API_KEY = 'c57aebb8-ecb1-4ea3-975a-b976ea849b7a';
const API_URL = 'https://api.pixellab.ai/v1/generate-image-pixflux';

async function generateImage(prompt, width, height) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      description: prompt,
      image_size: { width, height },
      no_background: false, // We want the full scene
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  if (!data.image || !data.image.base64) {
    throw new Error("Invalid response format: missing image.base64");
  }
  return data.image.base64;
}

async function main() {
  console.log("Starting Pixellab HP Background generation...");
  
  const publicDir = path.join(__dirname, 'public', 'assets', 'hp');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const assetsToGenerate = [
    {
      name: 'hogwarts-day.png',
      prompt: 'Hogwarts castle exterior during the day, bright sunny blue sky, beautiful magical building, highly detailed, 16-bit retro RPG background, pixel art landscape',
      width: 400,
      height: 225
    },
    {
      name: 'hogwarts-night.png',
      prompt: 'Hogwarts castle exterior during the night, starry sky, glowing windows, dark mystical atmosphere, beautiful magical building, highly detailed, 16-bit retro RPG background, pixel art landscape',
      width: 400,
      height: 225
    }
  ];

  for (const asset of assetsToGenerate) {
    try {
      console.log(`Generating ${asset.name}...`);
      const base64Str = await generateImage(asset.prompt, asset.width, asset.height);
      const buffer = Buffer.from(base64Str, 'base64');
      fs.writeFileSync(path.join(publicDir, asset.name), buffer);
      console.log(`✅ Saved ${asset.name}`);
    } catch (err) {
      console.error(`❌ Failed to generate ${asset.name}:`, err.message || err);
    }
  }
}

main();
