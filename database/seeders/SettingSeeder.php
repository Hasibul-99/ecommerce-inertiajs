<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            [
                'group' => 'general',
                'key' => 'site_name',
                'value' => 'Multi-Vendor E-commerce',
                'type' => 'string',
                'description' => 'Website name',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'site_logo',
                'value' => null,
                'type' => 'file',
                'description' => 'Site logo',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'favicon',
                'value' => null,
                'type' => 'file',
                'description' => 'Site favicon',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'contact_email',
                'value' => 'contact@ecommerce.com',
                'type' => 'string',
                'description' => 'Contact email address',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'contact_phone',
                'value' => '+1-234-567-8900',
                'type' => 'string',
                'description' => 'Contact phone number',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'address',
                'value' => '123 Main Street, City, State 12345',
                'type' => 'string',
                'description' => 'Business address',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'currency',
                'value' => 'USD',
                'type' => 'string',
                'description' => 'Default currency code',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'timezone',
                'value' => 'UTC',
                'type' => 'string',
                'description' => 'Default timezone',
                'is_public' => false,
            ],

            // Payment Settings
            [
                'group' => 'payment',
                'key' => 'enabled_methods',
                'value' => json_encode(['cod', 'stripe', 'paypal']),
                'type' => 'json',
                'description' => 'Enabled payment methods',
                'is_public' => true,
            ],
            [
                'group' => 'payment',
                'key' => 'cod_enabled',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Enable Cash on Delivery',
                'is_public' => true,
            ],
            [
                'group' => 'payment',
                'key' => 'cod_fee',
                'value' => '0',
                'type' => 'integer',
                'description' => 'COD handling fee',
                'is_public' => true,
            ],
            [
                'group' => 'payment',
                'key' => 'min_cod_amount',
                'value' => '0',
                'type' => 'integer',
                'description' => 'Minimum order amount for COD',
                'is_public' => true,
            ],
            [
                'group' => 'payment',
                'key' => 'max_cod_amount',
                'value' => '100000',
                'type' => 'integer',
                'description' => 'Maximum order amount for COD',
                'is_public' => true,
            ],

            // Shipping Settings
            [
                'group' => 'shipping',
                'key' => 'default_carrier',
                'value' => 'standard',
                'type' => 'string',
                'description' => 'Default shipping carrier',
                'is_public' => false,
            ],
            [
                'group' => 'shipping',
                'key' => 'free_shipping_threshold',
                'value' => '10000',
                'type' => 'integer',
                'description' => 'Free shipping threshold amount (in cents)',
                'is_public' => true,
            ],
            [
                'group' => 'shipping',
                'key' => 'handling_time',
                'value' => '2',
                'type' => 'integer',
                'description' => 'Default handling time in days',
                'is_public' => false,
            ],
            [
                'group' => 'shipping',
                'key' => 'default_weight_unit',
                'value' => 'kg',
                'type' => 'string',
                'description' => 'Default weight unit',
                'is_public' => false,
            ],

            // Email Settings
            [
                'group' => 'email',
                'key' => 'from_name',
                'value' => 'Multi-Vendor E-commerce',
                'type' => 'string',
                'description' => 'Email from name',
                'is_public' => false,
            ],
            [
                'group' => 'email',
                'key' => 'from_email',
                'value' => 'noreply@ecommerce.com',
                'type' => 'string',
                'description' => 'Email from address',
                'is_public' => false,
            ],
            [
                'group' => 'email',
                'key' => 'smtp_host',
                'value' => 'smtp.mailtrap.io',
                'type' => 'string',
                'description' => 'SMTP host',
                'is_public' => false,
            ],
            [
                'group' => 'email',
                'key' => 'smtp_port',
                'value' => '587',
                'type' => 'integer',
                'description' => 'SMTP port',
                'is_public' => false,
            ],
            [
                'group' => 'email',
                'key' => 'smtp_username',
                'value' => '',
                'type' => 'string',
                'description' => 'SMTP username',
                'is_public' => false,
            ],
            [
                'group' => 'email',
                'key' => 'smtp_password',
                'value' => '',
                'type' => 'string',
                'description' => 'SMTP password',
                'is_public' => false,
            ],
            [
                'group' => 'email',
                'key' => 'smtp_encryption',
                'value' => 'tls',
                'type' => 'string',
                'description' => 'SMTP encryption (tls/ssl)',
                'is_public' => false,
            ],

            // Vendor Settings
            [
                'group' => 'vendor',
                'key' => 'commission_rate',
                'value' => '10',
                'type' => 'integer',
                'description' => 'Default vendor commission rate (%)',
                'is_public' => false,
            ],
            [
                'group' => 'vendor',
                'key' => 'min_payout',
                'value' => '5000',
                'type' => 'integer',
                'description' => 'Minimum payout amount (in cents)',
                'is_public' => false,
            ],
            [
                'group' => 'vendor',
                'key' => 'payout_schedule',
                'value' => 'monthly',
                'type' => 'string',
                'description' => 'Payout schedule (weekly/biweekly/monthly)',
                'is_public' => false,
            ],
            [
                'group' => 'vendor',
                'key' => 'auto_approve',
                'value' => '0',
                'type' => 'boolean',
                'description' => 'Auto-approve vendor applications',
                'is_public' => false,
            ],
            [
                'group' => 'vendor',
                'key' => 'require_verification',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Require vendor verification',
                'is_public' => false,
            ],

            // Tax Settings
            [
                'group' => 'tax',
                'key' => 'tax_enabled',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Enable tax calculation',
                'is_public' => true,
            ],
            [
                'group' => 'tax',
                'key' => 'tax_rate',
                'value' => '10',
                'type' => 'integer',
                'description' => 'Default tax rate (%)',
                'is_public' => true,
            ],
            [
                'group' => 'tax',
                'key' => 'tax_included_in_price',
                'value' => '0',
                'type' => 'boolean',
                'description' => 'Tax included in product prices',
                'is_public' => true,
            ],
            [
                'group' => 'tax',
                'key' => 'tax_label',
                'value' => 'VAT',
                'type' => 'string',
                'description' => 'Tax label/name',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                [
                    'group' => $setting['group'],
                    'key' => $setting['key'],
                ],
                $setting
            );
        }

        $this->command->info('Settings seeded successfully!');
    }
}
