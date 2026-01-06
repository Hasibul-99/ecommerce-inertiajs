import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Order, OrderItem, Address, User } from '@/types/models';
import { formatCurrency, formatDate } from '@/utils';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiAlertTriangle,
  FiDollarSign,
  FiUser,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
} from 'react-icons/fi';

interface WorkflowState {
  current_status: string;
  current_status_label: string;
  available_actions: string[];
  workflow_enabled: boolean;
  cod_collected: boolean;
  delivery_person_assigned: boolean;
}

interface ActivityLog {
  id: number;
  event: string;
  event_type: string;
  properties: any;
  user: User;
  created_at: string;
}

interface OrderStatus {
  id: number;
  status: string;
  comment: string;
  user: User;
  created_at: string;
}

interface OrderShowProps extends PageProps {
  order: Order & {
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress: Address;
    user: User;
    deliveryPerson?: User;
    codCollector?: User;
    statuses: OrderStatus[];
    cod_fee_cents?: number;
    cod_amount_collected?: number;
    cod_collected_at?: string;
    cod_verification_required?: boolean;
  };
  workflowState?: WorkflowState;
  activityLogs?: ActivityLog[];
  deliveryPersons?: User[];
}

export default function Show({ auth, order, workflowState, activityLogs = [], deliveryPersons = [] }: OrderShowProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [showFailureDialog, setShowFailureDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: confirmData, setData: setConfirmData, post: postConfirm, processing: confirmProcessing } = useForm({
    comment: '',
  });

  const { data: deliveryData, setData: setDeliveryData, post: postDelivery, processing: deliveryProcessing } = useForm({
    delivery_person_id: '',
    comment: '',
  });

  const { data: collectionData, setData: setCollectionData, post: postCollection, processing: collectionProcessing } = useForm({
    amount_collected_cents: order.total_cents,
    collected_by: '',
    comment: '',
  });

  const { data: failureData, setData: setFailureData, post: postFailure, processing: failureProcessing } = useForm({
    reason: '',
    attempt_number: 1,
    reschedule: true,
  });

  const { data: cancelData, setData: setCancelData, post: postCancel, processing: cancelProcessing } = useForm({
    reason: '',
    comment: '',
  });

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleConfirmOrder = () => {
    postConfirm(route('admin.orders.confirm', { order: order.id }), {
      onSuccess: () => setShowConfirmDialog(false),
    });
  };

  const handleMarkOutForDelivery = () => {
    postDelivery(route('admin.orders.mark-out-for-delivery', { order: order.id }), {
      onSuccess: () => setShowDeliveryDialog(false),
    });
  };

  const handleConfirmCollection = () => {
    postCollection(route('admin.orders.confirm-cod-collection', { order: order.id }), {
      onSuccess: () => setShowCollectionDialog(false),
    });
  };

  const handleMarkFailure = () => {
    postFailure(route('admin.orders.handle-delivery-failure', { order: order.id }), {
      onSuccess: () => setShowFailureDialog(false),
    });
  };

  const handleCancelOrder = () => {
    postCancel(route('admin.orders.cancel', { order: order.id }), {
      onSuccess: () => setShowCancelDialog(false),
    });
  };

  const handleStartProcessing = () => {
    router.post(route('admin.orders.start-processing', { order: order.id }), {
      comment: '',
    });
  };

  const handleCompleteOrder = () => {
    if (confirm('Are you sure you want to mark this order as completed?')) {
      router.post(route('admin.orders.complete', { order: order.id }), {
        comment: 'Order completed after COD verification period',
      });
    }
  };

  const renderWorkflowActions = () => {
    if (!workflowState || !workflowState.workflow_enabled) return null;

    const actions = workflowState.available_actions;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-medium text-gray-900 mb-4">COD Workflow Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.includes('confirm') && (
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <FiCheckCircle className="mr-2" /> Confirm Order
            </button>
          )}

          {actions.includes('start_processing') && (
            <button
              onClick={handleStartProcessing}
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              <FiPackage className="mr-2" /> Start Processing
            </button>
          )}

          {actions.includes('mark_out_for_delivery') && (
            <button
              onClick={() => setShowDeliveryDialog(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              <FiTruck className="mr-2" /> Mark Out for Delivery
            </button>
          )}

          {actions.includes('confirm_delivery') && (
            <button
              onClick={() => setShowCollectionDialog(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <FiDollarSign className="mr-2" /> Confirm COD Collection
            </button>
          )}

          {actions.includes('mark_failed') && (
            <button
              onClick={() => setShowFailureDialog(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              <FiAlertTriangle className="mr-2" /> Mark Delivery Failed
            </button>
          )}

          {actions.includes('complete') && (
            <button
              onClick={handleCompleteOrder}
              className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
            >
              <FiCheckCircle className="mr-2" /> Complete Order
            </button>
          )}

          {actions.includes('cancel') && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderOrderTimeline = () => {
    if (!order.statuses || order.statuses.length === 0) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-medium text-gray-900 mb-4">Order Timeline</h4>
        <div className="space-y-4">
          {order.statuses.map((status, index) => (
            <div key={status.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <FiClock className="w-4 h-4 text-white" />
                </div>
                {index < order.statuses.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClass(status.status)}`}>
                    {status.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(status.created_at)}</span>
                </div>
                {status.comment && (
                  <p className="text-sm text-gray-600 mt-1">{status.comment}</p>
                )}
                {status.user && (
                  <p className="text-xs text-gray-500 mt-1">By: {status.user.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Order #{order.order_number}</h2>}
    >
      <Head title={`Order #${order.order_number}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={route('admin.orders.index')}
              className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 transition"
            >
              ← Back to Orders
            </Link>
          </div>

          {/* Workflow Actions */}
          {renderWorkflowActions()}

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Order Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Order Information</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Order Number:</span>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Date:</span>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClass(order.status)}`}>
                    {order.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Payment Method:</span>
                  <p className="font-medium">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Payment Status:</span>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-medium ${getPaymentStatusBadgeClass(order.payment_status)}`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Customer Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiUser className="text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Name:</span>
                    <p className="font-medium">{order.user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="font-medium">{order.user.email}</p>
                  </div>
                </div>
                {order.shippingAddress?.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <p className="font-medium">{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(order.subtotal_cents / 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping:</span>
                  <span className="font-medium">{formatCurrency(order.shipping_cents / 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax:</span>
                  <span className="font-medium">{formatCurrency(order.tax_cents / 100)}</span>
                </div>
                {order.cod_fee_cents && order.cod_fee_cents > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">COD Fee:</span>
                    <span className="font-medium">{formatCurrency(order.cod_fee_cents / 100)}</span>
                  </div>
                )}
                {order.discount_cents && order.discount_cents > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">-{formatCurrency(order.discount_cents / 100)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">{formatCurrency(order.total_cents / 100)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COD Information (if applicable) */}
          {order.payment_method === 'cod' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="font-medium text-blue-900 mb-4">COD Payment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-blue-700">Amount to Collect:</span>
                  <p className="font-bold text-lg text-blue-900">{formatCurrency(order.total_cents / 100)}</p>
                </div>
                {order.cod_amount_collected && (
                  <div>
                    <span className="text-sm text-blue-700">Amount Collected:</span>
                    <p className="font-bold text-lg text-green-600">{formatCurrency(order.cod_amount_collected / 100)}</p>
                  </div>
                )}
                {order.cod_collected_at && (
                  <div>
                    <span className="text-sm text-blue-700">Collected At:</span>
                    <p className="font-medium text-blue-900">{formatDate(order.cod_collected_at)}</p>
                  </div>
                )}
                {order.codCollector && (
                  <div>
                    <span className="text-sm text-blue-700">Collected By:</span>
                    <p className="font-medium text-blue-900">{order.codCollector.name}</p>
                  </div>
                )}
                {order.deliveryPerson && (
                  <div>
                    <span className="text-sm text-blue-700">Delivery Person:</span>
                    <p className="font-medium text-blue-900">{order.deliveryPerson.name}</p>
                  </div>
                )}
                {order.cod_verification_required && (
                  <div className="md:col-span-3">
                    <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      <FiAlertTriangle className="mr-1" /> High Value - Verification Required
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          {renderOrderTimeline()}

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FiMapPin className="text-gray-400" /> Shipping Address
              </h4>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address_line1}</p>
                {order.shippingAddress.address_line2 && <p>{order.shippingAddress.address_line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p className="mt-2">Phone: {order.shippingAddress.phone}</p>}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FiMapPin className="text-gray-400" /> Billing Address
              </h4>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.billingAddress.name}</p>
                <p>{order.billingAddress.address_line1}</p>
                {order.billingAddress.address_line2 && <p>{order.billingAddress.address_line2}</p>}
                <p>
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postal_code}
                </p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                        {item.variant_name !== 'Default' && (
                          <div className="text-sm text-gray-500">{item.variant_name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatCurrency(item.unit_price_cents / 100)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {formatCurrency((item.unit_price_cents * item.quantity) / 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dialogs */}
          {/* Confirm Order Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Confirm Order</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
                  <textarea
                    value={confirmData.comment}
                    onChange={(e) => setConfirmData('comment', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Add any notes about this confirmation..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmOrder}
                    disabled={confirmProcessing}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Confirm Order
                  </button>
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mark Out for Delivery Dialog */}
          {showDeliveryDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Mark Out for Delivery</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Person *</label>
                  <select
                    value={deliveryData.delivery_person_id}
                    onChange={(e) => setDeliveryData('delivery_person_id', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select delivery person...</option>
                    {deliveryPersons.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} ({person.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
                  <textarea
                    value={deliveryData.comment}
                    onChange={(e) => setDeliveryData('comment', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleMarkOutForDelivery}
                    disabled={deliveryProcessing || !deliveryData.delivery_person_id}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    Mark Out for Delivery
                  </button>
                  <button
                    onClick={() => setShowDeliveryDialog(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm COD Collection Dialog */}
          {showCollectionDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Confirm COD Collection</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Collected (cents) *</label>
                  <input
                    type="number"
                    value={collectionData.amount_collected_cents}
                    onChange={(e) => setCollectionData('amount_collected_cents', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Expected: {formatCurrency(order.total_cents / 100)}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
                  <textarea
                    value={collectionData.comment}
                    onChange={(e) => setCollectionData('comment', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmCollection}
                    disabled={collectionProcessing}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Confirm Collection
                  </button>
                  <button
                    onClick={() => setShowCollectionDialog(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mark Delivery Failed Dialog */}
          {showFailureDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Mark Delivery Failed</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Failure Reason *</label>
                  <textarea
                    value={failureData.reason}
                    onChange={(e) => setFailureData('reason', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Customer not available, Incorrect address..."
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attempt Number *</label>
                  <input
                    type="number"
                    value={failureData.attempt_number}
                    onChange={(e) => setFailureData('attempt_number', parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={failureData.reschedule}
                      onChange={(e) => setFailureData('reschedule', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Reschedule delivery</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleMarkFailure}
                    disabled={failureProcessing || !failureData.reason}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Mark Failed
                  </button>
                  <button
                    onClick={() => setShowFailureDialog(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Order Dialog */}
          {showCancelDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Cancel Order</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason *</label>
                  <textarea
                    value={cancelData.reason}
                    onChange={(e) => setCancelData('reason', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Why is this order being cancelled?"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comment (optional)</label>
                  <textarea
                    value={cancelData.comment}
                    onChange={(e) => setCancelData('comment', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelProcessing || !cancelData.reason}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => setShowCancelDialog(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
