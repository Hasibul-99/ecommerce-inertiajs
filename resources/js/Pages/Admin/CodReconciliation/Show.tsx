import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { User, Order, Address } from '@/types/models';
import { formatCurrency, formatDate } from '@/utils';
import { FiCheckCircle, FiAlertTriangle, FiUser, FiTruck, FiDollarSign, FiMapPin } from 'react-icons/fi';

interface CodReconciliation {
  id: number;
  date: string;
  delivery_person_id: number;
  total_orders_count: number;
  total_cod_amount_cents: number;
  collected_amount_cents: number;
  discrepancy_cents: number;
  status: string;
  verified_by: number | null;
  verified_at: string | null;
  notes: string | null;
  deliveryPerson?: User;
  verifiedBy?: User;
  metadata: any;
}

interface CodReconciliationShowProps extends PageProps {
  reconciliation: CodReconciliation;
  orders: (Order & { user: User; shippingAddress: Address })[];
}

export default function Show({ auth, reconciliation, orders }: CodReconciliationShowProps) {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);

  const { data: verifyData, setData: setVerifyData, post: postVerify, processing: verifyProcessing } = useForm({
    actual_amount_cents: reconciliation.total_cod_amount_cents,
    notes: '',
  });

  const { data: disputeData, setData: setDisputeData, post: postDispute, processing: disputeProcessing } = useForm({
    reason: '',
    resolution: '',
  });

  const handleVerify = () => {
    postVerify(route('admin.cod-reconciliation.verify', { reconciliation: reconciliation.id }), {
      onSuccess: () => setShowVerifyDialog(false),
    });
  };

  const handleDispute = () => {
    postDispute(route('admin.cod-reconciliation.dispute', { reconciliation: reconciliation.id }), {
      onSuccess: () => setShowDisputeDialog(false),
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; icon: any }> = {
      pending: { class: 'bg-yellow-100 text-yellow-800', icon: FiAlertTriangle },
      verified: { class: 'bg-green-100 text-green-800', icon: FiCheckCircle },
      disputed: { class: 'bg-red-100 text-red-800', icon: FiAlertTriangle },
      resolved: { class: 'bg-blue-100 text-blue-800', icon: FiCheckCircle },
    };

    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const accuracyPercentage = reconciliation.total_cod_amount_cents > 0
    ? (reconciliation.collected_amount_cents / reconciliation.total_cod_amount_cents) * 100
    : 100;

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">COD Reconciliation Details</h2>}
    >
      <Head title={`COD Reconciliation - ${reconciliation.date}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={route('admin.cod-reconciliation.index')}
              className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 transition"
            >
              ← Back to List
            </Link>
          </div>

          {/* Header Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatDate(reconciliation.date)}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Reconciliation ID: #{reconciliation.id}
                </p>
              </div>
              <div>
                {getStatusBadge(reconciliation.status)}
              </div>
            </div>

            {/* Delivery Person Info */}
            <div className="flex items-center gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
              <FiUser className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Delivery Person</p>
                <p className="text-lg font-semibold text-gray-900">
                  {reconciliation.deliveryPerson?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  {reconciliation.deliveryPerson?.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {reconciliation.status === 'pending' && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowVerifyDialog(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  <FiCheckCircle className="mr-2" /> Verify Collection
                </button>
                <button
                  onClick={() => setShowDisputeDialog(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  <FiAlertTriangle className="mr-2" /> Mark as Disputed
                </button>
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {reconciliation.total_orders_count}
                  </p>
                </div>
                <FiTruck className="w-10 h-10 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expected Amount</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(reconciliation.total_cod_amount_cents / 100)}
                  </p>
                </div>
                <FiDollarSign className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Collected Amount</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(reconciliation.collected_amount_cents / 100)}
                  </p>
                </div>
                <FiCheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Discrepancy</p>
                  <p className={`text-2xl font-bold mt-2 ${reconciliation.discrepancy_cents !== 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(Math.abs(reconciliation.discrepancy_cents) / 100)}
                  </p>
                </div>
                <FiAlertTriangle className={`w-10 h-10 ${reconciliation.discrepancy_cents !== 0 ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>

          {/* Accuracy Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Collection Accuracy</h4>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold inline-block text-indigo-600">
                  {accuracyPercentage.toFixed(2)}%
                </span>
              </div>
              <div className="overflow-hidden h-4 text-xs flex rounded bg-indigo-100">
                <div
                  style={{ width: `${Math.min(accuracyPercentage, 100)}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    accuracyPercentage >= 99 ? 'bg-green-500' : accuracyPercentage >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Verification Info */}
          {reconciliation.verified_at && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-green-900 mb-4">Verification Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-700">Verified By</p>
                  <p className="font-medium text-green-900">
                    {reconciliation.verifiedBy?.name || 'System'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Verified At</p>
                  <p className="font-medium text-green-900">
                    {formatDate(reconciliation.verified_at)}
                  </p>
                </div>
              </div>
              {reconciliation.notes && (
                <div className="mt-4">
                  <p className="text-sm text-green-700">Notes</p>
                  <p className="font-medium text-green-900 mt-1">
                    {reconciliation.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Included Orders ({orders.length})</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Expected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Collected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Collected At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={route('admin.orders.show', { order: order.id })}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-start gap-1">
                          <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(order.total_cents / 100)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={order.cod_amount_collected !== order.total_cents ? 'text-red-600 font-medium' : 'text-gray-900'}>
                          {formatCurrency((order.cod_amount_collected || 0) / 100)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.cod_collected_at ? formatDate(order.cod_collected_at) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verify Dialog */}
          {showVerifyDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Verify COD Collection</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Amount Collected (in cents) *
                  </label>
                  <input
                    type="number"
                    value={verifyData.actual_amount_cents}
                    onChange={(e) => setVerifyData('actual_amount_cents', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Expected: {formatCurrency(reconciliation.total_cod_amount_cents / 100)}
                  </p>
                  {verifyData.actual_amount_cents !== reconciliation.total_cod_amount_cents && (
                    <p className="text-sm text-amber-600 mt-1">
                      Discrepancy: {formatCurrency(Math.abs(verifyData.actual_amount_cents - reconciliation.total_cod_amount_cents) / 100)}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={verifyData.notes}
                    onChange={(e) => setVerifyData('notes', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Add any verification notes..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleVerify}
                    disabled={verifyProcessing}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Verify Collection
                  </button>
                  <button
                    onClick={() => setShowVerifyDialog(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dispute Dialog */}
          {showDisputeDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Mark as Disputed</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Discrepancy *
                  </label>
                  <textarea
                    value={disputeData.reason}
                    onChange={(e) => setDisputeData('reason', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Explain the discrepancy..."
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution (optional)
                  </label>
                  <textarea
                    value={disputeData.resolution}
                    onChange={(e) => setDisputeData('resolution', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="How was this resolved?"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDispute}
                    disabled={disputeProcessing || !disputeData.reason}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Mark as Disputed
                  </button>
                  <button
                    onClick={() => setShowDisputeDialog(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
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
