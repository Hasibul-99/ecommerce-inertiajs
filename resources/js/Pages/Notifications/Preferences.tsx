import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEventHandler } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

interface NotificationPreference {
    type: string;
    name: string;
    description: string;
    email_enabled: boolean;
    push_enabled: boolean;
}

interface Props extends PageProps {
    preferences: NotificationPreference[];
}

export default function Preferences({ auth, preferences }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        preferences: preferences,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('notifications.preferences.update'), {
            preserveScroll: true,
        });
    };

    const togglePreference = (index: number, channel: 'email_enabled' | 'push_enabled') => {
        const updatedPreferences = [...data.preferences];
        updatedPreferences[index][channel] = !updatedPreferences[index][channel];
        setData('preferences', updatedPreferences);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Notification Preferences
                </h2>
            }
        >
            <Head title="Notification Preferences" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    Choose how you want to receive notifications. You can customize notification preferences for each event type.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Table Header */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Notification Type
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        In-App
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {data.preferences.map((preference, index) => (
                                                    <tr key={preference.type} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {preference.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {preference.description}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                                checked={preference.email_enabled}
                                                                onChange={() => togglePreference(index, 'email_enabled')}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                                checked={preference.push_enabled}
                                                                onChange={() => togglePreference(index, 'push_enabled')}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Information Box */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-5 w-5 text-blue-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-blue-800">
                                                    About Notification Channels
                                                </h3>
                                                <div className="mt-2 text-sm text-blue-700">
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>
                                                            <strong>Email:</strong> Receive notifications via email to your registered email address
                                                        </li>
                                                        <li>
                                                            <strong>In-App:</strong> See notifications in the notification bell at the top of the page
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={processing}>
                                            Save Preferences
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
