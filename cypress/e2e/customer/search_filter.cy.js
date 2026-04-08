/// <reference types="cypress" />

describe('Search and Filter Products', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should search for products by keyword', () => {
    cy.get('[data-testid="search-input"]').type('headphones');
    cy.get('[data-testid="search-button"]').click();
    cy.get('[data-testid="product-card"]').should('contain', 'headphones');
  });

  it('should filter products by category', () => {
    cy.get('[data-testid="category-filter"]').select('Electronics');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('should filter products by price range', () => {
    cy.get('[data-testid="price-min"]').type('50');
    cy.get('[data-testid="price-max"]').type('200');
    cy.get('[data-testid="apply-filter"]').click();
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('should sort products by price', () => {
    cy.get('[data-testid="sort-select"]').select('price_asc');
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('should clear all filters', () => {
    cy.get('[data-testid="category-filter"]').select('Electronics');
    cy.get('[data-testid="clear-filters"]').click();
    cy.get('[data-testid="category-filter"]').should('have.value', '');
  });

  it('should show no results message when search returns nothing', () => {
    cy.get('[data-testid="search-input"]').type('nonexistentproduct12345');
    cy.get('[data-testid="search-button"]').click();
    cy.contains('No products found').should('be.visible');
  });

  it('should filter by vendor', () => {
    cy.get('[data-testid="vendor-filter"]').select(1);
    cy.get('[data-testid="product-card"]').should('exist');
  });

  it('should filter by rating', () => {
    cy.get('[data-testid="rating-filter"]').click();
    cy.contains('4 stars & up').click();
    cy.wait(500);
  });
});
