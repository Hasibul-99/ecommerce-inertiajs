import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

interface OrderItem {
    id: number;
    product_name: string;
    vendor_status?: string;
    vendor_name?: string;
    quantity: number;
    tracking_number?: string;
    carrier?: string;
}

interface TrackingEvent {
    date: string;
    status: string;
    location: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    created_at: string;
    items: OrderItem[];
    shipping_address: any;
}

interface Props {
    auth: any;
    order: Order;
    trackingInfo: {
        tracking_number: string;
        carrier: string;
        estimated_delivery: string;
        events: TrackingEvent[];
    };
}

export default function OrderTrack({ auth, order, trackingInfo }: Props) {
    const getStatusIcon = (status: string) => {
        switch(status.toLowerCase()) {
            case 'pending': return <FiClock className="text-2xl" />;
            case 'processing': return <FiPackage className="text-2xl" />;
            case 'shipped': return <FiTruck className="text-2xl" />;
            case 'delivered': return <FiCheckCircle className="text-2xl" />;
            default: return <FiPackage className="text-2xl" />;
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            processing: 'bg-blue-100 text-blue-800 border-blue-300',
            shipped: 'bg-purple-100 text-purple-800 border-purple-300',
            delivered: 'bg-green-100 text-green-800 border-green-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const orderStatuses = [
        { status: 'pending', label: 'Order Placed', icon: <FiPackage /> },
        { status: 'processing', label: 'Processing', icon: <FiClock /> },
        { status: 'shipped', label: 'Shipped', icon: <FiTruck /> },
        { status: 'delivered', label: 'Delivered', icon: <FiCheckCircle /> },
    ];

    const getCurrentStatusIndex = () => {
        return orderStatuses.findIndex(s => s.status === order.status);
    };

    const currentIndex = getCurrentStatusIndex();

    const calculateDeliveryTime = () => {
        if (order.status === 'delivered') return 'Delivered';
        if (trackingInfo.estimated_delivery === 'Not available') return 'Calculating...';
        const delivery = new Date(trackingInfo.estimated_delivery);
        const now = new Date();
        const diff = delivery.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return 'Delayed';
        if (days === 0) return 'Today';
        if (days === 1) return 'Tomorrow';
        return `${days} days`;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Track Order #${order.order_number}`} />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link href="/customer/orders" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
                            ← Back to Orders
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Track Order</h1>
                        <p className="text-gray-600 mt-1">Order #{order.order_number}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiTruck className="text-2xl text-blue-600" />
                                <h3 className="font-semibold text-gray-900">Estimated Delivery</h3>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">{calculateDeliveryTime()}</p>
                            {trackingInfo.estimated_delivery !== 'Not available' && order.status !== 'delivered' && (
                                <p className="text-sm text-gray-600 mt-1">{new Date(trackingInfo.estimated_delivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            )}
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiPackage className="text-2xl text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Order Status</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                            <p className="text-sm text-gray-600 mt-1">{order.items.length} items</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiMapPin className="text-2xl text-green-600" />
                                <h3 className="font-semibold text-gray-900">Tracking Number</h3>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{trackingInfo.tracking_number}</p>
                            <p className="text-sm text-gray-600 mt-1">{trackingInfo.carrier}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-8 mb-6">
                        <h2 className="text-xl font-semibold mb-8">Order Progress</h2>
                        <div className="relative">
                            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                                <div className={'h-full bg-blue-600 transition-all duration-500'} style={{ width: `${(currentIndex / (orderStatuses.length - 1)) * 100}%` }}></div>
                            </div>
                            <div className="relative flex justify-between">
                                {orderStatuses.map((statusItem, index) => (
                                    <div key={statusItem.status} className="flex flex-col items-center">
                                        <div className={'w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ' + (index <= currentIndex ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200')}>
                                            {statusItem.icon}
                                        </div>
                                        <p className={'mt-3 text-sm font-medium text-center ' + (index <= currentIndex ? 'text-gray-900' : 'text-gray-400')}>
                                            {statusItem.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.product_name}</p>
                                            <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                            {item.vendor_name && (
                                                <p className="text-sm text-gray-600">Vendor: {item.vendor_name}</p>
                                            )}
                                            {item.tracking_number && (
                                                <p className="text-sm text-blue-600 mt-2">
                                                    Track: {item.tracking_number} ({item.carrier})
                                                </p>
                                            )}
                                        </div>
                                        {item.vendor_status && (
                                            <span className={'px-3 py-1 text-xs rounded-full ' + getStatusColor(item.vendor_status)}>
                                                {item.vendor_status}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Tracking History</h2>
                            <div className="space-y-4">
                                {trackingInfo.events.map((event, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                            {index < trackingInfo.events.length - 1 && (
                                                <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="font-medium text-gray-900">{event.status}</p>
                                            <p className="text-sm text-gray-600">{event.location}</p>
                                            <p className="text-xs text-gray-500 mt-1">{new Date(event.date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {order.shipping_address && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                                <div className="text-gray-700">
                                    <p className="font-medium">{order.shipping_address.name}</p>
                                    <p className="mt-2">{order.shipping_address.address_line1}</p>
                                    {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                                    <p>{order.shipping_address.country}</p>
                                    {order.shipping_address.phone && (
                                        <p className="mt-2 flex items-center gap-2">
                                            <FiPhone className="text-gray-500" />
                                            {order.shipping_address.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
                            <div className="space-y-4">
                                <p className="text-gray-600">If you have any questions about your order, feel free to contact us.</p>
                                <div className="flex flex-col gap-3">
                                    <a href="mailto:support@example.com" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                                        <FiMail className="text-blue-600" />
                                        <span className="text-blue-600 font-medium">Email Support</span>
                                    </a>
                                    <a href="tel:+1234567890" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition">
                                        <FiPhone className="text-green-600" />
                                        <span className="text-green-600 font-medium">Call Us</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
