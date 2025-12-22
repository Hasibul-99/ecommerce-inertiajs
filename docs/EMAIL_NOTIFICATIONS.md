# Email Notification System

## Overview

The ecommerce platform includes a comprehensive email notification system that automatically sends emails to customers and vendors based on various order and payment events.

## Architecture

The notification system follows Laravel's event-driven architecture:

1. **Events**: Triggered when specific actions occur (e.g., order placed, order shipped)
2. **Listeners**: Listen for events and send notifications
3. **Notifications**: Define the email content and format
4. **Mail**: Alternative way to send emails using Mailable classes

## Available Events

### Order Events

- **OrderPlaced** (`App\Events\OrderPlaced`)
  - Triggered when a customer places a new order
  - Listeners:
    - `SendOrderConfirmation` - Sends confirmation email to customer
    - `NotifyVendorsOfNewOrder` - Notifies vendors of products in the order

- **OrderShipped** (`App\Events\OrderShipped`)
  - Triggered when an order is marked as shipped
  - Listener: `SendOrderShippedNotification`

- **OrderDelivered** (`App\Events\OrderDelivered`)
  - Triggered when an order is marked as delivered
  - Listener: `SendOrderDeliveredNotification`

- **OrderCancelled** (`App\Events\OrderCancelled`)
  - Triggered when an order is cancelled
  - Listener: `SendOrderCancelledNotification`

### Payment Events

- **PaymentFailed** (`App\Events\PaymentFailed`)
  - Triggered when a payment processing fails
  - Listener: `SendPaymentFailedNotification`

- **OrderPaid** (`App\Events\OrderPaid`)
  - Triggered when payment for an order is successful
  - Already exists in the codebase

### Vendor Events

- **PayoutProcessed** (`App\Events\PayoutProcessed`)
  - Triggered when a payout to a vendor is processed
  - Listener: `SendPayoutProcessedNotification`

## Notifications

All notifications are queued (implement `ShouldQueue`) for asynchronous processing:

1. **OrderPlacedNotification**
   - Subject: "Your Order #[order_number] has been placed"
   - Includes: Order details, payment info, total amount

2. **OrderShippedNotification**
   - Subject: "Your Order #[order_number] has been shipped"
   - Includes: Tracking number, shipping carrier, order details

3. **OrderDeliveredNotification**
   - Subject: "Your Order #[order_number] has been delivered"
   - Includes: Delivery confirmation, link to rate products

4. **OrderCancelledNotification**
   - Subject: "Your Order #[order_number] has been cancelled"
   - Includes: Cancellation details, refund information (if applicable)

5. **PaymentFailedNotification**
   - Subject: "Payment Failed for Order #[order_number]"
   - Includes: Failure reason, link to update payment method

6. **PayoutProcessedNotification**
   - Subject: "Payout Processed: [reference_number]"
   - Includes: Payout amount, payment method, expected arrival date

## How to Trigger Notifications

### In Controllers

```php
use App\Events\OrderShipped;

// When updating order status to shipped
$order->update(['status' => 'shipped']);
event(new OrderShipped($order));
```

### In Webhooks

```php
// Already implemented in WebhookController
// Shipping webhook automatically triggers OrderShipped or OrderDelivered events
```

### Example: Manually Sending Email

```php
use App\Notifications\OrderShippedNotification;

$user->notify(new OrderShippedNotification($order));
```

## Configuration

### Queue Setup

All notifications are queued. Make sure your queue is configured:

```bash
# .env
QUEUE_CONNECTION=database
# or
QUEUE_CONNECTION=redis
```

Run the queue worker:

```bash
php artisan queue:work
```

### Email Configuration

Configure your email settings in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## Event-Listener Registration

All events and listeners are registered in `app/Providers/EventServiceProvider.php`:

