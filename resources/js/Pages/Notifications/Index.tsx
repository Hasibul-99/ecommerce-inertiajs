import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Notification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        type?: string;
        action_url?: string;
    };
    read_at: string | null;
    created_at: string;
}

interface PaginatedNotifications {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props extends PageProps {
    notifications: PaginatedNotifications;
}

export default function Index({ auth, notifications }: Props) {
    const markAsRead = async (notificationId: string) => {
        try {
            await fetch(route('notifications.mark-as-read', notificationId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            router.reload({ only: ['notifications'] });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(route('notifications.mark-all-as-read'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            router.reload({ only: ['notifications'] });
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order':
                return '📦';
            case 'vendor':
                return '🏪';
            case 'payment':
                return '💳';
            case 'broadcast':
                return '📢';
            default:
                return '🔔';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`;

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = notifications.data.filter(n => !n.read_at).length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Notifications
                    </h2>
                    <Link
                        href={route('notifications.preferences')}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                        Preferences
                    </Link>
                </div>
            }
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        All Notifications
                                    </h3>
                                    {unreadCount > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="divide-y divide-gray-200">
                            {notifications.data.length === 0 ? (
                                <div className="p-12 text-center">
                                    <svg
                                        className="mx-auto h-16 w-16 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                    <p className="mt-4 text-lg text-gray-500">No notifications yet</p>
                                    <p className="mt-2 text-sm text-gray-400">
                                        When you receive notifications, they'll appear here.
                                    </p>
                                </div>
                            ) : (
                                notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-6 hover:bg-gray-50 cursor-pointer ${
                                            !notification.read_at ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => {
                                            if (!notification.read_at) {
                                                markAsRead(notification.id);
                                            }
                                        }}
                                    >
                                        <div className="flex items-start">
                                            <span className="text-3xl mr-4">
                                                {getNotificationIcon(notification.data.type || '')}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-base font-medium text-gray-900">
                                                            {notification.data.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {notification.data.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-3">
                                                            {formatDate(notification.created_at)}
                                                        </p>
                                                    </div>
                                                    {!notification.read_at && (
                                                        <span className="ml-4 w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></span>
                                                    )}
                                                </div>
                                                {notification.data.action_url && (
                                                    <Link
                                                        href={notification.data.action_url}
                                                        className="inline-flex items-center mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        View Details
                                                        <svg
                                                            className="ml-1 w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {notifications.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Showing {((notifications.current_page - 1) * notifications.per_page) + 1} to{' '}
                                        {Math.min(notifications.current_page * notifications.per_page, notifications.total)} of{' '}
                                        {notifications.total} notifications
                                    </div>
                                    <div className="flex gap-1">
                                        {notifications.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm rounded ${
                                                        link.active
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
