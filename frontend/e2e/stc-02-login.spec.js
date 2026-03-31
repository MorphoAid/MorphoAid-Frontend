/**
 * STC-02 – Login to System
 *
 * Covers TC01–TC09 as defined in the STC-02 test plan.
 * Verifies role-based landing page redirection and error handling.
 *
 * How to run:
 *   npx playwright test e2e/stc-02-login.spec.js
 */

import { test, expect } from '@playwright/test'

const LOGIN_URL = '/login'

// ── Shared test data (mirrors STC-02-TD-*) ───────────────────────────────────
const TD = {
  TD01: { email: 'datause01@example.com', password: 'Secure1234' },
  TD02: { email: 'admin01@example.com', password: 'AdminPass123' },
  TD03: { email: '', password: '' },
  TD04: { email: 'wrongformat.com', password: 'Secure1234' },
  TD05: { email: 'datause01@example.com', password: 'WrongPass123' },
  TD06: { email: 'pendingdoctor@example.com', password: 'Secure1234' },
  TD07: { email: 'blockeduser@example.com', password: 'Secure1234' },
  TD08: { email: 'ghost@example.com', password: 'Secure1234' },
  TD09: { email: 'admin01@example.com', password: 'AdminPass123' },
}

// ── Reusable helpers ──────────────────────────────────────────────────────────

/**
 * Navigate to the login page and wait for the form to be visible.
 */
async function goToLogin(page) {
  await page.goto(LOGIN_URL)
  await expect(page.locator('#email')).toBeVisible()
  // Bypass native browser validation to allow testing the app's custom validation logic
  await page.evaluate(() => {
    document.querySelector('form')?.setAttribute('novalidate', 'true')
  })
}

/**
 * Fill the login form and submit.
 */
async function fillLoginForm(page, email, password) {
  if (email !== null) await page.fill('#email', email)
  if (password !== null) await page.fill('#password', password)
  await page.click('button[type="submit"]')
}

/**
 * Mock the complete authentication sequence (login + fetchMe).
 */
async function mockAuthSequence(page, { loginStatus = 200, loginBody = {}, meStatus = 200, meBody = {} } = {}) {
  // Mock login endpoint
  await page.route('**/auth/login', route =>
    route.fulfill({
      status: loginStatus,
      contentType: 'application/json',
      body: JSON.stringify(loginBody),
    })
  )

  // Mock fetchMe endpoint
  if (loginStatus === 200) {
    await page.route('**/auth/me', route =>
      route.fulfill({
        status: meStatus,
        contentType: 'application/json',
        body: JSON.stringify(meBody),
      })
    )
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STC-02 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('STC-02 Login to System', () => {

  test.beforeEach(async ({ page }) => {
    await goToLogin(page)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC01 – Successful login as Data Use user
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-02-TC01 Successful login as Data Use user', async ({ page }) => {
    await mockAuthSequence(page, {
      loginBody: { token: 'mock-token' },
      meBody: { role: 'DATA_USE', approved: true },
    })

    await fillLoginForm(page, TD.TD01.email, TD.TD01.password)

    // Assert: Redirected to /data-use
    await expect(page).toHaveURL(/\/data-use/, { timeout: 10_000 })
    // Assert: No error message remains visible
    await expect(page.locator('.bg-error-container')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC02 – Successful login as Admin user
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-02-TC02 Successful login as Admin user', async ({ page }) => {
    await mockAuthSequence(page, {
      loginBody: { token: 'mock-token' },
      meBody: { role: 'ADMIN' },
    })

    await fillLoginForm(page, TD.TD02.email, TD.TD02.password)

    // Assert: Redirected to /admin/dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10_000 })
    // Assert: No error message remains visible
    await expect(page.locator('.bg-error-container')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC03 – Required fields missing
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-02-TC03 Required fields missing', async ({ page }) => {
    let apiCalled = false
    page.on('request', request => {
      if (request.url().includes('/auth/login')) apiCalled = true
    })

    await fillLoginForm(page, '', '')

    // Assert: User remains on login page
    await expect(page).toHaveURL(/\/login/)
    // Assert: Client-side validation errors
    await expect(page.getByText('Email is required.', { exact: true })).toBeVisible()
    await expect(page.getByText('Password is required.', { exact: true })).toBeVisible()
    // Assert: Login API not called
    expect(apiCalled).toBe(false)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC04 – Invalid email / malformed credential input
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-02-TC04 Invalid email / malformed credential input', async ({ page }) => {
    let apiCalled = false
    page.on('request', request => {
      if (request.url().includes('/auth/login')) apiCalled = true
    })

    await fillLoginForm(page, TD.TD04.email, TD.TD04.password)

    // Assert: User remains on login page
    await expect(page).toHaveURL(/\/login/)
    // Assert: Client-side validation error
    await expect(page.getByText('Email is invalid.', { exact: true })).toBeVisible()
    // Assert: Login API not called
    expect(apiCalled).toBe(false)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC05 – Incorrect password
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-02-TC05 Incorrect password', async ({ page }) => {
    await mockAuthSequence(page, { loginStatus: 401 })

    await fillLoginForm(page, TD.TD05.email, TD.TD05.password)

    // Assert: Error message
    await expect(page.getByText('Invalid email or password.', { exact: true })).toBeVisible()
    // Assert: User remains on login page and no redirect happened
    await expect(page).toHaveURL(/\/login/)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC06 – Pending doctor account
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-02-TC06 Pending doctor account', async ({ page }) => {
    await mockAuthSequence(page, {
      loginBody: { token: 'mock-token' },
      meBody: { role: 'DATA_USE', approved: false },
    })

    await fillLoginForm(page, TD.TD06.email, TD.TD06.password)

    // Assert: Redirected to /verification-pending
    await expect(page).toHaveURL(/\/verification-pending/)
    // Assert: No error message remains visible
    await expect(page.locator('.bg-error-container')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC07 – Account not allowed
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-02-TC07 Account not allowed', async ({ page }) => {
    await mockAuthSequence(page, { loginStatus: 403 })

    await fillLoginForm(page, TD.TD07.email, TD.TD07.password)

    // Assert: Error message
    await expect(page.getByText('This account is not allowed to access the system.', { exact: true })).toBeVisible()
    // Assert: User remains on login page
    await expect(page).toHaveURL(/\/login/)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC08 – Non-existing account
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-02-TC08 Non-existing account', async ({ page }) => {
    await mockAuthSequence(page, { loginStatus: 401 })

    await fillLoginForm(page, TD.TD08.email, TD.TD08.password)

    // Assert: Error message
    await expect(page.getByText('Invalid email or password.', { exact: true })).toBeVisible()
    // Assert: User remains on login page
    await expect(page).toHaveURL(/\/login/)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC09 – System error during login
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-02-TC09 System error during login', async ({ page }) => {
    // Simulate 500 error
    await mockAuthSequence(page, { loginStatus: 500 })

    await fillLoginForm(page, TD.TD09.email, TD.TD09.password)

    // Assert: Generic server error message
    await expect(page.getByText('Login failed. Please try again later.', { exact: true })).toBeVisible()
    // Assert: User remains on login page
    await expect(page).toHaveURL(/\/login/)
  })

})