```php
protected $listen = [
    \App\Events\OrderPlaced::class => [
        \App\Listeners\SendOrderConfirmation::class,
        \App\Listeners\NotifyVendorsOfNewOrder::class,
    ],
    \App\Events\OrderShipped::class => [
        \App\Listeners\SendOrderShippedNotification::class,
    ],
    // ... more mappings
];
```

## Testing Email Notifications

### Using Mailpit (Development)

Mailpit is configured by default for local development. Access the web interface at:

```
http://localhost:8025
```

### Testing Specific Notifications

```php
// In tinker or test
php artisan tinker

// Test order placed notification
$order = \App\Models\Order::first();
$user = $order->user;
$user->notify(new \App\Notifications\OrderPlacedNotification($order));

// Check mailpit interface to see the email
```

## Customizing Notifications

### Modify Email Content

Edit the notification class in `app/Notifications/`:

```php
public function toMail($notifiable)
{
    return (new MailMessage)
        ->subject('Custom Subject')
        ->greeting('Hello ' . $notifiable->name . '!')
        ->line('Your custom message here')
        ->action('Custom Button', url('/custom-url'))
        ->line('Thank you!');
}
```

### Add Custom Variables

```php
protected $customData;

public function __construct(Order $order, $customData)
{
    $this->order = $order;
    $this->customData = $customData;
}
```

### Create Custom Email Views

For more control over email design, create blade templates:

1. Create view: `resources/views/emails/custom-notification.blade.php`
2. Use in notification:

```php
public function toMail($notifiable)
{
    return (new MailMessage)
        ->view('emails.custom-notification', [
            'order' => $this->order,
            'user' => $notifiable,
        ]);
}
```

## Adding New Notifications

1. **Create Event**:
   ```bash
   php artisan make:event OrderRefunded
   ```

2. **Create Notification**:
   ```bash
   php artisan make:notification OrderRefundedNotification
   ```

3. **Create Listener**:
   ```bash
   php artisan make:listener SendOrderRefundedNotification --event=OrderRefunded
   ```

4. **Register in EventServiceProvider**:
   ```php
   \App\Events\OrderRefunded::class => [
       \App\Listeners\SendOrderRefundedNotification::class,
   ],
   ```

5. **Trigger Event**:
   ```php
   event(new OrderRefunded($order));
   ```

## Notification Channels

Currently, notifications use the `mail` channel. You can add more channels:

```php
public function via($notifiable)
{
    return ['mail', 'database', 'broadcast'];
}
```

### Database Notifications

Enable database notifications:

```bash
php artisan notifications:table
php artisan migrate
```

Then add to notification:

```php
public function toArray($notifiable)
{
    return [
        'order_id' => $this->order->id,
        'message' => 'Your order has been shipped',
    ];
}
```

## Best Practices

1. **Always Queue Notifications**: Use `implements ShouldQueue` to avoid blocking requests
2. **Keep Emails Simple**: Clear subject lines, concise content, clear CTAs
3. **Include Relevant Links**: Make it easy for users to take action
4. **Test Thoroughly**: Test all notification scenarios before deploying
5. **Handle Failures Gracefully**: Use try-catch in listeners and log errors
6. **Respect User Preferences**: Consider adding notification preferences in user settings

## Troubleshooting

### Emails Not Sending

1. Check queue is running: `php artisan queue:work`
2. Check email configuration in `.env`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Verify listener is registered in EventServiceProvider

### Queue Jobs Failing

```bash
# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

### Testing Email Templates

```bash
# Preview notification in browser
Route::get('/preview-email', function () {
    $order = \App\Models\Order::first();
    return (new \App\Notifications\OrderPlacedNotification($order))
        ->toMail($order->user);
});
```

## Related Files

- Events: `app/Events/`
- Listeners: `app/Listeners/`
- Notifications: `app/Notifications/`
- Mailables: `app/Mail/`
- Event Registration: `app/Providers/EventServiceProvider.php`
- Controllers: `app/Http/Controllers/OrderController.php`, `app/Http/Controllers/WebhookController.php`
