<?php

namespace App\Notifications;

use App\Models\Vendor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorApplicationReceived extends Notification implements ShouldQueue
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
            ->subject('New Vendor Application Received')
            ->greeting('Hello Admin!')
            ->line('A new vendor application has been submitted and is pending review.')
            ->line('**Business Name:** ' . $this->vendor->business_name)
            ->line('**Submitted By:** ' . $this->vendor->user->name)
            ->line('**Email:** ' . $this->vendor->user->email)
            ->action('Review Application', url('/admin/vendors/' . $this->vendor->id))
            ->line('Please review and approve or reject this application.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'vendor_id' => $this->vendor->id,
            'business_name' => $this->vendor->business_name,
            'user_name' => $this->vendor->user->name,
            'message' => 'New vendor application from ' . $this->vendor->business_name,
        ];
    }
}
