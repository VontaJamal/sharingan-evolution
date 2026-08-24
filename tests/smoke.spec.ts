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

  await page.getByRole('button', { name: /awaken the eye/i }).click();
  const transition = await page.locator('.ocular-pattern-layer--tomoe').evaluate((node) => {
    const style = getComputedStyle(node);
    return { duration: style.transitionDuration, property: style.transitionProperty };
  });

  expect(transition).toEqual({
    duration: '2s, 2.6s, 0s',
    property: 'opacity, transform, visibility',
  });

  const tomoeReveal = await page.locator('[data-tomoe-slot="0"] .tomoe-glyph').evaluate((node) => {
    const style = getComputedStyle(node);
    return { duration: style.transitionDuration, property: style.transitionProperty };
  });

  expect(tomoeReveal).toEqual({
    duration: '1.5s, 2s',
    property: 'opacity, transform',
  });

  await page.getByRole('button', { name: /draw out the second tomoe/i }).click();
  const movingTomoe = page.locator('[data-tomoe-slot="1"]');
  const movingGlyph = movingTomoe.locator('.tomoe-glyph');
  await movingTomoe.evaluate((node) => node.setAttribute('data-browser-instance', 'persistent'));
  await expect(movingGlyph).toHaveCSS('opacity', '1');

  await page.getByRole('button', { name: /complete the pattern/i }).click();

  await expect(page.locator('.ocular-pattern-layer--tomoe .tomoe-mark')).toHaveCount(3);
  await expect(movingTomoe).toHaveAttribute('data-browser-instance', 'persistent');
  await expect(movingTomoe).toHaveAttribute('data-angle', '120');
  await expect(movingGlyph).toHaveCSS('opacity', '1');
  await expect(page.locator('.ocular-pattern-layer--tomoe .tomoe-mark.is-visible')).toHaveCount(3);
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
  await expect(page.getByRole('navigation', { name: 'Eye evolution stages' })).toBeVisible();
  await context.close();
});

test('switches off continuous motion for reduced-motion users', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');

  await expect(page.locator('main')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('.cinematic-field')).toHaveAttribute('data-webgl', 'fallback');
  await expect(page.locator('.chakra-particle').first()).toHaveCSS('display', 'none');

  for (let step = 0; step < 4; step += 1) {
    await page.getByRole('button', { name: /current form/i }).click();
  }

  const reducedLensMotion = await page
    .locator('[data-shape="sasuke-mangekyo-lens"]')
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node);
      return { delay: style.transitionDelay, duration: style.transitionDuration };
    });
  expect(reducedLensMotion).toEqual({
    delay: '0s',
    duration: '1e-05s',
  });
  await context.close();
});

test('morphs into Sasuke-specific Mangekyō and Eternal geometry in the browser', async ({ page }) => {
  await page.goto('/');

  for (let step = 0; step < 3; step += 1) {
    await page.getByRole('button', { name: /current form/i }).click();
  }

  const sharedPath = page.locator('[data-tomoe-slot="0"] .tomoe-shape');
  await sharedPath.evaluate((node) => node.setAttribute('data-browser-instance', 'tomoe-to-lens'));
  await page.getByRole('button', { name: /break beyond the limit/i }).click();

  await expect(page.getByRole('heading', { name: 'Mangekyō Sharingan' })).toBeVisible();
  await expect(page.locator('[data-shape="sasuke-mangekyo-petal"]')).toHaveCount(6);
  await expect(page.locator('[data-shape="sasuke-mangekyo-lens"]')).toHaveCount(3);
  await expect(sharedPath).toHaveAttribute('data-shape', 'sasuke-mangekyo-lens');
  await expect(sharedPath).toHaveAttribute('data-browser-instance', 'tomoe-to-lens');
  await expect(page.locator('.ocular-pattern-layer--tomoe')).toHaveClass(/is-morphing/);
  await expect(page.locator('.ocular-pattern-layer--mangekyo')).toHaveClass(/is-forming/);
  const lensMotion = await page.locator('[data-shape="sasuke-mangekyo-lens"]').first().evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      delay: style.transitionDelay,
      duration: style.transitionDuration,
      easing: style.transitionTimingFunction,
      property: style.transitionProperty,
    };
  });
  expect(lensMotion).toEqual({
    delay: '0s, 1.05s, 0.8s, 0.8s',
    duration: '2.4s, 0.7s, 0.9s, 0.9s',
    easing:
      'cubic-bezier(0.55, 0.02, 0.25, 1), cubic-bezier(0.55, 0.02, 0.25, 1), cubic-bezier(0.55, 0.02, 0.25, 1), cubic-bezier(0.55, 0.02, 0.25, 1)',
    property: 'd, fill, stroke, stroke-width',
  });
  await page.locator('.sasuke-mangekyo-framework').evaluate((node) => {
    node.setAttribute('data-browser-instance', 'persistent');
  });

  await page.getByRole('button', { name: /seek the eternal light/i }).click();
  await expect(page.getByRole('heading', { name: 'Eternal Mangekyō Sharingan' })).toBeVisible();
  await expect(page.locator('.sasuke-mangekyo-framework')).toHaveAttribute(
    'data-browser-instance',
    'persistent',
  );
  await expect(page.locator('.ocular-pattern-layer--eternal')).toHaveClass(/is-unfolding/);
  await expect(page.locator('[data-shape="itachi-inherited-blade"]')).toHaveCount(3);
  const bladeMotion = await page.locator('[data-shape="itachi-inherited-blade"]').first().evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      duration: style.transitionDuration,
      easing: style.transitionTimingFunction,
      property: style.transitionProperty,
    };
  });
  expect(bladeMotion).toEqual({
    duration: '2.2s',
    easing: 'cubic-bezier(0.55, 0.02, 0.25, 1)',
    property: 'transform',
  });
  await expect(page.locator('.eternal-core')).toBeVisible();
});
