<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
        'description',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    /**
     * Get the value with appropriate type casting.
     */
    public function getTypedValue()
    {
        return match ($this->type) {
            'integer' => (int) $this->value,
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($this->value, true),
            'file' => $this->value,
            default => $this->value,
        };
    }

    /**
     * Set the value with appropriate type handling.
     */
    public function setTypedValue($value): void
    {
        $this->value = match ($this->type) {
            'boolean' => $value ? '1' : '0',
            'json' => json_encode($value),
            default => (string) $value,
        };
    }

    /**
     * Scope to get settings by group.
     */
    public function scopeGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    /**
     * Scope to get public settings.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }
}
