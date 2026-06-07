import { test, expect } from '@playwright/test';

test.describe('Navegación e Interactividad del Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe mostrar el sidebar expandido por defecto', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/open/);

    const logo = sidebar.locator('text=YTPlot');
    await expect(logo).toBeVisible();

    const toggleBtn = page.getByRole('button', { name: /contraer/i });
    await expect(toggleBtn.locator('.material-symbols-outlined')).toHaveText('logout');
  });

  test('debe colapsar y expandir el sidebar al hacer clic en el botón de toggle', async ({
    page,
  }) => {
    const sidebar = page.locator('aside');
    const toggleBtn = page.getByRole('button', { name: /contraer/i });

    await expect(sidebar).toHaveClass(/open/);

    await toggleBtn.click();
    await expect(sidebar).toHaveClass(/collapsed/);

    const expandBtn = page.getByRole('button', { name: /expandir/i });
    await expect(expandBtn.locator('.material-symbols-outlined')).toHaveText('login');

    await expandBtn.click();
    await expect(sidebar).toHaveClass(/open/);

    const collapseBtn = page.getByRole('button', { name: /contraer/i });
    await expect(collapseBtn.locator('.material-symbols-outlined')).toHaveText('logout');
  });

  test('debe cambiar de ruta al hacer clic en los enlaces de navegación', async ({ page }) => {
    await page.click('text=Dashboard');

    await expect(page).toHaveURL(/\/dashboard/);

    const mainHeading = page.locator('main h1');
    await expect(mainHeading).toHaveText('Mis Cursos');

    await page.click('text=Inicio');
    await expect(page).toHaveURL(/\/$/);
  });
});
