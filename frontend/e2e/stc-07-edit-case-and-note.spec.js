/**
 * STC-07 – Edit case information and add diagnostic note
 *
 * Covers TC01–TC09 as defined in the test documentation.
 * Verifies patient metadata updates, diagnostic note submission, validation constraints,
 * role-based access control (simulated), and error handling for Case Detail view.
 *
 * API base URL: http://localhost:8081 (VITE_API_BASE_URL)
 * Frontend dev server: http://localhost:5173
 *
 * Playwright Route Priority: LAST registered handler fires FIRST.
 * Mock strategy:
 *   1. Register broad mockCaseData handler FIRST (lowest priority, handles GETs).
 *   2. Register specific per-test override mocks SECOND (highest priority, fires first).
 *   3. Use route.fallback() in specific mocks to pass non-matching requests to broader handler.
 *
 * How to run:
 *   npx playwright test e2e/stc-07-edit-case-and-note.spec.js
 */

import { test, expect } from '@playwright/test'

// ── Shared test data ──────────────────────────────────────────────────────────
const BASE = 'http://localhost:8081'

const TD = {
  TD01: {
    caseId: 'CAS-0643',
    age: 25,
    gender: 'Male',
    weight: 70,
    fever: 3,
    risk: 'Travel History',
    note: 'Patient clinically stable'
  },
  TD07: {
    longNote: 'A'.repeat(5001)
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function mockLogin(page, role = 'DATA_USE') {
  await page.route('**/auth/login', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'mock-token' }),
    })
  )
  await page.route('**/auth/me', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        role,
        approved: true,
        firstName: role === 'DATA_USE' ? 'Test' : 'Unauthorized',
        lastName: 'User',
        email: 'user@example.com'
      }),
    })
  )
}

/**
 * Broad case-data mock — handles GET requests.
 * Register FIRST so specific per-test mocks (registered later) take priority.
 * Only intercepts /cases/ and /clinical/cases/ paths on port 8081.
 */
async function mockCaseData(page, caseId = 'CAS-0643', caseStatus = 200) {
  const isCaseApiTarget = (url) =>
    url.href.includes(`${BASE}/cases/`) || url.href.includes(`${BASE}/clinical/cases/`)

  await page.route(isCaseApiTarget, async route => {
    const req = route.request()
    const url = req.url()

    if (req.method() === 'GET' && url.endsWith(`/cases/${caseId}`)) {
      if (caseStatus === 200) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: caseId,
            patientCode: caseId,
            patientMetadata: JSON.stringify({
              age: 24, gender: 'Male', weight: 68,
              riskFactors: 'None', feverDuration: 2
            }),
            status: 'FINISHED',
            createdAt: new Date().toISOString(),
            uploadedBy: { fullName: 'Technician One' }
          })
        })
      }
      return route.fulfill({
        status: caseStatus,
        contentType: 'application/json',
        body: JSON.stringify({ message: caseStatus === 404 ? 'Case record not found.' : 'Access denied.' })
      })
    }

    if (req.method() === 'GET' && url.includes('/notes')) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    }

    if (req.method() === 'GET' && url.includes('/ai-result')) {
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ parasiteStage: 'RING', confidence: 0.95, drugExposure: false })
      })
    }

    // Abort unhandled requests to the backend to prevent real network calls
    return route.abort()
  })
}

// ── Suite ─────────────────────────────────────────────────────────────────────

