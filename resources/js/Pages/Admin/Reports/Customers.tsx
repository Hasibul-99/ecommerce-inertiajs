import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FiDownload, FiUsers, FiUserPlus, FiDollarSign, FiGlobe } from 'react-icons/fi';
import LineChart from '@/Components/Charts/LineChart';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import BarChart from '@/Components/Charts/BarChart';

interface TopCustomer {
    customer_id: number;
    customer_name: string;
    customer_email: string;
    orders_count: number;
    total_spent: number;
    avg_order_value: number;
}

interface AcquisitionData {
    date: string;
    count: number;
}

interface GeoData {
    country: string;
    customers_count: number;
    orders_count: number;
    revenue: number;
}

interface CustomersReport {
    total_customers: number;
    new_customers: number;
    avg_lifetime_value: number;
    top_customers: TopCustomer[];
    acquisition_trend: AcquisitionData[];
    geo_distribution: GeoData[];
}

interface Props {
    dateRange: {
        from: string;
        to: string;
    };
    report: CustomersReport;
}

export default function Customers({ dateRange, report }: Props) {
    const [from, setFrom] = useState(dateRange.from);
    const [to, setTo] = useState(dateRange.to);

    const handleDateChange = () => {
        router.get(route('admin.reports.customers'), {
            from,
            to,
        }, {
            preserveState: true,
        });
    };

    const handleExport = (format: 'csv' | 'xlsx') => {
        window.location.href = route('admin.reports.export', {
            type: 'customers',
            format,
            from,
            to,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Prepare chart data
    const acquisitionTrendData = {
        labels: report.acquisition_trend.map((item) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'New Customers',
                data: report.acquisition_trend.map((item) => item.count),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const geoDistributionData = {
        labels: report.geo_distribution.slice(0, 10).map((item) => item.country),
        datasets: [
            {
                data: report.geo_distribution.slice(0, 10).map((item) => item.customers_count),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(20, 184, 166, 0.8)',
                    'rgba(217, 70, 239, 0.8)',
                ],
            },
        ],
    };

    const topCustomersSpendData = {
        labels: report.top_customers.slice(0, 10).map((c) => c.customer_name),
        datasets: [
            {
                label: 'Total Spent',
                data: report.top_customers.slice(0, 10).map((c) => c.total_spent),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
            },
        ],
    };

    return (
        <>
            <Head title="Customers Report" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Customers Report</h1>
                            <p className="mt-2 text-gray-600">Customer analytics and lifetime value</p>
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

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Customers</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{report.total_customers.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">Registered users</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiUsers className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">New Customers</p>
                                    <p className="text-2xl font-bold text-green-600 mt-2">{report.new_customers.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">In date range</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiUserPlus className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Lifetime Value</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(report.avg_lifetime_value)}</p>
                                    <p className="text-sm text-gray-500 mt-1">Per customer</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FiDollarSign className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Acquisition Trend */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Acquisition Trend</h2>
                        <div style={{ height: '350px' }}>
                            <LineChart data={acquisitionTrendData} title="New Customers" yAxisLabel="Number of Customers" />
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Geographic Distribution */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Geographic Distribution (Top 10)</h2>
                            <div style={{ height: '300px' }}>
                                <DoughnutChart data={geoDistributionData} title="Customers by Country" />
                            </div>
                        </div>

                        {/* Top Customers by Spend */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Customers by Spend</h2>
                            <div style={{ height: '300px' }}>
                                <BarChart data={topCustomersSpendData} title="Customer Spending" yAxisLabel="Total Spent (USD)" />
                            </div>
                        </div>
                    </div>

                    {/* Top Customers Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Customers by Spend</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Orders</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Spent</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Order Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.top_customers.map((customer, index) => (
                                        <tr key={customer.customer_id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-900">#{index + 1}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{customer.customer_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{customer.customer_email}</td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">{customer.orders_count}</td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(customer.total_spent)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {formatCurrency(customer.avg_order_value)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Geographic Distribution Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Distribution by Country</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Country</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Customers</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Orders</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg per Customer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.geo_distribution.map((geo) => (
                                        <tr key={geo.country} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900 flex items-center gap-2">
                                                <FiGlobe className="text-gray-400" size={16} />
                                                {geo.country}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">{geo.customers_count}</td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">{geo.orders_count}</td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(geo.revenue)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {formatCurrency(geo.customers_count > 0 ? geo.revenue / geo.customers_count : 0)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-300">
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-bold text-gray-900">Total</td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {report.geo_distribution.reduce((sum, g) => sum + g.customers_count, 0)}
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {report.geo_distribution.reduce((sum, g) => sum + g.orders_count, 0)}
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {formatCurrency(report.geo_distribution.reduce((sum, g) => sum + g.revenue, 0))}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
