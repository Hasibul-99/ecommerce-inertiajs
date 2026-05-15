import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import { PageProps } from '@/types';
import { FiUser, FiShoppingBag, FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface VendorData {
    id: number;
    business_name: string;
    slug: string;
    phone: string | null;
    status: string;
    commission_rate: number;
}

interface UserData {
    name: string;
    email: string;
}

interface Props extends PageProps {
    vendor: VendorData;
    user: UserData;
}

type TabKey = 'profile' | 'business';

export default function Settings({ auth, vendor, user }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>('profile');

    const form = useForm({
        name: user.name,
        email: user.email,
        phone: vendor.phone ?? '',
        description: '',
        address: '',
        logo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(route('vendor.settings.update'), {
            preserveScroll: true,
        });
    };

    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
        { key: 'profile', label: 'Profile', icon: <FiUser className="w-4 h-4" /> },
        { key: 'business', label: 'Business Info', icon: <FiShoppingBag className="w-4 h-4" /> },
    ];

    return (
        <VendorLayout user={auth.user} header="Settings">
            <div className="p-6 max-w-3xl mx-auto">

                {/* Page title */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your profile and business information</p>
                </div>

                {/* Status badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${
                    vendor.status === 'approved'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : vendor.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                    {vendor.status === 'approved'
                        ? <FiCheckCircle className="w-3.5 h-3.5" />
                        : <FiAlertCircle className="w-3.5 h-3.5" />}
                    Account {vendor.status}
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <nav className="flex gap-1 -mb-px">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                        {/* Profile tab */}
                        {activeTab === 'profile' && (
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.name}
                                            onChange={e => form.setData('name', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors"
                                        />
                                        {form.errors.name && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={form.data.email}
                                            onChange={e => form.setData('email', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors"
                                        />
                                        {form.errors.email && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={form.data.phone}
                                        onChange={e => form.setData('phone', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors"
                                    />
                                    {form.errors.phone && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Business tab */}
                        {activeTab === 'business' && (
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Business Name
                                        </label>
                                        <input
                                            type="text"
                                            value={vendor.business_name}
                                            disabled
                                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">Contact support to change business name</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Store URL Slug
                                        </label>
                                        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-brand-500">
                                            <span className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-gray-600 whitespace-nowrap">
                                                /store/
                                            </span>
                                            <input
                                                type="text"
                                                value={vendor.slug}
                                                disabled
                                                className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Business Description
                                    </label>
                                    <textarea
                                        value={form.data.description}
                                        onChange={e => form.setData('description', e.target.value)}
                                        rows={4}
                                        placeholder="Tell customers about your business..."
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Business Address
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.address}
                                        onChange={e => form.setData('address', e.target.value)}
                                        placeholder="123 Main St, City, State 12345"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors"
                                    />
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Commission Rate</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Platform fee per sale</p>
                                        </div>
                                        <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                            {(vendor.commission_rate * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
                            {form.recentlySuccessful && (
                                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                                    <FiCheckCircle className="w-4 h-4" />
                                    Saved
                                </span>
                            )}
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-60 rounded-lg transition-colors"
                            >
                                <FiSave className="w-4 h-4" />
                                {form.processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </VendorLayout>
    );
}
