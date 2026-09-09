import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('record video demo', async ({ page }) => {
  test.setTimeout(60000);
  const artifactDir = "C:\\Users\\Charuni Mettem\\.gemini\\antigravity-ide\\brain\\51bf48c3-5894-43ae-8ff9-432905c411ea";
  
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000);

  const startBtn = page.locator('button:has-text("START DEMO")');
  if (await startBtn.isVisible()) {
    await startBtn.click();
  }

  // Let the live simulation run through 6 scenes (36 seconds)
  await page.waitForTimeout(36000);
});
