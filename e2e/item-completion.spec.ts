import { test, expect } from '@playwright/test';

test.describe('Item Completion and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('PANEL DE CONTROL')).toBeVisible();
  });

  test('marks items complete and navigates between them', async ({ page }) => {
    const courseData = {
      id: 1,
      type: 'manual',
      title: 'Curso de prueba',
      description: 'Descripción del curso',
      thumbnail: null,
      publishedAt: '2024-06-01T00:00:00.000Z',
      items: [
        {
          id: 'video1',
          title: 'Video 1',
          description: 'Desc 1',
          thumbnail: 'https://example.com/1.jpg',
          channelTitle: 'Canal 1',
          publishedAt: '2024-01-01T00:00:00.000Z',
          completed: false,
          notes: '',
        },
        {
          id: 'video2',
          title: 'Video 2',
          description: 'Desc 2',
          thumbnail: 'https://example.com/2.jpg',
          channelTitle: 'Canal 2',
          publishedAt: '2024-02-01T00:00:00.000Z',
          completed: false,
          notes: '',
        },
        {
          id: 'video3',
          title: 'Video 3',
          description: 'Desc 3',
          thumbnail: 'https://example.com/3.jpg',
          channelTitle: 'Canal 3',
          publishedAt: '2024-03-01T00:00:00.000Z',
          completed: false,
          notes: '',
        },
      ],
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

    const items = page.locator('h3').filter({ hasText: /Video \d/ });
    await expect(items).toHaveCount(3);

    await page.getByText('COMPLETADO').first().click();
    await expect(page.getByText('DESMARCAR')).toBeVisible();
    await expect(page.getByText('33%')).toBeVisible();

    await page.getByText('Video 1').click();
    await expect(page).toHaveURL('/dashboard/course/1/item/video1');

    const iframe = page.locator('iframe');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute('src', /youtube\.com\/embed\//);

    await expect(page.getByText('MARCAR COMO PENDIENTE')).toBeVisible();

    await page.getByText('SIGUIENTE').click();
    await expect(page).toHaveURL('/dashboard/course/1/item/video2');

    await page.getByText('ANTERIOR').click();
    await expect(page).toHaveURL('/dashboard/course/1/item/video1');
  });
});
