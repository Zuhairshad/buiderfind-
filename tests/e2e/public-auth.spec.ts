import { expect, test } from "@playwright/test";

test("login and registration entry points render", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await page.goto("/builder-signup");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await page.goto("/post-a-job");
  await expect(page.getByRole("heading", { name: /Post a job/ })).toBeVisible();
});

test("homepage uses supplied photo avatars for customer cards", async ({ page }) => {
  await page.goto("/");
  const avatars = page.locator('img[alt$="profile photo"]');
  await expect(avatars).not.toHaveCount(0);
  const visibleAvatar = page.locator('img[alt$="profile photo"]:visible').first();
  await expect(visibleAvatar).toHaveAttribute("src", /avatars/);
  const avatarResponse = await page.request.get("/avatars/083.webp");
  expect(avatarResponse.ok()).toBe(true);
  expect(avatarResponse.headers()["content-type"]).toContain("image/webp");
});

test("homepage ends with the footer without the removed bottom CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Ready to find your perfect builder?" })).toHaveCount(0);
  await expect(page.getByText("Post your job now — free, fast, no obligation.")).toHaveCount(0);
  await expect(page.locator("footer")).toBeVisible();
});

test("login links to safe hirer and builder dashboard previews", async ({ page }) => {
  const apiRequests: string[] = [];
  page.on("request", (request) => { if (request.url().includes("/api/")) apiRequests.push(request.url()); });
  await page.goto("/login");
  await expect(page.getByRole("link", { name: "Hirer preview" })).toHaveAttribute("href", "/dashboard/preview/customer");
  await expect(page.getByRole("link", { name: "Builder preview" })).toHaveAttribute("href", "/dashboard/preview/builder");
  await page.goto("/dashboard/preview/customer");
  await expect(page.getByRole("heading", { name: "Manage your home projects" })).toBeVisible();
  await page.goto("/dashboard/preview/builder");
  await expect(page.getByRole("heading", { name: "Turn local leads into booked work" })).toBeVisible();
  expect(apiRequests).toEqual([]);
});
