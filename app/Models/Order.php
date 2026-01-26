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
        'vendor_id',
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
        'payment_method',
        'fulfillment_status',
        'tracking_number',
        'shipping_carrier',
        'metadata',
        'cod_verification_required',
        'cod_amount_collected',
        'cod_collected_at',
        'cod_collected_by',
        'delivery_person_id',
        'cod_fee_cents',
        'delivered_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'metadata' => 'json',
        'cod_verification_required' => 'boolean',
        'cod_collected_at' => 'datetime',
        'delivered_at' => 'datetime',
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

    /**
     * Get the delivery person assigned to this order.
     */
    public function deliveryPerson()
    {
        return $this->belongsTo(User::class, 'delivery_person_id');
    }

    /**
     * Get the user who collected the COD payment.
     */
    public function codCollector()
    {
        return $this->belongsTo(User::class, 'cod_collected_by');
    }

    /**
     * Get the COD amount collected in dollars.
     *
     * @return float|null
     */
    public function getCodAmountCollectedInDollarsAttribute()
    {
        return $this->cod_amount_collected ? $this->cod_amount_collected / 100 : null;
    }

    /**
     * Get the COD fee in dollars.
     *
     * @return float
     */
    public function getCodFeeInDollarsAttribute()
    {
        return $this->cod_fee_cents / 100;
    }

    /**
     * Check if this is a COD order.
     *
     * @return bool
     */
    public function isCod()
    {
        return $this->payment_method === 'cod';
    }

    /**
     * Check if COD has been collected.
     *
     * @return bool
     */
    public function isCodCollected()
    {
        return $this->isCod() && $this->cod_collected_at !== null;
    }

    /**
     * Mark COD as collected.
     *
     * @param int $amountCents
     * @param int|null $collectedBy
     * @return bool
     */
    public function markCodCollected(int $amountCents, ?int $collectedBy = null)
    {
        if (!$this->isCod()) {
            return false;
        }

        $this->update([
            'cod_amount_collected' => $amountCents,
            'cod_collected_at' => now(),
            'cod_collected_by' => $collectedBy,
            'payment_status' => 'paid',
            'cod_verification_required' => false,
        ]);

        return true;
    }

    /**
     * Check if COD payment is pending.
     *
     * @return bool
     */
    public function isCodPending()
    {
        return $this->isCod() && !$this->isCodCollected();
    }

    /**
     * Assign a delivery person to this order.
     *
     * @param int $deliveryPersonId
     * @return bool
     */
    public function assignDeliveryPerson(int $deliveryPersonId)
    {
        return $this->update(['delivery_person_id' => $deliveryPersonId]);
    }

    /**
     * Get the tracking tokens for this order.
     */
    public function trackingTokens()
    {
        return $this->hasMany(\App\Models\TrackingToken::class);
    }

    /**
     * Get the tracking subscriptions for this order.
     */
    public function trackingSubscriptions()
    {
        return $this->hasMany(\App\Models\TrackingSubscription::class);
    }

    /**
     * Get the tracking views for this order.
     */
    public function trackingViews()
    {
        return $this->hasMany(\App\Models\TrackingView::class);
    }

    /**
     * Get public tracking URL for this order.
     *
     * @return string
     */
    public function getPublicTrackingUrl(): string
    {
        $trackingService = app(\App\Services\TrackingService::class);
        $token = $trackingService->generateTrackingToken($this);
        return route('track-order.show', ['token' => $token]);
    }

    /**
     * Get tracking progress percentage.
     *
     * @return int
     */
    public function getTrackingProgress(): int
    {
        $statusProgress = [
            'pending' => 0,
            'confirmed' => 10,
            'processing' => 25,
            'ready_to_ship' => 40,
            'shipped' => 60,
            'in_transit' => 75,
            'out_for_delivery' => 90,
            'delivered' => 100,
            'cancelled' => 0,
            'refunded' => 0,
        ];

        return $statusProgress[$this->status] ?? 0;
    }

    /**
     * Get the latest tracking event.
     *
     * @return array|null
     */
    public function getLatestTrackingEvent(): ?array
    {
        $latestShipment = $this->shipments()
            ->whereNotNull('tracking_events')
            ->orderBy('last_tracking_update', 'desc')
            ->first();

        if ($latestShipment && $latestShipment->tracking_events) {
            return end($latestShipment->tracking_events);
        }

        return null;
    }

    /**
     * Check if order has tracking information.
     *
     * @return bool
     */
    public function hasTracking(): bool
    {
        return !empty($this->tracking_number) || $this->shipments()->whereNotNull('tracking_number')->exists();
    }
}