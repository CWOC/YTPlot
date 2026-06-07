import { test, expect } from '@playwright/test';

test.describe('Course YouTube Import', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('PANEL DE CONTROL')).toBeVisible();
  });

  test('imports a YouTube video into an empty manual course', async ({ page }) => {
    const courseData = {
      id: 1,
      type: 'manual',
      title: 'Curso manual',
      description: 'Curso vacío para importar',
      thumbnail: null,
      publishedAt: '2024-06-01T00:00:00.000Z',
      items: [],
      progress: 0,
      notes: '',
    };

    await page.evaluate(async (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = await new Promise<any>((resolve, reject) => {
        const req = indexedDB.open('YTPlotDB', 1);
        req.onupgradeneeded = () => {
          if (!req.result.objectStoreNames.contains('courses')) {
            req.result.createObjectStore('courses', {
              keyPath: 'id',
              autoIncrement: true,
            });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      const tx = db.transaction('courses', 'readwrite');
      const store = tx.objectStore('courses');
      await store.clear();
      await store.put(data);
      await tx.done;
    }, courseData);

    await page.goto('/dashboard/course/1');
    await expect(page.getByText('Volver al panel')).toBeVisible();

    await expect(page.getByText('Aún no hay videos. Agrega contenido pegando un enlace de YouTube en el campo de arriba.')).toBeVisible();

    await page.route('**/youtube/v3/videos**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              id: 'dQw4w9WgXcQ',
              snippet: {
                title: 'Mock Video Title',
                description: 'Mock description',
                channelTitle: 'Mock Channel',
                publishedAt: '2024-01-01T00:00:00.000Z',
                thumbnails: {
                  medium: { url: 'https://example.com/thumb.jpg' },
                },
              },
            },
          ],
        }),
      });
    });

    await page
      .getByLabel('URL de YouTube para agregar al curso')
      .fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    await page.getByText('AGREGAR AL CURSO').click();

    await expect(page.getByText('Mock Video Title')).toBeVisible();
  });
});
