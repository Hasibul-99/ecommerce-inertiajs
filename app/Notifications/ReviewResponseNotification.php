<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewResponseNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $review;

    /**
     * Create a new notification instance.
     */
    public function __construct(Review $review)
    {
        $this->review = $review;
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
        $vendorName = $this->review->product->vendor->business_name ?? 'The vendor';

        return (new MailMessage)
            ->subject('Vendor Responded to Your Review')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line($vendorName . ' has responded to your review on ' . $this->review->product->name)
            ->line('Your review: ' . substr($this->review->comment, 0, 100) . '...')
            ->line('Vendor response: ' . substr($this->review->vendor_response, 0, 150) . '...')
            ->action('View Full Response', route('product.show', $this->review->product->slug))
            ->line('Thank you for your feedback!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'review_id' => $this->review->id,
            'product_id' => $this->review->product_id,
            'product_name' => $this->review->product->name,
            'product_slug' => $this->review->product->slug,
            'vendor_name' => $this->review->product->vendor->business_name ?? 'Vendor',
            'response_preview' => substr($this->review->vendor_response, 0, 100),
        ];
    }
}
