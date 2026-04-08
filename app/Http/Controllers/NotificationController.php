<?php

namespace App\Http\Controllers;

use App\Models\NotificationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display all notifications for the authenticated user.
     */
    public function index()
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Get recent notifications for the notification bell.
     */
    public function recent()
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->take(10)
            ->get();

        $unreadCount = auth()->user()
            ->unreadNotifications()
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead($id)
    {
        $notification = auth()->user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Display notification preferences page.
     */
    public function preferences()
    {
        $notificationTypes = $this->getNotificationTypes();

        // Get user's current preferences
        $userPreferences = NotificationSetting::where('user_id', auth()->id())
            ->get()
            ->keyBy('notification_type');

        // Fill in defaults for types without saved preferences
        $preferences = [];
        foreach ($notificationTypes as $type) {
            $saved = $userPreferences->get($type['type']);
            $preferences[] = [
                'type' => $type['type'],
                'name' => $type['name'],
                'description' => $type['description'],
                'email_enabled' => $saved ? $saved->email_enabled : true,
                'push_enabled' => $saved ? $saved->push_enabled : true,
            ];
        }

        return Inertia::render('Notifications/Preferences', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update notification preferences.
     */
    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'preferences' => 'required|array',
            'preferences.*.type' => 'required|string',
            'preferences.*.email_enabled' => 'boolean',
            'preferences.*.push_enabled' => 'boolean',
        ]);

        foreach ($validated['preferences'] as $preference) {
            NotificationSetting::updateOrCreate(
                [
                    'user_id' => auth()->id(),
                    'notification_type' => $preference['type'],
                ],
                [
                    'email_enabled' => $preference['email_enabled'] ?? false,
                    'push_enabled' => $preference['push_enabled'] ?? false,
                ]
            );
        }

        return redirect()
            ->back()
            ->with('success', 'Notification preferences updated successfully.');
    }

    /**
     * Get available notification types.
     */
    protected function getNotificationTypes(): array
    {
        return [
            [
                'type' => 'order_placed',
                'name' => 'Order Placed',
                'description' => 'When you place a new order',
            ],
            [
                'type' => 'order_confirmed',
                'name' => 'Order Confirmed',
                'description' => 'When your order is confirmed',
            ],
            [
                'type' => 'order_shipped',
                'name' => 'Order Shipped',
                'description' => 'When your order is shipped',
            ],
            [
                'type' => 'order_delivered',
                'name' => 'Order Delivered',
                'description' => 'When your order is delivered',
            ],
            [
                'type' => 'order_cancelled',
                'name' => 'Order Cancelled',
                'description' => 'When your order is cancelled',
            ],
            [
                'type' => 'vendor_new_order',
                'name' => 'New Order (Vendor)',
                'description' => 'When you receive a new order as a vendor',
            ],
            [
                'type' => 'vendor_payout_processed',
                'name' => 'Payout Processed (Vendor)',
                'description' => 'When your payout is processed',
            ],
            [
                'type' => 'password_reset',
                'name' => 'Password Reset',
                'description' => 'Password reset requests',
            ],
            [
                'type' => 'vendor_application_approved',
                'name' => 'Vendor Application Approved',
                'description' => 'When your vendor application is approved',
            ],
        ];
    }
}
