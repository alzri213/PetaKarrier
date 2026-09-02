import fs from 'fs';
import path from 'path';
import https from 'https';

const outDir = path.resolve('public/resources');

const REMAINING = [
  { id: 'lpdb-kumkm', urls: ['https://image.thum.io/get/width/1200/crop/750/noanimate/https://lpdb.id', 'https://image.thum.io/get/width/1200/crop/750/noanimate/https://kemenkopukm.go.id'] },
  { id: 'katalog-lkpp', urls: ['https://image.thum.io/get/width/1200/crop/750/noanimate/https://inaproc.id', 'https://image.thum.io/get/width/1200/crop/750/noanimate/https://lkpp.go.id'] },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  for (const item of REMAINING) {
    const dest = path.join(outDir, `${item.id}.jpg`);
    for (const u of item.urls) {
      try {
        console.log(`Downloading ${item.id} from ${u}...`);
        await download(u, dest);
        const stat = fs.statSync(dest);
        if (stat.size > 10000) {
          console.log(`✓ Saved ${item.id}.jpg (${Math.round(stat.size / 1024)} KB)`);
          break;
        }
      } catch (err) {
        console.warn(`Failed ${u}:`, err.message);
      }
    }
  }
}

run();
