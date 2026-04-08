import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types/index';
import { FiArrowRight, FiArrowLeft, FiLock, FiAlertCircle } from 'react-icons/fi';

interface Vendor {
  id: number;
  business_name: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_routing_number?: string;
  bank_swift_code?: string;
}

interface Props {
  auth: {
    user: User;
  };
  vendor: Vendor;
}

export default function Step3({ auth, vendor }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    bank_name: vendor.bank_name || '',
    bank_account_name: vendor.bank_account_name || '',
    bank_account_number: vendor.bank_account_number || '',
    bank_routing_number: vendor.bank_routing_number || '',
    bank_swift_code: vendor.bank_swift_code || '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route('vendor.register.step3.store'));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Vendor Registration - Step 3 of 3
        </h2>
      }
    >
      <Head title="Vendor Registration - Bank Details" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Step 3: Bank Details</span>
              <span className="text-sm text-gray-500">99% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '99%' }}></div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                <FiLock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Bank Account Information</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Provide your bank details to receive payouts. All information is encrypted and securely stored.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="p-6 space-y-6">
              {/* Security Notice */}
              <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
                <div className="flex">
                  <FiLock className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Your information is secure
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        We use bank-level encryption to protect your financial information. Your account details
                        are never shared with third parties and are only used for processing payouts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Name */}
              <div>
                <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="bank_name"
                  type="text"
                  value={data.bank_name}
                  onChange={(e) => setData('bank_name', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Chase Bank, Bank of America"
                  required
                />
                {errors.bank_name && <p className="mt-1 text-sm text-red-600">{errors.bank_name}</p>}
              </div>

              {/* Account Name */}
              <div>
                <label htmlFor="bank_account_name" className="block text-sm font-medium text-gray-700">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="bank_account_name"
                  type="text"
                  value={data.bank_account_name}
                  onChange={(e) => setData('bank_account_name', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Name as it appears on bank account"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must match the name on your bank account
                </p>
                {errors.bank_account_name && <p className="mt-1 text-sm text-red-600">{errors.bank_account_name}</p>}
              </div>

              {/* Account Number */}
              <div>
                <label htmlFor="bank_account_number" className="block text-sm font-medium text-gray-700">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="bank_account_number"
                  type="text"
                  value={data.bank_account_number}
                  onChange={(e) => setData('bank_account_number', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="XXXXXXXXXXXX"
                  required
                />
                {errors.bank_account_number && <p className="mt-1 text-sm text-red-600">{errors.bank_account_number}</p>}
              </div>

              {/* Routing Number */}
              <div>
                <label htmlFor="bank_routing_number" className="block text-sm font-medium text-gray-700">
                  Routing Number / Sort Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="bank_routing_number"
                  type="text"
                  value={data.bank_routing_number}
                  onChange={(e) => setData('bank_routing_number', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="XXXXXXXXX"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  9-digit routing number (US) or sort code (UK)
                </p>
                {errors.bank_routing_number && <p className="mt-1 text-sm text-red-600">{errors.bank_routing_number}</p>}
              </div>

              {/* SWIFT Code */}
              <div>
                <label htmlFor="bank_swift_code" className="block text-sm font-medium text-gray-700">
                  SWIFT/BIC Code (Optional)
                </label>
                <input
                  id="bank_swift_code"
                  type="text"
                  value={data.bank_swift_code}
                  onChange={(e) => setData('bank_swift_code', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="AAAABBCCXXX"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Required for international wire transfers
                </p>
                {errors.bank_swift_code && <p className="mt-1 text-sm text-red-600">{errors.bank_swift_code}</p>}
              </div>

              {/* Important Information */}
              <div className="rounded-md bg-amber-50 border border-amber-200 p-4">
                <div className="flex">
                  <FiAlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Important Information
                    </h3>
                    <div className="mt-2 text-sm text-amber-700 space-y-1">
                      <p>• Double-check all bank details for accuracy</p>
                      <p>• Incorrect information may delay or prevent payouts</p>
                      <p>• You can update these details later from your vendor dashboard</p>
                      <p>• Payouts are typically processed within 3-5 business days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Link
                  href={route('vendor.register.step2')}
                  className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                  <FiArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                >
                  {processing ? 'Saving...' : 'Continue to Review'}
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600">
              If you have questions about providing your bank information, please{' '}
              <Link href={route('contact')} className="text-blue-600 hover:text-blue-800">
                contact our support team
              </Link>
              . We're here to help you get set up successfully.
            </p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
