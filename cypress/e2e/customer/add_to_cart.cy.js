/// <reference types="cypress" />

describe('Add to Cart', () => {
  beforeEach(() => {
    cy.loginAsCustomer();
    cy.visit('/products');
  });

  it('should add product to cart', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('input[name="quantity"]').clear().type('1');
    cy.contains('button', /Add to Cart/i).click();
    cy.contains(/Added to cart/i).should('be.visible');
  });

  it('should update cart count badge', () => {
    cy.get('[data-testid="cart-count"]').then(($count) => {
      const initialCount = parseInt($count.text() || '0');
      cy.get('[data-testid="product-card"]').first().click();
      cy.contains('button', /Add to Cart/i).click();
      cy.get('[data-testid="cart-count"]').should('contain', initialCount + 1);
    });
  });

  it('should add multiple quantities', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('input[name="quantity"]').clear().type('3');
    cy.contains('button', /Add to Cart/i).click();
    cy.visit('/cart');
    cy.get('[data-testid="cart-item-quantity"]').first().should('have.value', '3');
  });

  it('should not add more than available stock', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('input[name="quantity"]').clear().type('999');
    cy.contains('button', /Add to Cart/i).click();
    cy.contains(/not enough stock/i).should('be.visible');
  });

  it('should update existing cart item quantity', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.contains('button', /Add to Cart/i).click();
    cy.wait(500);
    cy.contains('button', /Add to Cart/i).click();
    cy.visit('/cart');
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
  });

  it('should add multiple different products', () => {
    cy.get('[data-testid="product-card"]').eq(0).click();
    cy.contains('button', /Add to Cart/i).click();
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').eq(1).click();
    cy.contains('button', /Add to Cart/i).click();
    cy.visit('/cart');
    cy.get('[data-testid="cart-item"]').should('have.length', 2);
  });

  it('should remove product from cart', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.contains('button', /Add to Cart/i).click();
    cy.visit('/cart');
    cy.get('[data-testid="remove-item"]').first().click();
    cy.contains('Cart is empty').should('be.visible');
  });

  it('should update cart item quantity from cart page', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.contains('button', /Add to Cart/i).click();
    cy.visit('/cart');
    cy.get('[data-testid="cart-item-quantity"]').first().clear().type('5');
    cy.get('[data-testid="update-quantity"]').first().click();
    cy.wait(500);
    cy.get('[data-testid="cart-item-quantity"]').first().should('have.value', '5');
  });
});
