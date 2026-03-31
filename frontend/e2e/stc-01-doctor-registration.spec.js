/**
 * STC-01 – Doctor Registration (Data-Use / Medical Account)
 *
 * Covers TC01–TC12 as defined in the STC-01 test plan.
 * All network calls are intercepted with page.route() so the backend
 * does not need to be running during these tests.
 *
 * How to run:
 *   npx playwright test e2e/stc-01-doctor-registration.spec.js --headed
 *   npx playwright test e2e/stc-01-doctor-registration.spec.js          (headless)
 */

import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

// ── Resolve fixture directory (ESM-safe) ─────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.join(__dirname, 'fixtures')

// ── Shared constants ──────────────────────────────────────────────────────────
const REGISTER_URL = '/register/data-use'

// ── Shared test data (mirrors STC-01-TD-*) ───────────────────────────────────
const TD = {
  /** TD-01 – Successful registration */
  TD01: {
    title: 'Dr.',
    firstName: 'John',
    lastName: 'Doe',
    email: 'doctor01@example.com',
    password: 'Secure1234',
    confirmPassword: 'Secure1234',
    agree: true,
    licenseNumber: 'MD-123456',
    hospital: 'Chiang Mai Hospital',
    document: 'doctor_license_card.jpg',
  },
  /** TD-05 – Password too short */
  TD05: { email: 'doctor02@example.com', password: 'short1', confirmPassword: 'short1' },
  /** TD-06 – Password too long */
  TD06: { email: 'doctor03@example.com', password: 'VeryLongPassword123456789', confirmPassword: 'VeryLongPassword123456789' },
  /** TD-07 – Password mismatch */
  TD07: { email: 'doctor04@example.com', password: 'Secure1234', confirmPassword: 'Secure5678' },
  /** TD-08 – Agreement not checked */
  TD08: { email: 'doctor05@example.com', password: 'Secure1234', confirmPassword: 'Secure1234', agree: false },
  /** TD-09 – Step 2 required fields missing */
  TD09: { email: 'doctor06@example.com', password: 'Secure1234', confirmPassword: 'Secure1234' },
  /** TD-10 – Missing verification document */
  TD10: { email: 'doctor07@example.com', password: 'Secure1234', confirmPassword: 'Secure1234' },
  /** TD-11 – Unsupported file format */
  TD11: { email: 'doctor08@example.com', password: 'Secure1234', confirmPassword: 'Secure1234', document: 'doctor_license_card.exe' },
  /** TD-12 – System/database error */
  TD12: { email: 'doctor09@example.com', password: 'Secure1234', confirmPassword: 'Secure1234' },
}

// ── Reusable helpers ──────────────────────────────────────────────────────────

/**
 * Fill Step 1 fields.
 * @param {import('@playwright/test').Page} page
 * @param {object} opts
 */
async function fillStep1(page, {
  title = 'Dr.',
  firstName = 'John',
  lastName = 'Doe',
  email,
  password,
  confirmPassword,
  agree = true,
} = {}) {
  // Title select (missing ID, find by label text or placeholder)
  await page.selectOption('select', title)
  
  // First/Last Name inputs (missing IDs, use placeholders)
  await page.fill('input[placeholder*="As shown on medical license"]', firstName)
  await page.fill('input[placeholder="Enter last name"]', lastName)
  
  // Email input (use input type)
  await page.fill('input[type="email"]', email)
  
  // Passwords (multiple with same placeholder, use nth)
  await page.fill('input[placeholder="••••••••"] >> nth=0', password)
  await page.fill('input[placeholder="••••••••"] >> nth=1', confirmPassword)
  
  if (agree) {
    const checkbox = page.locator('#terms')
    const checked = await checkbox.isChecked()
    if (!checked) await checkbox.check()
  }
}

/**
 * Mock the checkEmail API endpoint.
 * @param {import('@playwright/test').Page} page
 * @param {number} status  HTTP status to reply with (200 = email free, 409 = taken)
 */
async function mockCheckEmail(page, status = 200) {
  await page.route('**/auth/check-email**', route =>
    route.fulfill({ status, contentType: 'application/json', body: '{}' })
  )
}

/**
 * Mock the registration API endpoint.
 * @param {import('@playwright/test').Page} page
 * @param {number} status
 * @param {object} body
 */
async function mockRegister(page, status = 201, body = {}) {
  await page.route('**/auth/register', route =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
  )
}

/**
 * Navigate to the registration page and wait until Step 1 form is visible.
 */
