/**
 * STC-06 – Upload blood smear image and submit for AI analysis
 *
 * Covers TC01–TC07 as defined in the STC-06 test plan.
 * Verifies the clinical case creation workflow, including image validation, metadata requirements, and AI analysis triggering.
 *
 * How to run:
 *   npx playwright test e2e/stc-06-upload-case.spec.js
 */

import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const FIXTURES_DIR = path.join(__dirname, 'fixtures')

// ── Shared test data (mirrors STC-06-TD-*) ───────────────────────────────────
const TD = {
  TD01: { file: 'smear_valid_01.png', location: 'Tak' },
  TD02: { file: 'smear_valid_02.jpg', location: '' },
  TD03: { file: 'smear_invalid_type.pdf', location: 'Tak' },
  TD04: { file: null, location: 'Tak' },
  TD05: { file: 'smear_large_01.jpg', location: 'Tak' },
  TD06: { file: 'smear_valid_03.jpg', location: 'Tak' }, // Reused for rejection
  TD07: { file: 'smear_valid_03.jpg', location: 'Chiang Mai' },
}

// ── Reusable helpers ──────────────────────────────────────────────────────────

/**
 * Mock the complete authentication sequence for a DATA_USE user.
 */
async function mockDataUseLogin(page) {
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
        role: 'DATA_USE', 
        approved: true,
        firstName: 'Test',
        lastName: 'Technician',
        email: 'technician@example.com'
      }),
    })
  )
  await page.route('**/cases/next-patient-code', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: 'P-TEST-001' }),
    })
  )
  await page.route('**/system/status/ai', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ aiStatus: 'ONLINE' }),
    })
  )

  await page.goto('/login')
  await page.fill('#email', 'datause@example.com')
  await page.fill('#password', 'Secure1234')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/data-use/)
}

/**
 * Open the New Case modal.
 */
async function openNewCaseModal(page) {
  await page.getByTestId('new-case-button').click()
  await expect(page.getByTestId('case-upload-modal')).toBeVisible()
}

/**
 * Fill the upload form and submit.
 */
async function fillUploadForm(page, { fileName, location }) {
  if (fileName) {
    const filePath = path.join(FIXTURES_DIR, fileName)
    await page.setInputFiles('input[data-testid="file-input"]', filePath)
    // Wait for preview to appear to ensure file is processed
    await expect(page.locator('img[alt="Preview"]')).toBeVisible()
  }
  
  if (location) {
    const locInput = page.getByTestId('location-input')
    await locInput.fill(location)
    // Wait for dropdown and select the first option
    const option = page.getByTestId('province-option').filter({ hasText: location }).first()
    await option.click()
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STC-06 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('STC-06 Upload blood smear image and submit for AI analysis', () => {

  test.beforeEach(async ({ page }) => {
    await mockDataUseLogin(page)
    await openNewCaseModal(page)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC01 – Successful blood smear image upload and AI submission
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-06-TC01 Successful blood smear image upload and AI submission', async ({ page }) => {
    // Mock successful upload and analysis
    await page.route('**/cases', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 101 }),
      })
    )
    await page.route('**/cases/101/analyze', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'SUCCESS' }),
      })
    )

    await fillUploadForm(page, { fileName: TD.TD01.file, location: TD.TD01.location })
    await page.getByTestId('upload-case-button').click()

    // Assert: Success Alert appears
    await expect(page.getByTestId('alert-title')).toHaveText('Success')
    await expect(page.getByTestId('alert-message')).toContainText('Image is valid and meets the criteria')

    // Click OK and verify redirect
    await page.getByTestId('alert-ok-button').click()
    await expect(page).toHaveURL(/\/data-use\/cases\/101/)
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC02 – Required metadata field missing
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-06-TC02 Required metadata field missing', async ({ page }) => {
    // Fill image but leave location empty
    await fillUploadForm(page, { fileName: TD.TD02.file, location: null })
    
    // Attempt submit
    await page.getByTestId('upload-case-button').click()

    // Assert: Field Required alert
    await expect(page.getByTestId('alert-title')).toHaveText('Field Required')
    await expect(page.getByTestId('alert-message')).toHaveText('Location is required.')
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC03 – Unsupported file format
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-06-TC03 Unsupported file format', async ({ page }) => {
    // Select a PDF file
    await fillUploadForm(page, { fileName: TD.TD03.file, location: TD.TD03.location })
    
    // Attempt submit
    await page.getByTestId('upload-case-button').click()

    // Assert: Unsupported Format alert
    await expect(page.getByTestId('alert-title')).toHaveText('Unsupported Format')
    await expect(page.getByTestId('alert-message')).toHaveText('Unsupported file format.')
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC04 – Image not selected
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-06-TC04 Image not selected', async ({ page }) => {
    // Provide location but no image
    await fillUploadForm(page, { fileName: null, location: TD.TD04.location })
    
    // Implementation Difference: The button is disabled if no image is selected,
    // so we verify the disabled state instead of clicking and checking for an alert.
    // This aligns with SRS-41 (Selection Validation) being implemented pre-emptively.
    const submitBtn = page.getByTestId('upload-case-button')
    await expect(submitBtn).toBeDisabled()
    
    // TODO: If the requirement strictly requires a popup alert, the :disabled 
    // attribute in CaseUploadModal.vue must be updated to allow clicking without a file.
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC05 – File size exceeds configured limit
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-06-TC05 File size exceeds configured limit', async ({ page }) => {
    // Select 12MB file
    await fillUploadForm(page, { fileName: TD.TD05.file, location: TD.TD05.location })
    
    // Attempt submit
    await page.getByTestId('upload-case-button').click()

    // Assert: Limit Exceeded alert
    await expect(page.getByTestId('alert-title')).toHaveText('Limit Exceeded')
    await expect(page.getByTestId('alert-message')).toHaveText('File size exceeds the limit.')
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC06 – Upload rejected by image validation layer
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-06-TC06 Upload rejected by image validation layer', async ({ page }) => {
    // Mock backend rejection (ImageValidationFailed)
    await page.route('**/cases', route =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ 
          type: 'ImageValidationFailed', 
          message: 'Not a blood smear / microscope image' 
        }),
      })
    )

    await fillUploadForm(page, { fileName: TD.TD06.file, location: TD.TD06.location })
    await page.getByTestId('upload-case-button').click()

    // Assert: Upload Rejected alert
    await expect(page.getByTestId('alert-title')).toHaveText('Upload Rejected')
    await expect(page.getByTestId('alert-message')).toHaveText('Not a blood smear / microscope image')
  })

  // ────────────────────────────────────────────────────────────────────────────
  // TC07 – System/database failure during case creation
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-06-TC07 System/database failure during case creation', async ({ page }) => {
    // Mock 500 error
    await page.route('**/cases', route =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      })
    )

    await fillUploadForm(page, { fileName: TD.TD07.file, location: TD.TD07.location })
    await page.getByTestId('upload-case-button').click()

    // Assert: Generic error alert
    await expect(page.getByTestId('alert-title')).toHaveText('Error')
    await expect(page.getByTestId('alert-message')).toHaveText('Error creating case. Please try again later.')
  })

})
