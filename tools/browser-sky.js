async (page) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForFunction(() => window.__elenita?.state().ready);
  if (!(await page.evaluate(() => window.__elenita.state().started)))
    await page
      .getByRole("button", { name: "Entrar al bosque", exact: true })
      .click();
  const tap = async (id) => {
    const before = await page.evaluate(
      (id) => window.__elenita.targets().find((t) => t.id === id),
      id,
    );
    if (!before) throw new Error("Missing sky/quantity target " + id);
    await page.mouse.click(before.x, before.y);
    await page.waitForTimeout(350);
    const after = await page.evaluate(
      (id) => window.__elenita.targets().find((t) => t.id === id),
      id,
    );
    if (after && after.taps <= before.taps)
      throw new Error("Occluded target " + id);
  };
  await page
    .getByRole("button", { name: "El Rincón de los Números", exact: true })
    .click();
  await page.waitForTimeout(4500);
  for (let n = 0; n < 6; n++) {
    await tap("number_" + n);
    const s = await page.evaluate(() => window.__elenita.state());
    if (s.quantity !== n || s.butterflies !== n)
      throw new Error("Quantity " + n);
  }
  const night = await page.evaluate(() => window.__elenita.state().night);
  if (!night) await tap("sun");
  await page.waitForFunction(() => window.__elenita.state().nightBlend > 0.95);
  for (let i = 0; i < 5; i++) await tap("sky_star_" + i);
  await page.locator("#debug").evaluate((el) => (el.hidden = true));
  await page.screenshot({ path: "output/playwright/night-sky.png" });
  await tap("moon");
  await page.waitForFunction(() => window.__elenita.state().nightBlend < 0.05);
  await page.evaluate(
    () =>
      (window.__skyResults = {
        quantities: true,
        sun: true,
        stars: 5,
        moon: true,
      }),
  );
};
