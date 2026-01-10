import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FiDownload, FiDollarSign, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import LineChart from '@/Components/Charts/LineChart';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import BarChart from '@/Components/Charts/BarChart';

interface SalesReport {
    total_revenue: number;
    total_revenue_cents: number;
    orders_count: number;
    avg_order_value: number;
    avg_order_value_cents: number;
    by_payment_method: Array<{
        payment_method: string;
        revenue: number;
        revenue_cents: number;
    }>;
    by_vendor: Array<{
        vendor_id: number;
        vendor_name: string;
        revenue: number;
        orders_count: number;
    }>;
    daily_trend: Array<{
        date: string;
        revenue: number;
        orders_count: number;
    }>;
}

interface Props {
    dateRange: {
        from: string;
        to: string;
    };
    filters: {
        vendor_id?: number;
        payment_method?: string;
    };
    report: SalesReport;
}

export default function Sales({ dateRange, filters, report }: Props) {
    const [from, setFrom] = useState(dateRange.from);
    const [to, setTo] = useState(dateRange.to);
    const [vendorId, setVendorId] = useState(filters.vendor_id || '');
    const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || '');

    const handleFilter = () => {
        router.get(route('admin.reports.sales'), {
            from,
            to,
            vendor_id: vendorId,
            payment_method: paymentMethod,
        }, {
            preserveState: true,
        });
    };

    const handleExport = (format: 'csv' | 'xlsx') => {
        window.location.href = route('admin.reports.export', {
            type: 'sales',
            format,
            from,
            to,
            vendor_id: vendorId,
            payment_method: paymentMethod,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Prepare chart data
    const revenueTrendData = {
        labels: report.daily_trend.map((item) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Revenue',
                data: report.daily_trend.map((item) => item.revenue),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const avgOrderValueData = {
        labels: report.daily_trend.map((item) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Avg Order Value',
                data: report.daily_trend.map((item) => item.orders_count > 0 ? item.revenue / item.orders_count : 0),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const paymentMethodData = {
        labels: report.by_payment_method.map((item) => item.payment_method.toUpperCase()),
        datasets: [
            {
                data: report.by_payment_method.map((item) => item.revenue),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
            },
        ],
    };

    const vendorRevenueData = {
        labels: report.by_vendor.slice(0, 10).map((item) => item.vendor_name),
        datasets: [
            {
                label: 'Revenue',
                data: report.by_vendor.slice(0, 10).map((item) => item.revenue),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
        ],
    };

    return (
        <>
            <Head title="Sales Report" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
                            <p className="mt-2 text-gray-600">Detailed sales analytics and revenue breakdown</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport('csv')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export CSV
                            </button>
                            <button
                                onClick={() => handleExport('xlsx')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Methods</option>
                                    <option value="card">Card</option>
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="wallet">Wallet</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleFilter}
                                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(report.total_revenue)}</p>
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
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{report.orders_count.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiShoppingCart className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(report.avg_order_value)}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FiTrendingUp className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Revenue Trend */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
                            <div style={{ height: '300px' }}>
                                <LineChart data={revenueTrendData} title="Daily Revenue" yAxisLabel="Revenue (USD)" />
                            </div>
                        </div>

                        {/* Average Order Value Trend */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Average Order Value Trend</h2>
                            <div style={{ height: '300px' }}>
                                <LineChart data={avgOrderValueData} title="Avg Order Value" yAxisLabel="Value (USD)" />
                            </div>
                        </div>

                        {/* Revenue by Payment Method */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue by Payment Method</h2>
                            <div style={{ height: '300px' }}>
                                <DoughnutChart data={paymentMethodData} title="Payment Methods" />
                            </div>
                        </div>

                        {/* Top Vendors by Revenue */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Vendors by Revenue</h2>
                            <div style={{ height: '300px' }}>
                                <BarChart data={vendorRevenueData} title="Vendor Revenue" yAxisLabel="Revenue (USD)" />
                            </div>
                        </div>
                    </div>

                    {/* Revenue by Vendor Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue by Vendor</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vendor</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Orders</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.by_vendor.map((vendor, index) => (
                                        <tr key={vendor.vendor_id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-900">#{index + 1}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{vendor.vendor_name}</td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">{vendor.orders_count}</td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
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
        </>
    );
}
