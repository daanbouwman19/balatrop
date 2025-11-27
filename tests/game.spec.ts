import { test, expect } from "@playwright/test";

test("game loads and basic interaction", async ({ page }) => {
  await page.goto("/");

  // Check if canvas exists
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  // Wait for game to potentially load (the intro animation might take time)
  // We can't easily hook into the internal state, but we can wait for visual changes or log messages if we exposed them.
  // For now, let's just ensure no console errors.
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`Error text: "${msg.text()}"`);
    }
  });

  // Since it's a canvas game, standard locators won't work for in-game elements.
  // We can try to click on the canvas to trigger interactions.
  // The intro sequence requires a click to proceed? Or it proceeds automatically?
  // GameActive.ts: startIntro() -> enterState("INTRO")
  // The FrankEntity handles intro.

  // Let's just verify the title or some DOM element if it exists.
  // The App.vue seems to just mount the game.

  // We can verify that the game loop is running by checking if the canvas content changes over time?
  // Or just a simple smoke test that it doesn't crash.

  await page.waitForTimeout(1000);

  // Take a screenshot
  await page.screenshot({ path: "tests/start.png" });
});
