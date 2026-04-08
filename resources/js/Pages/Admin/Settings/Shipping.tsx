import React, { useState, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FiArrowLeft, FiSave, FiTruck } from 'react-icons/fi';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/Settings/TextInput';
import SelectInput from '@/Components/Settings/SelectInput';
import { PageProps } from '@/types';

interface SettingValue {
    key: string;
    value: any;
    type: string;
    description: string;
}

interface Settings {
    [key: string]: SettingValue;
}

interface Props extends PageProps {
    settings: Settings;
}

export default function Shipping({ auth, settings }: Props) {
    const [formData, setFormData] = useState<Record<string, any>>({
        default_carrier: settings.default_carrier?.value || 'standard',
        free_shipping_threshold: settings.free_shipping_threshold?.value || 10000,
        handling_time: settings.handling_time?.value || 2,
        default_weight_unit: settings.default_weight_unit?.value || 'kg',
    });

    const [processing, setProcessing] = useState(false);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('admin.settings.update', 'shipping'), formData, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    const carrierOptions = [
        { value: 'standard', label: 'Standard Shipping' },
        { value: 'express', label: 'Express Shipping' },
        { value: 'overnight', label: 'Overnight Delivery' },
        { value: 'fedex', label: 'FedEx' },
        { value: 'ups', label: 'UPS' },
        { value: 'usps', label: 'USPS' },
        { value: 'dhl', label: 'DHL' },
    ];

    const weightUnitOptions = [
        { value: 'kg', label: 'Kilograms (kg)' },
        { value: 'g', label: 'Grams (g)' },
        { value: 'lb', label: 'Pounds (lb)' },
        { value: 'oz', label: 'Ounces (oz)' },
    ];

    const formatCurrency = (value: number) => {
        return (value / 100).toFixed(2);
    };

    const parseCurrency = (value: string) => {
        return Math.round(parseFloat(value) * 100);
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Settings</h2>}>
            <Head title="Shipping Settings" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link
                                href={route('admin.settings.index')}
                                className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
                            >
                                <FiArrowLeft className="mr-2" />
                                Back to Settings
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">Shipping Settings</h1>
                            <p className="mt-2 text-gray-600">
                                Configure shipping options and delivery preferences
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FiTruck className="mr-2" />
                                    Shipping Configuration
                                </h2>
                            </div>

                            {/* Default Carrier */}
                            <SelectInput
                                label="Default Shipping Carrier"
                                name="default_carrier"
                                value={formData.default_carrier}
                                onChange={(value) => handleChange('default_carrier', value)}
                                options={carrierOptions}
                                description={settings.default_carrier?.description}
                            />

                            {/* Free Shipping Threshold */}
                            <TextInput
                                label="Free Shipping Threshold"
                                name="free_shipping_threshold"
                                type="number"
                                value={formatCurrency(formData.free_shipping_threshold)}
                                onChange={(value) => handleChange('free_shipping_threshold', parseCurrency(value))}
                                description="Order amount above which shipping is free (in currency)"
                                placeholder="100.00"
                            />

                            {/* Handling Time */}
                            <TextInput
                                label="Default Handling Time"
                                name="handling_time"
                                type="number"
                                value={formData.handling_time}
                                onChange={(value) => handleChange('handling_time', parseInt(value))}
                                description={settings.handling_time?.description}
                                placeholder="2"
                            />

                            {/* Default Weight Unit */}
                            <SelectInput
                                label="Default Weight Unit"
                                name="default_weight_unit"
                                value={formData.default_weight_unit}
                                onChange={(value) => handleChange('default_weight_unit', value)}
                                options={weightUnitOptions}
                                description={settings.default_weight_unit?.description}
                            />

                            <div className="border-t border-gray-200 pt-6" />

                            {/* Info Section */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">
                                    Shipping Configuration Summary
                                </h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>
                                        <strong>Default Carrier:</strong>{' '}
                                        {carrierOptions.find(c => c.value === formData.default_carrier)?.label || 'Not set'}
                                    </li>
                                    <li>
                                        <strong>Free Shipping Above:</strong> ${formatCurrency(formData.free_shipping_threshold)}
                                    </li>
                                    <li>
                                        <strong>Processing Time:</strong> {formData.handling_time} business days
                                    </li>
                                    <li>
                                        <strong>Weight Unit:</strong>{' '}
                                        {weightUnitOptions.find(w => w.value === formData.default_weight_unit)?.label || 'Not set'}
                                    </li>
                                </ul>
                            </div>

                            {/* Additional Note */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Vendor-specific shipping methods and rates can be configured
                                    separately. These settings apply as defaults when vendor-specific rates are not available.
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex items-center justify-end space-x-4">
                            <Link
                                href={route('admin.settings.index')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiSave className="mr-2" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
