import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProgressTracker from '@/Components/TrackOrder/ProgressTracker';
import TrackingTimeline from '@/Components/TrackOrder/TrackingTimeline';
import ShipmentCard from '@/Components/TrackOrder/ShipmentCard';
import DeliveryCountdown from '@/Components/TrackOrder/DeliveryCountdown';
import { Button } from '@/Components/ui/button';
import {
    FiPackage,
    FiShare2,
    FiMail,
    FiChevronRight,
    FiMapPin,
    FiDollarSign,
    FiCreditCard,
    FiCheckCircle,
    FiCopy,
} from 'react-icons/fi';
import { PageProps } from '@/types';
import { toast } from 'sonner';

interface TrackingEvent {
    id: string;
    status: string;
    message: string;
    location: string;
    timestamp: string;
    type?: string;
    carrier?: string;
}

interface Shipment {
    id: number;
    tracking_number: string;
    carrier: string;
    carrier_tracking_url: string;
    status: string;
    shipped_at: string | null;
    delivered_at: string | null;
    estimated_delivery_at: string | null;
    vendor: {
        id: number;
        name: string;
    };
    items: Array<{
        product_name: string;
        quantity: number;
        image: string | null;
    }>;
    progress_percentage: number;
}

interface TrackingData {
    order: {
        id: number;
        order_number: string;
        status: string;
        payment_status: string;
        payment_method: string;
        total_cents: number;
        created_at: string;
        delivered_at: string | null;
    };
    shipping_address: {
        name: string;
        address_line_1: string;
        address_line_2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    } | null;
    shipments: Shipment[];
    timeline: TrackingEvent[];
    progress_percentage: number;
    estimated_delivery: string | null;
    tracking_url: string;
}

interface TrackOrderShowProps extends PageProps {
    trackingData: TrackingData;
    trackingToken: string;
    cartCount?: number;
    wishlistCount?: number;
}

