import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Order, OrderItem, Address, User } from '@/types/models';
import { formatCurrency, formatDate } from '@/utils';
import { FiPackage, FiTruck, FiCheckCircle, FiAlertTriangle, FiDollarSign } from 'react-icons/fi';

interface OrderShowProps extends PageProps {
  order: Order & {
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress: Address;
    user: User;
  };
}

export default function Show({ auth, order }: OrderShowProps) {
  const { data, setData, post, processing, errors } = useForm({
    status: order.status,
    comment: '',
  });
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData('status', e.target.value);
  };
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData('comment', e.target.value);
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.orders.update-status', { id: order.id }));
  };

  const handleMarkAsPaid = () => {
    if (confirm('Are you sure you want to mark this order as paid?')) {
      post(route('admin.orders.mark-as-paid', { id: order.id }));
    }
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
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Order #{order.order_number}</h2>}
    >
      <Head title={`Order #${order.order_number}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                <div className="flex space-x-2">
                  <Link
                    href={route('admin.orders.index')}
                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                  >
                    Back to Orders
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Order Number:</span> {order.order_number}</p>
                    <p><span className="font-medium">Date:</span> {formatDate(order.created_at)}</p>
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Payment Method:</span>{' '}
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{' '}
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadgeClass(order.payment_status)}`}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                    </p>
                    {order.payment_method === 'cod' && order.payment_status === 'unpaid' && (
                      <button
                        onClick={handleMarkAsPaid}
                        className="mt-2 inline-flex items-center px-3 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition ease-in-out duration-150"
                      >
                        <FiDollarSign className="mr-1" /> Mark as Paid
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {order.user.name}</p>
                    <p><span className="font-medium">Email:</span> {order.user.email}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Order Summary</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Subtotal:</span> {formatCurrency(order.subtotal_cents / 100)}</p>
                    <p><span className="font-medium">Shipping:</span> {formatCurrency(order.shipping_cents / 100)}</p>
                    <p><span className="font-medium">Tax:</span> {formatCurrency(order.tax_cents / 100)}</p>
                    {order?.discount_cents && order.discount_cents > 0 && (
                      <p><span className="font-medium">Discount:</span> -{formatCurrency(order.discount_cents / 100)}</p>
                    )}
                    <p className="font-bold">
                      <span className="font-medium">Total:</span> {formatCurrency(order.total_cents / 100)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                  <div className="space-y-1">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address_line1}</p>
                    {order.shippingAddress.address_line2 && <p>{order.shippingAddress.address_line2}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Billing Address</h4>
                  <div className="space-y-1">
                    <p>{order.billingAddress.name}</p>
                    <p>{order.billingAddress.address_line1}</p>
                    {order.billingAddress.address_line2 && <p>{order.billingAddress.address_line2}</p>}
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postal_code}
                    </p>
                    <p>{order.billingAddress.country}</p>
                    {order.billingAddress.phone && <p>Phone: {order.billingAddress.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-4">Order Items</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md"></div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                                {item.variant_name !== 'Default' && (
                                  <div className="text-sm text-gray-500">{item.variant_name}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.unit_price_cents / 100)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency((item.unit_price_cents * item.quantity) / 100)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-700 mb-4">Update Order Status</h4>
                <form onSubmit={handleStatusUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={data.status}
                        onChange={handleStatusChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Comment (Optional)
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={data.comment}
                        onChange={handleCommentChange}
                        rows={3}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                      Update Status
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}