/// <reference types="cypress" />

describe('Performance Tests - Page Load Times', () => {
  it('homepage should load within acceptable time', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start-loading');
      },
      onLoad: (win) => {
        win.performance.mark('end-loading');
        win.performance.measure('pageLoad', 'start-loading', 'end-loading');
        const measure = win.performance.getEntriesByName('pageLoad')[0];

        cy.log(`Page load time: ${measure.duration}ms`);
        expect(measure.duration).to.be.lessThan(3000); // 3 seconds
      },
    });
  });

  it('product listing should load within acceptable time', () => {
    const startTime = Date.now();

    cy.visit('/products');

    cy.get('[data-testid="product-card"]').should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(`Product listing load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(3000); // 3 seconds
    });
  });

  it('single product page should load within acceptable time', () => {
    cy.visit('/products');

    const startTime = Date.now();

    cy.get('[data-testid="product-card"]').first().click();

    cy.get('[data-testid="product-details"]').should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(`Product details load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(2000); // 2 seconds
    });
  });

  it('cart page should load within acceptable time', () => {
    cy.loginAsCustomer();

    const startTime = Date.now();

    cy.visit('/cart');

    cy.get('[data-testid="cart-items"]').should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(`Cart page load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(2000); // 2 seconds
    });
  });

  it('checkout page should load within acceptable time', () => {
    cy.loginAsCustomer();

    const startTime = Date.now();

    cy.visit('/checkout');

    cy.get('[data-testid="checkout-form"]').should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(`Checkout page load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(2500); // 2.5 seconds
    });
  });

  it('vendor dashboard should load within acceptable time', () => {
    cy.loginAsVendor();

    const startTime = Date.now();

    cy.visit('/vendor/dashboard');

    cy.get('[data-testid="dashboard-stats"]').should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(`Vendor dashboard load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(3000); // 3 seconds
    });
  });

  it('admin dashboard should load within acceptable time', () => {
    cy.loginAsAdmin();

    const startTime = Date.now();

    cy.visit('/admin/dashboard');

    cy.get('[data-testid="dashboard-stats"]').should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(`Admin dashboard load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(3500); // 3.5 seconds
    });
  });

  it('search results should load within acceptable time', () => {
    cy.visit('/');

    const startTime = Date.now();

    cy.get('input[type="search"]').type('wireless{enter}');

    cy.get('[data-testid="search-results"]').should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(`Search results load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(2000); // 2 seconds
    });
  });

  it('should measure Time to Interactive (TTI)', () => {
    cy.visit('/');

    cy.window().then((win) => {
      cy.get('[data-testid="product-card"]').should('be.visible').then(() => {
        const tti = win.performance.now();
        cy.log(`Time to Interactive: ${tti}ms`);
        expect(tti).to.be.lessThan(4000); // 4 seconds
      });
    });
  });

  it('should measure First Contentful Paint', () => {
    cy.visit('/');

    cy.window().then((win) => {
      const perfEntries = win.performance.getEntriesByType('paint');
      const fcp = perfEntries.find(entry => entry.name === 'first-contentful-paint');

      if (fcp) {
        cy.log(`First Contentful Paint: ${fcp.startTime}ms`);
        expect(fcp.startTime).to.be.lessThan(2000); // 2 seconds
      }
    });
  });

  it('should measure resource load times', () => {
    cy.visit('/');

    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType('resource');

      // Check CSS files
      const cssFiles = resources.filter(r => r.name.endsWith('.css'));
      cssFiles.forEach(css => {
        cy.log(`CSS ${css.name}: ${css.duration}ms`);
        expect(css.duration).to.be.lessThan(1000);
      });

      // Check JS files
      const jsFiles = resources.filter(r => r.name.endsWith('.js'));
      jsFiles.forEach(js => {
        cy.log(`JS ${js.name}: ${js.duration}ms`);
        expect(js.duration).to.be.lessThan(2000);
      });
    });
  });

  it('images should lazy load efficiently', () => {
    cy.visit('/products');

    cy.get('img[loading="lazy"]').should('exist');

    // Scroll to bottom to trigger lazy loading
    cy.scrollTo('bottom');

    cy.wait(500);

    // Check that images loaded
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'src').and('not.be.empty');
    });
  });

  it('should handle pagination without performance degradation', () => {
    cy.visit('/products');

    const times = [];

    // Measure first page
    let startTime = Date.now();
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0).then(() => {
      times.push(Date.now() - startTime);
    });

    // Measure second page
    cy.get('[data-testid="next-page"]').click();
    startTime = Date.now();
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0).then(() => {
      times.push(Date.now() - startTime);

      // Second page should not be significantly slower
      cy.log(`Page 1: ${times[0]}ms, Page 2: ${times[1]}ms`);
      expect(times[1]).to.be.lessThan(times[0] * 1.5);
    });
  });

  it('filtering should be performant', () => {
    cy.visit('/products');

    const startTime = Date.now();

    cy.get('select[name="category"]').select('Electronics');

    cy.get('[data-testid="product-card"]').should('be.visible').then(() => {
      const filterTime = Date.now() - startTime;
      cy.log(`Filter application time: ${filterTime}ms`);
      expect(filterTime).to.be.lessThan(1500); // 1.5 seconds
    });
  });

  it('add to cart should be responsive', () => {
    cy.visit('/products');

    const startTime = Date.now();

    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('button', /Add to Cart/i).click();
    });

    cy.contains(/Added to cart/i).should('be.visible').then(() => {
      const addToCartTime = Date.now() - startTime;
      cy.log(`Add to cart time: ${addToCartTime}ms`);
      expect(addToCartTime).to.be.lessThan(1000); // 1 second
    });
  });

  it('form submission should be performant', () => {
    cy.loginAsVendor();
    cy.visit('/vendor/products/create');

    cy.get('input[name="title"]').type('Performance Test Product');
    cy.get('textarea[name="description"]').type('Test description');
    cy.get('input[name="price"]').type('99.99');
    cy.get('input[name="stock"]').type('10');

    const startTime = Date.now();

    cy.contains('button', /Save|Create/i).click();

    cy.url().should('include', '/vendor/products').then(() => {
      const submitTime = Date.now() - startTime;
      cy.log(`Form submission time: ${submitTime}ms`);
      expect(submitTime).to.be.lessThan(2000); // 2 seconds
    });
  });
});

describe('Performance Tests - Network Efficiency', () => {
  it('should minimize number of HTTP requests', () => {
    cy.visit('/');

    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType('resource');
      cy.log(`Total HTTP requests: ${resources.length}`);

      // Should have reasonable number of requests
      expect(resources.length).to.be.lessThan(50);
    });
  });

  it('should use caching effectively', () => {
    // First visit
    cy.visit('/');

    cy.window().then((win) => {
      const firstVisitResources = win.performance.getEntriesByType('resource');
      const firstVisitTime = firstVisitResources.reduce((sum, r) => sum + r.duration, 0);

      // Second visit
      cy.reload();

      cy.window().then((win2) => {
        const secondVisitResources = win2.performance.getEntriesByType('resource');
        const secondVisitTime = secondVisitResources.reduce((sum, r) => sum + r.duration, 0);

        cy.log(`First visit: ${firstVisitTime}ms, Second visit: ${secondVisitTime}ms`);

        // Second visit should be faster due to caching
        expect(secondVisitTime).to.be.lessThan(firstVisitTime);
      });
    });
  });

  it('should compress assets', () => {
    cy.request('/').then((response) => {
      // Check for compression headers
      expect(response.headers).to.have.property('content-encoding');
    });
  });
});