async function goToRegister(page) {
  await page.goto(REGISTER_URL)
  await expect(page.locator('select')).toBeVisible()
  // Bypass native browser validation to allow testing the app's custom validation logic
  await page.evaluate(() => {
    document.querySelector('form')?.setAttribute('novalidate', 'true')
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// STC-01 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('STC-01 Doctor Registration', () => {

  // ────────────────────────────────────────────────────────────────────────────
  // TC01 – Successful doctor registration
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC01 Successful doctor registration', async ({ page }) => {
    // Arrange: mock both API calls to succeed
    await mockCheckEmail(page, 200)
    await mockRegister(page, 201, { message: 'Account created' })

    await goToRegister(page)

    // Step 1 – fill and proceed
    await fillStep1(page, {
      email: TD.TD01.email,
      password: TD.TD01.password,
      confirmPassword: TD.TD01.confirmPassword,
    })
    await page.click('button[type="submit"]') // "Proceed to Step 2"

    // Step 2 – must be visible
    await expect(page.locator('#license')).toBeVisible()

    // Step 2 – fill
    await page.fill('#license', TD.TD01.licenseNumber)
    await page.fill('#hospital', TD.TD01.hospital)

    // Upload valid document
    await page.locator('input[type="file"]').setInputFiles(path.join(FIXTURES, TD.TD01.document))

    // Complete Verification
    await page.click('button[type="submit"]')

    // Assert: redirected to /login
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC02 – Step 1 required fields missing
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC02 Step 1 required fields missing', async ({ page }) => {
    await goToRegister(page)

    // Submit without filling anything
    await page.click('button[type="submit"]')

    // Assert: required-field errors are shown and user stays on Step 1
    await expect(page.getByText('Title is required.', { exact: true })).toBeVisible()
    await expect(page.getByText('First name is required.', { exact: true })).toBeVisible()
    await expect(page.getByText('Last name is required.', { exact: true })).toBeVisible()
    await expect(page.getByText('Email is required.', { exact: true })).toBeVisible()
    await expect(page.getByText('Password is required.', { exact: true })).toBeVisible()

    // User must remain on Step 1 (Step 2 form not shown)
    await expect(page.locator('#license')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC03 – Invalid email format
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC03 Invalid email format', async ({ page }) => {
    await goToRegister(page)

    await fillStep1(page, {
      email: 'doctorexample.com', // TD-03: no @ sign
      password: 'Secure1234',
      confirmPassword: 'Secure1234',
    })
    await page.click('button[type="submit"]')

    // Assert: email-invalid error
    await expect(page.getByText('Email is invalid.', { exact: true })).toBeVisible()

    // User remains on Step 1
    await expect(page.locator('#license')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC04 – Duplicate email
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC04 Duplicate email', async ({ page }) => {
    // Mock checkEmail to return 409 Conflict
    await mockCheckEmail(page, 409)

    await goToRegister(page)

    await fillStep1(page, {
      email: 'existing@example.com', // TD-04
      password: 'Secure1234',
      confirmPassword: 'Secure1234',
    })
    await page.click('button[type="submit"]')

    // Assert: duplicate-email error message
    await expect(page.locator('text=This email already exists.')).toBeVisible()

    // User remains on Step 1
    await expect(page.locator('#license')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC05 – Password too short
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC05 Password too short', async ({ page }) => {
    await goToRegister(page)

    await fillStep1(page, {
      email: TD.TD05.email,
      password: TD.TD05.password,       // 'short1' = 6 chars
      confirmPassword: TD.TD05.confirmPassword,
    })
    await page.click('button[type="submit"]')

    // Assert
    await expect(page.locator('text=Password must be at least 8 characters.')).toBeVisible()
    await expect(page.locator('#license')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC06 – Password too long
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC06 Password too long', async ({ page }) => {
    await goToRegister(page)

    await fillStep1(page, {
      email: TD.TD06.email,
      password: TD.TD06.password,            // 25 chars
      confirmPassword: TD.TD06.confirmPassword,
    })
    await page.click('button[type="submit"]')

    // Assert
    await expect(page.locator('text=Password must not exceed 20 characters.')).toBeVisible()
    await expect(page.locator('#license')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC07 – Password mismatch
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC07 Password mismatch', async ({ page }) => {
    await goToRegister(page)

    await fillStep1(page, {
      email: TD.TD07.email,
      password: TD.TD07.password,           // 'Secure1234'
      confirmPassword: TD.TD07.confirmPassword, // 'Secure5678'
    })
    await page.click('button[type="submit"]')

    // Assert
    await expect(page.locator('text=Password does not match.')).toBeVisible()
    await expect(page.locator('#license')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC08 – Agreement checkbox not checked
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC08 Agreement checkbox not checked', async ({ page }) => {
    await goToRegister(page)

    await fillStep1(page, {
      email: TD.TD08.email,
      password: TD.TD08.password,
      confirmPassword: TD.TD08.confirmPassword,
      agree: false, // TD-08: agreement = false
    })
    await page.click('button[type="submit"]')

    // Assert: agreement error (actual message from component)
    await expect(
      page.locator('text=You must agree to the terms and privacy policy to continue.')
    ).toBeVisible()
    await expect(page.locator('#license')).not.toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC09 – Step 2 required fields missing
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC09 Step 2 required fields missing', async ({ page }) => {
    // Allow step 1 to pass (email check succeeds)
    await mockCheckEmail(page, 200)

    await goToRegister(page)

    await fillStep1(page, {
      email: TD.TD09.email,
      password: TD.TD09.password,
      confirmPassword: TD.TD09.confirmPassword,
    })
    await page.click('button[type="submit"]') // move to Step 2

    // Step 2 must be visible
    await expect(page.locator('#license')).toBeVisible()

    // Submit Step 2 without filling anything
    await page.click('button[type="submit"]')

    // Assert: required-field errors for Step 2 inputs
    await expect(page.getByText('Medical license number is required.', { exact: true })).toBeVisible()
    await expect(page.getByText('Affiliated hospital or clinic is required.', { exact: true })).toBeVisible()
    await expect(page.getByText('Verification document is required.', { exact: true })).toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC10 – Missing verification document
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC10 Missing verification document', async ({ page }) => {
    await mockCheckEmail(page, 200)

    await goToRegister(page)

    await fillStep1(page, {
      email: TD.TD10.email,
      password: TD.TD10.password,
      confirmPassword: TD.TD10.confirmPassword,
    })
    await page.click('button[type="submit"]')

    await expect(page.locator('#license')).toBeVisible()

    // Fill license and hospital but omit document
    await page.fill('#license', 'MD-123456')
    await page.fill('#hospital', 'Chiang Mai Hospital')

    await page.click('button[type="submit"]')

    // Assert: document-required error
    await expect(page.locator('text=Verification document is required.')).toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC11 – Unsupported verification document format
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC11 Unsupported verification document format', async ({ page }) => {
    await mockCheckEmail(page, 200)

    await goToRegister(page)

    await fillStep1(page, {
      email: TD.TD11.email,
      password: TD.TD11.password,
      confirmPassword: TD.TD11.confirmPassword,
    })
    await page.click('button[type="submit"]')

    await expect(page.locator('#license')).toBeVisible()

    await page.fill('#license', 'MD-123456')
    await page.fill('#hospital', 'Chiang Mai Hospital')

    // Upload unsupported .exe file
    // NOTE: The native <input type="file"> accept attribute filters files in the
    // OS picker but Playwright can bypass it with setInputFiles().
    // The application's client-side MIME check (validateStep2) will catch the
    // unsupported type and display the expected error.
    await page.locator('input[type="file"]').setInputFiles(path.join(FIXTURES, 'doctor_license_card.exe'))

    await page.click('button[type="submit"]')

    // Assert: unsupported-format error
    await expect(
      page.locator('text=Unsupported file format. Please upload a valid verification document.')
    ).toBeVisible()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC12 – System/database error during registration
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-01-TC12 System/database error during registration', async ({ page }) => {
    // Allow checkEmail to pass
    await mockCheckEmail(page, 200)
    // Simulate a 500 Internal Server Error on the registration endpoint
    await mockRegister(page, 500, { message: 'Internal Server Error' })

    await goToRegister(page)

    await fillStep1(page, {
      email: TD.TD12.email,
      password: TD.TD12.password,
      confirmPassword: TD.TD12.confirmPassword,
    })
    await page.click('button[type="submit"]')

    await expect(page.locator('#license')).toBeVisible()

    await page.fill('#license', 'MD-123456')
    await page.fill('#hospital', 'Chiang Mai Hospital')
    await page.locator('input[type="file"]').setInputFiles(path.join(FIXTURES, 'doctor_license_card.jpg'))

    await page.click('button[type="submit"]')

    // Assert: generic server error message
    // The component stores this in errors.licenseNumber and shows it inside the
    // error banner when it contains 'failed'.
    // Use .first() as it may appear twice (under input and in banner)
    await expect(
      page.getByText('Registration failed. Please try again later.', { exact: true }).first()
    ).toBeVisible({ timeout: 10_000 })

    // Account must not have been created – still on the registration page
    await expect(page).not.toHaveURL(/\/login/)
  })

})
