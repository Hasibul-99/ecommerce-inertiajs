<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of activity logs.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $query = ActivityLog::with('user');
        
        // Filter by event type if provided
        if ($request->has('event_type')) {
            $query->where('event_type', $request->event_type);
        }
        
        // Filter by user if provided
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        // Filter by date range if provided
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        
        $activityLogs = $query->latest()->paginate(15);
        
        // Get unique event types for filtering
        $eventTypes = ActivityLog::select('event_type')
            ->distinct()
            ->pluck('event_type');
            
        return Inertia::render('Admin/ActivityLogs/Index', [
            'activityLogs' => $activityLogs,
            'filters' => $request->only(['event_type', 'user_id', 'from_date', 'to_date']),
            'eventTypes' => $eventTypes,
        ]);
    }
    
    /**
     * Display the specified activity log.
     *
     * @param ActivityLog $activityLog
     * @return Response
     */
    public function show(ActivityLog $activityLog): Response
    {
        $activityLog->load('user');
        
        return Inertia::render('Admin/ActivityLogs/Show', [
            'activityLog' => $activityLog,
        ]);
    }
}