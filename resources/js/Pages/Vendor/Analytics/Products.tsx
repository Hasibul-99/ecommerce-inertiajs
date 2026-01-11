import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FiPackage, FiAlertTriangle, FiXCircle, FiCheckCircle, FiDownload, FiEye, FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Product {
    product_id: number;
    product_name: string;
    sku: string;
    price: number;
    stock: number;
    status: string;
    units_sold: number;
    revenue: number;
    orders_count: number;
    avg_order_value: number;
}

interface ConversionStats {
    total_products: number;
    active_products: number;
    products_with_sales: number;
    conversion_rate: number;
    low_stock_products: Array<{
        product_id: number;
        product_name: string;
        sku: string;
        stock: number;
        price: number;
    }>;
    low_stock_count: number;
    out_of_stock_count: number;
}

interface ProductViewAnalytics {
    product_id: number;
    product_name: string;
    sku: string;
    price: number;
    stock: number;
    total_views: number;
    total_orders: number;
    units_sold: number;
    revenue: number;
    conversion_rate: number;
}

interface StockMovement {
    id: number;
    product_id: number;
    product_name: string;
    sku: string;
    type: string;
    quantity: number;
    stock_before: number;
    stock_after: number;
    notes: string | null;
    created_at: string;
}

interface PriceChange {
    id: number;
    product_id: number;
    product_name: string;
    sku: string;
    old_price: number;
    new_price: number;
    change_amount: number;
    change_percentage: number;
    units_sold_before: number;
    units_sold_after: number;
    sales_change_percentage: number;
    reason: string | null;
    created_at: string;
}

interface Props extends PageProps {
    dateRange: {
        from: string;
        to: string;
    };
    vendor: {
        id: number;
        business_name: string;
    };
    productPerformance: Product[];
    conversionStats: ConversionStats;
    productViewsAnalytics: ProductViewAnalytics[];
    stockMovementHistory: StockMovement[];
    priceChangeImpact: PriceChange[];
}

