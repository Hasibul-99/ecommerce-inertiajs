#!/bin/bash

# Setup Test Environment for Laravel E-commerce Application
# This script sets up the necessary dependencies and configurations for testing

echo "Setting up test environment for Laravel E-commerce Application..."

# Install PHP dependencies if not already installed
if [ ! -d "vendor" ]; then
  echo "Installing PHP dependencies..."
  composer install
fi

# Install Node.js dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "Installing Node.js dependencies..."
  npm install
fi

# Install Cypress if not already installed
if [ ! -d "node_modules/cypress" ]; then
  echo "Installing Cypress for E2E testing..."
  npm install cypress --save-dev
fi

# Create test database if it doesn't exist
echo "Setting up test database..."
php artisan db:create --env=testing --if-not-exists

# Run migrations for test database
echo "Running migrations on test database..."
php artisan migrate --env=testing

# Seed test database with test data
echo "Seeding test database with test data..."
php artisan db:seed --env=testing

# Create test user for E2E tests
echo "Creating test user for E2E tests..."
php artisan tinker --execute="
    \App\Models\User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => bcrypt('password')
    ]);
"

# Create test product for E2E tests
echo "Creating test product for E2E tests..."
php artisan tinker --execute="
    \$vendor = \App\Models\Vendor::firstOrCreate(
        ['id' => 1],
        [
            'user_id' => 1,
            'business_name' => 'Test Vendor',
            'slug' => 'test-vendor',
            'description' => 'Test vendor description',
            'commission_rate' => 0.1
        ]
    );
    
    \$product = \App\Models\Product::firstOrCreate(
        ['slug' => 'test-product'],
        [
            'vendor_id' => \$vendor->id,
            'title' => 'Test Product',
            'description' => 'Test product description',
            'base_price_cents' => 1000,
            'status' => 'published',
            'published_at' => now(),
            'currency' => 'USD'
        ]
    );
    
    \App\Models\ProductVariant::firstOrCreate(
        ['product_id' => \$product->id, 'sku' => 'TEST-SKU-1'],
        [
            'name' => 'Default',
            'price_cents' => 1000,
            'stock_quantity' => 10,
            'is_default' => true
        ]
    );
"

# Configure .env.testing file
if [ ! -f ".env.testing" ]; then
  echo "Creating .env.testing file..."
  cp .env.example .env.testing
  
  # Update database configuration for testing
  sed -i '' 's/DB_DATABASE=.*/DB_DATABASE=ecommerce_testing/g' .env.testing
  sed -i '' 's/DB_CONNECTION=.*/DB_CONNECTION=sqlite/g' .env.testing
  sed -i '' 's/DB_HOST=.*/DB_HOST=:memory:/g' .env.testing
  
  # Disable queue for testing
  sed -i '' 's/QUEUE_CONNECTION=.*/QUEUE_CONNECTION=sync/g' .env.testing
  
  # Disable mail sending for testing
  sed -i '' 's/MAIL_MAILER=.*/MAIL_MAILER=array/g' .env.testing
  
  # Generate application key
  php artisan key:generate --env=testing
fi

# Create Cypress configuration if it doesn't exist
if [ ! -f "cypress.config.js" ]; then
  echo "Creating Cypress configuration..."
  cat > cypress.config.js << 'EOL'
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
EOL
fi

# Create Cypress support commands if they don't exist
if [ ! -d "cypress/support" ]; then
  mkdir -p cypress/support
  
  echo "Creating Cypress support commands..."
  cat > cypress/support/commands.js << 'EOL'
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Command to login a user
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

// Command to add a product to cart
Cypress.Commands.add('addToCart', (productSlug, quantity = 1) => {
  cy.visit(`/products/${productSlug}`)
  cy.get('select[name="variant"]').first().select(1)
  cy.get('input[name="quantity"]').clear().type(quantity.toString())
  cy.contains('Add to Cart').click()
})
EOL

  echo "import './commands'" > cypress/support/e2e.js
fi

echo "Test environment setup complete!"
echo "Run PHPUnit tests with: php artisan test"
echo "Run Cypress tests with: npx cypress open"