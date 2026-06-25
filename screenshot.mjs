import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });
await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');

// Click משוב
const btns = await page.locator('aside button').all();
await btns[0].click();
await page.waitForTimeout(1500);

// Click first message row
const rows = await page.locator('table tbody tr').all();
if (rows.length > 0) {
  await rows[0].click();
  await page.waitForTimeout(800);
}

// Scroll down to see תשובת המערכת
await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(300);

await page.screenshot({ path: './feedback3.png' });
console.log('done');
await browser.close();
