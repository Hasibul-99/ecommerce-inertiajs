/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Login as customer user
       * @example cy.loginAsCustomer()
       */
      loginAsCustomer(): Chainable<void>;

      /**
       * Login as vendor user
       * @example cy.loginAsVendor()
       */
      loginAsVendor(): Chainable<void>;

      /**
       * Login as admin user
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): Chainable<void>;

      /**
       * Add product to cart
       * @example cy.addToCart(1, 2)
       */
      addToCart(productId: number, quantity?: number): Chainable<void>;

      /**
       * Proceed to checkout
       * @example cy.checkout('cod')
       */
      checkout(paymentMethod?: string): Chainable<void>;

      /**
       * Create a complete order
       * @example cy.createOrder()
       */
      createOrder(): Chainable<void>;

      /**
       * Seed test database
       * @example cy.seedDatabase()
       */
      seedDatabase(): Chainable<void>;

      /**
       * Reset test database
       * @example cy.resetDatabase()
       */
      resetDatabase(): Chainable<void>;

      /**
       * Get element by data-testid
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Fill address form
       * @example cy.fillAddress({ firstName: 'John', lastName: 'Doe', ... })
       */
      fillAddress(address: AddressData): Chainable<void>;

      /**
       * Select payment method
       * @example cy.selectPaymentMethod('stripe')
       */
      selectPaymentMethod(method: string): Chainable<void>;
    }
  }
}

interface AddressData {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').contains('Log in').click();
    cy.url().should('not.include', '/login');
  });
});

// Login as customer
Cypress.Commands.add('loginAsCustomer', () => {
  const email = Cypress.env('customerEmail');
  const password = Cypress.env('customerPassword');
  cy.login(email, password);
});

// Login as vendor
Cypress.Commands.add('loginAsVendor', () => {
  const email = Cypress.env('vendorEmail');
  const password = Cypress.env('vendorPassword');
  cy.login(email, password);
});

// Login as admin
Cypress.Commands.add('loginAsAdmin', () => {
  const email = Cypress.env('adminEmail');
  const password = Cypress.env('adminPassword');
  cy.login(email, password);
});

// Add to cart command
Cypress.Commands.add('addToCart', (productId: number, quantity: number = 1) => {
  cy.visit(`/products/${productId}`);

  // Check if quantity input exists
  cy.get('body').then(($body) => {
    if ($body.find('input[name="quantity"]').length > 0) {
      cy.get('input[name="quantity"]').clear().type(quantity.toString());
    }
  });

  // Click add to cart button
  cy.contains('button', /Add to Cart/i).click();

  // Wait for success notification
  cy.contains(/Added to cart/i, { timeout: 5000 }).should('be.visible');
});

// Checkout command
Cypress.Commands.add('checkout', (paymentMethod: string = 'cod') => {
  // Go to cart
  cy.visit('/cart');

  // Proceed to checkout
  cy.contains('button', /Proceed to Checkout/i).click();
  cy.url().should('include', '/checkout');

  // Select shipping address (assume first address)
  cy.get('body').then(($body) => {
    if ($body.find('select[name="shipping_address_id"]').length > 0) {
      cy.get('select[name="shipping_address_id"]').select(1);
    }
  });

  // Select billing address (same as shipping)
  cy.get('body').then(($body) => {
    if ($body.find('input[name="same_as_shipping"]').length > 0) {
      cy.get('input[name="same_as_shipping"]').check();
    }
  });

  // Select payment method
  cy.selectPaymentMethod(paymentMethod);

  // Place order
  cy.contains('button', /Place Order/i).click();
});

// Create order command (complete flow)
Cypress.Commands.add('createOrder', () => {
  // Add a product to cart
  cy.addToCart(1, 1);

  // Checkout
  cy.checkout('cod');

  // Verify order created
  cy.url().should('match', /\/orders\/\d+/);
  cy.contains(/Thank you/i).should('be.visible');
});

// Database seeding
Cypress.Commands.add('seedDatabase', () => {
  cy.task('seedDatabase');
});

// Database reset
Cypress.Commands.add('resetDatabase', () => {
  cy.task('resetDatabase');
});

// Get by test ID
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Fill address form
Cypress.Commands.add('fillAddress', (address: AddressData) => {
  if (address.firstName) {
    cy.get('input[name*="first_name"]').type(address.firstName);
  }
  if (address.lastName) {
    cy.get('input[name*="last_name"]').type(address.lastName);
  }
  if (address.address) {
    cy.get('input[name*="address"]').first().type(address.address);
  }
  if (address.city) {
    cy.get('input[name*="city"]').type(address.city);
  }
  if (address.state) {
    cy.get('input[name*="state"]').type(address.state);
  }
  if (address.postalCode) {
    cy.get('input[name*="postal_code"]').type(address.postalCode);
  }
  if (address.country) {
    cy.get('select[name*="country"]').select(address.country);
  }
  if (address.phone) {
    cy.get('input[name*="phone"]').type(address.phone);
  }
});

// Select payment method
Cypress.Commands.add('selectPaymentMethod', (method: string) => {
  cy.get(`input[value="${method}"]`).check({ force: true });
});

export {};
