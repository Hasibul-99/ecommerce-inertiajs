import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import { FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiLoader, FiCalendar, FiCreditCard } from 'react-icons/fi';

interface Payout {
    id: number;
    payout_id: string;
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
    cancelled_at: string | null;
    cancellation_reason: string | null;
    payout_details: any;
}

interface Props {
    payouts: { data: Payout[]; links: any; meta: any };
    stats: {
        total_payouts: number;
        total_paid_cents: number;
        pending_count: number;
        pending_amount_cents: number;
    };
}

export default function PayoutsIndex({ payouts, stats }: Props) {
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <FiClock className="text-yellow-600" />;
            case 'processing': return <FiLoader className="text-blue-600" />;
            case 'completed': return <FiCheckCircle className="text-green-600" />;
            case 'failed': return <FiXCircle className="text-red-600" />;
            case 'cancelled': return <FiXCircle className="text-gray-600" />;
            default: return <FiDollarSign className="text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            processing: 'bg-blue-100 text-blue-800 border-blue-300',
            completed: 'bg-green-100 text-green-800 border-green-300',
            failed: 'bg-red-100 text-red-800 border-red-300',
            cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusText = (payout: Payout) => {
        if (payout.status === 'completed' && payout.processed_at) {
            return `Completed on ${new Date(payout.processed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        if (payout.status === 'cancelled' && payout.cancelled_at) {
            return `Cancelled on ${new Date(payout.cancelled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        if (payout.status === 'failed') {
            return 'Failed - Funds returned to balance';
        }
        if (payout.status === 'processing') {
            return 'Processing - Typically takes 3-5 business days';
        }
        return 'Awaiting processing';
    };

    return (
        <VendorLayout>
            <Head title="Payout History" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Payout History</h1>
                                <p className="text-gray-600 mt-1">Track all your payout requests and their status</p>
                            </div>
                            <Link href="/vendor/earnings" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiDollarSign className="text-2xl text-blue-600" />
                                <p className="text-sm text-gray-600">Total Payouts</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_payouts}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiCheckCircle className="text-2xl text-green-600" />
                                <p className="text-sm text-gray-600">Total Paid Out</p>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_paid_cents)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiClock className="text-2xl text-yellow-600" />
                                <p className="text-sm text-gray-600">Pending Payouts</p>
                            </div>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending_count}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <FiLoader className="text-2xl text-purple-600" />
                                <p className="text-sm text-gray-600">Pending Amount</p>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.pending_amount_cents)}</p>
                        </div>
                    </div>

                    {payouts.data.length > 0 ? (
                        <div className="space-y-4">
                            {payouts.data.map((payout) => (
                                <div key={payout.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {getStatusIcon(payout.status)}
                                                    <h3 className="text-lg font-semibold text-gray-900">{payout.payout_id}</h3>
                                                    <span className={'px-3 py-1 text-xs rounded-full border ' + getStatusColor(payout.status)}>
                                                        {payout.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{getStatusText(payout)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(payout.net_amount_cents)}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatCurrency(payout.amount_cents)} - {formatCurrency(payout.processing_fee_cents)} fee
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Request Date</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {new Date(payout.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Period</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {new Date(payout.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(payout.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Transactions</p>
                                                <p className="text-sm font-medium text-gray-900">{payout.items_count} items</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Method</p>
                                                <p className="text-sm font-medium text-gray-900 capitalize">{payout.payout_method.replace('_', ' ')}</p>
                                            </div>
                                        </div>

                                        {payout.cancellation_reason && (
                                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                                <p className="text-sm text-red-800">
                                                    <span className="font-medium">Cancellation Reason:</span> {payout.cancellation_reason}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <button onClick={() => setSelectedPayout(payout)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                View Details →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {payouts.links && (
                                <div className="bg-white rounded-lg shadow p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Showing {payouts.meta.from} to {payouts.meta.to} of {payouts.meta.total} payouts
                                        </div>
                                        <div className="flex gap-2">
                                            {payouts.links.map((link: any, index: number) => (
                                                <button key={index} disabled={!link.url} onClick={() => link.url && window.location.href = link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={'px-3 py-2 rounded border text-sm ' + (link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50') + ' ' + (!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <FiDollarSign className="text-6xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payouts yet</h3>
                            <p className="text-gray-600 mb-6">Your payout requests will appear here once you start requesting withdrawals</p>
                            <Link href="/vendor/earnings" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Go to Earnings Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {selectedPayout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-semibold">{selectedPayout.payout_id}</h2>
                                    <p className="text-sm text-gray-600 mt-1">Payout Details</p>
                                </div>
                                <button onClick={() => setSelectedPayout(null)} className="text-gray-400 hover:text-gray-600">
                                    <FiXCircle className="text-2xl" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    {getStatusIcon(selectedPayout.status)}
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className="text-lg font-semibold text-gray-900 capitalize">{selectedPayout.status}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Requested Amount</p>
                                        <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedPayout.amount_cents)}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Net Amount (After Fees)</p>
                                        <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPayout.net_amount_cents)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-600">Processing Fee</span>
                                        <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedPayout.processing_fee_cents)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-600">Transactions Included</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedPayout.items_count} items</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-600">Period</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {new Date(selectedPayout.period_start).toLocaleDateString()} - {new Date(selectedPayout.period_end).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-600">Request Date</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {new Date(selectedPayout.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    {selectedPayout.processed_at && (
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-sm text-gray-600">Processed Date</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {new Date(selectedPayout.processed_at).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-600">Payout Method</span>
                                        <span className="text-sm font-medium text-gray-900 capitalize">
                                            {selectedPayout.payout_method.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {selectedPayout.payout_details && (
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                                            <FiCreditCard /> Bank Account Details
                                        </p>
                                        {selectedPayout.payout_details.bank_name && (
                                            <p className="text-sm text-gray-600">Bank: {selectedPayout.payout_details.bank_name}</p>
                                        )}
                                        {selectedPayout.payout_details.bank_account_name && (
                                            <p className="text-sm text-gray-600">Account Name: {selectedPayout.payout_details.bank_account_name}</p>
                                        )}
                                        {selectedPayout.payout_details.bank_account_number && (
                                            <p className="text-sm text-gray-600">Account: ****{selectedPayout.payout_details.bank_account_number}</p>
                                        )}
                                    </div>
                                )}

                                {selectedPayout.cancellation_reason && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm font-medium text-red-800 mb-1">Cancellation Reason</p>
                                        <p className="text-sm text-red-700">{selectedPayout.cancellation_reason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200">
                            <button onClick={() => setSelectedPayout(null)} className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
