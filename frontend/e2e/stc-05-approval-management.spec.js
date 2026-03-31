/**
 * STC-05 – Review doctor approval requests
 *
 * Covers TC01–TC08 as defined in the test plan.
 * Verifies that an Admin can review, approve, and reject doctor requests.
 */

import { test, expect } from '@playwright/test';

const APPROVALS_URL = '/admin/approvals';

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PENDING_USERS = [
  {
    id: 'REQ-1001',
    email: 'doctor1001@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'DATA_USE',
    createdAt: '2026-03-20T10:00:00Z',
    status: 'Pending'
  },
  {
    id: 'REQ-1002',
    email: 'doctor1002@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'DATA_USE',
    createdAt: '2026-03-21T11:00:00Z',
    status: 'Pending'
  },
  {
    id: 'REQ-1003',
    email: 'doctor1003@example.com',
    firstName: 'Bob',
    lastName: 'Brown',
    role: 'DATA_USE',
    createdAt: '2026-03-22T12:00:00Z',
    status: 'Pending'
  }
];

// ── Reusable Helpers ─────────────────────────────────────────────────────────

async function loginAsAdmin(page) {
  // Directly set localStorage to bypass login UI for speed/stability in this spec
  await page.addInitScript(() => {
    console.log('Injecting admin token into localStorage');
    window.localStorage.setItem('token', 'mock-admin-token');
  });
  
  // Mock /auth/me for the store initialization
  await page.route('**/auth/me', async (route) => {
    console.log('Mocking /auth/me as ADMIN');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, email: 'admin@example.com', role: 'ADMIN' })
    });
  });
}

