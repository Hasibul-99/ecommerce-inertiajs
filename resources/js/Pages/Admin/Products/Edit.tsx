import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import Checkbox from '@/Components/Core/Checkbox';
import { Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
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

interface ProductImage {
    id: number;
    url: string;
    name: string;
    size?: number;
}

interface Product {
    id: number;
    vendor_id: number;
    category_id: number;
    title: string;
    name?: string;
    slug?: string;
    sku?: string;
    description: string;
    base_price_cents: number;
    price_cents?: number;
    sale_price_cents?: number;
    compare_at_price_cents?: number;
    cost_cents?: number;
    stock_quantity: number;
    currency: string;
    status: string;
    is_active?: boolean;
    is_featured?: boolean;
    variants: ProductVariant[];
    tags?: ProductTag[];
    images?: ProductImage[];
}

interface Props extends PageProps {
    product: Product;
    categories: Category[];
    vendors: Vendor[];
    tags: ProductTag[];
}

export default function Edit({ product, categories, vendors, tags, auth }: Props) {
    const [variants, setVariants] = useState<ProductVariant[]>(product.variants || []);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<ProductImage[]>(product.images || []);
    const [deletingImageIds, setDeletingImageIds] = useState<number[]>([]);

    const { data, setData, put, processing, errors } = useForm({
        vendor_id: product.vendor_id.toString(),
        category_id: product.category_id.toString(),
        title: product.title,
        name: product.name || '',
        slug: product.slug || '',
        sku: product.sku || '',
        description: product.description,
        base_price_cents: product.base_price_cents,
        price_cents: product.price_cents || 0,
        sale_price_cents: product.sale_price_cents || 0,
        compare_at_price_cents: product.compare_at_price_cents || 0,
        cost_cents: product.cost_cents || 0,
        stock_quantity: product.stock_quantity || 0,
        currency: product.currency,
        status: product.status,
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
            if (!isValidType) {
                alert(`${file.name} is not an image file`);
                return false;
            }
            if (!isValidSize) {
                alert(`${file.name} is too large (max 5MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Create preview URLs
        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));

        setSelectedImages(prev => [...prev, ...validFiles]);
        setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const removeSelectedImage = (index: number) => {
        // Revoke the URL to free memory
        URL.revokeObjectURL(imagePreviewUrls[index]);

        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const deleteExistingImage = async (imageId: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setDeletingImageIds(prev => [...prev, imageId]);

        router.delete(route('products.images.destroy', { product: product.id, mediaId: imageId }), {
            preserveScroll: true,
            onSuccess: () => {
                setExistingImages(prev => prev.filter(img => img.id !== imageId));
                setDeletingImageIds(prev => prev.filter(id => id !== imageId));
            },
            onError: () => {
                alert('Failed to delete image');
                setDeletingImageIds(prev => prev.filter(id => id !== imageId));
            },
        });
    };

    const uploadNewImages = async () => {
        if (selectedImages.length === 0) return;

        const formData = new FormData();
        selectedImages.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        router.post(route('products.images.store', product.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                // Clear selected images
                imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
                setSelectedImages([]);
                setImagePreviewUrls([]);
                // Reload page to show new images
                router.reload({ only: ['product'] });
            },
            onError: (errors) => {
                alert('Failed to upload images');
                console.error(errors);
            },
        });
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

                                {/* Product Images Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Product Images</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {/* Existing Images */}
                                            {existingImages.length > 0 && (
                                                <div>
                                                    <Label className="text-base font-semibold mb-3 block">Current Images</Label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                        {existingImages.map((image) => (
                                                            <div key={image.id} className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all">
                                                                <div className="aspect-square bg-gray-100">
                                                                    <img
                                                                        src={image.url}
                                                                        alt={image.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteExistingImage(image.id)}
                                                                        disabled={deletingImageIds.includes(image.id)}
                                                                        className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all disabled:opacity-50"
                                                                    >
                                                                        {deletingImageIds.includes(image.id) ? (
                                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                        ) : (
                                                                            <Trash2 className="w-5 h-5" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                                                    <p className="text-white text-xs truncate">{image.name}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* New Images Preview */}
                                            {imagePreviewUrls.length > 0 && (
                                                <div>
                                                    <Label className="text-base font-semibold mb-3 block">New Images to Upload</Label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                        {imagePreviewUrls.map((url, index) => (
                                                            <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-dashed border-blue-500">
                                                                <div className="aspect-square bg-gray-100">
                                                                    <img
                                                                        src={url}
                                                                        alt={`Preview ${index + 1}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSelectedImage(index)}
                                                                        className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all"
                                                                    >
                                                                        <X className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                                <div className="absolute top-2 right-2">
                                                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">New</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Upload Area */}
                                            <div>
                                                <Label className="text-base font-semibold mb-3 block">
                                                    {existingImages.length > 0 || imagePreviewUrls.length > 0 ? 'Add More Images' : 'Upload Images'}
                                                </Label>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                                                    <input
                                                        type="file"
                                                        id="product-images"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageSelect}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="product-images"
                                                        className="cursor-pointer flex flex-col items-center space-y-3"
                                                    >
                                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <Upload className="w-8 h-8 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-medium text-gray-700">
                                                                Click to upload or drag and drop
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                PNG, JPG, GIF up to 5MB (Multiple files allowed)
                                                            </p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                document.getElementById('product-images')?.click();
                                                            }}
                                                        >
                                                            <ImageIcon className="w-4 h-4 mr-2" />
                                                            Select Images
                                                        </Button>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Upload Button */}
                                            {selectedImages.length > 0 && (
                                                <div className="flex justify-end">
                                                    <Button
                                                        type="button"
                                                        onClick={uploadNewImages}
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        Upload {selectedImages.length} Image{selectedImages.length > 1 ? 's' : ''}
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Info */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start space-x-3">
                                                    <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                                                    <div className="text-sm text-blue-800">
                                                        <p className="font-medium mb-1">Image Guidelines:</p>
                                                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                                                            <li>Use high-quality images (at least 1000x1000px recommended)</li>
                                                            <li>First image will be used as the product thumbnail</li>
                                                            <li>Maximum file size: 5MB per image</li>
                                                            <li>Supported formats: JPG, PNG, GIF, WebP</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

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