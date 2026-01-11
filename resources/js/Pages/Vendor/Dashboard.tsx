import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    FiDollarSign,
    FiShoppingCart,
    FiTrendingUp,
    FiPackage,
    FiAlertTriangle,
    FiArrowUp,
    FiArrowDown,
    FiMinus,
    FiExternalLink,
    FiBell,
    FiMail
} from 'react-icons/fi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LineChart from '@/Components/Charts/LineChart';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import { PageProps } from '@/types';

interface Vendor {
    id: number;
    business_name: string;
    status: string;
    commission_rate: number;
}

interface SalesSummary {
    total_revenue: number;
    net_revenue: number;
    commission: number;
    commission_rate: number;
    orders_count: number;
    items_sold: number;
    avg_order_value: number;
    comparison: {
        revenue_change: number;
        orders_change: number;
        items_change: number;
        previous_revenue: number;
        previous_orders: number;
    };
}

interface Product {
    product_id: number;
    product_name: string;
    sku: string;
    price: number;
    stock: number;
    status: string;
    units_sold: number;
    revenue: number;
    orders_count: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total_cents: number;
    created_at: string;
    customer_name: string;
    items_count: number;
}

interface OrdersBreakdown {
    by_status: Array<{ status: string; count: number; revenue: number }>;
    by_payment_method: Array<{ payment_method: string; count: number; revenue: number }>;
    pending_shipments: number;
    success_rate: number;
}

interface RevenueDay {
    date: string;
    revenue: number;
    orders_count: number;
}

interface ConversionStats {
    total_products: number;
    active_products: number;
    low_stock_count: number;
    out_of_stock_count: number;
    low_stock_products: Array<{
        product_id: number;
        product_name: string;
        sku: string;
        stock: number;
        price: number;
    }>;
}

interface Notification {
    id: string;
    type: string;
    data: any;
    read_at: string | null;
    created_at: string;
}

interface Props extends PageProps {
    dateRange: {
        from: string;
        to: string;
    };
    vendor: Vendor;
    salesSummary: SalesSummary;
    topProducts: Product[];
    ordersBreakdown: OrdersBreakdown;
    revenueChart: RevenueDay[];
    recentOrders: Order[];
    conversionStats: ConversionStats;
    notifications: Notification[];
}

