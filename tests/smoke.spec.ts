import { expect, test } from '@playwright/test';

test('awakens through pointer and keyboard controls', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Sharingan Evolution/);
  await expect(page.getByRole('heading', { name: 'Dormant Eye' })).toBeVisible();

  await page.getByRole('button', { name: /awaken the eye/i }).click();
  await expect(page.getByRole('heading', { name: 'One Tomoe Sharingan' })).toBeVisible();

  await page.getByRole('button', { name: /draw out the second tomoe/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Two Tomoe Sharingan' })).toBeVisible();

  await page.getByRole('button', { name: 'Restart' }).click();
  await expect(page.getByRole('heading', { name: 'Dormant Eye' })).toBeVisible();
});

test('keeps the experience usable in a phone viewport', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('/');

  const eye = page.getByRole('button', { name: /awaken the eye/i });
  await expect(eye).toBeInViewport();
  await eye.tap();
  await expect(page.getByRole('heading', { name: 'One Tomoe Sharingan' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Discovered eye stages' })).toBeVisible();
  await context.close();
});

test('switches off continuous motion for reduced-motion users', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');

  await expect(page.locator('main')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('.chakra-particle').first()).toHaveCSS('display', 'none');
  await context.close();
});
