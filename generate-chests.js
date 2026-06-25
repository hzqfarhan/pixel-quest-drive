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
          console.log(`Key ${currentKeyIndex + 1} limit reached. Switching keys...`);
          currentKeyIndex = (currentKeyIndex + 1) % keys.length;
          // Wait briefly before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue; 
        }
        throw new Error(`API returned ${response.status}: ${await response.text()}`);
      }

      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer);
    } catch (err) {
      console.error(`Attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5s before retry
    }
  }
}

const chests = [
  {
    name: 'chest-bronze.png',
    prompt: 'A rusty bronze treasure chest with glowing amber aura, closed, magical 16-bit RPG pixel art, transparent background'
  },
  {
    name: 'chest-silver.png',
    prompt: 'A shiny silver treasure chest with glowing blue aura, closed, magical 16-bit RPG pixel art, transparent background'
  },
  {
    name: 'chest-gold.png',
    prompt: 'A radiant gold treasure chest with glowing yellow aura, closed, magical 16-bit RPG pixel art, transparent background'
  },
  {
    name: 'chest-amethyst.png',
    prompt: 'A dark purple amethyst crystal treasure chest with glowing magenta aura, closed, magical 16-bit RPG pixel art, transparent background'
  },
  {
    name: 'chest-emerald.png',
    prompt: 'A bright green emerald treasure chest with glowing green aura, closed, magical 16-bit RPG pixel art, transparent background'
  },
  {
    name: 'chest-ruby.png',
    prompt: 'A fiery red ruby treasure chest with glowing crimson aura, closed, magical 16-bit RPG pixel art, transparent background'
  },
  {
    name: 'chest-obsidian.png',
    prompt: 'A pitch black obsidian dark magic chest with glowing purple aura, closed, magical 16-bit RPG pixel art, transparent background'
  },
];

async function main() {
  console.log('Starting Magical Chest Generation...');
  const outDir = path.join(__dirname, 'public', 'assets', 'hp');
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const asset of chests) {
    const destPath = path.join(outDir, asset.name);
    if (fs.existsSync(destPath)) {
      console.log(`Skipping ${asset.name}, already exists`);
      continue;
    }
    
    console.log(`Generating ${asset.name}...`);
    try {
      const imgBuffer = await generateImage(asset.prompt, 128, 128, 3);
      fs.writeFileSync(destPath, imgBuffer);
      console.log(`✅ Saved ${asset.name}`);
    } catch (err) {
      console.error(`❌ Failed to generate ${asset.name}: ${err.message}`);
    }
    // Pause slightly between generations
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

main().catch(console.error);
