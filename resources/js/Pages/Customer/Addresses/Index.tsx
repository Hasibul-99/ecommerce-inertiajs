import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import AccountSidebar from '@/Components/Customer/AccountSidebar';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiMapPin, FiX, FiAlertTriangle } from 'react-icons/fi';
import { PageProps } from '@/types';

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

interface AddressesPageProps extends PageProps {
    addresses: Address[];
    cartCount?: number;
    wishlistCount?: number;
}

const defaultForm = {
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh',
    phone: '',
    type: 'both',
    is_default: false,
};

export default function AddressesIndex({
    auth,
    addresses,
    flash,
    cartCount = 0,
    wishlistCount = 0,
}: AddressesPageProps) {

    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const [formData, setFormData] = useState(defaultForm);
    const [processing, setProcessing] = useState(false);

    const openAddModal = () => {
        setEditingAddress(null);
        setFormData(defaultForm);
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
                onSuccess: () => setShowModal(false),
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

    const inputClass = 'w-full px-3 py-2.5 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary focus:border-transparent text-grabit-dark text-sm';
    const labelClass = 'block text-sm font-medium text-grabit-dark mb-1.5';

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Address Book" />

            {/* Page Header */}
            <div className="bg-grabit-bg-light py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
                        Address Book
                    </h1>
                    <p className="text-grabit-gray">
                        {addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <AccountSidebar user={auth.user} />

                    {/* Main Content */}
                    <main className="lg:col-span-3">

                        {/* Flash messages */}
                        {flash?.success && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                {flash.error}
                            </div>
                        )}

                        {/* Header row */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-heading font-semibold text-grabit-dark">
                                My Addresses
                            </h2>
                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-2 px-4 py-2 bg-grabit-primary text-white text-sm font-medium rounded-md hover:bg-grabit-primary-dark transition-colors"
                            >
                                <FiPlus className="w-4 h-4" />
                                Add Address
                            </button>
                        </div>

                        {addresses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`bg-white rounded-lg p-5 relative transition-shadow hover:shadow-md ${
                                            address.is_default
                                                ? 'border-2 border-grabit-primary'
                                                : 'border border-grabit-border'
                                        }`}
                                    >
                                        {/* Default badge */}
                                        {address.is_default && (
                                            <div className="absolute top-0 right-0 bg-grabit-primary text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-semibold flex items-center gap-1">
                                                <FiCheck className="w-3 h-3" />
                                                Default
                                            </div>
                                        )}

                                        {/* Address header */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="p-2 bg-grabit-bg-light rounded-full flex-shrink-0">
                                                <FiMapPin className="w-4 h-4 text-grabit-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-grabit-dark leading-tight">
                                                    {address.full_name}
                                                </h3>
                                                <p className="text-sm text-grabit-gray mt-0.5">{address.phone}</p>
                                            </div>
                                        </div>

                                        {/* Address details */}
                                        <div className="text-sm text-grabit-gray space-y-0.5 mb-4 pl-9">
                                            <p>{address.street}</p>
                                            <p>{address.city}, {address.state} {address.postal_code}</p>
                                            <p>{address.country}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-3 border-t border-grabit-border">
                                            {!address.is_default && (
                                                <button
                                                    onClick={() => handleSetDefault(address.id)}
                                                    disabled={processing}
                                                    className="flex-1 px-3 py-2 text-xs font-medium bg-grabit-bg-light text-grabit-dark rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                                >
                                                    Set Default
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openEditModal(address)}
                                                disabled={processing}
                                                className="flex-1 px-3 py-2 text-xs font-medium bg-brand-50 text-brand-700 rounded hover:bg-brand-100 flex items-center justify-center gap-1 disabled:opacity-50 transition-colors"
                                            >
                                                <FiEdit2 className="w-3 h-3" />
                                                Edit
                                            </button>
                                            {addresses.length > 1 && (
                                                <button
                                                    onClick={() => setShowDeleteConfirm(address.id)}
                                                    disabled={processing}
                                                    className="px-3 py-2 text-xs font-medium bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50 transition-colors"
                                                >
                                                    <FiTrash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-grabit-border rounded-lg p-12 text-center">
                                <FiMapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h2 className="text-xl font-medium text-grabit-dark mb-2">No addresses yet</h2>
                                <p className="text-grabit-gray mb-6">Add your first address to get started</p>
                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-grabit-primary text-white text-sm font-medium rounded-md hover:bg-grabit-primary-dark transition-colors"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Add Address
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-6 border-b border-grabit-border">
                            <h2 className="text-xl font-heading font-semibold text-grabit-dark">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 rounded-md text-grabit-gray hover:bg-grabit-bg-light transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Address Line 1</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address_line_1}
                                    onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                                    className={inputClass}
                                    placeholder="Street address, house number"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Address Line 2 <span className="text-grabit-gray font-normal">(Optional)</span></label>
                                <input
                                    type="text"
                                    value={formData.address_line_2}
                                    onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                                    className={inputClass}
                                    placeholder="Apartment, suite, floor, etc."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>City</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>State / Division</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Postal Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.postal_code}
                                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Country</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={inputClass}
                                        placeholder="+880..."
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_default}
                                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                    className="w-4 h-4 rounded border-grabit-border text-grabit-primary focus:ring-grabit-primary"
                                />
                                <span className="text-sm text-grabit-dark">Set as default address</span>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2.5 bg-grabit-primary text-white text-sm font-medium rounded-md hover:bg-grabit-primary-dark disabled:opacity-50 transition-colors"
                                >
                                    {processing ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={processing}
                                    className="flex-1 py-2.5 bg-grabit-bg-light text-grabit-dark text-sm font-medium rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Dialog */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md shadow-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiAlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-grabit-dark">
                                Delete Address?
                            </h3>
                        </div>
                        <p className="text-grabit-gray text-sm mb-6">
                            Are you sure you want to delete this address? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                disabled={processing}
                                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                disabled={processing}
                                className="flex-1 py-2.5 bg-grabit-bg-light text-grabit-dark text-sm font-medium rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}
