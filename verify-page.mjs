import { chromium } from "file:///C:/Users/venka/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright-core@1.60.0/node_modules/playwright-core/index.mjs";
import path from "node:path";

const pagePath = `file:///${path.resolve("index.html").replaceAll("\\", "/")}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(pagePath, { waitUntil: "domcontentloaded" });
await page.locator(".theme-toggle").click();
await page.locator("#site-search-input").fill("safety");
await page.locator(".site-search").evaluate((form) => form.requestSubmit());
await page.locator("#resource-search").fill("skill");
await page.locator("[data-category='skills']").click();
const snapshot = await page.evaluate(() => ({
  title: document.title,
  width: document.documentElement.scrollWidth,
  sections: document.querySelectorAll("main section").length,
  visibleResources: [...document.querySelectorAll(".resource-card:not(.hidden)")].length,
  theme: document.documentElement.dataset.theme,
  errors: []
}));
await browser.close();
console.log(JSON.stringify({ ...snapshot, errors }, null, 2));
if (errors.length) process.exit(1);
