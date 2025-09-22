<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatus extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'user_id',
        'status',
        'comment',
    ];

    /**
     * Get the order that owns the status.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the user that created the status.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}