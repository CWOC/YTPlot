import { test, expect } from '@playwright/test';

test.describe('Manual Course Lifecycle', () => {
  test('creates inline-edits and deletes a manual course', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('PANEL DE CONTROL')).toBeVisible();

    await page.getByText('+ CURSO MANUAL').click();
    await expect(page.getByText('CREAR CURSO MANUAL')).toBeVisible();

    await page.getByPlaceholder('Título del curso...').fill('Curso de prueba');
    await page
      .getByPlaceholder('Descripción del curso (opcional)...')
      .fill('Descripción del curso de prueba');

    await page.getByRole('button', { name: 'CREAR CURSO' }).click();
    await expect(page.getByText('CREAR CURSO MANUAL')).not.toBeVisible();

    await expect(page.locator('h3', { hasText: 'Curso de prueba' })).toBeVisible();

    await page.getByRole('link', { name: /resume/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/course\/\d+/);

    await expect(page.getByRole('button', { name: 'Curso de prueba', exact: true })).toBeVisible();
    await expect(page.getByText('Descripción del curso de prueba')).toBeVisible();
    await expect(page.getByText('0%')).toBeVisible();

    await page.getByRole('button', { name: 'Curso de prueba', exact: true }).click();
    const editInput = page.locator('header input');
    await editInput.fill('Curso editado');
    await editInput.press('Enter');

    await expect(page.getByRole('button', { name: 'Curso editado', exact: true })).toBeVisible();

    page.on('dialog', (d) => d.accept());
    await page.getByText('ELIMINAR CURSO').click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Curso editado')).not.toBeVisible();
  });
});
