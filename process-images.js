const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const artifactDir = "C:\\Users\\haziq\\.gemini\\antigravity-ide\\brain\\34f52742-c052-4200-9492-7911ed7a8f4c";
const publicDir = path.join(__dirname, 'public', 'assets', 'hp');

// Get the latest file matching a prefix
function getLatestImage(prefix) {
  const files = fs.readdirSync(artifactDir)
    .filter(f => f.startsWith(prefix) && f.endsWith('.png'));
  
  files.sort((a, b) => {
    return fs.statSync(path.join(artifactDir, b)).mtime.getTime() - 
           fs.statSync(path.join(artifactDir, a)).mtime.getTime();
  });
  
  return files.length > 0 ? path.join(artifactDir, files[0]) : null;
}

const images = [
  { prefix: 'owl_hedwig', output: 'owl-hedwig.png' },
  { prefix: 'owl_night', output: 'owl-night.png' },
  { prefix: 'golden_snitch', output: 'golden-snitch.png' }
];

async function processImages() {
  for (const img of images) {
    const srcPath = getLatestImage(img.prefix);
    if (!srcPath) {
      console.log(`Could not find artifact for ${img.prefix}`);
      continue;
    }
    
    console.log(`Processing ${img.output} from ${srcPath}...`);
    try {
      const image = await Jimp.read(srcPath);
      
      // Make completely black pixels transparent
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // threshold for black background
        if (r < 20 && g < 20 && b < 20) {
          this.bitmap.data[idx + 3] = 0; // alpha
        }
      });
      
      // Resize down a bit to match game sprite sizes
      image.resize(128, 128, Jimp.RESIZE_NEAREST_NEIGHBOR);
      
      const destPath = path.join(publicDir, img.output);
      await image.writeAsync(destPath);
      console.log(`✅ Saved ${img.output}`);
    } catch (err) {
      console.error(`Failed on ${img.output}: ${err.message}`);
    }
  }
}

processImages();
