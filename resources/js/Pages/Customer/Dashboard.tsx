import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiShoppingBag, FiPackage, FiCheckCircle, FiDollarSign } from 'react-icons/fi';

interface Props {
    auth: any;
    stats: {
        total_orders: number;
        active_orders: number;
        completed_orders: number;
        total_spent_cents: number;
    };
    recentOrders: any[];
    activeOrders: any[];
    wishlistItems: any[];
    recentlyViewed: any[];
    recommendedProducts: any[];
}

export default function CustomerDashboard({ auth, stats, recentOrders, activeOrders, wishlistItems, recentlyViewed, recommendedProducts }: Props) {
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Dashboard" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {auth.user.name}!</h1>
                        <p className="text-gray-600 mt-1">Here's what's happening with your orders</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div><p className="text-sm text-gray-600">Total Orders</p><p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_orders}</p></div>
                                <div className="p-3 bg-blue-100 rounded-full"><FiShoppingBag className="text-2xl text-blue-600" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div><p className="text-sm text-gray-600">Active Orders</p><p className="text-2xl font-bold text-yellow-600 mt-1">{stats.active_orders}</p></div>
                                <div className="p-3 bg-yellow-100 rounded-full"><FiPackage className="text-2xl text-yellow-600" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div><p className="text-sm text-gray-600">Completed</p><p className="text-2xl font-bold text-green-600 mt-1">{stats.completed_orders}</p></div>
                                <div className="p-3 bg-green-100 rounded-full"><FiCheckCircle className="text-2xl text-green-600" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div><p className="text-sm text-gray-600">Total Spent</p><p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(stats.total_spent_cents)}</p></div>
                                <div className="p-3 bg-purple-100 rounded-full"><FiDollarSign className="text-2xl text-purple-600" /></div>
                            </div>
                        </div>
                    </div>
                    {activeOrders.length > 0 && (
                        <div className="bg-white rounded-lg shadow mb-8">
                            <div className="p-6 border-b border-gray-200"><h2 className="text-xl font-semibold">Active Orders</h2></div>
                            <div className="divide-y divide-gray-200">
                                {activeOrders.map((order) => (
                                    <div key={order.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                                                <p className="text-sm text-gray-600 mt-1">{order.items_count} items • {new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{formatCurrency(order.total_cents)}</p>
                                                <span className={'inline-block px-2 py-1 text-xs rounded-full mt-1 ' + getStatusColor(order.status)}>{order.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Recent Orders</h2>
                                <Link href="/customer/orders" className="text-blue-600 hover:text-blue-700 text-sm">View All</Link>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentOrders.length > 0 ? recentOrders.map((order) => (
                                    <div key={order.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">#{order.order_number}</p>
                                                <p className="text-sm text-gray-600 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{formatCurrency(order.total_cents)}</p>
                                                <span className={'inline-block px-2 py-1 text-xs rounded-full mt-1 ' + getStatusColor(order.status)}>{order.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="p-8 text-center text-gray-500">No orders yet</div>}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Wishlist</h2>
                                <Link href="/customer/wishlist" className="text-blue-600 hover:text-blue-700 text-sm">View All</Link>
                            </div>
                            <div className="p-6">
                                {wishlistItems.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {wishlistItems.map((item) => (
                                            <Link key={item.id} href={'/product/' + item.product.id} className="border rounded-lg p-3 hover:shadow-md transition">
                                                <img src={item.product.image_url || '/placeholder.png'} alt={item.product.title} className="w-full h-32 object-cover rounded mb-2" />
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.product.title}</p>
                                                <p className="text-sm text-blue-600 mt-1">{formatCurrency(item.product.price_cents)}</p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : <div className="text-center text-gray-500 py-8">Your wishlist is empty</div>}
                            </div>
                        </div>
                    </div>
                    {recentlyViewed.length > 0 && (
                        <div className="bg-white rounded-lg shadow mb-8">
                            <div className="p-6 border-b border-gray-200"><h2 className="text-xl font-semibold">Recently Viewed</h2></div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {recentlyViewed.map((product) => (
                                        <Link key={product.id} href={'/product/' + product.id} className="border rounded-lg p-3 hover:shadow-md transition">
                                            <img src={product.image_url || '/placeholder.png'} alt={product.title} className="w-full h-32 object-cover rounded mb-2" />
                                            <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                                            <p className="text-sm text-blue-600 mt-1">{formatCurrency(product.price_cents)}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
