import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEventHandler, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

interface NotificationType {
    type: string;
    name: string;
    description: string;
    recipients: string;
}

interface Props extends PageProps {
    notificationTypes: NotificationType[];
}

export default function Index({ auth, notificationTypes }: Props) {
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        message: '',
        user_type: 'all',
        channels: ['database'] as string[],
    });

    const handleBroadcast: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.notifications.broadcast'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowBroadcastModal(false);
            },
        });
    };

    const toggleChannel = (channel: string) => {
        if (data.channels.includes(channel)) {
            setData('channels', data.channels.filter((c) => c !== channel));
        } else {
            setData('channels', [...data.channels, channel]);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Notifications Management
                    </h2>
                    <PrimaryButton onClick={() => setShowBroadcastModal(true)}>
                        Send Broadcast
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Notification Types Overview */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Notification Types
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Below are all the automatic notifications sent by the system. Users can configure their preferences for each type.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notificationTypes.map((type) => (
                                    <div
                                        key={type.type}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-gray-900">{type.name}</h4>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {type.recipients}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{type.description}</p>
                                        <p className="text-xs text-gray-400 mt-2 font-mono">{type.type}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Broadcast History could go here */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Broadcast Notifications
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Send one-time notifications to groups of users. Click "Send Broadcast" to create a new broadcast message.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500">
                                    Broadcast history will appear here
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Broadcast Modal */}
            {showBroadcastModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Send Broadcast Notification</h3>
                            <button
                                onClick={() => setShowBroadcastModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleBroadcast} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="title" value="Title" />
                                <TextInput
                                    id="title"
                                    className="mt-1 block w-full"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    placeholder="Notification title"
                                />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div>
                                <InputLabel htmlFor="message" value="Message" />
                                <textarea
                                    id="message"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows={5}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                    placeholder="Your notification message"
                                />
                                <InputError className="mt-2" message={errors.message} />
                            </div>

                            <div>
                                <InputLabel htmlFor="user_type" value="Send To" />
                                <select
                                    id="user_type"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.user_type}
                                    onChange={(e) => setData('user_type', e.target.value)}
                                >
                                    <option value="all">All Users</option>
                                    <option value="customers">Customers Only</option>
                                    <option value="vendors">Vendors Only</option>
                                    <option value="admins">Admins Only</option>
                                </select>
                                <InputError className="mt-2" message={errors.user_type} />
                            </div>

                            <div>
                                <InputLabel value="Notification Channels" />
                                <div className="mt-2 space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            checked={data.channels.includes('database')}
                                            onChange={() => toggleChannel('database')}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            In-App Notification
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            checked={data.channels.includes('mail')}
                                            onChange={() => toggleChannel('mail')}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Email
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            checked={data.channels.includes('sms')}
                                            onChange={() => toggleChannel('sms')}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            SMS
                                        </span>
                                    </label>
                                </div>
                                <InputError className="mt-2" message={errors.channels} />
                            </div>

                            <div className="flex gap-2">
                                <PrimaryButton disabled={processing || data.channels.length === 0}>
                                    {processing ? 'Sending...' : 'Send Broadcast'}
                                </PrimaryButton>
                                <SecondaryButton
                                    type="button"
                                    onClick={() => setShowBroadcastModal(false)}
                                >
                                    Cancel
                                </SecondaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
