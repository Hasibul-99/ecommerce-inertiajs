<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogService
{
    /**
     * Log an activity.
     *
     * @param string $event The event description (e.g., 'created', 'updated', 'deleted')
     * @param string $eventType The type of event (e.g., 'product', 'order', 'user')
     * @param Model $model The model being acted upon
     * @param array $properties Additional properties to log
     * @return ActivityLog
     */
    public static function log(string $event, string $eventType, Model $model, array $properties = []): ActivityLog
    {
        return ActivityLog::create([
            'user_id' => Auth::id(),
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'event' => $event,
            'event_type' => $eventType,
            'loggable_type' => get_class($model),
            'loggable_id' => $model->id,
            'properties' => $properties,
        ]);
    }

    /**
     * Get activities for a specific model.
     *
     * @param Model $model
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getActivitiesFor(Model $model)
    {
        return ActivityLog::where('loggable_type', get_class($model))
            ->where('loggable_id', $model->id)
            ->with('user')
            ->latest()
            ->get();
    }

    /**
     * Get all activities for a specific event type.
     *
     * @param string $eventType
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getActivitiesByType(string $eventType)
    {
        return ActivityLog::where('event_type', $eventType)
            ->with('user')
            ->latest()
            ->get();
    }

    /**
     * Get all activities for a specific user.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getActivitiesByUser(int $userId)
    {
        return ActivityLog::where('user_id', $userId)
            ->latest()
            ->get();
    }
}