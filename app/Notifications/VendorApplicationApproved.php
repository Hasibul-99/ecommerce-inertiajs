<?php

namespace App\Notifications;

use App\Models\Vendor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorApplicationApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $vendor;

    public function __construct(Vendor $vendor)
    {
        $this->vendor = $vendor;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Congratulations! Your Vendor Application has been Approved')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Great news! Your vendor application for **' . $this->vendor->business_name . '** has been approved.')
            ->line('You can now start selling on our platform!')
            ->line('**Next Steps:**')
            ->line('• Access your vendor dashboard')
            ->line('• Add your first products')
            ->line('• Set up your store profile')
            ->line('• Start receiving orders')
            ->action('Go to Vendor Dashboard', url('/vendor/dashboard'))
            ->line('Welcome to our vendor community!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'vendor_id' => $this->vendor->id,
            'business_name' => $this->vendor->business_name,
            'approved_at' => $this->vendor->approved_at,
            'message' => 'Your vendor application has been approved!',
        ];
    }
}
