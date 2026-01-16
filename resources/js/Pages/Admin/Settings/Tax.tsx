import React, { useState, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FiArrowLeft, FiSave, FiPercent } from 'react-icons/fi';
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

export default function Tax({ auth, settings }: Props) {
    const [formData, setFormData] = useState<Record<string, any>>({
        tax_enabled: settings.tax_enabled?.value || false,
        tax_rate: settings.tax_rate?.value || 0,
        tax_included_in_price: settings.tax_included_in_price?.value || false,
        tax_label: settings.tax_label?.value || 'VAT',
    });

    const [processing, setProcessing] = useState(false);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('admin.settings.update', 'tax'), formData, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    // Example calculation
    const calculateTaxExample = () => {
        const basePrice = 100;
        const taxAmount = formData.tax_enabled ? (basePrice * formData.tax_rate) / 100 : 0;
        const totalPrice = formData.tax_included_in_price ? basePrice : basePrice + taxAmount;

        return {
            basePrice,
            taxAmount,
            totalPrice,
        };
    };

    const example = calculateTaxExample();

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Settings</h2>}>
            <Head title="Tax Settings" />

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
                            <h1 className="text-3xl font-bold text-gray-900">Tax Settings</h1>
                            <p className="mt-2 text-gray-600">
                                Configure tax calculation and display preferences
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FiPercent className="mr-2" />
                                    Tax Configuration
                                </h2>
                            </div>

                            {/* Enable Tax */}
                            <ToggleInput
                                label="Enable Tax Calculation"
                                name="tax_enabled"
                                checked={formData.tax_enabled}
                                onChange={(checked) => handleChange('tax_enabled', checked)}
                                description={settings.tax_enabled?.description}
                            />

                            {formData.tax_enabled && (
                                <>
                                    <div className="border-t border-gray-200 pt-6" />

                                    {/* Tax Rate */}
                                    <TextInput
                                        label="Default Tax Rate"
                                        name="tax_rate"
                                        type="number"
                                        value={formData.tax_rate}
                                        onChange={(value) => handleChange('tax_rate', parseInt(value))}
                                        description={settings.tax_rate?.description}
                                        placeholder="10"
                                        required
                                    />

                                    {/* Tax Label */}
                                    <TextInput
                                        label="Tax Label"
                                        name="tax_label"
                                        value={formData.tax_label}
                                        onChange={(value) => handleChange('tax_label', value)}
                                        description={settings.tax_label?.description}
                                        placeholder="VAT, GST, Sales Tax, etc."
                                        required
                                    />

                                    {/* Tax Included in Price */}
                                    <ToggleInput
                                        label="Tax Included in Product Prices"
                                        name="tax_included_in_price"
                                        checked={formData.tax_included_in_price}
                                        onChange={(checked) => handleChange('tax_included_in_price', checked)}
                                        description={settings.tax_included_in_price?.description}
                                    />

                                    <div className="border-t border-gray-200 pt-6" />

                                    {/* Example Calculation */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-blue-800 mb-3">
                                            Example Tax Calculation
                                        </h3>
                                        <div className="space-y-2 text-sm text-blue-700">
                                            <div className="flex justify-between">
                                                <span>Product Price:</span>
                                                <span className="font-medium">${example.basePrice.toFixed(2)}</span>
                                            </div>
                                            {!formData.tax_included_in_price && (
                                                <div className="flex justify-between">
                                                    <span>{formData.tax_label} ({formData.tax_rate}%):</span>
                                                    <span className="font-medium">${example.taxAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between pt-2 border-t border-blue-300">
                                                <span className="font-semibold">Total:</span>
                                                <span className="font-semibold">${example.totalPrice.toFixed(2)}</span>
                                            </div>
                                            {formData.tax_included_in_price && (
                                                <p className="text-xs text-blue-600 mt-2">
                                                    (Includes {formData.tax_label} of ${example.taxAmount.toFixed(2)})
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Configuration Explanation */}
                                    <div className={`border rounded-lg p-4 ${
                                        formData.tax_included_in_price
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-yellow-50 border-yellow-200'
                                    }`}>
                                        <h3 className={`text-sm font-medium mb-2 ${
                                            formData.tax_included_in_price
                                                ? 'text-green-800'
                                                : 'text-yellow-800'
                                        }`}>
                                            {formData.tax_included_in_price
                                                ? 'Tax Inclusive Pricing'
                                                : 'Tax Exclusive Pricing'}
                                        </h3>
                                        <p className={`text-sm ${
                                            formData.tax_included_in_price
                                                ? 'text-green-700'
                                                : 'text-yellow-700'
                                        }`}>
                                            {formData.tax_included_in_price
                                                ? `Product prices shown to customers already include ${formData.tax_label}. The tax amount will be extracted from the total price during checkout.`
                                                : `${formData.tax_label} will be calculated and added to product prices during checkout. Customers will see the tax as a separate line item.`}
                                        </p>
                                    </div>

                                    {/* Important Notes */}
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-orange-800 mb-2">
                                            Important Notes
                                        </h3>
                                        <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                                            <li>Tax rates can vary by location. This is the default global rate.</li>
                                            <li>Consider implementing location-based tax rates for compliance.</li>
                                            <li>Changes affect new orders immediately but don't modify existing orders.</li>
                                            <li>Consult with a tax professional for proper tax configuration.</li>
                                        </ul>
                                    </div>
                                </>
                            )}

                            {!formData.tax_enabled && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">
                                        Tax calculation is currently disabled. Enable it above to configure tax settings.
                                    </p>
                                </div>
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
