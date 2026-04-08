import { FiPackage, FiTruck, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

interface TrackingEvent {
    id: string;
    status: string;
    message: string;
    location: string;
    timestamp: string;
    type?: string;
    carrier?: string;
}

interface TrackingTimelineProps {
    events: TrackingEvent[];
}

export default function TrackingTimeline({ events }: TrackingTimelineProps) {
    const getStatusIcon = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('delivered')) return FiCheckCircle;
        if (statusLower.includes('transit') || statusLower.includes('shipped')) return FiTruck;
        if (statusLower.includes('pickup') || statusLower.includes('collected')) return FiMapPin;
        if (statusLower.includes('exception') || statusLower.includes('failed')) return FiAlertCircle;
        if (statusLower.includes('processing') || statusLower.includes('confirmed')) return FiClock;
        return FiPackage;
    };

    const getStatusColor = (status: string, index: number) => {
        const statusLower = status.toLowerCase();
        if (index === 0) return 'blue'; // Latest event is always blue
        if (statusLower.includes('delivered')) return 'green';
        if (statusLower.includes('exception') || statusLower.includes('failed')) return 'red';
        if (statusLower.includes('transit') || statusLower.includes('shipped')) return 'yellow';
        return 'gray';
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let relative = '';
        if (diffMins < 1) {
            relative = 'Just now';
        } else if (diffMins < 60) {
            relative = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            relative = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            relative = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }

        const formatted = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        return { formatted, relative };
    };

    if (!events || events.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tracking events available yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                    Tracking information will appear here once your order is processed.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiClock className="text-blue-600" />
                Tracking History
            </h2>

            <div className="space-y-6">
                {events.map((event, index) => {
                    const Icon = getStatusIcon(event.status);
                    const color = getStatusColor(event.status, index);
                    const { formatted, relative } = formatTimestamp(event.timestamp);

                    const colorClasses = {
                        blue: {
                            bg: 'bg-blue-100',
                            text: 'text-blue-600',
                            border: 'border-blue-300',
                            ring: 'ring-blue-200',
                        },
                        green: {
                            bg: 'bg-green-100',
                            text: 'text-green-600',
                            border: 'border-green-300',
                            ring: 'ring-green-200',
                        },
                        yellow: {
                            bg: 'bg-yellow-100',
                            text: 'text-yellow-600',
                            border: 'border-yellow-300',
                            ring: 'ring-yellow-200',
                        },
                        red: {
                            bg: 'bg-red-100',
                            text: 'text-red-600',
                            border: 'border-red-300',
                            ring: 'ring-red-200',
                        },
                        gray: {
                            bg: 'bg-gray-100',
                            text: 'text-gray-600',
                            border: 'border-gray-300',
                            ring: 'ring-gray-200',
                        },
                    };

                    const classes = colorClasses[color as keyof typeof colorClasses] || colorClasses.gray;

                    return (
                        <div key={event.id} className="relative">
                            {/* Connecting Line */}
                            {index !== events.length - 1 && (
                                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                            )}

                            {/* Event Item */}
                            <div className={`flex gap-4 transition-all duration-300 ${
                                index === 0 ? 'transform scale-105' : ''
                            }`}>
                                {/* Icon */}
                                <div className="relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                        index === 0
                                            ? `${classes.bg} ${classes.border} ${classes.text} ring-4 ${classes.ring} animate-pulse`
                                            : `${classes.bg} ${classes.text}`
                                    }`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="flex-1 pb-6">
                                    <div className={`${
                                        index === 0 ? 'bg-blue-50 border border-blue-100 rounded-lg p-4' : ''
                                    }`}>
                                        {/* Status & Time */}
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="flex-1">
                                                <h3 className={`font-semibold ${
                                                    index === 0 ? 'text-gray-900 text-lg' : 'text-gray-800'
                                                }`}>
                                                    {event.message}
                                                </h3>
                                                {index === 0 && relative && (
                                                    <p className="text-sm text-blue-600 font-medium mt-1">
                                                        {relative}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm ${
                                                    index === 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                                                }`}>
                                                    {formatted}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-2 text-gray-600 mt-2">
                                            <FiMapPin className="w-4 h-4" />
                                            <span className="text-sm">{event.location}</span>
                                        </div>

                                        {/* Carrier Badge */}
                                        {event.carrier && (
                                            <div className="mt-2">
                                                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                                                    {event.carrier.toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    Tracking information is updated automatically from our shipping partners.
                    Please allow up to 24 hours for new shipments to appear in the system.
                </p>
            </div>
        </div>
    );
}
