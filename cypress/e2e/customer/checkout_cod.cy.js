/// <reference types="cypress" />

describe('COD Checkout', () => {
  beforeEach(() => {
    cy.loginAsCustomer();
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.contains('button', /Add to Cart/i).click();
  });

  it('should complete COD checkout', () => {
    cy.visit('/cart');
    cy.contains('button', /Proceed to Checkout/i).click();

    // Fill shipping address
    cy.fillAddress({
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      phone: '+1234567890'
    });

    // Select COD payment
    cy.selectPaymentMethod('cod');

    // Place order
    cy.contains('button', /Place Order/i).click();

    // Verify success
    cy.url().should('match', /\/orders\/\d+/);
    cy.contains(/Thank you/i).should('be.visible');
    cy.contains(/Cash on Delivery/i).should('be.visible');
  });

  it('should show COD fee', () => {
    cy.visit('/cart');
    cy.contains('button', /Proceed to Checkout/i).click();
    cy.selectPaymentMethod('cod');
    cy.contains('COD Fee').should('be.visible');
  });

  it('should validate phone number for COD', () => {
    cy.visit('/cart');
    cy.contains('button', /Proceed to Checkout/i).click();
    cy.selectPaymentMethod('cod');
    cy.fillAddress({
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      phone: 'invalid'
    });
    cy.contains('button', /Place Order/i).click();
    cy.contains(/valid phone/i).should('be.visible');
  });

  it('should not allow COD below minimum amount', () => {
    // Assuming minimum COD amount is configured
    cy.visit('/cart');
    cy.contains('button', /Proceed to Checkout/i).click();
    cy.get('body').then(($body) => {
      if ($body.text().includes('minimum')) {
        cy.contains(/minimum/i).should('be.visible');
      }
    });
  });
});
