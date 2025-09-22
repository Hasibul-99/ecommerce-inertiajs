<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Address;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call(RolesAndPermissionsSeeder::class);

        // Create admin user
        $adminUser = User::where('email', 'admin@example.com')->first();
        if (!$adminUser) {
            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');
        }

        // Create super admin user
        $superAdminUser = User::where('email', 'superadmin@example.com')->first();
        if (!$superAdminUser) {
            $superAdminUser = User::factory()->create([
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password'),
            ]);
            $superAdminUser->assignRole('super-admin');
        }

        // Create manager user
        $managerUser = User::where('email', 'manager@example.com')->first();
        if (!$managerUser) {
            $managerUser = User::factory()->create([
                'name' => 'Manager User',
                'email' => 'manager@example.com',
                'password' => Hash::make('password'),
            ]);
        }
        $managerUser->assignRole('manager');

        // Create regular customers
        $customers = User::factory(10)->create();
        $customerRole = Role::findByName('customer');
        foreach ($customers as $customer) {
            $customer->assignRole($customerRole);
            
            // Create addresses for each customer
            Address::factory()->default()->shipping()->create(['user_id' => $customer->id]);
            Address::factory()->billing()->create(['user_id' => $customer->id]);
        }

        // Create vendors
        $vendors = [];
        for ($i = 0; $i < 5; $i++) {
            $vendorUser = User::factory()->create();
            $vendorUser->assignRole('vendor');
            
            $vendor = Vendor::factory()->create([
                'user_id' => $vendorUser->id,
                'status' => 'approved',
            ]);
            
            $vendors[] = $vendor;
        }

        // Create categories
        $parentCategories = Category::factory(5)->create();
        
        // Create child categories
        foreach ($parentCategories as $parentCategory) {
            Category::factory(rand(2, 4))->child($parentCategory->id)->create();
        }
        
        // Get all categories (parent and child)
        $allCategories = Category::all();

        // Create products for each vendor
        foreach ($vendors as $vendor) {
            // Create 5-10 products per vendor
            $products = Product::factory(rand(5, 10))
                ->active()
                ->create([
                    'vendor_id' => $vendor->id,
                    'category_id' => $allCategories->random()->id,
                ]);

            // Create variants for each product
            foreach ($products as $product) {
                // Create 1-5 variants per product
                $variants = ProductVariant::factory(rand(1, 5))
                    ->inStock()
                    ->create([
                        'product_id' => $product->id,
                    ]);
                
                // Set one variant as default
                $variants->first()->update(['is_default' => true]);
            }
        }

        // Create coupons
        Coupon::factory(5)->active()->percentage()->create();
        Coupon::factory(5)->active()->fixed()->create();

        // Create orders for customers
        foreach ($customers as $customer) {
            // Create 0-3 orders per customer
            $orderCount = rand(0, 3);
            
            if ($orderCount > 0) {
                $customerAddresses = $customer->addresses;
                
                for ($i = 0; $i < $orderCount; $i++) {
                    $shippingAddress = $customerAddresses->where('type', 'shipping')->first() ?? 
                                      $customerAddresses->where('type', 'both')->first() ?? 
                                      Address::factory()->shipping()->create(['user_id' => $customer->id]);
                    
                    $billingAddress = $customerAddresses->where('type', 'billing')->first() ?? 
                                     $customerAddresses->where('type', 'both')->first() ?? 
                                     $shippingAddress;
                    
                    // Create order with random status
                    $order = Order::factory()
                        ->create([
                            'user_id' => $customer->id,
                            'shipping_address_id' => $shippingAddress->id,
                            'billing_address_id' => $billingAddress->id,
                        ]);
                    
                    // Create 1-5 order items per order
                    $products = Product::inRandomOrder()->take(rand(1, 5))->get();
                    
                    foreach ($products as $product) {
                        $variant = $product->variants()->inRandomOrder()->first();
                        
                        if ($variant) {
                            OrderItem::factory()->create([
                                'order_id' => $order->id,
                                'product_id' => $product->id,
                                'product_variant_id' => $variant->id,
                                'vendor_id' => $product->vendor_id,
                                'product_name' => $product->title,
                                'variant_name' => $variant->name ?? 'Default',
                                'unit_price_cents' => $variant->price_cents,
                                'quantity' => rand(1, 3),
                            ]);
                        }
                    }
                }
            }
        }
    }
}
