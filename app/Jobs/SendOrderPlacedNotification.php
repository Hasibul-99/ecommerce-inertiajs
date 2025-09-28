<?php

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderPlaced;
use Illuminate\Support\Facades\Log;

class SendOrderPlacedNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The order instance.
     *
     * @var \App\Models\Order
     */
    protected $order;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
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
            // Send email to customer
            Mail::to($this->order->customer_email)
                ->send(new OrderPlaced($this->order));
            
            // Send email to vendor if applicable
            if ($this->order->vendor && $this->order->vendor->email) {
                Mail::to($this->order->vendor->email)
                    ->send(new OrderPlaced($this->order, true));
            }
            
            Log::info('Order placed notification sent', [
                'order_id' => $this->order->id,
                'customer_email' => $this->order->customer_email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send order placed notification', [
                'order_id' => $this->order->id,
                'error' => $e->getMessage(),
            ]);
            
            // Re-throw the exception to trigger job failure
            throw $e;
        }
    }
}