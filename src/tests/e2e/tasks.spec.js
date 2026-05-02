import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display task board', async ({ page }) => {
    await expect(page.locator('text=Task Board')).toBeVisible();
  });

  test('should show new task button', async ({ page }) => {
    const newTaskButton = page.getByRole('button', { name: /new task/i });
    await expect(newTaskButton).toBeVisible();
  });
});
