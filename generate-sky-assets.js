const fs = require('fs');
const path = require('path');

const API_KEY = '88faee76-d409-4330-92a3-c465d721cfdd';
const BACKUP_API_KEY1 = 'c1b16cd6-e0a7-48e0-890e-e1b27df4fe84';
const BACKUP_API_KEY2 = '2ca2481a-8a2e-4685-82be-1b770cdaf0b3';
const BACKUP_API_KEY3 = 'd968f24c-5fe5-44e6-8f19-3445020763e2';
const API_URL = 'https://api.pixellab.ai/v1/generate-image-pixflux';

let currentKeyIndex = 0;
const keys = [API_KEY, BACKUP_API_KEY1, BACKUP_API_KEY2, BACKUP_API_KEY3];

async function generateImage(prompt, width, height, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keys[currentKeyIndex]}`
        },
        body: JSON.stringify({
          description: prompt,
          image_size: { width: Math.min(width, 400), height: Math.min(height, 400) },
          no_background: true,
        })
      });

      if (!response.ok) {
        if (response.status === 402 || response.status === 429) {
          console.log(`Key exhausted or rate limited. Switching key...`);
          currentKeyIndex = (currentKeyIndex + 1) % keys.length;
          throw new Error('Key rotation needed');
        }
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (!data.image || !data.image.base64) {
        throw new Error("Invalid response format: missing image.base64");
      }
      return data.image.base64;
    } catch (err) {
      console.error(`Attempt ${i+1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function main() {
  console.log("Starting Sky Asset generation...");
  const publicDir = path.join(__dirname, 'public', 'assets', 'hp');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const assets = [
    // Broom Riders
    { name: 'broom-gryff-day.png', width: 128, height: 32, prompt: "Gryffindor wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, scarlet and gold robes, bright daytime sky, 32x32 per frame, 16-bit pixel art, transparent background" },
    { name: 'broom-gryff-night.png', width: 128, height: 32, prompt: "Gryffindor wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, scarlet and gold robes, glowing golden wand tip, dark starry night, 32x32 per frame, 16-bit pixel art, transparent background" },
    { name: 'broom-slyth-day.png', width: 128, height: 32, prompt: "Slytherin wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, green and silver robes, bright daytime sky, 32x32 per frame, 16-bit pixel art, transparent background" },
    { name: 'broom-slyth-night.png', width: 128, height: 32, prompt: "Slytherin wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, green and silver robes, green glowing wand, dark night sky, 32x32 per frame, 16-bit pixel art, transparent background" },
    { name: 'broom-raven-day.png', width: 128, height: 32, prompt: "Ravenclaw wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, blue and bronze robes, bright daytime sky, 32x32 per frame, 16-bit pixel art, transparent background" },
    { name: 'broom-raven-night.png', width: 128, height: 32, prompt: "Ravenclaw wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, blue and bronze robes, dark night sky, 32x32 per frame, 16-bit pixel art, transparent background" },
    { name: 'broom-huffl-day.png', width: 128, height: 32, prompt: "Hufflepuff wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, yellow and black robes, bright daytime sky, 32x32 per frame, 16-bit pixel art, transparent background" },
    { name: 'broom-huffl-night.png', width: 128, height: 32, prompt: "Hufflepuff wizard on flying broomstick left-to-right 4-frame walk cycle sprite sheet, yellow and black robes, dark night sky, 32x32 per frame, 16-bit pixel art, transparent background" },

    // Owls
    { name: 'owl-hedwig.png', width: 96, height: 32, prompt: "Hedwig white snowy owl in flight, 3-frame wing-flap animation sprite sheet, 32x32 per frame, carrying letter in talons, 16-bit pixel art, transparent background" },
    { name: 'owl-night.png', width: 96, height: 32, prompt: "Tawny owl in flight at night, 3-frame wing-flap animation sprite sheet, 32x32 per frame, glowing amber eyes, 16-bit pixel art, transparent background" },

    // Creatures
    { name: 'golden-snitch.png', width: 64, height: 32, prompt: "Golden snitch with fluttering wings, 2-frame hover animation sprite sheet, 16x32 per frame, metallic gold #FFD700, motion blur on wings, 16-bit pixel art, transparent background" },
    { name: 'dementor.png', width: 64, height: 96, prompt: "Dementor floating menacingly, 2-frame idle animation sprite sheet, 32x96 per frame, black tattered robes, dark shadowy aura, face hidden, 16-bit pixel art, transparent background" },
    { name: 'dragon-silhouette.png', width: 256, height: 64, prompt: "Dragon flying silhouette across sky, 4-frame wing-flap sprite sheet, 64x64 per frame, dark shadow silhouette, large wingspan, 16-bit pixel art, transparent background" },
    
    // Environment / Decoration
    { name: 'rain-overlay.png', width: 64, height: 64, prompt: "Pixel rain tileable texture, diagonal falling raindrops, 2-frame animation, 64x64 tileable, dark blue drops, 16-bit pixel art, transparent background" },
    { name: 'floating-candles.png', width: 128, height: 64, prompt: "Four floating candles in a row, each with flickering flame, 2-frame animation sprite sheet, 128x64, warm candlelight glow, Great Hall style, 16-bit pixel art, transparent background" },
    { name: 'sun-pixel.png', width: 64, height: 64, prompt: "Pixel art sun with animated rays, 2-frame spin animation, 64x64, bright yellow-gold, 16-bit pixel art, transparent background" },
    { name: 'moon-full.png', width: 64, height: 64, prompt: "Full moon with craters, glowing golden-white aura, single frame, 64x64, 16-bit pixel art, transparent background" },
    { name: 'clouds-day.png', width: 256, height: 64, prompt: "Fluffy white pixel clouds drifting, 2-frame animation, 256x64, light blue tint on shadows, 16-bit pixel art, transparent background" },
    { name: 'torch-wall.png', width: 32, height: 64, prompt: "Wall-mounted torch with animated flame, 3-frame flicker, 16x64 per frame, stone bracket, warm orange fire, 16-bit pixel art, transparent background" },
    { name: 'fog-overlay.png', width: 400, height: 100, prompt: "Ground fog mist overlay, 400x100, wispy white-grey fog rolling across bottom of screen, 16-bit pixel art style, transparent top, opaque mist at bottom" }
  ];

  // Batch process to prevent immediate rate limits but keep speed high
  const batchSize = 3;
  for (let i = 0; i < assets.length; i += batchSize) {
    const batch = assets.slice(i, i + batchSize);
    await Promise.all(batch.map(async (asset) => {
      if (fs.existsSync(path.join(publicDir, asset.name))) {
        console.log(`Skipping ${asset.name}, already exists`);
        return;
      }
      try {
        console.log(`Generating ${asset.name}...`);
        const base64Str = await generateImage(asset.prompt, asset.width, asset.height);
        const buffer = Buffer.from(base64Str, 'base64');
        fs.writeFileSync(path.join(publicDir, asset.name), buffer);
        console.log(`✅ Saved ${asset.name}`);
      } catch (err) {
        console.error(`❌ Failed to generate ${asset.name}:`, err.message || err);
      }
    }));
  }
}

main();
