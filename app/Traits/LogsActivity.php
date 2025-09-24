<?php

namespace App\Traits;

use App\Services\ActivityLogService;

trait LogsActivity
{
    /**
     * Boot the trait.
     *
     * @return void
     */
    protected static function bootLogsActivity(): void
    {
        // Log model creation
        static::created(function ($model) {
            static::logActivity('created', $model);
        });

        // Log model updates
        static::updated(function ($model) {
            // Only log if attributes actually changed
            if (count($model->getDirty()) > 0) {
                static::logActivity('updated', $model, [
                    'old' => array_intersect_key($model->getOriginal(), $model->getDirty()),
                    'new' => $model->getDirty(),
                ]);
            }
        });

        // Log model deletion
        static::deleted(function ($model) {
            static::logActivity('deleted', $model);
        });

        // Log model restoration (if using SoftDeletes)
        if (method_exists(static::class, 'restored')) {
            static::restored(function ($model) {
                static::logActivity('restored', $model);
            });
        }
    }

    /**
     * Log activity for the model.
     *
     * @param string $event
     * @param mixed $model
     * @param array $properties
     * @return void
     */
    protected static function logActivity(string $event, $model, array $properties = []): void
    {
        // Get the model's event type (typically the model name)
        $eventType = static::getActivityLogEventType();

        ActivityLogService::log($event, $eventType, $model, $properties);
    }

    /**
     * Get the event type to use in activity logs.
     *
     * @return string
     */
    protected static function getActivityLogEventType(): string
    {
        // Default to the model's base class name
        return class_basename(static::class);
    }
}