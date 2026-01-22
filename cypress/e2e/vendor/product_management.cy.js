/// <reference types="cypress" />

describe('Vendor Product Management', () => {
  beforeEach(() => {
    cy.loginAsVendor();
    cy.visit('/vendor/products');
  });

  it('should display products list page', () => {
    cy.url().should('include', '/vendor/products');
    cy.contains('My Products').should('be.visible');
    cy.get('[data-testid="product-list"]').should('exist');
  });

  it('should show product statistics', () => {
    cy.get('[data-testid="total-products"]').should('be.visible');
    cy.get('[data-testid="active-products"]').should('be.visible');
    cy.get('[data-testid="out-of-stock"]').should('be.visible');
  });

  it('should create new product successfully', () => {
    cy.contains('button', /Add Product|Create Product/i).click();
    cy.url().should('include', '/vendor/products/create');

    // Fill product form
    cy.get('input[name="title"]').type('New Test Product');
    cy.get('textarea[name="description"]').type('This is a comprehensive test product description with all the details.');
    cy.get('input[name="price"]').type('99.99');
    cy.get('input[name="stock"]').type('100');

    // Select category (assuming dropdown/select)
    cy.get('select[name="category_id"]').select(1);

    // Submit form
    cy.contains('button', /Save Product|Create Product/i).click();

    // Verify success
    cy.contains(/Product created successfully|Product added successfully/i).should('be.visible');
    cy.url().should('include', '/vendor/products');
    cy.contains('New Test Product').should('be.visible');
  });

  it('should validate required fields when creating product', () => {
    cy.contains('button', /Add Product|Create Product/i).click();

    // Try to submit empty form
    cy.contains('button', /Save Product|Create Product/i).click();

    // Check for validation errors
    cy.contains(/title is required|title field is required/i).should('be.visible');
    cy.contains(/price is required|price field is required/i).should('be.visible');
  });

  it('should edit existing product', () => {
    // Click on first product's edit button
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });

    cy.url().should('include', '/vendor/products/');
    cy.url().should('include', '/edit');

    // Update product title
    cy.get('input[name="title"]').clear().type('Updated Product Title');
    cy.get('input[name="price"]').clear().type('149.99');

    // Save changes
    cy.contains('button', /Update Product|Save Changes/i).click();

    // Verify success
    cy.contains(/Product updated successfully/i).should('be.visible');
    cy.contains('Updated Product Title').should('be.visible');
  });

  it('should delete product with confirmation', () => {
    // Get initial product count
    cy.get('[data-testid="product-item"]').should('have.length.greaterThan', 0);

    // Click delete on first product
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="delete-button"]').click();
    });

    // Confirm deletion
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    cy.contains('button', /Confirm|Delete|Yes/i).click();

    // Verify success
    cy.contains(/Product deleted successfully/i).should('be.visible');
  });

  it('should update product stock quantity', () => {
    cy.get('[data-testid="product-item"]').first().click();

    // Update stock
    cy.get('input[name="stock"]').clear().type('50');
    cy.contains('button', /Update|Save/i).click();

    // Verify update
    cy.contains(/updated successfully/i).should('be.visible');
    cy.get('input[name="stock"]').should('have.value', '50');
  });

  it('should upload product images', () => {
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });

    // Upload image (using fixture or actual file)
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true });

    // Wait for upload and preview
    cy.get('[data-testid="product-image-preview"]', { timeout: 10000 }).should('be.visible');

    // Save product
    cy.contains('button', /Update|Save/i).click();
    cy.contains(/updated successfully/i).should('be.visible');
  });

  it('should toggle product status (active/inactive)', () => {
    cy.get('[data-testid="product-item"]').first().within(() => {
      // Check current status
      cy.get('[data-testid="status-badge"]').then(($badge) => {
        const currentStatus = $badge.text();

        // Toggle status
        cy.get('[data-testid="status-toggle"]').click();

        // Wait for status change
        cy.wait(1000);

        // Verify status changed
        cy.get('[data-testid="status-badge"]').should('not.have.text', currentStatus);
      });
    });

    cy.contains(/status updated|Product updated/i).should('be.visible');
  });

  it('should search products by title', () => {
    cy.get('input[placeholder*="Search"]').type('Wireless');

    // Wait for search results
    cy.wait(500);

    // Verify filtered results
    cy.get('[data-testid="product-item"]').each(($product) => {
      cy.wrap($product).should('contain.text', 'Wireless');
    });
  });

  it('should filter products by status', () => {
    cy.get('select[name="status"]').select('active');

    // Wait for filter
    cy.wait(500);

    // Verify all products have active status
    cy.get('[data-testid="status-badge"]').each(($badge) => {
      cy.wrap($badge).should('contain.text', 'Active');
    });
  });

  it('should filter products by stock status', () => {
    cy.get('select[name="stock_status"]').select('in_stock');

    // Wait for filter
    cy.wait(500);

    // Verify products have stock
    cy.get('[data-testid="product-item"]').should('have.length.greaterThan', 0);
  });

  it('should sort products by price', () => {
    cy.get('select[name="sort"]').select('price_asc');

    // Wait for sorting
    cy.wait(500);

    // Verify sorting order
    let previousPrice = 0;
    cy.get('[data-testid="product-price"]').each(($price) => {
      const currentPrice = parseFloat($price.text().replace(/[^0-9.]/g, ''));
      expect(currentPrice).to.be.gte(previousPrice);
      previousPrice = currentPrice;
    });
  });

  it('should paginate through products', () => {
    // Assuming there are enough products for pagination
    cy.get('[data-testid="pagination"]').should('be.visible');

    // Click next page
    cy.get('[data-testid="next-page"]').click();

    // Verify page changed
    cy.url().should('include', 'page=2');
    cy.get('[data-testid="product-list"]').should('be.visible');
  });

  it('should view product details', () => {
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="view-button"]').click();
    });

    cy.url().should('match', /\/vendor\/products\/\d+$/);
    cy.get('[data-testid="product-title"]').should('be.visible');
    cy.get('[data-testid="product-description"]').should('be.visible');
    cy.get('[data-testid="product-price"]').should('be.visible');
    cy.get('[data-testid="product-stock"]').should('be.visible');
  });

  it('should handle product duplication', () => {
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="duplicate-button"]').click();
    });

    // Should redirect to create page with pre-filled data
    cy.url().should('include', '/vendor/products/create');
    cy.get('input[name="title"]').should('not.be.empty');

    // Modify title and create
    cy.get('input[name="title"]').type(' - Copy');
    cy.contains('button', /Create|Save/i).click();

    cy.contains(/created successfully/i).should('be.visible');
  });

  it('should bulk update product status', () => {
    // Select multiple products
    cy.get('[data-testid="product-checkbox"]').eq(0).check();
    cy.get('[data-testid="product-checkbox"]').eq(1).check();

    // Open bulk actions
    cy.get('[data-testid="bulk-actions"]').select('inactive');
    cy.contains('button', /Apply|Update/i).click();

    // Verify success
    cy.contains(/Products updated successfully/i).should('be.visible');
  });

  it('should show out of stock warning', () => {
    // Navigate to a product and set stock to 0
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });

    cy.get('input[name="stock"]').clear().type('0');
    cy.contains('button', /Update|Save/i).click();

    // Should show warning
    cy.contains(/out of stock|stock is low/i).should('be.visible');
  });

  it('should add product tags', () => {
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });

    // Add tags
    cy.get('input[name="tags"]').type('electronics,gadget,popular{enter}');

    cy.contains('button', /Update|Save/i).click();
    cy.contains(/updated successfully/i).should('be.visible');

    // Verify tags are displayed
    cy.contains('electronics').should('be.visible');
  });

  it('should validate price format', () => {
    cy.contains('button', /Add Product|Create Product/i).click();

    // Enter invalid price
    cy.get('input[name="price"]').type('invalid');
    cy.get('input[name="title"]').click(); // Trigger validation

    // Should show error
    cy.contains(/valid price|numeric/i).should('be.visible');
  });

  it('should show product analytics preview', () => {
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="view-button"]').click();
    });

    // Check for analytics section
    cy.get('[data-testid="product-views"]').should('be.visible');
    cy.get('[data-testid="product-sales"]').should('be.visible');
  });
});
