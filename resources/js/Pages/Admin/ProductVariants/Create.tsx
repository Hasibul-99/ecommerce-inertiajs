import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { PageProps } from '@/types';
import { Product } from '@/types/models';

interface Props extends PageProps {
    products: Product[];
}

export default function Create({ products, auth }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        sku: '',
        price_cents: 0,
        stock_quantity: 0,
        is_default: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.product-variants.store'));
    };

    return (
        <AdminLayout 
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('admin.product-variants.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Variants
                        </Button>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create Product Variant
                    </h2>
                </div>
            }
        >
            <Head title="Create Product Variant" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Product Variant</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Product Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="product_id">Product *</Label>
                                    <Select
                                        value={data.product_id}
                                        onValueChange={(value) => setData('product_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.product_id && (
                                        <p className="text-sm text-red-600">{errors.product_id}</p>
                                    )}
                                </div>

                                {/* SKU */}
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        type="text"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        placeholder="Enter SKU (optional)"
                                    />
                                    {errors.sku && (
                                        <p className="text-sm text-red-600">{errors.sku}</p>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="price_cents">Price (in cents) *</Label>
                                    <Input
                                        id="price_cents"
                                        type="number"
                                        min="0"
                                        value={data.price_cents}
                                        onChange={(e) => setData('price_cents', parseInt(e.target.value) || 0)}
                                        placeholder="Enter price in cents (e.g., 2999 for $29.99)"
                                    />
                                    {errors.price_cents && (
                                        <p className="text-sm text-red-600">{errors.price_cents}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Current price: ${(data.price_cents / 100).toFixed(2)}
                                    </p>
                                </div>

                                {/* Stock Quantity */}
                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        min="0"
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                        placeholder="Enter stock quantity"
                                    />
                                    {errors.stock_quantity && (
                                        <p className="text-sm text-red-600">{errors.stock_quantity}</p>
                                    )}
                                </div>

                                {/* Is Default */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="is_default"
                                        type="checkbox"
                                        checked={data.is_default}
                                        onChange={(e) => setData('is_default', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <Label htmlFor="is_default">Set as default variant</Label>
                                    {errors.is_default && (
                                        <p className="text-sm text-red-600">{errors.is_default}</p>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                    <Link href={route('admin.product-variants.index')}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Variant'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}