import React from 'react';
import { Head } from '@inertiajs/react';
import { FiUsers, FiRepeat, FiDollarSign, FiGlobe, FiDownload } from 'react-icons/fi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import { PageProps } from '@/types';

interface GeoData {
    country: string;
    customers_count: number;
    orders_count: number;
    revenue: number;
}

interface TopCustomer {
    customer_id: number;
    customer_name: string;
    customer_email: string;
    orders_count: number;
    total_spent: number;
    avg_order_value: number;
}

interface CustomerInsights {
    total_customers: number;
    repeat_customers: number;
    repeat_rate: number;
    avg_lifetime_value: number;
    geo_distribution: GeoData[];
    top_customers: TopCustomer[];
}

interface Props extends PageProps {
    vendor: {
        id: number;
        business_name: string;
    };
    customerInsights: CustomerInsights;
}

export default function Customers({ auth, vendor, customerInsights }: Props) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Geo distribution chart data
    const geoChartData = {
        labels: customerInsights.geo_distribution.slice(0, 10).map((g) => g.country),
        datasets: [
            {
                data: customerInsights.geo_distribution.slice(0, 10).map((g) => g.customers_count),
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Customer Analytics" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Customer Analytics</h1>
                            <p className="mt-2 text-gray-600">{vendor.business_name}</p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={route('vendor.analytics.export', {
                                    type: 'customers',
                                    format: 'csv',
                                })}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export CSV
                            </a>
                            <a
                                href={route('vendor.analytics.export', {
                                    type: 'customers',
                                    format: 'xlsx',
                                })}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export Excel
                            </a>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Customers</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {customerInsights.total_customers.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Unique buyers</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiUsers className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Repeat Customer Rate</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {customerInsights.repeat_rate.toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {customerInsights.repeat_customers} repeat customers
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiRepeat className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Lifetime Value</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {formatCurrency(customerInsights.avg_lifetime_value)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Per customer</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FiDollarSign className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts and Tables Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Geographic Distribution */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Geographic Distribution (Top 10)
                            </h2>
                            <div style={{ height: '300px' }}>
                                <DoughnutChart data={geoChartData} title="Customers by Country" />
                            </div>
                        </div>

                        {/* Top Customers */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Customers</h2>
                            <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-white border-b border-gray-200">
                                        <tr>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                                                Customer
                                            </th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                                                Orders
                                            </th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                                                Spent
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerInsights.top_customers.map((customer) => (
                                            <tr
                                                key={customer.customer_id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-3 px-2 text-sm text-gray-900">
                                                    {customer.customer_name}
                                                </td>
                                                <td className="text-right py-3 px-2 text-sm text-gray-600">
                                                    {customer.orders_count}
                                                </td>
                                                <td className="text-right py-3 px-2 text-sm font-medium text-gray-900">
                                                    {formatCurrency(customer.total_spent)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Top Customers Detailed Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Customers Details</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                            Rank
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                            Customer
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                            Email
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Orders
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Total Spent
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Avg Order
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerInsights.top_customers.map((customer, index) => (
                                        <tr
                                            key={customer.customer_id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4 text-sm text-gray-900">#{index + 1}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {customer.customer_name}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {customer.customer_email}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {customer.orders_count}
                                            </td>
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
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Customer Distribution by Country
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                            Country
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Customers
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Orders
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Revenue
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Avg per Customer
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerInsights.geo_distribution.map((geo) => (
                                        <tr key={geo.country} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900 flex items-center gap-2">
                                                <FiGlobe className="text-gray-400" size={16} />
                                                {geo.country}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {geo.customers_count}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {geo.orders_count}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(geo.revenue)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {formatCurrency(
                                                    geo.customers_count > 0
                                                        ? geo.revenue / geo.customers_count
                                                        : 0
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-300">
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-bold text-gray-900">Total</td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {customerInsights.geo_distribution.reduce(
                                                (sum, g) => sum + g.customers_count,
                                                0
                                            )}
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {customerInsights.geo_distribution.reduce(
                                                (sum, g) => sum + g.orders_count,
                                                0
                                            )}
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {formatCurrency(
                                                customerInsights.geo_distribution.reduce(
                                                    (sum, g) => sum + g.revenue,
                                                    0
                                                )
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
