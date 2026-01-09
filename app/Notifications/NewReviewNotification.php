<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReviewNotification extends Notification implements ShouldQueue
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
        $rating = str_repeat('⭐', $this->review->rating);

        return (new MailMessage)
            ->subject('New Review on ' . $this->review->product->name)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You have received a new review on your product: ' . $this->review->product->name)
            ->line('Rating: ' . $rating . ' (' . $this->review->rating . '/5)')
            ->line('Review: ' . substr($this->review->comment, 0, 150) . '...')
            ->action('View Review', route('vendor.reviews.index'))
            ->line('Thank you for being a valued vendor!');
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
            'rating' => $this->review->rating,
            'user_name' => $this->review->user->name,
            'comment_preview' => substr($this->review->comment, 0, 100),
        ];
    }
}
