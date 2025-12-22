import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LineChart from '@/Components/Charts/LineChart';
import BarChart from '@/Components/Charts/BarChart';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import { FiPackage, FiDollarSign, FiShoppingBag, FiTrendingUp, FiBox } from 'react-icons/fi';
import { PageProps } from '@/types';

interface Vendor {
    id: number;
    business_name: string;
    status: string;
    commission_rate: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total_cents: number;
    created_at: string;
    customer_name: string;
    items_count: number;
}

interface Product {
    id: number;
    name: string;
    sales_count: number;
    price: number;
}

interface Stats {
    total_sales_cents: number;
    total_earnings_cents: number;
    total_products: number;
    published_products: number;
    pending_orders: number;
}

interface VendorDashboardProps extends PageProps {
    vendor: Vendor;
    stats: Stats;
    recentOrders: Order[];
    topProducts: Product[];
}

export default function VendorDashboard({
    auth,
    vendor,
    stats,
    recentOrders = [],
    topProducts = []
}: VendorDashboardProps) {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/vendor/api/analytics?period=${period}`);
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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Vendor Dashboard - {vendor.business_name}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                </div>
            }
        >
            <Head title="Vendor Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Navigation Tabs */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <Link
                                href="/vendor/dashboard"
                                className="border-grabit-primary text-grabit-primary whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/vendor/products"
                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            >
                                Products
                            </Link>
                            <Link
                                href="/vendor/orders"
                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            >
                                Orders
                            </Link>
                            <Link
                                href="/vendor/settings"
                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            >
                                Settings
                            </Link>
                        </nav>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FiDollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {formatPrice(stats.total_sales_cents)}
                            </h3>
                            <p className="text-sm text-gray-600">Total Sales</p>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FiTrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {formatPrice(stats.total_earnings_cents)}
                            </h3>
                            <p className="text-sm text-gray-600">Total Earnings</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Commission: {(vendor.commission_rate * 100).toFixed(0)}%
                            </p>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FiBox className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {stats.published_products}
                            </h3>
                            <p className="text-sm text-gray-600">Published Products</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.total_products} total
                            </p>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <FiShoppingBag className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {stats.pending_orders}
                            </h3>
                            <p className="text-sm text-gray-600">Pending Orders</p>
                        </div>
                    </div>

                    {/* Analytics Charts */}
                    {!loading && analyticsData && (
                        <div className="space-y-6 mb-8">
                            {/* Sales Over Time */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Sales & Revenue Analytics</h3>
                                    <select
                                        value={period}
                                        onChange={(e) => setPeriod(e.target.value)}
                                        className="text-sm border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="7">Last 7 days</option>
                                        <option value="30">Last 30 days</option>
                                        <option value="90">Last 90 days</option>
                                    </select>
                                </div>
                                <div className="h-80">
                                    <LineChart
                                        data={{
                                            labels: analyticsData.sales_over_time.map((item: any) =>
                                                new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                            ),
                                            datasets: [
                                                {
                                                    label: 'Revenue',
                                                    data: analyticsData.sales_over_time.map((item: any) => item.revenue_cents / 100),
                                                    borderColor: '#5caf90',
                                                    backgroundColor: 'rgba(92, 175, 144, 0.1)',
                                                    fill: true,
                                                    tension: 0.4,
                                                },
                                                {
                                                    label: 'Commission Earned',
                                                    data: analyticsData.sales_over_time.map((item: any) => item.commission_cents / 100),
                                                    borderColor: '#4b5966',
                                                    backgroundColor: 'rgba(75, 89, 102, 0.1)',
                                                    fill: true,
                                                    tension: 0.4,
                                                }
                                            ]
                                        }}
                                        yAxisLabel="Amount ($)"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Top Products Chart */}
                                {analyticsData.top_products.length > 0 && (
                                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Revenue</h3>
                                        <div className="h-80">
                                            <BarChart
                                                data={{
                                                    labels: analyticsData.top_products.slice(0, 8).map((item: any) =>
                                                        item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name
                                                    ),
                                                    datasets: [{
                                                        label: 'Revenue ($)',
                                                        data: analyticsData.top_products.slice(0, 8).map((item: any) => item.revenue_cents / 100),
                                                        backgroundColor: '#5caf90',
                                                        borderColor: '#4a9a7a',
                                                        borderWidth: 1,
                                                    }]
                                                }}
                                                yAxisLabel="Revenue ($)"
                                                horizontal={true}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Revenue by Category */}
                                {analyticsData.revenue_by_category.length > 0 && (
                                                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                                        <div className="h-80">
                                            <DoughnutChart
                                                data={{
                                                    labels: analyticsData.revenue_by_category.map((item: any) => item.category),
                                                    datasets: [{
                                                        data: analyticsData.revenue_by_category.map((item: any) => item.revenue_cents / 100),
                                                        backgroundColor: [
                                                            '#5caf90',
                                                            '#4b5966',
                                                            '#f59e0b',
                                                            '#3b82f6',
                                                            '#ef4444',
                                                            '#8b5cf6',
                                                            '#10b981',
                                                            '#ec4899',
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
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Orders */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FiPackage className="w-5 h-5" />
                                    Recent Orders
                                </h3>
                                <Link
                                    href="/vendor/orders"
                                    className="text-grabit-primary hover:text-grabit-primary-dark text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>

                            {recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-grabit-primary transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        Order #{order.order_number}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {order.customer_name} • {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">{order.items_count} items</span>
                                                <span className="font-bold text-grabit-primary">
                                                    {formatPrice(order.total_cents)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No recent orders</p>
                            )}
                        </div>

                        {/* Top Products */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FiTrendingUp className="w-5 h-5" />
                                    Top Selling Products
                                </h3>
                                <Link
                                    href="/vendor/products"
                                    className="text-grabit-primary hover:text-grabit-primary-dark text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>

                            {topProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-grabit-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {formatPrice(product.price)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-grabit-primary">{product.sales_count}</p>
                                                <p className="text-xs text-gray-600">sales</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No sales data yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
