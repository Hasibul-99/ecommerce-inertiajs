<?php

namespace App\Notifications;

use App\Models\Order;
use App\Models\NotificationSetting;
use App\Services\EmailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPlacedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The order instance.
     *
     * @var \App\Models\Order
     */
    protected $order;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        $channels = ['database'];

        // Check user notification preferences
        $setting = NotificationSetting::getOrCreateForUser($notifiable->id, 'order_placed');

        if ($setting->email_enabled) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $emailTemplateService = app(EmailTemplateService::class);

        try {
            // Try to use email template if available
            $template = $emailTemplateService->render('order_placed', [
                'user' => [
                    'name' => $notifiable->name,
                    'email' => $notifiable->email,
                ],
                'order' => [
                    'number' => $this->order->order_number,
                    'total' => number_format($this->order->total_cents / 100, 2),
                    'payment_method' => ucfirst($this->order->payment_method),
                    'payment_status' => ucfirst($this->order->payment_status),
                    'url' => url('/orders/' . $this->order->id),
                ],
            ]);

            return (new MailMessage)
                ->subject($template['subject'])
                ->view('emails.template', [
                    'body' => $template['body_html'],
                ]);
        } catch (\Exception $e) {
            // Fallback to default template if email template service fails
            \Log::warning('Email template service failed, using fallback', [
                'template' => 'order_placed',
                'error' => $e->getMessage(),
            ]);

            $mailMessage = (new MailMessage)
                ->subject('Your Order #' . $this->order->order_number . ' has been placed')
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('Thank you for your order. We have received your order and it is now being processed.')
                ->line('Order #: ' . $this->order->order_number);

            // Add payment method specific information
            if ($this->order->payment_method === 'cod') {
                $mailMessage->line('Payment Method: Cash on Delivery')
                    ->line('Payment Status: Unpaid - You will pay when your order is delivered.');
            } else {
                $mailMessage->line('Payment Method: ' . ucfirst($this->order->payment_method))
                    ->line('Payment Status: ' . ucfirst($this->order->payment_status));
            }

            // Add order details
            $mailMessage->line('Order Total: $' . number_format($this->order->total_cents / 100, 2))
                ->action('View Order Details', url('/orders/' . $this->order->id))
                ->line('Thank you for shopping with us!');

            return $mailMessage;
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'title' => 'Order Placed',
            'message' => sprintf(
                'Your order #%s has been placed successfully! Total: $%s',
                $this->order->order_number,
                number_format($this->order->total_cents / 100, 2)
            ),
            'type' => 'order',
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'total' => $this->order->total_cents / 100,
            'payment_method' => $this->order->payment_method,
            'payment_status' => $this->order->payment_status,
            'action_url' => url('/orders/' . $this->order->id),
        ];
    }
}