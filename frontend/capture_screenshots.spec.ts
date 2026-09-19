import { test } from '@playwright/test';
import path from 'path';

test('capture presentation slides', async ({ page }) => {
  test.setTimeout(90000);
  const artifactDir = "C:\\Users\\Charuni Mettem\\.gemini\\antigravity-ide\\brain\\51bf48c3-5894-43ae-8ff9-432905c411ea";

  console.log("1. Capturing Dashboard...");
  await page.goto("http://localhost:3001");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(artifactDir, "slide1_static_dashboard.png") });

  console.log("2. Capturing Cloud Dashboard...");
  await page.click('button:has-text("FloodShield Cloud")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, "slide5_cloud_dashboard.png") });

  console.log("3. Capturing System Architecture View...");
  await page.click('button:has-text("System Architecture")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, "slide6_architecture_view.png") });

  console.log("4. Capturing Live Digital Twin Simulation...");
  await page.click('button:has-text("LIVE HARDWARE SIMULATION")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, "slide2_digital_twin_normal.png") });

  console.log("5. Triggering Flood Simulation...");
  await page.click('button:has-text("START SIMULATION")');
  await page.waitForTimeout(22000); // Scene 5 - Critical Flood & Siren
  await page.screenshot({ path: path.join(artifactDir, "slide3_digital_twin_critical.png") });

  await page.waitForTimeout(10000); // Scene 7/8 - Diversion Gate & Tank
  await page.screenshot({ path: path.join(artifactDir, "slide4_digital_twin_diversion.png") });
});
