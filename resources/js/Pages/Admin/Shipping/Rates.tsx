import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiDollarSign, FiPackage } from 'react-icons/fi';

interface ShippingRate {
    id: number;
    shipping_zone: {
        id: number;
        name: string;
    };
    shipping_method: {
        id: number;
        name: string;
        type: string;
    };
    min_weight: number;
    max_weight: number | null;
    min_order_cents: number;
    max_order_cents: number | null;
    rate_cents: number;
    free_shipping_threshold_cents: number | null;
    created_at: string;
}

interface ShippingZone {
    id: number;
    name: string;
    status: string;
}

interface ShippingMethod {
    id: number;
    name: string;
    type: string;
    status: string;
}

interface Props {
    rates: {
        data: ShippingRate[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    zones: ShippingZone[];
    methods: ShippingMethod[];
    filters: {
        zone_id?: number;
        method_id?: number;
        per_page?: number;
    };
}

export default function Rates({ rates, zones, methods, filters }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        shipping_zone_id: '',
        shipping_method_id: '',
        min_weight: 0,
        max_weight: '',
        min_order_cents: 0,
        max_order_cents: '',
        rate_cents: 0,
        free_shipping_threshold_cents: '',
    });

    const importForm = useForm({
        file: null as File | null,
        shipping_zone_id: '',
        shipping_method_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            ...data,
            max_weight: data.max_weight ? parseInt(data.max_weight as any) : null,
            max_order_cents: data.max_order_cents ? parseInt(data.max_order_cents as any) : null,
            free_shipping_threshold_cents: data.free_shipping_threshold_cents ? parseInt(data.free_shipping_threshold_cents as any) : null,
        };

        if (editingRate) {
            put(route('admin.shipping.rates.update', editingRate.id), {
                data: formData,
                onSuccess: () => {
                    setShowModal(false);
                    setEditingRate(null);
                    reset();
                },
            });
        } else {
            post(route('admin.shipping.rates.store'), {
                data: formData,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (rate: ShippingRate) => {
        setEditingRate(rate);
        setData({
            shipping_zone_id: rate.shipping_zone.id.toString(),
            shipping_method_id: rate.shipping_method.id.toString(),
            min_weight: rate.min_weight,
            max_weight: rate.max_weight?.toString() || '',
            min_order_cents: rate.min_order_cents,
            max_order_cents: rate.max_order_cents?.toString() || '',
            rate_cents: rate.rate_cents,
            free_shipping_threshold_cents: rate.free_shipping_threshold_cents?.toString() || '',
        });
        setShowModal(true);
    };

    const handleDelete = (rate: ShippingRate) => {
        if (confirm('Are you sure you want to delete this shipping rate?')) {
            router.delete(route('admin.shipping.rates.destroy', rate.id));
        }
    };

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();

        if (!importForm.data.file) {
            alert('Please select a file to import');
            return;
        }

        const formData = new FormData();
        formData.append('file', importForm.data.file);
        formData.append('shipping_zone_id', importForm.data.shipping_zone_id);
        formData.append('shipping_method_id', importForm.data.shipping_method_id);

        importForm.post(route('admin.shipping.rates.import'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setShowImportModal(false);
                importForm.reset();
            },
        });
    };

    const formatCents = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    const formatWeight = (grams: number | null) => {
        if (!grams) return 'No limit';
        const kg = grams / 1000;
        return `${kg.toFixed(2)} kg`;
    };

    return (
        <AdminLayout>
            <Head title="Shipping Rates" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Shipping Rates</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage shipping rates for zones and methods
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FiUpload /> Import CSV
                            </button>
                            <button
                                onClick={() => {
                                    setEditingRate(null);
                                    reset();
                                    setShowModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FiPlus /> Create Rate
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Filter by Zone
                                </label>
                                <select
                                    value={filters.zone_id || ''}
                                    onChange={(e) => router.get(route('admin.shipping.rates'), { zone_id: e.target.value }, {
                                        preserveState: true,
                                        preserveScroll: true,
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Zones</option>
                                    {zones.map((zone) => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Filter by Method
                                </label>
                                <select
                                    value={filters.method_id || ''}
                                    onChange={(e) => router.get(route('admin.shipping.rates'), { method_id: e.target.value }, {
                                        preserveState: true,
                                        preserveScroll: true,
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Methods</option>
                                    {methods.map((method) => (
                                        <option key={method.id} value={method.id}>
                                            {method.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Rates Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Zone / Method
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Weight Range
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order Total Range
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rate
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Free Ship At
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rates.data.map((rate) => (
                                        <tr key={rate.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {rate.shipping_zone.name}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FiPackage size={12} />
                                                    {rate.shipping_method.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{formatWeight(rate.min_weight)} -</div>
                                                <div>{formatWeight(rate.max_weight)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{formatCents(rate.min_order_cents)} -</div>
                                                <div>{rate.max_order_cents ? formatCents(rate.max_order_cents) : 'No limit'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-green-600">
                                                    {formatCents(rate.rate_cents)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {rate.free_shipping_threshold_cents
                                                    ? formatCents(rate.free_shipping_threshold_cents)
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(rate)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    <FiEdit2 className="inline" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(rate)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FiTrash2 className="inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {rates.data.length === 0 && (
                                <div className="text-center py-12">
                                    <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No shipping rates</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new rate or importing from CSV.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingRate ? 'Edit Shipping Rate' : 'Create Shipping Rate'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingRate(null);
                                        reset();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Shipping Zone *
                                        </label>
                                        <select
                                            value={data.shipping_zone_id}
                                            onChange={(e) => setData('shipping_zone_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Zone</option>
                                            {zones.map((zone) => (
                                                <option key={zone.id} value={zone.id}>
                                                    {zone.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.shipping_zone_id && <p className="mt-1 text-sm text-red-600">{errors.shipping_zone_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Shipping Method *
                                        </label>
                                        <select
                                            value={data.shipping_method_id}
                                            onChange={(e) => setData('shipping_method_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Method</option>
                                            {methods.map((method) => (
                                                <option key={method.id} value={method.id}>
                                                    {method.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.shipping_method_id && <p className="mt-1 text-sm text-red-600">{errors.shipping_method_id}</p>}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Weight Range (grams)</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Min Weight *
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.min_weight}
                                                onChange={(e) => setData('min_weight', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Max Weight (optional)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.max_weight}
                                                onChange={(e) => setData('max_weight', e.target.value)}
                                                placeholder="No limit"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Total Range (cents)</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Min Order Total *
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.min_order_cents}
                                                onChange={(e) => setData('min_order_cents', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Max Order Total (optional)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.max_order_cents}
                                                onChange={(e) => setData('max_order_cents', e.target.value)}
                                                placeholder="No limit"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Shipping Rate (cents) *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.rate_cents}
                                            onChange={(e) => setData('rate_cents', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            ${(data.rate_cents / 100).toFixed(2)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Free Shipping Threshold (cents)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.free_shipping_threshold_cents}
                                            onChange={(e) => setData('free_shipping_threshold_cents', e.target.value)}
                                            placeholder="Optional"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {data.free_shipping_threshold_cents && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Free shipping when order ≥ ${(parseInt(data.free_shipping_threshold_cents as any) / 100).toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingRate(null);
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
                                        {processing ? 'Saving...' : editingRate ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Import Rates from CSV</h2>
                                <button
                                    onClick={() => {
                                        setShowImportModal(false);
                                        importForm.reset();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleImport} className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>CSV Format:</strong> min_weight, max_weight, min_order_cents, max_order_cents, rate_cents, free_shipping_threshold_cents
                                    </p>
                                    <p className="text-sm text-blue-800 mt-2">
                                        Example: 0,1000,0,5000,500,10000
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Shipping Zone *
                                        </label>
                                        <select
                                            value={importForm.data.shipping_zone_id}
                                            onChange={(e) => importForm.setData('shipping_zone_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Zone</option>
                                            {zones.map((zone) => (
                                                <option key={zone.id} value={zone.id}>
                                                    {zone.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Shipping Method *
                                        </label>
                                        <select
                                            value={importForm.data.shipping_method_id}
                                            onChange={(e) => importForm.setData('shipping_method_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Method</option>
                                            {methods.map((method) => (
                                                <option key={method.id} value={method.id}>
                                                    {method.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CSV File *
                                    </label>
                                    <input
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={(e) => importForm.setData('file', e.target.files?.[0] || null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowImportModal(false);
                                            importForm.reset();
                                        }}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={importForm.processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {importForm.processing ? 'Importing...' : 'Import'}
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
