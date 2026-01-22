/// <reference types="cypress" />

describe('Admin Order Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/orders');
  });

  it('should display orders management page', () => {
    cy.url().should('include', '/admin/orders');
    cy.contains(/Orders|Order Management/i).should('be.visible');
    cy.get('[data-testid="order-list"]').should('exist');
  });

  it('should display order statistics', () => {
    cy.get('[data-testid="total-orders"]').should('be.visible');
    cy.get('[data-testid="pending-orders"]').should('be.visible');
    cy.get('[data-testid="processing-orders"]').should('be.visible');
    cy.get('[data-testid="delivered-orders"]').should('be.visible');
  });

  it('should list all orders with details', () => {
    cy.get('[data-testid="order-item"]').should('have.length.greaterThan', 0);

    cy.get('[data-testid="order-item"]').first().within(() => {
      cy.get('[data-testid="order-number"]').should('be.visible');
      cy.get('[data-testid="customer-name"]').should('be.visible');
      cy.get('[data-testid="order-date"]').should('be.visible');
      cy.get('[data-testid="order-total"]').should('be.visible');
      cy.get('[data-testid="order-status"]').should('be.visible');
    });
  });

  it('should view order details', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.url().should('match', /\/admin\/orders\/\d+$/);

    // Verify order detail sections
    cy.get('[data-testid="order-info"]').should('be.visible');
    cy.get('[data-testid="customer-info"]').should('be.visible');
    cy.get('[data-testid="order-items"]').should('be.visible');
    cy.get('[data-testid="shipping-address"]').should('be.visible');
    cy.get('[data-testid="payment-info"]').should('be.visible');
    cy.get('[data-testid="order-timeline"]').should('be.visible');
  });

  it('should display all order items with vendor information', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="order-items"]').within(() => {
      cy.get('[data-testid="item-row"]').should('have.length.greaterThan', 0);

      cy.get('[data-testid="item-row"]').first().within(() => {
        cy.get('[data-testid="product-name"]').should('be.visible');
        cy.get('[data-testid="vendor-name"]').should('be.visible');
        cy.get('[data-testid="item-price"]').should('be.visible');
        cy.get('[data-testid="item-quantity"]').should('be.visible');
        cy.get('[data-testid="item-total"]').should('be.visible');
      });
    });
  });

  it('should filter orders by status', () => {
    cy.get('select[name="status_filter"]').select('pending');
    cy.wait(500);

    cy.get('[data-testid="order-status"]').each(($status) => {
      cy.wrap($status).should('contain.text', 'Pending');
    });
  });

  it('should filter orders by payment method', () => {
    cy.get('select[name="payment_method"]').select('cod');
    cy.wait(500);

    cy.get('[data-testid="payment-method"]').each(($method) => {
      cy.wrap($method).should('contain.text', 'COD');
    });
  });

  it('should filter orders by date range', () => {
    const today = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    cy.get('input[name="date_from"]').type(lastMonth);
    cy.get('input[name="date_to"]').type(today);
    cy.contains('button', /Apply|Filter/i).click();

    cy.wait(500);
    cy.get('[data-testid="order-list"]').should('be.visible');
  });

  it('should search orders by order number', () => {
    cy.get('[data-testid="order-number"]').first().invoke('text').then((orderNumber) => {
      const cleanOrderNumber = orderNumber.trim();

      cy.get('input[placeholder*="Search"]').type(cleanOrderNumber);
      cy.wait(500);

      cy.get('[data-testid="order-item"]').should('have.length', 1);
      cy.contains(cleanOrderNumber).should('be.visible');
    });
  });

  it('should search orders by customer name', () => {
    cy.get('input[placeholder*="Search"]').type('John');
    cy.wait(500);

    cy.get('[data-testid="customer-name"]').each(($name) => {
      cy.wrap($name).invoke('text').should('match', /john/i);
    });
  });

  it('should update order status', () => {
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="order-status"]', /pending/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    cy.get('[data-testid="update-status"]').click();
    cy.get('select[name="status"]').select('confirmed');
    cy.contains('button', /Update|Confirm/i).click();

    cy.contains(/Status updated/i).should('be.visible');
    cy.get('[data-testid="order-status"]').should('contain.text', 'Confirmed');
  });

  it('should cancel order with reason', () => {
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="order-status"]', /pending/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    cy.get('[data-testid="cancel-order"]').click();

    cy.get('[data-testid="cancel-dialog"]').should('be.visible');
    cy.get('textarea[name="cancellation_reason"]').type('Customer requested cancellation.');
    cy.contains('button', /Cancel Order|Confirm/i).click();

    cy.contains(/Order cancelled/i).should('be.visible');
    cy.get('[data-testid="order-status"]').should('contain.text', 'Cancelled');
  });

  it('should not cancel delivered orders', () => {
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="order-status"]', /delivered/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    cy.get('[data-testid="cancel-order"]').should('be.disabled');
  });

  it('should assign delivery person for COD order', () => {
    // Find COD order
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="payment-method"]', /COD/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    cy.get('[data-testid="assign-delivery-person"]').click();

    cy.get('[data-testid="delivery-person-dialog"]').should('be.visible');
    cy.get('select[name="delivery_person_id"]').select(1);
    cy.contains('button', /Assign|Confirm/i).click();

    cy.contains(/Delivery person assigned/i).should('be.visible');
  });

  it('should view order timeline with all status changes', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="order-timeline"]').should('be.visible');
    cy.get('[data-testid="timeline-event"]').should('have.length.greaterThan', 0);

    cy.get('[data-testid="timeline-event"]').first().within(() => {
      cy.get('[data-testid="event-status"]').should('be.visible');
      cy.get('[data-testid="event-date"]').should('be.visible');
      cy.get('[data-testid="event-user"]').should('be.visible');
    });
  });

  it('should print order invoice', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="print-invoice"]').click();

    cy.wait(1000);
  });

  it('should export orders to CSV', () => {
    cy.get('[data-testid="export-orders"]').click();
    cy.contains(/CSV|Excel/i).click();

    cy.wait(2000);
  });

  it('should send order notification to customer', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="send-notification"]').click();

    cy.get('[data-testid="notification-dialog"]').should('be.visible');
    cy.get('textarea[name="message"]').type('Your order is being processed.');
    cy.contains('button', /Send/i).click();

    cy.contains(/Notification sent/i).should('be.visible');
  });

  it('should view customer order history', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="view-customer-orders"]').click();

    cy.url().should('include', '/admin/customers');
    cy.get('[data-testid="customer-orders"]').should('be.visible');
  });

  it('should sort orders by date', () => {
    cy.get('select[name="sort"]').select('date_desc');
    cy.wait(500);

    let previousDate = new Date('2099-12-31');
    cy.get('[data-testid="order-date"]').each(($date) => {
      const currentDate = new Date($date.text());
      expect(currentDate.getTime()).to.be.lte(previousDate.getTime());
      previousDate = currentDate;
    });
  });

  it('should sort orders by total amount', () => {
    cy.get('select[name="sort"]').select('amount_desc');
    cy.wait(500);

    let previousAmount = Infinity;
    cy.get('[data-testid="order-total"]').each(($total) => {
      const currentAmount = parseFloat($total.text().replace(/[^0-9.]/g, ''));
      expect(currentAmount).to.be.lte(previousAmount);
      previousAmount = currentAmount;
    });
  });

  it('should paginate through orders', () => {
    cy.get('[data-testid="pagination"]').should('be.visible');

    cy.get('[data-testid="next-page"]').click();
    cy.url().should('include', 'page=2');
  });

  it('should display order totals breakdown', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="order-subtotal"]').should('be.visible');
    cy.get('[data-testid="shipping-cost"]').should('be.visible');
    cy.get('[data-testid="tax-amount"]').should('be.visible');
    cy.get('[data-testid="order-total"]').should('be.visible');
  });

  it('should show COD fee for COD orders', () => {
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="payment-method"]', /COD/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    cy.get('[data-testid="cod-fee"]').should('be.visible');
  });

  it('should display commission breakdown per vendor', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="commission-breakdown"]').should('be.visible');

    cy.get('[data-testid="commission-item"]').should('have.length.greaterThan', 0);
  });

  it('should refund order', () => {
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="payment-status"]', /paid/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    cy.get('[data-testid="refund-order"]').click();

    cy.get('[data-testid="refund-dialog"]').should('be.visible');
    cy.get('input[name="refund_amount"]').type('50');
    cy.get('textarea[name="refund_reason"]').type('Product defective');
    cy.contains('button', /Process Refund/i).click();

    cy.contains(/Refund processed/i).should('be.visible');
  });

  it('should bulk update order status', () => {
    // Select multiple orders
    cy.get('[data-testid="order-checkbox"]').eq(0).check();
    cy.get('[data-testid="order-checkbox"]').eq(1).check();

    cy.get('[data-testid="bulk-actions"]').select('confirmed');
    cy.contains('button', /Apply/i).click();

    cy.contains(/Orders updated/i).should('be.visible');
  });

  it('should view multi-vendor order items separately', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="order-items"]').within(() => {
      // Group items by vendor
      cy.get('[data-testid="vendor-group"]').should('exist');
    });
  });

  it('should track shipment status', () => {
    cy.get('[data-testid="order-item"]')
      .contains('[data-testid="order-status"]', /shipped/i)
      .parents('[data-testid="order-item"]')
      .first()
      .click();

    cy.get('[data-testid="tracking-number"]').should('be.visible');
    cy.get('[data-testid="carrier"]').should('be.visible');
    cy.get('[data-testid="track-shipment"]').click();

    // Should open tracking page or modal
    cy.wait(1000);
  });

  it('should handle order disputes', () => {
    cy.get('[data-testid="order-item"]').first().click();

    cy.get('[data-testid="disputes"]').should('be.visible');

    // If disputes exist
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="dispute-item"]').length > 0) {
        cy.get('[data-testid="dispute-item"]').first().within(() => {
          cy.get('[data-testid="dispute-reason"]').should('be.visible');
          cy.get('[data-testid="dispute-status"]').should('be.visible');
        });
      }
    });
  });
});
