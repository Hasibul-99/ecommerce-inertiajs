<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderPlaced extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The order instance.
     *
     * @var \App\Models\Order
     */
    public $order;

    /**
     * Whether this is a vendor notification.
     *
     * @var bool
     */
    public $isVendorNotification;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\Order  $order
     * @param  bool  $isVendorNotification
     * @return void
     */
    public function __construct(Order $order, bool $isVendorNotification = false)
    {
        $this->order = $order;
        $this->isVendorNotification = $isVendorNotification;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        $subject = $this->isVendorNotification
            ? 'New Order Received: #' . $this->order->order_number
            : 'Your Order #' . $this->order->order_number . ' has been placed';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        $view = $this->isVendorNotification
            ? 'emails.orders.vendor-notification'
            : 'emails.orders.placed';

        return new Content(
            view: $view,
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}