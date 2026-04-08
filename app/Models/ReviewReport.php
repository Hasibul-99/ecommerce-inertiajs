<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewReport extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'review_id',
        'user_id',
        'reason',
        'details',
        'status',
    ];

    /**
     * Get the review that was reported.
     */
    public function review()
    {
        return $this->belongsTo(Review::class);
    }

    /**
     * Get the user who made the report.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include pending reports.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include reviewed reports.
     */
    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }
}
