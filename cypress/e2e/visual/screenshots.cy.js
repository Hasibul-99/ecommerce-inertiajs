/// <reference types="cypress" />

describe('Visual Regression Tests', () => {
  describe('Homepage Visual Tests', () => {
    it('homepage desktop view', () => {
      cy.viewport(1280, 720);
      cy.visit('/');
      cy.wait(1000); // Wait for animations
      cy.screenshot('homepage-desktop', { capture: 'fullPage' });
    });

    it('homepage tablet view', () => {
      cy.viewport('ipad-2');
      cy.visit('/');
      cy.wait(1000);
      cy.screenshot('homepage-tablet', { capture: 'fullPage' });
    });

    it('homepage mobile view', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      cy.wait(1000);
      cy.screenshot('homepage-mobile', { capture: 'fullPage' });
    });
  });

  describe('Product Listing Visual Tests', () => {
    it('product listing desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/products');
      cy.wait(1000);
      cy.screenshot('products-listing-desktop', { capture: 'fullPage' });
    });

    it('product listing with filters applied', () => {
      cy.viewport(1280, 720);
      cy.visit('/products');

      cy.get('select[name="category"]').select('Electronics');
      cy.get('input[name="min_price"]').type('50');
      cy.get('input[name="max_price"]').type('500');

      cy.wait(1000);
      cy.screenshot('products-filtered-desktop');
    });

    it('product listing mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/products');
      cy.wait(1000);
      cy.screenshot('products-listing-mobile', { capture: 'fullPage' });
    });
  });

  describe('Product Details Visual Tests', () => {
    it('product details desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/products');

      cy.get('[data-testid="product-card"]').first().click();

      cy.wait(1000);
      cy.screenshot('product-details-desktop', { capture: 'fullPage' });
    });

    it('product details mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/products');

      cy.get('[data-testid="product-card"]').first().click();

      cy.wait(1000);
      cy.screenshot('product-details-mobile', { capture: 'fullPage' });
    });

    it('product details with reviews', () => {
      cy.viewport(1280, 720);
      cy.visit('/products');

      cy.get('[data-testid="product-card"]').first().click();

      cy.contains(/Reviews|Ratings/i).click();

      cy.wait(1000);
      cy.screenshot('product-reviews-desktop');
    });
  });

  describe('Cart Visual Tests', () => {
    beforeEach(() => {
      cy.loginAsCustomer();
    });

    it('cart page desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/cart');
      cy.wait(1000);
      cy.screenshot('cart-page-desktop', { capture: 'fullPage' });
    });

    it('empty cart desktop', () => {
      cy.viewport(1280, 720);
      // Clear cart first
      cy.visit('/cart');

      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="remove-item"]').length > 0) {
          cy.get('[data-testid="remove-item"]').each(($btn) => {
            cy.wrap($btn).click();
            cy.wait(500);
          });
        }
      });

      cy.wait(1000);
      cy.screenshot('cart-empty-desktop');
    });

    it('cart page mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/cart');
      cy.wait(1000);
      cy.screenshot('cart-page-mobile', { capture: 'fullPage' });
    });
  });

  describe('Checkout Visual Tests', () => {
    beforeEach(() => {
      cy.loginAsCustomer();
    });

    it('checkout page desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/checkout');
      cy.wait(1000);
      cy.screenshot('checkout-page-desktop', { capture: 'fullPage' });
    });

    it('checkout payment step desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/checkout');

      // Fill shipping information
      cy.get('input[name="address"]').type('123 Main St');
      cy.get('input[name="city"]').type('New York');
      cy.get('input[name="zip"]').type('10001');

      cy.contains('button', /Continue|Next/i).click();

      cy.wait(1000);
      cy.screenshot('checkout-payment-desktop');
    });

    it('checkout mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/checkout');
      cy.wait(1000);
      cy.screenshot('checkout-page-mobile', { capture: 'fullPage' });
    });
  });

  describe('User Account Visual Tests', () => {
    beforeEach(() => {
      cy.loginAsCustomer();
    });

    it('order history desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/orders');
      cy.wait(1000);
      cy.screenshot('orders-history-desktop', { capture: 'fullPage' });
    });

    it('order details desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/orders');

      cy.get('[data-testid="order-item"]').first().click();

      cy.wait(1000);
      cy.screenshot('order-details-desktop', { capture: 'fullPage' });
    });

    it('account settings desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/account/settings');
      cy.wait(1000);
      cy.screenshot('account-settings-desktop', { capture: 'fullPage' });
    });
  });

  describe('Vendor Dashboard Visual Tests', () => {
    beforeEach(() => {
      cy.loginAsVendor();
    });

    it('vendor dashboard desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/vendor/dashboard');
      cy.wait(1000);
      cy.screenshot('vendor-dashboard-desktop', { capture: 'fullPage' });
    });

    it('vendor products list desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/vendor/products');
      cy.wait(1000);
      cy.screenshot('vendor-products-desktop', { capture: 'fullPage' });
    });

    it('vendor orders list desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/vendor/orders');
      cy.wait(1000);
      cy.screenshot('vendor-orders-desktop', { capture: 'fullPage' });
    });

    it('vendor earnings desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/vendor/earnings');
      cy.wait(1000);
      cy.screenshot('vendor-earnings-desktop', { capture: 'fullPage' });
    });
  });

  describe('Admin Dashboard Visual Tests', () => {
    beforeEach(() => {
      cy.loginAsAdmin();
    });

    it('admin dashboard desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/admin/dashboard');
      cy.wait(1000);
      cy.screenshot('admin-dashboard-desktop', { capture: 'fullPage' });
    });

    it('admin orders list desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/admin/orders');
      cy.wait(1000);
      cy.screenshot('admin-orders-desktop', { capture: 'fullPage' });
    });

    it('admin vendors list desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/admin/vendors');
      cy.wait(1000);
      cy.screenshot('admin-vendors-desktop', { capture: 'fullPage' });
    });

    it('admin settings desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/admin/settings');
      cy.wait(1000);
      cy.screenshot('admin-settings-desktop', { capture: 'fullPage' });
    });
  });

  describe('Authentication Visual Tests', () => {
    it('login page desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/login');
      cy.wait(1000);
      cy.screenshot('login-page-desktop');
    });

    it('login page mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/login');
      cy.wait(1000);
      cy.screenshot('login-page-mobile');
    });

    it('register page desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/register');
      cy.wait(1000);
      cy.screenshot('register-page-desktop', { capture: 'fullPage' });
    });

    it('vendor registration desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/vendor/register');
      cy.wait(1000);
      cy.screenshot('vendor-registration-desktop', { capture: 'fullPage' });
    });
  });

  describe('Error States Visual Tests', () => {
    it('404 page desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/non-existent-page', { failOnStatusCode: false });
      cy.wait(1000);
      cy.screenshot('404-page-desktop');
    });

    it('404 page mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/non-existent-page', { failOnStatusCode: false });
      cy.wait(1000);
      cy.screenshot('404-page-mobile');
    });
  });

  describe('Responsive Breakpoints', () => {
    const viewports = [
      { name: 'mobile-small', width: 375, height: 667 },
      { name: 'mobile-large', width: 414, height: 896 },
      { name: 'tablet-portrait', width: 768, height: 1024 },
      { name: 'tablet-landscape', width: 1024, height: 768 },
      { name: 'desktop-small', width: 1280, height: 720 },
      { name: 'desktop-large', width: 1920, height: 1080 },
    ];

    viewports.forEach((viewport) => {
      it(`homepage at ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
        cy.wait(1000);
        cy.screenshot(`homepage-${viewport.name}`);
      });
    });
  });

  describe('Dark Mode Visual Tests', () => {
    it('homepage dark mode desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/');

      // Toggle dark mode if available
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="dark-mode-toggle"]').length > 0) {
          cy.get('[data-testid="dark-mode-toggle"]').click();
          cy.wait(500);
          cy.screenshot('homepage-dark-mode-desktop');
        }
      });
    });
  });

  describe('Component-Specific Visual Tests', () => {
    it('navigation menu desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/');

      cy.get('[data-testid="navigation"]').screenshot('navigation-desktop');
    });

    it('footer desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/');

      cy.get('[data-testid="footer"]').screenshot('footer-desktop');
    });

    it('product card component', () => {
      cy.viewport(1280, 720);
      cy.visit('/products');

      cy.get('[data-testid="product-card"]').first().screenshot('product-card');
    });

    it('notification bell with messages', () => {
      cy.loginAsCustomer();
      cy.viewport(1280, 720);
      cy.visit('/');

      cy.get('[data-testid="notification-bell"]').click();
      cy.wait(500);
      cy.get('[data-testid="notifications-dropdown"]').screenshot('notifications-dropdown');
    });
  });
});
