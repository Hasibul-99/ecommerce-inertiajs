/// <reference types="cypress" />

describe('Browse Products', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display products on homepage', () => {
    cy.contains('Products').should('be.visible');
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
  });

  it('should navigate to product listing page', () => {
    cy.visit('/products');
    cy.url().should('include', '/products');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('should view product details', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.url().should('match', /\/products\/[\w-]+/);
    cy.get('[data-testid="product-title"]').should('be.visible');
    cy.get('[data-testid="product-price"]').should('be.visible');
    cy.get('[data-testid="product-description"]').should('be.visible');
  });

  it('should display product images', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="product-image"]').should('be.visible');
    cy.get('[data-testid="product-image"]').should('have.attr', 'src');
  });

  it('should show product stock status', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="stock-status"]').should('exist');
  });

  it('should display vendor information', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="vendor-name"]').should('be.visible');
  });

  // Mobile responsive test
  context('Mobile View', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should display products in mobile view', () => {
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').should('be.visible');
    });
  });
});
