const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const name = process.argv[2];
  const url = process.argv[3] || 'http://127.0.0.1:3000/';
  const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(450);
  const out = path.join(__dirname, 'shots-r4', name);
  await page.screenshot({ path: out });
  console.log(out, fs.statSync(out).size);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
