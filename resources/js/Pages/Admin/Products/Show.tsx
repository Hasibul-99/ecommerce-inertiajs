import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Edit, ArrowLeft, Trash2 } from 'lucide-react';
import { PageProps } from '@/types';

interface ProductVariant {
    id: number;
    title: string;
    price_cents: number;
    compare_at_price_cents?: number;
    cost_cents?: number;
    sku?: string;
    inventory_quantity: number;
    weight?: number;
}

interface Category {
    id: number;
    name: string;
}

interface Vendor {
    id: number;
    name: string;
    user: {
        name: string;
        email: string;
    };
}

interface Product {
    id: number;
    title: string;
    description: string;
    base_price_cents: number;
    currency: string;
    status: string;
    created_at: string;
    updated_at: string;
    category: Category;
    vendor: Vendor;
    variants: ProductVariant[];
}

interface Props extends PageProps {
    product: Product;
}

const formatPrice = (cents: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(cents / 100);
};

const getStatusBadge = (status: string) => {
    const statusConfig = {
        draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
        published: { label: 'Published', className: 'bg-green-100 text-green-800' },
        archived: { label: 'Archived', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
        <Badge className={config.className}>
            {config.label}
        </Badge>
    );
};

export default function Show({ auth, product }: Props) {
    return (
        <AdminLayout 
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Details</h2>}
        >
            <Head title={`Product: ${product.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route('admin.products.index')}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Link>
                                    <h1 className="text-2xl font-semibold">{product.title}</h1>
                                    {getStatusBadge(product.status)}
                                </div>
                                <div className="flex space-x-2">
                                    <Link href={route('admin.products.edit', { id: product.id })}>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Product Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Title</h3>
                                                <p className="mt-1 text-sm text-gray-900">{product.title}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                                <p className="mt-1 text-sm text-gray-900">{product.description}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">Base Price</h3>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {formatPrice(product.base_price_cents, product.currency)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">Currency</h3>
                                                    <p className="mt-1 text-sm text-gray-900">{product.currency}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Product Variants</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {product.variants && product.variants.length > 0 ? (
                                                <div className="space-y-4">
                                                    {product.variants.map((variant, index) => (
                                                        <div key={variant.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-medium">{variant.title}</h4>
                                                                <span className="text-lg font-semibold">
                                                                    {formatPrice(variant.price_cents, product.currency)}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                {variant.sku && (
                                                                    <div>
                                                                        <span className="text-gray-500">SKU:</span>
                                                                        <p className="font-medium">{variant.sku}</p>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="text-gray-500">Inventory:</span>
                                                                    <p className="font-medium">{variant.inventory_quantity}</p>
                                                                </div>
                                                                {variant.compare_at_price_cents && (
                                                                    <div>
                                                                        <span className="text-gray-500">Compare Price:</span>
                                                                        <p className="font-medium">
                                                                            {formatPrice(variant.compare_at_price_cents, product.currency)}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {variant.cost_cents && (
                                                                    <div>
                                                                        <span className="text-gray-500">Cost:</span>
                                                                        <p className="font-medium">
                                                                            {formatPrice(variant.cost_cents, product.currency)}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">No variants available</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Category & Vendor</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                                                <p className="mt-1 text-sm text-gray-900">{product.category.name}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Vendor</h3>
                                                <p className="mt-1 text-sm text-gray-900">{product.vendor.name}</p>
                                                <p className="text-xs text-gray-500">{product.vendor.user.name} ({product.vendor.user.email})</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Timestamps</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {new Date(product.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {new Date(product.updated_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}