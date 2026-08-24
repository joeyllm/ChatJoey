import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";

type ViewportCase = {
  name: string;
  width: number;
  height: number;
};

const targetViewports: ViewportCase[] = [
  {
    name: "mobile landscape 844x390",
    width: 844,
    height: 390,
  },
  {
    name: "mobile landscape 667x375",
    width: 667,
    height: 375,
  },
  {
    name: "tablet portrait 768x1024",
    width: 768,
    height: 1024,
  },
  {
    name: "tablet landscape 1024x768",
    width: 1024,
    height: 768,
  },
];

const breakpointViewports: ViewportCase[] = [
  {
    name: "below tablet breakpoint 767x1024",
    width: 767,
    height: 1024,
  },
  {
    name: "tablet breakpoint 768x1024",
    width: 768,
    height: 1024,
  },
  {
    name: "above tablet breakpoint 769x1024",
    width: 769,
    height: 1024,
  },
];

async function openReadyPage(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("region", {
      name: "Joey LLM chat interface",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("textbox", { name: "Message" }),
  ).toBeVisible();
}

async function expectInsideViewport(
  locator: Locator,
  width: number,
  height: number,
) {
  await expect(locator).toBeVisible();

  const box = await locator.boundingBox();
  expect(box, "Element should have a layout box").not.toBeNull();

  if (!box) {
    return;
  }

  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
  expect(box.y + box.height).toBeLessThanOrEqual(height);
}

async function expectNoPageHorizontalOverflow(page: Page) {
  const measurements = await page.evaluate(() => ({
    documentClientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    bodyClientWidth: document.body.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));

  expect(
    measurements.documentScrollWidth,
    "The document must not scroll horizontally",
  ).toBeLessThanOrEqual(measurements.documentClientWidth);

  expect(
    measurements.bodyScrollWidth,
    "The body must not scroll horizontally",
  ).toBeLessThanOrEqual(measurements.bodyClientWidth);
}

async function expectIndependentConversationScroll(page: Page) {
  const conversation = page.getByRole("region", {
    name: "Conversation messages",
  });

  const overflowY = await conversation.evaluate(
    (element) => getComputedStyle(element).overflowY,
  );

  expect(["auto", "scroll"]).toContain(overflowY);
}

async function sendMessage(page: Page, message: string) {
  const input = page.getByRole("textbox", { name: "Message" });
  const sendButton = page.getByRole("button", {
    name: "Send message",
  });

  await expect(sendButton).toBeDisabled();

  await input.fill(message);
  await expect(sendButton).toBeEnabled();

  await sendButton.click();

  await expect(
    page
      .getByRole("region", {
        name: "Conversation messages",
      })
      .getByText(message, { exact: true }),
  ).toBeVisible();
}

for (const viewport of targetViewports) {
  test.describe(viewport.name, () => {
    test.use({
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
    });

    test("keeps the chat shell and composer usable", async ({
      page,
    }) => {
      await openReadyPage(page);

      await expectNoPageHorizontalOverflow(page);
      await expectIndependentConversationScroll(page);

      await expectInsideViewport(
        page.getByRole("textbox", { name: "Message" }),
        viewport.width,
        viewport.height,
      );

      await expectInsideViewport(
        page.getByRole("button", {
          name: "Send message",
        }),
        viewport.width,
        viewport.height,
      );
    });

    test("supports the core message flow", async ({ page }) => {
      await openReadyPage(page);

      await sendMessage(
        page,
        `A07 message at ${viewport.width}x${viewport.height}`,
      );

      await expectNoPageHorizontalOverflow(page);
    });

    test("keeps long content from widening the page", async ({
      page,
    }) => {
      await openReadyPage(page);

      const longContent =
        "https://example.com/" + "very-long-path-".repeat(25);

      await sendMessage(page, longContent);
      await expectNoPageHorizontalOverflow(page);
    });
  });
}

for (const viewport of breakpointViewports) {
  test.describe(viewport.name, () => {
    test.use({
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
    });

    test("remains usable around the 768px breakpoint", async ({
      page,
    }) => {
      await openReadyPage(page);

      await expectNoPageHorizontalOverflow(page);
      await expectIndependentConversationScroll(page);

      await expectInsideViewport(
        page.getByRole("textbox", { name: "Message" }),
        viewport.width,
        viewport.height,
      );

      await expectInsideViewport(
        page.getByRole("button", {
          name: "Send message",
        }),
        viewport.width,
        viewport.height,
      );
    });
  });
}

test.describe("A04 Markdown overflow containment", () => {
  test.use({
    viewport: {
      width: 768,
      height: 1024,
    },
  });

  test("keeps code blocks and tables locally scrollable", async ({
    page,
  }) => {
    await page.route("**/api/chat", async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Chat-Mode": "live",
        },
        body: [
          "```text",
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(12),
          "```",
          "",
          "| Column one | Column two | Column three |",
          "| --- | --- | --- |",
          `| ${"wide-content-".repeat(12)} | value | value |`,
        ].join("\n"),
      });
    });

    await openReadyPage(page);
    await sendMessage(page, "Show overflow content");

    const conversation = page.getByRole("region", {
      name: "Conversation messages",
    });

    const codeBlock = conversation.locator("pre");
    const table = conversation.locator("table");

    await expect(codeBlock).toBeVisible();
    await expect(table).toBeVisible();

    const codeOverflow = await codeBlock.evaluate(
      (element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        overflowX: getComputedStyle(element).overflowX,
      }),
    );

    expect(["auto", "scroll"]).toContain(
      codeOverflow.overflowX,
    );
    expect(codeOverflow.scrollWidth).toBeGreaterThanOrEqual(
      codeOverflow.clientWidth,
    );

    const tableOverflow = await table.evaluate(
      (element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        overflowX: getComputedStyle(element).overflowX,
      }),
    );

    expect(["auto", "scroll"]).toContain(
      tableOverflow.overflowX,
    );
    expect(tableOverflow.scrollWidth).toBeGreaterThanOrEqual(
      tableOverflow.clientWidth,
    );

    await expectNoPageHorizontalOverflow(page);
  });
});

