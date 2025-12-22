import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { FiShoppingBag, FiPackage, FiUser, FiHeart, FiMapPin, FiSearch, FiFilter } from 'react-icons/fi';
import { PageProps } from '@/types';

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total_cents: number;
    created_at: string;
    items_count: number;
    first_item_image?: string;
}

interface OrdersPageProps extends PageProps {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        status: string;
        search: string;
    };
    cartCount?: number;
    wishlistCount?: number;
}

export default function OrdersIndex({
    auth,
    orders,
    filters,
    cartCount = 0,
    wishlistCount = 0
}: OrdersPageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [selectedStatus, setSelectedStatus] = useState(filters.status);

    const formatPrice = (priceInCents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(priceInCents / 100);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            return_requested: 'bg-orange-100 text-orange-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            paid: 'bg-green-100 text-green-800',
            unpaid: 'bg-yellow-100 text-yellow-800',
            refunded: 'bg-red-100 text-red-800',
            partially_refunded: 'bg-orange-100 text-orange-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleFilterChange = (status: string) => {
        setSelectedStatus(status);
        router.get('/orders', { status, search: searchTerm }, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/orders', { status: selectedStatus, search: searchTerm }, { preserveState: true });
    };

    const statusOptions = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="My Orders" />

            {/* Header */}
            <div className="bg-grabit-bg-light py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
                        My Orders
                    </h1>
                    <p className="text-grabit-gray">View and manage your order history</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-grabit-border">
                                <div className="w-12 h-12 bg-grabit-primary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-medium text-grabit-dark">{auth.user.name}</h3>
                                    <p className="text-sm text-grabit-gray">{auth.user.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 px-4 py-3 rounded-md text-grabit-gray hover:bg-grabit-bg-light transition-colors"
                                >
                                    <FiUser className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href="/orders"
                                    className="flex items-center gap-3 px-4 py-3 rounded-md bg-grabit-primary text-white"
                                >
                                    <FiShoppingBag className="w-5 h-5" />
                                    <span>My Orders</span>
                                </Link>
                                <Link
                                    href="/wishlist"
                                    className="flex items-center gap-3 px-4 py-3 rounded-md text-grabit-gray hover:bg-grabit-bg-light transition-colors"
                                >
                                    <FiHeart className="w-5 h-5" />
                                    <span>Wishlist</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-3 rounded-md text-grabit-gray hover:bg-grabit-bg-light transition-colors"
                                >
                                    <FiMapPin className="w-5 h-5" />
                                    <span>Addresses</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-3 rounded-md text-grabit-gray hover:bg-grabit-bg-light transition-colors"
                                >
                                    <FiUser className="w-5 h-5" />
                                    <span>Account Settings</span>
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {/* Search and Filters */}
                        <div className="bg-white border border-grabit-border rounded-lg p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Search */}
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by order number..."
                                        className="w-full pl-10 pr-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                    />
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grabit-gray" />
                                </form>

                                {/* Status Filter */}
                                <div className="relative">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary appearance-none"
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grabit-gray" />
                                </div>
                            </div>
                        </div>

                        {/* Orders List */}
                        {orders.data.length > 0 ? (
                            <div className="space-y-4">
                                {orders.data.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/orders/${order.id}`}
                                        className="block bg-white border border-grabit-border rounded-lg p-6 hover:border-grabit-primary transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Order Image */}
                                            {order.first_item_image && (
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={order.first_item_image}
                                                        alt="Order item"
                                                        className="w-24 h-24 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}

                                            {/* Order Details */}
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                                                    <div>
                                                        <h3 className="font-heading font-semibold text-lg text-grabit-dark mb-1">
                                                            Order #{order.order_number}
                                                        </h3>
                                                        <p className="text-sm text-grabit-gray">
                                                            {formatDate(order.created_at)} • {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-xl text-grabit-primary mb-2">
                                                            {formatPrice(order.total_cents)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Status Badges */}
                                                <div className="flex flex-wrap gap-2">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                                                    </span>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1).replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* View Details Arrow */}
                                            <div className="flex items-center">
                                                <span className="text-grabit-primary">→</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {/* Pagination */}
                                {orders.last_page > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        {Array.from({ length: orders.last_page }, (_, i) => i + 1).map((page) => (
                                            <Link
                                                key={page}
                                                href={`/orders?page=${page}&status=${selectedStatus}&search=${searchTerm}`}
                                                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                    page === orders.current_page
                                                        ? 'bg-grabit-primary text-white'
                                                        : 'bg-white border border-grabit-border text-grabit-dark hover:border-grabit-primary'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white border border-grabit-border rounded-lg p-12 text-center">
                                <FiPackage className="w-16 h-16 text-grabit-gray mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-grabit-dark mb-2">
                                    {filters.status === 'all' ? 'No orders yet' : 'No orders found'}
                                </h3>
                                <p className="text-grabit-gray mb-4">
                                    {filters.status === 'all'
                                        ? 'Start shopping to see your orders here'
                                        : 'Try adjusting your filters or search terms'}
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-block bg-grabit-primary hover:bg-grabit-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </FrontendLayout>
    );
}
