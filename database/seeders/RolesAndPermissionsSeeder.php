<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $this->createProductPermissions();
        $this->createOrderPermissions();
        $this->createUserPermissions();
        $this->createVendorPermissions();
        $this->createCategoryPermissions();
        $this->createCouponPermissions();
        $this->createReportPermissions();
        $this->createSettingPermissions();

        // Create roles and assign permissions
        $this->createSuperAdminRole();
        $this->createAdminRole();
        $this->createManagerRole();
        $this->createVendorRole();
        $this->createCustomerRole();
    }

    private function createProductPermissions(): void
    {
        $this->createPermissionIfNotExists('view products');
        $this->createPermissionIfNotExists('create products');
        $this->createPermissionIfNotExists('edit products');
        $this->createPermissionIfNotExists('delete products');
        $this->createPermissionIfNotExists('publish products');
        $this->createPermissionIfNotExists('unpublish products');
    }

    private function createOrderPermissions(): void
    {
        $this->createPermissionIfNotExists('view orders');
        $this->createPermissionIfNotExists('create orders');
        $this->createPermissionIfNotExists('edit orders');
        $this->createPermissionIfNotExists('delete orders');
        $this->createPermissionIfNotExists('process orders');
        $this->createPermissionIfNotExists('fulfill orders');
        $this->createPermissionIfNotExists('cancel orders');
        $this->createPermissionIfNotExists('refund orders');
    }

    private function createUserPermissions(): void
    {
        $this->createPermissionIfNotExists('view users');
        $this->createPermissionIfNotExists('create users');
        $this->createPermissionIfNotExists('edit users');
        $this->createPermissionIfNotExists('delete users');
        $this->createPermissionIfNotExists('assign roles');
    }

    private function createVendorPermissions(): void
    {
        $this->createPermissionIfNotExists('view vendors');
        $this->createPermissionIfNotExists('create vendors');
        $this->createPermissionIfNotExists('edit vendors');
        $this->createPermissionIfNotExists('delete vendors');
        $this->createPermissionIfNotExists('approve vendors');
        $this->createPermissionIfNotExists('suspend vendors');
    }

    private function createCategoryPermissions(): void
    {
        $this->createPermissionIfNotExists('view categories');
        $this->createPermissionIfNotExists('create categories');
        $this->createPermissionIfNotExists('edit categories');
        $this->createPermissionIfNotExists('delete categories');
    }

    private function createCouponPermissions(): void
    {
        $this->createPermissionIfNotExists('view coupons');
        $this->createPermissionIfNotExists('create coupons');
        $this->createPermissionIfNotExists('edit coupons');
        $this->createPermissionIfNotExists('delete coupons');
    }

    private function createReportPermissions(): void
    {
        $this->createPermissionIfNotExists('view reports');
        $this->createPermissionIfNotExists('export reports');
    }
    
    private function createPermissionIfNotExists(string $name): void
    {
        if (!Permission::where('name', $name)->exists()) {
            Permission::create(['name' => $name]);
        }
    }

    private function createSettingPermissions(): void
    {
        $this->createPermissionIfNotExists('view settings');
        $this->createPermissionIfNotExists('edit settings');
    }

    private function createSuperAdminRole(): void
    {
        if (!Role::where('name', 'super-admin')->exists()) {
            Role::create(['name' => 'super-admin']);
        }
        // Super admin has all permissions via Gate::before rule in AuthServiceProvider
    }

    private function createAdminRole(): void
    {
        $role = Role::where('name', 'admin')->first();
        if (!$role) {
            $role = Role::create(['name' => 'admin']);
        }
        
        $role->givePermissionTo([
            // Products
            'view products', 'create products', 'edit products', 'delete products',
            'publish products', 'unpublish products',
            
            // Orders
            'view orders', 'create orders', 'edit orders', 'delete orders',
            'process orders', 'fulfill orders', 'cancel orders', 'refund orders',
            
            // Users
            'view users', 'create users', 'edit users',
            
            // Vendors
            'view vendors', 'create vendors', 'edit vendors', 'approve vendors', 'suspend vendors',
            
            // Categories
            'view categories', 'create categories', 'edit categories', 'delete categories',
            
            // Coupons
            'view coupons', 'create coupons', 'edit coupons', 'delete coupons',
            
            // Reports
            'view reports', 'export reports',
            
            // Settings
            'view settings', 'edit settings',
        ]);
    }

    private function createManagerRole(): void
    {
        $role = Role::where('name', 'manager')->first();
        if (!$role) {
            $role = Role::create(['name' => 'manager']);
        }
        
        $role->givePermissionTo([
            // Products
            'view products', 'create products', 'edit products',
            'publish products', 'unpublish products',
            
            // Orders
            'view orders', 'edit orders', 'process orders', 'fulfill orders',
            
            // Users
            'view users',
            
            // Vendors
            'view vendors',
            
            // Categories
            'view categories',
            
            // Coupons
            'view coupons', 'create coupons', 'edit coupons',
            
            // Reports
            'view reports',
            
            // Settings
            'view settings',
        ]);
    }

    private function createVendorRole(): void
    {
        $role = Role::where('name', 'vendor')->first();
        if (!$role) {
            $role = Role::create(['name' => 'vendor']);
        }
        
        $role->givePermissionTo([
            // Products (only their own products)
            'view products', 'create products', 'edit products',
            
            // Orders (only their own orders)
            'view orders', 'process orders', 'fulfill orders',
        ]);
    }

    private function createCustomerRole(): void
    {
        $role = Role::where('name', 'customer')->first();
        if (!$role) {
            $role = Role::create(['name' => 'customer']);
        }
        
        // Customers have no special permissions in the admin panel
        // Their permissions are handled via policies for their own resources
    }
}