<?php

namespace App\Notifications;

use App\Models\Vendor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorApplicationRejected extends Notification implements ShouldQueue
{
    use Queueable;

    protected $vendor;
    protected $reason;

    public function __construct(Vendor $vendor, string $reason)
    {
        $this->vendor = $vendor;
        $this->reason = $reason;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Vendor Application Status Update')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Thank you for your interest in becoming a vendor on our platform.')
            ->line('Unfortunately, after careful review, we are unable to approve your application for **' . $this->vendor->business_name . '** at this time.')
            ->line('**Reason:**')
            ->line($this->reason)
            ->line('If you believe this decision was made in error or if you would like to address the issues mentioned, please feel free to contact our support team.')
            ->action('Contact Support', url('/contact'))
            ->line('We appreciate your interest in our platform.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'vendor_id' => $this->vendor->id,
            'business_name' => $this->vendor->business_name,
            'rejected_at' => $this->vendor->rejected_at,
            'reason' => $this->reason,
            'message' => 'Your vendor application has been rejected',
        ];
    }
}
