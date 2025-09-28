<?php

namespace App\Mail;

use App\Models\Payout;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayoutProcessed extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The payout instance.
     *
     * @var \App\Models\Payout
     */
    public $payout;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\Payout  $payout
     * @return void
     */
    public function __construct(Payout $payout)
    {
        $this->payout = $payout;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Payout Processed: ' . $this->payout->reference_number,
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'emails.payouts.processed',
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