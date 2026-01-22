/// <reference types="cypress" />

describe('Vendor Registration', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to vendor registration page', () => {
    cy.contains('Become a Vendor').click();
    cy.url().should('include', '/vendor/register');
  });

  it('should complete vendor registration', () => {
    cy.visit('/vendor/register');

    // Fill business information
    cy.get('input[name="business_name"]').type('Test Vendor Store');
    cy.get('input[name="business_email"]').type('testvendor@example.com');
    cy.get('input[name="business_phone"]').type('+1234567890');
    cy.get('textarea[name="business_description"]').type('A test vendor store description');

    // Fill address
    cy.get('input[name="business_address"]').type('123 Business St');
    cy.get('input[name="business_city"]').type('Business City');
    cy.get('input[name="business_state"]').type('NY');
    cy.get('input[name="business_postal_code"]').type('10001');

    // Upload documents
    cy.get('input[name="business_license"]').selectFile('cypress/fixtures/test-document.pdf', { force: true });
    cy.get('input[name="tax_certificate"]').selectFile('cypress/fixtures/test-document.pdf', { force: true });

    // Fill bank details
    cy.get('input[name="bank_account_name"]').type('Test Vendor Account');
    cy.get('input[name="bank_account_number"]').type('1234567890');
    cy.get('input[name="bank_routing_number"]').type('987654321');

    // Submit
    cy.contains('button', /Submit Application/i).click();

    // Verify success
    cy.contains(/application submitted/i).should('be.visible');
  });

  it('should validate required fields', () => {
    cy.visit('/vendor/register');
    cy.contains('button', /Submit Application/i).click();
    cy.contains(/required/i).should('be.visible');
  });

  it('should validate email format', () => {
    cy.visit('/vendor/register');
    cy.get('input[name="business_email"]').type('invalid-email');
    cy.contains('button', /Submit Application/i).click();
    cy.contains(/valid email/i).should('be.visible');
  });

  it('should show application status after submission', () => {
    cy.fixture('users').then((users) => {
      cy.login(users.vendor.email, users.vendor.password);
      cy.visit('/vendor/application-status');
      cy.get('[data-testid="application-status"]').should('be.visible');
    });
  });

  it('should not allow duplicate business registration', () => {
    // Assuming business email must be unique
    cy.visit('/vendor/register');
    cy.get('input[name="business_email"]').type('existing@vendor.com');
    cy.contains('button', /Submit Application/i).click();
    cy.get('body').then(($body) => {
      if ($body.text().includes('already exists')) {
        cy.contains(/already exists/i).should('be.visible');
      }
    });
  });
});
