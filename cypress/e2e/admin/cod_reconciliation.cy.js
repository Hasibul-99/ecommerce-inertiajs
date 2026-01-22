/// <reference types="cypress" />

describe('Admin COD Reconciliation', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/cod/reconciliation');
  });

  it('should display COD reconciliation page', () => {
    cy.url().should('include', '/admin/cod/reconciliation');
    cy.contains(/COD Reconciliation|Cash Collection/i).should('be.visible');
  });

  it('should display COD summary statistics', () => {
    cy.get('[data-testid="total-cod-orders"]').should('be.visible');
    cy.get('[data-testid="pending-collection"]').should('be.visible');
    cy.get('[data-testid="collected-amount"]').should('be.visible');
    cy.get('[data-testid="pending-verification"]').should('be.visible');
  });

  it('should display daily reconciliation reports list', () => {
    cy.get('[data-testid="reconciliation-list"]').should('be.visible');
    cy.get('[data-testid="reconciliation-item"]').should('have.length.greaterThan', 0);
  });

  it('should show reconciliation report details', () => {
    cy.get('[data-testid="reconciliation-item"]').first().within(() => {
      cy.get('[data-testid="report-date"]').should('be.visible');
      cy.get('[data-testid="delivery-person"]').should('be.visible');
      cy.get('[data-testid="total-orders"]').should('be.visible');
      cy.get('[data-testid="expected-amount"]').should('be.visible');
      cy.get('[data-testid="collected-amount"]').should('be.visible');
      cy.get('[data-testid="report-status"]').should('be.visible');
    });
  });

  it('should view detailed reconciliation report', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.url().should('match', /\/admin\/cod\/reconciliation\/\d+$/);

    // Verify report sections
    cy.get('[data-testid="report-summary"]').should('be.visible');
    cy.get('[data-testid="delivery-person-info"]').should('be.visible');
    cy.get('[data-testid="orders-list"]').should('be.visible');
    cy.get('[data-testid="payment-breakdown"]').should('be.visible');
  });

  it('should display all COD orders in report', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('[data-testid="orders-list"]').within(() => {
      cy.get('[data-testid="order-row"]').should('have.length.greaterThan', 0);

      cy.get('[data-testid="order-row"]').first().within(() => {
        cy.get('[data-testid="order-number"]').should('be.visible');
        cy.get('[data-testid="customer-name"]').should('be.visible');
        cy.get('[data-testid="order-amount"]').should('be.visible');
        cy.get('[data-testid="collection-status"]').should('be.visible');
      });
    });
  });

  it('should filter reconciliation by date range', () => {
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    cy.get('input[name="date_from"]').type(lastWeek);
    cy.get('input[name="date_to"]').type(today);
    cy.contains('button', /Apply|Filter/i).click();

    cy.wait(500);
    cy.get('[data-testid="reconciliation-list"]').should('be.visible');
  });

  it('should filter by delivery person', () => {
    cy.get('select[name="delivery_person"]').select(1);
    cy.wait(500);

    cy.get('[data-testid="delivery-person"]').each(($person) => {
      cy.wrap($person).should('not.be.empty');
    });
  });

  it('should filter by reconciliation status', () => {
    cy.get('select[name="status_filter"]').select('pending');
    cy.wait(500);

    cy.get('[data-testid="report-status"]').each(($status) => {
      cy.wrap($status).should('contain.text', 'Pending');
    });
  });

  it('should verify reconciliation with matching amounts', () => {
    cy.get('[data-testid="reconciliation-item"]')
      .contains('[data-testid="report-status"]', /pending/i)
      .parents('[data-testid="reconciliation-item"]')
      .first()
      .click();

    // Verify the reconciliation
    cy.get('[data-testid="verify-reconciliation"]').click();

    cy.get('[data-testid="verify-dialog"]').should('be.visible');
    cy.get('textarea[name="notes"]').type('All amounts verified and correct.');
    cy.contains('button', /Verify|Confirm/i).click();

    cy.contains(/Reconciliation verified/i).should('be.visible');
    cy.get('[data-testid="report-status"]').should('contain.text', 'Verified');
  });

  it('should handle reconciliation with discrepancy', () => {
    cy.get('[data-testid="reconciliation-item"]')
      .contains('[data-testid="report-status"]', /pending/i)
      .parents('[data-testid="reconciliation-item"]')
      .first()
      .click();

    // Mark discrepancy
    cy.get('[data-testid="report-discrepancy"]').click();

    cy.get('[data-testid="discrepancy-dialog"]').should('be.visible');
    cy.get('input[name="actual_amount"]').type('950');
    cy.get('textarea[name="discrepancy_reason"]').type('Customer refused to pay full amount for damaged item.');
    cy.contains('button', /Submit|Report/i).click();

    cy.contains(/Discrepancy reported/i).should('be.visible');
    cy.get('[data-testid="discrepancy-badge"]').should('be.visible');
  });

  it('should show discrepancy amount calculation', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    // If discrepancy exists
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="discrepancy-amount"]').length > 0) {
        cy.get('[data-testid="discrepancy-amount"]').should('be.visible');
        cy.get('[data-testid="expected-amount"]').should('be.visible');
        cy.get('[data-testid="actual-amount"]').should('be.visible');
      }
    });
  });

  it('should generate new reconciliation report', () => {
    cy.get('[data-testid="generate-report"]').click();

    cy.get('[data-testid="generate-dialog"]').should('be.visible');
    cy.get('select[name="delivery_person_id"]').select(1);
    cy.get('input[name="report_date"]').type(new Date().toISOString().split('T')[0]);
    cy.contains('button', /Generate|Create/i).click();

    cy.contains(/Report generated/i).should('be.visible');
  });

  it('should validate report generation date', () => {
    cy.get('[data-testid="generate-report"]').click();

    // Try future date
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    cy.get('input[name="report_date"]').type(futureDate);
    cy.contains('button', /Generate/i).click();

    cy.contains(/cannot be in the future|invalid date/i).should('be.visible');
  });

  it('should export reconciliation report to PDF', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('[data-testid="export-pdf"]').click();

    cy.wait(2000);
  });

  it('should export reconciliation report to Excel', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('[data-testid="export-excel"]').click();

    cy.wait(2000);
  });

  it('should print reconciliation report', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('[data-testid="print-report"]').click();

    cy.wait(1000);
  });

  it('should display delivery person collection history', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.contains(/History|Past Reports/i).click();

    cy.get('[data-testid="delivery-history"]').should('be.visible');
    cy.get('[data-testid="history-item"]').should('have.length.greaterThan', 0);
  });

  it('should show payment collection timeline', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('[data-testid="collection-timeline"]').should('be.visible');
    cy.get('[data-testid="timeline-event"]').should('have.length.greaterThan', 0);
  });

  it('should mark individual order as collected', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('[data-testid="order-row"]')
      .contains('[data-testid="collection-status"]', /pending/i)
      .parents('[data-testid="order-row"]')
      .first()
      .within(() => {
        cy.get('[data-testid="mark-collected"]').click();
      });

    cy.get('[data-testid="collection-dialog"]').should('be.visible');
    cy.get('input[name="collected_amount"]').should('be.visible');
    cy.contains('button', /Confirm/i).click();

    cy.contains(/Payment collected/i).should('be.visible');
  });

  it('should handle partial payment collection', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('[data-testid="order-row"]').first().within(() => {
      cy.get('[data-testid="mark-collected"]').click();
    });

    // Enter partial amount
    cy.get('[data-testid="collection-dialog"]').should('be.visible');
    cy.get('input[name="collected_amount"]').clear().type('500');
    cy.get('textarea[name="partial_reason"]').type('Customer will pay remaining amount tomorrow.');
    cy.contains('button', /Confirm/i).click();

    cy.contains(/Partial payment recorded/i).should('be.visible');
  });

  it('should search reconciliation by order number', () => {
    cy.get('input[placeholder*="Search"]').type('ORD-123456');
    cy.wait(500);

    cy.get('[data-testid="reconciliation-list"]').should('be.visible');
  });

  it('should display total collections summary', () => {
    cy.get('[data-testid="collections-summary"]').should('be.visible');

    cy.get('[data-testid="today-collections"]').should('be.visible');
    cy.get('[data-testid="week-collections"]').should('be.visible');
    cy.get('[data-testid="month-collections"]').should('be.visible');
  });

  it('should show collection efficiency metrics', () => {
    cy.get('[data-testid="efficiency-metrics"]').should('be.visible');

    cy.get('[data-testid="collection-rate"]').should('be.visible');
    cy.get('[data-testid="average-collection-time"]').should('be.visible');
  });

  it('should resolve discrepancy', () => {
    cy.get('[data-testid="reconciliation-item"]')
      .contains('[data-testid="discrepancy-badge"]', /discrepancy/i)
      .parents('[data-testid="reconciliation-item"]')
      .first()
      .click();

    cy.get('[data-testid="resolve-discrepancy"]').click();

    cy.get('[data-testid="resolve-dialog"]').should('be.visible');
    cy.get('select[name="resolution_type"]').select('adjustment');
    cy.get('textarea[name="resolution_notes"]').type('Amount adjusted after verification with customer.');
    cy.contains('button', /Resolve/i).click();

    cy.contains(/Discrepancy resolved/i).should('be.visible');
  });

  it('should add manual adjustment to reconciliation', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('[data-testid="add-adjustment"]').click();

    cy.get('[data-testid="adjustment-dialog"]').should('be.visible');
    cy.get('select[name="adjustment_type"]').select('credit');
    cy.get('input[name="amount"]').type('50');
    cy.get('textarea[name="reason"]').type('Delivery person covered return shipping cost.');
    cy.contains('button', /Add Adjustment/i).click();

    cy.contains(/Adjustment added/i).should('be.visible');
  });

  it('should view failed delivery attempts', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('[data-testid="failed-deliveries"]').should('be.visible');

    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="failed-order"]').length > 0) {
        cy.get('[data-testid="failed-order"]').first().within(() => {
          cy.get('[data-testid="failure-reason"]').should('be.visible');
          cy.get('[data-testid="reattempt-date"]').should('be.visible');
        });
      }
    });
  });

  it('should schedule re-delivery for failed attempts', () => {
    cy.get('[data-testid="reconciliation-item"]').first().click();

    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="failed-order"]').length > 0) {
        cy.get('[data-testid="failed-order"]').first().within(() => {
          cy.get('[data-testid="schedule-redelivery"]').click();
        });

        cy.get('[data-testid="redelivery-dialog"]').should('be.visible');
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        cy.get('input[name="redelivery_date"]').type(tomorrow);
        cy.contains('button', /Schedule/i).click();

        cy.contains(/Re-delivery scheduled/i).should('be.visible');
      }
    });
  });

  it('should send reminder to delivery person', () => {
    cy.get('[data-testid="reconciliation-item"]')
      .contains('[data-testid="report-status"]', /pending/i)
      .parents('[data-testid="reconciliation-item"]')
      .first()
      .click();

    cy.get('[data-testid="send-reminder"]').click();

    cy.contains(/Reminder sent/i).should('be.visible');
  });

  it('should bulk verify multiple reconciliations', () => {
    cy.get('[data-testid="reconciliation-checkbox"]').eq(0).check();
    cy.get('[data-testid="reconciliation-checkbox"]').eq(1).check();

    cy.get('[data-testid="bulk-actions"]').select('verify');
    cy.contains('button', /Apply/i).click();

    cy.contains(/Reconciliations verified/i).should('be.visible');
  });

  it('should display reconciliation analytics chart', () => {
    cy.get('[data-testid="analytics-chart"]').should('be.visible');
    cy.get('canvas').should('exist');
  });

  it('should compare collection performance across delivery persons', () => {
    cy.get('[data-testid="performance-comparison"]').should('be.visible');

    cy.get('[data-testid="delivery-person-stats"]').should('have.length.greaterThan', 0);
  });

  it('should paginate through reconciliation reports', () => {
    cy.get('[data-testid="pagination"]').should('be.visible');

    cy.get('[data-testid="next-page"]').click();
    cy.url().should('include', 'page=2');
  });

  it('should sort reconciliation by date', () => {
    cy.get('select[name="sort"]').select('date_desc');
    cy.wait(500);

    let previousDate = new Date('2099-12-31');
    cy.get('[data-testid="report-date"]').each(($date) => {
      const currentDate = new Date($date.text());
      expect(currentDate.getTime()).to.be.lte(previousDate.getTime());
      previousDate = currentDate;
    });
  });

  it('should sort by collection amount', () => {
    cy.get('select[name="sort"]').select('amount_desc');
    cy.wait(500);

    let previousAmount = Infinity;
    cy.get('[data-testid="collected-amount"]').each(($amount) => {
      const currentAmount = parseFloat($amount.text().replace(/[^0-9.]/g, ''));
      expect(currentAmount).to.be.lte(previousAmount);
      previousAmount = currentAmount;
    });
  });
});
