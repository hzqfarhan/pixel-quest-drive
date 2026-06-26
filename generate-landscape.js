const { PixelLabClient } = require('@pixellab-code/pixellab');
const fs = require('fs');
const path = require('path');

async function generateImage(pixellab, prompt, filename, width = 512, height = 512) {
  console.log(`Generating: ${filename}...`);
  try {
    const result = await pixellab.generateImagePixflux({
      description: prompt,
      imageSize: { width, height },
    });
    
    let base64Data = result.base64;
    // Handle JSON envelope bug if it happens
    if (base64Data.startsWith('{') || base64Data.startsWith('[')) {
      try {
        const parsed = JSON.parse(base64Data);
        base64Data = parsed.base64 || parsed.image || base64Data;
      } catch (e) {}
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const outPath = path.join(__dirname, 'public', 'assets', 'hp', filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`✅ Saved ${outPath}`);
  } catch (err) {
    console.error(`❌ Failed to generate ${filename}:`, err.message);
  }
}

async function main() {
  const pixellab = new PixelLabClient({ apiKey: '257ba98f-5183-4f15-ba22-38e4df55a31d' });
  
  // Wait 10 seconds between requests to avoid 429
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  await generateImage(
    pixellab,
    'pixel art beautiful vast blue sky with fluffy white clouds, distant mountains, scenic, majestic, 16-bit retro style background, wide aspect ratio',
    'hogwarts-bg-day.png',
    1024, 512
  );
  
  await delay(5000);

  await generateImage(
    pixellab,
    'pixel art dark starry night sky over the scottish highlands, deep blues and purples, glowing moon, 16-bit retro style background, wide aspect ratio',
    'hogwarts-bg-night.png',
    1024, 512
  );
  
  await delay(5000);

  await generateImage(
    pixellab,
    'pixel art massive majestic Hogwarts castle building on a cliff, solid #00FF00 green screen background, highly detailed 16-bit retro style, no sky, no clouds, isolated object',
    'hogwarts-castle-raw.png',
    1024, 512
  );

  console.log('All generation tasks completed.');
}

main();
