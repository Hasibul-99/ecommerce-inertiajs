<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'key',
        'value',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public static function get(Vendor $vendor, string $key, $default = null)
    {
        $setting = static::where('vendor_id', $vendor->id)
            ->where('key', $key)
            ->first();

        return $setting ? $setting->value : $default;
    }

    public static function set(Vendor $vendor, string $key, $value): self
    {
        return static::updateOrCreate(
            ['vendor_id' => $vendor->id, 'key' => $key],
            ['value' => $value]
        );
    }
}
