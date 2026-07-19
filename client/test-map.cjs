const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  await page.goto('http://localhost:5173/login');
  
  await page.fill('input[type="email"]', 'test@test.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('http://localhost:5173/gm/campaigns');
  
  // Click on the campaign
  await page.click('text=Test Map Campaign');
  
  // Wait for dashboard and click Map
  await page.click('text=Map');

  // Wait for canvas to load
  await page.waitForSelector('canvas');
  await page.waitForTimeout(1000);

  // Expose function to log React state if possible, or just click and see
  console.log("Clicking Add Pin button");
  await page.click('button[title="Click on map to place marker"]');
  
  await page.waitForTimeout(500);

  console.log("Clicking canvas");
  await page.mouse.click(600, 500);
  
  await page.waitForTimeout(1000);
  
  // See if "Custom Pins" count updated
  const content = await page.content();
  const match = content.match(/(\d+)\s+custom pins/);
  console.log("Custom pins count:", match ? match[1] : "not found");

  await browser.close();
})();
