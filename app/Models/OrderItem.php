<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'product_id',
        'product_variant_id',
        'vendor_id',
        'product_name',
        'variant_name',
        'quantity',
        'unit_price_cents',
        'price_cents',
        'subtotal_cents',
        'tax_cents',
        'total_cents',
        'product_snapshot',
        'vendor_status',
        'carrier',
        'tracking_number',
        'shipped_at',
        'estimated_delivery_at',
        'delivered_at',
        'vendor_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'product_snapshot' => 'json',
        'shipped_at' => 'datetime',
        'estimated_delivery_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    /**
     * Get the price in dollars.
     *
     * @return float
     */
    public function getPriceInDollarsAttribute()
    {
        return $this->unit_price_cents / 100;
    }

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
     * Get the order that owns the item.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product that owns the item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the product variant that owns the item.
     */
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    /**
     * Get the commissions for the order item.
     */
    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }

    /**
     * Get the inventory reservations for the order item.
     */
    public function inventoryReservations()
    {
        return $this->hasMany(InventoryReservation::class);
    }

    /**
     * Get the vendor that owns the item.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Check if item is shipped.
     */
    public function isShipped(): bool
    {
        return $this->vendor_status === 'shipped' || $this->vendor_status === 'delivered';
    }

    /**
     * Check if item is delivered.
     */
    public function isDelivered(): bool
    {
        return $this->vendor_status === 'delivered';
    }

    /**
     * Check if item can be shipped.
     */
    public function canBeShipped(): bool
    {
        return in_array($this->vendor_status, ['confirmed', 'processing', 'ready_to_ship']);
    }

    /**
     * Scope for vendor's items.
     */
    public function scopeForVendor($query, $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    /**
     * Scope for specific status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('vendor_status', $status);
    }
}