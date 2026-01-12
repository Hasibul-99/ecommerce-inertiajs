<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Order Placed',
                'slug' => 'order_placed',
                'subject' => 'Order Confirmation - {{order.number}}',
                'body_html' => $this->getOrderPlacedHtml(),
                'body_text' => $this->getOrderPlacedText(),
                'variables' => ['order.number', 'order.total', 'order.date', 'user.name', 'user.email', 'items', 'shipping_address'],
                'is_active' => true,
            ],
            [
                'name' => 'Order Confirmed',
                'slug' => 'order_confirmed',
                'subject' => 'Your Order Has Been Confirmed - {{order.number}}',
                'body_html' => $this->getOrderConfirmedHtml(),
                'body_text' => $this->getOrderConfirmedText(),
                'variables' => ['order.number', 'order.status', 'order.estimated_delivery', 'user.name'],
                'is_active' => true,
            ],
            [
                'name' => 'Order Shipped',
                'slug' => 'order_shipped',
                'subject' => 'Your Order Has Shipped - {{order.number}}',
                'body_html' => $this->getOrderShippedHtml(),
                'body_text' => $this->getOrderShippedText(),
                'variables' => ['order.number', 'order.tracking_number', 'order.carrier', 'user.name'],
                'is_active' => true,
            ],
            [
                'name' => 'Order Delivered',
                'slug' => 'order_delivered',
                'subject' => 'Your Order Has Been Delivered - {{order.number}}',
                'body_html' => $this->getOrderDeliveredHtml(),
                'body_text' => $this->getOrderDeliveredText(),
                'variables' => ['order.number', 'user.name'],
                'is_active' => true,
            ],
            [
                'name' => 'Order Cancelled',
                'slug' => 'order_cancelled',
                'subject' => 'Order Cancelled - {{order.number}}',
                'body_html' => $this->getOrderCancelledHtml(),
                'body_text' => $this->getOrderCancelledText(),
                'variables' => ['order.number', 'order.reason', 'user.name'],
                'is_active' => true,
            ],
            [
                'name' => 'Vendor New Order',
                'slug' => 'vendor_new_order',
                'subject' => 'New Order Received - {{order.number}}',
                'body_html' => $this->getVendorNewOrderHtml(),
                'body_text' => $this->getVendorNewOrderText(),
                'variables' => ['order.number', 'order.total', 'order.items_count', 'vendor.business_name', 'customer.name'],
                'is_active' => true,
            ],
            [
                'name' => 'Vendor Order Cancelled',
                'slug' => 'vendor_order_cancelled',
                'subject' => 'Order Cancelled - {{order.number}}',
                'body_html' => $this->getVendorOrderCancelledHtml(),
                'body_text' => $this->getVendorOrderCancelledText(),
                'variables' => ['order.number', 'order.reason', 'vendor.business_name'],
                'is_active' => true,
            ],
            [
                'name' => 'Vendor Payout Processed',
                'slug' => 'vendor_payout_processed',
                'subject' => 'Payout Processed - {{payout.amount}}',
                'body_html' => $this->getVendorPayoutProcessedHtml(),
                'body_text' => $this->getVendorPayoutProcessedText(),
                'variables' => ['payout.amount', 'payout.period', 'payout.orders_count', 'vendor.business_name'],
                'is_active' => true,
            ],
            [
                'name' => 'Password Reset',
                'slug' => 'password_reset',
                'subject' => 'Reset Your Password',
                'body_html' => $this->getPasswordResetHtml(),
                'body_text' => $this->getPasswordResetText(),
                'variables' => ['user.name', 'reset_link'],
                'is_active' => true,
            ],
            [
                'name' => 'Welcome Email',
                'slug' => 'welcome_email',
                'subject' => 'Welcome to Our Store!',
                'body_html' => $this->getWelcomeEmailHtml(),
                'body_text' => $this->getWelcomeEmailText(),
                'variables' => ['user.name', 'user.email'],
                'is_active' => true,
            ],
            [
                'name' => 'Vendor Application Submitted',
                'slug' => 'vendor_application_submitted',
                'subject' => 'Vendor Application Received - {{vendor.application_id}}',
                'body_html' => $this->getVendorApplicationSubmittedHtml(),
                'body_text' => $this->getVendorApplicationSubmittedText(),
                'variables' => ['vendor.business_name', 'vendor.application_id', 'user.name'],
                'is_active' => true,
            ],
            [
                'name' => 'Vendor Application Approved',
                'slug' => 'vendor_application_approved',
                'subject' => 'Congratulations! Your Vendor Application Has Been Approved',
                'body_html' => $this->getVendorApplicationApprovedHtml(),
                'body_text' => $this->getVendorApplicationApprovedText(),
                'variables' => ['vendor.business_name', 'user.name', 'dashboard_link'],
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            EmailTemplate::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }

        $this->command->info('Email templates seeded successfully!');
    }

    protected function getOrderPlacedHtml(): string
    {
        return <<<HTML
<h2>Thank you for your order, {{user.name}}!</h2>
<p>We've received your order and are processing it now.</p>

<h3>Order Details</h3>
<p><strong>Order Number:</strong> {{order.number}}</p>
<p><strong>Order Date:</strong> {{order.date}}</p>
<p><strong>Total Amount:</strong> {{order.total}}</p>

<h3>Shipping Address</h3>
<p>{{shipping_address}}</p>

<p>We'll send you another email when your order ships.</p>

<p>Best regards,<br>The Team</p>
HTML;
    }

    protected function getOrderPlacedText(): string
    {
        return <<<TEXT
Thank you for your order, {{user.name}}!

We've received your order and are processing it now.

Order Number: {{order.number}}
Order Date: {{order.date}}
Total Amount: {{order.total}}

Shipping Address: {{shipping_address}}

We'll send you another email when your order ships.

Best regards,
The Team
TEXT;
    }

    protected function getOrderConfirmedHtml(): string
    {
        return <<<HTML
<h2>Your order has been confirmed!</h2>
<p>Hi {{user.name}},</p>
<p>Great news! Your order <strong>{{order.number}}</strong> has been confirmed and is being prepared for shipment.</p>
<p><strong>Estimated Delivery:</strong> {{order.estimated_delivery}}</p>
<p>Thank you for your purchase!</p>
HTML;
    }

    protected function getOrderConfirmedText(): string
    {
        return "Hi {{user.name}},\n\nYour order {{order.number}} has been confirmed!\nEstimated Delivery: {{order.estimated_delivery}}\n\nThank you!";
    }

    protected function getOrderShippedHtml(): string
    {
        return <<<HTML
<h2>Your order is on its way!</h2>
<p>Hi {{user.name}},</p>
<p>Your order <strong>{{order.number}}</strong> has been shipped via {{order.carrier}}.</p>
<p><strong>Tracking Number:</strong> {{order.tracking_number}}</p>
<p>You can track your package using the tracking number above.</p>
HTML;
    }

    protected function getOrderShippedText(): string
    {
        return "Hi {{user.name}},\n\nYour order {{order.number}} has shipped!\nCarrier: {{order.carrier}}\nTracking: {{order.tracking_number}}";
    }

    protected function getOrderDeliveredHtml(): string
    {
        return <<<HTML
<h2>Your order has been delivered!</h2>
<p>Hi {{user.name}},</p>
<p>Your order <strong>{{order.number}}</strong> has been successfully delivered.</p>
<p>We hope you enjoy your purchase! If you have any questions, please don't hesitate to contact us.</p>
HTML;
    }

    protected function getOrderDeliveredText(): string
    {
        return "Hi {{user.name}},\n\nYour order {{order.number}} has been delivered!\n\nThank you for shopping with us!";
    }

    protected function getOrderCancelledHtml(): string
    {
        return <<<HTML
<h2>Order Cancelled</h2>
<p>Hi {{user.name}},</p>
<p>Your order <strong>{{order.number}}</strong> has been cancelled.</p>
<p><strong>Reason:</strong> {{order.reason}}</p>
<p>If you have any questions, please contact our support team.</p>
HTML;
    }

    protected function getOrderCancelledText(): string
    {
        return "Hi {{user.name}},\n\nYour order {{order.number}} has been cancelled.\nReason: {{order.reason}}";
    }

    protected function getVendorNewOrderHtml(): string
    {
        return <<<HTML
<h2>New Order Received!</h2>
<p>Hi {{vendor.business_name}},</p>
<p>You have received a new order from {{customer.name}}.</p>
<p><strong>Order Number:</strong> {{order.number}}</p>
<p><strong>Total Amount:</strong> {{order.total}}</p>
<p><strong>Items Count:</strong> {{order.items_count}}</p>
<p>Please log in to your vendor dashboard to process this order.</p>
HTML;
    }

    protected function getVendorNewOrderText(): string
    {
        return "New order received!\n\nOrder: {{order.number}}\nTotal: {{order.total}}\nItems: {{order.items_count}}\n\nPlease log in to process.";
    }

    protected function getVendorOrderCancelledHtml(): string
    {
        return <<<HTML
<h2>Order Cancelled</h2>
<p>Hi {{vendor.business_name}},</p>
<p>Order <strong>{{order.number}}</strong> has been cancelled.</p>
<p><strong>Reason:</strong> {{order.reason}}</p>
HTML;
    }

    protected function getVendorOrderCancelledText(): string
    {
        return "Order {{order.number}} cancelled.\nReason: {{order.reason}}";
    }

    protected function getVendorPayoutProcessedHtml(): string
    {
        return <<<HTML
<h2>Payout Processed</h2>
<p>Hi {{vendor.business_name}},</p>
<p>Your payout for {{payout.period}} has been processed!</p>
<p><strong>Amount:</strong> {{payout.amount}}</p>
<p><strong>Orders Count:</strong> {{payout.orders_count}}</p>
<p>The funds should appear in your account within 3-5 business days.</p>
HTML;
    }

    protected function getVendorPayoutProcessedText(): string
    {
        return "Payout processed!\n\nPeriod: {{payout.period}}\nAmount: {{payout.amount}}\nOrders: {{payout.orders_count}}";
    }

    protected function getPasswordResetHtml(): string
    {
        return <<<HTML
<h2>Reset Your Password</h2>
<p>Hi {{user.name}},</p>
<p>We received a request to reset your password. Click the link below to create a new password:</p>
<p><a href="{{reset_link}}">Reset Password</a></p>
<p>If you didn't request this, please ignore this email.</p>
HTML;
    }

    protected function getPasswordResetText(): string
    {
        return "Reset your password:\n{{reset_link}}\n\nIf you didn't request this, ignore this email.";
    }

    protected function getWelcomeEmailHtml(): string
    {
        return <<<HTML
<h2>Welcome to Our Store!</h2>
<p>Hi {{user.name}},</p>
<p>Thank you for joining us! We're excited to have you as a customer.</p>
<p>Your email: {{user.email}}</p>
<p>Start exploring our products and enjoy your shopping experience!</p>
HTML;
    }

    protected function getWelcomeEmailText(): string
    {
        return "Welcome {{user.name}}!\n\nThank you for joining us. Start shopping now!";
    }

    protected function getVendorApplicationSubmittedHtml(): string
    {
        return <<<HTML
<h2>Vendor Application Received</h2>
<p>Hi {{user.name}},</p>
<p>We've received your vendor application for <strong>{{vendor.business_name}}</strong>.</p>
<p><strong>Application ID:</strong> {{vendor.application_id}}</p>
<p>Our team will review your application and get back to you within 3-5 business days.</p>
HTML;
    }

    protected function getVendorApplicationSubmittedText(): string
    {
        return "Application received for {{vendor.business_name}}!\n\nID: {{vendor.application_id}}\n\nWe'll review it soon.";
    }

    protected function getVendorApplicationApprovedHtml(): string
    {
        return <<<HTML
<h2>Congratulations! Your Application Has Been Approved</h2>
<p>Hi {{user.name}},</p>
<p>Great news! Your vendor application for <strong>{{vendor.business_name}}</strong> has been approved!</p>
<p>You can now access your vendor dashboard and start selling:</p>
<p><a href="{{dashboard_link}}">Go to Dashboard</a></p>
<p>Welcome to our marketplace!</p>
HTML;
    }

    protected function getVendorApplicationApprovedText(): string
    {
        return "Approved!\n\nYour application for {{vendor.business_name}} is approved.\n\nDashboard: {{dashboard_link}}";
    }
}

