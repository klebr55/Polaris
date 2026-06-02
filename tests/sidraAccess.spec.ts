import { test } from "next/experimental/testmode/playwright";
import { expect } from "@playwright/test";

test("should display skeleton and handle 500 error gracefully", async ({ page, next }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  const pageErrors: Error[] = [];
  page.on("pageerror", (err) => {
    pageErrors.push(err);
  });

  next.onFetch(async (request) => {
    if (request.url.includes("1220/periodos/all/variaveis/2584")) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return new Response(null, {
        status: 500,
        statusText: "Internal Server Error",
      });
    }
    return "continue";
  });

  await page.goto("/");

  const skeleton = page.locator(".animate-pulse");
  await expect(skeleton).toBeVisible();

  const fallback = page.locator("text=Dados de Internet indisponiveis");
  await expect(fallback).toBeVisible({ timeout: 5000 });
  await expect(skeleton).not.toBeVisible();

  expect(pageErrors.length).toBe(0);
});
