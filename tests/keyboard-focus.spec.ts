import { expect, test, type Page } from "@playwright/test";

const mobileViewport = { width: 390, height: 844 };

async function openReadyPage(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("region", { name: "Joey LLM chat interface" }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Message" })).toBeVisible();
}

function mobileNavigation(page: Page) {
  return {
    trigger: page.getByRole("button", { name: "Open navigation" }),
    drawer: page.locator('aside[aria-label="Joey LLM"]'),
    close: page.getByRole("button", { name: "Close navigation" }).last(),
  };
}

async function expectDrawerClosed(page: Page) {
  const { trigger, drawer } = mobileNavigation(page);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(drawer).toBeHidden();
  await expect(drawer).toHaveAttribute("aria-hidden", "true");
}

async function expectDrawerOpen(page: Page) {
  const { trigger, drawer, close } = mobileNavigation(page);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveAttribute("aria-hidden", "false");
  await expect(close).toBeFocused();
}

test.describe("S5-A08 keyboard and focus behaviour", () => {
  test.use({ viewport: mobileViewport });

  test("Tab reaches the mobile navigation trigger", async ({ page }) => {
    await openReadyPage(page);
    const { trigger } = mobileNavigation(page);

    await page.getByRole("textbox", { name: "Message" }).focus();
    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press("Tab");
      if (await trigger.evaluate((element) => element === document.activeElement)) {
        break;
      }
    }

    await expect(trigger).toBeFocused();
    await expect
      .poll(() => trigger.evaluate((element) => element.matches(":focus-visible")))
      .toBe(true);
  });

  test("Enter opens the drawer and moves focus inside", async ({ page }) => {
    await openReadyPage(page);
    const { trigger } = mobileNavigation(page);

    await trigger.focus();
    await page.keyboard.press("Enter");

    await expectDrawerOpen(page);
  });

  test("Space opens the drawer and moves focus inside", async ({ page }) => {
    await openReadyPage(page);
    const { trigger } = mobileNavigation(page);

    await trigger.focus();
    await page.keyboard.press("Space");

    await expectDrawerOpen(page);
  });

  test("Escape closes the drawer and restores trigger focus", async ({ page }) => {
    await openReadyPage(page);
    const { trigger } = mobileNavigation(page);

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expectDrawerOpen(page);

    await page.keyboard.press("Escape");

    await expectDrawerClosed(page);
    await expect(trigger).toBeFocused();
  });

  test("focus stays inside the open drawer", async ({ page }) => {
    await openReadyPage(page);
    const { trigger, drawer, close } = mobileNavigation(page);

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(close).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect
      .poll(() =>
        drawer.evaluate((element) => element.contains(document.activeElement)),
      )
      .toBe(true);
  });

  test("hidden drawer controls are excluded from focus order", async ({ page }) => {
    await openReadyPage(page);
    const { drawer } = mobileNavigation(page);
    const newChat = drawer.locator("button").filter({ hasText: "New Chat" });

    await expectDrawerClosed(page);
    await newChat.evaluate((element) => element.focus());

    await expect(newChat).not.toBeFocused();
    await expect
      .poll(() =>
        drawer.evaluate((element) => !element.contains(document.activeElement)),
      )
      .toBe(true);
  });

  test("choosing a Joey Mode closes the drawer and restores focus", async ({
    page,
  }) => {
    await openReadyPage(page);
    const { trigger, drawer } = mobileNavigation(page);

    await trigger.focus();
    await page.keyboard.press("Enter");
    await drawer.getByRole("button", { name: "Sydney Joey" }).focus();
    await page.keyboard.press("Enter");

    await expectDrawerClosed(page);
    await expect(trigger).toBeFocused();
  });
});
