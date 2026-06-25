const fs = require('fs');
const path = require('path');

const API_KEYS = [
  'fb7eae32-6540-4d16-b879-ba8473fedae3'
];
const API_URL = 'https://api.pixellab.ai/v1/generate-image-pixflux';

const chests = [
  { name: 'chest-bronze.png', prompt: 'A rusty bronze treasure chest with glowing amber aura, closed, magical 16-bit RPG pixel art, transparent background' },
  { name: 'chest-silver.png', prompt: 'A shiny silver treasure chest with glowing blue aura, closed, magical 16-bit RPG pixel art, transparent background' },
  { name: 'chest-gold.png', prompt: 'A radiant gold treasure chest with glowing yellow aura, closed, magical 16-bit RPG pixel art, transparent background' },
  { name: 'chest-amethyst.png', prompt: 'A dark purple amethyst crystal treasure chest with glowing magenta aura, closed, magical 16-bit RPG pixel art, transparent background' },
  { name: 'chest-emerald.png', prompt: 'A bright green emerald treasure chest with glowing green aura, closed, magical 16-bit RPG pixel art, transparent background' },
  { name: 'chest-ruby.png', prompt: 'A fiery red ruby treasure chest with glowing crimson aura, closed, magical 16-bit RPG pixel art, transparent background' },
  { name: 'chest-obsidian.png', prompt: 'A pitch black obsidian dark magic chest with glowing purple aura, closed, magical 16-bit RPG pixel art, transparent background' }
];

async function generateImage(prompt, width, height, key) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        description: prompt,
        image_size: { width: Math.min(width, 400), height: Math.min(height, 400) },
        no_background: true,
      }),
      signal: controller.signal
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
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  console.log('Regenerating Chests with Key Rotation...');
  const outDir = path.join(__dirname, 'public', 'assets', 'hp');
  const artifactDir = "C:\\Users\\haziq\\.gemini\\antigravity-ide\\brain\\34f52742-c052-4200-9492-7911ed7a8f4c";
  
  let keyIdx = 0;

  for (const asset of chests) {
    const filePath = path.join(outDir, asset.name);
    if (fs.existsSync(filePath)) {
      const header = fs.readFileSync(filePath, { length: 4 }).toString('utf8');
      if (header.includes('PNG')) {
        console.log(`Skipping ${asset.name}, already valid.`);
        continue;
      }
    }
    
    let success = false;
    let attempts = 0;
    while(!success && attempts < 10) {
      const key = API_KEYS[keyIdx % API_KEYS.length];
      console.log(`Generating ${asset.name} (Key ${keyIdx % API_KEYS.length + 1})...`);
      try {
        const base64Str = await generateImage(asset.prompt, 128, 128, key);
        const buffer = Buffer.from(base64Str, 'base64');
        fs.writeFileSync(filePath, buffer);
        fs.writeFileSync(path.join(artifactDir, asset.name), buffer);
        console.log(`✅ Saved ${asset.name}`);
        success = true;
      } catch (err) {
        console.error(`❌ Failed: ${err.message}`);
        // If aborted or concurrent jobs, rotate key
        if (err.message.includes('aborted') || err.message.includes('concurrent jobs') || err.message.includes('429')) {
          keyIdx++;
        }
        attempts++;
        await new Promise(r => setTimeout(r, 3000));
      }
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  console.log('Finished Generation Script.');
}

main().catch(console.error);
