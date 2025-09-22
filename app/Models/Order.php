<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'subtotal_cents',
        'tax_cents',
        'shipping_cents',
        'discount_cents',
        'total_cents',
        'shipping_address_id',
        'billing_address_id',
        'shipping_method',
        'notes',
        'coupon_id',
        'payment_status',
        'fulfillment_status',
        'tracking_number',
        'shipping_carrier',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'metadata' => 'json',
    ];

    /**
     * Get the subtotal in dollars.
     *
     * @return float
     */
    public function getSubtotalInDollarsAttribute()
    {
        return $this->subtotal_cents / 100;
    }

    /**
     * Get the tax in dollars.
     *
     * @return float
     */
    public function getTaxInDollarsAttribute()
    {
        return $this->tax_cents / 100;
    }

    /**
     * Get the shipping in dollars.
     *
     * @return float
     */
    public function getShippingInDollarsAttribute()
    {
        return $this->shipping_cents / 100;
    }

    /**
     * Get the discount in dollars.
     *
     * @return float
     */
    public function getDiscountInDollarsAttribute()
    {
        return $this->discount_cents / 100;
    }

    /**
     * Get the total in dollars.
     *
     * @return float
     */
    public function getTotalInDollarsAttribute()
    {
        return $this->total_cents / 100;
    }

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the order.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the shipping address for the order.
     */
    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    /**
     * Get the billing address for the order.
     */
    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }

    /**
     * Get the coupon for the order.
     */
    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Get the payments for the order.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the refunds for the order.
     */
    public function refunds()
    {
        return $this->hasMany(OrderRefund::class);
    }

    /**
     * Get the shipments for the order.
     */
    public function shipments()
    {
        return $this->hasMany(OrderShipment::class);
    }

    /**
     * Get the statuses for the order.
     */
    public function statuses()
    {
        return $this->hasMany(OrderStatus::class);
    }

    /**
     * Get the vendor earnings for the order.
     */
    public function vendorEarnings()
    {
        return $this->hasMany(VendorEarning::class);
    }
}