async function loginAsDataUse(page, approved = true) {
  await page.addInitScript(({ approved }) => {
    console.log('Injecting data-use token into localStorage');
    window.localStorage.setItem('token', 'mock-user-token');
  }, { approved });

  await page.route('**/auth/me', async (route) => {
    console.log('Mocking /auth/me as DATA_USE');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 2, email: 'user@example.com', role: 'DATA_USE', approved: approved })
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// STC-05 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('STC-05 Review doctor approval requests', () => {

  test.beforeEach(async ({ page }) => {
    // Default mock for pending users (to avoid 404s on load)
    await page.route('**/admin/users/pending', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PENDING_USERS)
      });
    });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // STC-05-TC01 Successful doctor approval
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-05-TC01 Successful doctor approval', async ({ page }) => {
    await loginAsAdmin(page);
    
    let pendingCallCount = 0;
    // Overriding the default mock with a stateful one for this test
    await page.route('**/admin/users/pending', async (route) => {
      pendingCallCount++;
      const users = (pendingCallCount === 1) ? MOCK_PENDING_USERS : MOCK_PENDING_USERS.slice(1);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(users)
      });
    });

    // Mock Approval Action
    await page.route('**/admin/users/REQ-1001/approve', async (route) => {
      await route.fulfill({ status: 200 });
    });

    await page.goto(APPROVALS_URL);
    
    // Open Detail
    await page.locator('[data-testid="user-row"]').filter({ hasText: 'John Doe' }).click();
    
    // Click Approve and handle dialog
    const refreshPromise = page.waitForResponse('**/admin/users/pending');
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Doctor account approved successfully.');
      await dialog.accept();
    });
    await page.locator('button:has-text("Approve Account")').click();

    // Wait for the auto-refresh call to finish
    await refreshPromise;

    // Verify Refresh (doctor1001 should be gone)
    await expect(page.locator('[data-testid="user-row"]').filter({ hasText: 'doctor1001@example.com' })).not.toBeVisible();
    expect(pendingCallCount).toBeGreaterThan(1); // Ensure load was called again
  });

  // ────────────────────────────────────────────────────────────────────────────
  // STC-05-TC02 Successful doctor rejection
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-05-TC02 Successful doctor rejection', async ({ page }) => {
    await loginAsAdmin(page);
    
    let pendingCallCount = 0;
    await page.route('**/admin/users/pending', async (route) => {
      pendingCallCount++;
      // Return 3 users first, then only 1 and 3 (removing Jane Doe / REQ-1002)
      const users = (pendingCallCount === 1) ? MOCK_PENDING_USERS : [MOCK_PENDING_USERS[0], MOCK_PENDING_USERS[2]];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(users)
      });
    });

    // Mock Rejection Action
    await page.route('**/admin/users/REQ-1002/reject', async (route) => {
      await route.fulfill({ status: 200 });
    });

    await page.goto(APPROVALS_URL);
    
    // Open Detail
    await page.locator('[data-testid="user-row"]').filter({ hasText: 'Jane Smith' }).click();
    
    // Handle both Confirmation and Success dialogs
    let dialogCount = 0;
    const dialogHandler = async dialog => {
      dialogCount++;
      if (dialogCount === 1) expect(dialog.message()).toContain('Reject and remove Jane Smith');
      else expect(dialog.message()).toBe('Doctor account rejected successfully.');
      await dialog.accept();
    };
    page.on('dialog', dialogHandler);

    await page.locator('button:has-text("Reject Request")').click();
    
    // Wait for the total of 2 dialogs
    await expect.poll(() => dialogCount).toBe(2);
    page.off('dialog', dialogHandler);

    // Verify Refresh
    await expect(page.locator('[data-testid="user-row"]').filter({ hasText: 'doctor1002@example.com' })).not.toBeVisible();
    expect(pendingCallCount).toBeGreaterThan(1);
  });

  // ────────────────────────────────────────────────────────────────────────────
  // STC-05-TC03 No pending approval requests
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-05-TC03 No pending approval requests', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Mock empty list
    await page.route('**/admin/users/pending', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto(APPROVALS_URL);
    
    // Expect empty state message
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
    await expect(page.getByText('No pending registrations to review.')).toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────────────────
  // STC-05-TC04 Selected request no longer available
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-05-TC04 Selected request no longer available', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Mock 404 on approval (request vanished)
    await page.route('**/admin/users/REQ-1001/approve', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Not Found' })
      });
    });

    await page.goto(APPROVALS_URL);
    await page.locator('[data-testid="user-row"]').filter({ hasText: 'doctor1001@example.com' }).click();
    
    await page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('This approval request is no longer available.');
      await dialog.accept();
    });
    await page.locator('button:has-text("Approve Account")').click();
  });

  // ────────────────────────────────────────────────────────────────────────────
  // STC-05-TC05 Approval data load failure
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-05-TC05 Approval data load failure', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Mock 500 on load
    await page.route('**/admin/users/pending', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    });

    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Unable to load approval requests. Please try again later.');
      await dialog.accept();
    });
    await page.goto(APPROVALS_URL);
    
    // Ensure no list is shown
    await expect(page.locator('[data-testid="user-row"]')).not.toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────────────────
  // STC-05-TC06 Approval decision update failure
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-05-TC06 Approval decision update failure', async ({ page }) => {
    await loginAsAdmin(page);
    
    // Mock 500 on approval action
    await page.route('**/admin/users/REQ-1003/approve', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    });

    await page.goto(APPROVALS_URL);
    await page.locator('[data-testid="user-row"]').filter({ hasText: 'doctor1003@example.com' }).click();
    
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Unable to update doctor approval status. Please try again later.');
      await dialog.accept();
    });
    await page.locator('button:has-text("Approve Account")').click();
    
    // Verify status remains unchanged (row still visible)
    await expect(page.locator('[data-testid="user-row"]').filter({ hasText: 'doctor1003@example.com' })).toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────────────────
  // STC-05-TC07 Non-admin attempts to access approval management
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-05-TC07 Non-admin attempts to access approval management', async ({ page }) => {
    await loginAsDataUse(page);

    await page.goto(APPROVALS_URL);
    
    // Expect redirect to /forbidden as per router logic
    await expect(page).toHaveURL(/\/forbidden/);
  });

  // ────────────────────────────────────────────────────────────────────────────
  // STC-05-TC08 Review request detail popup content
  // ────────────────────────────────────────────────────────────────────────────
  test('STC-05-TC08 Review request detail popup content', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto(APPROVALS_URL);
    
    // Open Detail for REQ-1001
    await page.locator('[data-testid="user-row"]').filter({ hasText: 'doctor1001@example.com' }).click();
    
    const modal = page.locator('[data-testid="approval-modal"]');
    await expect(modal).toBeVisible();
    
    // Check doctor info
    await expect(modal.getByText('doctor1001@example.com')).toBeVisible();
    await expect(modal.getByText('DATA USE', { exact: true })).toBeVisible();
    // Check buttons
    await expect(page.locator('button:has-text("Approve Account")')).toBeVisible();
    await expect(page.locator('button:has-text("Reject Request")')).toBeVisible();
  });

});
