import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // This assumes user is already logged in
    // In real tests, you'd set up authentication state
    await page.goto('/dashboard');
  });

  test('should display task board', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.locator('text=Tasks')).toBeVisible();
  });

  test('should show new task button', async ({ page }) => {
    await page.goto('/tasks');
    const newTaskButton = page.getByRole('button', { name: /new task/i });
    await expect(newTaskButton).toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    await page.goto('/tasks');
    
    // Check for status filter buttons
    await expect(page.getByRole('button', { name: /all/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /to do/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /in progress/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /done/i })).toBeVisible();
  });

  test('should display task statistics', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for task count cards
    await expect(page.locator('text=Total Tasks')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
  });

  test('should navigate between sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to Tasks
    await page.getByRole('link', { name: /tasks/i }).click();
    await expect(page).toHaveURL(/.*tasks/);
    
    // Navigate to Team
    await page.getByRole('link', { name: /team/i }).click();
    await expect(page).toHaveURL(/.*team/);
    
    // Navigate back to Dashboard
    await page.getByRole('link', { name: /dashboard/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
