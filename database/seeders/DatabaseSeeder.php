<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database for production.
     *
     * This seeder only creates essential data required for the application to function.
     * No demo/test data is created here.
     */
    public function run(): void
    {
        // Seed roles and permissions (Essential)
        $this->call(RolesAndPermissionsSeeder::class);

        // Seed application settings (Essential)
        $this->call(SettingSeeder::class);

        // Seed email templates (Essential)
        $this->call(EmailTemplateSeeder::class);

        // Create initial super admin user
        // IMPORTANT: Change these credentials in production using environment variables
        $superAdminEmail = env('ADMIN_EMAIL', 'admin@yourdomain.com');
        $superAdminPassword = env('ADMIN_PASSWORD', 'Password123!');

        $superAdminUser = User::where('email', $superAdminEmail)->first();
        if (!$superAdminUser) {
            $superAdminUser = User::factory()->create([
                'name' => env('ADMIN_NAME', 'System Administrator'),
                'email' => $superAdminEmail,
                'password' => Hash::make($superAdminPassword),
                'email_verified_at' => now(), // Auto-verify admin email
            ]);
            $superAdminUser->assignRole('super-admin');

            $this->command->info('Super Admin user created successfully!');
            $this->command->warn("Email: {$superAdminEmail}");
            $this->command->warn('Password: ' . ($superAdminPassword === 'ChangeThisPassword123!'
                ? 'ChangeThisPassword123! (PLEASE CHANGE THIS!)'
                : '[Set via ADMIN_PASSWORD env variable]'));
        } else {
            $this->command->info('Super Admin user already exists.');
        }

        $this->command->newLine();
        $this->command->info('✓ Essential seeders completed successfully!');
        $this->command->info('✓ Roles & Permissions seeded');
        $this->command->info('✓ Application Settings seeded');
        $this->command->info('✓ Email Templates seeded');
        $this->command->info('✓ Super Admin user created/verified');
        $this->command->newLine();
        $this->command->comment('Your application is ready for production use.');
        $this->command->comment('You can now login and start adding categories, products, and vendors through the admin panel.');
    }
}
