import { expect, test } from '@playwright/test';

test('awakens through scene-level and focused keyboard controls', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Sharingan Evolution/);
  await expect(page.getByRole('heading', { name: 'Dormant Eye' })).toBeVisible();
  await expect(page.locator('.cinematic-field')).toHaveAttribute('data-webgl', 'active');
  await page.locator('.eye-scene').evaluate((node) => {
    node.setAttribute('data-browser-instance', 'persistent');
  });

  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'One Tomoe Sharingan' })).toBeVisible();
  await expect(page.locator('.eye-scene')).toHaveAttribute('data-browser-instance', 'persistent');

  await page.getByRole('button', { name: /draw out the second tomoe/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Two Tomoe Sharingan' })).toBeVisible();

  await page.getByRole('button', { name: 'Restart' }).click();
  await expect(page.getByRole('heading', { name: 'Dormant Eye' })).toBeVisible();
});

test('paces ocular symbols into the persistent eye', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Enter');
  const transition = await page.locator('.ocular-pattern-layer--tomoe').evaluate((node) => {
    const style = getComputedStyle(node);
    return { duration: style.transitionDuration, property: style.transitionProperty };
  });

  expect(transition).toEqual({
    duration: '2s, 2.6s, 0s',
    property: 'opacity, transform, visibility',
  });
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
  await expect(page.locator('.cinematic-field')).toHaveAttribute('data-webgl', 'fallback');
  await expect(page.locator('.chakra-particle').first()).toHaveCSS('display', 'none');
  await context.close();
});

test('renders Sasuke-specific Mangekyō and Eternal geometry in the browser', async ({ page }) => {
  await page.goto('/');

  for (let step = 0; step < 4; step += 1) {
    await page.getByRole('button', { name: /current form/i }).click();
  }

  await expect(page.getByRole('heading', { name: 'Mangekyō Sharingan' })).toBeVisible();
  await expect(page.locator('[data-shape="sasuke-mangekyo-petal"]')).toHaveCount(6);
  await expect(page.locator('[data-shape="sasuke-mangekyo-lens"]')).toHaveCount(3);
  await page.locator('.sasuke-mangekyo-framework').evaluate((node) => {
    node.setAttribute('data-browser-instance', 'persistent');
  });

  await page.getByRole('button', { name: /seek the eternal light/i }).click();
  await expect(page.getByRole('heading', { name: 'Eternal Mangekyō Sharingan' })).toBeVisible();
  await expect(page.locator('.sasuke-mangekyo-framework')).toHaveAttribute(
    'data-browser-instance',
    'persistent',
  );
  await expect(page.locator('[data-shape="itachi-inherited-blade"]')).toHaveCount(3);
  await expect(page.locator('.eternal-core')).toBeVisible();
});
