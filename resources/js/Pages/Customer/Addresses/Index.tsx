import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiMapPin } from 'react-icons/fi';

interface Address {
    id: number;
    label: string;
    full_name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
}

interface Props {
    auth: any;
    addresses: Address[];
}

export default function AddressesIndex({ auth, addresses }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'United States',
        phone: '',
        type: 'both',
        is_default: false,
    });
    const [processing, setProcessing] = useState(false);

    const openAddModal = () => {
        setEditingAddress(null);
        setFormData({
            first_name: '',
            last_name: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'United States',
            phone: '',
            type: 'both',
            is_default: false,
        });
        setShowModal(true);
    };

    const openEditModal = (address: Address) => {
        setEditingAddress(address);
        const names = address.full_name.split(' ');
        setFormData({
            first_name: names[0] || '',
            last_name: names.slice(1).join(' ') || '',
            address_line_1: address.street.split(', ')[0] || '',
            address_line_2: address.street.split(', ')[1] || '',
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
            phone: address.phone,
            type: 'both',
            is_default: address.is_default,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (editingAddress) {
            router.put(`/customer/addresses/${editingAddress.id}`, formData, {
                onSuccess: () => { setShowModal(false); setEditingAddress(null); },
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/customer/addresses', formData, {
                onSuccess: () => { setShowModal(false); },
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleDelete = (addressId: number) => {
        setProcessing(true);
        router.delete(`/customer/addresses/${addressId}`, {
            onSuccess: () => setShowDeleteConfirm(null),
            onFinish: () => setProcessing(false),
        });
    };

    const handleSetDefault = (addressId: number) => {
        setProcessing(true);
        router.post(`/customer/addresses/${addressId}/set-default`, {}, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Address Book" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
                            <p className="text-gray-600 mt-1">Manage your shipping and billing addresses</p>
                        </div>
                        <button onClick={openAddModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                            <FiPlus /> Add Address
                        </button>
                    </div>

                    {addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {addresses.map((address) => (
                                <div key={address.id} className={'bg-white rounded-lg shadow p-6 relative ' + (address.is_default ? 'border-2 border-blue-500' : 'border border-gray-200')}>
                                    {address.is_default && (
                                        <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-semibold flex items-center gap-1">
                                            <FiCheck /> Default
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="p-2 bg-gray-100 rounded-full">
                                            <FiMapPin className="text-xl text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{address.full_name}</h3>
                                            <p className="text-sm text-gray-600">{address.phone}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-700 mb-4">
                                        <p>{address.street}</p>
                                        <p>{address.city}, {address.state} {address.postal_code}</p>
                                        <p>{address.country}</p>
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                                        {!address.is_default && (
                                            <button onClick={() => handleSetDefault(address.id)} disabled={processing} className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">
                                                Set Default
                                            </button>
                                        )}
                                        <button onClick={() => openEditModal(address)} disabled={processing} className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center justify-center gap-1 disabled:opacity-50">
                                            <FiEdit2 /> Edit
                                        </button>
                                        {addresses.length > 1 && (
                                            <button onClick={() => setShowDeleteConfirm(address.id)} disabled={processing} className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50">
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <FiMapPin className="text-6xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses yet</h3>
                            <p className="text-gray-600 mb-6">Add your first address to get started</p>
                            <button onClick={openAddModal} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Add Address
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input type="text" required value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input type="text" required value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                                <input type="text" required value={formData.address_line_1} onChange={(e) => setFormData({...formData, address_line_1: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2 (Optional)</label>
                                <input type="text" value={formData.address_line_2} onChange={(e) => setFormData({...formData, address_line_2: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <input type="text" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                    <input type="text" required value={formData.postal_code} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                    <input type="text" required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.is_default} onChange={(e) => setFormData({...formData, is_default: e.target.checked})} className="rounded" />
                                    <span className="text-sm text-gray-700">Set as default address</span>
                                </label>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={processing} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                                    {processing ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} disabled={processing} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-semibold mb-4">Delete Address?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => handleDelete(showDeleteConfirm)} disabled={processing} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                                {processing ? 'Deleting...' : 'Delete'}
                            </button>
                            <button onClick={() => setShowDeleteConfirm(null)} disabled={processing} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
