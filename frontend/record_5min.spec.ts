import { test } from '@playwright/test';

test('record 5 minute demo video', async ({ page }) => {
  test.setTimeout(360000); // 6 minutes timeout

  // Set standard HD viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  // Navigate to application
  await page.goto('http://localhost:3001/');
  await page.waitForTimeout(3000);

  // ==========================================
  // SECTION 1: STATIC MONITORING DASHBOARD (0:00 - 0:45)
  // ==========================================
  for (let i = 0; i < 7; i++) {
    await page.mouse.wheel(0, 220);
    await page.waitForTimeout(3800);
  }
  for (let i = 0; i < 7; i++) {
    await page.mouse.wheel(0, -220);
    await page.waitForTimeout(1500);
  }
  await page.waitForTimeout(3000);

  // ==========================================
  // SECTION 2: LIVE DIGITAL TWIN HARDWARE SIMULATION (0:45 - 3:30)
  // ==========================================
  const liveTwinBtn = page.locator('button', { hasText: 'LIVE HARDWARE SIMULATION' });
  await liveTwinBtn.click();
  await page.waitForTimeout(3000);

  const startSimBtn = page.locator('button', { hasText: 'START SIMULATION' });
  await startSimBtn.click();

  // Allow all 11 Scenes to complete smoothly (~160 seconds)
  for (let s = 0; s < 16; s++) {
    await page.waitForTimeout(10000);
    await page.mouse.move(640 + (s % 2 === 0 ? 30 : -30), 360);
  }
  await page.waitForTimeout(3000);

  // ==========================================
  // SECTION 3: FLOODSHIELD CLOUD PORTAL (3:30 - 4:15)
  // ==========================================
  const backBtn = page.locator('button', { hasText: 'BACK TO DASHBOARD' });
  await backBtn.click();
  await page.waitForTimeout(3000);

  const cloudTab = page.locator('button', { hasText: 'FloodShield Cloud' });
  await cloudTab.click();
  await page.waitForTimeout(3000);

  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(5000);
  }
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, -200);
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(3000);

  // ==========================================
  // SECTION 4: SYSTEM ARCHITECTURE & HARDWARE SPECS (4:15 - 5:00)
  // ==========================================
  const archTab = page.locator('button', { hasText: 'System Architecture' });
  await archTab.click();
  await page.waitForTimeout(3000);

  for (let i = 0; i < 7; i++) {
    await page.mouse.wheel(0, 220);
    await page.waitForTimeout(5000);
  }
  for (let i = 0; i < 7; i++) {
    await page.mouse.wheel(0, -220);
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(3000);
});