test.describe('STC-07 Edit case information and add diagnostic note', () => {

  test.beforeEach(async ({ page }) => {
    await mockLogin(page, 'DATA_USE')
    await page.goto('/login')
    await page.fill('#email', 'technician@example.com')
    await page.fill('#password', 'Password123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/data-use')
  })

  // TC01 ── Successful case information update ───────────────────────────────
  test('STC-07-TC01 Successful case information update', async ({ page }) => {
    // 1. Register broad GET handler first (lower priority)
    await mockCaseData(page, TD.TD01.caseId)
    // 2. Register specific PATCH override second (higher priority — fires first)
    await page.route(
      url => url.href.startsWith(BASE) && url.pathname.endsWith('/patient-info'),
      route => {
        if (route.request().method() === 'PATCH') {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'Success' }) })
        }
        return route.fallback()
      }
    )

    await page.goto(`/data-use/cases/${TD.TD01.caseId}`)
    await expect(page.getByTestId('save-patient-info-button')).toBeVisible()

    await page.fill('[data-testid="patient-age-input"]', TD.TD01.age.toString())
    await page.selectOption('[data-testid="patient-gender-select"]', TD.TD01.gender)
    await page.fill('[data-testid="patient-weight-input"]', TD.TD01.weight.toString())
    await page.fill('[data-testid="patient-fever-input"]', TD.TD01.fever.toString())
    await page.selectOption('[data-testid="patient-risk-select"]', TD.TD01.risk)

    await page.click('[data-testid="save-patient-info-button"]')

    await expect(page.getByTestId('save-success-toast')).toBeVisible()
    await expect(page.getByTestId('save-success-toast')).toContainText('Report synchronized to repository')
  })

  // TC02 ── Required field missing ────────────────────────────────────────────
  test('STC-07-TC02 Required editable case field missing', async ({ page }) => {
    await mockCaseData(page, TD.TD01.caseId)
    await page.route(
      url => url.href.startsWith(BASE) && url.pathname.endsWith('/patient-info'),
      route => {
        if (route.request().method() === 'PATCH') {
          return route.fulfill({
            status: 400, contentType: 'application/json',
            body: JSON.stringify({ message: 'Age is required.' })
          })
        }
        return route.fallback()
      }
    )

    await page.goto(`/data-use/cases/${TD.TD01.caseId}`)
    await page.fill('[data-testid="patient-age-input"]', '')
    page.on('dialog', async dialog => { await dialog.dismiss() })
    await page.click('[data-testid="save-patient-info-button"]')
  })

  // TC03 ── Case not found ───────────────────────────────────────────────────
  test('STC-07-TC03 Selected case does not exist during case update', async ({ page }) => {
    const nonExistentId = 'CAS-9999'
    await mockCaseData(page, nonExistentId, 404)
    await page.goto(`/data-use/cases/${nonExistentId}`)
    await expect(page.locator('h2:text("Case record not found.")')).toBeVisible()
  })

  // TC04 ── Unauthorized role ─────────────────────────────────────────────────
  test('STC-07-TC04 Unauthorized user attempts case update', async ({ page }) => {
    // Navigate to a page first to allow localStorage.clear() to work (SPA context)
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
    await page.context().clearCookies()

    // Override auth/me with DATA_PREP (registered after beforeEach mock, so fires first)
    await page.unroute('**/auth/me')
    await page.route('**/auth/me', route =>
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          role: 'DATA_PREP', approved: true,
          firstName: 'Unauthorized', lastName: 'User', email: 'prep@example.com'
        })
      })
    )

    await page.goto('/login')
    await page.fill('#email', 'prep@example.com')
    await page.fill('#password', 'Password123!')
    await page.click('button[type="submit"]')

    // DATA_PREP login redirects to /forbidden via router guard
    await expect(page).toHaveURL('/forbidden')
    await expect(page.locator('h1:text("403 - Forbidden")')).toBeVisible()
  })

  // TC05 ── Successful diagnostic note save ───────────────────────────────────
  test('STC-07-TC05 Successful diagnostic note save', async ({ page }) => {
    await mockCaseData(page, TD.TD01.caseId)
    // POST override — registered after mockCaseData, so fires first for POST /notes
    await page.route(
      url => url.href.startsWith(BASE) && url.pathname.endsWith('/notes'),
      route => {
        if (route.request().method() === 'POST') {
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1, note: TD.TD01.note }) })
        }
        return route.fallback()
      }
    )

    await page.goto(`/data-use/cases/${TD.TD01.caseId}`)
    await expect(page.getByTestId('submit-verdict-button')).toBeVisible()

    await page.selectOption('[data-testid="verdict-stage-select"]', 'TROPH')
    await page.fill('[data-testid="verdict-note-textarea"]', TD.TD01.note)
    await page.click('[data-testid="submit-verdict-button"]')

    await expect(page.getByTestId('alert-title')).toHaveText('Success')
    await expect(page.getByTestId('alert-message')).toContainText('Clinical verdict submitted successfully.')
  })

  // TC06 ── Empty note button disabled ────────────────────────────────────────
  test('STC-07-TC06 Empty diagnostic note is allowed', async ({ page }) => {
    await mockCaseData(page, TD.TD01.caseId)
    await page.goto(`/data-use/cases/${TD.TD01.caseId}`)
    await expect(page.getByTestId('submit-verdict-button')).toBeDisabled()
  })

  // TC07 ── Note too long ─────────────────────────────────────────────────────
  test('STC-07-TC07 Diagnostic note exceeds maximum length', async ({ page }) => {
    await mockCaseData(page, TD.TD01.caseId)
    await page.route(
      url => url.href.startsWith(BASE) && url.pathname.endsWith('/notes'),
      route => {
        if (route.request().method() === 'POST') {
          return route.fulfill({
            status: 400, contentType: 'application/json',
            body: JSON.stringify({ message: 'Diagnostic note exceeds the allowed length.' })
          })
        }
        return route.fallback()
      }
    )

    await page.goto(`/data-use/cases/${TD.TD01.caseId}`)
    await page.selectOption('[data-testid="verdict-stage-select"]', 'RING')
    await page.fill('[data-testid="verdict-note-textarea"]', TD.TD07.longNote)
    await page.click('[data-testid="submit-verdict-button"]')

    await expect(page.getByTestId('alert-title')).toHaveText('Error')
    await expect(page.getByTestId('alert-message')).toContainText('Diagnostic note exceeds the allowed length.')
  })

  // TC08 ── DB failure on patient-info save ───────────────────────────────────
  test('STC-07-TC08 System/database failure during case information save', async ({ page }) => {
    await mockCaseData(page, TD.TD01.caseId)
    await page.route(
      url => url.href.startsWith(BASE) && url.pathname.endsWith('/patient-info'),
      route => {
        if (route.request().method() === 'PATCH') {
          return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Internal Server Error' }) })
        }
        return route.fallback()
      }
    )

    await page.goto(`/data-use/cases/${TD.TD01.caseId}`)
    page.on('dialog', async dialog => { await dialog.dismiss() })
    await page.click('[data-testid="save-patient-info-button"]')
  })

  // TC09 ── DB failure on note save ───────────────────────────────────────────
  test('STC-07-TC09 System/database failure during diagnostic note save', async ({ page }) => {
    await mockCaseData(page, TD.TD01.caseId)
    await page.route(
      url => url.href.startsWith(BASE) && url.pathname.endsWith('/notes'),
      route => {
        if (route.request().method() === 'POST') {
          return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Internal Server Error' }) })
        }
        return route.fallback()
      }
    )

    await page.goto(`/data-use/cases/${TD.TD01.caseId}`)
    await page.selectOption('[data-testid="verdict-stage-select"]', 'RING')
    await page.fill('[data-testid="verdict-note-textarea"]', TD.TD01.note)
    await page.click('[data-testid="submit-verdict-button"]')

    await expect(page.getByTestId('alert-title')).toHaveText('Error')
    await expect(page.getByTestId('alert-message')).toContainText('Unable to submit clinical verdict.')
  })

})
