import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiPackage, FiDownload, FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi';

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total_cents: number;
    items_count: number;
    vendors: string[];
    created_at: string;
    can_reorder: boolean;
}

interface Props {
    auth: any;
    orders: { data: Order[]; links: any; meta: any };
    filters: { search: string; status: string; vendor_id?: number; date_from?: string; date_to?: string };
}

export default function OrdersIndex({ auth, orders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [processing, setProcessing] = useState(false);

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/customer/orders', { ...filters, search }, { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/customer/orders', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleReorder = (orderId: number) => {
        if (confirm('Add all items from this order to your cart?')) {
            setProcessing(true);
            router.post(`/orders/${orderId}/reorder`, {}, {
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleDownloadInvoice = (orderId: number) => {
        window.open(`/orders/${orderId}/invoice`, '_blank');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Orders" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-600 mt-1">Track and manage your orders</p>
                    </div>

                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order number..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Search
                            </button>
                            <button type="button" onClick={() => setShowFilters(!showFilters)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2">
                                <FiFilter /> Filters
                            </button>
                        </form>

                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select value={filters.status || 'all'} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                        <input type="date" value={filters.date_from || ''} onChange={(e) => handleFilterChange('date_from', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                        <input type="date" value={filters.date_to || ''} onChange={(e) => handleFilterChange('date_to', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {orders.data.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {orders.data.map((order) => (
                                    <div key={order.id} className="bg-white rounded-lg shadow p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Order #{order.order_number}</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 md:mt-0">
                                                <span className={'px-3 py-1 text-sm rounded-full ' + getStatusColor(order.status)}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                                <span className={'px-3 py-1 text-sm rounded-full ' + (order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                                                    {order.payment_status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-gray-200">
                                            <div>
                                                <p className="text-sm text-gray-600">Items</p>
                                                <p className="font-semibold">{order.items_count}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total</p>
                                                <p className="font-semibold text-lg">{formatCurrency(order.total_cents)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Vendors</p>
                                                <p className="font-semibold">{order.vendors.length > 0 ? order.vendors.join(', ') : 'Direct'}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Link href={`/orders/${order.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                                                View Details
                                            </Link>
                                            <Link href={`/orders/${order.id}/track`} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm flex items-center gap-2">
                                                <FiPackage /> Track Order
                                            </Link>
                                            {order.can_reorder && (
                                                <button onClick={() => handleReorder(order.id)} disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-2 disabled:opacity-50">
                                                    <FiRefreshCw /> Reorder
                                                </button>
                                            )}
                                            <button onClick={() => handleDownloadInvoice(order.id)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm flex items-center gap-2">
                                                <FiDownload /> Invoice
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {orders.links && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex gap-2">
                                        {orders.links.map((link: any, index: number) => (
                                            <button key={index} disabled={!link.url} onClick={() => link.url && router.get(link.url)} dangerouslySetInnerHTML={{ __html: link.label }} className={'px-3 py-2 rounded border ' + (link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50') + ' ' + (!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <FiPackage className="text-6xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
                            <Link href="/products" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
