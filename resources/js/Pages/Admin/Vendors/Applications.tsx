import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User } from '@/types/index';
import {
  FiClock,
  FiSearch,
  FiEye,
  FiCheck,
  FiX,
  FiFileText,
  FiAlertCircle,
} from 'react-icons/fi';

interface VendorDocument {
  id: number;
  type: string;
  status: string;
}

interface Vendor {
  id: number;
  user_id: number;
  business_name: string;
  description?: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  documents?: VendorDocument[];
}

interface Props {
  auth: {
    user: User;
  };
  vendors: {
    data: Vendor[];
    links: any[];
    meta: any;
  };
  filters: {
    search?: string;
  };
}

export default function Applications({ auth, vendors, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showApproveModal, setShowApproveModal] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleSearch = () => {
    router.get(
      route('admin.vendors.applications'),
      { search: searchTerm },
      { preserveState: true, replace: true }
    );
  };

  const handleApprove = (vendorId: number) => {
    router.post(
      route('admin.vendors.approve', vendorId),
      {},
      {
        preserveState: true,
        onSuccess: () => {
          setShowApproveModal(null);
        },
      }
    );
  };

  const handleReject = (vendorId: number) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    router.post(
      route('admin.vendors.reject', vendorId),
      { reason: rejectReason },
      {
        preserveState: true,
        onSuccess: () => {
          setShowRejectModal(null);
          setRejectReason('');
        },
      }
    );
  };

  const getDocumentStatusSummary = (documents: VendorDocument[] | undefined) => {
    if (!documents || documents.length === 0) {
      return { total: 0, approved: 0, pending: 0, rejected: 0 };
    }

    return {
      total: documents.length,
      approved: documents.filter((d) => d.status === 'approved').length,
      pending: documents.filter((d) => d.status === 'pending').length,
      rejected: documents.filter((d) => d.status === 'rejected').length,
    };
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
          <FiClock className="h-6 w-6" />
          Vendor Applications
        </h2>
      }
    >
      <Head title="Vendor Applications" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiClock className="h-8 w-8 text-yellow-600" />
                Pending Vendor Applications
              </h1>
              <p className="text-gray-600 mt-1">
                Review and approve or reject vendor registration applications
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by business name, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {vendors.data.length > 0 ? (
            <div className="space-y-4">
              {vendors.data.map((vendor) => {
                const docStatus = getDocumentStatusSummary(vendor.documents);

                return (
                  <div
                    key={vendor.id}
                    className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {vendor.business_name}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FiClock className="w-3 h-3 mr-1" />
                              Pending Review
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Contact Person:</span> {vendor.user.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {vendor.user.email}
                              </p>
                              {vendor.phone && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Phone:</span> {vendor.phone}
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Applied:</span>{' '}
                                {new Date(vendor.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Documents:</span> {docStatus.total} uploaded
                                {docStatus.pending > 0 && (
                                  <span className="ml-2 text-yellow-600">
                                    ({docStatus.pending} pending review)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {vendor.description && (
                            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                              {vendor.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 ml-6">
                          <Link
                            href={route('admin.vendors.show', vendor.id)}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                          >
                            <FiEye className="w-4 h-4 mr-2" />
                            Review
                          </Link>
                          <button
                            onClick={() => setShowApproveModal(vendor.id)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                          >
                            <FiCheck className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => setShowRejectModal(vendor.id)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                          >
                            <FiX className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-12 text-center">
                <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending applications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All vendor applications have been reviewed.
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {vendors.links && vendors.links.length > 3 && (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{vendors.meta?.from || 0}</span> to{' '}
                      <span className="font-medium">{vendors.meta?.to || 0}</span> of{' '}
                      <span className="font-medium">{vendors.meta?.total || 0}</span> applications
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {vendors.links?.map((link, index) => (
                        <Link
                          key={index}
                          href={link.url || '#'}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            link.active
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } ${index === 0 ? 'rounded-l-md' : ''} ${
                            index === (vendors.links?.length || 0) - 1 ? 'rounded-r-md' : ''
                          }`}
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

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FiCheck className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Approve Vendor Application</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to approve this vendor application? The vendor will be notified
              via email and can start selling on the platform.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(showApproveModal)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FiAlertCircle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Reject Vendor Application</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this application. The vendor will receive this
              explanation.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 mb-4"
              placeholder="Explain why this application is being rejected..."
              required
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
