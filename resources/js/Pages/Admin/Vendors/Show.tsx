import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User } from '@/types/index';
import {
  FiEdit,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiFileText,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiAward
} from 'react-icons/fi';

interface VendorUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface Product {
  id: number;
  title: string;
  status: string;
  base_price_cents: number;
  currency: string;
  created_at: string;
}

interface VendorDocument {
  id: number;
  type: string;
  original_name: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

interface Vendor {
  id: number;
  name: string;
  business_name?: string;
  description?: string;
  phone?: string;
  address?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  user: VendorUser;
  products: Product[];
  approver?: { name: string };
  rejecter?: { name: string };
}

interface Props {
  auth: {
    user: User;
  };
  vendor: Vendor;
  productCount: number;
  productStats: {
    published: number;
    draft: number;
  };
  approvalScore?: number;
  documents?: VendorDocument[];
}

const Show: React.FC<Props> = ({ auth, vendor, productCount, productStats, approvalScore, documents }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    router.post(
      route('admin.vendors.approve', vendor.id),
      {},
      {
        preserveState: true,
        onSuccess: () => setShowApproveModal(false),
      }
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    router.post(
      route('admin.vendors.reject', vendor.id),
      { reason: rejectReason },
      {
        preserveState: true,
        onSuccess: () => {
          setShowRejectModal(false);
          setRejectReason('');
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout 
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Vendor Management</h2>}
    >
      <Head title={`Vendor: ${vendor.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">Vendor Details</p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(vendor.status)}
                  {vendor.status === 'pending' && (
                    <>
                      <button
                        onClick={() => setShowApproveModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                      >
                        <FiCheck className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                  <Link
                    href={route('admin.vendors.edit', vendor.id)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                  >
                    <FiEdit className="w-4 h-4 mr-2" />
                    Edit Vendor
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vendor Information */}
            <div className="lg:col-span-2">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Vendor Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-4">
                        <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Owner Name</p>
                          <p className="text-sm text-gray-900">{vendor.user.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-sm text-gray-900">{vendor.user.email}</p>
                        </div>
                      </div>

                      {vendor.phone && (
                        <div className="flex items-center mb-4">
                          <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-sm text-gray-900">{vendor.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      {vendor.address && (
                        <div className="flex items-start mb-4">
                          <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Address</p>
                            <p className="text-sm text-gray-900">{vendor.address}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center mb-4">
                        <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Joined</p>
                          <p className="text-sm text-gray-900">{formatDate(vendor.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {vendor.description && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                      <p className="text-sm text-gray-900">{vendor.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-6">
              {/* Approval Score */}
              {approvalScore !== undefined && vendor.status === 'pending' && (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <FiAward className="w-5 h-5 text-yellow-600 mr-2" />
                        Approval Score
                      </h3>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {approvalScore}/100
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className={`h-2 rounded-full ${
                            approvalScore >= 60 ? 'bg-green-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${approvalScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {approvalScore >= 60 ? (
                          <span className="text-green-600 font-medium">Meets minimum requirements</span>
                        ) : (
                          <span className="text-red-600 font-medium">Below minimum (60/100)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Stats */}
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Statistics</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiPackage className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Total Products</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">{productCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">Published</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{productStats.published}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600">Draft</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{productStats.draft}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Review Section */}
          {documents && documents.length > 0 && (
            <div className="mt-6">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiFileText className="w-5 h-5 text-blue-600 mr-2" />
                    Uploaded Documents ({documents.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <FiFileText className="w-6 h-6 text-gray-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{doc.original_name}</p>
                            <p className="text-xs text-gray-500 capitalize mt-1">
                              {doc.type.replace('_', ' ')}
                            </p>
                            {doc.reviewed_at && doc.reviewed_by && (
                              <p className="text-xs text-gray-500 mt-1">
                                Reviewed by {doc.reviewed_by} on{' '}
                                {new Date(doc.reviewed_at).toLocaleDateString()}
                              </p>
                            )}
                            {doc.review_notes && (
                              <p className="text-xs text-gray-600 mt-2 italic">
                                Note: {doc.review_notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : doc.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {doc.status === 'approved' && <FiCheck className="w-3 h-3 mr-1" />}
                          {doc.status === 'rejected' && <FiX className="w-3 h-3 mr-1" />}
                          {doc.status === 'pending' && <FiClock className="w-3 h-3 mr-1" />}
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status History */}
          {(vendor.approved_at || vendor.rejected_at) && (
            <div className="mt-6">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiClock className="w-5 h-5 text-gray-600 mr-2" />
                    Status History
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {vendor.approved_at && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                            <FiCheck className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Application Approved</p>
                          <p className="text-sm text-gray-600">
                            {new Date(vendor.approved_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {vendor.approver && (
                            <p className="text-xs text-gray-500 mt-1">
                              Approved by {vendor.approver.name}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {vendor.rejected_at && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
                            <FiX className="h-5 w-5 text-red-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Application Rejected</p>
                          <p className="text-sm text-gray-600">
                            {new Date(vendor.rejected_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {vendor.rejecter && (
                            <p className="text-xs text-gray-500 mt-1">
                              Rejected by {vendor.rejecter.name}
                            </p>
                          )}
                          {vendor.rejection_reason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-xs font-medium text-red-900 mb-1">Rejection Reason:</p>
                              <p className="text-sm text-red-800">{vendor.rejection_reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Products */}
          <div className="mt-6">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Recent Products</h3>
                  <Link
                    href={route('admin.products.index', { vendor: vendor.id })}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    View All Products
                  </Link>
                </div>

                {vendor.products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {vendor.products.slice(0, 5).map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link
                                href={route('admin.products.show', product.id)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                              >
                                {product.title}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.status === 'published' 
                                  ? 'bg-green-100 text-green-800'
                                  : product.status === 'draft'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatPrice(product.base_price_cents, product.currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(product.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                    <p className="mt-1 text-sm text-gray-500">This vendor hasn't created any products yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
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
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
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
};

export default Show;