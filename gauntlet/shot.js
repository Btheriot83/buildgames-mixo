const { chromium } = require('playwright');
const path = require('path');
const name = process.argv[2];
const url = process.argv[3] || 'http://localhost:3000/';
const full = process.argv[4] === 'full';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(900);
  const out = path.join(__dirname, 'shots-r4', name);
  await page.screenshot({ path: out, fullPage: !!full });
  console.log('wrote', out);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
