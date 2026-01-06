<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cash on Delivery Configuration
    |--------------------------------------------------------------------------
    |
    | Configure COD payment method settings including fees, limits, and
    | delivery estimates.
    |
    */

    // Minimum order amount for COD (in cents)
    'min_order_amount_cents' => env('COD_MIN_ORDER_AMOUNT_CENTS', 50000), // $500

    // Maximum order amount for COD (in cents)
    'max_order_amount_cents' => env('COD_MAX_ORDER_AMOUNT_CENTS', 50000000), // $500,000

    // Fixed COD fee (in cents)
    'fixed_fee_cents' => env('COD_FIXED_FEE_CENTS', 500), // $5

    // Percentage-based COD fee (0.02 = 2%)
    'fee_percentage' => env('COD_FEE_PERCENTAGE', 0.02),

    // Delivery time estimates
    'min_delivery_days' => env('COD_MIN_DELIVERY_DAYS', 3),
    'max_delivery_days' => env('COD_MAX_DELIVERY_DAYS', 5),

    // High value threshold requiring additional verification (in cents)
    'high_value_threshold_cents' => env('COD_HIGH_VALUE_THRESHOLD_CENTS', 1000000), // $10,000

    // Enable/disable COD globally
    'enabled' => env('COD_ENABLED', true),

    // Restricted areas (can be overridden via database)
    'restricted_states' => [],
    'restricted_cities' => [],
    'restricted_postal_codes' => [],
];
