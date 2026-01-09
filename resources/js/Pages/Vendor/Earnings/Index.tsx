import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import { FiDollarSign, FiClock, FiLock, FiTrendingUp } from 'react-icons/fi';

interface Balance {
    available_cents: number;
    pending_cents: number;
    withheld_cents: number;
    total_cents: number;
}

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

interface Payout {
    id: number;
    payout_id: string;
    amount_cents: number;
    net_amount_cents: number;
    status: string;
    created_at: string;
    processed_at: string | null;
}

interface Props {
    balances: Balance;
    earningsData: any;
    recentTransactions: Transaction[];
    recentPayouts: Payout[];
    minimumPayoutCents: number;
    canRequestPayout: boolean;
}

export default function EarningsIndex({ balances, earningsData, recentTransactions, recentPayouts, minimumPayoutCents, canRequestPayout }: Props) {
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            available: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            withheld: 'bg-red-100 text-red-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleRequestPayout = () => {
        if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        const amountCents = Math.round(parseFloat(payoutAmount) * 100);
        if (amountCents > balances.available_cents) {
            alert('Amount exceeds available balance');
            return;
        }
        if (amountCents < minimumPayoutCents) {
            alert('Minimum payout amount is ' + formatCurrency(minimumPayoutCents));
            return;
        }
        setProcessing(true);
        router.post('/vendor/earnings/request-payout', { amount_cents: amountCents }, {
            onSuccess: () => { setShowPayoutModal(false); setPayoutAmount(''); },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <VendorLayout>
            <Head title="Earnings Dashboard" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
                            <p className="text-gray-600 mt-1">Track your earnings and manage payouts</p>
                        </div>
                        {canRequestPayout && (
                            <button onClick={() => setShowPayoutModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                                <FiDollarSign /> Request Payout
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Available Balance</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(balances.available_cents)}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full"><FiDollarSign className="text-2xl text-green-600" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Balance</p>
                                    <p className="text-2xl font-bold text-yellow-600 mt-1">{formatCurrency(balances.pending_cents)}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full"><FiClock className="text-2xl text-yellow-600" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Withheld (Reserve)</p>
                                    <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(balances.withheld_cents)}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full"><FiLock className="text-2xl text-red-600" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Earnings</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(balances.total_cents)}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full"><FiTrendingUp className="text-2xl text-blue-600" /></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                                    <Link href="/vendor/earnings/transactions" className="text-blue-600 hover:text-blue-700 text-sm">View All</Link>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">Order #{transaction.order_number}</p>
                                                <p className="text-sm text-gray-600 mt-1">{new Date(transaction.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-green-600">{formatCurrency(transaction.net_amount_cents)}</p>
                                                <span className={'inline-block px-2 py-1 text-xs rounded-full mt-1 ' + getStatusColor(transaction.status)}>{transaction.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="p-8 text-center text-gray-500">No transactions yet</div>}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold">Recent Payouts</h2>
                                    <Link href="/vendor/earnings/payouts" className="text-blue-600 hover:text-blue-700 text-sm">View All</Link>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentPayouts.length > 0 ? recentPayouts.map((payout) => (
                                    <div key={payout.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">{payout.payout_id}</p>
                                                <p className="text-sm text-gray-600 mt-1">{new Date(payout.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-blue-600">{formatCurrency(payout.net_amount_cents)}</p>
                                                <span className={'inline-block px-2 py-1 text-xs rounded-full mt-1 ' + getStatusColor(payout.status)}>{payout.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="p-8 text-center text-gray-500">No payouts yet</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showPayoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4">Request Payout</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Available Balance</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(balances.available_cents)}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payout Amount (USD)</label>
                            <input type="number" step="0.01" min={minimumPayoutCents / 100} max={balances.available_cents / 100} value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={'Minimum: ' + formatCurrency(minimumPayoutCents)} />
                            <p className="text-xs text-gray-500 mt-1">Minimum payout: {formatCurrency(minimumPayoutCents)}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleRequestPayout} disabled={processing} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">{processing ? 'Processing...' : 'Request Payout'}</button>
                            <button onClick={() => setShowPayoutModal(false)} disabled={processing} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
