<?php

namespace App\Notifications;

use App\Models\OrderShipment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ShipmentShippedNotification extends Notification implements ShouldQueue
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
        $trackingUrl = route('tracking.show', ['tracking_number' => $this->shipment->tracking_number]);

        return (new MailMessage)
            ->subject('Your Order Has Been Shipped!')
            ->greeting('Good news!')
            ->line("Your order #{$this->shipment->order->order_number} has been shipped.")
            ->line("Tracking Number: {$this->shipment->tracking_number}")
            ->line("Carrier: " . ucfirst($this->shipment->shipping_carrier ?? 'Unknown'))
            ->line("Shipped by: {$this->shipment->vendor->business_name}")
            ->action('Track Your Package', $trackingUrl)
            ->line('Thank you for your order!');
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
            'carrier' => $this->shipment->shipping_carrier,
            'vendor_name' => $this->shipment->vendor->business_name,
            'message' => "Your order #{$this->shipment->order->order_number} has been shipped.",
        ];
    }
}
