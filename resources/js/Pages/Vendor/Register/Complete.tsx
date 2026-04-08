import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types/index';
import {
  FiCheck,
  FiAlertCircle,
  FiEdit,
  FiFileText,
  FiDollarSign,
  FiClock,
  FiMail,
} from 'react-icons/fi';

interface VendorDocument {
  id: number;
  type: string;
  original_name: string;
  status: string;
}

interface Vendor {
  id: number;
  business_name: string;
  description?: string;
  business_type?: string;
  tax_id?: string;
  phone?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  bank_name?: string;
  bank_account_name?: string;
  status: string;
  documents?: VendorDocument[];
}

interface Props {
  auth: {
    user: User;
  };
  vendor: Vendor;
}

export default function Complete({ auth, vendor }: Props) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = () => {
    if (confirm('Are you sure you want to submit your vendor application for review? You can still edit your information later.')) {
      setIsSubmitting(true);
      router.post(route('vendor.register.submit'), {}, {
        onFinish: () => setIsSubmitting(false),
      });
    }
  };

  const documentCount = vendor.documents?.length || 0;
  const hasBankDetails = vendor.bank_name && vendor.bank_account_number;
  const isComplete = vendor.business_name && documentCount > 0 && hasBankDetails;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Vendor Registration - Review & Submit
        </h2>
      }
    >
      <Head title="Vendor Registration - Complete" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-600">
                Registration Complete - Ready to Submit!
              </span>
              <span className="text-sm text-gray-500">100% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Status Card */}
          {isComplete ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <FiCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-green-900">
                    Your Application is Ready!
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    You've completed all required steps. Review your information below and submit your
                    application for admin review. You'll receive an email notification once your application
                    is reviewed.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-amber-900">
                    Application Incomplete
                  </h3>
                  <p className="mt-2 text-sm text-amber-700">
                    Please complete all required steps before submitting your application.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Business Information Review */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiFileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
              </div>
              <Link
                href={route('vendor.register.step1')}
                className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                <FiEdit className="w-4 h-4 mr-1" />
                Edit
              </Link>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Business Name</p>
                <p className="mt-1 text-sm text-gray-900">{vendor.business_name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Business Type</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {vendor.business_type?.replace('_', ' ') || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Tax ID</p>
                <p className="mt-1 text-sm text-gray-900">{vendor.tax_id || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                <p className="mt-1 text-sm text-gray-900">{vendor.phone || '-'}</p>
              </div>
              {vendor.website && (
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Website</p>
                  <p className="mt-1 text-sm text-gray-900">{vendor.website}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Description</p>
                <p className="mt-1 text-sm text-gray-900">{vendor.description || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Business Address</p>
                <p className="mt-1 text-sm text-gray-900">
                  {vendor.address_line1}
                  {vendor.address_line2 && `, ${vendor.address_line2}`}
                  <br />
                  {vendor.city}, {vendor.state} {vendor.postal_code}
                  <br />
                  {vendor.country}
                </p>
              </div>
            </div>
          </div>

          {/* Documents Review */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiFileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Uploaded Documents
                  <span className="ml-2 text-sm text-gray-500">({documentCount})</span>
                </h3>
              </div>
              <Link
                href={route('vendor.register.step2')}
                className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                <FiEdit className="w-4 h-4 mr-1" />
                Edit
              </Link>
            </div>
            <div className="p-6">
              {documentCount > 0 ? (
                <div className="space-y-2">
                  {vendor.documents?.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FiFileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.original_name}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {doc.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FiClock className="w-3 h-3 mr-1" />
                        Pending Review
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No documents uploaded yet.</p>
              )}
            </div>
          </div>

          {/* Bank Details Review */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiDollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Bank Details</h3>
              </div>
              <Link
                href={route('vendor.register.step3')}
                className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                <FiEdit className="w-4 h-4 mr-1" />
                Edit
              </Link>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Bank Name</p>
                <p className="mt-1 text-sm text-gray-900">{vendor.bank_name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Account Holder</p>
                <p className="mt-1 text-sm text-gray-900">{vendor.bank_account_name || '-'}</p>
              </div>
              {vendor.bank_account_number && (
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Account Details</p>
                  <p className="mt-1 text-sm text-gray-900 font-mono">
                    Account: ****{vendor.bank_account_number.slice(-4)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-base font-medium text-blue-900 flex items-center mb-4">
              <FiMail className="w-5 h-5 mr-2" />
              What Happens Next?
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <p>Your application will be reviewed by our team (typically within 1-2 business days)</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <p>We'll verify your business documents and information</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                  3
                </span>
                <p>You'll receive an email notification with the approval status</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                  4
                </span>
                <p>Once approved, you can start adding products and accepting orders!</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Link
              href={route('dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Return to Dashboard
            </Link>
            <button
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className="inline-flex items-center px-8 py-3 bg-green-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <FiClock className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5 mr-2" />
                  Submit Application for Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
