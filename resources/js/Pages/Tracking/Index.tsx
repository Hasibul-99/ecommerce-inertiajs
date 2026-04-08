import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { FiPackage, FiTruck, FiMapPin, FiClock, FiCheckCircle, FiAlertCircle, FiExternalLink, FiSearch } from 'react-icons/fi';

interface TrackingEvent {
    status: string;
    description: string;
    location: string | null;
    timestamp: string;
    timestamp_formatted: string;
    is_manual: boolean;
}

interface Shipment {
    id: number;
    tracking_number: string;
    carrier: string;
    carrier_name: string;
    method: string;
    status: string;
    status_label: string;
    shipped_at: string | null;
    shipped_at_iso: string | null;
    delivered_at: string | null;
    delivered_at_iso: string | null;
    last_update: string | null;
    last_update_iso: string | null;
    events: TrackingEvent[];
    vendor: {
        id: number;
        name: string;
    };
    order: {
        id: number;
        order_number: string;
    };
}

interface Props {
    trackingNumber: string;
    shipment: Shipment | null;
    trackingUrl: string | null;
    error: string | null;
}

export default function TrackingIndex({ trackingNumber: initialTrackingNumber, shipment: initialShipment, trackingUrl, error: initialError }: Props) {
    const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || '');
    const [shipment, setShipment] = useState<Shipment | null>(initialShipment);
    const [error, setError] = useState<string | null>(initialError);
    const [loading, setLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber.trim()) {
            return;
        }

        setLoading(true);
        router.visit(route('tracking.show', { tracking_number: trackingNumber.trim() }), {
            preserveState: false,
            onFinish: () => setLoading(false),
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
                return <FiCheckCircle className="text-green-600" size={24} />;
            case 'out_for_delivery':
                return <FiTruck className="text-blue-600" size={24} />;
            case 'in_transit':
                return <FiPackage className="text-blue-600" size={24} />;
            case 'exception':
                return <FiAlertCircle className="text-red-600" size={24} />;
            default:
                return <FiClock className="text-gray-600" size={24} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'out_for_delivery':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in_transit':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'exception':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <>
            <Head title="Track Shipment" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search Box */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Track Your Package</h1>
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Enter tracking number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !trackingNumber.trim()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                            >
                                <FiSearch size={20} />
                                {loading ? 'Searching...' : 'Track'}
                            </button>
                        </form>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                            <div className="flex items-center gap-3">
                                <FiAlertCircle className="text-red-600 flex-shrink-0" size={20} />
                                <p className="text-red-800">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Shipment Info */}
                    {shipment && (
                        <>
                            {/* Status Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(shipment.status)}
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{shipment.status_label}</h2>
                                            <p className="text-sm text-gray-500">Tracking #: {shipment.tracking_number}</p>
                                        </div>
                                    </div>
                                    {trackingUrl && shipment.carrier !== 'local' && (
                                        <a
                                            href={trackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <span className="text-sm font-medium">View on {shipment.carrier_name}</span>
                                            <FiExternalLink size={16} />
                                        </a>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Carrier</p>
                                        <p className="font-medium text-gray-900">{shipment.carrier_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Shipped</p>
                                        <p className="font-medium text-gray-900">{shipment.shipped_at || 'Pending'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                            {shipment.status === 'delivered' ? 'Delivered' : 'Last Update'}
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {shipment.delivered_at || shipment.last_update || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Vendor:</span>
                                        <span className="font-medium text-gray-900">{shipment.vendor.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-gray-600">Order Number:</span>
                                        <span className="font-medium text-gray-900">{shipment.order.order_number}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            {shipment.events && shipment.events.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Tracking History</h3>

                                    <div className="space-y-6">
                                        {shipment.events.map((event, index) => (
                                            <div key={index} className="flex gap-4">
                                                {/* Timeline Line */}
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={
                                                            'w-3 h-3 rounded-full ' +
                                                            (index === 0 ? 'bg-blue-600' : 'bg-gray-300')
                                                        }
                                                    />
                                                    {index < shipment.events.length - 1 && (
                                                        <div className="w-0.5 flex-1 bg-gray-300 mt-2" style={{ minHeight: '40px' }} />
                                                    )}
                                                </div>

                                                {/* Event Content */}
                                                <div className="flex-1 pb-6">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{event.description}</p>
                                                            {event.location && (
                                                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                                                                    <FiMapPin size={14} />
                                                                    <span>{event.location}</span>
                                                                </div>
                                                            )}
                                                            {event.is_manual && (
                                                                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                                                    Manual Entry
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-right ml-4 flex-shrink-0">
                                                            <p className="text-sm text-gray-500">{event.timestamp_formatted}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty State for No Events */}
                            {(!shipment.events || shipment.events.length === 0) && (
                                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                    <FiPackage className="mx-auto text-gray-400 mb-4" size={48} />
                                    <p className="text-gray-600">No tracking events available yet.</p>
                                    <p className="text-sm text-gray-500 mt-1">Please check back later for updates.</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Empty State - No Search Yet */}
                    {!shipment && !error && initialTrackingNumber && (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <FiSearch className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-600">Enter a tracking number to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
