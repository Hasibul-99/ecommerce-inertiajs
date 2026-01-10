import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiGlobe } from 'react-icons/fi';

interface ShippingZone {
    id: number;
    name: string;
    countries: string[];
    states: Record<string, string[]>;
    status: 'active' | 'inactive';
    created_at: string;
}

interface Props {
    zones: {
        data: ShippingZone[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        per_page?: number;
    };
}

export default function Zones({ zones, filters }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        countries: [] as string[],
        states: {} as Record<string, string[]>,
        status: 'active' as 'active' | 'inactive',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingZone) {
            put(route('admin.shipping.zones.update', editingZone.id), {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingZone(null);
                    reset();
                },
            });
        } else {
            post(route('admin.shipping.zones.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (zone: ShippingZone) => {
        setEditingZone(zone);
        setData({
            name: zone.name,
            countries: zone.countries || [],
            states: zone.states || {},
            status: zone.status,
        });
        setShowModal(true);
    };

    const handleDelete = (zone: ShippingZone) => {
        if (confirm('Are you sure you want to delete this shipping zone?')) {
            router.delete(route('admin.shipping.zones.destroy', zone.id));
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.shipping.zones'), { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAddCountry = () => {
        const country = prompt('Enter country code (e.g., US, CA, GB):');
        if (country && !data.countries.includes(country.toUpperCase())) {
            setData('countries', [...data.countries, country.toUpperCase()]);
        }
    };

    const handleRemoveCountry = (country: string) => {
        setData('countries', data.countries.filter(c => c !== country));
    };

    return (
        <AdminLayout>
            <Head title="Shipping Zones" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Shipping Zones</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage shipping zones for different regions
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingZone(null);
                                reset();
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus /> Create Zone
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
                                    placeholder="Search zones..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={filters.status || 'all'}
                                onChange={(e) => router.get(route('admin.shipping.zones'), { status: e.target.value }, {
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

                    {/* Zones Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Countries
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {zones.data.map((zone) => (
                                    <tr key={zone.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FiGlobe className="text-blue-600 mr-2" />
                                                <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {zone.countries && zone.countries.length > 0 ? (
                                                    zone.countries.slice(0, 3).map((country) => (
                                                        <span
                                                            key={country}
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            {country}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-500">No countries</span>
                                                )}
                                                {zone.countries && zone.countries.length > 3 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{zone.countries.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    zone.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {zone.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(zone.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(zone)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                <FiEdit2 className="inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(zone)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FiTrash2 className="inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {zones.data.length === 0 && (
                            <div className="text-center py-12">
                                <FiGlobe className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No shipping zones</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new zone.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {zones.last_page > 1 && (
                        <div className="mt-4 flex justify-center">
                            {/* Add pagination component here */}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingZone ? 'Edit Shipping Zone' : 'Create Shipping Zone'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingZone(null);
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
                                        Zone Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Countries
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {data.countries.map((country) => (
                                            <span
                                                key={country}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                            >
                                                {country}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCountry(country)}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddCountry}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        + Add Country
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
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
                                            setEditingZone(null);
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
                                        {processing ? 'Saving...' : editingZone ? 'Update' : 'Create'}
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
