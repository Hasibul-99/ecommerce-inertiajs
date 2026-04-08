import { FiTruck, FiPackage, FiExternalLink, FiCopy, FiCheckCircle } from 'react-icons/fi';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShipmentItem {
    product_name: string;
    quantity: number;
    image: string | null;
}

interface Shipment {
    id: number;
    tracking_number: string;
    carrier: string;
    carrier_tracking_url: string;
    status: string;
    shipped_at: string | null;
    delivered_at: string | null;
    estimated_delivery_at: string | null;
    vendor: {
        id: number;
        name: string;
    };
    items: ShipmentItem[];
    progress_percentage: number;
}

interface ShipmentCardProps {
    shipment: Shipment;
}

export default function ShipmentCard({ shipment }: ShipmentCardProps) {
    const [copied, setCopied] = useState(false);

    const copyTrackingNumber = () => {
        navigator.clipboard.writeText(shipment.tracking_number);
        setCopied(true);
        toast.success('Tracking number copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusBadgeColor = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('delivered')) return 'bg-green-100 text-green-700 border-green-200';
        if (statusLower.includes('transit') || statusLower.includes('shipped')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (statusLower.includes('exception') || statusLower.includes('failed')) return 'bg-red-100 text-red-700 border-red-200';
        if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Pending';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiTruck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Shipped by {shipment.vendor.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {shipment.items.length} item{shipment.items.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(shipment.status)}`}>
                        {shipment.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="p-6">
                {/* Tracking Information */}
                <div className="mb-6">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                        Tracking Number
                    </label>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-900">
                            {shipment.tracking_number}
                        </code>
                        <button
                            onClick={copyTrackingNumber}
                            className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Copy tracking number"
                        >
                            {copied ? (
                                <FiCheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <FiCopy className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Carrier Information */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                            Carrier
                        </label>
                        <p className="font-semibold text-gray-900 capitalize">
                            {shipment.carrier}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                            Est. Delivery
                        </label>
                        <p className="font-semibold text-gray-900">
                            {formatDate(shipment.estimated_delivery_at)}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Delivery Progress
                        </label>
                        <span className="text-xs font-semibold text-blue-600">
                            {shipment.progress_percentage}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${shipment.progress_percentage}%` }}
                        />
                    </div>
                </div>

                {/* Items in Shipment */}
                <div className="mb-6">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
                        Items in this Shipment
                    </label>
                    <div className="space-y-2">
                        {shipment.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                        <FiPackage className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.product_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {shipment.carrier_tracking_url && shipment.carrier_tracking_url !== '#' && (
                        <a
                            href={shipment.carrier_tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <FiExternalLink className="w-4 h-4" />
                            Track with {shipment.carrier}
                        </a>
                    )}
                </div>

                {/* Delivery Date (if delivered) */}
                {shipment.delivered_at && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                            <FiCheckCircle className="w-5 h-5" />
                            <span className="font-medium">
                                Delivered on {formatDate(shipment.delivered_at)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