export default function Dashboard({
    auth,
    dateRange,
    vendor,
    salesSummary,
    topProducts,
    ordersBreakdown,
    revenueChart,
    recentOrders,
    conversionStats,
    notifications,
}: Props) {
    const [from, setFrom] = useState(dateRange.from);
    const [to, setTo] = useState(dateRange.to);

    const handleDateChange = () => {
        router.get(route('vendor.dashboard'), {
            from,
            to,
        }, {
            preserveState: true,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    const getChangeIndicator = (change: number) => {
        if (change > 0) {
            return (
                <span className="flex items-center text-green-600">
                    <FiArrowUp className="w-4 h-4 mr-1" />
                    {change.toFixed(1)}%
                </span>
            );
        } else if (change < 0) {
            return (
                <span className="flex items-center text-red-600">
                    <FiArrowDown className="w-4 h-4 mr-1" />
                    {Math.abs(change).toFixed(1)}%
                </span>
            );
        } else {
            return (
                <span className="flex items-center text-gray-600">
                    <FiMinus className="w-4 h-4 mr-1" />
                    0%
                </span>
            );
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            failed: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getNotificationMessage = (notification: Notification) => {
        if (notification.type === 'VendorNewOrderNotification') {
            return {
                title: `New Order #${notification.data.order_number}`,
                message: `${notification.data.items_count} items - $${(notification.data.total_cents / 100).toFixed(2)}`,
                icon: <FiShoppingCart className="text-blue-600" size={20} />,
                bgColor: 'bg-blue-50',
            };
        } else if (notification.type === 'VendorDailySummaryNotification') {
            return {
                title: 'Daily Summary',
                message: `${notification.data.orders_count} orders - $${(notification.data.revenue_cents / 100).toFixed(2)} revenue`,
                icon: <FiMail className="text-purple-600" size={20} />,
                bgColor: 'bg-purple-50',
            };
        }
        return {
            title: 'Notification',
            message: notification.type,
            icon: <FiBell className="text-gray-600" size={20} />,
            bgColor: 'bg-gray-50',
        };
    };

    // Prepare chart data
    const revenueChartData = {
        labels: revenueChart.map((item) =>
            new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [
            {
                label: 'Revenue',
                data: revenueChart.map((item) => item.revenue),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const ordersByStatusData = {
        labels: ordersBreakdown.by_status.map((item) =>
            item.status.charAt(0).toUpperCase() + item.status.slice(1)
        ),
        datasets: [
            {
                data: ordersBreakdown.by_status.map((item) => item.count),
                backgroundColor: [
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(107, 114, 128, 0.8)',
                ],
            },
        ],
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${vendor.business_name} - Dashboard`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                        <p className="mt-2 text-gray-600">{vendor.business_name}</p>
                    </div>

                    {/* Recent Notifications */}
                    {notifications && notifications.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FiBell size={20} />
                                    Recent Notifications
                                </h2>
                                <span className="text-sm text-gray-500">
                                    {notifications.filter(n => !n.read_at).length} unread
                                </span>
                            </div>
                            <div className="space-y-3">
                                {notifications.map((notification) => {
                                    const notif = getNotificationMessage(notification);
                                    return (
                                        <div
                                            key={notification.id}
                                            className={`flex items-start gap-4 p-4 rounded-lg ${notif.bgColor} ${
                                                !notification.read_at ? 'border-l-4 border-blue-500' : ''
                                            }`}
                                        >
                                            <div className="flex-shrink-0 mt-1">{notif.icon}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {notif.title}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Date Range Selector */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleDateChange}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Key Metrics with Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Revenue */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiDollarSign className="text-green-600" size={24} />
                                </div>
                                {getChangeIndicator(salesSummary.comparison.revenue_change)}
                            </div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {formatCurrency(salesSummary.total_revenue)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Net: {formatCurrency(salesSummary.net_revenue)} (after{' '}
                                {salesSummary.commission_rate}% commission)
                            </p>
                        </div>

                        {/* Orders Count */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiShoppingCart className="text-blue-600" size={24} />
                                </div>
                                {getChangeIndicator(salesSummary.comparison.orders_change)}
                            </div>
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {salesSummary.orders_count.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Pending: {ordersBreakdown.pending_shipments}
                            </p>
                        </div>

                        {/* Average Order Value */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FiTrendingUp className="text-purple-600" size={24} />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Avg Order Value</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {formatCurrency(salesSummary.avg_order_value)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {salesSummary.items_sold} items sold
                            </p>
                        </div>

                        {/* Success Rate */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <FiPackage className="text-yellow-600" size={24} />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Success Rate</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {ordersBreakdown.success_rate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {conversionStats.active_products} active products
                            </p>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Revenue Trend */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
                            <div style={{ height: '300px' }}>
                                <LineChart
                                    data={revenueChartData}
                                    title="Daily Revenue"
                                    yAxisLabel="Revenue (USD)"
                                />
                            </div>
                        </div>

                        {/* Orders by Status */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Orders by Status</h2>
                            <div style={{ height: '300px' }}>
                                <DoughnutChart
                                    data={ordersByStatusData}
                                    title="Order Status Distribution"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pending Actions & Alerts */}
                    {(ordersBreakdown.pending_shipments > 0 || conversionStats.low_stock_count > 0) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                            <div className="flex items-start">
                                <FiAlertTriangle className="text-yellow-600 mt-1 mr-3" size={24} />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Pending Actions
                                    </h3>
                                    <ul className="space-y-2">
                                        {ordersBreakdown.pending_shipments > 0 && (
                                            <li className="text-sm text-gray-700">
                                                <strong>{ordersBreakdown.pending_shipments}</strong> orders
                                                pending shipment
                                            </li>
                                        )}
                                        {conversionStats.low_stock_count > 0 && (
                                            <li className="text-sm text-gray-700">
                                                <strong>{conversionStats.low_stock_count}</strong> products
                                                low in stock (≤ 10 units)
                                            </li>
                                        )}
                                        {conversionStats.out_of_stock_count > 0 && (
                                            <li className="text-sm text-gray-700">
                                                <strong>{conversionStats.out_of_stock_count}</strong> products
                                                out of stock
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top Selling Products & Recent Orders Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Selling Products */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
                                <a
                                    href={route('vendor.analytics.products')}
                                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                                >
                                    View All
                                    <FiExternalLink className="ml-1" size={14} />
                                </a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                                                Product
                                            </th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                                                Sold
                                            </th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topProducts.slice(0, 5).map((product) => (
                                            <tr
                                                key={product.product_id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-3 px-2 text-sm text-gray-900">
                                                    {product.product_name}
                                                </td>
                                                <td className="text-right py-3 px-2 text-sm text-gray-600">
                                                    {product.units_sold}
                                                </td>
                                                <td className="text-right py-3 px-2 text-sm font-medium text-gray-900">
                                                    {formatCurrency(product.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                                <a
                                    href={route('vendor.orders.index')}
                                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                                >
                                    View All
                                    <FiExternalLink className="ml-1" size={14} />
                                </a>
                            </div>
                            <div className="space-y-3">
                                {recentOrders.slice(0, 5).map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {order.order_number}
                                            </p>
                                            <p className="text-xs text-gray-600">{order.customer_name}</p>
                                        </div>
                                        <div className="text-right mr-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatCurrency(order.total_cents / 100)}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {order.items_count} items
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Products */}
                    {conversionStats.low_stock_products.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Low Stock Alert</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                Product
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                SKU
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Stock
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Price
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {conversionStats.low_stock_products.map((product) => (
                                            <tr
                                                key={product.product_id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-3 px-4 text-sm text-gray-900">
                                                    {product.product_name}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {product.sku}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            product.stock <= 5
                                                                ? 'text-red-600'
                                                                : 'text-yellow-600'
                                                        }`}
                                                    >
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm text-gray-900">
                                                    {formatCurrency(product.price)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
