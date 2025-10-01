import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User } from '@/types/index';
import { FiEdit, FiMail, FiPhone, FiMapPin, FiPackage, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';

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

interface Vendor {
  id: number;
  name: string;
  description?: string;
  phone?: string;
  address?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user: VendorUser;
  products: Product[];
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
}

const Show: React.FC<Props> = ({ auth, vendor, productCount, productStats }) => {
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
                <div className="flex space-x-3">
                  {getStatusBadge(vendor.status)}
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
    </AdminLayout>
  );
};

export default Show;