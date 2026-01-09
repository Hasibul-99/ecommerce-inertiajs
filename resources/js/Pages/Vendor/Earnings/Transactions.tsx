import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import { FiDownload, FiFilter, FiCalendar, FiDollarSign } from 'react-icons/fi';

interface Transaction {
    id: number;
    order_id: number;
    order_number: string;
    amount_cents: number;
    commission_cents: number;
    net_amount_cents: number;
    status: string;
    available_at: string;
    created_at: string;
}

interface Props {
    transactions: { data: Transaction[]; links: any; meta: any };
    filters: { status: string; date_from?: string; date_to?: string };
    stats: {
        total_transactions: number;
        total_gross_cents: number;
        total_commission_cents: number;
        total_net_cents: number;
    };
}

export default function TransactionsIndex({ transactions, filters, stats }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            available: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            withheld: 'bg-red-100 text-red-800',
            paid: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleApplyFilters = () => {
        router.get('/vendor/earnings/transactions', {
            status: statusFilter,
            date_from: dateFrom,
            date_to: dateTo,
        }, {
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        setStatusFilter('');
        setDateFrom('');
        setDateTo('');
        router.get('/vendor/earnings/transactions', {}, { preserveState: true });
    };

    const handleExport = () => {
        window.open(`/vendor/earnings/transactions/export?${new URLSearchParams({
            status: statusFilter,
            date_from: dateFrom,
            date_to: dateTo,
        }).toString()}`, '_blank');
    };

    return (
        <VendorLayout>
            <Head title="Earnings Transactions" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Earnings Transactions</h1>
                                <p className="text-gray-600 mt-1">Complete history of all earnings</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2">
                                    <FiFilter /> Filters
                                </button>
                                <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
                                    <FiDownload /> Export CSV
                                </button>
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">All Statuses</option>
                                        <option value="available">Available</option>
                                        <option value="pending">Pending</option>
                                        <option value="withheld">Withheld</option>
                                        <option value="paid">Paid</option>
                                        <option value="processing">Processing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleApplyFilters} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Apply Filters
                                </button>
                                <button onClick={handleClearFilters} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_transactions}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Gross Earnings</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(stats.total_gross_cents)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Commission</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(stats.total_commission_cents)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Net Earnings</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats.total_net_cents)}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Amount</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available At</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.data.length > 0 ? transactions.data.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link href={`/vendor/orders/${transaction.order_id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                                                    #{transaction.order_number}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                {formatCurrency(transaction.amount_cents)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                                                -{formatCurrency(transaction.commission_cents)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                                                {formatCurrency(transaction.net_amount_cents)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={'px-3 py-1 text-xs rounded-full ' + getStatusColor(transaction.status)}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(transaction.available_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                <FiDollarSign className="text-6xl text-gray-400 mx-auto mb-4" />
                                                <p className="text-lg font-medium">No transactions found</p>
                                                <p className="text-sm mt-1">Transactions will appear here once you start receiving orders</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {transactions.links && transactions.data.length > 0 && (
                            <div className="border-t border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing {transactions.meta.from} to {transactions.meta.to} of {transactions.meta.total} transactions
                                    </div>
                                    <div className="flex gap-2">
                                        {transactions.links.map((link: any, index: number) => (
                                            <button key={index} disabled={!link.url} onClick={() => link.url && router.get(link.url)} dangerouslySetInnerHTML={{ __html: link.label }} className={'px-3 py-2 rounded border text-sm ' + (link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50') + ' ' + (!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
}
