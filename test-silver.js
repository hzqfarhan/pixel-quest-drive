const fs = require('fs');
const path = require('path');

const API_KEY = 'fb7eae32-6540-4d16-b879-ba8473fedae3';
const API_URL = 'https://api.pixellab.ai/v1/generate-image-pixflux';

async function main() {
  console.log("Trying silver chest again...");
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      description: 'A shiny silver treasure chest with glowing blue aura, closed, magical 16-bit RPG pixel art, transparent background',
      image_size: { width: 128, height: 128 },
      no_background: true,
    })
  });
  
  if (!response.ok) {
      console.log(`Failed: ${response.status} ${await response.text()}`);
      return;
  }
  
  const data = await response.json();
  const buffer = Buffer.from(data.image.base64, 'base64');
  
  const outDir = path.join(__dirname, 'public', 'assets', 'hp');
  fs.writeFileSync(path.join(outDir, 'chest-silver.png'), buffer);
  console.log("SUCCESS!");
}

main();
