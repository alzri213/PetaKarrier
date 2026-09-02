import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/resources');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const SITES = [
  { id: 'oss-nib', url: 'https://oss.go.id' },
  { id: 'sertifikasi-halal', url: 'https://halal.go.id' },
  { id: 'kur-bank', url: 'https://kur.ekon.go.id' },
  { id: 'lpdb-kumkm', url: 'https://lpdb.kemenkopukm.go.id' },
  { id: 'qris-bi', url: 'https://qris.id' },
  { id: 'katalog-lkpp', url: 'https://e-katalog.lkpp.go.id' },
  { id: 'pelatihan-kemenkop', url: 'https://edukukm.id' },
  { id: 'rumah-bumn', url: 'https://rumahbumn.id' },
];

async function run() {
  console.log('Launching browser to capture official website screenshots...');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
    });
  } catch (err) {
    console.warn('Could not launch bundled chromium, trying default system chrome:', err);
    browser = await puppeteer.launch({
      headless: 'new',
      channel: 'chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
    });
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  for (const site of SITES) {
    const dest = path.join(outDir, `${site.id}.jpg`);
    console.log(`Navigating to ${site.url}...`);
    try {
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: dest, type: 'jpeg', quality: 85 });
      console.log(`Saved screenshot: ${dest}`);
    } catch (e) {
      console.warn(`Failed to capture ${site.url}:`, e.message);
      // Fallback capture with domcontentloaded
      try {
        await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: dest, type: 'jpeg', quality: 85 });
        console.log(`Saved fallback screenshot: ${dest}`);
      } catch (err2) {
        console.error(`Fatal error capturing ${site.id}:`, err2.message);
      }
    }
  }

  await browser.close();
  console.log('Done capturing screenshots!');
}

run();
