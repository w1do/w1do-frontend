// Rasterize original SVG assets. Node 18+ and sharp are required.
const fs = require('node:fs');
const path = require('node:path');
let sharp;
try { sharp = require('sharp'); }
catch {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw new Error('Install sharp: npm install sharp');
  sharp = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'sharp'));
}
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/audiences.json'), 'utf8'));
sharp.concurrency(2);
async function render(a) {
  const src=path.join(root,a.assets.illustration_svg);
  await sharp(src,{density:144}).resize(1440,960).png({compressionLevel:9}).toFile(path.join(root,a.assets.illustration_png));
  await sharp(src,{density:96}).resize(960,640).webp({quality:88,alphaQuality:100}).toFile(path.join(root,a.assets.illustration_webp));
  await sharp(path.join(root,a.assets.icon_svg),{density:96}).resize(96,96).png({compressionLevel:9}).toFile(path.join(root,a.assets.icon_png));
}
(async()=>{
  const queue=[...manifest.audiences];let done=0;
  async function worker(){while(queue.length){const a=queue.shift();await render(a);done++;if(done%20===0)process.stdout.write(`Rendered ${done}/120\n`);}}
  await Promise.all(Array.from({length:4},worker));
  process.stdout.write('Complete: 120 PNG illustrations, 120 WebP illustrations, 120 PNG icons.\n');
})().catch(e=>{process.stderr.write(e.stack+'\n');process.exit(1)});
