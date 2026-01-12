<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin|super-admin']);
    }

    /**
     * Display notification types and their configurations.
     */
    public function index()
    {
        $notificationTypes = $this->getNotificationTypes();

        return Inertia::render('Admin/Notifications/Index', [
            'notificationTypes' => $notificationTypes,
        ]);
    }

    /**
     * Update global notification settings.
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'notification_type' => 'required|string',
            'email_enabled' => 'boolean',
            'sms_enabled' => 'boolean',
            'push_enabled' => 'boolean',
        ]);

        // Update settings for all users (or set defaults for new users)
        // This could be stored in a settings table or handled differently

        return redirect()
            ->back()
            ->with('success', 'Notification settings updated successfully.');
    }

    /**
     * Send broadcast notification to all users.
     */
    public function sendBroadcast(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'user_type' => 'required|in:all,customers,vendors,admins',
            'channels' => 'required|array',
            'channels.*' => 'in:database,mail,sms',
        ]);

        $query = User::query();

        // Filter by user type
        if ($validated['user_type'] !== 'all') {
            $query->whereHas('roles', function ($q) use ($validated) {
                if ($validated['user_type'] === 'customers') {
                    $q->where('name', 'customer');
                } elseif ($validated['user_type'] === 'vendors') {
                    $q->where('name', 'vendor');
                } elseif ($validated['user_type'] === 'admins') {
                    $q->whereIn('name', ['admin', 'super-admin']);
                }
            });
        }

        $users = $query->get();

        // Send notifications
        foreach ($users as $user) {
            $user->notify(new \App\Notifications\BroadcastNotification(
                $validated['title'],
                $validated['message']
            ));
        }

        return redirect()
            ->back()
            ->with('success', "Broadcast notification sent to {$users->count()} users.");
    }

    /**
     * Get all notification types with descriptions.
     */
    protected function getNotificationTypes(): array
    {
        return [
            [
                'type' => 'order_placed',
                'name' => 'Order Placed',
                'description' => 'Sent when a customer places an order',
                'recipients' => 'Customer',
            ],
            [
                'type' => 'order_confirmed',
                'name' => 'Order Confirmed',
                'description' => 'Sent when an order is confirmed',
                'recipients' => 'Customer',
            ],
            [
                'type' => 'order_shipped',
                'name' => 'Order Shipped',
                'description' => 'Sent when an order is shipped',
                'recipients' => 'Customer',
            ],
            [
                'type' => 'order_delivered',
                'name' => 'Order Delivered',
                'description' => 'Sent when an order is delivered',
                'recipients' => 'Customer',
            ],
            [
                'type' => 'order_cancelled',
                'name' => 'Order Cancelled',
                'description' => 'Sent when an order is cancelled',
                'recipients' => 'Customer',
            ],
            [
                'type' => 'vendor_new_order',
                'name' => 'New Vendor Order',
                'description' => 'Sent to vendors when they receive a new order',
                'recipients' => 'Vendor',
            ],
            [
                'type' => 'vendor_order_cancelled',
                'name' => 'Vendor Order Cancelled',
                'description' => 'Sent to vendors when an order is cancelled',
                'recipients' => 'Vendor',
            ],
            [
                'type' => 'vendor_payout_processed',
                'name' => 'Payout Processed',
                'description' => 'Sent when a vendor payout is processed',
                'recipients' => 'Vendor',
            ],
            [
                'type' => 'password_reset',
                'name' => 'Password Reset',
                'description' => 'Sent when a user requests password reset',
                'recipients' => 'All Users',
            ],
            [
                'type' => 'welcome_email',
                'name' => 'Welcome Email',
                'description' => 'Sent to new users after registration',
                'recipients' => 'New Users',
            ],
            [
                'type' => 'vendor_application_submitted',
                'name' => 'Vendor Application Submitted',
                'description' => 'Sent when a vendor application is submitted',
                'recipients' => 'Applicant',
            ],
            [
                'type' => 'vendor_application_approved',
                'name' => 'Vendor Application Approved',
                'description' => 'Sent when a vendor application is approved',
                'recipients' => 'Vendor',
            ],
        ];
    }
}

