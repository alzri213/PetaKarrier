import https from 'https';
import http from 'http';

const URLS = [
  { name: 'OSS', url: 'https://oss.go.id' },
  { name: 'Halal BPJPH PTSP', url: 'https://ptsp.halal.go.id' },
  { name: 'Halal Kemenag', url: 'https://halal.go.id' },
  { name: 'KUR Ekon', url: 'https://kur.ekon.go.id' },
  { name: 'LPDB', url: 'https://lpdb.go.id' },
  { name: 'LPDB ID', url: 'https://lpdb.id' },
  { name: 'Kemenkop', url: 'https://kemenkopukm.go.id' },
  { name: 'QRIS', url: 'https://qris.id' },
  { name: 'QRIS BI', url: 'https://www.bi.go.id' },
  { name: 'E-Katalog LKPP', url: 'https://e-katalog.lkpp.go.id' },
  { name: 'INAPROC', url: 'https://inaproc.id' },
  { name: 'Katalog Inaproc', url: 'https://katalog.inaproc.id' },
  { name: 'LKPP Go Id', url: 'https://lkpp.go.id' },
  { name: 'EduKUKM', url: 'https://edukukm.id' },
  { name: 'Smesco', url: 'https://smesco.go.id' },
  { name: 'Rumah BUMN ID', url: 'https://rumah-bumn.id' },
  { name: 'Rumah BUMN No-Dash', url: 'https://rumahbumn.id' },
  { name: 'BUMN Portal', url: 'https://bumn.go.id' },
];

function check(item) {
  return new Promise((resolve) => {
    const parsed = new URL(item.url);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.request(item.url, { method: 'HEAD', timeout: 5000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ name: item.name, url: item.url, status: res.statusCode, location: res.headers.location });
    });
    req.on('timeout', () => { req.destroy(); resolve({ name: item.name, url: item.url, status: 'TIMEOUT' }); });
    req.on('error', (err) => resolve({ name: item.name, url: item.url, status: 'ERR: ' + err.code }));
    req.end();
  });
}

async function run() {
  console.log('Testing links...');
  for (const u of URLS) {
    const res = await check(u);
    console.log(`${res.name.padEnd(20)} | Status: ${String(res.status).padEnd(10)} | URL: ${res.url} ${res.location ? '-> ' + res.location : ''}`);
  }
}

run();
