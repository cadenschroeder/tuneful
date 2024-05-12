import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

// expects page title, login buttons, pun
test("on page load, i see a login button", async ({ page }) => {
  await expect(page.getByLabel("page-title")).toBeVisible();
  await expect(page.getByLabel("google-sign-in")).toBeVisible();
  await expect(page.getByLabel("incognito-sign-in")).toBeVisible();
  await expect(page.getByLabel("pun")).toBeVisible();
});

// after clicking incognito, expects proper buttons
test("after clicking incognito, i see a login in with/without spotify buttons", async ({
  page,
}) => {
  await page.getByLabel("incognito-sign-in").click();
  await expect(page.getByLabel("intermediate-logout")).toBeVisible();
  await expect(page.getByLabel("login-with-spotify")).toBeVisible();
  await expect(page.getByLabel("login-without-spotify")).toBeVisible();
});

test("after clicking incognito, logout brings me back", async ({ page }) => {
  await page.getByLabel("incognito-sign-in").click();
  await page.getByLabel("intermediate-logout").click();
  await expect(page.getByLabel("page-title")).toBeVisible();
  await expect(page.getByLabel("google-sign-in")).toBeVisible();
  await expect(page.getByLabel("incognito-sign-in")).toBeVisible();
  await expect(page.getByLabel("pun")).toBeVisible();
});

test("after logging out, i can sign in again", async ({ page }) => {
  await page.getByLabel("incognito-sign-in").click();
  await page.getByLabel("intermediate-logout").click();
  await page.getByLabel("incognito-sign-in").click();
  await expect(page.getByLabel("intermediate-logout")).toBeVisible();
  await expect(page.getByLabel("login-with-spotify")).toBeVisible();
  await expect(page.getByLabel("login-without-spotify")).toBeVisible();
});

// tests that selecting genre page looks as expected
test("after signing in, i am presented with genre choices", async ({
  page,
}) => {
  await page.getByLabel("incognito-sign-in").click();
  await page.getByLabel("login-without-spotify").click();
  await expect(page.getByLabel("start-message")).toBeVisible();
  await expect(page.getByLabel("select-genre")).toBeVisible();

  // checking if radio elements are visible
  await expect(page.getByLabel("genres-group")).toBeVisible();
  await expect(page.getByLabel("0")).toBeVisible();
  await expect(page.getByLabel("1")).toBeVisible();
  await expect(page.getByLabel("6")).toBeVisible();
  await expect(page.getByLabel("4")).toBeVisible();

  // bottom buttons are visible
  await expect(page.getByLabel("continue-button")).toBeVisible();
  await expect(page.getByLabel("back-button")).toBeVisible();
  await expect(page.getByLabel("select-logout")).toBeVisible();
});

test("after choosing a genre, i can see swiping cards", async ({ page }) => {
  await page.getByLabel("incognito-sign-in").click();
  await page.getByLabel("login-without-spotify").click();
  await page.getByLabel("0").click();
  await page.getByLabel("continue-button").click();

  // bottom buttons visible
  await expect(page.getByLabel("music-button")).toBeVisible();
  await expect(page.getByLabel("swiping-logout")).toBeVisible();
  await expect(page.getByLabel("swiping-back")).toBeVisible();
  await expect(page.getByLabel("finish-button")).toBeVisible();

  // top buttons visible
  await expect(page.getByLabel("theme-display")).toBeVisible();
  await expect(page.getByLabel("counter")).toBeVisible();
  await expect(page.getByLabel("clear-button")).toBeVisible();

  await expect(page.getByLabel("card")).toBeVisible();
});

test("without choosing a genre, i don't continue", async ({ page }) => {
  await page.getByLabel("incognito-sign-in").click();
  await page.getByLabel("login-without-spotify").click();
  await page.getByLabel("continue-button").click();

  // bottom buttons hidden
  await expect(page.getByLabel("music-button")).toBeHidden();
  await expect(page.getByLabel("swiping-logout")).toBeHidden();
  await expect(page.getByLabel("swiping-back")).toBeHidden();
  await expect(page.getByLabel("finish-button")).toBeHidden();

  // top buttons hidden
  await expect(page.getByLabel("theme-display")).toBeHidden();
  await expect(page.getByLabel("counter")).toBeHidden();
  await expect(page.getByLabel("clear-button")).toBeHidden();

  await expect(page.getByLabel("card")).toBeHidden();

  await expect(page.getByLabel("start-message")).toBeVisible();
  await expect(page.getByLabel("select-genre")).toBeVisible();

  // checking if radio elements are visible
  await expect(page.getByLabel("genres-group")).toBeVisible();
  await expect(page.getByLabel("0")).toBeVisible();
  await expect(page.getByLabel("1")).toBeVisible();
  await expect(page.getByLabel("6")).toBeVisible();
  await expect(page.getByLabel("4")).toBeVisible();

  // bottom buttons are visible
  await expect(page.getByLabel("continue-button")).toBeVisible();
  await expect(page.getByLabel("back-button")).toBeVisible();
  await expect(page.getByLabel("select-logout")).toBeVisible();
});

test("after swiping on a card, i can see another", async ({ page }) => {
  await page.getByLabel("incognito-sign-in").click();
  await page.getByLabel("login-without-spotify").click();
  await page.getByLabel("0").click();
  await page.getByLabel("continue-button").click();

  await expect(page.getByLabel("card")).toBeVisible();

  await page.getByLabel("like-button").click();
  await expect(page.getByLabel("card")).toBeVisible();
  await page.getByLabel("dislike").click();
  await expect(page.getByLabel("card")).toBeVisible();
  await page.getByLabel("dislike").click();
  await page.getByLabel("pause-button").click();
});