export default function Show({ auth, trackingData, trackingToken, cartCount = 0, wishlistCount = 0, flash }: TrackOrderShowProps) {
    const [showSubscribeForm, setShowSubscribeForm] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const subscribeForm = useForm({
        email: '',
        phone: '',
        email_enabled: true,
        sms_enabled: false,
    });

    // Auto-refresh for in-transit orders
    useEffect(() => {
        if (autoRefresh && trackingData.order.status === 'in_transit') {
            const interval = setInterval(() => {
                window.location.reload();
            }, 30000); // Refresh every 30 seconds

            return () => clearInterval(interval);
        }
    }, [autoRefresh, trackingData.order.status]);

    const handleSubscribe: FormEventHandler = (e) => {
        e.preventDefault();
        subscribeForm.post(route('track-order.subscribe', { token: trackingToken }), {
            preserveScroll: true,
            onSuccess: () => {
                subscribeForm.reset();
                setShowSubscribeForm(false);
            },
        });
    };

    const copyTrackingLink = () => {
        navigator.clipboard.writeText(trackingData.tracking_url);
        toast.success('Tracking link copied to clipboard');
    };

    const shareTrackingLink = () => {
        if (navigator.share) {
            navigator.share({
                title: `Track Order ${trackingData.order.order_number}`,
                text: `Track my order from GrabIt`,
                url: trackingData.tracking_url,
            }).catch(() => {
                copyTrackingLink();
            });
        } else {
            copyTrackingLink();
        }
    };

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isDelivered = trackingData.order.status === 'delivered';

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title={`Track Order ${trackingData.order.order_number}`} />

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-200 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <FiChevronRight className="w-4 h-4" />
                        <Link href={route('track-order.index')} className="hover:text-blue-600 transition-colors">
                            Track Order
                        </Link>
                        <FiChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">
                            {trackingData.order.order_number}
                        </span>
                    </div>
                </div>
            </div>

            {/* Success Flash Message */}
            {flash?.success && (
                <div className="container mx-auto px-4 mt-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-green-700">{flash.success}</p>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Order {trackingData.order.order_number}
                            </h1>
                            <p className="text-gray-600">
                                Placed on {formatDate(trackingData.order.created_at)}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={shareTrackingLink}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <FiShare2 className="w-4 h-4" />
                                Share
                            </Button>
                            <Button
                                onClick={() => setShowSubscribeForm(!showSubscribeForm)}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <FiMail className="w-4 h-4" />
                                Get Updates
                            </Button>
                        </div>
                    </div>

                    {/* Subscribe Form */}
                    {showSubscribeForm && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Subscribe to Tracking Updates
                            </h3>
                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={subscribeForm.data.email}
                                            onChange={(e) => subscribeForm.setData('email', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number (Optional)
                                        </label>
                                        <input
                                            type="tel"
                                            value={subscribeForm.data.phone}
                                            onChange={(e) => subscribeForm.setData('phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={subscribeForm.data.email_enabled}
                                            onChange={(e) => subscribeForm.setData('email_enabled', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Email notifications</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={subscribeForm.data.sms_enabled}
                                            onChange={(e) => subscribeForm.setData('sms_enabled', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">SMS notifications</span>
                                    </label>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={subscribeForm.processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {subscribeForm.processing ? 'Subscribing...' : 'Subscribe to Updates'}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Progress Tracker */}
                <div className="mb-8">
                    <ProgressTracker
                        currentStatus={trackingData.order.status}
                        progressPercentage={trackingData.progress_percentage}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Delivery Countdown */}
                        <DeliveryCountdown
                            estimatedDelivery={trackingData.estimated_delivery}
                            isDelivered={isDelivered}
                            deliveredAt={trackingData.order.delivered_at}
                        />

                        {/* Shipments */}
                        {trackingData.shipments.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiPackage className="text-blue-600" />
                                    Shipments ({trackingData.shipments.length})
                                </h2>
                                <div className="space-y-4">
                                    {trackingData.shipments.map((shipment) => (
                                        <ShipmentCard key={shipment.id} shipment={shipment} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tracking Timeline */}
                        <TrackingTimeline events={trackingData.timeline} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Order Total</span>
                                    <span className="font-semibold text-gray-900">
                                        {formatCurrency(trackingData.order.total_cents)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium text-gray-900 capitalize flex items-center gap-1">
                                        <FiCreditCard className="w-4 h-4" />
                                        {trackingData.order.payment_method}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        trackingData.order.payment_status === 'paid'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {trackingData.order.payment_status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {trackingData.shipping_address && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiMapPin className="text-blue-600" />
                                    Shipping Address
                                </h3>
                                <address className="text-gray-700 not-italic text-sm space-y-1">
                                    <p className="font-medium">{trackingData.shipping_address.name}</p>
                                    <p>{trackingData.shipping_address.address_line_1}</p>
                                    {trackingData.shipping_address.address_line_2 && (
                                        <p>{trackingData.shipping_address.address_line_2}</p>
                                    )}
                                    <p>
                                        {trackingData.shipping_address.city}, {trackingData.shipping_address.state} {trackingData.shipping_address.postal_code}
                                    </p>
                                    <p>{trackingData.shipping_address.country}</p>
                                </address>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/contact-us"
                                    className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Contact Customer Support
                                </Link>
                                <button
                                    onClick={copyTrackingLink}
                                    className="block text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2"
                                >
                                    <FiCopy className="w-4 h-4" />
                                    Copy Tracking Link
                                </button>
                                {auth.user && (
                                    <Link
                                        href={`/orders/${trackingData.order.id}`}
                                        className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        View Full Order Details
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Auto-refresh Toggle */}
                        {trackingData.order.status === 'in_transit' && (
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={autoRefresh}
                                        onChange={(e) => setAutoRefresh(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-900 block">
                                            Auto-refresh
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Update every 30 seconds
                                        </span>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
