/// <reference types="cypress" />

describe('Admin Settings Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/settings');
  });

  it('should display settings page', () => {
    cy.url().should('include', '/admin/settings');
    cy.contains(/Settings|Configuration/i).should('be.visible');
  });

  it('should display settings navigation tabs', () => {
    cy.get('[data-testid="settings-tabs"]').should('be.visible');
    cy.contains(/General|Site/i).should('be.visible');
    cy.contains(/Payment/i).should('be.visible');
    cy.contains(/Shipping/i).should('be.visible');
    cy.contains(/Email/i).should('be.visible');
    cy.contains(/Vendor/i).should('be.visible');
  });

  describe('General Settings', () => {
    beforeEach(() => {
      cy.contains(/General|Site/i).click();
    });

    it('should display general settings form', () => {
      cy.get('input[name="site_name"]').should('be.visible');
      cy.get('textarea[name="site_description"]').should('be.visible');
      cy.get('input[name="contact_email"]').should('be.visible');
      cy.get('input[name="contact_phone"]').should('be.visible');
    });

    it('should update site name', () => {
      cy.get('input[name="site_name"]').clear().type('Updated E-Commerce Platform');
      cy.contains('button', /Save|Update/i).click();

      cy.contains(/Settings saved|Settings updated/i).should('be.visible');
    });

    it('should validate required fields', () => {
      cy.get('input[name="site_name"]').clear();
      cy.contains('button', /Save|Update/i).click();

      cy.contains(/site name is required/i).should('be.visible');
    });

    it('should update contact information', () => {
      cy.get('input[name="contact_email"]').clear().type('support@example.com');
      cy.get('input[name="contact_phone"]').clear().type('+1234567890');
      cy.contains('button', /Save|Update/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('input[name="contact_email"]').clear().type('invalid-email');
      cy.contains('button', /Save/i).click();

      cy.contains(/valid email/i).should('be.visible');
    });

    it('should upload site logo', () => {
      cy.get('input[type="file"][name="logo"]').selectFile('cypress/fixtures/test-image.jpg', { force: true });

      cy.get('[data-testid="logo-preview"]', { timeout: 5000 }).should('be.visible');

      cy.contains('button', /Save/i).click();
      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should update timezone', () => {
      cy.get('select[name="timezone"]').select('America/New_York');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should update currency settings', () => {
      cy.get('select[name="currency"]').select('USD');
      cy.get('input[name="currency_symbol"]').clear().type('$');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });
  });

  describe('Payment Settings', () => {
    beforeEach(() => {
      cy.contains(/Payment/i).click();
    });

    it('should display payment methods', () => {
      cy.get('[data-testid="payment-methods"]').should('be.visible');
      cy.contains(/Stripe/i).should('be.visible');
      cy.contains(/PayPal/i).should('be.visible');
      cy.contains(/COD/i).should('be.visible');
    });

    it('should enable/disable COD payment', () => {
      cy.get('input[name="cod_enabled"]').then(($checkbox) => {
        const wasChecked = $checkbox.is(':checked');

        cy.get('input[name="cod_enabled"]').click();
        cy.contains('button', /Save/i).click();

        cy.contains(/Settings saved/i).should('be.visible');
      });
    });

    it('should update COD fee settings', () => {
      cy.get('input[name="cod_fee_amount"]').clear().type('5');
      cy.get('select[name="cod_fee_type"]').select('fixed');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should update Stripe credentials', () => {
      cy.get('input[name="stripe_public_key"]').clear().type('pk_test_123456789');
      cy.get('input[name="stripe_secret_key"]').clear().type('sk_test_123456789');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should mask sensitive payment credentials', () => {
      cy.get('input[name="stripe_secret_key"]').should('have.attr', 'type', 'password');
    });

    it('should update PayPal settings', () => {
      cy.get('input[name="paypal_client_id"]').clear().type('paypal_client_123');
      cy.get('input[name="paypal_secret"]').clear().type('paypal_secret_123');
      cy.get('select[name="paypal_mode"]').select('sandbox');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should set minimum and maximum COD amounts', () => {
      cy.get('input[name="cod_min_amount"]').clear().type('10');
      cy.get('input[name="cod_max_amount"]').clear().type('1000');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should validate COD amount ranges', () => {
      cy.get('input[name="cod_min_amount"]').clear().type('1000');
      cy.get('input[name="cod_max_amount"]').clear().type('10');
      cy.contains('button', /Save/i).click();

      cy.contains(/minimum amount cannot be greater than maximum/i).should('be.visible');
    });
  });

  describe('Shipping Settings', () => {
    beforeEach(() => {
      cy.contains(/Shipping/i).click();
    });

    it('should display shipping settings form', () => {
      cy.get('[data-testid="shipping-settings"]').should('be.visible');
    });

    it('should update default shipping rate', () => {
      cy.get('input[name="default_shipping_rate"]').clear().type('10');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should enable/disable free shipping', () => {
      cy.get('input[name="free_shipping_enabled"]').click();
      cy.get('input[name="free_shipping_threshold"]').clear().type('100');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should add shipping zone', () => {
      cy.get('[data-testid="add-shipping-zone"]').click();

      cy.get('[data-testid="zone-dialog"]').should('be.visible');
      cy.get('input[name="zone_name"]').type('North America');
      cy.get('input[name="countries"]').type('US, CA, MX');
      cy.get('input[name="shipping_rate"]').type('15');
      cy.contains('button', /Add Zone|Save/i).click();

      cy.contains(/Shipping zone added/i).should('be.visible');
    });

    it('should update shipping carrier settings', () => {
      cy.get('select[name="default_carrier"]').select('DHL');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should configure shipment tracking', () => {
      cy.get('input[name="tracking_enabled"]').check();
      cy.get('input[name="tracking_url_template"]').clear().type('https://track.example.com/{tracking_number}');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });
  });

  describe('Email Settings', () => {
    beforeEach(() => {
      cy.contains(/Email/i).click();
    });

    it('should display email settings form', () => {
      cy.get('[data-testid="email-settings"]').should('be.visible');
    });

    it('should update SMTP settings', () => {
      cy.get('input[name="smtp_host"]').clear().type('smtp.example.com');
      cy.get('input[name="smtp_port"]').clear().type('587');
      cy.get('input[name="smtp_username"]').clear().type('user@example.com');
      cy.get('input[name="smtp_password"]').clear().type('password123');
      cy.get('select[name="smtp_encryption"]').select('tls');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should test email configuration', () => {
      cy.get('[data-testid="test-email"]').click();

      cy.get('[data-testid="test-email-dialog"]').should('be.visible');
      cy.get('input[name="test_email"]').type('test@example.com');
      cy.contains('button', /Send Test Email/i).click();

      cy.contains(/Test email sent/i, { timeout: 10000 }).should('be.visible');
    });

    it('should update email sender information', () => {
      cy.get('input[name="from_name"]').clear().type('E-Commerce Platform');
      cy.get('input[name="from_email"]').clear().type('noreply@example.com');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should manage email templates', () => {
      cy.contains(/Email Templates/i).click();

      cy.get('[data-testid="email-templates"]').should('be.visible');
      cy.get('[data-testid="template-item"]').should('have.length.greaterThan', 0);
    });

    it('should edit email template', () => {
      cy.contains(/Email Templates/i).click();

      cy.get('[data-testid="template-item"]').first().click();

      cy.get('input[name="subject"]').should('be.visible');
      cy.get('textarea[name="body"]').should('be.visible');

      cy.get('input[name="subject"]').clear().type('Updated Email Subject');
      cy.contains('button', /Save Template/i).click();

      cy.contains(/Template saved/i).should('be.visible');
    });
  });

  describe('Vendor Settings', () => {
    beforeEach(() => {
      cy.contains(/Vendor/i).click();
    });

    it('should display vendor settings form', () => {
      cy.get('[data-testid="vendor-settings"]').should('be.visible');
    });

    it('should update default commission rate', () => {
      cy.get('input[name="default_commission_rate"]').clear().type('15');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should validate commission rate range', () => {
      cy.get('input[name="default_commission_rate"]').clear().type('150');
      cy.contains('button', /Save/i).click();

      cy.contains(/commission rate must be between/i).should('be.visible');
    });

    it('should enable/disable vendor registration', () => {
      cy.get('input[name="vendor_registration_enabled"]').click();
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should update minimum payout amount', () => {
      cy.get('input[name="minimum_payout_amount"]').clear().type('50');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should configure payout holding period', () => {
      cy.get('input[name="payout_holding_period"]').clear().type('7');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should enable/disable automatic vendor approval', () => {
      cy.get('input[name="auto_approve_vendors"]').click();
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should configure vendor document requirements', () => {
      cy.get('input[name="require_business_license"]').check();
      cy.get('input[name="require_tax_id"]').check();
      cy.get('input[name="require_bank_details"]').check();
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should update vendor product approval requirement', () => {
      cy.get('input[name="require_product_approval"]').click();
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });
  });

  describe('Tax Settings', () => {
    beforeEach(() => {
      cy.contains(/Tax/i).click();
    });

    it('should display tax settings form', () => {
      cy.get('[data-testid="tax-settings"]').should('be.visible');
    });

    it('should enable/disable tax calculation', () => {
      cy.get('input[name="tax_enabled"]').click();
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should update default tax rate', () => {
      cy.get('input[name="default_tax_rate"]').clear().type('8.5');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should configure tax-inclusive pricing', () => {
      cy.get('input[name="prices_include_tax"]').check();
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });
  });

  describe('Notification Settings', () => {
    beforeEach(() => {
      cy.contains(/Notifications/i).click();
    });

    it('should configure order notification settings', () => {
      cy.get('input[name="notify_admin_new_order"]').check();
      cy.get('input[name="notify_vendor_new_order"]').check();
      cy.get('input[name="notify_customer_order_status"]').check();
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });

    it('should configure vendor notification settings', () => {
      cy.get('input[name="notify_vendor_low_stock"]').check();
      cy.get('input[name="low_stock_threshold"]').clear().type('10');
      cy.contains('button', /Save/i).click();

      cy.contains(/Settings saved/i).should('be.visible');
    });
  });

  it('should reset settings to default', () => {
    cy.get('[data-testid="reset-settings"]').click();

    cy.get('[data-testid="reset-dialog"]').should('be.visible');
    cy.contains('button', /Reset|Confirm/i).click();

    cy.contains(/Settings reset to default/i).should('be.visible');
  });

  it('should show unsaved changes warning', () => {
    cy.get('input[name="site_name"]').clear().type('New Site Name');

    // Try to navigate away
    cy.contains(/Payment/i).click();

    cy.get('[data-testid="unsaved-changes-dialog"]').should('be.visible');
  });

  it('should save changes before navigation', () => {
    cy.get('input[name="site_name"]').clear().type('New Site Name');
    cy.contains(/Payment/i).click();

    cy.get('[data-testid="unsaved-changes-dialog"]').should('be.visible');
    cy.contains('button', /Save/i).click();

    cy.contains(/Settings saved/i).should('be.visible');
  });
});
