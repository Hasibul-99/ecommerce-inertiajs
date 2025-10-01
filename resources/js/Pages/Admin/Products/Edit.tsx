import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import Checkbox from '@/Components/Core/Checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { PageProps } from '@/types';

interface Category {
    id: number;
    name: string;
}

interface Vendor {
    id: number;
    name: string;
    user: {
        name: string;
    };
}

interface ProductVariant {
    id?: number;
    title: string;
    price_cents: number;
    compare_at_price_cents?: number;
    cost_cents?: number;
    sku?: string;
    inventory_quantity: number;
    weight?: number;
}

interface ProductTag {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    vendor_id: number;
    category_id: number;
    title: string;
    slug?: string;
    description: string;
    base_price_cents: number;
    currency: string;
    status: string;
    variants: ProductVariant[];
    tags?: ProductTag[];
}

interface Props extends PageProps {
    product: Product;
    categories: Category[];
    vendors: Vendor[];
    tags: ProductTag[];
}

export default function Edit({ product, categories, vendors, tags, auth }: Props) {
    const [variants, setVariants] = useState<ProductVariant[]>(product.variants || []);

    const { data, setData, put, processing, errors } = useForm({
        vendor_id: product.vendor_id.toString(),
        category_id: product.category_id.toString(),
        title: product.title,
        slug: product.slug || '',
        description: product.description,
        base_price_cents: product.base_price_cents,
        currency: product.currency,
        status: product.status,
        variants: product.variants || [],
        tag_ids: product.tags?.map(tag => tag.id) || [],
    });

    useEffect(() => {
        setData('variants', variants);
    }, [variants]);

    const addVariant = () => {
        const newVariant: ProductVariant = {
            title: '',
            price_cents: 0,
            inventory_quantity: 0,
        };
        setVariants([...variants, newVariant]);
    };

    const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
        const updatedVariants = variants.map((variant, i) => 
            i === index ? { ...variant, [field]: value } : variant
        );
        setVariants(updatedVariants);
    };

    const removeVariant = (index: number) => {
        const updatedVariants = variants.filter((_, i) => i !== index);
        setVariants(updatedVariants);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.products.update', product.id));
    };

    return (
        <AdminLayout 
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Product: {product.title}</h2>}
        >
            <Head title={`Edit Product: ${product.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Edit Product: {product.title}</h1>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Basic Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label htmlFor="title">Product Title</Label>
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    className={errors.title ? 'border-red-500' : ''}
                                                />
                                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="slug">Product Slug</Label>
                                                <Input
                                                    id="slug"
                                                    type="text"
                                                    value={data.slug}
                                                    onChange={(e) => setData('slug', e.target.value)}
                                                    className={errors.slug ? 'border-red-500' : ''}
                                                    placeholder="product-slug-url"
                                                />
                                                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="description">Description</Label>
                                                <textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                                    rows={4}
                                                />
                                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="vendor_id">Vendor</Label>
                                                <select
                                                    id="vendor_id"
                                                    value={data.vendor_id}
                                                    onChange={(e) => setData('vendor_id', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.vendor_id ? 'border-red-500' : 'border-gray-300'}`}
                                                >
                                                    <option value="">Select vendor</option>
                                                    {vendors.map((vendor) => (
                                                        <option key={vendor.id} value={vendor.id.toString()}>
                                                            {vendor.name} ({vendor.user.name})
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.vendor_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_id}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="category_id">Category</Label>
                                                <select
                                                    id="category_id"
                                                    value={data.category_id}
                                                    onChange={(e) => setData('category_id', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Pricing & Status</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label htmlFor="base_price_cents">Base Price (cents)</Label>
                                                <Input
                                                    id="base_price_cents"
                                                    type="number"
                                                    value={data.base_price_cents}
                                                    onChange={(e) => setData('base_price_cents', parseInt(e.target.value) || 0)}
                                                    className={errors.base_price_cents ? 'border-red-500' : ''}
                                                />
                                                {errors.base_price_cents && <p className="text-red-500 text-sm mt-1">{errors.base_price_cents}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="currency">Currency</Label>
                                                <select
                                                    id="currency"
                                                    value={data.currency}
                                                    onChange={(e) => setData('currency', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                >
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="GBP">GBP</option>
                                                </select>
                                            </div>

                                            <div>
                                                <Label htmlFor="status">Status</Label>
                                                <select
                                                    id="status"
                                                    value={data.status}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                >
                                                    <option value="draft">Draft</option>
                                                    <option value="published">Published</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Product Tags</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <Label>Select Tags</Label>
                                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                                    {tags.map((tag) => (
                                                        <div key={tag.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`tag-${tag.id}`}
                                                                checked={data.tag_ids.includes(tag.id)}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    if (e.target.checked) {
                                                                        setData('tag_ids', [...data.tag_ids, tag.id]);
                                                                    } else {
                                                                        setData('tag_ids', data.tag_ids.filter(id => id !== tag.id));
                                                                    }
                                                                }}
                                                            />
                                                            <Label htmlFor={`tag-${tag.id}`} className="text-sm font-normal cursor-pointer">
                                                                {tag.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                                {tags.length === 0 && (
                                                    <p className="text-gray-500 text-sm">No tags available. Create tags first.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Product Variants</CardTitle>
                                            <Button type="button" onClick={addVariant} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Variant
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {variants.length === 0 ? (
                                            <p className="text-gray-500 text-center py-4">No variants added yet. Click "Add Variant" to create one.</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {variants.map((variant, index) => (
                                                    <div key={index} className="border rounded-lg p-4">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h4 className="font-medium">Variant {index + 1}</h4>
                                                            <Button
                                                                type="button"
                                                                onClick={() => removeVariant(index)}
                                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <Label>Title</Label>
                                                                <Input
                                                                    value={variant.title}
                                                                    onChange={(e) => updateVariant(index, 'title', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Price (cents)</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={variant.price_cents}
                                                                    onChange={(e) => updateVariant(index, 'price_cents', parseInt(e.target.value) || 0)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Inventory Quantity</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={variant.inventory_quantity}
                                                                    onChange={(e) => updateVariant(index, 'inventory_quantity', parseInt(e.target.value) || 0)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Compare Price (cents)</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={variant.compare_at_price_cents || ''}
                                                                    onChange={(e) => updateVariant(index, 'compare_at_price_cents', parseInt(e.target.value) || undefined)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Cost (cents)</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={variant.cost_cents || ''}
                                                                    onChange={(e) => updateVariant(index, 'cost_cents', parseInt(e.target.value) || undefined)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>SKU</Label>
                                                                <Input
                                                                    value={variant.sku || ''}
                                                                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="bg-gray-600 hover:bg-gray-700 text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700 text-white">
                                        {processing ? 'Updating...' : 'Update Product'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}