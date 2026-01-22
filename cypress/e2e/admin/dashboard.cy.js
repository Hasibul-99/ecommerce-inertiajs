/// <reference types="cypress" />

describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/dashboard');
  });

  it('should display admin dashboard', () => {
    cy.url().should('include', '/admin/dashboard');
    cy.contains(/Dashboard|Admin Panel/i).should('be.visible');
  });

  it('should display key statistics cards', () => {
    cy.get('[data-testid="total-orders"]').should('be.visible');
    cy.get('[data-testid="total-revenue"]').should('be.visible');
    cy.get('[data-testid="total-vendors"]').should('be.visible');
    cy.get('[data-testid="total-customers"]').should('be.visible');
  });

  it('should display statistics with correct data types', () => {
    // Verify numbers are displayed
    cy.get('[data-testid="total-orders"]').invoke('text').should('match', /\d+/);
    cy.get('[data-testid="total-revenue"]').invoke('text').should('match', /\$[\d,]+/);
    cy.get('[data-testid="total-vendors"]').invoke('text').should('match', /\d+/);
    cy.get('[data-testid="total-customers"]').invoke('text').should('match', /\d+/);
  });

  it('should display sales chart', () => {
    cy.get('[data-testid="sales-chart"]').should('be.visible');
    cy.get('canvas').should('exist'); // Chart.js uses canvas
  });

  it('should display revenue chart', () => {
    cy.get('[data-testid="revenue-chart"]').should('be.visible');
  });

  it('should display recent orders list', () => {
    cy.get('[data-testid="recent-orders"]').should('be.visible');
    cy.get('[data-testid="order-item"]').should('have.length.greaterThan', 0);
  });

  it('should display recent order details', () => {
    cy.get('[data-testid="order-item"]').first().within(() => {
      cy.get('[data-testid="order-number"]').should('be.visible');
      cy.get('[data-testid="customer-name"]').should('be.visible');
      cy.get('[data-testid="order-total"]').should('be.visible');
      cy.get('[data-testid="order-status"]').should('be.visible');
    });
  });

  it('should navigate to orders page from recent orders', () => {
    cy.get('[data-testid="view-all-orders"]').click();
    cy.url().should('include', '/admin/orders');
  });

  it('should display pending vendor applications', () => {
    cy.get('[data-testid="pending-vendors"]').should('be.visible');
  });

  it('should show count of pending vendor applications', () => {
    cy.get('[data-testid="pending-vendors-count"]')
      .invoke('text')
      .should('match', /\d+/);
  });

  it('should navigate to vendor applications from dashboard', () => {
    cy.get('[data-testid="view-pending-vendors"]').click();
    cy.url().should('include', '/admin/vendors');
  });

  it('should display top selling products', () => {
    cy.get('[data-testid="top-products"]').should('be.visible');
    cy.get('[data-testid="product-item"]').should('have.length.greaterThan', 0);
  });

  it('should display low stock alerts', () => {
    cy.get('[data-testid="low-stock-alerts"]').should('be.visible');
  });

  it('should filter dashboard by date range', () => {
    const today = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    cy.get('[data-testid="date-range-start"]').type(lastMonth);
    cy.get('[data-testid="date-range-end"]').type(today);
    cy.get('[data-testid="apply-filter"]').click();

    cy.wait(1000);

    // Statistics should update
    cy.get('[data-testid="total-orders"]').should('be.visible');
  });

  it('should display order status breakdown', () => {
    cy.get('[data-testid="order-status-chart"]').should('be.visible');

    // Should show different statuses
    cy.contains(/Pending/i).should('be.visible');
    cy.contains(/Processing/i).should('be.visible');
    cy.contains(/Delivered/i).should('be.visible');
  });

  it('should display revenue comparison', () => {
    cy.get('[data-testid="revenue-comparison"]').should('be.visible');
    cy.get('[data-testid="growth-percentage"]').should('be.visible');
  });

  it('should show today vs yesterday comparison', () => {
    cy.get('[data-testid="today-stats"]').should('be.visible');
    cy.get('[data-testid="comparison-indicator"]').should('be.visible');
  });

  it('should display recent customer registrations', () => {
    cy.get('[data-testid="recent-customers"]').should('be.visible');
    cy.get('[data-testid="customer-item"]').should('have.length.greaterThan', 0);
  });

  it('should navigate to customer details from dashboard', () => {
    cy.get('[data-testid="customer-item"]').first().click();
    cy.url().should('include', '/admin/customers');
  });

  it('should display payment method distribution', () => {
    cy.get('[data-testid="payment-methods-chart"]').should('be.visible');
  });

  it('should show COD vs online payment split', () => {
    cy.get('[data-testid="payment-methods-chart"]').within(() => {
      cy.contains(/COD/i).should('be.visible');
      cy.contains(/Card|Stripe/i).should('be.visible');
    });
  });

  it('should display vendor performance summary', () => {
    cy.get('[data-testid="vendor-performance"]').should('be.visible');
    cy.get('[data-testid="top-vendors"]').should('be.visible');
  });

  it('should quick view order details from dashboard', () => {
    cy.get('[data-testid="order-item"]').first().within(() => {
      cy.get('[data-testid="quick-view"]').click();
    });

    // Modal or drawer should open
    cy.get('[data-testid="order-details-modal"]').should('be.visible');
  });

  it('should display notifications count', () => {
    cy.get('[data-testid="notification-bell"]').should('be.visible');
    cy.get('[data-testid="notification-count"]').should('exist');
  });

  it('should open notifications dropdown', () => {
    cy.get('[data-testid="notification-bell"]').click();
    cy.get('[data-testid="notifications-dropdown"]').should('be.visible');
  });

  it('should display system alerts', () => {
    cy.get('[data-testid="system-alerts"]').should('be.visible');
  });

  it('should show platform commission summary', () => {
    cy.get('[data-testid="platform-commission"]').should('be.visible');
    cy.get('[data-testid="commission-amount"]').should('be.visible');
  });

  it('should display monthly recurring revenue', () => {
    cy.get('[data-testid="mrr"]').should('be.visible');
  });

  it('should switch between different time periods', () => {
    // Switch to weekly view
    cy.get('[data-testid="period-selector"]').click();
    cy.contains(/Week|Weekly/i).click();

    cy.wait(500);

    // Charts should update
    cy.get('[data-testid="sales-chart"]').should('be.visible');

    // Switch to monthly view
    cy.get('[data-testid="period-selector"]').click();
    cy.contains(/Month|Monthly/i).click();

    cy.wait(500);
    cy.get('[data-testid="sales-chart"]').should('be.visible');
  });

  it('should export dashboard report', () => {
    cy.get('[data-testid="export-report"]').click();
    cy.contains(/PDF|Excel/i).click();

    cy.wait(2000);
  });

  it('should display active users count', () => {
    cy.get('[data-testid="active-users"]').should('be.visible');
  });

  it('should show conversion rate', () => {
    cy.get('[data-testid="conversion-rate"]').should('be.visible');
    cy.get('[data-testid="conversion-rate"]').invoke('text').should('match', /%/);
  });

  it('should display average order value', () => {
    cy.get('[data-testid="average-order-value"]').should('be.visible');
    cy.get('[data-testid="average-order-value"]').invoke('text').should('match', /\$/);
  });

  it('should show pending payouts summary', () => {
    cy.get('[data-testid="pending-payouts"]').should('be.visible');
    cy.get('[data-testid="pending-payouts-amount"]').should('be.visible');
  });

  it('should navigate to payouts page', () => {
    cy.get('[data-testid="view-payouts"]').click();
    cy.url().should('include', '/admin/payouts');
  });

  it('should display category-wise sales', () => {
    cy.get('[data-testid="category-sales"]').should('be.visible');
  });

  it('should refresh dashboard data', () => {
    cy.get('[data-testid="refresh-dashboard"]').click();

    // Loading indicator should appear
    cy.get('[data-testid="loading-indicator"]').should('be.visible');

    // Then data should reload
    cy.get('[data-testid="total-orders"]').should('be.visible');
  });

  it('should display mobile-responsive dashboard', () => {
    cy.viewport('iphone-x');

    // Key stats should still be visible
    cy.get('[data-testid="total-orders"]').should('be.visible');
    cy.get('[data-testid="total-revenue"]').should('be.visible');

    // Charts should be responsive
    cy.get('[data-testid="sales-chart"]').should('be.visible');
  });
});
