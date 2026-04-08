import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import { FiTruck, FiClock, FiDollarSign, FiCheck, FiX, FiInfo } from 'react-icons/fi';

interface ShippingMethod {
    id: number;
    name: string;
    description: string;
    carrier: string;
    type: string;
    estimated_days_min: number;
    estimated_days_max: number;
    is_enabled: boolean;
    custom_rate_cents: number | null;
    handling_time_days: number;
    vendor_config_id: number | null;
}

interface Props {
    shippingMethods: ShippingMethod[];
    vendor: any;
}

export default function Shipping({ shippingMethods, vendor }: Props) {
    const [editingMethod, setEditingMethod] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        methods: shippingMethods.map(method => ({
            shipping_method_id: method.id,
            is_enabled: method.is_enabled,
            custom_rate_cents: method.custom_rate_cents,
            handling_time_days: method.handling_time_days,
        })),
    });

    const handleToggle = (methodId: number) => {
        setData('methods', data.methods.map(m =>
            m.shipping_method_id === methodId
                ? { ...m, is_enabled: !m.is_enabled }
                : m
        ));
    };

    const handleCustomRateChange = (methodId: number, value: string) => {
        const cents = value ? Math.round(parseFloat(value) * 100) : null;
        setData('methods', data.methods.map(m =>
            m.shipping_method_id === methodId
                ? { ...m, custom_rate_cents: cents }
                : m
        ));
    };

    const handleHandlingTimeChange = (methodId: number, value: number) => {
        setData('methods', data.methods.map(m =>
            m.shipping_method_id === methodId
                ? { ...m, handling_time_days: value }
                : m
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.shipping.update'), {
            onSuccess: () => {
                setEditingMethod(null);
            },
        });
    };

    const getMethodIcon = (type: string) => {
        switch (type) {
            case 'express':
                return '🚀';
            case 'overnight':
                return '⚡';
            case 'standard':
                return '📦';
            case 'free':
                return '🎁';
            default:
                return '🚚';
        }
    };

    const getMethodData = (methodId: number) => {
        return data.methods.find(m => m.shipping_method_id === methodId);
    };

    return (
        <VendorLayout>
            <Head title="Shipping Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Shipping Settings</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Configure your shipping methods, rates, and handling times
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <FiInfo className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">About Shipping Configuration</p>
                            <p className="mt-1">
                                Enable shipping methods for your products. You can set custom rates or use platform rates.
                                Handling time is added to the shipping method's delivery estimate.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {shippingMethods.map((method) => {
                                const methodData = getMethodData(method.id);
                                const isEnabled = methodData?.is_enabled || false;

                                return (
                                    <div
                                        key={method.id}
                                        className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                                            isEnabled ? 'border-green-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="p-6">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="text-3xl">{getMethodIcon(method.type)}</div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {method.name}
                                                            </h3>
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                                                                {method.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                            {method.carrier && (
                                                                <div className="flex items-center gap-1">
                                                                    <FiTruck size={14} />
                                                                    <span>{method.carrier}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-1">
                                                                <FiClock size={14} />
                                                                <span>
                                                                    {method.estimated_days_min === method.estimated_days_max
                                                                        ? `${method.estimated_days_min} day${method.estimated_days_min > 1 ? 's' : ''}`
                                                                        : `${method.estimated_days_min}-${method.estimated_days_max} days`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Toggle */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(method.id)}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                        isEnabled ? 'bg-green-600' : 'bg-gray-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                            isEnabled ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Configuration (shown when enabled) */}
                                            {isEnabled && (
                                                <div className="border-t border-gray-200 pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Custom Rate */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Custom Shipping Rate (Optional)
                                                        </label>
                                                        <div className="relative">
                                                            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={methodData?.custom_rate_cents ? (methodData.custom_rate_cents / 100).toFixed(2) : ''}
                                                                onChange={(e) => handleCustomRateChange(method.id, e.target.value)}
                                                                placeholder="Use platform rate"
                                                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Leave empty to use platform's default rates
                                                        </p>
                                                    </div>

                                                    {/* Handling Time */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Handling Time (days)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="30"
                                                            value={methodData?.handling_time_days || 2}
                                                            onChange={(e) => handleHandlingTimeChange(method.id, parseInt(e.target.value))}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Time needed to prepare and ship the order
                                                        </p>
                                                    </div>

                                                    {/* Estimated Total Delivery */}
                                                    <div className="md:col-span-2 bg-gray-50 rounded-lg p-3">
                                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                                            Estimated Total Delivery Time
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {(methodData?.handling_time_days || 2) + method.estimated_days_min} -{' '}
                                                            {(methodData?.handling_time_days || 2) + method.estimated_days_max} days
                                                            <span className="text-gray-500 ml-2">
                                                                (Handling: {methodData?.handling_time_days || 2} days + Shipping: {method.estimated_days_min}-{method.estimated_days_max} days)
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Save Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {processing ? 'Saving...' : 'Save Shipping Settings'}
                            </button>
                        </div>
                    </form>

                    {/* Help Section */}
                    <div className="mt-8 bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div>
                                <p className="font-medium text-gray-900">How does shipping work?</p>
                                <p>When a customer orders your products, they'll choose from the shipping methods you've enabled. The total delivery time includes your handling time plus the carrier's shipping time.</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Custom rates vs. platform rates</p>
                                <p>You can set custom flat rates for each shipping method, or leave it empty to use the platform's calculated rates based on weight and destination.</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Handling time</p>
                                <p>This is the time you need to process, pack, and hand over the package to the carrier. Be realistic to maintain good customer satisfaction.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
}
