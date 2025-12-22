<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Payment Gateway Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for various payment gateways
    | used in the application. Configure your API keys and settings here.
    |
    */

    'default' => env('PAYMENT_GATEWAY', 'stripe'),

    /*
    |--------------------------------------------------------------------------
    | Stripe Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Stripe payment gateway.
    | Get your API keys from: https://dashboard.stripe.com/apikeys
    |
    | To install Stripe SDK:
    | composer require stripe/stripe-php
    |
    */

    'stripe' => [
        'enabled' => env('STRIPE_ENABLED', true),
        'publishable_key' => env('STRIPE_PUBLISHABLE_KEY', ''),
        'secret_key' => env('STRIPE_SECRET_KEY', ''),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET', ''),
        'currency' => env('STRIPE_CURRENCY', 'usd'),
    ],

    /*
    |--------------------------------------------------------------------------
    | PayPal Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for PayPal payment gateway.
    | Get your API credentials from: https://developer.paypal.com/
    |
    | To install PayPal SDK:
    | composer require paypal/rest-api-sdk-php
    |
    */

    'paypal' => [
        'enabled' => env('PAYPAL_ENABLED', true),
        'mode' => env('PAYPAL_MODE', 'sandbox'), // sandbox or live
        'client_id' => env('PAYPAL_CLIENT_ID', ''),
        'client_secret' => env('PAYPAL_CLIENT_SECRET', ''),
        'currency' => env('PAYPAL_CURRENCY', 'USD'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Cash on Delivery Configuration
    |--------------------------------------------------------------------------
    */

    'cod' => [
        'enabled' => env('COD_ENABLED', true),
        'fee_cents' => env('COD_FEE_CENTS', 0), // Additional fee for COD in cents
    ],

    /*
    |--------------------------------------------------------------------------
    | Bank Transfer Configuration
    |--------------------------------------------------------------------------
    */

    'bank_transfer' => [
        'enabled' => env('BANK_TRANSFER_ENABLED', true),
        'account_name' => env('BANK_ACCOUNT_NAME', 'Your Business Name'),
        'account_number' => env('BANK_ACCOUNT_NUMBER', ''),
        'bank_name' => env('BANK_NAME', ''),
        'routing_number' => env('BANK_ROUTING_NUMBER', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Settings
    |--------------------------------------------------------------------------
    */

    'settings' => [
        'min_amount_cents' => env('PAYMENT_MIN_AMOUNT_CENTS', 50), // Minimum payment amount
        'max_amount_cents' => env('PAYMENT_MAX_AMOUNT_CENTS', 100000000), // Maximum payment amount
        'auto_capture' => env('PAYMENT_AUTO_CAPTURE', true), // Auto-capture payments
        'refund_enabled' => env('PAYMENT_REFUND_ENABLED', true), // Enable refunds
    ],

];
