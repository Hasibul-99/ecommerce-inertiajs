/// <reference types="cypress" />

describe('Order Tracking', () => {
  beforeEach(() => {
    cy.loginAsCustomer();
  });

  it('should view order history', () => {
    cy.visit('/account/orders');
    cy.url().should('include', '/orders');
    cy.contains('Your Orders').should('be.visible');
  });

  it('should view order details', () => {
    cy.visit('/account/orders');
    cy.get('[data-testid="order-item"]').first().click();
    cy.url().should('match', /\/orders\/\d+/);
    cy.get('[data-testid="order-number"]').should('be.visible');
    cy.get('[data-testid="order-status"]').should('be.visible');
  });

  it('should track order status', () => {
    cy.visit('/account/orders');
    cy.get('[data-testid="order-item"]').first().click();
    cy.get('[data-testid="tracking-timeline"]').should('be.visible');
  });

  it('should view order items', () => {
    cy.visit('/account/orders');
    cy.get('[data-testid="order-item"]').first().click();
    cy.get('[data-testid="order-items"]').should('exist');
  });

  it('should cancel pending order', () => {
    cy.visit('/account/orders');
    cy.get('[data-testid="order-item"]').first().then(($order) => {
      if ($order.text().includes('Pending')) {
        cy.wrap($order).click();
        cy.contains('button', /Cancel Order/i).click();
        cy.contains('button', /Confirm/i).click();
        cy.contains(/cancelled/i).should('be.visible');
      }
    });
  });
});