export default function Products({ auth, dateRange, vendor, productPerformance, conversionStats, productViewsAnalytics, stockMovementHistory, priceChangeImpact }: Props) {
    const [from, setFrom] = useState(dateRange?.from || '');
    const [to, setTo] = useState(dateRange?.to || '');

    const handleDateChange = () => {
        router.get(route('vendor.analytics.products'), {
            from,
            to,
        }, {
            preserveState: true,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    const getStockMovementColor = (type: string) => {
        const colors: Record<string, string> = {
            purchase: 'bg-green-100 text-green-800',
            sale: 'bg-blue-100 text-blue-800',
            adjustment: 'bg-yellow-100 text-yellow-800',
            return: 'bg-purple-100 text-purple-800',
            damaged: 'bg-red-100 text-red-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Product Analytics" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Product Analytics</h1>
                            <p className="mt-2 text-gray-600">{vendor.business_name}</p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={route('vendor.analytics.export', {
                                    type: 'products',
                                    format: 'csv',
                                })}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export CSV
                            </a>
                            <a
                                href={route('vendor.analytics.export', {
                                    type: 'products',
                                    format: 'xlsx',
                                })}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                <FiDownload size={18} />
                                Export Excel
                            </a>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {conversionStats.total_products}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {conversionStats.active_products} active
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FiPackage className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">With Sales</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {conversionStats.products_with_sales}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {conversionStats.conversion_rate.toFixed(1)}% conversion
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiCheckCircle className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Low Stock</p>
                                    <p className="text-2xl font-bold text-yellow-600 mt-2">
                                        {conversionStats.low_stock_count}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">≤ 10 units</p>
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
                                    <p className="text-2xl font-bold text-red-600 mt-2">
                                        {conversionStats.out_of_stock_count}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Need restock</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <FiXCircle className="text-red-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Performance Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Product Performance</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                            Product
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                            SKU
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Stock
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Price
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Sold
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Revenue
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productPerformance.map((product) => (
                                        <tr
                                            key={product.product_id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {product.product_name}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{product.sku}</td>
                                            <td className="text-right py-3 px-4">
                                                <span
                                                    className={`text-sm font-medium ${
                                                        product.stock === 0
                                                            ? 'text-red-600'
                                                            : product.stock <= 10
                                                            ? 'text-yellow-600'
                                                            : 'text-gray-900'
                                                    }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-900">
                                                {formatCurrency(product.price)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                {product.units_sold}
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(product.revenue)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                                        product.status
                                                    )}`}
                                                >
                                                    {product.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    {conversionStats.low_stock_products.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Low Stock Alert</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                Product
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                SKU
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Stock
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Price
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {conversionStats.low_stock_products.map((product) => (
                                            <tr
                                                key={product.product_id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-3 px-4 text-sm text-gray-900">
                                                    {product.product_name}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {product.sku}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            product.stock <= 5
                                                                ? 'text-red-600'
                                                                : 'text-yellow-600'
                                                        }`}
                                                    >
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm text-gray-900">
                                                    {formatCurrency(product.price)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Product Views vs Sales Conversion */}
                    {productViewsAnalytics && productViewsAnalytics.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <FiEye size={20} className="text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-900">Views vs Sales Conversion</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                Product
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                SKU
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Views
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Orders
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Units Sold
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Conversion Rate
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productViewsAnalytics.map((product) => (
                                            <tr
                                                key={product.product_id}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                    {product.product_name}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {product.sku}
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                    {product.total_views}
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                    {product.total_orders}
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                    {product.units_sold}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            product.conversion_rate >= 5
                                                                ? 'bg-green-100 text-green-800'
                                                                : product.conversion_rate >= 2
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {product.conversion_rate}%
                                                    </span>
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                    {formatCurrency(product.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Stock Movement History */}
                    {stockMovementHistory && stockMovementHistory.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <FiActivity size={20} className="text-purple-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Stock Movement History</h2>
                                </div>
                                {dateRange && (
                                    <div className="flex gap-2 items-end">
                                        <input
                                            type="date"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                                        />
                                        <input
                                            type="date"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                                        />
                                        <button
                                            onClick={handleDateChange}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                Date
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                Product
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                Type
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Quantity
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Before
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                After
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                Notes
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockMovementHistory.map((movement) => (
                                            <tr
                                                key={movement.id}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {new Date(movement.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                    {movement.product_name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStockMovementColor(
                                                            movement.type
                                                        )}`}
                                                    >
                                                        {movement.type}
                                                    </span>
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            movement.quantity > 0
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}
                                                    >
                                                        {movement.quantity > 0 ? '+' : ''}
                                                        {movement.quantity}
                                                    </span>
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                    {movement.stock_before}
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                    {movement.stock_after}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {movement.notes || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Price Change Impact */}
                    {priceChangeImpact && priceChangeImpact.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <FiTrendingUp size={20} className="text-orange-600" />
                                <h2 className="text-xl font-bold text-gray-900">Price Change Impact Analysis</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                Date
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                                Product
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Old Price
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                New Price
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Change %
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Sales Before
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Sales After
                                            </th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                                Impact
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {priceChangeImpact.map((change) => (
                                            <tr
                                                key={change.id}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {new Date(change.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                    {change.product_name}
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                    {formatCurrency(change.old_price)}
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                    {formatCurrency(change.new_price)}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    <span
                                                        className={`flex items-center justify-end gap-1 text-sm font-medium ${
                                                            change.change_percentage > 0
                                                                ? 'text-green-600'
                                                                : change.change_percentage < 0
                                                                ? 'text-red-600'
                                                                : 'text-gray-600'
                                                        }`}
                                                    >
                                                        {change.change_percentage > 0 ? (
                                                            <FiTrendingUp size={14} />
                                                        ) : change.change_percentage < 0 ? (
                                                            <FiTrendingDown size={14} />
                                                        ) : null}
                                                        {change.change_percentage.toFixed(1)}%
                                                    </span>
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                    {change.units_sold_before}
                                                </td>
                                                <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                    {change.units_sold_after}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    <span
                                                        className={`flex items-center justify-end gap-1 text-sm font-medium ${
                                                            change.sales_change_percentage > 0
                                                                ? 'text-green-600'
                                                                : change.sales_change_percentage < 0
                                                                ? 'text-red-600'
                                                                : 'text-gray-600'
                                                        }`}
                                                    >
                                                        {change.sales_change_percentage > 0 ? (
                                                            <FiTrendingUp size={14} />
                                                        ) : change.sales_change_percentage < 0 ? (
                                                            <FiTrendingDown size={14} />
                                                        ) : null}
                                                        {change.sales_change_percentage.toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
