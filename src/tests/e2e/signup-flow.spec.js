import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display signup form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Create Account');
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.locator('text=Please fill in all fields')).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm Password').fill('password456');
    
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should show error for short password', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password', { exact: true }).fill('12345');
    await page.getByLabel('Confirm Password').fill('12345');
    
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show Google signup button', async ({ page }) => {
    const googleButton = page.getByRole('button', { name: /continue with google/i });
    await expect(googleButton).toBeVisible();
  });
});
