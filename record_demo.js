const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const artifactDir = "C:\\Users\\Charuni Mettem\\.gemini\\antigravity-ide\\brain\\51bf48c3-5894-43ae-8ff9-432905c411ea";
  const videoDir = path.join(artifactDir, "videos");
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 800 }
    },
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  console.log("Navigating to dashboard...");
  await page.goto("http://localhost:3001");
  await page.waitForTimeout(2000);

  console.log("Taking initial screenshot...");
  await page.screenshot({ path: path.join(artifactDir, "demo_scene_1_normal.png") });

  console.log("Clicking START DEMO button...");
  const startBtn = page.locator('button:has-text("START DEMO")');
  if (await startBtn.isVisible()) {
    await startBtn.click();
  }

  // Record for 35 seconds to capture scenes 1 through 6
  console.log("Recording guided demo in progress...");
  for (let i = 1; i <= 6; i++) {
    await page.waitForTimeout(6000);
    await page.screenshot({ path: path.join(artifactDir, `demo_scene_${i+1}.png`) });
    console.log(`Captured Scene ${i+1} screenshot`);
  }

  console.log("Closing context and saving video...");
  await context.close();
  await browser.close();

  const files = fs.readdirSync(videoDir);
  if (files.length > 0) {
    const rawVideoPath = path.join(videoDir, files[0]);
    const finalVideoPath = path.join(artifactDir, "baadh_suraksha_guided_demo.webm");
    fs.copyFileSync(rawVideoPath, finalVideoPath);
    console.log(`RECORDING_SUCCESS: ${finalVideoPath}`);
  }
}

run().catch(console.error);
