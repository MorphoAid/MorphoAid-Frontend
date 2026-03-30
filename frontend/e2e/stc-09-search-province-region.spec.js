import { test, expect } from '@playwright/test'

/**
 * STC-09: Search by province or region
 * Verify that an authorized user can search clinical visualization data by province or region.
 * npx playwright test e2e/stc-08-export-case-report.spec.js
 */

const BASE = 'http://localhost:8081'

const MOCK_SUMMARY = {
  totalAnalyses: 1250,
  avgConfidence: 94.2,
  topStage: 'Ring',
  activeProvinces: 12
}

const MOCK_HEATMAP = [
  { provinceNameEn: 'Chiang Mai', provinceNameTh: 'เชียงใหม่', value: 85 },
  { provinceNameEn: 'Bangkok', provinceNameTh: 'กรุงเทพฯ', value: 120 },
  { provinceNameEn: 'Phuket', provinceNameTh: 'ภูเก็ต', value: 45 }
]

test.describe('STC-09 Search by province or region', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock Authentication
    await page.route('**/auth/login', r => r.fulfill({ status: 200, body: JSON.stringify({ token: 'tk' }) }));
    await page.route('**/auth/me', r => r.fulfill({ status: 200, body: JSON.stringify({ id: 1, role: 'DATA_USE', approved: true }) }));

    // 2. Mock Visualization Data
    await page.route(`${BASE}/visualization/summary`, r => r.fulfill({ status: 200, body: JSON.stringify(MOCK_SUMMARY) }));
    await page.route(`${BASE}/visualization/heatmap`, r => r.fulfill({ status: 200, body: JSON.stringify(MOCK_HEATMAP) }));
    await page.route(`${BASE}/visualization/trend*`, r => r.fulfill({ status: 200, body: JSON.stringify([]) }));
    await page.route(`${BASE}/visualization/ai-confidence`, r => r.fulfill({ status: 200, body: JSON.stringify([]) }));
    
    // Mock cases fetch often triggered by DataUseLayout or TestHub
    await page.route(`${BASE}/cases*`, r => r.fulfill({ status: 200, body: JSON.stringify({ data: [] }) }));
    await page.route(`${BASE}/system/ai-status`, r => r.fulfill({ status: 200, body: JSON.stringify({ aiStatus: 'ONLINE' }) }));

    // 3. Login and Navigate
    await page.goto('/login')
    await page.fill('#email', 't@e.com'); await page.fill('#password', 'P1!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/data-use/);
  })

  test('STC-09-TC01 Successful search by province', async ({ page }) => {
    const searchInput = page.getByTestId('navbar-search-input');
    await searchInput.fill('Chiang Mai');
    
    // Verify results dropdown appears
    const dropdown = page.getByTestId('search-results-dropdown');
    await expect(dropdown).toBeVisible();
    
    // Select Chiang Mai from results
    await page.click('text=Chiang Mai');
    
    // Assert 1: Search input value updates
    await expect(searchInput).toHaveValue('Chiang Mai');
    
    // Assert 2: Dropdown closes
    await expect(dropdown).not.toBeVisible();
    
    // Assert 3: Regional summary heading updates to reflect selection
    const heading = page.getByTestId('insight-region-heading');
    await expect(heading).toContainText('Chiang Mai Provinces');
  })

  test('STC-09-TC02 Successful search by region', async ({ page }) => {
    const searchInput = page.getByTestId('navbar-search-input');
    await searchInput.fill('Northern Region');
    
    const dropdown = page.getByTestId('search-results-dropdown');
    await expect(dropdown).toBeVisible();
    
    // Select Northern Region from results
    await page.click('text=Northern Region');
    
    await expect(searchInput).toHaveValue('Northern Region');
    await expect(dropdown).not.toBeVisible();
    
    // Assert Heading reflects the region selection
    const heading = page.getByTestId('insight-region-heading');
    await expect(heading).toContainText('Northern Region Provinces');
  })

  test('STC-09-TC03 Unsupported search term', async ({ page }) => {
    const searchInput = page.getByTestId('navbar-search-input');
    await searchInput.fill('xyz123');
    
    // Verify "No matching resultsfound" message
    const noResults = page.getByTestId('search-no-results');
    await expect(noResults).toBeVisible();
    await expect(noResults).toContainText(/No matching results found/i);
  })

  test('STC-09-TC04 Empty search input', async ({ page }) => {
    const searchInput = page.getByTestId('navbar-search-input');
    
    // Click/Focus to trigger suggestion mode as per implementation
    await searchInput.click();
    
    // Verify standard region suggestions appear instead of validation error
    const dropdown = page.getByTestId('search-results-dropdown');
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toContainText('North');
    await expect(dropdown).toContainText('Central');
    await expect(dropdown).toContainText('South');
  })

  test('STC-09-TC05 No matching result found', async ({ page }) => {
    const searchInput = page.getByTestId('navbar-search-input');
    await searchInput.fill('Atlantis');
    
    const noResults = page.getByTestId('search-no-results');
    await expect(noResults).toBeVisible();
    await expect(noResults).toContainText(/No matching results found/i);
  })
})
