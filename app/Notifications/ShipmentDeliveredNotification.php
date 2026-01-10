<?php

namespace App\Notifications;

use App\Models\OrderShipment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ShipmentDeliveredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected OrderShipment $shipment;

    /**
     * Create a new notification instance.
     */
    public function __construct(OrderShipment $shipment)
    {
        $this->shipment = $shipment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $orderUrl = route('customer.orders.show', ['order' => $this->shipment->order_id]);

        return (new MailMessage)
            ->subject('Your Order Has Been Delivered!')
            ->greeting('Great news!')
            ->line("Your order #{$this->shipment->order->order_number} has been delivered.")
            ->line("Delivered on: " . $this->shipment->delivered_at->format('M d, Y g:i A'))
            ->line("Vendor: {$this->shipment->vendor->business_name}")
            ->action('View Order', $orderUrl)
            ->line('We hope you enjoy your purchase! Please consider leaving a review.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'shipment_id' => $this->shipment->id,
            'order_id' => $this->shipment->order_id,
            'order_number' => $this->shipment->order->order_number,
            'tracking_number' => $this->shipment->tracking_number,
            'vendor_name' => $this->shipment->vendor->business_name,
            'delivered_at' => $this->shipment->delivered_at->toIso8601String(),
            'message' => "Your order #{$this->shipment->order->order_number} has been delivered.",
        ];
    }
}
