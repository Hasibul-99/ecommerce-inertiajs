import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiFilter, FiDownload, FiCheck } from 'react-icons/fi';

interface Payout {
    id: number;
    payout_id: string;
    vendor_id: number;
    vendor_name: string;
    amount_cents: number;
    processing_fee_cents: number;
    net_amount_cents: number;
    status: string;
    payout_method: string;
    period_start: string;
    period_end: string;
    items_count: number;
    created_at: string;
    processed_at: string | null;
    requested_by_name: string | null;
}

interface Props {
    payouts: { data: Payout[]; links: any; meta: any };
    filters: { status: string; vendor_id?: number; date_from?: string; date_to?: string };
    stats: {
        pending_count: number;
        pending_amount_cents: number;
        processing_count: number;
        processing_amount_cents: number;
        completed_today_count: number;
        completed_today_cents: number;
        total_payouts_count: number;
        total_payouts_cents: number;
    };
}

export default function PayoutsIndex({ payouts, filters, stats }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPayouts, setSelectedPayouts] = useState<number[]>([]);
    const [processing, setProcessing] = useState(false);
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedPayoutForAction, setSelectedPayoutForAction] = useState<Payout | null>(null);
    const [transactionDetails, setTransactionDetails] = useState('');
    const [cancelReason, setCancelReason] = useState('');

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleToggleSelection = (payoutId: number) => {
        if (selectedPayouts.includes(payoutId)) {
            setSelectedPayouts(selectedPayouts.filter(id => id !== payoutId));
        } else {
            setSelectedPayouts([...selectedPayouts, payoutId]);
        }
    };

    const handleToggleAll = () => {
        if (selectedPayouts.length === payouts.data.filter(p => p.status === 'pending').length) {
            setSelectedPayouts([]);
        } else {
            setSelectedPayouts(payouts.data.filter(p => p.status === 'pending').map(p => p.id));
        }
    };

    const handleApplyFilters = () => {
        router.get('/admin/payouts', {
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
        router.get('/admin/payouts', {}, { preserveState: true });
    };

    const handleExport = () => {
        window.open(`/admin/payouts/export?${new URLSearchParams({
            status: statusFilter,
            date_from: dateFrom,
            date_to: dateTo,
        }).toString()}`, '_blank');
    };

    const handleBulkProcess = () => {
        if (selectedPayouts.length === 0) {
            alert('Please select payouts to process');
            return;
        }
        if (!confirm(`Process ${selectedPayouts.length} payout(s)? This action cannot be undone.`)) {
            return;
        }
        setProcessing(true);
        router.post('/admin/payouts/bulk-process', { payout_ids: selectedPayouts }, {
            onSuccess: () => setSelectedPayouts([]),
            onFinish: () => setProcessing(false),
        });
    };

    const handleProcessSingle = () => {
        if (!selectedPayoutForAction) return;
        if (!transactionDetails.trim()) {
            alert('Please enter transaction details');
            return;
        }
        setProcessing(true);
        router.post(`/admin/payouts/${selectedPayoutForAction.id}/process`, {
            transaction_details: transactionDetails,
        }, {
            onSuccess: () => {
                setShowProcessModal(false);
                setSelectedPayoutForAction(null);
                setTransactionDetails('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleCancel = () => {
        if (!selectedPayoutForAction) return;
        if (!cancelReason.trim()) {
            alert('Please enter cancellation reason');
            return;
        }
        setProcessing(true);
        router.post(`/admin/payouts/${selectedPayoutForAction.id}/cancel`, {
            reason: cancelReason,
        }, {
            onSuccess: () => {
                setShowCancelModal(false);
                setSelectedPayoutForAction(null);
                setCancelReason('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleRetry = (payout: Payout) => {
        if (!confirm(`Retry payout ${payout.payout_id}?`)) return;
        setProcessing(true);
        router.post(`/admin/payouts/${payout.id}/retry`, {}, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Payout Management" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
                                <p className="text-gray-600 mt-1">Process and manage vendor payouts</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2">
                                    <FiFilter /> Filters
                                </button>
                                <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
                                    <FiDownload /> Export
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
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="failed">Failed</option>
                                        <option value="cancelled">Cancelled</option>
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
                            <div className="flex items-center gap-3 mb-2">
                                <FiClock className="text-2xl text-yellow-600" />
                                <p className="text-sm text-gray-600">Pending</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.pending_count}</p>
                            <p className="text-sm text-yellow-600 mt-1">{formatCurrency(stats.pending_amount_cents)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiDollarSign className="text-2xl text-blue-600" />
                                <p className="text-sm text-gray-600">Processing</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.processing_count}</p>
                            <p className="text-sm text-blue-600 mt-1">{formatCurrency(stats.processing_amount_cents)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiCheckCircle className="text-2xl text-green-600" />
                                <p className="text-sm text-gray-600">Completed Today</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.completed_today_count}</p>
                            <p className="text-sm text-green-600 mt-1">{formatCurrency(stats.completed_today_cents)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiDollarSign className="text-2xl text-purple-600" />
                                <p className="text-sm text-gray-600">Total Payouts</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_payouts_count}</p>
                            <p className="text-sm text-purple-600 mt-1">{formatCurrency(stats.total_payouts_cents)}</p>
                        </div>
                    </div>

                    {selectedPayouts.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">{selectedPayouts.length}</span> payout(s) selected
                            </p>
                            <button onClick={handleBulkProcess} disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                                <FiCheckCircle /> Process Selected
                            </button>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input type="checkbox" checked={selectedPayouts.length > 0 && selectedPayouts.length === payouts.data.filter(p => p.status === 'pending').length} onChange={handleToggleAll} className="rounded" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payouts.data.length > 0 ? payouts.data.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payout.status === 'pending' && (
                                                    <input type="checkbox" checked={selectedPayouts.includes(payout.id)} onChange={() => handleToggleSelection(payout.id)} className="rounded" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link href={`/admin/payouts/${payout.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                                                    {payout.payout_id}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium text-gray-900">{payout.vendor_name}</p>
                                                    <p className="text-xs text-gray-500">{payout.items_count} transactions</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                {formatCurrency(payout.amount_cents)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                                                {formatCurrency(payout.net_amount_cents)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={'px-3 py-1 text-xs rounded-full ' + getStatusColor(payout.status)}>
                                                    {payout.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(payout.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    {payout.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => { setSelectedPayoutForAction(payout); setShowProcessModal(true); }} className="text-green-600 hover:text-green-700 font-medium">
                                                                Process
                                                            </button>
                                                            <button onClick={() => { setSelectedPayoutForAction(payout); setShowCancelModal(true); }} className="text-red-600 hover:text-red-700 font-medium">
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                    {payout.status === 'failed' && (
                                                        <button onClick={() => handleRetry(payout)} disabled={processing} className="text-blue-600 hover:text-blue-700 font-medium">
                                                            Retry
                                                        </button>
                                                    )}
                                                    <Link href={`/admin/payouts/${payout.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                                                        View
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                                <FiDollarSign className="text-6xl text-gray-400 mx-auto mb-4" />
                                                <p className="text-lg font-medium">No payouts found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {payouts.links && payouts.data.length > 0 && (
                            <div className="border-t border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing {payouts.meta.from} to {payouts.meta.to} of {payouts.meta.total} payouts
                                    </div>
                                    <div className="flex gap-2">
                                        {payouts.links.map((link: any, index: number) => (
                                            <button key={index} disabled={!link.url} onClick={() => link.url && router.get(link.url)} dangerouslySetInnerHTML={{ __html: link.label }} className={'px-3 py-2 rounded border text-sm ' + (link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50') + ' ' + (!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showProcessModal && selectedPayoutForAction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold">Process Payout</h3>
                            <p className="text-sm text-gray-600 mt-1">{selectedPayoutForAction.payout_id}</p>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Vendor</p>
                                <p className="font-semibold">{selectedPayoutForAction.vendor_name}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Net Amount</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedPayoutForAction.net_amount_cents)}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Details</label>
                                <textarea value={transactionDetails} onChange={(e) => setTransactionDetails(e.target.value)} placeholder="Enter transaction reference, confirmation number, etc." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button onClick={handleProcessSingle} disabled={processing} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                                {processing ? 'Processing...' : 'Confirm & Process'}
                            </button>
                            <button onClick={() => { setShowProcessModal(false); setSelectedPayoutForAction(null); setTransactionDetails(''); }} disabled={processing} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelModal && selectedPayoutForAction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold">Cancel Payout</h3>
                            <p className="text-sm text-gray-600 mt-1">{selectedPayoutForAction.payout_id}</p>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Vendor</p>
                                <p className="font-semibold">{selectedPayoutForAction.vendor_name}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Amount</p>
                                <p className="text-2xl font-bold text-red-600">{formatCurrency(selectedPayoutForAction.net_amount_cents)}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason</label>
                                <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Explain why this payout is being cancelled" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-sm text-yellow-800">The payout amount will be returned to the vendor's available balance.</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button onClick={handleCancel} disabled={processing} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                                {processing ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                            <button onClick={() => { setShowCancelModal(false); setSelectedPayoutForAction(null); setCancelReason(''); }} disabled={processing} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
