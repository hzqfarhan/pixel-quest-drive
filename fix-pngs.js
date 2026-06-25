const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'assets', 'hp');
const artifactDir = "C:\\Users\\haziq\\.gemini\\antigravity-ide\\brain\\34f52742-c052-4200-9492-7911ed7a8f4c";

const files = fs.readdirSync(outDir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const filePath = path.join(outDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.startsWith('{"image":')) {
    console.log(`Fixing ${file}...`);
    try {
      const json = JSON.parse(content);
      const b64 = json.image || json.base64;
      if (b64) {
        const buffer = Buffer.from(b64, 'base64');
        fs.writeFileSync(filePath, buffer);
        console.log(`✅ Fixed ${file} in public/assets/hp/`);
        
        // Update the artifact copy as well if it's a chest
        if (file.startsWith('chest-')) {
          const artifactPath = path.join(artifactDir, file);
          if (fs.existsSync(artifactPath)) {
            fs.writeFileSync(artifactPath, buffer);
            console.log(`✅ Fixed ${file} in artifacts/`);
          }
        }
      }
    } catch (e) {
      console.error(`Failed to fix ${file}: ${e.message}`);
    }
  } else {
    // console.log(`File ${file} is already a valid binary or not JSON.`);
  }
}
