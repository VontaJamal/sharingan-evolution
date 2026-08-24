import { expect, test } from '@playwright/test';

test('awakens through scene-level and focused keyboard controls', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Sharingan Evolution/);
  await expect(page.getByRole('heading', { name: 'Dormant Eye' })).toBeVisible();
  await expect(page.locator('.cinematic-field')).toHaveAttribute('data-webgl', /^(active|fallback)$/);
  const clanFan = page.locator('.clan-fan-backdrop');
  await expect(clanFan).toBeVisible();
  await expect(clanFan).toHaveAttribute('data-composition', 'peripheral');
  await expect(clanFan).toHaveCSS('animation-name', 'none');
  const eyeBox = await page.locator('.eye-scene').boundingBox();
  const fanBox = await clanFan.boundingBox();
  expect(eyeBox).not.toBeNull();
  expect(fanBox).not.toBeNull();
  expect(fanBox!.x).toBeGreaterThanOrEqual(eyeBox!.x + eyeBox!.width);
  const removedHalo = await page.locator('.eye-scene').evaluate(
    (node) => getComputedStyle(node, '::before').content,
  );
  expect(removedHalo).toBe('none');
  await page.locator('.eye-scene').evaluate((node) => {
    node.setAttribute('data-browser-instance', 'persistent');
  });

  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'One Tomoe Sharingan' })).toBeVisible();
  await expect(page.locator('.eye-scene')).toHaveAttribute('data-browser-instance', 'persistent');
  const frameAfterAwakening = await page.locator('main').evaluate((main) => {
    const awakening = main.querySelector('.awakening')?.getBoundingClientRect();
    return {
      left: awakening?.left,
      scrollLeft: main.scrollLeft,
      width: awakening?.width,
      viewportWidth: window.innerWidth,
    };
  });
  expect(frameAfterAwakening).toEqual({
    left: 0,
    scrollLeft: 0,
    width: frameAfterAwakening.viewportWidth,
    viewportWidth: frameAfterAwakening.viewportWidth,
  });

  await page.getByRole('button', { name: /draw out the second tomoe/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Two Tomoe Sharingan' })).toBeVisible();

  await page.getByRole('button', { name: 'Restart' }).click();
  await expect(page.getByRole('heading', { name: 'Dormant Eye' })).toBeVisible();
  await page.getByRole('button', { name: /awaken the eye/i }).click({
    position: { x: 140, y: 200 },
  });
  await page.waitForTimeout(2200);
  const frameAfterPointerAwakening = await page.locator('.awakening').boundingBox();
  expect(frameAfterPointerAwakening).not.toBeNull();
  expect(frameAfterPointerAwakening!.x).toBe(0);
  expect(frameAfterPointerAwakening!.width).toBe(1280);
});

test('keeps the poster frame anchored after pointer awakening', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto('/');

  await page.getByRole('button', { name: /awaken the eye/i }).click({
    position: { x: 140, y: 200 },
  });
  await page.waitForTimeout(2200);

  const frame = await page.locator('main').evaluate((main) => {
    const awakening = main.querySelector('.awakening')?.getBoundingClientRect();
    return {
      left: awakening?.left,
      scrollLeft: main.scrollLeft,
      scrollTop: main.scrollTop,
      top: awakening?.top,
      width: awakening?.width,
    };
  });
  expect(frame.left).toBe(0);
  expect(frame.scrollLeft).toBe(0);
  expect(frame.scrollTop).toBe(0);
  expect(frame.top).toBeGreaterThan(0);
  expect(frame.width).toBe(1440);
  await context.close();
});

