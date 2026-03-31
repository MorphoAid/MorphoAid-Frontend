import { test, expect } from '@playwright/test'

/**
 * STC-08: Export case report
 * Verify that a Data Use user can export an authorized clinical case report from the Digital Report page.
 * npx playwright test e2e/stc-08-export-case-report.spec.js
 */

const BASE = 'http://localhost:8081'

const MOCK_CASE = {
  id: 777,
  patientCode: 'P-0777',
  status: 'ANALYZED',
  patientMetadata: JSON.stringify({
    age: 25, gender: 'Male', weight: 70, feverDuration: 3, riskFactors: 'Travel History'
  }),
  provinceName: 'Samut Prakan',
  createdAt: '2026-03-29T10:00:00Z',
  imageId: 'IMG-777',
  uploadedBy: { fullName: 'Technician A' }
}

const MOCK_AI = {
  confidence: 0.942,
  parasiteStage: 'RING',
  drugExposure: false,
  rawResponseJson: JSON.stringify({
    images: [{ results: [{ class: 2, confidence: 0.942, box_2d: [100, 100, 200, 200] }] }]
  })
}

test.describe('STC-08 Export case report', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Auth Mocks
    await page.route('**/auth/login', r => r.fulfill({ status: 200, body: JSON.stringify({ token: 'tk' }) }));
    await page.route('**/auth/me', r => r.fulfill({ status: 200, body: JSON.stringify({ id: 1, role: 'DATA_USE', approved: true }) }));

    // 2. High-Precision Regex Mocks
    await page.route(new RegExp(`${BASE}/cases/.*/ai-result`), r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_AI) }));
    await page.route(new RegExp(`${BASE}/cases/.*/content`), r => r.fulfill({ status: 200, contentType: 'image/png', body: Buffer.from([1,2,3]) }));
    await page.route(new RegExp(`${BASE}/clinical/cases/.*/notes`), r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }));

    await page.route(new RegExp(`${BASE}/cases/\\d+$`), async (route) => {
      const u = route.request().url();
      const idStr = u.split('/').pop();
      if (idStr === '9999') return route.fulfill({ status: 404, body: JSON.stringify({ message: '404' }) });
      const status = idStr === '644' ? 'UPLOADED' : 'ANALYZED';
      return route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify({ ...MOCK_CASE, id: parseInt(idStr) || 777, status }) 
      });
    });

    // 3. Login
    await page.goto('/login');
    await page.fill('#email', 't@e.com'); await page.fill('#password', 'P1!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/data-use/);
  })

  test('STC-08-TC01 Successful export from Digital Report page', async ({ page }) => {
    await page.goto('/data-use/cases/777/report')
    
    // Stabilize on loader exit and button presence
    await expect(page.locator('p:has-text("Preparing Diagnostic Report")')).not.toBeVisible({ timeout: 20000 });
    const exportBtn = page.getByTestId('export-report-button').first();
    await expect(exportBtn).toBeVisible({ timeout: 10000 });

    // Spy with async delay to mimic system print dialog behavior
    await page.evaluate(() => {
      window.isPrintCalled = false;
      window.print = () => {
        window.isPrintCalled = true;
        // Simulate async Nature of Print Dialog to ensure onafterprint is assigned
        setTimeout(() => {
          if (window.onafterprint) window.onafterprint();
        }, 100);
      };
    });

    await exportBtn.click();
    
    // Assert modal feedback instead of just the spy flag
    const alertTitle = page.getByTestId('alert-title');
    await expect(alertTitle).toHaveText('Success', { timeout: 10000 });
    
    expect(await page.evaluate(() => window.isPrintCalled)).toBeTruthy();
  })

  test('STC-08-TC02 Selected case does not exist', async ({ page }) => {
    await page.goto('/data-use/cases/9999/report')
    await expect(page.getByRole('heading', { name: /case record not found/i })).toBeVisible();
  })

  test('STC-08-TC03 Case is not eligible for export', async ({ page }) => {
    await page.goto('/data-use/cases/644/report')
    await expect(page.locator('p:has-text("Preparing Diagnostic Report")')).not.toBeVisible();
    await expect(page.getByTestId('export-report-button')).not.toBeVisible();
  })

  test('STC-08-TC04 Export attempted outside Digital Report page', async ({ page }) => {
    await page.goto('/data-use/cases/777')
    await expect(page.getByTestId('view-digital-report-button')).toBeVisible();
    await expect(page.getByTestId('export-report-button')).not.toBeVisible();
  })

  test('STC-08-TC05 Report generation failure', async ({ page }) => {
    await page.goto('/data-use/cases/777/report')
    await expect(page.locator('p:has-text("Preparing Diagnostic Report")')).not.toBeVisible();

    await page.evaluate(() => {
      window.print = () => { throw new Error('fail'); };
    });

    await page.getByTestId('export-report-button').first().click();
    await expect(page.getByTestId('alert-title')).toHaveText('Error');
  })
})
