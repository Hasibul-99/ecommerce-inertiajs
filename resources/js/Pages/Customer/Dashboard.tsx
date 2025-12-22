import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FrontendLayout from '@/Layouts/FrontendLayout';
import LineChart from '@/Components/Charts/LineChart';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import { FiShoppingBag, FiPackage, FiHeart, FiUser, FiMapPin, FiClock } from 'react-icons/fi';
import { PageProps } from '@/types';

interface Order {
    id: number;
    order_number: string;
    total_cents: number;
    status: string;
    created_at: string;
    items_count: number;
}

interface DashboardStats {
    total_orders: number;
    pending_orders: number;
    wishlist_count: number;
    addresses_count: number;
}

interface CustomerDashboardProps extends PageProps {
    stats: DashboardStats;
    recentOrders: Order[];
    cartCount?: number;
    wishlistCount?: number;
}

export default function CustomerDashboard({
    auth,
    stats,
    recentOrders = [],
    cartCount = 0,
    wishlistCount = 0
}: CustomerDashboardProps) {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/analytics/customer?period=${period}`);
            setAnalyticsData(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

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
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="My Account" />

            {/* Header */}
            <div className="bg-grabit-bg-light py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
                        Welcome back, {auth.user.name}!
                    </h1>
                    <p className="text-grabit-gray">Manage your orders, wishlist, and account settings</p>
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
                                    className="flex items-center gap-3 px-4 py-3 rounded-md bg-grabit-primary text-white"
                                >
                                    <FiUser className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href="/orders"
                                    className="flex items-center gap-3 px-4 py-3 rounded-md text-grabit-gray hover:bg-grabit-bg-light transition-colors"
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
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FiShoppingBag className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-grabit-dark mb-1">{stats.total_orders}</h3>
                                <p className="text-sm text-grabit-gray">Total Orders</p>
                            </div>

                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <FiClock className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-grabit-dark mb-1">{stats.pending_orders}</h3>
                                <p className="text-sm text-grabit-gray">Pending Orders</p>
                            </div>

                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <FiHeart className="w-6 h-6 text-red-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-grabit-dark mb-1">{stats.wishlist_count}</h3>
                                <p className="text-sm text-grabit-gray">Wishlist Items</p>
                            </div>

                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FiMapPin className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-grabit-dark mb-1">{stats.addresses_count}</h3>
                                <p className="text-sm text-grabit-gray">Saved Addresses</p>
                            </div>
                        </div>

                        {/* Analytics Charts */}
                        {!loading && analyticsData && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Orders Over Time */}
                                <div className="bg-white border border-grabit-border rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-heading font-semibold text-grabit-dark">Order Activity</h2>
                                        <select
                                            value={period}
                                            onChange={(e) => setPeriod(e.target.value)}
                                            className="text-sm border border-grabit-border rounded-md px-3 py-1"
                                        >
                                            <option value="7">Last 7 days</option>
                                            <option value="30">Last 30 days</option>
                                            <option value="90">Last 90 days</option>
                                        </select>
                                    </div>
                                    <div className="h-64">
                                        <LineChart
                                            data={{
                                                labels: analyticsData.orders_over_time.map((item: any) =>
                                                    new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                ),
                                                datasets: [{
                                                    label: 'Orders',
                                                    data: analyticsData.orders_over_time.map((item: any) => item.count),
                                                    borderColor: '#5caf90',
                                                    backgroundColor: 'rgba(92, 175, 144, 0.1)',
                                                    fill: true,
                                                    tension: 0.4,
                                                }]
                                            }}
                                            yAxisLabel="Orders"
                                        />
                                    </div>
                                </div>

                                {/* Spending by Category */}
                                {analyticsData.spending_by_category.length > 0 && (
                                    <div className="bg-white border border-grabit-border rounded-lg p-6">
                                        <h2 className="text-lg font-heading font-semibold text-grabit-dark mb-4">Spending by Category</h2>
                                        <div className="h-64">
                                            <DoughnutChart
                                                data={{
                                                    labels: analyticsData.spending_by_category.map((item: any) => item.category),
                                                    datasets: [{
                                                        data: analyticsData.spending_by_category.map((item: any) => item.total_cents / 100),
                                                        backgroundColor: [
                                                            '#5caf90',
                                                            '#4b5966',
                                                            '#f59e0b',
                                                            '#3b82f6',
                                                            '#ef4444',
                                                            '#8b5cf6',
                                                        ],
                                                        borderWidth: 2,
                                                        borderColor: '#ffffff',
                                                    }]
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recent Orders */}
                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-heading font-semibold text-grabit-dark">Recent Orders</h2>
                                <Link
                                    href="/orders"
                                    className="text-grabit-primary hover:text-grabit-primary-dark text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>

                            {recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={`/orders/${order.id}`}
                                            className="block border border-grabit-border rounded-lg p-4 hover:border-grabit-primary transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="font-medium text-grabit-dark mb-1">
                                                        Order #{order.order_number}
                                                    </h3>
                                                    <p className="text-sm text-grabit-gray">
                                                        {formatDate(order.created_at)} • {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-grabit-dark mb-1">
                                                        {formatPrice(order.total_cents)}
                                                    </p>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FiPackage className="w-16 h-16 text-grabit-gray mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-medium text-grabit-dark mb-2">No orders yet</h3>
                                    <p className="text-grabit-gray mb-4">Start shopping to see your orders here</p>
                                    <Link
                                        href="/products"
                                        className="inline-block bg-grabit-primary hover:bg-grabit-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </FrontendLayout>
    );
}
