import https from 'https';

const CANDIDATES = [
  { name: 'DTS Kominfo DEA', url: 'https://digitalent.kominfo.go.id' },
  { name: 'Prakerja', url: 'https://www.prakerja.go.id' },
  { name: 'Kemenkop RI', url: 'https://kemenkopukm.go.id' },
  { name: 'Katalog Inaproc', url: 'https://katalog.inaproc.id' },
  { name: 'LPDB Go Id', url: 'https://www.lpdb.go.id' },
  { name: 'SiHalal BPJPH', url: 'https://ptsp.halal.go.id' },
  { name: 'QRIS Bank Indonesia', url: 'https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/qris/default.aspx' },
  { name: 'Rumah BUMN', url: 'https://rumah-bumn.id' },
];

for (const c of CANDIDATES) {
  try {
    const req = https.request(c.url, { method: 'GET', timeout: 5000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      console.log(`${c.name.padEnd(25)} | Status: ${res.statusCode} | URL: ${c.url}`);
    });
    req.on('error', (e) => console.log(`${c.name.padEnd(25)} | Error: ${e.message}`));
    req.end();
  } catch (err) {
    console.log(`${c.name.padEnd(25)} | Exception: ${err.message}`);
  }
}
