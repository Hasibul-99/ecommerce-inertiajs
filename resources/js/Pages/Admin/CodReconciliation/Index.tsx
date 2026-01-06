import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { User } from '@/types/models';
import { formatCurrency, formatDate } from '@/utils';
import { FiDownload, FiFilter, FiRefreshCw, FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi';

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
  deliveryPerson?: User;
  verifiedBy?: User;
}

interface Statistics {
  date_range: {
    start: string;
    end: string;
  };
  totals: {
    reconciliations: number;
    orders: number;
    expected_amount_cents: number;
    collected_amount_cents: number;
    discrepancy_cents: number;
    accuracy_percentage: number;
  };
  status_breakdown: {
    verified: number;
    disputed: number;
    pending: number;
  };
}

interface CodReconciliationIndexProps extends PageProps {
  reconciliations: {
    data: CodReconciliation[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  deliveryPersons: User[];
  filters: {
    start_date?: string;
    end_date?: string;
    delivery_person_id?: string;
    status?: string;
  };
  statistics: Statistics;
  statuses: Array<{ value: string; label: string }>;
}

export default function Index({
  auth,
  reconciliations,
  deliveryPersons,
  filters,
  statistics,
  statuses,
}: CodReconciliationIndexProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filterData, setFilterData] = useState({
    start_date: filters.start_date || '',
    end_date: filters.end_date || '',
    delivery_person_id: filters.delivery_person_id || '',
    status: filters.status || '',
  });

  const handleFilter = () => {
    router.get(route('admin.cod-reconciliation.index'), filterData, {
      preserveState: true,
    });
  };

  const handleClearFilters = () => {
    setFilterData({
      start_date: '',
      end_date: '',
      delivery_person_id: '',
      status: '',
    });
    router.get(route('admin.cod-reconciliation.index'));
  };

  const handleExport = () => {
    window.location.href = route('admin.cod-reconciliation.export', filterData);
  };

  const handleAutoVerify = () => {
    if (confirm('Auto-verify all pending reconciliations with zero discrepancy?')) {
      router.post(route('admin.cod-reconciliation.auto-verify'));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; icon: any; label: string }> = {
      pending: { class: 'bg-yellow-100 text-yellow-800', icon: FiClock, label: 'Pending' },
      verified: { class: 'bg-green-100 text-green-800', icon: FiCheckCircle, label: 'Verified' },
      disputed: { class: 'bg-red-100 text-red-800', icon: FiAlertTriangle, label: 'Disputed' },
      resolved: { class: 'bg-blue-100 text-blue-800', icon: FiCheckCircle, label: 'Resolved' },
    };

    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">COD Reconciliation</h2>}
    >
      <Head title="COD Reconciliation" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                    <dd className="text-lg font-semibold text-gray-900">{statistics.totals.orders}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Expected</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {formatCurrency(statistics.totals.expected_amount_cents / 100)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Collected</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {formatCurrency(statistics.totals.collected_amount_cents / 100)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${statistics.totals.discrepancy_cents !== 0 ? 'bg-red-500' : 'bg-gray-500'} rounded-md p-3`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Discrepancy</dt>
                    <dd className={`text-lg font-semibold ${statistics.totals.discrepancy_cents !== 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatCurrency(Math.abs(statistics.totals.discrepancy_cents) / 100)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-green-600">Verified</p>
                  <p className="text-2xl font-bold text-green-900">{statistics.status_breakdown.verified}</p>
                </div>
                <FiCheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm text-red-600">Disputed</p>
                  <p className="text-2xl font-bold text-red-900">{statistics.status_breakdown.disputed}</p>
                </div>
                <FiAlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{statistics.status_breakdown.pending}</p>
                </div>
                <FiClock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <FiFilter className="mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
                <button
                  onClick={handleAutoVerify}
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 transition"
                >
                  <FiCheckCircle className="mr-2" />
                  Auto Verify
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 transition"
                >
                  <FiDownload className="mr-2" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={filterData.start_date}
                      onChange={(e) => setFilterData({ ...filterData, start_date: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={filterData.end_date}
                      onChange={(e) => setFilterData({ ...filterData, end_date: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Person</label>
                    <select
                      value={filterData.delivery_person_id}
                      onChange={(e) => setFilterData({ ...filterData, delivery_person_id: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All</option>
                      {deliveryPersons.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filterData.status}
                      onChange={(e) => setFilterData({ ...filterData, status: e.target.value })}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All</option>
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleFilter}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 transition"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reconciliations Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Person
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Collected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discrepancy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reconciliations.data.map((reconciliation) => (
                    <tr key={reconciliation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(reconciliation.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reconciliation.deliveryPerson?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reconciliation.total_orders_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(reconciliation.total_cod_amount_cents / 100)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(reconciliation.collected_amount_cents / 100)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={reconciliation.discrepancy_cents !== 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                          {formatCurrency(Math.abs(reconciliation.discrepancy_cents) / 100)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(reconciliation.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={route('admin.cod-reconciliation.show', { reconciliation: reconciliation.id })}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {reconciliations.data.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                        No reconciliation records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {reconciliations.links && reconciliations.links.length > 3 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    {reconciliations.links[0].url && (
                      <Link
                        href={reconciliations.links[0].url}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    )}
                    {reconciliations.links[reconciliations.links.length - 1].url && (
                      <Link
                        href={reconciliations.links[reconciliations.links.length - 1].url}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{reconciliations.current_page}</span> of{' '}
                        <span className="font-medium">{reconciliations.last_page}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {reconciliations.links.map((link, index) => (
                          <Link
                            key={index}
                            href={link.url || '#'}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              link.active
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
