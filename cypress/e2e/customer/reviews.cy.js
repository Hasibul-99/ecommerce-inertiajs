/// <reference types="cypress" />

describe('Product Reviews', () => {
  beforeEach(() => {
    cy.loginAsCustomer();
  });

  it('should view product reviews', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.contains('Reviews').should('be.visible');
  });

  it('should submit a product review', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.contains('Write a Review').click();
    cy.get('[data-testid="rating-5"]').click();
    cy.get('textarea[name="review"]').type('Great product! Highly recommended.');
    cy.contains('button', /Submit Review/i).click();
    cy.contains(/Thank you/i).should('be.visible');
  });

  it('should require rating and comment', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.contains('Write a Review').click();
    cy.contains('button', /Submit Review/i).click();
    cy.contains(/required/i).should('be.visible');
  });

  it('should filter reviews by rating', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="filter-5-star"]').click();
    cy.get('[data-testid="review-item"]').each(($review) => {
      cy.wrap($review).find('[data-rating="5"]').should('exist');
    });
  });

  it('should mark review as helpful', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="helpful-button"]').first().click();
    cy.contains(/Thank you/i).should('be.visible');
  });
});
