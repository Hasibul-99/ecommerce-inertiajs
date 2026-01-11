<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorDailySummaryNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $summary;
    public $vendorName;

    /**
     * Create a new notification instance.
     */
    public function __construct(array $summary, string $vendorName)
    {
        $this->summary = $summary;
        $this->vendorName = $vendorName;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $revenue = number_format($this->summary['revenue_cents'] / 100, 2);
        $orders = $this->summary['orders_count'];
        $items = $this->summary['items_sold'];

        $message = (new MailMessage)
            ->subject('Daily Sales Summary - ' . now()->subDay()->format('M d, Y'))
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Here is your daily sales summary for ' . now()->subDay()->format('F d, Y'));

        if ($orders > 0) {
            $message->line('**Total Revenue:** $' . $revenue)
                    ->line('**Orders:** ' . $orders)
                    ->line('**Items Sold:** ' . $items);

            if (isset($this->summary['top_product'])) {
                $message->line('**Top Product:** ' . $this->summary['top_product']['name'] . ' (' . $this->summary['top_product']['sold'] . ' sold)');
            }

            if (isset($this->summary['low_stock_count']) && $this->summary['low_stock_count'] > 0) {
                $message->line('⚠️ **Low Stock Alert:** ' . $this->summary['low_stock_count'] . ' products need restocking');
            }

            $message->action('View Analytics', route('vendor.analytics.sales'));
        } else {
            $message->line('No sales were recorded yesterday. Keep promoting your products!');
        }

        return $message->line('Keep up the great work!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'daily_summary',
            'date' => now()->subDay()->format('Y-m-d'),
            'revenue_cents' => $this->summary['revenue_cents'],
            'orders_count' => $this->summary['orders_count'],
            'items_sold' => $this->summary['items_sold'],
            'low_stock_count' => $this->summary['low_stock_count'] ?? 0,
            'top_product' => $this->summary['top_product'] ?? null,
        ];
    }
}
