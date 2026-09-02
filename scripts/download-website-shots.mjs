import fs from 'fs';
import path from 'path';
import https from 'https';

const outDir = path.resolve('public/resources');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const RESOURCES = [
  { id: 'oss-nib', url: 'https://oss.go.id' },
  { id: 'sertifikasi-halal', url: 'https://ptsp.halal.go.id' },
  { id: 'kur-bank', url: 'https://kur.ekon.go.id' },
  { id: 'lpdb-kumkm', url: 'https://lpdb.go.id' },
  { id: 'qris-bi', url: 'https://qris.id' },
  { id: 'katalog-lkpp', url: 'https://katalog.inaproc.id' },
  { id: 'pelatihan-kemenkop', url: 'https://edukukm.id' },
  { id: 'rumah-bumn', url: 'https://rumah-bumn.id' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function fetchScreenshots() {
  console.log('Downloading live portal website screenshots from internet...');
  
  for (const item of RESOURCES) {
    const dest = path.join(outDir, `${item.id}.jpg`);
    
    // If file already exists and > 20KB from live puppeteer, keep it or refresh if needed
    if (fs.existsSync(dest)) {
      const stat = fs.statSync(dest);
      if (stat.size > 20000) {
        console.log(`✓ Existing valid capture for ${item.id}.jpg (${Math.round(stat.size / 1024)} KB)`);
        continue;
      }
    }

    const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(item.url)}?w=1280&v=2`;
    
    console.log(`Fetching live shot for ${item.id} (${item.url})...`);
    try {
      await downloadFile(mshotsUrl, dest);
      const stat = fs.statSync(dest);
      if (stat.size > 5000) {
        console.log(`✓ Successfully downloaded ${item.id}.jpg (${Math.round(stat.size / 1024)} KB)`);
        continue;
      }
    } catch (e) {
      console.warn(`mShots failed for ${item.id}:`, e.message);
    }

    try {
      const thumUrl = `https://image.thum.io/get/width/1200/crop/750/noanimate/${item.url}`;
      await downloadFile(thumUrl, dest);
      console.log(`✓ Thum.io saved ${item.id}.jpg`);
    } catch (e2) {
      console.error(`All downloads failed for ${item.id}:`, e2.message);
    }
  }

  console.log('Finished downloading all website background photos!');
}

fetchScreenshots();
