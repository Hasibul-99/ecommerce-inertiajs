import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Order } from '@/types/models';
import { formatCurrency, formatDate } from '@/utils';
import Pagination from '@/Components/Pagination';

interface OrdersIndexProps extends PageProps {
  orders: {
    data: Order[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    current_page: number;
    last_page: number;
  };
  filters: {
    status: string | null;
    payment_method: string | null;
    payment_status: string | null;
  };
}

export default function Index({ auth, orders, filters }: OrdersIndexProps) {
  const [searchParams, setSearchParams] = useState({
    status: filters.status || '',
    payment_method: filters.payment_method || '',
    payment_status: filters.payment_status || '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.status) params.append('status', searchParams.status);
    if (searchParams.payment_method) params.append('payment_method', searchParams.payment_method);
    if (searchParams.payment_status) params.append('payment_status', searchParams.payment_status);
    
    window.location.href = `${route('admin.orders.index')}?${params.toString()}`;
  };

  const clearFilters = () => {
    window.location.href = route('admin.orders.index');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Orders</h2>}
    >
      <Head title="Orders" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Orders</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={searchParams.status}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      id="payment_method"
                      name="payment_method"
                      value={searchParams.payment_method}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">All Methods</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Status
                    </label>
                    <select
                      id="payment_status"
                      name="payment_status"
                      value={searchParams.payment_status}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">All Statuses</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={applyFilters}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:border-gray-400 focus:ring ring-gray-200 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.data.length > 0 ? (
                      orders.data.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.user?.name || 'Guest'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(order.total_cents / 100)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className="text-xs text-gray-500">
                                {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadgeClass(order.payment_status)}`}>
                                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              href={route('admin.orders.show', order.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </Link>
                            {order.payment_method === 'cod' && order.payment_status === 'unpaid' && (
                              <Link
                                href={route('admin.orders.mark-as-paid', order.id)}
                                method="post"
                                as="button"
                                className="ml-3 text-green-600 hover:text-green-900"
                              >
                                Mark Paid
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <Pagination links={orders.links} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}