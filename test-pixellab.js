const { PixelLabClient } = require('@pixellab-code/pixellab');

async function main() {
  console.log("Starting Pixellab test...");
  const pixellab = new PixelLabClient({ apiKey: 'c1b16cd6-e0a7-48e0-890e-e1b27df4fe84' });
  try {
    const result = await pixellab.generateImagePixflux({
      description: 'harry potter character in 32x32 8-bit style, pixel art',
      imageSize: { width: 32, height: 32 },
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

main();
