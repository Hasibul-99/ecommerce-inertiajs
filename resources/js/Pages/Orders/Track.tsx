import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { PageProps } from '@/types';

interface TrackingEvent {
    date: string;
    status: string;
    location: string;
}

interface TrackingInfo {
    status: string;
    tracking_number: string;
    carrier: string;
    estimated_delivery: string;
    events: TrackingEvent[];
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total_cents: number;
    created_at: string;
}

interface TrackPageProps extends PageProps {
    order: Order;
    trackingInfo: TrackingInfo;
    cartCount?: number;
    wishlistCount?: number;
}

export default function Track({
    auth,
    order,
    trackingInfo,
    cartCount = 0,
    wishlistCount = 0
}: TrackPageProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusStep = (status: string): number => {
        const statusMap: Record<string, number> = {
            'pending': 0,
            'processing': 1,
            'shipped': 2,
            'delivered': 3,
        };
        return statusMap[status] || 0;
    };

    const currentStep = getStatusStep(order.status);

    const steps = [
        { title: 'Order Placed', icon: FiPackage, step: 0 },
        { title: 'Processing', icon: FiClock, step: 1 },
        { title: 'Shipped', icon: FiTruck, step: 2 },
        { title: 'Delivered', icon: FiCheckCircle, step: 3 },
    ];

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title={`Track Order #${order.order_number}`} />

            {/* Header */}
            <div className="bg-grabit-bg-light py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-grabit-gray mb-4">
                        <Link href="/" className="hover:text-grabit-primary">Home</Link>
                        <FiChevronRight className="w-4 h-4" />
                        <Link href="/orders" className="hover:text-grabit-primary">Orders</Link>
                        <FiChevronRight className="w-4 h-4" />
                        <span>Track Order</span>
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
                        Track Order #{order.order_number}
                    </h1>
                    <p className="text-grabit-gray">Track your order status and delivery information</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Progress Steps */}
                    <div className="bg-white border border-grabit-border rounded-lg p-8 mb-8">
                        <div className="relative">
                            {/* Progress Bar Background */}
                            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200" style={{ marginLeft: '2.5rem', marginRight: '2.5rem' }}>
                                {/* Progress Bar Fill */}
                                <div
                                    className="h-full bg-grabit-primary transition-all duration-500"
                                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                />
                            </div>

                            {/* Steps */}
                            <div className="relative flex justify-between">
                                {steps.map((stepInfo, index) => {
                                    const Icon = stepInfo.icon;
                                    const isCompleted = currentStep >= stepInfo.step;
                                    const isCurrent = currentStep === stepInfo.step;

                                    return (
                                        <div key={index} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                                                    isCompleted
                                                        ? 'bg-grabit-primary text-white'
                                                        : 'bg-white border-2 border-gray-300 text-gray-400'
                                                } ${isCurrent ? 'ring-4 ring-grabit-primary ring-opacity-30' : ''}`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <p className={`text-sm font-medium text-center ${
                                                isCompleted ? 'text-grabit-dark' : 'text-grabit-gray'
                                            }`}>
                                                {stepInfo.title}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Tracking Information */}
                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-6">
                                Tracking Information
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiTruck className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-grabit-gray mb-1">Tracking Number</p>
                                        <p className="font-semibold text-grabit-dark">{trackingInfo.tracking_number}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiPackage className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-grabit-gray mb-1">Carrier</p>
                                        <p className="font-semibold text-grabit-dark capitalize">{trackingInfo.carrier}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiMapPin className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-grabit-gray mb-1">Estimated Delivery</p>
                                        <p className="font-semibold text-grabit-dark">{trackingInfo.estimated_delivery}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiClock className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-grabit-gray mb-1">Current Status</p>
                                        <p className="font-semibold text-grabit-dark capitalize">{trackingInfo.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-grabit-border">
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="w-full inline-block text-center bg-grabit-primary hover:bg-grabit-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
                                >
                                    View Order Details
                                </Link>
                            </div>
                        </div>

                        {/* Tracking History */}
                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-6">
                                Tracking History
                            </h2>

                            <div className="space-y-6">
                                {trackingInfo.events.map((event, index) => (
                                    <div key={index} className="relative">
                                        {index !== trackingInfo.events.length - 1 && (
                                            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                                        )}
                                        <div className="flex gap-4">
                                            <div className="relative">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    index === 0
                                                        ? 'bg-grabit-primary text-white'
                                                        : 'bg-gray-200 text-grabit-gray'
                                                }`}>
                                                    <div className="w-3 h-3 rounded-full bg-current" />
                                                </div>
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <p className={`font-medium mb-1 ${
                                                    index === 0 ? 'text-grabit-dark' : 'text-grabit-gray'
                                                }`}>
                                                    {event.status}
                                                </p>
                                                <p className="text-sm text-grabit-gray mb-1">{event.location}</p>
                                                <p className="text-xs text-grabit-gray">{event.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-grabit-dark mb-2">Need Help?</h3>
                        <p className="text-grabit-gray mb-4">
                            If you have any questions about your order or delivery, please contact our customer support team.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/contact-us"
                                className="inline-block bg-white hover:bg-gray-50 text-grabit-primary border border-grabit-primary px-6 py-2 rounded-md font-medium transition-colors"
                            >
                                Contact Support
                            </Link>
                            <Link
                                href="/orders"
                                className="inline-block bg-white hover:bg-gray-50 text-grabit-dark border border-grabit-border px-6 py-2 rounded-md font-medium transition-colors"
                            >
                                View All Orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
