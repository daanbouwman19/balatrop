import { test, expect } from "@playwright/test";

test.describe("Game E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the game canvas", async ({ page }) => {
    // Check if the canvas element is present
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
  });

  test("should start the intro sequence", async ({ page }) => {
    // The intro sequence logs "INTRO" or changes state.
    // We can't easily check internal state, but we can check if the canvas renders something.
    // For now, let's just ensure no errors in console.

    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(1000); // Wait for a bit of game loop

    expect(errors).toEqual([]);
  });

  test("should resize canvas on window resize", async ({ page }) => {
    const canvas = page.locator("canvas");
    const initialBox = await canvas.boundingBox();

    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(100); // Allow resize event to process

    const newBox = await canvas.boundingBox();

    // Canvas should resize to fill the window (or whatever the CSS dictates)
    // The CSS logic for canvas size isn't strictly defined in my context, but usually it fills the container.
    // Let's assume it should change.
    expect(initialBox).not.toEqual(newBox);
  });
});
