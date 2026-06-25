const fs = require('fs');

const b64 = fs.readFileSync('public/assets/hp/chest-bronze.png', 'utf8').trim();

// decode from base64
const buffer = Buffer.from(b64, 'base64');
console.log('Decoded size:', buffer.length);
console.log('Header:', buffer.slice(0, 16).toString('hex'));
console.log('ASCII Header:', buffer.slice(0, 16).toString('ascii'));
