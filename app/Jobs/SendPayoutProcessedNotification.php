<?php

namespace App\Jobs;

use App\Models\Payout;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\PayoutProcessed;
use Illuminate\Support\Facades\Log;

class SendPayoutProcessedNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The payout instance.
     *
     * @var \App\Models\Payout
     */
    protected $payout;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\Payout  $payout
     * @return void
     */
    public function __construct(Payout $payout)
    {
        $this->payout = $payout;
        $this->queue = 'emails';
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            // Send email to vendor
            Mail::to($this->payout->vendor->email)
                ->send(new PayoutProcessed($this->payout));
            
            Log::info('Payout processed notification sent', [
                'payout_id' => $this->payout->id,
                'vendor_id' => $this->payout->vendor_id,
                'amount' => $this->payout->amount,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send payout processed notification', [
                'payout_id' => $this->payout->id,
                'error' => $e->getMessage(),
            ]);
            
            // Re-throw the exception to trigger job failure
            throw $e;
        }
    }
}