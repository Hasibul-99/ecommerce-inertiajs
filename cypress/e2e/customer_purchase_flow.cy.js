// Customer Purchase Flow E2E Test

describe('Customer Purchase Flow', () => {
  // Test user credentials
  const user = {
    email: 'test@example.com',
    password: 'password'
  };

  // Product details to purchase
  const productSlug = 'test-product';

  beforeEach(() => {
    // Reset database state before each test
    // Note: This assumes you have a command set up to reset the database for testing
    // cy.exec('php artisan migrate:fresh --seed');

    // Visit the homepage
    cy.visit('/');
  });

  it('should allow a customer to purchase a product', () => {
    // Step 1: Register or login
    cy.contains('Login').click();
    
    // Check if we're on the login page
    cy.url().should('include', '/login');
    
    // Fill in login form
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(user.password);
    cy.get('button[type="submit"]').click();
    
    // Verify successful login
    cy.url().should('include', '/dashboard');
    
    // Step 2: Browse products
    cy.visit('/products');
    
    // Find and click on a product
    cy.contains('a', productSlug).click();
    
    // Verify we're on the product detail page
    cy.url().should('include', `/products/${productSlug}`);
    
    // Step 3: Add product to cart
    // Select a variant if available
    cy.get('select[name="variant"]').first().select(1);
    
    // Set quantity
    cy.get('input[name="quantity"]').clear().type('1');
    
    // Add to cart
    cy.contains('Add to Cart').click();
    
    // Verify product was added to cart
    cy.get('[data-testid="cart-notification"]').should('be.visible');
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    
    // Step 4: Go to cart
    cy.contains('Cart').click();
    
    // Verify we're on the cart page
    cy.url().should('include', '/cart');
    
    // Verify product is in cart
    cy.get('[data-testid="cart-items"]').should('contain', productSlug);
    
    // Step 5: Proceed to checkout
    cy.contains('Proceed to Checkout').click();
    
    // Verify we're on the checkout page
    cy.url().should('include', '/checkout');
    
    // Step 6: Fill in shipping information
    // Select existing address if available, otherwise fill in new address
    cy.get('[data-testid="shipping-address-selector"]').then(($selector) => {
      if ($selector.find('option').length > 1) {
        // Select the first address
        cy.get('[data-testid="shipping-address-selector"]').select(1);
      } else {
        // Fill in new address
        cy.get('[data-testid="new-shipping-address"]').click();
        cy.get('input[name="shipping_first_name"]').type('John');
        cy.get('input[name="shipping_last_name"]').type('Doe');
        cy.get('input[name="shipping_address_line1"]').type('123 Main St');
        cy.get('input[name="shipping_city"]').type('Anytown');
        cy.get('input[name="shipping_state"]').type('CA');
        cy.get('input[name="shipping_postal_code"]').type('12345');
        cy.get('select[name="shipping_country"]').select('US');
        cy.get('input[name="shipping_phone"]').type('555-123-4567');
      }
    });
    
    // Step 7: Fill in billing information
    // Use same as shipping
    cy.get('[data-testid="same-as-shipping"]').check();
    
    // Step 8: Select payment method
    cy.get('[data-testid="payment-method-credit-card"]').check();
    
    // Fill in credit card details
    cy.get('input[name="credit_card_number"]').type('4242424242424242');
    cy.get('input[name="credit_card_expiry"]').type('12/25');
    cy.get('input[name="credit_card_cvv"]').type('123');
    
    // Step 9: Place order
    cy.contains('Place Order').click();
    
    // Step 10: Verify order confirmation
    cy.url().should('include', '/orders/');
    cy.contains('Thank you for your order').should('be.visible');
    cy.contains('Order #').should('be.visible');
    
    // Verify order details
    cy.get('[data-testid="order-items"]').should('contain', productSlug);
    
    // Step 11: Verify order in account
    cy.visit('/account/orders');
    cy.get('[data-testid="orders-list"]').should('contain', 'Order #');
  });

  it('should handle out-of-stock products gracefully', () => {
    // Login first
    cy.contains('Login').click();
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(user.password);
    cy.get('button[type="submit"]').click();
    
    // Visit a product that's out of stock
    cy.visit(`/products/${productSlug}`);
    
    // Try to add to cart with excessive quantity
    cy.get('input[name="quantity"]').clear().type('999');
    cy.contains('Add to Cart').click();
    
    // Verify error message
    cy.contains('Not enough stock available').should('be.visible');
    
    // Verify cart count didn't change
    cy.get('[data-testid="cart-count"]').should('not.contain', '999');
  });

  it('should validate required fields during checkout', () => {
    // Login and add product to cart first
    cy.contains('Login').click();
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(user.password);
    cy.get('button[type="submit"]').click();
    
    // Add product to cart
    cy.visit(`/products/${productSlug}`);
    cy.get('select[name="variant"]').first().select(1);
    cy.get('input[name="quantity"]').clear().type('1');
    cy.contains('Add to Cart').click();
    
    // Go to checkout
    cy.contains('Cart').click();
    cy.contains('Proceed to Checkout').click();
    
    // Try to submit without filling required fields
    cy.contains('Place Order').click();
    
    // Verify validation errors
    cy.contains('Please select a shipping address').should('be.visible');
    cy.contains('Please select a payment method').should('be.visible');
  });
});