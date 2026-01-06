<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case PROCESSING = 'processing';
    case OUT_FOR_DELIVERY = 'out_for_delivery';
    case DELIVERED = 'delivered';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case REFUNDED = 'refunded';
    case FAILED = 'failed';

    /**
     * Get human-readable label for the status.
     */
    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pending',
            self::CONFIRMED => 'Confirmed',
            self::PROCESSING => 'Processing',
            self::OUT_FOR_DELIVERY => 'Out for Delivery',
            self::DELIVERED => 'Delivered',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
            self::REFUNDED => 'Refunded',
            self::FAILED => 'Failed',
        };
    }

    /**
     * Get color class for badge display.
     */
    public function color(): string
    {
        return match($this) {
            self::PENDING => 'yellow',
            self::CONFIRMED => 'blue',
            self::PROCESSING => 'indigo',
            self::OUT_FOR_DELIVERY => 'purple',
            self::DELIVERED => 'green',
            self::COMPLETED => 'emerald',
            self::CANCELLED => 'red',
            self::REFUNDED => 'gray',
            self::FAILED => 'red',
        };
    }

    /**
     * Get icon for the status.
     */
    public function icon(): string
    {
        return match($this) {
            self::PENDING => 'clock',
            self::CONFIRMED => 'check-circle',
            self::PROCESSING => 'package',
            self::OUT_FOR_DELIVERY => 'truck',
            self::DELIVERED => 'check-square',
            self::COMPLETED => 'check-circle-2',
            self::CANCELLED => 'x-circle',
            self::REFUNDED => 'refresh-cw',
            self::FAILED => 'alert-triangle',
        };
    }

    /**
     * Check if status can transition to another status.
     */
    public function canTransitionTo(OrderStatus $newStatus): bool
    {
        return match($this) {
            self::PENDING => in_array($newStatus, [self::CONFIRMED, self::CANCELLED]),
            self::CONFIRMED => in_array($newStatus, [self::PROCESSING, self::CANCELLED]),
            self::PROCESSING => in_array($newStatus, [self::OUT_FOR_DELIVERY, self::CANCELLED]),
            self::OUT_FOR_DELIVERY => in_array($newStatus, [self::DELIVERED, self::FAILED, self::CANCELLED]),
            self::DELIVERED => in_array($newStatus, [self::COMPLETED, self::REFUNDED]),
            self::COMPLETED => in_array($newStatus, [self::REFUNDED]),
            self::CANCELLED => false,
            self::REFUNDED => false,
            self::FAILED => in_array($newStatus, [self::PROCESSING, self::CANCELLED]),
        };
    }

    /**
     * Get all valid statuses as array.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all statuses with labels.
     */
    public static function options(): array
    {
        return array_map(
            fn($status) => ['value' => $status->value, 'label' => $status->label()],
            self::cases()
        );
    }
}
