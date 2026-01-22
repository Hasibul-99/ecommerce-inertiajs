/// <reference types="cypress" />

describe('Admin Vendor Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/vendors');
  });

  it('should display vendors list page', () => {
    cy.url().should('include', '/admin/vendors');
    cy.contains(/Vendors|Vendor Management/i).should('be.visible');
    cy.get('[data-testid="vendor-list"]').should('exist');
  });

  it('should display vendor statistics', () => {
    cy.get('[data-testid="total-vendors"]').should('be.visible');
    cy.get('[data-testid="active-vendors"]').should('be.visible');
    cy.get('[data-testid="pending-applications"]').should('be.visible');
    cy.get('[data-testid="suspended-vendors"]').should('be.visible');
  });

  it('should list all vendors with details', () => {
    cy.get('[data-testid="vendor-item"]').should('have.length.greaterThan', 0);

    cy.get('[data-testid="vendor-item"]').first().within(() => {
      cy.get('[data-testid="vendor-name"]').should('be.visible');
      cy.get('[data-testid="vendor-email"]').should('be.visible');
      cy.get('[data-testid="vendor-status"]').should('be.visible');
      cy.get('[data-testid="vendor-joined-date"]').should('be.visible');
    });
  });

  it('should filter vendors by status', () => {
    cy.get('select[name="status_filter"]').select('approved');
    cy.wait(500);

    cy.get('[data-testid="vendor-status"]').each(($status) => {
      cy.wrap($status).should('contain.text', 'Approved');
    });
  });

  it('should filter pending vendor applications', () => {
    cy.get('select[name="status_filter"]').select('pending');
    cy.wait(500);

    cy.get('[data-testid="vendor-status"]').each(($status) => {
      cy.wrap($status).should('contain.text', 'Pending');
    });
  });

  it('should search vendors by business name', () => {
    cy.get('input[placeholder*="Search"]').type('Test Vendor');
    cy.wait(500);

    cy.get('[data-testid="vendor-name"]').each(($name) => {
      cy.wrap($name).invoke('text').should('match', /test vendor/i);
    });
  });

  it('should view vendor details', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.url().should('match', /\/admin\/vendors\/\d+$/);

    // Verify vendor detail sections
    cy.get('[data-testid="vendor-info"]').should('be.visible');
    cy.get('[data-testid="business-details"]').should('be.visible');
    cy.get('[data-testid="contact-info"]').should('be.visible');
    cy.get('[data-testid="bank-details"]').should('be.visible');
    cy.get('[data-testid="vendor-documents"]').should('be.visible');
  });

  it('should display vendor products count', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.get('[data-testid="total-products"]').should('be.visible');
    cy.get('[data-testid="active-products"]').should('be.visible');
  });

  it('should display vendor orders count', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.get('[data-testid="total-orders"]').should('be.visible');
    cy.get('[data-testid="total-revenue"]').should('be.visible');
  });

  it('should approve pending vendor application', () => {
    // Find pending vendor
    cy.get('[data-testid="vendor-item"]')
      .contains('[data-testid="vendor-status"]', /pending/i)
      .parents('[data-testid="vendor-item"]')
      .first()
      .click();

    // Approve vendor
    cy.get('[data-testid="approve-vendor"]').click();

    // Confirmation dialog
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    cy.get('input[name="commission_rate"]').type('10');
    cy.contains('button', /Approve|Confirm/i).click();

    // Verify approval
    cy.contains(/Vendor approved successfully/i).should('be.visible');
    cy.get('[data-testid="vendor-status"]').should('contain.text', 'Approved');
  });

  it('should reject pending vendor application', () => {
    // Find pending vendor
    cy.get('[data-testid="vendor-item"]')
      .contains('[data-testid="vendor-status"]', /pending/i)
      .parents('[data-testid="vendor-item"]')
      .first()
      .click();

    // Reject vendor
    cy.get('[data-testid="reject-vendor"]').click();

    // Provide rejection reason
    cy.get('[data-testid="reject-dialog"]').should('be.visible');
    cy.get('textarea[name="rejection_reason"]').type('Incomplete documentation provided.');
    cy.contains('button', /Reject|Confirm/i).click();

    // Verify rejection
    cy.contains(/Vendor application rejected/i).should('be.visible');
    cy.get('[data-testid="vendor-status"]').should('contain.text', 'Rejected');
  });

  it('should validate commission rate when approving', () => {
    cy.get('[data-testid="vendor-item"]')
      .contains('[data-testid="vendor-status"]', /pending/i)
      .parents('[data-testid="vendor-item"]')
      .first()
      .click();

    cy.get('[data-testid="approve-vendor"]').click();

    // Try to approve without commission rate
    cy.contains('button', /Approve|Confirm/i).click();

    cy.contains(/commission rate is required/i).should('be.visible');

    // Try invalid commission rate
    cy.get('input[name="commission_rate"]').type('150');
    cy.contains('button', /Approve/i).click();

    cy.contains(/valid commission rate/i).should('be.visible');
  });

  it('should suspend active vendor', () => {
    // Find active vendor
    cy.get('[data-testid="vendor-item"]')
      .contains('[data-testid="vendor-status"]', /approved|active/i)
      .parents('[data-testid="vendor-item"]')
      .first()
      .click();

    // Suspend vendor
    cy.get('[data-testid="suspend-vendor"]').click();

    // Provide suspension reason
    cy.get('[data-testid="suspend-dialog"]').should('be.visible');
    cy.get('textarea[name="suspension_reason"]').type('Policy violation detected.');
    cy.contains('button', /Suspend|Confirm/i).click();

    // Verify suspension
    cy.contains(/Vendor suspended/i).should('be.visible');
    cy.get('[data-testid="vendor-status"]').should('contain.text', 'Suspended');
  });

  it('should reactivate suspended vendor', () => {
    // Find suspended vendor
    cy.get('[data-testid="vendor-item"]')
      .contains('[data-testid="vendor-status"]', /suspended/i)
      .parents('[data-testid="vendor-item"]')
      .first()
      .click();

    // Reactivate vendor
    cy.get('[data-testid="reactivate-vendor"]').click();

    // Confirm reactivation
    cy.contains('button', /Confirm|Reactivate/i).click();

    // Verify reactivation
    cy.contains(/Vendor reactivated/i).should('be.visible');
    cy.get('[data-testid="vendor-status"]').should('contain.text', 'Approved');
  });

  it('should update vendor commission rate', () => {
    cy.get('[data-testid="vendor-item"]')
      .contains('[data-testid="vendor-status"]', /approved/i)
      .parents('[data-testid="vendor-item"]')
      .first()
      .click();

    // Edit commission rate
    cy.get('[data-testid="edit-commission"]').click();
    cy.get('input[name="commission_rate"]').clear().type('12');
    cy.contains('button', /Save|Update/i).click();

    cy.contains(/Commission rate updated/i).should('be.visible');
  });

  it('should view vendor submitted documents', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.get('[data-testid="vendor-documents"]').should('be.visible');
    cy.get('[data-testid="document-item"]').should('have.length.greaterThan', 0);
  });

  it('should download vendor document', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.get('[data-testid="document-item"]').first().within(() => {
      cy.get('[data-testid="download-document"]').click();
    });

    // Verify download initiated
    cy.wait(1000);
  });

  it('should view vendor products list', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.contains(/Products|View Products/i).click();

    cy.url().should('include', '/products');
    cy.get('[data-testid="product-list"]').should('be.visible');
  });

  it('should view vendor orders list', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.contains(/Orders|View Orders/i).click();

    cy.url().should('include', '/orders');
    cy.get('[data-testid="order-list"]').should('be.visible');
  });

  it('should view vendor earnings history', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.contains(/Earnings|Revenue/i).click();

    cy.get('[data-testid="earnings-summary"]').should('be.visible');
    cy.get('[data-testid="earnings-chart"]').should('be.visible');
  });

  it('should send notification to vendor', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.get('[data-testid="send-notification"]').click();

    cy.get('[data-testid="notification-dialog"]').should('be.visible');
    cy.get('input[name="subject"]').type('Important Update');
    cy.get('textarea[name="message"]').type('Please update your product listings.');
    cy.contains('button', /Send/i).click();

    cy.contains(/Notification sent/i).should('be.visible');
  });

  it('should export vendors list to CSV', () => {
    cy.get('[data-testid="export-vendors"]').click();
    cy.contains(/CSV|Excel/i).click();

    cy.wait(2000);
  });

  it('should sort vendors by join date', () => {
    cy.get('select[name="sort"]').select('date_desc');
    cy.wait(500);

    // Verify sorting
    let previousDate = new Date('2099-12-31');
    cy.get('[data-testid="vendor-joined-date"]').each(($date) => {
      const currentDate = new Date($date.text());
      expect(currentDate.getTime()).to.be.lte(previousDate.getTime());
      previousDate = currentDate;
    });
  });

  it('should sort vendors by total revenue', () => {
    cy.get('select[name="sort"]').select('revenue_desc');
    cy.wait(500);

    cy.get('[data-testid="vendor-list"]').should('be.visible');
  });

  it('should paginate through vendors', () => {
    cy.get('[data-testid="pagination"]').should('be.visible');

    cy.get('[data-testid="next-page"]').click();
    cy.url().should('include', 'page=2');
  });

  it('should view vendor activity log', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.contains(/Activity|History/i).click();

    cy.get('[data-testid="activity-log"]').should('be.visible');
    cy.get('[data-testid="activity-item"]').should('have.length.greaterThan', 0);
  });

  it('should bulk approve vendors', () => {
    // Select multiple pending vendors
    cy.get('[data-testid="vendor-checkbox"]').eq(0).check();
    cy.get('[data-testid="vendor-checkbox"]').eq(1).check();

    cy.get('[data-testid="bulk-actions"]').select('approve');
    cy.get('input[name="commission_rate"]').type('10');
    cy.contains('button', /Apply/i).click();

    cy.contains(/Vendors approved/i).should('be.visible');
  });

  it('should display vendor rating and reviews', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.get('[data-testid="vendor-rating"]').should('be.visible');
    cy.get('[data-testid="review-count"]').should('be.visible');
  });

  it('should view vendor performance metrics', () => {
    cy.get('[data-testid="vendor-item"]').first().click();

    cy.contains(/Performance|Metrics/i).click();

    cy.get('[data-testid="order-fulfillment-rate"]').should('be.visible');
    cy.get('[data-testid="average-delivery-time"]').should('be.visible');
    cy.get('[data-testid="customer-satisfaction"]').should('be.visible');
  });
});
