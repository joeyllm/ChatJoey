import { expect, test, type Locator, type Page } from "@playwright/test";

async function openReadyPage(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("region", { name: "Joey LLM chat interface" }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Message" })).toBeVisible();
}

async function mockChat(page: Page) {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Chat-Mode": "mock",
      },
      body: "",
    });
  });
}

async function expectKeyboardFocus(locator: Locator) {
  await expect(locator).toBeFocused();
  await expect
    .poll(() => locator.evaluate((element) => element.matches(":focus-visible")))
    .toBe(true);
}

async function tabTo(page: Page, locator: Locator, maximumTabs = 20) {
  for (let index = 0; index < maximumTabs; index += 1) {
    await page.keyboard.press("Tab");
    if (await locator.evaluate((element) => element === document.activeElement)) {
      return;
    }
  }

  throw new Error(
    `Keyboard focus did not reach ${await locator.getAttribute("aria-label") ?? "the expected control"}`,
  );
}

test.describe("S5-A08 composer keyboard behavior", () => {
  for (const viewport of [
    { name: "desktop", width: 1280, height: 800 },
    { name: "tablet portrait", width: 768, height: 1024 },
    { name: "mobile landscape", width: 844, height: 390 },
  ]) {
    test.describe(viewport.name, () => {
      test.use({ viewport });

      test("Enter sends and keeps focus in the composer", async ({ page }) => {
        await mockChat(page);
        await openReadyPage(page);

        const input = page.getByRole("textbox", { name: "Message" });
        await input.focus();
        await input.fill(`A08 ${viewport.name} keyboard message`);
        await page.keyboard.press("Enter");

        await expect(
          page.getByText(`A08 ${viewport.name} keyboard message`, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(input).toHaveValue("");
        await expect(input).toBeFocused();
      });

      test("Shift+Enter inserts a newline without sending", async ({ page }) => {
        await openReadyPage(page);

        const input = page.getByRole("textbox", { name: "Message" });
        await input.focus();
        await input.fill("first line");
        await page.keyboard.press("Shift+Enter");
        await input.type("second line");

        await expect(input).toHaveValue("first line\nsecond line");
        await expect(
          page.getByRole("region", { name: "Conversation messages" }),
        ).not.toContainText("first line");
      });
    });
  }
});

test.describe("S5-A08 keyboard navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Tab reaches the primary interactive controls", async ({ page }) => {
    await openReadyPage(page);

    const collapse = page.getByRole("button", { name: "Collapse sidebar" });
    const newChat = page.getByRole("button", { name: "New Chat" });
    const littleJoey = page.getByRole("button", { name: /Little Joey/ });
    const evilJoey = page.getByRole("button", { name: "Evil Joey" });
    const sydneyJoey = page.getByRole("button", { name: "Sydney Joey" });
    const resize = page.getByRole("separator", { name: "Resize sidebar width" });
    const input = page.getByRole("textbox", { name: "Message" });

    await page.locator("body").focus();
    for (const control of [
      collapse,
      newChat,
      littleJoey,
      evilJoey,
      sydneyJoey,
      resize,
      input,
    ]) {
      await tabTo(page, control);
      await expectKeyboardFocus(control);
    }
  });

  test("mode buttons work with Enter and Space", async ({ page }) => {
    await openReadyPage(page);

    const sydneyJoey = page.getByRole("button", { name: "Sydney Joey" });
    await sydneyJoey.focus();
    await page.keyboard.press("Enter");
    await expect(sydneyJoey).toHaveAttribute("aria-pressed", "true");
    await expectKeyboardFocus(sydneyJoey);

    const evilJoey = page.getByRole("button", { name: "Evil Joey" });
    await evilJoey.focus();
    await page.keyboard.press("Space");
    await expect(evilJoey).toHaveAttribute("aria-pressed", "true");
    await expectKeyboardFocus(evilJoey);
  });

  test("sidebar toggle preserves focus when activated by keyboard", async ({
    page,
  }) => {
    await openReadyPage(page);

    const collapse = page.getByRole("button", { name: "Collapse sidebar" });
    await collapse.focus();
    await page.keyboard.press("Enter");

    const expand = page.getByRole("button", { name: "Expand sidebar" });
    await expect(expand).toBeVisible();
    await expectKeyboardFocus(expand);

    await page.keyboard.press("Space");
    await expect(collapse).toBeVisible();
    await expectKeyboardFocus(collapse);
  });

  test("sidebar resize handle responds to arrow keys", async ({ page }) => {
    await openReadyPage(page);

    const resize = page.getByRole("separator", { name: "Resize sidebar width" });
    await resize.focus();
    const initialValue = Number(await resize.getAttribute("aria-valuenow"));

    await page.keyboard.press("ArrowRight");
    await expect(resize).toHaveAttribute(
      "aria-valuenow",
      String(initialValue + 16),
    );

    await page.keyboard.press("ArrowLeft");
    await expect(resize).toHaveAttribute("aria-valuenow", String(initialValue));
    await expectKeyboardFocus(resize);
  });

  test("New Chat clears the conversation from the keyboard", async ({ page }) => {
    await mockChat(page);
    await openReadyPage(page);

    const input = page.getByRole("textbox", { name: "Message" });
    await input.fill("Clear this A08 message");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Clear this A08 message", { exact: true })).toBeVisible();

    const newChat = page.getByRole("button", { name: "New Chat" });
    await newChat.focus();
    await page.keyboard.press("Enter");

    await expect(page.getByText("Clear this A08 message", { exact: true })).toHaveCount(0);
    await expectKeyboardFocus(newChat);
  });
});

test.describe("S5-A01 focus dependency", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile drawer manages Escape and restores trigger focus", async ({
    page,
  }) => {
    await openReadyPage(page);

    const sidebar = page.getByRole("complementary", { name: "Joey LLM" });
    const trigger = page.getByRole("button", {
      name: /Open (navigation|menu|sidebar)/i,
    });

    if ((await trigger.count()) === 0) {
      throw new Error(
        "S5-A08 BLOCKED BY S5-A01: the mobile navigation trigger is not implemented.",
      );
    }
    if (await sidebar.isVisible()) {
      throw new Error(
        "S5-A08 BLOCKED BY S5-A01: the mobile drawer is not closed by default.",
      );
    }

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.locator(":focus")).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(sidebar).toBeHidden();
    await expectKeyboardFocus(trigger);
  });
});
