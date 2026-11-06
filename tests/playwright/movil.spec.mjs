import { expect, test } from '@playwright/test';

async function adjuntarCaptura(page, testInfo, nombre) {
  await testInfo.attach(nombre, {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
}

test('PW01: el menú móvil abre y cierra al ir a Habitaciones', async ({ page }, testInfo) => {
  await page.goto('/');
  const menu = page.getByRole('button', { name: /^(Abrir|Cerrar) menú$/ });
  const habitaciones = page.locator('.navigation').getByRole('link', { name: 'Habitaciones' });

  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.tap();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toHaveAccessibleName('Cerrar menú');
  await expect(habitaciones).toBeVisible();
  await adjuntarCaptura(page, testInfo, 'menú abierto en viewport móvil');
  await habitaciones.tap();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#habitaciones$/);

  const { viewport, content } = await page.evaluate(() => ({
    viewport: window.innerWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(viewport).toBe(390);
  expect(content).toBeLessThanOrEqual(viewport);
});

test('PW02: el filtro familiar muestra Refugio Familiar y se puede restablecer', async ({ page }, testInfo) => {
  await page.goto('/');
  const habitaciones = page.locator('.room-card');
  await expect(habitaciones).toHaveCount(3);
  await page.getByRole('button', { name: 'En familia', exact: true }).tap();
  await expect(habitaciones).toHaveCount(1);
  await expect(habitaciones.first()).toContainText('Refugio Familiar');
  await adjuntarCaptura(page, testInfo, 'resultado del filtro familiar');

  await page.getByRole('button', { name: 'Todas', exact: true }).tap();
  await expect(habitaciones).toHaveCount(3);
});
