import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiTruck, FiPackage } from 'react-icons/fi';

interface ShippingMethod {
    id: number;
    name: string;
    description: string;
    carrier: string;
    type: 'standard' | 'express' | 'overnight' | 'pickup' | 'free';
    estimated_days_min: number;
    estimated_days_max: number;
    status: 'active' | 'inactive';
    shipping_rates_count: number;
    created_at: string;
}

interface Props {
    methods: {
        data: ShippingMethod[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        type?: string;
        status?: string;
        per_page?: number;
    };
}

export default function Methods({ methods, filters }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        carrier: '',
        type: 'standard' as 'standard' | 'express' | 'overnight' | 'pickup' | 'free',
        estimated_days_min: 1,
        estimated_days_max: 7,
        status: 'active' as 'active' | 'inactive',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingMethod) {
            put(route('admin.shipping.methods.update', editingMethod.id), {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingMethod(null);
                    reset();
                },
            });
        } else {
            post(route('admin.shipping.methods.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (method: ShippingMethod) => {
        setEditingMethod(method);
        setData({
            name: method.name,
            description: method.description || '',
            carrier: method.carrier || '',
            type: method.type,
            estimated_days_min: method.estimated_days_min,
            estimated_days_max: method.estimated_days_max,
            status: method.status,
        });
        setShowModal(true);
    };

    const handleDelete = (method: ShippingMethod) => {
        if (method.shipping_rates_count > 0) {
            if (!confirm(`This method has ${method.shipping_rates_count} rates associated. Are you sure you want to delete it?`)) {
                return;
            }
        } else {
            if (!confirm('Are you sure you want to delete this shipping method?')) {
                return;
            }
        }
        router.delete(route('admin.shipping.methods.destroy', method.id));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.shipping.methods'), { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'express':
                return 'bg-purple-100 text-purple-800';
            case 'overnight':
                return 'bg-red-100 text-red-800';
            case 'standard':
                return 'bg-blue-100 text-blue-800';
            case 'free':
                return 'bg-green-100 text-green-800';
            case 'pickup':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <Head title="Shipping Methods" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Shipping Methods</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage available shipping methods and carriers
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingMethod(null);
                                reset();
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus /> Create Method
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search methods..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={filters.type || 'all'}
                                onChange={(e) => router.get(route('admin.shipping.methods'), { type: e.target.value }, {
                                    preserveState: true,
                                    preserveScroll: true,
                                })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="standard">Standard</option>
                                <option value="express">Express</option>
                                <option value="overnight">Overnight</option>
                                <option value="pickup">Pickup</option>
                                <option value="free">Free</option>
                            </select>
                            <select
                                value={filters.status || 'all'}
                                onChange={(e) => router.get(route('admin.shipping.methods'), { status: e.target.value }, {
                                    preserveState: true,
                                    preserveScroll: true,
                                })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Methods Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Method
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Carrier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Delivery Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rates
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {methods.data.map((method) => (
                                    <tr key={method.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <FiTruck className="text-blue-600 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{method.name}</div>
                                                    {method.description && (
                                                        <div className="text-sm text-gray-500">{method.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getTypeColor(method.type)}`}>
                                                {method.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {method.carrier || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {method.estimated_days_min === method.estimated_days_max
                                                ? `${method.estimated_days_min} day${method.estimated_days_min > 1 ? 's' : ''}`
                                                : `${method.estimated_days_min}-${method.estimated_days_max} days`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {method.shipping_rates_count} rate{method.shipping_rates_count !== 1 ? 's' : ''}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    method.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {method.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(method)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                <FiEdit2 className="inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(method)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FiTrash2 className="inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {methods.data.length === 0 && (
                            <div className="text-center py-12">
                                <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No shipping methods</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new method.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingMethod ? 'Edit Shipping Method' : 'Create Shipping Method'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingMethod(null);
                                        reset();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Method Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Standard Shipping"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Brief description of this shipping method"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Carrier
                                        </label>
                                        <input
                                            type="text"
                                            value={data.carrier}
                                            onChange={(e) => setData('carrier', e.target.value)}
                                            placeholder="e.g., USPS, FedEx, UPS"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Type *
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value as any)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="standard">Standard</option>
                                            <option value="express">Express</option>
                                            <option value="overnight">Overnight</option>
                                            <option value="pickup">Pickup</option>
                                            <option value="free">Free</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Delivery Days *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.estimated_days_min}
                                            onChange={(e) => setData('estimated_days_min', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Delivery Days *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.estimated_days_max}
                                            onChange={(e) => setData('estimated_days_max', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingMethod(null);
                                            reset();
                                        }}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : editingMethod ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
