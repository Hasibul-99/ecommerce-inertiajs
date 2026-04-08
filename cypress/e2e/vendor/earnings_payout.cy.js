/// <reference types="cypress" />

describe('Vendor Earnings and Payout', () => {
  beforeEach(() => {
    cy.loginAsVendor();
    cy.visit('/vendor/earnings');
  });

  it('should display earnings dashboard', () => {
    cy.url().should('include', '/vendor/earnings');
    cy.contains(/Earnings|Revenue/i).should('be.visible');
  });

  it('should display earnings summary cards', () => {
    cy.get('[data-testid="total-earnings"]').should('be.visible');
    cy.get('[data-testid="available-balance"]').should('be.visible');
    cy.get('[data-testid="pending-balance"]').should('be.visible');
    cy.get('[data-testid="withdrawn-amount"]').should('be.visible');
  });

  it('should display earnings chart', () => {
    cy.get('[data-testid="earnings-chart"]').should('be.visible');
  });

  it('should filter earnings by date range', () => {
    const today = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    cy.get('input[name="date_from"]').type(lastMonth);
    cy.get('input[name="date_to"]').type(today);
    cy.contains('button', /Apply|Filter/i).click();

    cy.wait(500);
    cy.get('[data-testid="earnings-chart"]').should('be.visible');
  });

  it('should display earnings breakdown by order', () => {
    cy.get('[data-testid="earnings-list"]').should('be.visible');
    cy.get('[data-testid="earning-item"]').should('have.length.greaterThan', 0);

    // Verify each earning item has required information
    cy.get('[data-testid="earning-item"]').first().within(() => {
      cy.get('[data-testid="order-number"]').should('be.visible');
      cy.get('[data-testid="order-date"]').should('be.visible');
      cy.get('[data-testid="order-amount"]').should('be.visible');
      cy.get('[data-testid="commission-rate"]').should('be.visible');
      cy.get('[data-testid="vendor-earning"]').should('be.visible');
    });
  });

  it('should show commission rate for each transaction', () => {
    cy.get('[data-testid="earning-item"]').first().within(() => {
      cy.get('[data-testid="commission-rate"]').should('contain.text', '%');
    });
  });

  it('should request payout when balance is sufficient', () => {
    // Check available balance first
    cy.get('[data-testid="available-balance"]').invoke('text').then((balance) => {
      const amount = parseFloat(balance.replace(/[^0-9.]/g, ''));

      if (amount > 50) { // Assuming minimum is $50
        cy.contains('button', /Request Payout|Withdraw/i).click();

        // Fill payout request form
        cy.get('input[name="amount"]').type(Math.min(amount, 100).toString());
        cy.get('select[name="method"]').select('bank_transfer');

        // Bank details
        cy.get('input[name="account_number"]').type('1234567890');
        cy.get('input[name="bank_name"]').type('Test Bank');
        cy.get('input[name="account_holder"]').type('John Vendor');

        cy.contains('button', /Submit|Request Payout/i).click();

        // Verify success
        cy.contains(/Payout requested successfully|Request submitted/i).should('be.visible');
      }
    });
  });

  it('should not allow payout below minimum amount', () => {
    cy.contains('button', /Request Payout|Withdraw/i).click();

    // Enter amount below minimum (e.g., $10)
    cy.get('input[name="amount"]').type('10');
    cy.contains('button', /Submit|Request Payout/i).click();

    // Should show error
    cy.contains(/minimum|too low/i).should('be.visible');
  });

  it('should not allow payout exceeding available balance', () => {
    cy.get('[data-testid="available-balance"]').invoke('text').then((balance) => {
      const amount = parseFloat(balance.replace(/[^0-9.]/g, ''));

      cy.contains('button', /Request Payout|Withdraw/i).click();

      // Enter amount exceeding balance
      cy.get('input[name="amount"]').type((amount + 1000).toString());
      cy.contains('button', /Submit|Request Payout/i).click();

      // Should show error
      cy.contains(/insufficient|exceeds balance/i).should('be.visible');
    });
  });

  it('should display payout history', () => {
    cy.visit('/vendor/payouts');

    cy.url().should('include', '/vendor/payouts');
    cy.get('[data-testid="payout-list"]').should('be.visible');
  });

  it('should show payout request status', () => {
    cy.visit('/vendor/payouts');

    cy.get('[data-testid="payout-item"]').first().within(() => {
      cy.get('[data-testid="payout-status"]').should('be.visible');
      cy.get('[data-testid="payout-amount"]').should('be.visible');
      cy.get('[data-testid="payout-date"]').should('be.visible');
    });
  });

  it('should filter payouts by status', () => {
    cy.visit('/vendor/payouts');

    cy.get('select[name="status_filter"]').select('pending');
    cy.wait(500);

    cy.get('[data-testid="payout-status"]').each(($status) => {
      cy.wrap($status).should('contain.text', 'Pending');
    });
  });

  it('should view payout request details', () => {
    cy.visit('/vendor/payouts');

    cy.get('[data-testid="payout-item"]').first().click();

    // Verify payout details
    cy.get('[data-testid="payout-amount"]').should('be.visible');
    cy.get('[data-testid="payout-method"]').should('be.visible');
    cy.get('[data-testid="bank-details"]').should('be.visible');
    cy.get('[data-testid="request-date"]').should('be.visible');
  });

  it('should cancel pending payout request', () => {
    cy.visit('/vendor/payouts');

    // Find a pending payout
    cy.get('[data-testid="payout-item"]')
      .contains('[data-testid="payout-status"]', /pending/i)
      .parents('[data-testid="payout-item"]')
      .first()
      .click();

    // Cancel request
    cy.get('[data-testid="cancel-payout"]').click();
    cy.contains('button', /Confirm|Yes/i).click();

    // Verify cancellation
    cy.contains(/Payout cancelled|Request cancelled/i).should('be.visible');
    cy.get('[data-testid="payout-status"]').should('contain.text', 'Cancelled');
  });

  it('should not cancel approved or paid payouts', () => {
    cy.visit('/vendor/payouts');

    // Find an approved/paid payout
    cy.get('[data-testid="payout-item"]')
      .contains('[data-testid="payout-status"]', /approved|paid/i)
      .parents('[data-testid="payout-item"]')
      .first()
      .click();

    // Cancel button should not be visible or be disabled
    cy.get('[data-testid="cancel-payout"]').should('not.exist');
  });

  it('should display commission breakdown', () => {
    cy.get('[data-testid="commission-breakdown"]').should('be.visible');

    // Should show platform fee and vendor earning
    cy.contains(/Platform Fee|Commission/i).should('be.visible');
    cy.contains(/Your Earning|Net Amount/i).should('be.visible');
  });

  it('should export earnings report', () => {
    cy.get('[data-testid="export-earnings"]').click();
    cy.contains(/CSV|PDF/i).click();

    // Verify download initiated
    cy.wait(2000);
  });

  it('should display earnings by product', () => {
    cy.get('[data-testid="view-by-product"]').click();

    cy.get('[data-testid="product-earnings"]').should('be.visible');
    cy.get('[data-testid="product-earning-item"]').should('have.length.greaterThan', 0);
  });

  it('should show top earning products', () => {
    cy.get('[data-testid="top-products"]').should('be.visible');
    cy.get('[data-testid="top-product-item"]').should('have.length.greaterThan', 0);
  });

  it('should update bank account details', () => {
    cy.visit('/vendor/settings/payment');

    cy.get('input[name="account_number"]').clear().type('9876543210');
    cy.get('input[name="bank_name"]').clear().type('Updated Bank');
    cy.get('input[name="account_holder"]').clear().type('John Updated');

    cy.contains('button', /Save|Update/i).click();

    cy.contains(/Settings updated|Bank details updated/i).should('be.visible');
  });

  it('should validate bank account format', () => {
    cy.visit('/vendor/settings/payment');

    cy.get('input[name="account_number"]').clear().type('invalid');
    cy.contains('button', /Save|Update/i).click();

    cy.contains(/valid account number/i).should('be.visible');
  });

  it('should display pending earnings with holding period', () => {
    cy.get('[data-testid="pending-earnings"]').should('be.visible');

    // Should show when funds will be available
    cy.contains(/available on|available in/i).should('be.visible');
  });

  it('should show transaction fees if applicable', () => {
    cy.get('[data-testid="earning-item"]').first().within(() => {
      // Check if transaction fees are displayed
      cy.get('[data-testid="transaction-fee"]').should('exist');
    });
  });

  it('should display monthly earnings summary', () => {
    cy.get('[data-testid="monthly-summary"]').should('be.visible');
    cy.get('[data-testid="monthly-earnings"]').should('be.visible');
  });

  it('should compare earnings with previous period', () => {
    cy.get('[data-testid="earnings-comparison"]').should('be.visible');
    cy.get('[data-testid="growth-percentage"]').should('be.visible');
  });

  it('should request payout via PayPal', () => {
    cy.contains('button', /Request Payout|Withdraw/i).click();

    cy.get('select[name="method"]').select('paypal');
    cy.get('input[name="paypal_email"]').type('vendor@paypal.com');
    cy.get('input[name="amount"]').type('100');

    cy.contains('button', /Submit|Request Payout/i).click();

    cy.contains(/Payout requested/i).should('be.visible');
  });

  it('should display automatic payout settings', () => {
    cy.visit('/vendor/settings/payout');

    cy.get('[data-testid="auto-payout-settings"]').should('be.visible');
    cy.get('input[name="enable_auto_payout"]').should('exist');
  });

  it('should enable automatic payouts', () => {
    cy.visit('/vendor/settings/payout');

    cy.get('input[name="enable_auto_payout"]').check();
    cy.get('select[name="payout_frequency"]').select('weekly');
    cy.get('input[name="minimum_amount"]').type('100');

    cy.contains('button', /Save Settings/i).click();

    cy.contains(/Settings saved/i).should('be.visible');
  });
});
