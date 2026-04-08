import React, { useState, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FiArrowLeft, FiSave, FiCreditCard } from 'react-icons/fi';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/Settings/TextInput';
import ToggleInput from '@/Components/Settings/ToggleInput';
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

export default function Payment({ auth, settings }: Props) {
    const [formData, setFormData] = useState<Record<string, any>>({
        cod_enabled: settings.cod_enabled?.value || false,
        cod_fee: settings.cod_fee?.value || 0,
        min_cod_amount: settings.min_cod_amount?.value || 0,
        max_cod_amount: settings.max_cod_amount?.value || 100000,
    });

    const [processing, setProcessing] = useState(false);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('admin.settings.update', 'payment'), formData, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    const formatCurrency = (value: number) => {
        return (value / 100).toFixed(2);
    };

    const parseCurrency = (value: string) => {
        return Math.round(parseFloat(value) * 100);
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Settings</h2>}>
            <Head title="Payment Settings" />

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
                            <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
                            <p className="mt-2 text-gray-600">
                                Configure payment methods and transaction options
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Available Payment Methods */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FiCreditCard className="mr-2" />
                                Available Payment Methods
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> Payment gateway integrations (Stripe, PayPal, etc.)
                                        are configured separately in your environment variables. This section only
                                        controls Cash on Delivery (COD) settings.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* COD Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Cash on Delivery (COD) Settings
                                </h2>
                            </div>

                            {/* Enable COD */}
                            <ToggleInput
                                label="Enable Cash on Delivery"
                                name="cod_enabled"
                                checked={formData.cod_enabled}
                                onChange={(checked) => handleChange('cod_enabled', checked)}
                                description={settings.cod_enabled?.description}
                            />

                            {formData.cod_enabled && (
                                <>
                                    <div className="border-t border-gray-200 pt-6" />

                                    {/* COD Fee */}
                                    <TextInput
                                        label="COD Handling Fee"
                                        name="cod_fee"
                                        type="number"
                                        value={formatCurrency(formData.cod_fee)}
                                        onChange={(value) => handleChange('cod_fee', parseCurrency(value))}
                                        description="Additional fee charged for COD orders (in currency)"
                                        placeholder="0.00"
                                    />

                                    {/* Min COD Amount */}
                                    <TextInput
                                        label="Minimum COD Order Amount"
                                        name="min_cod_amount"
                                        type="number"
                                        value={formatCurrency(formData.min_cod_amount)}
                                        onChange={(value) => handleChange('min_cod_amount', parseCurrency(value))}
                                        description="Minimum order value required for COD payment option"
                                        placeholder="0.00"
                                    />

                                    {/* Max COD Amount */}
                                    <TextInput
                                        label="Maximum COD Order Amount"
                                        name="max_cod_amount"
                                        type="number"
                                        value={formatCurrency(formData.max_cod_amount)}
                                        onChange={(value) => handleChange('max_cod_amount', parseCurrency(value))}
                                        description="Maximum order value allowed for COD payment option"
                                        placeholder="1000.00"
                                    />

                                    {/* Summary */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                                            COD Configuration Summary
                                        </h3>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>
                                                <strong>Status:</strong>{' '}
                                                <span className={formData.cod_enabled ? 'text-green-600' : 'text-red-600'}>
                                                    {formData.cod_enabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                            </li>
                                            {formData.cod_enabled && (
                                                <>
                                                    <li>
                                                        <strong>Handling Fee:</strong> ${formatCurrency(formData.cod_fee)}
                                                    </li>
                                                    <li>
                                                        <strong>Order Range:</strong> ${formatCurrency(formData.min_cod_amount)} - ${formatCurrency(formData.max_cod_amount)}
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </>
                            )}
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
