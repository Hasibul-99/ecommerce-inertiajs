import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User } from '@/types/index';
import {
  FiArrowLeft,
  FiSave,
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiFileText,
  FiShield,
} from 'react-icons/fi';

interface Props {
  auth: {
    user: User;
  };
}

const InputField = ({
  id,
  label,
  icon: Icon,
  error,
  required,
  ...props
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  error?: string;
  required?: boolean;
  [key: string]: any;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <input
        id={id}
        {...props}
        className={`block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border rounded-lg transition-colors
          ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50'
          } focus:outline-none placeholder-gray-400`}
      />
    </div>
    {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
  </div>
);

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

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const statusColorClass =
    data.status === 'approved'
      ? 'border-green-200 text-green-700 focus:border-green-400 focus:ring-2 focus:ring-green-50'
      : data.status === 'rejected'
      ? 'border-red-200 text-red-700 focus:border-red-400 focus:ring-2 focus:ring-red-50'
      : 'border-amber-200 text-amber-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-50';

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Vendor</h2>}
    >
      <Head title="Create New Vendor" />

      <div className="py-8">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Vendor</h1>
              <p className="text-sm text-gray-500 mt-1">Add a new vendor account to the platform</p>
            </div>
            <Link
              href={route('admin.vendors.index')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Vendors
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* User Information Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FiUser className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">User Information</h3>
                    <p className="text-xs text-gray-500">Login credentials for the vendor</p>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <InputField
                    id="name"
                    label="Owner Name"
                    icon={FiUser}
                    type="text"
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    placeholder="John Doe"
                    error={errors.name}
                    required
                  />
                  <InputField
                    id="email"
                    label="Email Address"
                    icon={FiMail}
                    type="email"
                    value={data.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                    placeholder="vendor@example.com"
                    error={errors.email}
                    required
                  />
                  <InputField
                    id="password"
                    label="Password"
                    icon={FiLock}
                    type="password"
                    value={data.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value)}
                    placeholder="Min. 8 characters"
                    error={errors.password}
                    required
                  />
                  <InputField
                    id="password_confirmation"
                    label="Confirm Password"
                    icon={FiLock}
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value)}
                    placeholder="Re-enter password"
                    error={errors.password_confirmation}
                    required
                  />
                  <InputField
                    id="phone"
                    label="Phone Number"
                    icon={FiPhone}
                    type="tel"
                    value={data.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    error={errors.phone}
                  />
                </div>
              </div>

              {/* Vendor Information Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FiShoppingBag className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Vendor Information</h3>
                    <p className="text-xs text-gray-500">Business profile details</p>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <InputField
                    id="vendor_name"
                    label="Business Name"
                    icon={FiShoppingBag}
                    type="text"
                    value={data.vendor_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('vendor_name', e.target.value)}
                    placeholder="Acme Store"
                    error={errors.vendor_name}
                    required
                  />

                  {/* Status Field */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FiShield className="h-4 w-4 text-gray-400" />
                      </div>
                      <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value as 'pending' | 'approved' | 'rejected')}
                        className={`block w-full pl-10 pr-8 py-2.5 text-sm bg-white border rounded-lg appearance-none transition-colors focus:outline-none
                          ${errors.status ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : statusColorClass}`}
                        required
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.status && <p className="mt-1.5 text-xs text-red-600">{errors.status}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-3.5 pointer-events-none">
                        <FiMapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <textarea
                        id="address"
                        rows={3}
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Street address, city, state..."
                        className={`block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border rounded-lg transition-colors resize-none focus:outline-none placeholder-gray-400
                          ${errors.address
                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50'
                          }`}
                      />
                    </div>
                    {errors.address && <p className="mt-1.5 text-xs text-red-600">{errors.address}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
                <div className="p-2 bg-brand-100 rounded-lg">
                  <FiFileText className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Description</h3>
                  <p className="text-xs text-gray-500">Brief overview of the vendor's business</p>
                </div>
              </div>
              <div className="p-6">
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3.5 pointer-events-none">
                    <FiFileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Describe the vendor's business, products, and services..."
                    className={`block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border rounded-lg transition-colors resize-none focus:outline-none placeholder-gray-400
                      ${errors.description
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50'
                      }`}
                  />
                </div>
                {errors.description && <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href={route('admin.vendors.index')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <FiSave className="w-4 h-4" />
                {processing ? 'Creating...' : 'Create Vendor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Create;
