<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vendor;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CypressTestSeeder extends Seeder
{
    /**
     * Run the database seeds for Cypress E2E tests.
     */
    public function run(): void
    {
        // Ensure roles exist
        $this->ensureRolesExist();

        // Create test users
        $customer = $this->createCustomer();
        $vendorUser = $this->createVendor();
        $admin = $this->createAdmin();

        // Create categories
        $categories = $this->createCategories();

        // Create vendor profile
        $vendor = Vendor::factory()->create([
            'user_id' => $vendorUser->id,
            'business_name' => 'Test Vendor Store',
            'status' => 'approved',
            'commission_rate' => 10,
        ]);

        // Create products
        $products = $this->createProducts($vendor, $categories);

        // Create addresses for customer
        $this->createAddresses($customer);

        // Create some sample orders
        $this->createOrders($customer, $vendor, $products);

        // Create cart items for customer
        $this->createCartItems($customer, $products);

        // Create pending vendor applications
        $this->createPendingVendors();

        $this->command->info('Cypress test data seeded successfully!');
    }

    /**
     * Ensure all required roles exist.
     */
    private function ensureRolesExist(): void
    {
        $roles = ['customer', 'vendor', 'admin', 'super-admin'];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }
    }

    /**
     * Create a test customer user.
     */
    private function createCustomer(): User
    {
        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'John Customer',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        if (!$customer->hasRole('customer')) {
            $customer->assignRole('customer');
        }

        return $customer;
    }

    /**
     * Create a test vendor user.
     */
    private function createVendor(): User
    {
        $vendor = User::firstOrCreate(
            ['email' => 'vendor@example.com'],
            [
                'name' => 'Jane Vendor',
                'password' => Hash::make('vendor123'),
                'email_verified_at' => now(),
            ]
        );

        if (!$vendor->hasRole('vendor')) {
            $vendor->assignRole('vendor');
        }

        return $vendor;
    }

    /**
     * Create a test admin user.
     */
    private function createAdmin(): User
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        return $admin;
    }

    /**
     * Create test categories.
     */
    private function createCategories(): array
    {
        $categoryNames = [
            'Electronics',
            'Clothing',
            'Home & Garden',
            'Sports',
            'Books',
        ];

        $categories = [];

        foreach ($categoryNames as $name) {
            $categories[] = Category::firstOrCreate(
                ['name' => $name],
                [
                    'slug' => \Str::slug($name),
                    'parent_id' => null,
                ]
            );
        }

        return $categories;
    }

    /**
     * Create test products.
     */
    private function createProducts(Vendor $vendor, array $categories): array
    {
        $products = [];

        $productData = [
            [
                'title' => 'Wireless Headphones',
                'description' => 'Premium wireless headphones with noise cancellation',
                'price' => 299.99,
                'stock' => 50,
                'category' => $categories[0], // Electronics
            ],
            [
                'title' => 'Smart Watch',
                'description' => 'Feature-rich smartwatch with health tracking',
                'price' => 399.99,
                'stock' => 30,
                'category' => $categories[0], // Electronics
            ],
            [
                'title' => 'Laptop Stand',
                'description' => 'Ergonomic adjustable laptop stand',
                'price' => 49.99,
                'stock' => 100,
                'category' => $categories[0], // Electronics
            ],
            [
                'title' => 'Running Shoes',
                'description' => 'Comfortable running shoes for daily training',
                'price' => 89.99,
                'stock' => 75,
                'category' => $categories[3], // Sports
            ],
            [
                'title' => 'Yoga Mat',
                'description' => 'Non-slip yoga mat with carrying strap',
                'price' => 29.99,
                'stock' => 120,
                'category' => $categories[3], // Sports
            ],
            [
                'title' => 'Cotton T-Shirt',
                'description' => '100% cotton comfortable t-shirt',
                'price' => 19.99,
                'stock' => 200,
                'category' => $categories[1], // Clothing
            ],
            [
                'title' => 'Denim Jeans',
                'description' => 'Classic denim jeans with perfect fit',
                'price' => 59.99,
                'stock' => 80,
                'category' => $categories[1], // Clothing
            ],
            [
                'title' => 'Garden Tools Set',
                'description' => 'Complete garden tools set for home gardening',
                'price' => 79.99,
                'stock' => 45,
                'category' => $categories[2], // Home & Garden
            ],
            [
                'title' => 'Programming Book',
                'description' => 'Learn modern programming techniques',
                'price' => 39.99,
                'stock' => 60,
                'category' => $categories[4], // Books
            ],
            [
                'title' => 'Out of Stock Item',
                'description' => 'This item is currently out of stock',
                'price' => 19.99,
                'stock' => 0,
                'category' => $categories[0], // Electronics
            ],
        ];

        foreach ($productData as $data) {
            $product = Product::firstOrCreate(
                [
                    'title' => $data['title'],
                    'vendor_id' => $vendor->id,
                ],
                [
                    'name' => $data['title'],
                    'slug' => \Str::slug($data['title']),
                    'sku' => 'SKU-' . strtoupper(substr(md5($data['title']), 0, 8)),
                    'description' => $data['description'],
                    'base_price_cents' => (int)($data['price'] * 100),
                    'price_cents' => (int)($data['price'] * 100),
                    'currency' => 'USD',
                    'stock_quantity' => $data['stock'],
                    'category_id' => $data['category']->id,
                    'status' => 'published',
                    'is_active' => true,
                    'is_featured' => rand(0, 1) === 1,
                    'published_at' => now(),
                ]
            );

            $products[] = $product;
        }

        return $products;
    }

    /**
     * Create test addresses for customer.
     */
    private function createAddresses(User $customer): void
    {
        Address::firstOrCreate(
            [
                'user_id' => $customer->id,
                'type' => 'shipping',
            ],
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'address_line_1' => '123 Main Street',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'US',
                'phone' => '+1234567890',
                'is_default' => true,
            ]
        );

        Address::firstOrCreate(
            [
                'user_id' => $customer->id,
                'type' => 'billing',
            ],
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'address_line_1' => '456 Oak Avenue',
                'city' => 'Los Angeles',
                'state' => 'CA',
                'postal_code' => '90001',
                'country' => 'US',
                'phone' => '+1987654321',
                'is_default' => true,
            ]
        );
    }

    /**
     * Create test orders.
     */
    private function createOrders(User $customer, Vendor $vendor, array $products): void
    {
        // Create shipping address first
        $shippingAddress = Address::firstOrCreate(
            [
                'user_id' => $customer->id,
                'type' => 'shipping',
            ],
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'address_line_1' => '123 Main Street',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'US',
                'phone' => '+1234567890',
                'is_default' => true,
            ]
        );

        // Create a pending order
        $order1 = Order::create([
            'user_id' => $customer->id,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'status' => 'pending',
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'subtotal_cents' => 34998,
            'shipping_cents' => 1000,
            'tax_cents' => 2880,
            'total_cents' => 38878,
            'shipping_address_id' => $shippingAddress->id,
            'billing_address_id' => $shippingAddress->id,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $products[0]->id,
            'vendor_id' => $vendor->id,
            'product_name' => $products[0]->title,
            'quantity' => 1,
            'unit_price_cents' => 29999,
            'price_cents' => 29999,
            'total_cents' => 29999,
            'vendor_status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $products[2]->id,
            'vendor_id' => $vendor->id,
            'product_name' => $products[2]->title,
            'quantity' => 1,
            'unit_price_cents' => 4999,
            'price_cents' => 4999,
            'total_cents' => 4999,
            'vendor_status' => 'pending',
        ]);

        // Create a processing order
        $order2 = Order::create([
            'user_id' => $customer->id,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'status' => 'processing',
            'payment_method' => 'stripe',
            'payment_status' => 'paid',
            'subtotal_cents' => 39999,
            'shipping_cents' => 1000,
            'tax_cents' => 3280,
            'total_cents' => 44279,
            'shipping_address_id' => $shippingAddress->id,
            'billing_address_id' => $shippingAddress->id,
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => $products[1]->id,
            'vendor_id' => $vendor->id,
            'product_name' => $products[1]->title,
            'quantity' => 1,
            'unit_price_cents' => 39999,
            'price_cents' => 39999,
            'total_cents' => 39999,
            'vendor_status' => 'processing',
        ]);

        // Create a delivered order
        $order3 = Order::create([
            'user_id' => $customer->id,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'status' => 'delivered',
            'payment_method' => 'stripe',
            'payment_status' => 'paid',
            'fulfillment_status' => 'fulfilled',
            'subtotal_cents' => 8999,
            'shipping_cents' => 1000,
            'tax_cents' => 800,
            'total_cents' => 10799,
            'shipping_address_id' => $shippingAddress->id,
            'billing_address_id' => $shippingAddress->id,
            'delivered_at' => now()->subDays(3),
        ]);

        OrderItem::create([
            'order_id' => $order3->id,
            'product_id' => $products[3]->id,
            'vendor_id' => $vendor->id,
            'product_name' => $products[3]->title,
            'quantity' => 1,
            'unit_price_cents' => 8999,
            'price_cents' => 8999,
            'total_cents' => 8999,
            'vendor_status' => 'delivered',
            'delivered_at' => now()->subDays(3),
        ]);
    }

    /**
     * Create cart items for customer.
     */
    private function createCartItems(User $customer, array $products): void
    {
        Cart::firstOrCreate(
            [
                'user_id' => $customer->id,
                'product_id' => $products[4]->id,
            ],
            [
                'quantity' => 2,
            ]
        );

        Cart::firstOrCreate(
            [
                'user_id' => $customer->id,
                'product_id' => $products[5]->id,
            ],
            [
                'quantity' => 1,
            ]
        );
    }

    /**
     * Create pending vendor applications.
     */
    private function createPendingVendors(): void
    {
        for ($i = 1; $i <= 3; $i++) {
            $user = User::firstOrCreate(
                ['email' => "pending.vendor{$i}@example.com"],
                [
                    'name' => "Pending Vendor {$i}",
                    'password' => Hash::make('password123'),
                    'email_verified_at' => now(),
                ]
            );

            if (!$user->hasRole('vendor')) {
                $user->assignRole('vendor');
            }

            Vendor::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'business_name' => "Pending Store {$i}",
                    'status' => 'pending',
                    'business_email' => "pending.vendor{$i}@example.com",
                    'business_phone' => '+1234567' . str_pad((string)$i, 3, '0', STR_PAD_LEFT),
                ]
            );
        }
    }
}
