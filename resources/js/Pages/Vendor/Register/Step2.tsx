import React, { FormEvent, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types/index';
import { FiArrowRight, FiArrowLeft, FiUpload, FiX, FiFile, FiCheck } from 'react-icons/fi';

interface VendorDocument {
  id: number;
  type: string;
  original_name: string;
  status: string;
}

interface Vendor {
  id: number;
  business_name: string;
}

interface Props {
  auth: {
    user: User;
  };
  vendor: Vendor;
  documents?: VendorDocument[];
}

interface DocumentUpload {
  file: File | null;
  type: string;
  preview?: string;
}

export default function Step2({ auth, vendor, documents }: Props) {
  const [documentUploads, setDocumentUploads] = useState<DocumentUpload[]>([
    { file: null, type: 'business_license' },
  ]);

  const { data, setData, post, processing, errors } = useForm({
    documents: [] as any[],
  });

  const documentTypes = [
    { value: 'business_license', label: 'Business License' },
    { value: 'tax_certificate', label: 'Tax Certificate' },
    { value: 'id_proof', label: 'ID Proof' },
    { value: 'address_proof', label: 'Address Proof' },
    { value: 'other', label: 'Other Document' },
  ];

  const addDocumentField = () => {
    setDocumentUploads([...documentUploads, { file: null, type: '' }]);
  };

  const removeDocumentField = (index: number) => {
    const newUploads = documentUploads.filter((_, i) => i !== index);
    setDocumentUploads(newUploads);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newUploads = [...documentUploads];
    newUploads[index].file = file;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newUploads[index].preview = reader.result as string;
        setDocumentUploads([...newUploads]);
      };
      reader.readAsDataURL(file);
    } else {
      newUploads[index].preview = undefined;
      setDocumentUploads(newUploads);
    }
  };

  const handleTypeChange = (index: number, type: string) => {
    const newUploads = [...documentUploads];
    newUploads[index].type = type;
    setDocumentUploads(newUploads);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    documentUploads.forEach((doc, index) => {
      if (doc.file && doc.type) {
        formData.append(`documents[${index}][file]`, doc.file);
        formData.append(`documents[${index}][type]`, doc.type);
      }
    });

    post(route('vendor.register.step2.store'), {
      data: formData as any,
      forceFormData: true,
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Vendor Registration - Step 2 of 3
        </h2>
      }
    >
      <Head title="Vendor Registration - Documents" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Step 2: Upload Documents</span>
              <span className="text-sm text-gray-500">66% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
              <p className="mt-1 text-sm text-gray-600">
                Upload your business documents for verification. We require at least one document to proceed.
              </p>
            </div>

            <form onSubmit={submit} className="p-6 space-y-6">
              {/* Existing Documents */}
              {documents && documents.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Previously Uploaded Documents</h4>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <FiFile className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.original_name}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {doc.type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : doc.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {doc.status === 'approved' && <FiCheck className="w-3 h-3 mr-1" />}
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Upload Fields */}
              <div className="space-y-4">
                {documentUploads.map((upload, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        Document {index + 1}
                      </h4>
                      {documentUploads.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDocumentField(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={upload.type}
                        onChange={(e) => handleTypeChange(index, e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select document type</option>
                        {documentTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File <span className="text-red-500">*</span>
                      </label>

                      {upload.preview ? (
                        <div className="relative">
                          {upload.file?.type.startsWith('image/') ? (
                            <img
                              src={upload.preview}
                              alt="Document preview"
                              className="w-full h-48 object-contain border-2 border-gray-300 rounded-lg bg-gray-50"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-48 border-2 border-gray-300 rounded-lg bg-gray-50">
                              <div className="text-center">
                                <FiFile className="w-16 h-16 mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">{upload.file?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(upload.file?.size! / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleFileChange(index, null)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiUpload className="w-12 h-12 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                            required
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Documents */}
              <button
                type="button"
                onClick={addDocumentField}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Another Document
              </button>

              {/* Error Display */}
              {errors.documents && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{errors.documents}</p>
                </div>
              )}

              {/* Information Box */}
              <div className="rounded-md bg-blue-50 p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Document Requirements:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>At least one document is required (Business License recommended)</li>
                  <li>Documents must be clear and readable</li>
                  <li>Accepted formats: PDF, PNG, JPG</li>
                  <li>Maximum file size: 5MB per document</li>
                  <li>All documents will be securely stored and reviewed by our team</li>
                </ul>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Link
                  href={route('vendor.register.step1')}
                  className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                  <FiArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Link>
                <button
                  type="submit"
                  disabled={processing || documentUploads.every((doc) => !doc.file)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                >
                  {processing ? 'Uploading...' : 'Continue to Bank Details'}
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
