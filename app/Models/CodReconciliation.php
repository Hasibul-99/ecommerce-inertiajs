<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodReconciliation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date',
        'delivery_person_id',
        'total_orders_count',
        'total_cod_amount_cents',
        'collected_amount_cents',
        'discrepancy_cents',
        'status',
        'verified_by',
        'verified_at',
        'notes',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'verified_at' => 'datetime',
        'metadata' => 'json',
    ];

    /**
     * Get the delivery person for this reconciliation.
     */
    public function deliveryPerson()
    {
        return $this->belongsTo(User::class, 'delivery_person_id');
    }

    /**
     * Get the user who verified this reconciliation.
     */
    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get all orders included in this reconciliation.
     */
    public function orders()
    {
        return Order::where('delivery_person_id', $this->delivery_person_id)
            ->whereDate('cod_collected_at', $this->date)
            ->where('payment_method', 'cod')
            ->whereNotNull('cod_collected_at');
    }

    /**
     * Get the total COD amount in dollars.
     *
     * @return float
     */
    public function getTotalCodAmountInDollarsAttribute()
    {
        return $this->total_cod_amount_cents / 100;
    }

    /**
     * Get the collected amount in dollars.
     *
     * @return float
     */
    public function getCollectedAmountInDollarsAttribute()
    {
        return $this->collected_amount_cents / 100;
    }

    /**
     * Get the discrepancy amount in dollars.
     *
     * @return float
     */
    public function getDiscrepancyInDollarsAttribute()
    {
        return $this->discrepancy_cents / 100;
    }

    /**
     * Check if there is a discrepancy.
     *
     * @return bool
     */
    public function hasDiscrepancy()
    {
        return $this->discrepancy_cents != 0;
    }

    /**
     * Check if reconciliation is verified.
     *
     * @return bool
     */
    public function isVerified()
    {
        return $this->status === 'verified';
    }

    /**
     * Check if reconciliation is disputed.
     *
     * @return bool
     */
    public function isDisputed()
    {
        return $this->status === 'disputed';
    }

    /**
     * Check if reconciliation is pending.
     *
     * @return bool
     */
    public function isPending()
    {
        return $this->status === 'pending';
    }

    /**
     * Calculate accuracy percentage.
     *
     * @return float
     */
    public function getAccuracyPercentage()
    {
        if ($this->total_cod_amount_cents == 0) {
            return 100.0;
        }

        return ($this->collected_amount_cents / $this->total_cod_amount_cents) * 100;
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Scope to filter by delivery person.
     */
    public function scopeForDeliveryPerson($query, $deliveryPersonId)
    {
        return $query->where('delivery_person_id', $deliveryPersonId);
    }

    /**
     * Scope to filter by status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get pending reconciliations.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get disputed reconciliations.
     */
    public function scopeDisputed($query)
    {
        return $query->where('status', 'disputed');
    }

    /**
     * Scope to get verified reconciliations.
     */
    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }
}
