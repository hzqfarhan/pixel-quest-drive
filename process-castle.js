const Jimp = require('jimp');
const path = require('path');

async function processCastle() {
  const inPath = 'C:\\Users\\haziq\\.gemini\\antigravity-ide\\brain\\34f52742-c052-4200-9492-7911ed7a8f4c\\hogwarts_castle_raw_1782452865199.png';
  const outPath = path.join(__dirname, 'public', 'assets', 'hp', 'castle-transparent.png');

  console.log(`Processing ${inPath}...`);
  try {
    const image = await Jimp.read(inPath);
    
    // Find green pixels and make them transparent
    // #00FF00 is purely green.
    // We should tolerate near-green pixels too to prevent halos.
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If pixel is heavily green, make it transparent
      if (green > 150 && red < 100 && blue < 100) {
        this.bitmap.data[idx + 3] = 0; // Alpha = 0
      }
    });

    await image.writeAsync(outPath);
    console.log(`✅ Saved transparent castle to ${outPath}`);
  } catch (err) {
    console.error('❌ Failed:', err);
  }
}

processCastle();
