<?php

namespace App\Services;

use App\Models\EmailTemplate;
use Illuminate\Support\Facades\Cache;

class EmailTemplateService
{
    /**
     * Cache duration in seconds (1 hour).
     */
    protected const CACHE_DURATION = 3600;

    /**
     * Get a template by slug.
     */
    public function getTemplate(string $slug): ?EmailTemplate
    {
        return Cache::remember("email_template_{$slug}", self::CACHE_DURATION, function () use ($slug) {
            return EmailTemplate::where('slug', $slug)
                ->where('is_active', true)
                ->first();
        });
    }

    /**
     * Render a template with given data.
     *
     * @return array ['subject' => string, 'body_html' => string, 'body_text' => string]
     */
    public function render(string $slug, array $data): array
    {
        $template = $this->getTemplate($slug);

        if (!$template) {
            throw new \RuntimeException("Email template '{$slug}' not found");
        }

        return $template->render($data);
    }

    /**
     * Get available variables for a template.
     */
    public function getAvailableVariables(string $slug): array
    {
        $template = $this->getTemplate($slug);

        if (!$template) {
            return [];
        }

        return $template->getAvailableVariables();
    }

    /**
     * Preview a template with sample data.
     */
    public function preview(string $slug, array $sampleData): string
    {
        $rendered = $this->render($slug, $sampleData);
        return $rendered['body_html'];
    }

    /**
     * Update a template and clear cache.
     */
    public function updateTemplate(EmailTemplate $template, array $data): EmailTemplate
    {
        $template->update($data);
        $this->clearTemplateCache($template->slug);
        return $template->fresh();
    }

    /**
     * Clear cache for a specific template.
     */
    public function clearTemplateCache(string $slug): void
    {
        Cache::forget("email_template_{$slug}");
    }

    /**
     * Clear all template caches.
     */
    public function clearAllCaches(): void
    {
        $templates = EmailTemplate::all();
        foreach ($templates as $template) {
            $this->clearTemplateCache($template->slug);
        }
    }

    /**
     * Get sample data for a template slug.
     */
    public function getSampleData(string $slug): array
    {
        return match ($slug) {
            'order_placed' => [
                'order' => [
                    'number' => 'ORD-12345',
                    'total' => '$125.00',
                    'date' => now()->format('F d, Y'),
                ],
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                ],
                'items' => [
                    ['name' => 'Product 1', 'quantity' => 2, 'price' => '$50.00'],
                    ['name' => 'Product 2', 'quantity' => 1, 'price' => '$25.00'],
                ],
                'shipping_address' => '123 Main St, City, State 12345',
            ],
            'order_confirmed' => [
                'order' => [
                    'number' => 'ORD-12345',
                    'status' => 'Confirmed',
                    'estimated_delivery' => now()->addDays(5)->format('F d, Y'),
                ],
                'user' => ['name' => 'John Doe'],
            ],
            'order_shipped' => [
                'order' => [
                    'number' => 'ORD-12345',
                    'tracking_number' => 'TRK-67890',
                    'carrier' => 'FedEx',
                ],
                'user' => ['name' => 'John Doe'],
            ],
            'order_delivered' => [
                'order' => ['number' => 'ORD-12345'],
                'user' => ['name' => 'John Doe'],
            ],
            'order_cancelled' => [
                'order' => [
                    'number' => 'ORD-12345',
                    'reason' => 'Customer requested cancellation',
                ],
                'user' => ['name' => 'John Doe'],
            ],
            'vendor_new_order' => [
                'order' => [
                    'number' => 'ORD-12345',
                    'total' => '$125.00',
                    'items_count' => 3,
                ],
                'vendor' => ['business_name' => 'My Store'],
                'customer' => ['name' => 'John Doe'],
            ],
            'vendor_payout_processed' => [
                'payout' => [
                    'amount' => '$500.00',
                    'period' => 'January 2026',
                    'orders_count' => 25,
                ],
                'vendor' => ['business_name' => 'My Store'],
            ],
            'password_reset' => [
                'user' => ['name' => 'John Doe'],
                'reset_link' => 'https://example.com/reset-password?token=abc123',
            ],
            'welcome_email' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                ],
            ],
            'vendor_application_submitted' => [
                'vendor' => [
                    'business_name' => 'My Store',
                    'application_id' => 'APP-123',
                ],
                'user' => ['name' => 'John Doe'],
            ],
            'vendor_application_approved' => [
                'vendor' => ['business_name' => 'My Store'],
                'user' => ['name' => 'John Doe'],
                'dashboard_link' => 'https://example.com/vendor/dashboard',
            ],
            default => [
                'user' => ['name' => 'John Doe', 'email' => 'john@example.com'],
            ],
        };
    }
}
