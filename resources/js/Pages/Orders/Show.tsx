import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { FiPackage, FiMapPin, FiCreditCard, FiTruck, FiDownload, FiX, FiAlertCircle } from 'react-icons/fi';
import { PageProps } from '@/types';

interface OrderItem {
    id: number;
    product_name: string;
    product_id: number;
    quantity: number;
    unit_price_cents: number;
    subtotal_cents: number;
    product: {
        id: number;
        slug: string;
        image?: string;
    };
    variant?: {
        id: number;
        sku: string;
        attributes: Array<{ name: string; value: string }>;
    };
}

interface Address {
    name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
    subtotal_cents: number;
    tax_cents: number;
    shipping_cents: number;
    discount_cents: number;
    total_cents: number;
    notes?: string;
    tracking_number?: string;
    shipping_carrier?: string;
    created_at: string;
    items: OrderItem[];
    shipping_address?: Address;
    billing_address?: Address;
    can_cancel: boolean;
    can_request_return: boolean;
}

interface OrderShowPageProps extends PageProps {
    order: Order;
    cartCount?: number;
    wishlistCount?: number;
}

export default function OrderShow({
    auth,
    order,
    cartCount = 0,
    wishlistCount = 0
}: OrderShowPageProps) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const formatPrice = (priceInCents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(priceInCents / 100);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            processing: 'bg-blue-100 text-blue-800 border-blue-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            return_requested: 'bg-orange-100 text-orange-800 border-orange-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            credit_card: 'Credit Card',
            paypal: 'PayPal',
            bank_transfer: 'Bank Transfer',
            cod: 'Cash on Delivery',
        };
        return labels[method] || method;
    };

    const handleCancelOrder = () => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        setProcessing(true);
        router.post(`/orders/${order.id}/cancel`, {}, {
            preserveState: true,
            onFinish: () => {
                setProcessing(false);
                setShowCancelModal(false);
            },
        });
    };

    const handleRequestReturn = (e: React.FormEvent) => {
        e.preventDefault();

        setProcessing(true);
        router.post(`/orders/${order.id}/request-return`, {
            reason: returnReason
        }, {
            preserveState: true,
            onFinish: () => {
                setProcessing(false);
                setShowReturnModal(false);
                setReturnReason('');
            },
        });
    };

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title={`Order #${order.order_number}`} />

            {/* Breadcrumb */}
            <div className="bg-grabit-bg-light py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-grabit-gray">
                        <Link href="/" className="hover:text-grabit-primary">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/orders" className="hover:text-grabit-primary">My Orders</Link>
                        <span className="mx-2">/</span>
                        <span className="text-grabit-dark">#{order.order_number}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Order Header */}
                <div className="bg-white border border-grabit-border rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl font-heading font-bold text-grabit-dark mb-2">
                                Order #{order.order_number}
                            </h1>
                            <p className="text-grabit-gray">
                                Placed on {formatDate(order.created_at)}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className={`inline-block px-4 py-2 rounded-md text-sm font-medium border ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                            </span>
                            {order.tracking_number && (
                                <Link
                                    href={`/orders/${order.id}/track`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-grabit-primary hover:bg-grabit-primary-dark text-white rounded-md text-sm font-medium transition-colors"
                                >
                                    <FiTruck className="w-4 h-4" />
                                    Track Order
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-grabit-border">
                        {order.can_cancel && (
                            <button
                                onClick={handleCancelOrder}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                <FiX className="w-4 h-4" />
                                Cancel Order
                            </button>
                        )}
                        {order.can_request_return && (
                            <button
                                onClick={() => setShowReturnModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-grabit-border hover:border-grabit-primary text-grabit-dark rounded-md text-sm font-medium transition-colors"
                            >
                                <FiAlertCircle className="w-4 h-4" />
                                Request Return
                            </button>
                        )}
                        <Link
                            href={`/orders/${order.id}/invoice`}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-grabit-border hover:border-grabit-primary text-grabit-dark rounded-md text-sm font-medium transition-colors"
                        >
                            <FiDownload className="w-4 h-4" />
                            Download Invoice
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-6 flex items-center gap-2">
                                <FiPackage className="w-5 h-5" />
                                Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-grabit-border last:border-0 last:pb-0">
                                        <Link
                                            href={`/product/${item.product.slug}`}
                                            className="flex-shrink-0"
                                        >
                                            <img
                                                src={item.product.image || '/images/placeholder-product.png'}
                                                alt={item.product_name}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                        </Link>
                                        <div className="flex-1">
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                className="font-medium text-grabit-dark hover:text-grabit-primary transition-colors block mb-1"
                                            >
                                                {item.product_name}
                                            </Link>
                                            {item.variant && item.variant.attributes.length > 0 && (
                                                <div className="text-sm text-grabit-gray mb-2">
                                                    {item.variant.attributes.map((attr, index) => (
                                                        <span key={index}>
                                                            {attr.name}: {attr.value}
                                                            {index < item.variant!.attributes.length - 1 && ' • '}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-sm text-grabit-gray">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-grabit-dark">
                                                {formatPrice(item.unit_price_cents)}
                                            </p>
                                            <p className="text-sm text-grabit-gray">
                                                Total: {formatPrice(item.subtotal_cents)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {order.shipping_address && (
                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-4 flex items-center gap-2">
                                    <FiMapPin className="w-5 h-5" />
                                    Shipping Address
                                </h2>
                                <div className="text-grabit-gray">
                                    <p className="font-medium text-grabit-dark mb-1">{order.shipping_address.name}</p>
                                    <p>{order.shipping_address.address_line1}</p>
                                    {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                                    <p>
                                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                    </p>
                                    <p>{order.shipping_address.country}</p>
                                    <p className="mt-2">Phone: {order.shipping_address.phone}</p>
                                </div>
                            </div>
                        )}

                        {/* Order Notes */}
                        {order.notes && (
                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-4">
                                    Order Notes
                                </h2>
                                <p className="text-grabit-gray">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-6">
                                Order Summary
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-grabit-gray">
                                    <span>Subtotal:</span>
                                    <span>{formatPrice(order.subtotal_cents)}</span>
                                </div>
                                {order.discount_cents > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount:</span>
                                        <span>-{formatPrice(order.discount_cents)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-grabit-gray">
                                    <span>Tax:</span>
                                    <span>{formatPrice(order.tax_cents)}</span>
                                </div>
                                <div className="flex justify-between text-grabit-gray">
                                    <span>Shipping:</span>
                                    <span>{order.shipping_cents > 0 ? formatPrice(order.shipping_cents) : 'Free'}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-3 border-t border-grabit-border">
                                    <span className="text-grabit-dark">Total:</span>
                                    <span className="text-grabit-primary">{formatPrice(order.total_cents)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-4 flex items-center gap-2">
                                <FiCreditCard className="w-5 h-5" />
                                Payment
                            </h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-grabit-gray">Method:</span>
                                    <span className="font-medium text-grabit-dark">{getPaymentMethodLabel(order.payment_method)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-grabit-gray">Status:</span>
                                    <span className={`font-medium ${
                                        order.payment_status === 'paid' ? 'text-green-600' :
                                        order.payment_status === 'unpaid' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Information */}
                        {order.tracking_number && (
                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-4 flex items-center gap-2">
                                    <FiTruck className="w-5 h-5" />
                                    Shipping
                                </h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-grabit-gray">Carrier:</span>
                                        <span className="font-medium text-grabit-dark">{order.shipping_carrier || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-grabit-gray">Tracking:</span>
                                        <span className="font-medium text-grabit-dark font-mono text-xs">{order.tracking_number}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Return Request Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-heading font-semibold text-grabit-dark mb-4">
                            Request Return
                        </h3>
                        <form onSubmit={handleRequestReturn}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-grabit-dark mb-2">
                                    Reason for return *
                                </label>
                                <textarea
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary resize-none"
                                    placeholder="Please describe why you want to return this order..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowReturnModal(false)}
                                    className="flex-1 px-4 py-2 border border-grabit-border text-grabit-dark rounded-md font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !returnReason.trim()}
                                    className="flex-1 px-4 py-2 bg-grabit-primary hover:bg-grabit-primary-dark text-white rounded-md font-medium transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}
