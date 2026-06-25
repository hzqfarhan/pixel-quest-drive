const { PixelLabClient } = require('@pixellab-code/pixellab');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Starting Pixellab test...");
  const pixellab = new PixelLabClient({ apiKey: 'c57aebb8-ecb1-4ea3-975a-b976ea849b7a' });
  try {
    const result = await pixellab.generateImagePixflux({
      description: 'harry potter character in 32x32 8-bit style, pixel art',
      imageSize: { width: 32, height: 32 },
    });
    console.log("Success! Generated image.");
    // Write image to disk to verify it works
    const buffer = Buffer.from(result.base64, 'base64');
    fs.writeFileSync(path.join(__dirname, 'public', 'test-output.png'), buffer);
    console.log("Saved to public/test-output.png");
  } catch (err) {
    console.error(err);
  }
}

main();
