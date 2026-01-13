import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FiDollarSign, FiShoppingCart, FiUsers, FiShoppingBag, FiTrendingUp, FiDownload } from 'react-icons/fi';
import LineChart from '@/Components/Charts/LineChart';
import BarChart from '@/Components/Charts/BarChart';
import DoughnutChart from '@/Components/Charts/DoughnutChart';

interface Metrics {
    revenue: number;
    revenue_cents: number;
    orders: number;
    customers: number;
    vendors: number;
    avg_order_value: number;
    success_rate: number;
}

interface ChartData {
    revenue_trend: Array<{
        date: string;
        revenue: number;
        orders_count: number;
    }>;
    orders_trend: Array<{
        date: string;
        count: number;
        delivered: number;
        failed: number;
    }>;
    orders_by_status: Array<{
        status: string;
        count: number;
        revenue: number;
    }>;
}

interface Product {
    product_id: number;
    product_name: string;
    units_sold: number;
    revenue: number;
}

interface Vendor {
    vendor_id: number;
    vendor_name: string;
    orders_count: number;
    revenue: number;
    commission: number;
}

interface Props {
    dateRange: {
        from: string;
        to: string;
    };
    metrics: Metrics;
    charts: ChartData;
    top_products: Product[];
    top_vendors: Vendor[];
}

export default function Dashboard({ dateRange, metrics, charts, top_products, top_vendors }: Props) {
    const [from, setFrom] = useState(dateRange.from);
    const [to, setTo] = useState(dateRange.to);

    const handleDateChange = () => {
        router.get(route('admin.reports.dashboard'), {
            from,
            to,
        }, {
            preserveState: true,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Prepare chart data
    const revenueChartData = {
        labels: charts.revenue_trend.map((item) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Revenue',
                data: charts.revenue_trend.map((item) => item.revenue),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const ordersChartData = {
        labels: charts.orders_trend.map((item) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Total Orders',
                data: charts.orders_trend.map((item) => item.count),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
                label: 'Delivered',
                data: charts.orders_trend.map((item) => item.delivered),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
            },
            {
                label: 'Failed',
                data: charts.orders_trend.map((item) => item.failed),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
            },
        ],
    };

    const statusChartData = {
        labels: charts.orders_by_status.map((item) => item.status.charAt(0).toUpperCase() + item.status.slice(1)),
        datasets: [
            {
                data: charts.orders_by_status.map((item) => item.count),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                ],
            },
        ],
    };

    return (
        <>
            <Head title="Reports Dashboard" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="mt-2 text-gray-600">Overview of your platform performance</p>
                    </div>

                    {/* Date Range Picker */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
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

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(metrics.revenue)}</p>
                                    <p className="text-sm text-gray-500 mt-1">{metrics.orders} orders</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiDollarSign className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.orders.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">{metrics.success_rate.toFixed(1)}% success rate</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiShoppingCart className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Customers</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.customers.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">Active users</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FiUsers className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(metrics.avg_order_value)}</p>
                                    <p className="text-sm text-gray-500 mt-1">{metrics.vendors} vendors</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <FiTrendingUp className="text-yellow-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Revenue Trend */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
                            <div style={{ height: '300px' }}>
                                <LineChart data={revenueChartData} title="Revenue Over Time" yAxisLabel="Revenue (USD)" />
                            </div>
                        </div>

                        {/* Orders Breakdown */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Orders Status Breakdown</h2>
                            <div style={{ height: '300px' }}>
                                <DoughnutChart data={statusChartData} title="Orders by Status" />
                            </div>
                        </div>
                    </div>

                    {/* Orders Trend Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Orders Trend</h2>
                        <div style={{ height: '350px' }}>
                            <BarChart data={ordersChartData} title="Orders by Date" yAxisLabel="Number of Orders" />
                        </div>
                    </div>

                    {/* Tables Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Products */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Products</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Product</th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Units</th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top_products.map((product, index) => (
                                            <tr key={product.product_id} className="border-b border-gray-100">
                                                <td className="py-3 px-2 text-sm text-gray-900">
                                                    <span className="font-medium">#{index + 1}</span> {product.product_name}
                                                </td>
                                                <td className="text-right py-3 px-2 text-sm text-gray-600">{product.units_sold}</td>
                                                <td className="text-right py-3 px-2 text-sm font-medium text-gray-900">
                                                    {formatCurrency(product.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Vendors */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Vendors</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Vendor</th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Orders</th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top_vendors.map((vendor, index) => (
                                            <tr key={vendor.vendor_id} className="border-b border-gray-100">
                                                <td className="py-3 px-2 text-sm text-gray-900">
                                                    <span className="font-medium">#{index + 1}</span> {vendor.vendor_name}
                                                </td>
                                                <td className="text-right py-3 px-2 text-sm text-gray-600">{vendor.orders_count}</td>
                                                <td className="text-right py-3 px-2 text-sm font-medium text-gray-900">
                                                    {formatCurrency(vendor.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
