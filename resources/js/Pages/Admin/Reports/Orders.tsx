import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FiDownload, FiShoppingCart, FiCheckCircle, FiXCircle, FiClock, FiActivity } from 'react-icons/fi';
import LineChart from '@/Components/Charts/LineChart';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import BarChart from '@/Components/Charts/BarChart';
import AdminLayout from '@/Layouts/AdminLayout';

interface OrdersReport {
    total_orders: number;
    successful_orders: number;
    failed_orders: number;
    success_rate: number;
    by_status: Array<{
        status: string;
        count: number;
        revenue: number;
    }>;
    by_payment_method: Array<{
        payment_method: string;
        count: number;
        revenue: number;
    }>;
    avg_fulfillment_hours: number;
    daily_trend: Array<{
        date: string;
        count: number;
        delivered: number;
        failed: number;
    }>;
}

interface CodReport {
    cod_orders: number;
    cod_revenue: number;
    prepaid_orders: number;
    prepaid_revenue: number;
    cod_success_rate: number;
    cod_delivered: number;
    cod_cancelled: number;
    daily_comparison: Array<{
        date: string;
        cod_orders: number;
        prepaid_orders: number;
        cod_revenue: number;
        prepaid_revenue: number;
    }>;
}

interface Props {
    dateRange: {
        from: string;
        to: string;
    };
    filters: {
        status?: string;
        payment_method?: string;
    };
    report: OrdersReport;
    codReport: CodReport;
}

export default function Orders({ auth, dateRange, filters, report, codReport }: Props) {
    const [from, setFrom] = useState(dateRange.from);
    const [to, setTo] = useState(dateRange.to);
    const [status, setStatus] = useState(filters.status || '');
    const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || '');

    const handleFilter = () => {
        router.get(route('admin.reports.orders'), {
            from,
            to,
            status,
            payment_method: paymentMethod,
        }, {
            preserveState: true,
        });
    };

    const handleExport = (format: 'csv' | 'xlsx') => {
        window.location.href = route('admin.reports.export', {
            type: 'orders',
            format,
            from,
            to,
            status,
            payment_method: paymentMethod,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Prepare chart data
    const ordersTrendData = {
        labels: report.daily_trend.map((item) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Total Orders',
                data: report.daily_trend.map((item) => item.count),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Delivered',
                data: report.daily_trend.map((item) => item.delivered),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Failed',
                data: report.daily_trend.map((item) => item.failed),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const statusBreakdownData = {
        labels: report.by_status.map((item) => item.status.charAt(0).toUpperCase() + item.status.slice(1)),
        datasets: [
            {
                data: report.by_status.map((item) => item.count),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                ],
            },
        ],
    };

    const paymentMethodData = {
        labels: report.by_payment_method.map((item) => item.payment_method.toUpperCase()),
        datasets: [
            {
                label: 'Orders',
                data: report.by_payment_method.map((item) => item.count),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
        ],
    };

    const codComparisonData = {
        labels: codReport.daily_comparison.map((item) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'COD Orders',
                data: codReport.daily_comparison.map((item) => item.cod_orders),
                backgroundColor: 'rgba(251, 191, 36, 0.8)',
            },
            {
                label: 'Prepaid Orders',
                data: codReport.daily_comparison.map((item) => item.prepaid_orders),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
            },
        ],
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <FiActivity className="h-6 w-6" />
                        Admin Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Orders Report" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Orders Report</h1>
                            <p className="mt-2 text-gray-600">Order analytics and performance metrics</p>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="failed">Failed</option>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{report.total_orders.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiShoppingCart className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Successful Orders</p>
                                    <p className="text-2xl font-bold text-green-600 mt-2">{report.successful_orders.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiCheckCircle className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Failed Orders</p>
                                    <p className="text-2xl font-bold text-red-600 mt-2">{report.failed_orders.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <FiXCircle className="text-red-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Success Rate</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{report.success_rate.toFixed(1)}%</p>
                                    <p className="text-sm text-gray-500 mt-1">{report.avg_fulfillment_hours}h avg</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FiClock className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Trend Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Orders Trend</h2>
                        <div style={{ height: '350px' }}>
                            <LineChart data={ordersTrendData} title="Daily Orders" yAxisLabel="Number of Orders" />
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Order Status Breakdown */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status Breakdown</h2>
                            <div style={{ height: '300px' }}>
                                <DoughnutChart data={statusBreakdownData} title="Orders by Status" />
                            </div>
                        </div>

                        {/* Orders by Payment Method */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Orders by Payment Method</h2>
                            <div style={{ height: '300px' }}>
                                <BarChart data={paymentMethodData} title="Payment Methods" yAxisLabel="Number of Orders" />
                            </div>
                        </div>
                    </div>

                    {/* COD Analysis Section */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">COD vs Prepaid Analysis</h2>

                        {/* COD Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-600">COD Orders</p>
                                <p className="text-xl font-bold text-yellow-600 mt-2">{codReport.cod_orders.toLocaleString()}</p>
                                <p className="text-sm text-gray-500 mt-1">{formatCurrency(codReport.cod_revenue)}</p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-600">Prepaid Orders</p>
                                <p className="text-xl font-bold text-green-600 mt-2">{codReport.prepaid_orders.toLocaleString()}</p>
                                <p className="text-sm text-gray-500 mt-1">{formatCurrency(codReport.prepaid_revenue)}</p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-600">COD Success Rate</p>
                                <p className="text-xl font-bold text-gray-900 mt-2">{codReport.cod_success_rate.toFixed(1)}%</p>
                                <p className="text-sm text-gray-500 mt-1">{codReport.cod_delivered} delivered</p>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-600">COD Cancelled</p>
                                <p className="text-xl font-bold text-red-600 mt-2">{codReport.cod_cancelled.toLocaleString()}</p>
                                <p className="text-sm text-gray-500 mt-1">Failed deliveries</p>
                            </div>
                        </div>

                        {/* COD vs Prepaid Comparison Chart */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Daily COD vs Prepaid Comparison</h3>
                            <div style={{ height: '300px' }}>
                                <BarChart data={codComparisonData} title="COD vs Prepaid" yAxisLabel="Number of Orders" />
                            </div>
                        </div>
                    </div>

                    {/* Status Details Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status Details</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Count</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Percentage</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.by_status.map((item) => (
                                        <tr key={item.status} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900 capitalize">{item.status}</td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">{item.count.toLocaleString()}</td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {((item.count / report.total_orders) * 100).toFixed(1)}%
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(item.revenue)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
