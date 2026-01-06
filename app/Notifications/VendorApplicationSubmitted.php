<?php

namespace App\Notifications;

use App\Models\Vendor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorApplicationSubmitted extends Notification implements ShouldQueue
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
            ->subject('Vendor Application Submitted Successfully')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Thank you for submitting your vendor application for **' . $this->vendor->business_name . '**.')
            ->line('Your application is currently under review by our team.')
            ->line('We will notify you once your application has been reviewed.')
            ->line('**What happens next:**')
            ->line('• Our team will review your business information')
            ->line('• We will verify your submitted documents')
            ->line('• You will receive an email once the review is complete')
            ->action('View Application Status', url('/vendor/dashboard'))
            ->line('Thank you for choosing our platform!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'vendor_id' => $this->vendor->id,
            'business_name' => $this->vendor->business_name,
            'status' => $this->vendor->status,
            'message' => 'Your vendor application has been submitted for review',
        ];
    }
}
