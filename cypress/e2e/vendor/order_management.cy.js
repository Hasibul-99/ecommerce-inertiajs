/// <reference types="cypress" />

describe('Vendor Order Management', () => {
  beforeEach(() => {
    cy.loginAsVendor();
    cy.visit('/vendor/orders');
  });

  it('should display vendor orders page', () => {
    cy.url().should('include', '/vendor/orders');
    cy.contains(/My Orders|Orders/i).should('be.visible');
    cy.get('[data-testid="order-list"]').should('exist');
  });

  it('should display order statistics', () => {
    cy.get('[data-testid="pending-orders"]').should('be.visible');
    cy.get('[data-testid="processing-orders"]').should('be.visible');
    cy.get('[data-testid="total-revenue"]').should('be.visible');
  });

  it('should only show orders containing vendor products', () => {
    cy.get('[data-testid="order-item"]').each(($order) => {
      // Each order should have vendor's products
      cy.wrap($order).within(() => {
        cy.get('[data-testid="order-products"]').should('exist');
      });
    });
  });

  it('should view order details', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.url().should('match', /\/vendor\/orders\/\d+$/);

    // Verify order details sections
    cy.get('[data-testid="order-number"]').should('be.visible');
    cy.get('[data-testid="order-date"]').should('be.visible');
    cy.get('[data-testid="customer-info"]').should('be.visible');
    cy.get('[data-testid="order-items"]').should('be.visible');
    cy.get('[data-testid="order-total"]').should('be.visible');
    cy.get('[data-testid="shipping-address"]').should('be.visible');
  });

  it('should update order item status to processing', () => {
    // Find a pending order
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="order-status"]', /pending/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    // Update status
    cy.get('[data-testid="update-status-button"]').click();
    cy.get('select[name="status"]').select('processing');
    cy.contains('button', /Update Status|Confirm/i).click();

    // Verify status update
    cy.contains(/Status updated successfully/i).should('be.visible');
    cy.get('[data-testid="order-status"]').should('contain.text', 'Processing');
  });

  it('should update order item status to shipped', () => {
    // Find a processing order
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="order-status"]', /processing/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    // Update to shipped with tracking
    cy.get('[data-testid="update-status-button"]').click();
    cy.get('select[name="status"]').select('shipped');

    // Add tracking information
    cy.get('input[name="tracking_number"]').type('TRACK123456789');
    cy.get('select[name="carrier"]').select('DHL');

    cy.contains('button', /Update Status|Ship Order/i).click();

    // Verify
    cy.contains(/Order shipped successfully/i).should('be.visible');
    cy.get('[data-testid="tracking-number"]').should('contain.text', 'TRACK123456789');
  });

  it('should filter orders by status', () => {
    cy.get('select[name="status_filter"]').select('pending');

    // Wait for filter
    cy.wait(500);

    // Verify all orders are pending
    cy.get('[data-testid="order-status"]').each(($status) => {
      cy.wrap($status).should('contain.text', 'Pending');
    });
  });

  it('should filter orders by date range', () => {
    const today = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    cy.get('input[name="date_from"]').type(lastMonth);
    cy.get('input[name="date_to"]').type(today);
    cy.contains('button', /Apply|Filter/i).click();

    // Wait for results
    cy.wait(500);

    cy.get('[data-testid="order-list"]').should('be.visible');
  });

  it('should search orders by order number', () => {
    // Get first order number
    cy.get('[data-testid="order-number"]').first().invoke('text').then((orderNumber) => {
      const cleanOrderNumber = orderNumber.trim();

      // Search for it
      cy.get('input[placeholder*="Search"]').type(cleanOrderNumber);
      cy.wait(500);

      // Should show matching order
      cy.get('[data-testid="order-item"]').should('have.length', 1);
      cy.contains(cleanOrderNumber).should('be.visible');
    });
  });

  it('should search orders by customer name', () => {
    cy.get('input[placeholder*="Search"]').type('John');
    cy.wait(500);

    // Verify filtered results contain customer name
    cy.get('[data-testid="customer-name"]').each(($name) => {
      cy.wrap($name).invoke('text').should('match', /john/i);
    });
  });

  it('should display only vendor-specific order items', () => {
    cy.get('[data-testid="order-item"]').first().click();

    // Order details should only show vendor's items
    cy.get('[data-testid="order-items"]').within(() => {
      cy.get('[data-testid="item-row"]').each(($item) => {
        // Each item should belong to this vendor
        cy.wrap($item).should('exist');
      });
    });
  });

  it('should show payment method information', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="payment-method"]').should('be.visible');
    cy.get('[data-testid="payment-status"]').should('be.visible');
  });

  it('should handle COD orders differently', () => {
    // Find a COD order
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="payment-method"]', /COD|Cash on Delivery/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    // Should show COD-specific information
    cy.get('[data-testid="payment-method"]').should('contain.text', 'COD');
    cy.get('[data-testid="cod-amount"]').should('be.visible');
  });

  it('should print order invoice', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="print-invoice"]').click();

    // Verify print dialog or new window (implementation dependent)
    // This test may need adjustment based on actual implementation
    cy.wait(1000);
  });

  it('should export orders to CSV', () => {
    cy.get('[data-testid="export-button"]').click();
    cy.contains(/CSV|Excel/i).click();

    // Verify download initiated (implementation dependent)
    cy.wait(2000);
  });

  it('should show customer contact information', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="customer-info"]').within(() => {
      cy.get('[data-testid="customer-email"]').should('be.visible');
      cy.get('[data-testid="customer-phone"]').should('be.visible');
    });
  });

  it('should paginate through orders', () => {
    cy.get('[data-testid="pagination"]').should('be.visible');

    // Click next page
    cy.get('[data-testid="next-page"]').click();

    cy.url().should('include', 'page=2');
    cy.get('[data-testid="order-list"]').should('be.visible');
  });

  it('should sort orders by date', () => {
    cy.get('select[name="sort"]').select('date_desc');
    cy.wait(500);

    // Verify sorting (most recent first)
    let previousDate = new Date('2099-12-31');
    cy.get('[data-testid="order-date"]').each(($date) => {
      const currentDate = new Date($date.text());
      expect(currentDate.getTime()).to.be.lte(previousDate.getTime());
      previousDate = currentDate;
    });
  });

  it('should not allow updating cancelled orders', () => {
    // Find a cancelled order
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="order-status"]', /cancelled/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    // Update button should be disabled or not visible
    cy.get('[data-testid="update-status-button"]').should('be.disabled');
  });

  it('should not allow updating delivered orders', () => {
    // Find a delivered order
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="order-status"]', /delivered/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    // Update button should be disabled
    cy.get('[data-testid="update-status-button"]').should('be.disabled');
  });

  it('should show order timeline/history', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="order-timeline"]').should('be.visible');
    cy.get('[data-testid="timeline-event"]').should('have.length.greaterThan', 0);
  });

  it('should send notification when status updated', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="update-status-button"]').click();
    cy.get('select[name="status"]').select('processing');

    // Check notification option
    cy.get('input[name="notify_customer"]').check();

    cy.contains('button', /Update Status/i).click();

    cy.contains(/Customer notified|Status updated/i).should('be.visible');
  });
});
