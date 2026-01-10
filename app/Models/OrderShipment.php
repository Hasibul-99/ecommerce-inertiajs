<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderShipment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'vendor_id',
        'tracking_number',
        'label_url',
        'label_created_at',
        'shipping_carrier',
        'shipping_method',
        'weight',
        'dimensions',
        'shipping_cost_cents',
        'insurance_cents',
        'status',
        'shipped_at',
        'pickup_scheduled_at',
        'picked_up_at',
        'delivered_at',
        'last_tracking_update',
        'tracking_events',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'label_created_at' => 'datetime',
        'dimensions' => 'array',
        'shipped_at' => 'datetime',
        'pickup_scheduled_at' => 'datetime',
        'picked_up_at' => 'datetime',
        'delivered_at' => 'datetime',
        'last_tracking_update' => 'datetime',
        'tracking_events' => 'array',
        'weight' => 'integer',
        'shipping_cost_cents' => 'integer',
        'insurance_cents' => 'integer',
    ];

    /**
     * Get the shipping cost in dollars.
     *
     * @return float
     */
    public function getShippingCostInDollarsAttribute()
    {
        return $this->shipping_cost_cents / 100;
    }

    /**
     * Get the order that owns the shipment.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the vendor that owns the shipment.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the insurance cost in dollars.
     *
     * @return float
     */
    public function getInsuranceCostInDollarsAttribute()
    {
        return $this->insurance_cents ? $this->insurance_cents / 100 : 0;
    }

    /**
     * Get the total cost (shipping + insurance) in dollars.
     *
     * @return float
     */
    public function getTotalCostInDollarsAttribute()
    {
        return ($this->shipping_cost_cents + ($this->insurance_cents ?? 0)) / 100;
    }

    /**
     * Check if the shipment has a tracking number.
     *
     * @return bool
     */
    public function hasTracking()
    {
        return !empty($this->tracking_number);
    }

    /**
     * Check if the shipment has a label.
     *
     * @return bool
     */
    public function hasLabel()
    {
        return !empty($this->label_url);
    }

    /**
     * Get the latest tracking event.
     *
     * @return array|null
     */
    public function getLatestTrackingEvent()
    {
        if (empty($this->tracking_events)) {
            return null;
        }

        return end($this->tracking_events);
    }

    /**
     * Add a tracking event.
     *
     * @param array $event
     * @return void
     */
    public function addTrackingEvent(array $event)
    {
        $events = $this->tracking_events ?? [];
        $events[] = array_merge($event, [
            'recorded_at' => now()->toIso8601String(),
        ]);
        $this->tracking_events = $events;
        $this->last_tracking_update = now();
    }
}