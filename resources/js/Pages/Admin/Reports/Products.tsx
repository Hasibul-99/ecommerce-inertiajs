import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FiDownload, FiPackage, FiAlertTriangle, FiXCircle, FiTrendingUp, FiActivity } from 'react-icons/fi';
import BarChart from '@/Components/Charts/BarChart';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import AdminLayout from '@/Layouts/AdminLayout';

interface Product {
    product_id: number;
    product_name: string;
    units_sold: number;
    revenue: number;
    revenue_cents: number;
}

interface CategoryData {
    category_id: number;
    category_name: string;
    units_sold: number;
    revenue: number;
    revenue_cents: number;
}

interface LowStockProduct {
    id: number;
    name: string;
    stock: number;
    sku: string;
}

interface ProductsReport {
    total_products: number;
    out_of_stock_count: number;
    low_stock_count: number;
    top_products: Product[];
    by_category: CategoryData[];
    low_stock_products: LowStockProduct[];
}

interface Props {
    dateRange: {
        from: string;
        to: string;
    };
    filters: {
        category_id?: number;
    };
    report: ProductsReport;
}

export default function Products({ auth, dateRange, filters, report }: Props) {
    const [from, setFrom] = useState(dateRange.from);
    const [to, setTo] = useState(dateRange.to);
    const [categoryId, setCategoryId] = useState(filters.category_id || '');

    const handleFilter = () => {
        router.get(route('admin.reports.products'), {
            from,
            to,
            category_id: categoryId,
        }, {
            preserveState: true,
        });
    };

    const handleExport = (format: 'csv' | 'xlsx') => {
        window.location.href = route('admin.reports.export', {
            type: 'products',
            format,
            from,
            to,
            category_id: categoryId,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Prepare chart data
    const topProductsData = {
        labels: report.top_products.slice(0, 10).map((p) => p.product_name),
        datasets: [
            {
                label: 'Units Sold',
                data: report.top_products.slice(0, 10).map((p) => p.units_sold),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
        ],
    };

    const topProductsRevenueData = {
        labels: report.top_products.slice(0, 10).map((p) => p.product_name),
        datasets: [
            {
                label: 'Revenue',
                data: report.top_products.slice(0, 10).map((p) => p.revenue),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
            },
        ],
    };

    const categoryDistributionData = {
        labels: report.by_category.slice(0, 8).map((c) => c.category_name),
        datasets: [
            {
                data: report.by_category.slice(0, 8).map((c) => c.revenue),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
            },
        ],
    };

    // Calculate totals
    const totalRevenue = report.top_products.reduce((sum, p) => sum + p.revenue, 0);
    const totalUnitsSold = report.top_products.reduce((sum, p) => sum + p.units_sold, 0);

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <FiActivity className="h-6 w-6" />
                        Admin Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Products Report" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Products Report</h1>
                            <p className="mt-2 text-gray-600">Product performance and inventory analytics</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport('csv')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export CSV
                            </button>
                            <button
                                onClick={() => handleExport('xlsx')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleFilter}
                                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{report.total_products.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">In catalog</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiPackage className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Units Sold</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{totalUnitsSold.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">In date range</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiTrendingUp className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Low Stock</p>
                                    <p className="text-2xl font-bold text-yellow-600 mt-2">{report.low_stock_count}</p>
                                    <p className="text-sm text-gray-500 mt-1">≤ 10 units</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <FiAlertTriangle className="text-yellow-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Out of Stock</p>
                                    <p className="text-2xl font-bold text-red-600 mt-2">{report.out_of_stock_count}</p>
                                    <p className="text-sm text-gray-500 mt-1">Need restock</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <FiXCircle className="text-red-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Top Products by Units */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Products by Units Sold</h2>
                            <div style={{ height: '300px' }}>
                                <BarChart data={topProductsData} title="Units Sold" yAxisLabel="Units" />
                            </div>
                        </div>

                        {/* Top Products by Revenue */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Products by Revenue</h2>
                            <div style={{ height: '300px' }}>
                                <BarChart data={topProductsRevenueData} title="Revenue" yAxisLabel="Revenue (USD)" />
                            </div>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue by Category</h2>
                            <div style={{ height: '300px' }}>
                                <DoughnutChart data={categoryDistributionData} title="Category Distribution" />
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Low Stock Alert</h2>
                            <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                                {report.low_stock_products.length > 0 ? (
                                    <table className="w-full">
                                        <thead className="sticky top-0 bg-white border-b border-gray-200">
                                            <tr>
                                                <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Product</th>
                                                <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">SKU</th>
                                                <th className="text-right py-2 px-2 text-sm font-semibold text-gray-700">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {report.low_stock_products.map((product) => (
                                                <tr key={product.id} className="border-b border-gray-100">
                                                    <td className="py-2 px-2 text-sm text-gray-900">{product.name}</td>
                                                    <td className="py-2 px-2 text-sm text-gray-600">{product.sku}</td>
                                                    <td className="text-right py-2 px-2">
                                                        <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-yellow-600'
                                                            }`}>
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No low stock products</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top Products Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Top 20 Products by Revenue</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Units Sold</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.top_products.map((product, index) => (
                                        <tr key={product.product_id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-900">#{index + 1}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.product_name}</td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">{product.units_sold}</td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(product.revenue)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {formatCurrency(product.revenue / product.units_sold)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-300">
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-bold text-gray-900" colSpan={2}>
                                            Total
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {totalUnitsSold.toLocaleString()}
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {formatCurrency(totalRevenue)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Revenue by Category Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue by Category</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Units Sold</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg per Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.by_category.map((category) => (
                                        <tr key={category.category_id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{category.category_name}</td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">{category.units_sold}</td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(category.revenue)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {formatCurrency(category.revenue / category.units_sold)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-300">
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-bold text-gray-900">Total</td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {report.by_category.reduce((sum, c) => sum + c.units_sold, 0)}
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm font-bold text-gray-900">
                                            {formatCurrency(report.by_category.reduce((sum, c) => sum + c.revenue, 0))}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
