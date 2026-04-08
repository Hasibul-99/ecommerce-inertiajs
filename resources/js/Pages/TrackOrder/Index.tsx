import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Button } from '@/Components/ui/button';
import {
    FiPackage,
    FiSearch,
    FiTruck,
    FiMapPin,
    FiMail,
    FiHash,
    FiClock,
    FiCheckCircle
} from 'react-icons/fi';
import { PageProps } from '@/types';

interface TrackOrderIndexProps extends PageProps {
    cartCount?: number;
    wishlistCount?: number;
}

export default function Index({ auth, cartCount = 0, wishlistCount = 0 }: TrackOrderIndexProps) {
    const [searchType, setSearchType] = useState<'order_email' | 'tracking_number'>('order_email');

    const orderEmailForm = useForm({
        search_type: 'order_email',
        order_number: '',
        email: '',
    });

    const trackingNumberForm = useForm({
        search_type: 'tracking_number',
        tracking_number: '',
    });

    const handleOrderEmailSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        orderEmailForm.post(route('track-order.search'), {
            preserveScroll: true,
        });
    };

    const handleTrackingNumberSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        trackingNumberForm.post(route('track-order.search'), {
            preserveScroll: true,
        });
    };

    const currentForm = searchType === 'order_email' ? orderEmailForm : trackingNumberForm;

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Track Your Order" />

            {/* Hero Section with Gradient */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
                            <FiPackage className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Track Your Order
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Enter your order details below to check the status and location of your shipment
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Search Type Tabs */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setSearchType('order_email')}
                                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                    searchType === 'order_email'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <FiHash className="w-5 h-5" />
                                    Order Number + Email
                                </div>
                            </button>
                            <button
                                onClick={() => setSearchType('tracking_number')}
                                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                    searchType === 'tracking_number'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <FiTruck className="w-5 h-5" />
                                    Tracking Number
                                </div>
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Error Messages */}
                            {currentForm.errors.search && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {currentForm.errors.search}
                                </div>
                            )}

                            {/* Order Number + Email Form */}
                            {searchType === 'order_email' && (
                                <form onSubmit={handleOrderEmailSubmit}>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Order Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiHash className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={orderEmailForm.data.order_number}
                                                    onChange={(e) => orderEmailForm.setData('order_number', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="e.g., ORD-123456"
                                                    required
                                                />
                                            </div>
                                            {orderEmailForm.errors.order_number && (
                                                <p className="mt-2 text-sm text-red-600">{orderEmailForm.errors.order_number}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiMail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={orderEmailForm.data.email}
                                                    onChange={(e) => orderEmailForm.setData('email', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                            </div>
                                            {orderEmailForm.errors.email && (
                                                <p className="mt-2 text-sm text-red-600">{orderEmailForm.errors.email}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={orderEmailForm.processing}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                                        >
                                            {orderEmailForm.processing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <FiSearch className="animate-spin" />
                                                    Searching...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <FiSearch />
                                                    Track Order
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* Tracking Number Form */}
                            {searchType === 'tracking_number' && (
                                <form onSubmit={handleTrackingNumberSubmit}>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tracking Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiTruck className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={trackingNumberForm.data.tracking_number}
                                                    onChange={(e) => trackingNumberForm.setData('tracking_number', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="e.g., 1Z9999999999999999"
                                                    required
                                                />
                                            </div>
                                            {trackingNumberForm.errors.tracking_number && (
                                                <p className="mt-2 text-sm text-red-600">{trackingNumberForm.errors.tracking_number}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={trackingNumberForm.processing}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                                        >
                                            {trackingNumberForm.processing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <FiSearch className="animate-spin" />
                                                    Searching...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <FiSearch />
                                                    Track Shipment
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* How to Find Your Tracking Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FiMapPin className="text-blue-600" />
                            How to Find Your Tracking Information
                        </h3>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-start gap-3">
                                <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <p>
                                    <strong>Order Number:</strong> You can find your order number in the confirmation email we sent you
                                    after your purchase.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <p>
                                    <strong>Tracking Number:</strong> Once your order ships, you'll receive a tracking number via email
                                    and SMS (if provided).
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiClock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <p>
                                    <strong>Processing Time:</strong> Please allow 1-2 business days for your tracking information to be
                                    available after your order is placed.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white rounded-lg shadow">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                                <FiTruck className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                            <p className="text-sm text-gray-600">
                                Get live tracking information and delivery status updates
                            </p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                                <FiMapPin className="w-7 h-7 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Location Tracking</h3>
                            <p className="text-sm text-gray-600">
                                See your package's journey from warehouse to your doorstep
                            </p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-4">
                                <FiMail className="w-7 h-7 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Email Notifications</h3>
                            <p className="text-sm text-gray-600">
                                Subscribe to receive automatic updates about your shipment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
