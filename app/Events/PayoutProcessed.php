<?php

namespace App\Events;

use App\Models\Payout;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PayoutProcessed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The payout instance.
     *
     * @var \App\Models\Payout
     */
    public $payout;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Payout  $payout
     * @return void
     */
    public function __construct(Payout $payout)
    {
        $this->payout = $payout;
    }
}
