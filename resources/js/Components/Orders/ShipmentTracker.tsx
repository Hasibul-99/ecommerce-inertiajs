import React from 'react';
import { FiPackage, FiTruck, FiMapPin, FiCheckCircle, FiAlertCircle, FiExternalLink } from 'react-icons/fi';

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
    status: string;
    status_label: string;
    shipped_at: string | null;
    delivered_at: string | null;
    last_update: string | null;
    events: TrackingEvent[];
}

interface Props {
    shipment: Shipment;
    trackingUrl?: string;
    compact?: boolean;
}

export default function ShipmentTracker({ shipment, trackingUrl, compact = false }: Props) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
                return <FiCheckCircle className="text-green-600" size={20} />;
            case 'out_for_delivery':
                return <FiTruck className="text-blue-600" size={20} />;
            case 'in_transit':
                return <FiPackage className="text-blue-600" size={20} />;
            case 'exception':
                return <FiAlertCircle className="text-red-600" size={20} />;
            default:
                return <FiPackage className="text-gray-600" size={20} />;
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

    if (compact) {
        // Compact view for order list pages
        return (
            <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(shipment.status)}
                        <span className="font-medium text-gray-900">{shipment.status_label}</span>
                    </div>
                    {trackingUrl && (
                        <a
                            href={trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                            Track
                            <FiExternalLink size={14} />
                        </a>
                    )}
                </div>

                <div className="text-sm text-gray-600">
                    <p>
                        <span className="font-medium">Tracking:</span> {shipment.tracking_number}
                    </p>
                    <p>
                        <span className="font-medium">Carrier:</span> {shipment.carrier_name}
                    </p>
                    {shipment.shipped_at && (
                        <p>
                            <span className="font-medium">Shipped:</span> {shipment.shipped_at}
                        </p>
                    )}
                    {shipment.delivered_at && (
                        <p>
                            <span className="font-medium">Delivered:</span> {shipment.delivered_at}
                        </p>
                    )}
                </div>

                {/* Latest Event Only in Compact Mode */}
                {shipment.events && shipment.events.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Latest Update</p>
                        <p className="text-sm text-gray-900">{shipment.events[0].description}</p>
                        {shipment.events[0].location && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                                <FiMapPin size={12} />
                                <span>{shipment.events[0].location}</span>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{shipment.events[0].timestamp_formatted}</p>
                    </div>
                )}
            </div>
        );
    }

    // Full view for order detail pages
    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {getStatusIcon(shipment.status)}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{shipment.status_label}</h3>
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
                            <span className="text-sm font-medium">Track on {shipment.carrier_name}</span>
                            <FiExternalLink size={16} />
                        </a>
                    )}
                </div>

                {/* Shipment Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
                        <p className="font-medium text-gray-900">{shipment.delivered_at || shipment.last_update || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Tracking Timeline */}
            {shipment.events && shipment.events.length > 0 && (
                <div className="p-6">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Tracking History</h4>

                    <div className="space-y-4">
                        {shipment.events.map((event, index) => (
                            <div key={index} className="flex gap-3">
                                {/* Timeline Indicator */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={'w-2.5 h-2.5 rounded-full ' + (index === 0 ? 'bg-blue-600' : 'bg-gray-300')}
                                    />
                                    {index < shipment.events.length - 1 && (
                                        <div className="w-0.5 flex-1 bg-gray-300 mt-1" style={{ minHeight: '30px' }} />
                                    )}
                                </div>

                                {/* Event Details */}
                                <div className="flex-1 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">{event.description}</p>
                                            {event.location && (
                                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                                                    <FiMapPin size={12} />
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
                                            <p className="text-xs text-gray-500">{event.timestamp_formatted}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!shipment.events || shipment.events.length === 0) && (
                <div className="p-12 text-center">
                    <FiPackage className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-gray-600 text-sm">No tracking events available yet</p>
                    <p className="text-gray-500 text-xs mt-1">Check back later for updates</p>
                </div>
            )}
        </div>
    );
}
