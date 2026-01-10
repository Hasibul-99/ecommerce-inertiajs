<?php

namespace App\Events;

use App\Models\Address;
use App\Models\Cart;
use App\Models\ShippingMethod;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShippingRateCalculated
{
    use Dispatchable, SerializesModels;

    public $cart;
    public $address;
    public $shippingMethod;
    public $rateCents;

    /**
     * Create a new event instance.
     */
    public function __construct(Cart $cart, Address $address, ShippingMethod $shippingMethod, int $rateCents)
    {
        $this->cart = $cart;
        $this->address = $address;
        $this->shippingMethod = $shippingMethod;
        $this->rateCents = $rateCents;
    }
}
