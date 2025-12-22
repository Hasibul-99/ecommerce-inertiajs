import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { PageProps } from '@/types';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    status: string;
    category: string | null;
    image: string | null;
    created_at: string;
}

interface Vendor {
    id: number;
    business_name: string;
}

interface VendorProductsProps extends PageProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
    };
    vendor: Vendor;
}

export default function VendorProducts({
    auth,
    products,
    filters,
    vendor
}: VendorProductsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [selectedStatus, setSelectedStatus] = useState(filters.status);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price / 100);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-100 text-green-800',
            draft: 'bg-gray-100 text-gray-800',
            inactive: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleFilterChange = (status: string) => {
        setSelectedStatus(status);
        router.get('/vendor/products', { status, search: searchTerm }, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/vendor/products', { status: selectedStatus, search: searchTerm }, { preserveState: true });
    };

    const statusOptions = [
        { value: 'all', label: 'All Products' },
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
        { value: 'inactive', label: 'Inactive' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Products - {vendor.business_name}
                </h2>
            }
        >
            <Head title="Vendor Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Navigation Tabs */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <Link
                                href="/vendor/dashboard"
                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/vendor/products"
                                className="border-grabit-primary text-grabit-primary whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            >
                                Products
                            </Link>
                            <Link
                                href="/vendor/orders"
                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            >
                                Orders
                            </Link>
                            <Link
                                href="/vendor/settings"
                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            >
                                Settings
                            </Link>
                        </nav>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
                                {/* Search */}
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                    />
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </form>

                                {/* Status Filter */}
                                <div className="relative">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary appearance-none"
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Add Product Button */}
                            <Link
                                href="/admin/products/create"
                                className="inline-flex items-center gap-2 bg-grabit-primary hover:bg-grabit-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors"
                            >
                                <FiPlus className="w-5 h-5" />
                                Add Product
                            </Link>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {products.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img
                                                                className="h-10 w-10 rounded object-cover"
                                                                src={product.image || '/images/placeholder-product.png'}
                                                                alt={product.name}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {product.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{product.category || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{product.stock}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(product.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/product/${product.slug}`}
                                                            className="text-gray-600 hover:text-gray-900"
                                                            title="View"
                                                        >
                                                            <FiEye className="w-5 h-5" />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            className="text-grabit-primary hover:text-grabit-primary-dark"
                                                            title="Edit"
                                                        >
                                                            <FiEdit2 className="w-5 h-5" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="px-6 py-4 border-t border-gray-200">
                                        <div className="flex justify-center gap-2">
                                            {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                                <Link
                                                    key={page}
                                                    href={`/vendor/products?page=${page}&status=${selectedStatus}&search=${searchTerm}`}
                                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                        page === products.current_page
                                                            ? 'bg-grabit-primary text-white'
                                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <FiPlus className="w-16 h-16 mx-auto opacity-50" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {filters.status === 'all' && !filters.search ? 'No products yet' : 'No products found'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {filters.status === 'all' && !filters.search
                                        ? 'Start by adding your first product'
                                        : 'Try adjusting your filters or search terms'}
                                </p>
                                <Link
                                    href="/admin/products/create"
                                    className="inline-flex items-center gap-2 bg-grabit-primary hover:bg-grabit-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors"
                                >
                                    <FiPlus className="w-5 h-5" />
                                    Add Your First Product
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
