const { PixelLabClient } = require('@pixellab-code/pixellab');
const fs = require('fs');
const path = require('path');

const API_KEYS = [
  '2ca2481a-8a2e-4685-82be-1b770cdaf0b3',
  'c1b16cd6-e0a7-48e0-890e-e1b27df4fe84',
  'd968f24c-5fe5-44e6-8f19-3445020763e2',
  'c57aebb8-ecb1-4ea3-975a-b976ea849b7a'
];

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
  }
];

async function main() {
  console.log('Regenerating Chests with SDK and Key Fallback...');
  const outDir = path.join(__dirname, 'public', 'assets', 'hp');
  let currentKeyIndex = 0;
  
  for (const asset of chests) {
    let success = false;
    while (!success && currentKeyIndex < API_KEYS.length) {
      console.log(`Generating ${asset.name} using key ${currentKeyIndex + 1}...`);
      try {
        const pixellab = new PixelLabClient({ apiKey: API_KEYS[currentKeyIndex] });
        const result = await pixellab.generateImagePixflux({
          description: asset.prompt,
          imageSize: { width: 128, height: 128 },
        });
        const buffer = Buffer.from(result.base64, 'base64');
        fs.writeFileSync(path.join(outDir, asset.name), buffer);
        
        // Copy to artifacts for preview
        const artifactDir = "C:\\Users\\haziq\\.gemini\\antigravity-ide\\brain\\34f52742-c052-4200-9492-7911ed7a8f4c";
        fs.writeFileSync(path.join(artifactDir, asset.name), buffer);
        
        console.log(`✅ Saved ${asset.name}`);
        success = true;
      } catch (err) {
        console.error(`❌ Failed to generate ${asset.name} with key ${currentKeyIndex + 1}: ${err.message}`);
        // If it's a limit or invalid, switch to next key
        currentKeyIndex++;
      }
    }
    
    if (!success) {
       console.error(`All keys exhausted. Failed to generate ${asset.name}`);
       break;
    }
    // Wait briefly between successful generations to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

main().catch(console.error);
