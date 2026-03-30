/**
 * STC-03 – Logout from system
 *
 * Verifies that authenticated users can log out, session tokens are cleared,
 * protected pages are blocked after logout, and failures are handled.
 *
 * How to run:
 *   npx playwright test e2e/stc-03-logout.spec.js
 */

import { test, expect } from '@playwright/test'

const LOGIN_URL = '/login'
const DATA_USE_URL = '/data-use'
const ADMIN_DASHBOARD_URL = '/admin/dashboard'

// ── Shared test data (STC-03-TD-*) ───────────────────────────────────────────
const TD = {
  TD01: { email: 'datause01@example.com', password: 'Secure1234' },
  TD02: { email: 'admin01@example.com', password: 'AdminPass123' },
}

// ── Reusable helpers ──────────────────────────────────────────────────────────

/**
 * Mock the complete authentication sequence (login + fetchMe).
 */
async function mockAuthSequence(page, { loginStatus = 200, loginBody = {}, meStatus = 200, meBody = {} } = {}) {
  await page.route('**/auth/login', route =>
    route.fulfill({
      status: loginStatus,
      contentType: 'application/json',
      body: JSON.stringify(loginBody),
    })
  )

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

/**
 * Helper to login before testing logout.
 */
async function loginAndGoToDataUse(page) {
  await mockAuthSequence(page, {
    loginBody: { token: 'mock-token' },
    meBody: { role: 'DATA_USE', approved: true },
  })

  // Mock dashboard APIs to prevent "Unable to load dashboard data" alerts
  await page.route('**/cases', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) }))
  await page.route('**/visualization/heatmap', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }))
  await page.route('**/system/ai-status', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ aiStatus: 'ONLINE' }) }))

  await page.goto(LOGIN_URL)
  await page.fill('#email', TD.TD01.email)
  await page.fill('#password', TD.TD01.password)
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(new RegExp(DATA_USE_URL))
}

async function loginAndGoToAdmin(page) {
  await mockAuthSequence(page, {
    loginBody: { token: 'mock-token' },
    meBody: { role: 'ADMIN' },
  })

  // Mock common APIs if needed
  await page.route('**/system/ai-status', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ aiStatus: 'ONLINE' }) }))

  await page.goto(LOGIN_URL)
  await page.fill('#email', TD.TD01.email)
  await page.fill('#password', TD.TD01.password)
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(new RegExp(ADMIN_DASHBOARD_URL))
}

/**
 * Helper to perform the logout action via UI.
 */
async function performLogout(page) {
  await page.click('[data-testid="user-avatar-button"]')
  await page.click('[data-testid="logout-button"]')
}

/**
 * Helper to assert token removal from storage.
 */
async function assertTokensCleared(page) {
  const { localStorageToken, sessionStorageToken } = await page.evaluate(() => {
    return {
      localStorageToken: localStorage.getItem('token'),
      sessionStorageToken: sessionStorage.getItem('token')
    }
  })
  expect(localStorageToken).toBeNull()
  expect(sessionStorageToken).toBeNull()
}

/**
 * Helper to assert login page UI state.
 */
async function assertLoginPageVisible(page) {
  await expect(page).toHaveURL(/\/login/)
  await expect(page.locator('#email')).toBeVisible()
  await expect(page.locator('button[type="submit"]')).toBeVisible()
}

// ═══════════════════════════════════════════════════════════════════════════════
// STC-03 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('STC-03 Logout from system', () => {

  // ────────────────────────────────────────────────────────────────────────────
  // STC-03-TC01 Successful logout as Data Use user
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-03-TC01 Successful logout as Data Use user', async ({ page }) => {
    await loginAndGoToDataUse(page)

    // Act
    await performLogout(page)

    // Assert
    await assertLoginPageVisible(page)
    await assertTokensCleared(page)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // STC-03-TC02 Successful logout as Admin user
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-03-TC02 Successful logout as Admin user', async ({ page }) => {
    await loginAndGoToAdmin(page)

    // Act
    await performLogout(page)

    // Assert
    await assertLoginPageVisible(page)
    await assertTokensCleared(page)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // STC-03-TC03 Access protected page after logout
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-03-TC03 Access protected page after logout', async ({ page }) => {
    await loginAndGoToDataUse(page)
    await performLogout(page)
    await assertLoginPageVisible(page)

    // Try to access DATA_USE protected route
    await page.goto(DATA_USE_URL)
    await expect(page).toHaveURL(/\/login/)

    // Also verify ADMIN protected route
    await page.goto(ADMIN_DASHBOARD_URL)
    await expect(page).toHaveURL(/\/login/)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // STC-03-TC04 Logout failure handling
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-03-TC04 Logout failure handling', async ({ page }) => {
    await loginAndGoToDataUse(page)

    // Narrow the failure injection scope: Wait for dashboard data to finish loading 
    // to ensure no other alerts (like "Unable to load dashboard data") interfere.
    // The totalProcessed metric uses a 3xl heading.
    await page.waitForSelector('h2.text-3xl', { state: 'visible', timeout: 15000 });

    // Inject failure at runtime by overriding the Pinia authStore.logout action
    // window.pinia is exposed via the main.js testability hook
    await page.waitForFunction(() => window.pinia?._s?.has('auth'))
    await page.evaluate(() => {
      // pinia._s is the internal map of stores in Pinia
      const authStore = window.pinia._s.get('auth');
      if (authStore) {
        // Mock the logout action to throw an error immediately
        authStore.logout = () => {
          throw new Error('Simulated logout failure');
        };
      }
    });

    // Setup dialog listener BEFORE the action that triggers it
    const dialogPromise = page.waitForEvent('dialog');
    
    // Act: Perform logout.
    const clickPromise = performLogout(page);
    
    // Assert: Real implemented failure message is shown
    const dialog = await dialogPromise;
    // Expected string matches Navbar.vue:149 exactly
    expect(dialog.message()).toBe('Logout failed. Please try again later.');
    await dialog.dismiss();

    // Now the click() promise should resolve after dialog dismissal
    await clickPromise;

    // Assert priority: The system does not remain in an inconsistent authenticated state.
    // This means the user is STILL logged in as since the logout action failed.
    
    // 1. URL remains on the protected page
    await expect(page).toHaveURL(new RegExp(DATA_USE_URL));

    // 2. Authenticated navbar state remains visible (Avatar button is still present)
    await expect(page.locator('[data-testid="user-avatar-button"]')).toBeVisible();

    // 3. Exact storage keys are STILL present (consistent with not being logged out)
    const { localStorageToken, sessionStorageToken } = await page.evaluate(() => {
        return {
          localStorageToken: localStorage.getItem('token'),
          sessionStorageToken: sessionStorage.getItem('token')
        }
    })
    // One of them must be present (depending on "remember me" which was not set, 
    // but loginAndGoToDataUse uses mock-token).
    // Based on tokenStorage.js, it will be in either one.
    expect(localStorageToken || sessionStorageToken).toBe('mock-token');
  })

})
