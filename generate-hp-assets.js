const fs = require('fs');
const path = require('path');

const API_KEY = 'c57aebb8-ecb1-4ea3-975a-b976ea849b7a';
const API_URL = 'https://api.pixellab.ai/v1/generate-image-pixflux';

async function generateImage(prompt, size) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      description: prompt,
      image_size: { width: size, height: size },
      no_background: true,
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
  console.log("Starting Pixellab HP asset generation via fetch...");
  
  const publicDir = path.join(__dirname, 'public', 'assets', 'hp');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const assetsToGenerate = [
    {
      name: 'gryffindor.png',
      prompt: 'a Gryffindor student wizard character wearing red and gold robes, Harry Potter, full body sprite, facing forward, 32x32 8-bit style, pixel art',
    },
    {
      name: 'ravenclaw.png',
      prompt: 'a Ravenclaw student wizard character wearing blue and silver robes, Harry Potter, full body sprite, facing forward, 32x32 8-bit style, pixel art',
    },
    {
      name: 'slytherin.png',
      prompt: 'a Slytherin student wizard character wearing green and silver robes, Harry Potter, full body sprite, facing forward, 32x32 8-bit style, pixel art',
    },
    {
      name: 'hufflepuff.png',
      prompt: 'a Hufflepuff student wizard character wearing yellow and black robes, Harry Potter, full body sprite, facing forward, 32x32 8-bit style, pixel art',
    },
    {
      name: 'sorting-hat.png',
      prompt: 'the magical Sorting Hat from Harry Potter, old brown wizard hat, centered, 32x32 8-bit style, pixel art',
    },
    {
      name: 'hogwarts-trunk.png',
      prompt: 'a magical Hogwarts student trunk, wooden chest with brass fittings and stickers, closed, 64x64 8-bit style, pixel art',
      size: 64,
    },
    {
      name: 'galleon.png',
      prompt: 'a golden Galleon coin from Harry Potter, shiny gold wizard money, centered, 32x32 8-bit style, pixel art',
      size: 32,
    }
  ];

  for (const asset of assetsToGenerate) {
    try {
      console.log(`Generating ${asset.name}...`);
      const base64Str = await generateImage(asset.prompt, asset.size || 32);
      const buffer = Buffer.from(base64Str, 'base64');
      fs.writeFileSync(path.join(publicDir, asset.name), buffer);
      console.log(`✅ Saved ${asset.name}`);
    } catch (err) {
      console.error(`❌ Failed to generate ${asset.name}:`, err.message || err);
    }
  }
}

main();
