import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FiDownload, FiShoppingBag, FiPackage, FiDollarSign, FiTrendingUp, FiStar } from 'react-icons/fi';
import BarChart from '@/Components/Charts/BarChart';

interface VendorPerformance {
    vendor_id: number;
    vendor_name: string;
    orders_count: number;
    products_count: number;
    revenue: number;
    revenue_cents: number;
    commission_rate: number;
    commission: number;
    commission_cents: number;
    fulfillment_rate: number;
    avg_fulfillment_hours: number;
}

interface VendorsReport {
    total_vendors: number;
    active_vendors: number;
    vendor_performance: VendorPerformance[];
}

interface Props {
    dateRange: {
        from: string;
        to: string;
    };
    report: VendorsReport;
}

export default function Vendors({ dateRange, report }: Props) {
    const [from, setFrom] = useState(dateRange.from);
    const [to, setTo] = useState(dateRange.to);
    const [sortBy, setSortBy] = useState<'revenue' | 'orders' | 'fulfillment'>('revenue');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handleDateChange = () => {
        router.get(route('admin.reports.vendors'), {
            from,
            to,
        }, {
            preserveState: true,
        });
    };

    const handleExport = (format: 'csv' | 'xlsx') => {
        window.location.href = route('admin.reports.export', {
            type: 'vendors',
            format,
            from,
            to,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Sort vendors
    const sortedVendors = [...report.vendor_performance].sort((a, b) => {
        let compareValue = 0;
        switch (sortBy) {
            case 'revenue':
                compareValue = a.revenue - b.revenue;
                break;
            case 'orders':
                compareValue = a.orders_count - b.orders_count;
                break;
            case 'fulfillment':
                compareValue = a.fulfillment_rate - b.fulfillment_rate;
                break;
        }
        return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    // Calculate totals
    const totalRevenue = report.vendor_performance.reduce((sum, v) => sum + v.revenue, 0);
    const totalCommission = report.vendor_performance.reduce((sum, v) => sum + v.commission, 0);
    const totalOrders = report.vendor_performance.reduce((sum, v) => sum + v.orders_count, 0);

    // Top 10 vendors by revenue
    const topVendorsByRevenue = {
        labels: sortedVendors.slice(0, 10).map((v) => v.vendor_name),
        datasets: [
            {
                label: 'Revenue',
                data: sortedVendors.slice(0, 10).map((v) => v.revenue),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
        ],
    };

    // Top 10 vendors by commission
    const topVendorsByCommission = {
        labels: sortedVendors.slice(0, 10).map((v) => v.vendor_name),
        datasets: [
            {
                label: 'Commission',
                data: sortedVendors.slice(0, 10).map((v) => v.commission),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
            },
        ],
    };

    const handleSort = (column: 'revenue' | 'orders' | 'fulfillment') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (column: 'revenue' | 'orders' | 'fulfillment') => {
        if (sortBy !== column) return '↕';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <>
            <Head title="Vendors Report" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Vendors Report</h1>
                            <p className="mt-2 text-gray-600">Vendor performance and commission analytics</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Vendors</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{report.total_vendors}</p>
                                    <p className="text-sm text-gray-500 mt-1">{report.active_vendors} active</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiShoppingBag className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalRevenue)}</p>
                                    <p className="text-sm text-gray-500 mt-1">{totalOrders} orders</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiDollarSign className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Commission</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalCommission)}</p>
                                    <p className="text-sm text-gray-500 mt-1">Platform earnings</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FiTrendingUp className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Fulfillment</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {report.vendor_performance.length > 0
                                            ? (
                                                  report.vendor_performance.reduce((sum, v) => sum + v.fulfillment_rate, 0) /
                                                  report.vendor_performance.length
                                              ).toFixed(1)
                                            : 0}
                                        %
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Success rate</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <FiStar className="text-yellow-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Top Vendors by Revenue */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Vendors by Revenue</h2>
                            <div style={{ height: '300px' }}>
                                <BarChart data={topVendorsByRevenue} title="Vendor Revenue" yAxisLabel="Revenue (USD)" />
                            </div>
                        </div>

                        {/* Top Vendors by Commission */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Vendors by Commission</h2>
                            <div style={{ height: '300px' }}>
                                <BarChart data={topVendorsByCommission} title="Commission Earned" yAxisLabel="Commission (USD)" />
                            </div>
                        </div>
                    </div>

                    {/* Vendor Performance Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Vendor Performance Rankings</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vendor</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            <button
                                                onClick={() => handleSort('orders')}
                                                className="hover:text-blue-600 flex items-center gap-1 ml-auto"
                                            >
                                                Orders {getSortIcon('orders')}
                                            </button>
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Products</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            <button
                                                onClick={() => handleSort('revenue')}
                                                className="hover:text-blue-600 flex items-center gap-1 ml-auto"
                                            >
                                                Revenue {getSortIcon('revenue')}
                                            </button>
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Commission</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            <button
                                                onClick={() => handleSort('fulfillment')}
                                                className="hover:text-blue-600 flex items-center gap-1 ml-auto"
                                            >
                                                Fulfillment {getSortIcon('fulfillment')}
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedVendors.map((vendor, index) => (
                                        <tr key={vendor.vendor_id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-900">#{index + 1}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{vendor.vendor_name}</td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">{vendor.orders_count}</td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">{vendor.products_count}</td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(vendor.revenue)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-green-600">
                                                {formatCurrency(vendor.commission)}
                                                <span className="text-xs text-gray-500 ml-1">({vendor.commission_rate}%)</span>
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {vendor.fulfillment_rate.toFixed(1)}%
                                                    </span>
                                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${vendor.fulfillment_rate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-300">
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-bold text-gray-900" colSpan={2}>
                                            Total
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">{totalOrders}</td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {report.vendor_performance.reduce((sum, v) => sum + v.products_count, 0)}
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {formatCurrency(totalRevenue)}
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-green-600">
                                            {formatCurrency(totalCommission)}
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