test.describe("A05 desktop behavior regression", () => {
  test.use({
    viewport: {
      width: 1280,
      height: 800,
    },
  });

  test("preserves sidebar collapse and expand behavior", async ({
    page,
  }) => {
    await openReadyPage(page);

    const sidebar = page.getByRole("complementary", {
      name: "Joey LLM",
    });

    const collapseButton = page.getByRole("button", {
      name: "Collapse sidebar",
    });

    await collapseButton.click();

    await expect(
      page.getByRole("button", {
        name: "Expand sidebar",
      }),
    ).toBeAttached();

    await expect
      .poll(async () => (await sidebar.boundingBox())?.width)
      .toBeCloseTo(72, 0);

    await page
      .getByRole("button", {
        name: "Expand sidebar",
      })
      .click();

    await expect(
      page.getByRole("button", {
        name: "Collapse sidebar",
      }),
    ).toBeAttached();

    await expect
      .poll(async () => (await sidebar.boundingBox())?.width)
      .toBeGreaterThanOrEqual(200);
  });

  test("preserves Joey Mode switching without page overflow", async ({
    page,
  }) => {
    await openReadyPage(page);

    await page
      .getByRole("button", {
        name: "Sydney Joey",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "What can Sydney Joey help you with today?",
      }),
    ).toBeVisible();

    await expectNoPageHorizontalOverflow(page);
  });
});

test.describe("S5-A01 mobile navigation integration", () => {
  test.use({
    viewport: {
      width: 844,
      height: 390,
    },
  });

  test("opens closed by default and closes with Escape", async ({ page }) => {
    await openReadyPage(page);

    const navigationButton = page.getByRole("button", {
      name: "Open navigation",
    });
    const drawer = page.getByRole("complementary", { name: "Joey LLM" });

    await expect(navigationButton).toHaveAttribute("aria-expanded", "false");
    await expect(drawer).toBeHidden();

    await navigationButton.click();
    await expect(navigationButton).toHaveAttribute("aria-expanded", "true");
    await expect(drawer).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(navigationButton).toHaveAttribute("aria-expanded", "false");
    await expect(drawer).toBeHidden();
  });
});
