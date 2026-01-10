import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FiPackage, FiTruck, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    weight: number | null;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    items: OrderItem[];
    total_weight: number;
}

interface ShippingAddress {
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

interface Carrier {
    value: string;
    label: string;
}

interface Props {
    order: Order;
    shipping_address: ShippingAddress | null;
    carriers: Carrier[];
}

export default function CreateShipment({ order, shipping_address, carriers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        shipping_carrier: 'local',
        shipping_method: 'standard',
        tracking_number: '',
        weight: order.total_weight || 0,
        dimensions: {
            length: 0,
            width: 0,
            height: 0,
        },
        shipping_cost_cents: 0,
        insurance_cents: 0,
        pickup_scheduled_at: '',
    });

    const [showDimensions, setShowDimensions] = useState(false);
    const [showInsurance, setShowInsurance] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.shipments.store', { order: order.id }));
    };

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    return (
        <>
            <Head title="Create Shipment" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Create Shipment</h1>
                        <p className="mt-2 text-gray-600">Create a shipment for order #{order.order_number}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Carrier Selection */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiTruck className="text-blue-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Carrier Information</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Shipping Carrier *
                                            </label>
                                            <select
                                                value={data.shipping_carrier}
                                                onChange={(e) => setData('shipping_carrier', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {carriers.map((carrier) => (
                                                    <option key={carrier.value} value={carrier.value}>
                                                        {carrier.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.shipping_carrier && (
                                                <p className="mt-1 text-sm text-red-600">{errors.shipping_carrier}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Shipping Method *
                                            </label>
                                            <select
                                                value={data.shipping_method}
                                                onChange={(e) => setData('shipping_method', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="standard">Standard</option>
                                                <option value="express">Express</option>
                                                <option value="overnight">Overnight</option>
                                                <option value="economy">Economy</option>
                                            </select>
                                            {errors.shipping_method && (
                                                <p className="mt-1 text-sm text-red-600">{errors.shipping_method}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tracking Number
                                                {data.shipping_carrier === 'local' && (
                                                    <span className="text-xs text-gray-500 ml-2">(Will be auto-generated if left blank)</span>
                                                )}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.tracking_number}
                                                onChange={(e) => setData('tracking_number', e.target.value)}
                                                placeholder="Enter tracking number"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {errors.tracking_number && (
                                                <p className="mt-1 text-sm text-red-600">{errors.tracking_number}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Package Details */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiPackage className="text-blue-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Weight (grams) *
                                            </label>
                                            <input
                                                type="number"
                                                value={data.weight}
                                                onChange={(e) => setData('weight', parseInt(e.target.value) || 0)}
                                                min="1"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                                        </div>

                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setShowDimensions(!showDimensions)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                {showDimensions ? 'Hide' : 'Add'} Dimensions (Optional)
                                            </button>

                                            {showDimensions && (
                                                <div className="grid grid-cols-3 gap-4 mt-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Length (cm)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={data.dimensions.length}
                                                            onChange={(e) =>
                                                                setData('dimensions', {
                                                                    ...data.dimensions,
                                                                    length: parseFloat(e.target.value) || 0,
                                                                })
                                                            }
                                                            min="0"
                                                            step="0.1"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Width (cm)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={data.dimensions.width}
                                                            onChange={(e) =>
                                                                setData('dimensions', {
                                                                    ...data.dimensions,
                                                                    width: parseFloat(e.target.value) || 0,
                                                                })
                                                            }
                                                            min="0"
                                                            step="0.1"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Height (cm)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={data.dimensions.height}
                                                            onChange={(e) =>
                                                                setData('dimensions', {
                                                                    ...data.dimensions,
                                                                    height: parseFloat(e.target.value) || 0,
                                                                })
                                                            }
                                                            min="0"
                                                            step="0.1"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Costs & Dates */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiDollarSign className="text-blue-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Costs & Scheduling</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Shipping Cost (USD)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.shipping_cost_cents / 100}
                                                onChange={(e) =>
                                                    setData('shipping_cost_cents', Math.round(parseFloat(e.target.value || '0') * 100))
                                                }
                                                min="0"
                                                step="0.01"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {errors.shipping_cost_cents && (
                                                <p className="mt-1 text-sm text-red-600">{errors.shipping_cost_cents}</p>
                                            )}
                                        </div>

                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setShowInsurance(!showInsurance)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                {showInsurance ? 'Remove' : 'Add'} Insurance (Optional)
                                            </button>

                                            {showInsurance && (
                                                <div className="mt-3">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Insurance Cost (USD)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={data.insurance_cents / 100}
                                                        onChange={(e) =>
                                                            setData(
                                                                'insurance_cents',
                                                                Math.round(parseFloat(e.target.value || '0') * 100)
                                                            )
                                                        }
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar size={16} />
                                                    Pickup Scheduled Date (Optional)
                                                </div>
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={data.pickup_scheduled_at}
                                                onChange={(e) => setData('pickup_scheduled_at', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {errors.pickup_scheduled_at && (
                                                <p className="mt-1 text-sm text-red-600">{errors.pickup_scheduled_at}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Creating...' : 'Create Shipment'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Sidebar - Order Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Number</p>
                                        <p className="font-medium text-gray-900">{order.order_number}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Items ({order.items.length})</p>
                                        <div className="space-y-2">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="text-sm">
                                                    <p className="font-medium text-gray-900">{item.product_name}</p>
                                                    <p className="text-gray-600">
                                                        Qty: {item.quantity}
                                                        {item.weight && ` • ${item.weight}g`}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {shipping_address && (
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FiMapPin size={14} className="text-gray-500" />
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Shipping Address</p>
                                            </div>
                                            <div className="text-sm text-gray-900">
                                                <p>{shipping_address.address_line1}</p>
                                                {shipping_address.address_line2 && <p>{shipping_address.address_line2}</p>}
                                                <p>
                                                    {shipping_address.city}, {shipping_address.state} {shipping_address.postal_code}
                                                </p>
                                                <p>{shipping_address.country}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
