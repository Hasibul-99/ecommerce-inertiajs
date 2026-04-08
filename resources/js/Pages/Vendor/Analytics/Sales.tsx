import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiDownload } from 'react-icons/fi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LineChart from '@/Components/Charts/LineChart';
import BarChart from '@/Components/Charts/BarChart';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import { PageProps } from '@/types';

interface SalesSummary {
    total_revenue: number;
    net_revenue: number;
    commission: number;
    commission_rate: number;
    orders_count: number;
    avg_order_value: number;
}

interface RevenueData {
    date?: string;
    hour?: number;
    day_of_week?: number;
    day_name?: string;
    revenue: number;
    orders_count: number;
}

interface PaymentMethod {
    payment_method: string;
    count: number;
    revenue: number;
}

interface Product {
    product_id: number;
    product_name: string;
    units_sold: number;
    revenue: number;
}

interface Props extends PageProps {
    dateRange: {
        from: string;
        to: string;
    };
    vendor: {
        id: number;
        business_name: string;
        commission_rate: number;
    };
    salesSummary: SalesSummary;
    revenueByDay: RevenueData[];
    revenueByHour: RevenueData[];
    revenueByWeekday: RevenueData[];
    paymentMethodBreakdown: PaymentMethod[];
    productPerformance: Product[];
}

export default function Sales({
    auth,
    dateRange,
    vendor,
    salesSummary,
    revenueByDay,
    revenueByHour,
    revenueByWeekday,
    paymentMethodBreakdown,
    productPerformance,
}: Props) {
    const [from, setFrom] = useState(dateRange.from);
    const [to, setTo] = useState(dateRange.to);

    const handleDateChange = () => {
        router.get(route('vendor.analytics.sales'), {
            from,
            to,
        }, {
            preserveState: true,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Chart data
    const dailyRevenueData = {
        labels: revenueByDay.map((item) =>
            new Date(item.date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [
            {
                label: 'Revenue',
                data: revenueByDay.map((item) => item.revenue),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const hourlyRevenueData = {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
            {
                label: 'Revenue by Hour',
                data: Array.from({ length: 24 }, (_, hour) => {
                    const data = revenueByHour.find((item) => item.hour === hour);
                    return data ? data.revenue : 0;
                }),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
            },
        ],
    };

    const weekdayRevenueData = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
            {
                label: 'Revenue by Day',
                data: Array.from({ length: 7 }, (_, day) => {
                    const data = revenueByWeekday.find((item) => item.day_of_week === day + 1);
                    return data ? data.revenue : 0;
                }),
                backgroundColor: 'rgba(168, 85, 247, 0.8)',
            },
        ],
    };

    const paymentMethodData = {
        labels: paymentMethodBreakdown.map((item) => item.payment_method.toUpperCase()),
        datasets: [
            {
                data: paymentMethodBreakdown.map((item) => item.revenue),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
            },
        ],
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sales Analytics" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
                            <p className="mt-2 text-gray-600">{vendor.business_name}</p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={route('vendor.analytics.export', {
                                    type: 'sales_daily',
                                    format: 'csv',
                                    from,
                                    to,
                                })}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export CSV
                            </a>
                            <a
                                href={route('vendor.analytics.export', {
                                    type: 'sales_daily',
                                    format: 'xlsx',
                                    from,
                                    to,
                                })}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export Excel
                            </a>
                        </div>
                    </div>

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

                    {/* Summary Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {formatCurrency(salesSummary.total_revenue)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Net: {formatCurrency(salesSummary.net_revenue)}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiDollarSign className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {salesSummary.orders_count.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiShoppingCart className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {formatCurrency(salesSummary.avg_order_value)}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FiTrendingUp className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Daily Revenue Trend */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Revenue Trend</h2>
                        <div style={{ height: '350px' }}>
                            <LineChart
                                data={dailyRevenueData}
                                title="Revenue Over Time"
                                yAxisLabel="Revenue (USD)"
                            />
                        </div>
                    </div>

                    {/* Time Analysis Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Hourly Revenue */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Revenue by Hour of Day
                            </h2>
                            <div style={{ height: '300px' }}>
                                <BarChart
                                    data={hourlyRevenueData}
                                    title="Hourly Revenue"
                                    yAxisLabel="Revenue (USD)"
                                />
                            </div>
                        </div>

                        {/* Weekday Revenue */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Revenue by Day of Week
                            </h2>
                            <div style={{ height: '300px' }}>
                                <BarChart
                                    data={weekdayRevenueData}
                                    title="Weekday Revenue"
                                    yAxisLabel="Revenue (USD)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method & Product Performance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Payment Method Breakdown */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Revenue by Payment Method
                            </h2>
                            <div style={{ height: '300px' }}>
                                <DoughnutChart data={paymentMethodData} title="Payment Methods" />
                            </div>
                            <div className="mt-4 space-y-2">
                                {paymentMethodBreakdown.map((method) => (
                                    <div
                                        key={method.payment_method}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                    >
                                        <span className="text-sm font-medium text-gray-900">
                                            {method.payment_method.toUpperCase()}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                {formatCurrency(method.revenue)}
                                            </p>
                                            <p className="text-xs text-gray-600">{method.count} orders</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Products by Revenue */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Top 10 Products by Revenue
                            </h2>
                            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-white border-b border-gray-200">
                                        <tr>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                                                Product
                                            </th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                                                Units
                                            </th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productPerformance.slice(0, 10).map((product, index) => (
                                            <tr
                                                key={product.product_id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-3 px-2 text-sm text-gray-900">
                                                    <span className="font-medium">#{index + 1}</span>{' '}
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
                    </div>

                    {/* Product Performance Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Product Revenue Breakdown</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                            Rank
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                            Product
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Units Sold
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Revenue
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Avg Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productPerformance.map((product, index) => (
                                        <tr
                                            key={product.product_id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4 text-sm text-gray-900">
                                                #{index + 1}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {product.product_name}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {product.units_sold}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(product.revenue)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {formatCurrency(product.revenue / product.units_sold)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-300">
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-bold text-gray-900" colSpan={2}>
                                            Total
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {productPerformance.reduce((sum, p) => sum + p.units_sold, 0)}
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {formatCurrency(
                                                productPerformance.reduce((sum, p) => sum + p.revenue, 0)
                                            )}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
