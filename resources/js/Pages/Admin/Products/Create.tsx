import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import Checkbox from '@/Components/Core/Checkbox';
import RichTextEditor from '@/Components/Core/RichTextEditor';
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
    title: string;
    price_cents: number;
    compare_at_price_cents?: number;
    cost_cents?: number;
    sku?: string;
    inventory_quantity: number;
    weight?: number;
}

interface Product {
    id: number;
    vendor_id: number;
    category_id: number;
    title: string;
    description: string;
    base_price_cents: number;
    currency: string;
    status: string;
    variants: ProductVariant[];
}

interface ProductTag {
    id: number;
    name: string;
    slug: string;
}

interface Props extends PageProps {
    categories: Category[];
    vendors: Vendor[];
    tags: ProductTag[];
}

export default function Create({ categories, vendors, tags, auth }: Props) {
    const [variants, setVariants] = useState<ProductVariant[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        vendor_id: '',
        category_id: '',
        title: '',
        name: '',
        slug: '',
        sku: '',
        description: '',
        base_price_cents: 0,
        price_cents: 0,
        sale_price_cents: 0,
        compare_at_price_cents: 0,
        cost_cents: 0,
        stock_quantity: 0,
        currency: 'USD',
        status: 'draft',
        is_active: true,
        is_featured: false,
        variants: [] as ProductVariant[],
        tag_ids: [] as number[],
    });

    const addVariant = () => {
        const newVariant: ProductVariant = {
            title: '',
            price_cents: 0,
            inventory_quantity: 0,
        };
        const updatedVariants = [...variants, newVariant];
        setVariants(updatedVariants);
        setData('variants', updatedVariants);
    };

    const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
        const updatedVariants = variants.map((variant, i) => 
            i === index ? { ...variant, [field]: value } : variant
        );
        setVariants(updatedVariants);
        setData('variants', updatedVariants);
    };

    const removeVariant = (index: number) => {
        const updatedVariants = variants.filter((_, i) => i !== index);
        setVariants(updatedVariants);
        setData('variants', updatedVariants);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <AdminLayout 
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Product</h2>}
        >
            <Head title="Create Product" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Create Product</h1>
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
                                                <Label htmlFor="name">Product Name</Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className={errors.name ? 'border-red-500' : ''}
                                                    placeholder="Display name for the product"
                                                />
                                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="sku">SKU</Label>
                                                <Input
                                                    id="sku"
                                                    type="text"
                                                    value={data.sku}
                                                    onChange={(e) => setData('sku', e.target.value)}
                                                    className={errors.sku ? 'border-red-500' : ''}
                                                    placeholder="Product SKU/Code"
                                                />
                                                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
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
                                                <RichTextEditor
                                                    content={data.description}
                                                    onChange={(content) => setData('description', content)}
                                                    placeholder="Enter product description with rich formatting..."
                                                    error={errors.description}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="vendor_id">Vendor</Label>
                                                <Select value={data.vendor_id} onValueChange={(value) => setData('vendor_id', value)}>
                                                    <SelectTrigger className={errors.vendor_id ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Select vendor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {vendors.map((vendor) => (
                                                            <SelectItem key={vendor.id} value={vendor.id.toString()}>
                                                                {vendor.name} ({vendor.user.name})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.vendor_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_id}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="category_id">Category</Label>
                                                <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                                    <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
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
                                                <Label htmlFor="price_cents">Price (cents)</Label>
                                                <Input
                                                    id="price_cents"
                                                    type="number"
                                                    min="0"
                                                    value={data.price_cents}
                                                    onChange={(e) => setData('price_cents', parseInt(e.target.value) || 0)}
                                                    className={errors.price_cents ? 'border-red-500' : ''}
                                                    placeholder="Regular price in cents"
                                                />
                                                {errors.price_cents && <p className="text-red-500 text-sm mt-1">{errors.price_cents}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="sale_price_cents">Sale Price (cents)</Label>
                                                <Input
                                                    id="sale_price_cents"
                                                    type="number"
                                                    min="0"
                                                    value={data.sale_price_cents}
                                                    onChange={(e) => setData('sale_price_cents', parseInt(e.target.value) || 0)}
                                                    className={errors.sale_price_cents ? 'border-red-500' : ''}
                                                    placeholder="Discounted price (optional)"
                                                />
                                                {errors.sale_price_cents && <p className="text-red-500 text-sm mt-1">{errors.sale_price_cents}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="compare_at_price_cents">Compare At Price (cents)</Label>
                                                <Input
                                                    id="compare_at_price_cents"
                                                    type="number"
                                                    min="0"
                                                    value={data.compare_at_price_cents}
                                                    onChange={(e) => setData('compare_at_price_cents', parseInt(e.target.value) || 0)}
                                                    className={errors.compare_at_price_cents ? 'border-red-500' : ''}
                                                    placeholder="Original price before discount"
                                                />
                                                {errors.compare_at_price_cents && <p className="text-red-500 text-sm mt-1">{errors.compare_at_price_cents}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="cost_cents">Cost Price (cents)</Label>
                                                <Input
                                                    id="cost_cents"
                                                    type="number"
                                                    min="0"
                                                    value={data.cost_cents}
                                                    onChange={(e) => setData('cost_cents', parseInt(e.target.value) || 0)}
                                                    className={errors.cost_cents ? 'border-red-500' : ''}
                                                    placeholder="Cost price for margin calculation"
                                                />
                                                {errors.cost_cents && <p className="text-red-500 text-sm mt-1">{errors.cost_cents}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                                <Input
                                                    id="stock_quantity"
                                                    type="number"
                                                    min="0"
                                                    value={data.stock_quantity}
                                                    onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                                    className={errors.stock_quantity ? 'border-red-500' : ''}
                                                    placeholder="Enter available stock"
                                                />
                                                {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>}
                                                <p className="text-sm text-gray-500 mt-1">Number of units available in stock</p>
                                            </div>

                                            <div>
                                                <Label htmlFor="currency">Currency</Label>
                                                <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                        <SelectItem value="EUR">EUR</SelectItem>
                                                        <SelectItem value="GBP">GBP</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="status">Status</Label>
                                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Published</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center space-x-2 pt-2">
                                                <Checkbox
                                                    id="is_active"
                                                    checked={data.is_active}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('is_active', e.target.checked)}
                                                />
                                                <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
                                                    Active (Show on website)
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="is_featured"
                                                    checked={data.is_featured}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('is_featured', e.target.checked)}
                                                />
                                                <Label htmlFor="is_featured" className="text-sm font-normal cursor-pointer">
                                                    Featured Product
                                                </Label>
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
                                            <Button type="button" onClick={addVariant} variant="outline" size="sm">
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
                                                                variant="outline"
                                                                size="sm"
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
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Product'}
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