test('paces ocular symbols into the persistent eye', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /awaken the eye/i }).click();
  const transition = await page.locator('.ocular-pattern-layer--tomoe').evaluate((node) => {
    const style = getComputedStyle(node);
    return { duration: style.transitionDuration, property: style.transitionProperty };
  });

  expect(transition).toEqual({
    duration: '1.65s, 2.15s, 0s',
    property: 'opacity, transform, visibility',
  });

  const tomoeReveal = await page.locator('[data-tomoe-slot="0"] .tomoe-glyph').evaluate((node) => {
    const style = getComputedStyle(node);
    return { duration: style.transitionDuration, property: style.transitionProperty };
  });

  expect(tomoeReveal).toEqual({
    duration: '1.2s, 1.7s',
    property: 'opacity, transform',
  });

  const capillaryReveal = await page.locator('.eye-vein--capillary').first().evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      delay: style.transitionDelay,
      duration: style.transitionDuration,
      property: style.transitionProperty,
    };
  });

  expect(capillaryReveal).toEqual({
    delay: '0.4s',
    duration: '1.75s',
    property: 'stroke-dashoffset',
  });

  const firstTomoe = page.locator('[data-tomoe-slot="0"]');
  await firstTomoe.evaluate((node) => node.setAttribute('data-browser-instance', 'one-to-two'));
  await page.getByRole('button', { name: /draw out the second tomoe/i }).click();
  await expect(firstTomoe).toHaveAttribute('data-browser-instance', 'one-to-two');
  await expect(firstTomoe).toHaveAttribute('data-angle', '-60');
  const movingTomoe = page.locator('[data-tomoe-slot="1"]');
  const movingGlyph = movingTomoe.locator('.tomoe-glyph');
  await movingTomoe.evaluate((node) => node.setAttribute('data-browser-instance', 'persistent'));
  await expect(movingTomoe).toHaveAttribute('data-angle', '60');
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

  await expect(page.locator('.clan-fan-backdrop')).toHaveCSS('display', 'none');
  const eye = page.getByRole('button', { name: /awaken the eye/i });
  await expect(eye).toBeInViewport();
  await eye.tap();
  await expect(page.getByRole('heading', { name: 'One Tomoe Sharingan' })).toBeVisible();
  await page.getByRole('button', { name: /current form/i }).tap();
  await expect(page.locator('[data-tomoe-slot="0"]')).toHaveAttribute('data-angle', '-60');
  await expect(page.locator('[data-tomoe-slot="1"]')).toHaveAttribute('data-angle', '60');
  for (let step = 0; step < 2; step += 1) {
    await page.getByRole('button', { name: /current form/i }).tap();
  }
  await page.getByRole('button', { name: 'Cast Amaterasu' }).tap();
  await expect(page.locator('.amaterasu-field')).toHaveAttribute('data-animation', 'active');
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
  await page.getByRole('button', { name: 'Cast Amaterasu' }).click();
  await expect(page.locator('.amaterasu-field')).toHaveClass(/is-active/);
  await expect(page.locator('.amaterasu-field')).toHaveAttribute('data-animation', 'reduced');
  const reducedFrame = await page.locator('.amaterasu-field').getAttribute('data-frame');
  await page.waitForTimeout(180);
  await expect(page.locator('.amaterasu-field')).toHaveAttribute('data-frame', reducedFrame ?? '1');
  await page.getByRole('button', { name: /current form/i }).click();
  await expect(page.locator('.pupil')).toHaveAttribute('data-shape', 'eternal-pupil-triangle');
  await expect(page.locator('.pupil')).toHaveAttribute('data-morph-style', 'ink-pull');
  await expect(page.locator('.pupil')).toHaveCSS('transition-duration', '1e-05s');
  await expect(page.locator('[data-shape="itachi-inherited-blade"]').first()).toHaveCSS(
    'animation-delay',
    '0s',
  );
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
  const flameField = page.locator('.amaterasu-field');
  await expect(page.getByRole('button', { name: 'Cast Amaterasu' })).toBeVisible();
  await expect(flameField).not.toHaveClass(/is-active/);
  await page.getByRole('button', { name: 'Cast Amaterasu' }).click();
  await flameField.evaluate((node) => node.setAttribute('data-browser-instance', 'persistent-amaterasu'));
  await expect(flameField).toHaveClass(/is-active/);
  await expect(flameField).toHaveAttribute('data-animation', 'active');
  const firstFlameFrame = Number(await flameField.getAttribute('data-frame'));
  await expect.poll(async () => Number(await flameField.getAttribute('data-frame'))).toBeGreaterThan(firstFlameFrame);
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
    delay: '0s, 0.85s, 0.65s, 0.65s',
    duration: '2.05s, 0.6s, 0.75s, 0.75s',
    easing:
      'cubic-bezier(0.55, 0.02, 0.25, 1), cubic-bezier(0.55, 0.02, 0.25, 1), cubic-bezier(0.55, 0.02, 0.25, 1), cubic-bezier(0.55, 0.02, 0.25, 1)',
    property: 'd, fill, stroke, stroke-width',
  });
  await page.locator('.sasuke-mangekyo-framework').evaluate((node) => {
    node.setAttribute('data-browser-instance', 'persistent');
  });
  const sharedPupil = page.locator('.pupil');
  await expect(sharedPupil).toHaveAttribute('data-shape', 'pupil');
  await sharedPupil.evaluate((node) => node.setAttribute('data-browser-instance', 'pupil-to-triangle'));

  await page.getByRole('button', { name: /seek the eternal light/i }).click();
  await expect(page.getByRole('heading', { name: 'Eternal Mangekyō Sharingan' })).toBeVisible();
  await expect(page.locator('.sasuke-mangekyo-framework')).toHaveAttribute(
    'data-browser-instance',
    'persistent',
  );
  await expect(page.locator('.ocular-pattern-layer--eternal')).toHaveClass(/is-unfolding/);
  await expect(page.locator('[data-shape="itachi-inherited-blade"]')).toHaveCount(3);
  await expect(sharedPupil).toHaveAttribute('data-browser-instance', 'pupil-to-triangle');
  await expect(sharedPupil).toHaveAttribute('data-shape', 'eternal-pupil-triangle');
  await expect(sharedPupil).toHaveAttribute('data-morph-style', 'ink-pull');
  await expect(sharedPupil).toHaveCSS('animation-name', 'eternal-pupil-pull');
  await expect(page.locator('.eternal-core')).toHaveCount(0);
  const inheritedBlades = page.locator('[data-shape="itachi-inherited-blade"]');
  await expect(inheritedBlades).toHaveCount(3);
  await expect(inheritedBlades.first()).toHaveAttribute('data-morph-origin', 'pupil');
  const bladeMotion = await inheritedBlades.first().evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      delay: style.animationDelay,
      duration: style.animationDuration,
      easing: style.animationTimingFunction,
      fillMode: style.animationFillMode,
      name: style.animationName,
    };
  });
  expect(bladeMotion).toEqual({
    delay: '0.18s',
    duration: '1.42s',
    easing: 'cubic-bezier(0.35, 0.02, 0.18, 1)',
    fillMode: 'both',
    name: 'eternal-blade-pour',
  });
  const pupilMotion = await sharedPupil.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      duration: style.transitionDuration,
      property: style.transitionProperty,
    };
  });
  expect(pupilMotion).toEqual({
    duration: '1.65s, 1.65s',
    property: 'd, transform',
  });
  await page.getByRole('button', { name: /receive six paths power/i }).click();
  await expect(page.getByRole('heading', { name: "Sasuke's Six Paths Rinnegan" })).toBeVisible();
  await expect(flameField).toHaveAttribute('data-browser-instance', 'persistent-amaterasu');
  await expect(flameField).toHaveClass(/is-active/);
  await expect(page.locator('[data-rinnegan-band="inner"]')).toHaveCount(3);
  await expect(page.locator('[data-rinnegan-band="outer"]')).toHaveCount(3);
  await expect(page.locator('[data-shape="rinnegan-ripple"]')).toHaveCount(4);

  await page.getByRole('button', { name: 'End Amaterasu' }).click();
  await expect(flameField).not.toHaveClass(/is-active/);
  await expect(flameField).toHaveAttribute('data-animation', 'idle');
  await expect(flameField).toHaveAttribute('data-frame', '0');
});
