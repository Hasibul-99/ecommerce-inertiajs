import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    FiSettings,
    FiDollarSign,
    FiTruck,
    FiMail,
    FiUsers,
    FiPercent,
    FiChevronRight,
} from 'react-icons/fi';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';

interface Props extends PageProps {
    groups: string[];
}

export default function Index({ auth, groups }: Props) {
    const settingsGroups = [
        {
            name: 'general',
            label: 'General Settings',
            description: 'Site name, logo, contact information, and general configuration',
            icon: FiSettings,
            color: 'blue',
        },
        {
            name: 'payment',
            label: 'Payment Settings',
            description: 'Configure payment methods, COD settings, and transaction options',
            icon: FiDollarSign,
            color: 'green',
        },
        {
            name: 'shipping',
            label: 'Shipping Settings',
            description: 'Default shipping options, carriers, and delivery configuration',
            icon: FiTruck,
            color: 'purple',
        },
        {
            name: 'email',
            label: 'Email & SMTP Settings',
            description: 'Email configuration, SMTP settings, and notification preferences',
            icon: FiMail,
            color: 'red',
        },
        {
            name: 'vendor',
            label: 'Vendor Settings',
            description: 'Vendor commission, payout schedules, and vendor policies',
            icon: FiUsers,
            color: 'yellow',
        },
        {
            name: 'tax',
            label: 'Tax Settings',
            description: 'Tax configuration, rates, and tax calculation settings',
            icon: FiPercent,
            color: 'indigo',
        },
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; icon: string; hover: string }> = {
            blue: {
                bg: 'bg-blue-100',
                icon: 'text-blue-600',
                hover: 'hover:bg-blue-50',
            },
            green: {
                bg: 'bg-green-100',
                icon: 'text-green-600',
                hover: 'hover:bg-green-50',
            },
            purple: {
                bg: 'bg-purple-100',
                icon: 'text-purple-600',
                hover: 'hover:bg-purple-50',
            },
            red: {
                bg: 'bg-red-100',
                icon: 'text-red-600',
                hover: 'hover:bg-red-50',
            },
            yellow: {
                bg: 'bg-yellow-100',
                icon: 'text-yellow-600',
                hover: 'hover:bg-yellow-50',
            },
            indigo: {
                bg: 'bg-indigo-100',
                icon: 'text-indigo-600',
                hover: 'hover:bg-indigo-50',
            },
        };
        return colors[color] || colors.blue;
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Settings
                </h2>
            }
        >
            <Head title="Settings" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="mt-2 text-gray-600">
                            Manage your platform configuration and preferences
                        </p>
                    </div>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {settingsGroups.map((group) => {
                            const Icon = group.icon;
                            const colors = getColorClasses(group.color);

                            return (
                                <Link
                                    key={group.name}
                                    href={route(`admin.settings.${group.name}`)}
                                    className={`block bg-white rounded-lg shadow-sm p-6 transition-all ${colors.hover} border border-gray-200 hover:shadow-md`}
                                >
                                    <div className="flex items-start">
                                        <div className={`p-3 rounded-lg ${colors.bg}`}>
                                            <Icon className={`${colors.icon}`} size={24} />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {group.label}
                                                </h3>
                                                <FiChevronRight className="text-gray-400" size={20} />
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {group.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Info Section */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiSettings className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Configuration Tips
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Settings are cached for performance - changes take effect immediately</li>
                                        <li>Some settings may require application restart to apply fully</li>
                                        <li>Test email configuration before making it live</li>
                                        <li>Vendor commission rates affect all vendors unless individually overridden</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
