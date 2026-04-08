import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User } from '@/types/index';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

interface Props {
  auth: {
    user: User;
  };
}

const Create: React.FC<Props> = ({ auth }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    vendor_name: '',
    description: '',
    phone: '',
    address: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.vendors.store'));
  };

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Vendor</h2>}
    >
      <Head title="Create New Vendor" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Vendor</h1>
                  <p className="text-sm text-gray-500 mt-1">Add a new vendor to the platform</p>
                </div>
                <Link
                  href={route('admin.vendors.index')}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                >
                  <FiArrowLeft className="w-4 h-4 mr-2" />
                  Back to Vendors
                </Link>
              </div>
            </div>
          </div>

          {/* Create Form */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">User Information</h3>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="password_confirmation"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                    {errors.password_confirmation && (
                      <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Vendor Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Vendor Information</h3>

                  <div>
                    <label htmlFor="vendor_name" className="block text-sm font-medium text-gray-700">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      id="vendor_name"
                      value={data.vendor_name}
                      onChange={(e) => setData('vendor_name', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                    {errors.vendor_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.vendor_name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      value={data.status}
                      onChange={(e) => setData('status', e.target.value as 'pending' | 'approved' | 'rejected')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter vendor description..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex justify-end space-x-3">
                <Link
                  href={route('admin.vendors.index')}
                  className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 active:bg-gray-500 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  {processing ? 'Creating...' : 'Create Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Create;
