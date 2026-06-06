import { test, expect } from '@playwright/test';

test.describe('Navegación e Interactividad del Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    // Ir a la página de inicio
    await page.goto('/');
  });

  test('debe mostrar el sidebar expandido por defecto', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/open/);

    const logo = page.locator('aside').locator('text=YTPlot');
    await expect(logo).toBeVisible();

    const toggleBtn = page.locator('.toggleButton');
    await expect(toggleBtn.locator('.material-symbols-outlined')).toHaveText('logout');
  });

  test('debe colapsar y expandir el sidebar al hacer clic en el botón de toggle', async ({
    page,
  }) => {
    const sidebar = page.locator('aside');
    const toggleBtn = page.locator('.toggleButton');

    // Inicialmente expandido
    await expect(sidebar).toHaveClass(/open/);

    // Clic para colapsar
    await toggleBtn.click();
    await expect(sidebar).toHaveClass(/collapsed/);
    await expect(toggleBtn.locator('.material-symbols-outlined')).toHaveText('login');

    // Clic para expandir de nuevo
    await toggleBtn.click();
    await expect(sidebar).toHaveClass(/open/);
    await expect(toggleBtn.locator('.material-symbols-outlined')).toHaveText('logout');
  });

  test('debe cambiar de ruta al hacer clic en los enlaces de navegación', async ({ page }) => {
    // Clic en el enlace de Dashboard
    await page.click('text=Dashboard');

    // Validar que la URL cambió
    await expect(page).toHaveURL(/\/dashboard/);

    // Validar que el contenido principal cambió (DashboardPage renders "Mis Cursos")
    const mainHeading = page.locator('main h1');
    await expect(mainHeading).toHaveText('Mis Cursos');

    // Volver al Inicio
    await page.click('text=Inicio');
    await expect(page).toHaveURL(/\/$/);
  });
});
