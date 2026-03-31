/**
 * STC-04 – Delete user account
 *
 * Verifies that admins can delete users, handle confirmation dialogs,
 * and that roles/errors are handled correctly.
 *
 * How to run:
 *   npx playwright test e2e/stc-04-delete-user.spec.js
 */

import { test, expect } from '@playwright/test'

const LOGIN_URL = '/login'
const ADMIN_USERS_URL = '/admin/users'
const FORBIDDEN_URL = '/forbidden'

// ── Shared test data (STC-04-TD-*) ───────────────────────────────────────────
const TD = {
  ADMIN: { email: 'admin@test.com', password: 'Admin123!' },
  DATA_USE: { email: 'datause01@example.com', password: 'Secure1234' },
}

const MOCK_USERS = [
  { id: 1000, email: 'admin@test.com', username: 'admin01', role: 'ADMIN', createdAt: '2026-01-01T00:00:00Z' },
  { id: 1001, email: 'datause01@example.com', username: 'datause01', role: 'DATA_USE', createdAt: '2026-03-20T10:00:00Z' },
  { id: 1002, email: 'datause02@example.com', username: 'datause02', role: 'DATA_USE', createdAt: '2026-03-21T11:00:00Z' },
  { id: 1003, email: 'admin02@example.com', username: 'admin03', role: 'ADMIN', createdAt: '2026-03-22T12:00:00Z' },
  { id: 1005, email: 'datause05@example.com', username: 'datause05', role: 'DATA_USE', createdAt: '2026-03-23T13:00:00Z' },
]

// ── Reusable helpers ──────────────────────────────────────────────────────────

async function setupMocks(page, { users = MOCK_USERS, role = 'ADMIN', email = TD.ADMIN.email } = {}) {
  await page.route(url => url.href.includes(':8081/auth/login'), (route) => 
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'mock-token' }) })
  )
  await page.route(url => url.href.includes(':8081/auth/me'), (route) => 
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1000, email, role, approved: true }) })
  )
  await page.route(url => url.href.includes(':8081/admin/activities'), (route) => 
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
  )
  await page.route(url => url.href.includes(':8081/system/status/ai'), (route) => 
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ aiStatus: 'ONLINE' }) })
  )
  // Shared GET users mock
  await page.route(url => url.href.includes(':8081/admin/users'), (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(users) })
    }
    return route.continue()
  }, { times: 10 }) // Allow multiple hits
}

async function loginAndGoToUsers(page, { role = 'ADMIN', email = TD.ADMIN.email, password = TD.ADMIN.password } = {}) {
  page.removeAllListeners('request');
  page.removeAllListeners('response');
  page.removeAllListeners('dialog');
  page.on('request', request => console.log('REQ:', request.method(), request.url()));
  page.on('response', response => {
    if (response.status() >= 400) console.log('ERR:', response.status(), response.url());
    else console.log('RES:', response.status(), response.url());
  });

  await setupMocks(page, { role, email })

  await page.goto(LOGIN_URL)
  await page.fill('#email', email)
  await page.fill('#password', password)
  await page.click('button[type="submit"]')
  
  await page.waitForLoadState('networkidle')
  
  if (role === 'ADMIN') {
    await expect(page).toHaveURL(/\/admin\/dashboard/)
    await page.getByRole('link', { name: /Users/i }).click()
    await expect(page).toHaveURL(ADMIN_USERS_URL, { timeout: 15000 })
    await page.waitForSelector('[data-testid="user-row"]', { timeout: 15000 })
  } else {
    await expect(page).toHaveURL(/\/(data-use|data-prep)/)
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STC-04 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('STC-04 Delete user account', () => {

  test('STC-04-TC01 Successful user deletion', async ({ page }) => {
    await loginAndGoToUsers(page)

    page.once('dialog', dialog => dialog.accept())
    
    // Explicitly mock the specific DELETE and the REFRESH GET
    await page.route(url => url.href.includes(':8081/admin/users/1001/reject'), (route) => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: "OK" }) })
      }
      return route.continue()
    })
    
    const updatedUsers = MOCK_USERS.filter(u => u.id !== 1001)
    await page.route(url => url.href.endsWith(':8081/admin/users'), (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(updatedUsers) })
      }
      return route.continue()
    })

    // Act
    await page.locator('[data-testid="user-row"]', { hasText: 'datause01@example.com' })
              .getByTestId('delete-user-button').click()

    // Assert: Use increased timeout for sync
    await expect(page.getByText('User deleted successfully.')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="user-row"]', { hasText: 'datause01@example.com' })).not.toBeVisible()
  })

  test('STC-04-TC02 Cancel deletion', async ({ page }) => {
    await loginAndGoToUsers(page)

    let apiCalled = false
    await page.route(url => url.href.includes(':8081/admin/users/'), (route) => {
      if (route.request().method() === 'DELETE') {
        apiCalled = true
        return route.fulfill({ status: 200 })
      }
      return route.continue()
    })

    page.once('dialog', dialog => dialog.dismiss())
    await page.locator('[data-testid="user-row"]', { hasText: 'datause02@example.com' })
              .getByTestId('delete-user-button').click()

    expect(apiCalled).toBe(false)
    await expect(page.locator('[data-testid="user-row"]', { hasText: 'datause02@example.com' })).toBeVisible()
  })

  test('STC-04-TC03 Attempt to delete the last remaining admin', async ({ page }) => {
    await loginAndGoToUsers(page)
    page.once('dialog', dialog => dialog.accept())

    await page.route(url => url.href.includes(':8081/admin/users/1003/reject'), (route) => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: "Last Admin" }) })
      }
      return route.continue()
    })

    await page.locator('[data-testid="user-row"]', { hasText: 'admin02@example.com' })
              .getByTestId('delete-user-button').click()

    await expect(page.getByText('Error deleting user. Please try again later.')).toBeVisible()
  })

  test('STC-04-TC04 Target user does not exist', async ({ page }) => {
    await loginAndGoToUsers(page)
    page.once('dialog', dialog => dialog.accept())

    await page.route(url => url.href.includes(':8081/admin/users/1005/reject'), (route) => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 404 })
      }
      return route.continue()
    })

    await page.locator('[data-testid="user-row"]', { hasText: 'datause05@example.com' })
              .getByTestId('delete-user-button').click()

    await expect(page.getByText('Error deleting user. Please try again later.')).toBeVisible()
  })

  test('STC-04-TC05 System error during deletion', async ({ page }) => {
    await loginAndGoToUsers(page)
    page.once('dialog', dialog => dialog.accept())

    await page.route(url => url.href.includes(':8081/admin/users/1005/reject'), (route) => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 500 })
      }
      return route.continue()
    })

    await page.locator('[data-testid="user-row"]', { hasText: 'datause05@example.com' })
              .getByTestId('delete-user-button').click()

    await expect(page.getByText('Error deleting user. Please try again later.')).toBeVisible()
  })

  test('STC-04-TC06 Unauthorized deletion attempt', async ({ page }) => {
    await loginAndGoToUsers(page, { role: 'DATA_USE', email: TD.DATA_USE.email, password: TD.DATA_USE.password })
    
    // Attempt to navigate directly to an admin page
    // We use a full goto to trigger the router-guard's init() logic
    await page.goto(ADMIN_USERS_URL)
    
    // Expect redirect to forbidden
    // The role DATA_USE should be rejected by the guard for /admin/users
    await expect(page).toHaveURL(/.*\/forbidden/, { timeout: 20000 })
    await expect(page.getByText('403 - Forbidden')).toBeVisible()
  })

})
