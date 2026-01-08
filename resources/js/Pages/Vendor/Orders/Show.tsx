import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types/index';
import {
  FiArrowLeft,
  FiPackage,
  FiMapPin,
  FiUser,
  FiMail,
  FiCreditCard,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiEdit,
  FiSave,
  FiX,
  FiPrinter,
  FiDownload,
} from 'react-icons/fi';

interface OrderItem {
  id: number;
  product_name: string;
  variant_name: string | null;
  sku: string | null;
  quantity: number;
  price_cents: number;
  total_cents: number;
  vendor_status: string;
  carrier: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  estimated_delivery_at: string | null;
  delivered_at: string | null;
  vendor_notes: string | null;
  can_ship: boolean;
  is_shipped: boolean;
}

interface Order {
  id: number;
  order_number: string;
  customer: {
    name: string;
    email: string;
  };
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: OrderItem[];
  vendor_total_cents: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  auth: {
    user: User;
  };
  order: Order;
}

export default function Show({ auth, order }: Props) {
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const { data: statusData, setData: setStatusData, post: postStatus, processing: statusProcessing } = useForm({
    status: '',
    notes: '',
  });

  const {
    data: shippingData,
    setData: setShippingData,
    post: postShipping,
    processing: shippingProcessing,
    reset: resetShipping,
  } = useForm({
    carrier: '',
    tracking_number: '',
    estimated_delivery_date: '',
  });

  const handleStatusUpdate = (itemId: number, newStatus: string) => {
    if (confirm(`Are you sure you want to update the status to "${newStatus}"?`)) {
      router.post(
        route('vendor.orders.update-item-status', itemId),
        {
          status: newStatus,
          notes: statusData.notes,
        },
        {
          preserveState: true,
          onSuccess: () => {
            setEditingItemId(null);
            setStatusData('notes', '');
          },
        }
      );
    }
  };

  const handleAddShipping = () => {
    if (selectedItemIds.length === 0) {
      alert('Please select at least one item to add shipping information');
      return;
    }

    postShipping(route('vendor.orders.add-tracking', order.id), {
      preserveState: true,
      onSuccess: () => {
        setShowShippingModal(false);
        setSelectedItemIds([]);
        resetShipping();
      },
    });
  };

  const toggleItemSelection = (itemId: number) => {
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
    } else {
      setSelectedItemIds([...selectedItemIds, itemId]);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      pending: { class: 'bg-gray-100 text-gray-800', label: 'Pending' },
      confirmed: { class: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      processing: { class: 'bg-yellow-100 text-yellow-800', label: 'Processing' },
      ready_to_ship: { class: 'bg-purple-100 text-purple-800', label: 'Ready to Ship' },
      shipped: { class: 'bg-green-100 text-green-800', label: 'Shipped' },
      delivered: { class: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { class: 'bg-red-100 text-red-800', label: 'Cancelled' },
      refunded: { class: 'bg-orange-100 text-orange-800', label: 'Refunded' },
    };

    const config = statusMap[status] || statusMap.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      pending: { class: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      paid: { class: 'bg-green-100 text-green-800', label: 'Paid' },
      failed: { class: 'bg-red-100 text-red-800', label: 'Failed' },
      refunded: { class: 'bg-orange-100 text-orange-800', label: 'Refunded' },
    };

    const config = statusMap[status] || statusMap.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'ready_to_ship', label: 'Ready to Ship' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Order {order.order_number}
          </h2>
          <div className="flex gap-3">
            <a
              href={route('vendor.orders.packing-slip', order.id)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiDownload className="mr-2" />
              Packing Slip
            </a>
            <Link
              href={route('vendor.orders.index')}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              <FiArrowLeft className="mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      }
    >
      <Head title={`Order ${order.order_number}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FiUser className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm font-medium text-gray-900">{order.customer.email}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FiMapPin className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
              </div>
              <div className="text-sm text-gray-900">
                <p>{order.shipping_address.street}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FiCreditCard className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Status</p>
                  {getStatusBadge(order.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                  {getPaymentStatusBadge(order.payment_status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Your Total</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(order.vendor_total_cents)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Shipping Actions */}
          {order.items.some((item) => item.can_ship) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Add Shipping Information</h4>
                  <p className="text-sm text-blue-700">
                    {selectedItemIds.length > 0
                      ? `${selectedItemIds.length} item(s) selected`
                      : 'Select items to add shipping information'}
                  </p>
                </div>
                <button
                  onClick={() => setShowShippingModal(true)}
                  disabled={selectedItemIds.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Add Tracking
                </button>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiPackage className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Your Items ({order.items.length})</h3>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedItemIds.length ===
                          order.items.filter((item) => item.can_ship && !item.is_shipped).length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItemIds(
                              order.items
                                .filter((item) => item.can_ship && !item.is_shipped)
                                .map((item) => item.id)
                            );
                          } else {
                            setSelectedItemIds([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {item.can_ship && !item.is_shipped && (
                          <input
                            type="checkbox"
                            checked={selectedItemIds.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="rounded border-gray-300 text-blue-600"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                        {item.variant_name && <div className="text-sm text-gray-500">{item.variant_name}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.sku || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(item.price_cents)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(item.total_cents)}
                      </td>
                      <td className="px-6 py-4">
                        {editingItemId === item.id ? (
                          <select
                            value={statusData.status || item.vendor_status}
                            onChange={(e) => {
                              setStatusData('status', e.target.value);
                              handleStatusUpdate(item.id, e.target.value);
                            }}
                            className="text-sm border-gray-300 rounded-md"
                            disabled={statusProcessing}
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            {getStatusBadge(item.vendor_status)}
                            {!item.is_shipped && (
                              <button
                                onClick={() => {
                                  setEditingItemId(item.id);
                                  setStatusData('status', item.vendor_status);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.tracking_number ? (
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{item.carrier}</p>
                            <p className="text-gray-500">{item.tracking_number}</p>
                            {item.shipped_at && (
                              <p className="text-xs text-gray-500 mt-1">Shipped: {formatDate(item.shipped_at)}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No tracking</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.vendor_notes && (
                          <div className="text-xs text-gray-500">
                            <p className="font-medium">Notes:</p>
                            <p>{item.vendor_notes}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Total:
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {formatCurrency(order.vendor_total_cents)}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiClock className="w-5 h-5 text-blue-600 mr-2" />
              Order Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiCheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
              </div>

              {order.items.some((item) => item.shipped_at) && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <FiTruck className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Items Shipped</p>
                    <p className="text-sm text-gray-500">
                      {order.items.filter((item) => item.shipped_at).length} of {order.items.length} items shipped
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiClock className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-sm text-gray-500">{formatDate(order.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Shipping Information</h3>
              <button onClick={() => setShowShippingModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier <span className="text-red-500">*</span>
                </label>
                <select
                  value={shippingData.carrier}
                  onChange={(e) => setShippingData('carrier', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select carrier</option>
                  <option value="USPS">USPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="UPS">UPS</option>
                  <option value="DHL">DHL</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shippingData.tracking_number}
                  onChange={(e) => setShippingData('tracking_number', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tracking number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery Date</label>
                <input
                  type="date"
                  value={shippingData.estimated_delivery_date}
                  onChange={(e) => setShippingData('estimated_delivery_date', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  This will mark {selectedItemIds.length} item(s) as shipped and notify the customer.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowShippingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddShipping}
                disabled={
                  shippingProcessing || !shippingData.carrier || !shippingData.tracking_number
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                <FiSave className="inline-block mr-2" />
                {shippingProcessing ? 'Saving...' : 'Add Tracking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
