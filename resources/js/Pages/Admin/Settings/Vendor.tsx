import React, { useState, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FiArrowLeft, FiSave, FiUsers } from 'react-icons/fi';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/Settings/TextInput';
import ToggleInput from '@/Components/Settings/ToggleInput';
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

export default function Vendor({ auth, settings }: Props) {
    const [formData, setFormData] = useState<Record<string, any>>({
        commission_rate: settings.commission_rate?.value || 10,
        min_payout: settings.min_payout?.value || 5000,
        payout_schedule: settings.payout_schedule?.value || 'monthly',
        auto_approve: settings.auto_approve?.value || false,
        require_verification: settings.require_verification?.value || true,
    });

    const [processing, setProcessing] = useState(false);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('admin.settings.update', 'vendor'), formData, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    const payoutScheduleOptions = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly (Every 2 weeks)' },
        { value: 'monthly', label: 'Monthly' },
    ];

    const formatCurrency = (value: number) => {
        return (value / 100).toFixed(2);
    };

    const parseCurrency = (value: string) => {
        return Math.round(parseFloat(value) * 100);
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Settings</h2>}>
            <Head title="Vendor Settings" />

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
                            <h1 className="text-3xl font-bold text-gray-900">Vendor Settings</h1>
                            <p className="mt-2 text-gray-600">
                                Configure vendor policies, commission rates, and payout schedules
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Commission Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FiUsers className="mr-2" />
                                    Commission Configuration
                                </h2>
                            </div>

                            {/* Commission Rate */}
                            <TextInput
                                label="Default Commission Rate"
                                name="commission_rate"
                                type="number"
                                value={formData.commission_rate}
                                onChange={(value) => handleChange('commission_rate', parseInt(value))}
                                description={settings.commission_rate?.description}
                                placeholder="10"
                                required
                            />

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> The commission rate is the percentage of each sale
                                    that the platform retains. For example, with a 10% commission rate on a $100 sale,
                                    the platform earns $10 and the vendor receives $90.
                                </p>
                            </div>
                        </div>

                        {/* Payout Settings */}
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Payout Configuration
                                </h2>
                            </div>

                            {/* Min Payout */}
                            <TextInput
                                label="Minimum Payout Amount"
                                name="min_payout"
                                type="number"
                                value={formatCurrency(formData.min_payout)}
                                onChange={(value) => handleChange('min_payout', parseCurrency(value))}
                                description="Vendors must reach this amount before requesting a payout"
                                placeholder="50.00"
                                required
                            />

                            {/* Payout Schedule */}
                            <SelectInput
                                label="Default Payout Schedule"
                                name="payout_schedule"
                                value={formData.payout_schedule}
                                onChange={(value) => handleChange('payout_schedule', value)}
                                options={payoutScheduleOptions}
                                description={settings.payout_schedule?.description}
                                required
                            />

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Current Configuration:</strong> Vendors can request payouts when their balance
                                    reaches ${formatCurrency(formData.min_payout)} or higher. The default payout schedule
                                    is {payoutScheduleOptions.find(o => o.value === formData.payout_schedule)?.label.toLowerCase()}.
                                </p>
                            </div>
                        </div>

                        {/* Vendor Policies */}
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Vendor Policies
                                </h2>
                            </div>

                            {/* Auto Approve */}
                            <ToggleInput
                                label="Auto-Approve Vendor Applications"
                                name="auto_approve"
                                checked={formData.auto_approve}
                                onChange={(checked) => handleChange('auto_approve', checked)}
                                description={settings.auto_approve?.description}
                            />

                            {/* Require Verification */}
                            <ToggleInput
                                label="Require Vendor Verification"
                                name="require_verification"
                                checked={formData.require_verification}
                                onChange={(checked) => handleChange('require_verification', checked)}
                                description={settings.require_verification?.description}
                            />

                            <div className="border-t border-gray-200 pt-6" />

                            {/* Policy Summary */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    Vendor Policy Summary
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>
                                        <strong>Commission Rate:</strong> {formData.commission_rate}%
                                    </li>
                                    <li>
                                        <strong>Minimum Payout:</strong> ${formatCurrency(formData.min_payout)}
                                    </li>
                                    <li>
                                        <strong>Payout Schedule:</strong>{' '}
                                        {payoutScheduleOptions.find(o => o.value === formData.payout_schedule)?.label}
                                    </li>
                                    <li>
                                        <strong>Auto-Approve Applications:</strong>{' '}
                                        <span className={formData.auto_approve ? 'text-green-600' : 'text-red-600'}>
                                            {formData.auto_approve ? 'Yes' : 'No'}
                                        </span>
                                    </li>
                                    <li>
                                        <strong>Verification Required:</strong>{' '}
                                        <span className={formData.require_verification ? 'text-green-600' : 'text-red-600'}>
                                            {formData.require_verification ? 'Yes' : 'No'}
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Important Note */}
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <p className="text-sm text-orange-800">
                                    <strong>Important:</strong> Changes to commission rates only affect new sales.
                                    Existing orders retain their original commission rates. Individual vendor
                                    commission rates can be overridden in the vendor management section.
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
