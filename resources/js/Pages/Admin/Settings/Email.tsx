import React, { useState, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FiArrowLeft, FiSave, FiMail, FiSend } from 'react-icons/fi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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

export default function Email({ auth, settings }: Props) {
    const [formData, setFormData] = useState<Record<string, any>>({
        from_name: settings.from_name?.value || '',
        from_email: settings.from_email?.value || '',
        smtp_host: settings.smtp_host?.value || '',
        smtp_port: settings.smtp_port?.value || 587,
        smtp_username: settings.smtp_username?.value || '',
        smtp_password: settings.smtp_password?.value || '',
        smtp_encryption: settings.smtp_encryption?.value || 'tls',
    });

    const [testEmail, setTestEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('admin.settings.update', 'email'), formData, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    const handleTestEmail = () => {
        if (!testEmail) {
            alert('Please enter an email address to test');
            return;
        }

        setTestingEmail(true);

        router.post(
            route('admin.settings.email.test'),
            { email: testEmail },
            {
                onFinish: () => setTestingEmail(false),
                preserveScroll: true,
            }
        );
    };

    const encryptionOptions = [
        { value: 'tls', label: 'TLS' },
        { value: 'ssl', label: 'SSL' },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Email Settings" />

            <div className="min-h-screen bg-gray-50 py-8">
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
                            <h1 className="text-3xl font-bold text-gray-900">Email Settings</h1>
                            <p className="mt-2 text-gray-600">
                                Configure SMTP settings and email notifications
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Email Identity */}
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FiMail className="mr-2" />
                                    Email Identity
                                </h2>
                            </div>

                            {/* From Name */}
                            <TextInput
                                label="From Name"
                                name="from_name"
                                value={formData.from_name}
                                onChange={(value) => handleChange('from_name', value)}
                                description={settings.from_name?.description}
                                placeholder="My E-commerce Store"
                                required
                            />

                            {/* From Email */}
                            <TextInput
                                label="From Email Address"
                                name="from_email"
                                type="email"
                                value={formData.from_email}
                                onChange={(value) => handleChange('from_email', value)}
                                description={settings.from_email?.description}
                                placeholder="noreply@example.com"
                                required
                            />
                        </div>

                        {/* SMTP Configuration */}
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    SMTP Configuration
                                </h2>
                            </div>

                            {/* SMTP Host */}
                            <TextInput
                                label="SMTP Host"
                                name="smtp_host"
                                value={formData.smtp_host}
                                onChange={(value) => handleChange('smtp_host', value)}
                                description={settings.smtp_host?.description}
                                placeholder="smtp.example.com"
                                required
                            />

                            {/* SMTP Port */}
                            <TextInput
                                label="SMTP Port"
                                name="smtp_port"
                                type="number"
                                value={formData.smtp_port}
                                onChange={(value) => handleChange('smtp_port', parseInt(value))}
                                description={settings.smtp_port?.description}
                                placeholder="587"
                                required
                            />

                            {/* SMTP Username */}
                            <TextInput
                                label="SMTP Username"
                                name="smtp_username"
                                value={formData.smtp_username}
                                onChange={(value) => handleChange('smtp_username', value)}
                                description={settings.smtp_username?.description}
                                placeholder="username@example.com"
                            />

                            {/* SMTP Password */}
                            <TextInput
                                label="SMTP Password"
                                name="smtp_password"
                                type="password"
                                value={formData.smtp_password}
                                onChange={(value) => handleChange('smtp_password', value)}
                                description={settings.smtp_password?.description}
                                placeholder="Enter SMTP password"
                            />

                            {/* SMTP Encryption */}
                            <SelectInput
                                label="SMTP Encryption"
                                name="smtp_encryption"
                                value={formData.smtp_encryption}
                                onChange={(value) => handleChange('smtp_encryption', value)}
                                options={encryptionOptions}
                                description={settings.smtp_encryption?.description}
                                required
                            />

                            <div className="border-t border-gray-200 pt-6" />

                            {/* Test Email Section */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-800 mb-3">
                                    Test Email Configuration
                                </h3>
                                <p className="text-sm text-blue-700 mb-4">
                                    Send a test email to verify your SMTP configuration is working correctly.
                                    Make sure to save your settings before testing.
                                </p>
                                <div className="flex gap-3">
                                    <input
                                        type="email"
                                        value={testEmail}
                                        onChange={(e) => setTestEmail(e.target.value)}
                                        placeholder="recipient@example.com"
                                        className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleTestEmail}
                                        disabled={testingEmail}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FiSend className="mr-2" />
                                        {testingEmail ? 'Sending...' : 'Send Test'}
                                    </button>
                                </div>
                            </div>

                            {/* Configuration Tips */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                                    Configuration Tips
                                </h3>
                                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                                    <li>Most SMTP providers use port 587 for TLS</li>
                                    <li>Gmail users: Enable "App Passwords" in your Google account</li>
                                    <li>Consider using a dedicated transactional email service (SendGrid, Mailgun, etc.)</li>
                                    <li>Some hosts may block outbound SMTP on port 25</li>
                                </ul>
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
        </AuthenticatedLayout>
    );
}
