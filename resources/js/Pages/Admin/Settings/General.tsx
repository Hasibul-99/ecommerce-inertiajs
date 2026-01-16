import React, { useState, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/Settings/TextInput';
import FileInput from '@/Components/Settings/FileInput';
import RichTextInput from '@/Components/Settings/RichTextInput';
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

export default function General({ auth, settings }: Props) {
    const [formData, setFormData] = useState<Record<string, any>>({
        site_name: settings.site_name?.value || '',
        contact_email: settings.contact_email?.value || '',
        contact_phone: settings.contact_phone?.value || '',
        address: settings.address?.value || '',
        currency: settings.currency?.value || 'USD',
        timezone: settings.timezone?.value || 'UTC',
    });

    const [files, setFiles] = useState<Record<string, File | null>>({
        site_logo: null,
        favicon: null,
    });

    const [processing, setProcessing] = useState(false);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (key: string, file: File | null) => {
        setFiles((prev) => ({ ...prev, [key]: file }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const submitData = new FormData();

        // Add regular form fields
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });

        // Add files
        Object.entries(files).forEach(([key, file]) => {
            if (file) {
                submitData.append(key, file);
            }
        });

        router.post(route('admin.settings.update', 'general'), submitData, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    const currencyOptions = [
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'GBP', label: 'British Pound (GBP)' },
        { value: 'JPY', label: 'Japanese Yen (JPY)' },
        { value: 'AUD', label: 'Australian Dollar (AUD)' },
        { value: 'CAD', label: 'Canadian Dollar (CAD)' },
        { value: 'INR', label: 'Indian Rupee (INR)' },
    ];

    const timezoneOptions = [
        { value: 'UTC', label: 'UTC' },
        { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
        { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
        { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
        { value: 'Europe/London', label: 'London' },
        { value: 'Europe/Paris', label: 'Paris' },
        { value: 'Asia/Tokyo', label: 'Tokyo' },
        { value: 'Asia/Shanghai', label: 'Shanghai' },
        { value: 'Asia/Kolkata', label: 'Kolkata' },
        { value: 'Australia/Sydney', label: 'Sydney' },
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    General Settings
                </h2>
            }
        >
            <Head title="General Settings" />

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
                            <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
                            <p className="mt-2 text-gray-600">
                                Configure your site information and general preferences
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            {/* Site Name */}
                            <TextInput
                                label="Site Name"
                                name="site_name"
                                value={formData.site_name}
                                onChange={(value) => handleChange('site_name', value)}
                                description={settings.site_name?.description}
                                placeholder="My E-commerce Store"
                                required
                            />

                            {/* Site Logo */}
                            <FileInput
                                label="Site Logo"
                                name="site_logo"
                                value={settings.site_logo?.value}
                                onChange={(file) => handleFileChange('site_logo', file)}
                                description={settings.site_logo?.description}
                                accept="image/*"
                                maxSize={2}
                                preview
                            />

                            {/* Favicon */}
                            <FileInput
                                label="Favicon"
                                name="favicon"
                                value={settings.favicon?.value}
                                onChange={(file) => handleFileChange('favicon', file)}
                                description={settings.favicon?.description}
                                accept="image/x-icon,image/png"
                                maxSize={1}
                                preview
                            />

                            <div className="border-t border-gray-200 pt-6" />

                            {/* Contact Email */}
                            <TextInput
                                label="Contact Email"
                                name="contact_email"
                                type="email"
                                value={formData.contact_email}
                                onChange={(value) => handleChange('contact_email', value)}
                                description={settings.contact_email?.description}
                                placeholder="contact@example.com"
                            />

                            {/* Contact Phone */}
                            <TextInput
                                label="Contact Phone"
                                name="contact_phone"
                                value={formData.contact_phone}
                                onChange={(value) => handleChange('contact_phone', value)}
                                description={settings.contact_phone?.description}
                                placeholder="+1-234-567-8900"
                            />

                            {/* Address */}
                            <RichTextInput
                                label="Business Address"
                                name="address"
                                value={formData.address}
                                onChange={(value) => handleChange('address', value)}
                                description={settings.address?.description}
                                placeholder="Enter your business address"
                                rows={3}
                            />

                            <div className="border-t border-gray-200 pt-6" />

                            {/* Currency */}
                            <SelectInput
                                label="Default Currency"
                                name="currency"
                                value={formData.currency}
                                onChange={(value) => handleChange('currency', value)}
                                options={currencyOptions}
                                description={settings.currency?.description}
                            />

                            {/* Timezone */}
                            <SelectInput
                                label="Default Timezone"
                                name="timezone"
                                value={formData.timezone}
                                onChange={(value) => handleChange('timezone', value)}
                                options={timezoneOptions}
                                description={settings.timezone?.description}
                            />
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
