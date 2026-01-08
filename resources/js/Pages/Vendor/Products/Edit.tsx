import React, { FormEvent, useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types/index';
import {
  FiArrowLeft,
  FiSave,
  FiPackage,
  FiDollarSign,
  FiLayers,
  FiImage,
  FiTag,
  FiTrash2,
  FiX,
  FiPlus,
} from 'react-icons/fi';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductTag {
  id: number;
  name: string;
}

interface ProductImage {
  id: number;
  url: string;
}

interface Variant {
  id?: number;
  sku: string;
  attributes: Record<string, string>;
  price_cents: number;
  stock_quantity: number;
  is_default?: boolean;
}

interface VariantOption {
  name: string;
  values: string[];
}

interface Product {
  id: number;
  title: string;
  description: string;
  slug: string;
  category_id: number;
  base_price_cents: number;
  status: string;
  stock_quantity: number;
  images: ProductImage[];
  variants: Variant[];
  tags: ProductTag[];
}

interface Props {
  auth: {
    user: User;
  };
  product: Product;
  categories: Category[];
  tags: ProductTag[];
}

export default function Edit({ auth, product, categories, tags }: Props) {
  const [activeTab, setActiveTab] = useState('basic');
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>(product.tags.map((t) => t.id));
  const [existingImages, setExistingImages] = useState<ProductImage[]>(product.images);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    category_id: String(product.category_id),
    title: product.title,
    description: product.description,
    base_price_cents: product.base_price_cents,
    status: product.status,
    stock_quantity: product.stock_quantity || 0,
    tag_ids: product.tags.map((t) => t.id),
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      attributes: v.attributes,
      price_cents: v.price_cents,
      stock_quantity: v.stock_quantity,
      is_default: v.is_default || false,
    })),
    images: [] as File[],
    delete_images: [] as number[],
    _method: 'PUT',
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Extract variant options from existing variants
  useEffect(() => {
    if (product.variants.length > 0) {
      const optionsMap = new Map<string, Set<string>>();

      product.variants.forEach((variant) => {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!optionsMap.has(key)) {
            optionsMap.set(key, new Set());
          }
          optionsMap.get(key)!.add(value);
        });
      });

      const extracted: VariantOption[] = Array.from(optionsMap.entries()).map(([name, valuesSet]) => ({
        name,
        values: Array.from(valuesSet),
      }));

      setVariantOptions(extracted);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length - deleteImageIds.length + data.images.length + files.length;

    if (totalImages > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const newImages = [...data.images, ...files];
    setData('images', newImages);

    // Generate previews for new images
    const previews = newImages.map((file) => {
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then(setImagePreviews);
  };

  const removeNewImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setData('images', newImages);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = (imageId: number) => {
    const updated = [...deleteImageIds, imageId];
    setDeleteImageIds(updated);
    setData('delete_images', updated);
  };

  const addVariantOption = () => {
    setVariantOptions([...variantOptions, { name: '', values: [] }]);
  };

  const updateVariantOption = (index: number, field: 'name' | 'values', value: any) => {
    const updated = [...variantOptions];
    updated[index][field] = value;
    setVariantOptions(updated);
    generateVariants(updated);
  };

  const removeVariantOption = (index: number) => {
    const updated = variantOptions.filter((_, i) => i !== index);
    setVariantOptions(updated);
    generateVariants(updated);
  };

  const generateVariants = (options: VariantOption[]) => {
    if (options.length === 0 || options.some((opt) => opt.values.length === 0)) {
      setData('variants', []);
      return;
    }

    const combinations: Variant[] = [];
    const generate = (index: number, current: Record<string, string>) => {
      if (index === options.length) {
        // Check if this combination exists in current variants
        const existing = data.variants.find((v) => {
          return JSON.stringify(v.attributes) === JSON.stringify(current);
        });

        combinations.push(
          existing || {
            sku: '',
            attributes: { ...current },
            price_cents: data.base_price_cents || 0,
            stock_quantity: 0,
          }
        );
        return;
      }

      const option = options[index];
      option.values.forEach((value) => {
        generate(index + 1, { ...current, [option.name]: value });
      });
    };

    generate(0, {});
    setData('variants', combinations);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = [...data.variants];
    updated[index] = { ...updated[index], [field]: value };
    setData('variants', updated);
  };

  const toggleTag = (tagId: number) => {
    const updated = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(updated);
    setData('tag_ids', updated);
  };

  const handleSubmit = (e: FormEvent, status?: string) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('category_id', data.category_id);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('base_price_cents', String(data.base_price_cents));
    formData.append('status', status || data.status);

    if (data.variants.length === 0) {
      formData.append('stock_quantity', String(data.stock_quantity));
    }

    data.tag_ids.forEach((tagId, index) => {
      formData.append(`tag_ids[${index}]`, String(tagId));
    });

    data.variants.forEach((variant, index) => {
      if (variant.id) {
        formData.append(`variants[${index}][id]`, String(variant.id));
      }
      formData.append(`variants[${index}][sku]`, variant.sku);
      formData.append(`variants[${index}][price_cents]`, String(variant.price_cents));
      formData.append(`variants[${index}][stock_quantity]`, String(variant.stock_quantity));
      if (variant.is_default) {
        formData.append(`variants[${index}][is_default]`, '1');
      }
      Object.entries(variant.attributes).forEach(([key, value]) => {
        formData.append(`variants[${index}][attributes][${key}]`, value);
      });
    });

    data.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    data.delete_images.forEach((imageId, index) => {
      formData.append(`delete_images[${index}]`, String(imageId));
    });

    post(route('vendor.products.update', product.id), {
      data: formData as any,
      forceFormData: true,
    });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiPackage },
    { id: 'pricing', label: 'Pricing & Inventory', icon: FiDollarSign },
    { id: 'media', label: 'Media', icon: FiImage },
    { id: 'variants', label: 'Variants', icon: FiLayers },
    { id: 'seo', label: 'SEO & Tags', icon: FiTag },
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Product</h2>
          <Link
            href={route('vendor.products.index')}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            <FiArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </div>
      }
    >
      <Head title={`Edit ${product.title}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            {/* Tab Navigation */}
            <div className="bg-white rounded-t-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="inline-block mr-2 w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Wireless Bluetooth Headphones"
                        required
                      />
                      {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={6}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Detailed product description (minimum 20 characters)"
                        required
                      />
                      {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                      <p className="mt-1 text-sm text-gray-500">{data.description.length} characters</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Product Slug:</span> {product.slug}
                      </p>
                    </div>
                  </div>
                )}

                {/* Pricing & Inventory Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Price (USD) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={data.base_price_cents / 100}
                          onChange={(e) => setData('base_price_cents', Math.round(parseFloat(e.target.value) * 100))}
                          className="pl-7 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      {errors.base_price_cents && (
                        <p className="mt-1 text-sm text-red-600">{errors.base_price_cents}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">This is the base price for the product</p>
                    </div>

                    {data.variants.length === 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={data.stock_quantity}
                          onChange={(e) => setData('stock_quantity', parseInt(e.target.value))}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Leave as 0 if you're using variants with individual stock
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                      <p className="text-sm text-gray-500 mb-4">
                        Upload up to 10 images total. First image will be the primary image.
                      </p>

                      {/* Existing Images */}
                      {existingImages.filter((img) => !deleteImageIds.includes(img.id)).length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Current Images</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            {existingImages
                              .filter((img) => !deleteImageIds.includes(img.id))
                              .map((image, index) => (
                                <div key={image.id} className="relative group">
                                  <img
                                    src={image.url}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeExistingImage(image.id)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </button>
                                  {index === 0 && (
                                    <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                      Primary
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* New Images */}
                      {imagePreviews.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">New Images</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`New ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeNewImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                                <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                  New
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload Button */}
                      {existingImages.filter((img) => !deleteImageIds.includes(img.id)).length + data.images.length <
                        10 && (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiImage className="w-12 h-12 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB per image)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            multiple
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Modify variant options to regenerate combinations. Existing variant data will be preserved where
                        possible.
                      </p>
                    </div>

                    {/* Variant Options */}
                    {variantOptions.map((option, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">Option {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeVariantOption(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Option Name</label>
                            <input
                              type="text"
                              value={option.name}
                              onChange={(e) => updateVariantOption(index, 'name', e.target.value)}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Size, Color"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Values (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={option.values.join(', ')}
                              onChange={(e) =>
                                updateVariantOption(
                                  index,
                                  'values',
                                  e.target.value
                                    .split(',')
                                    .map((v) => v.trim())
                                    .filter(Boolean)
                                )
                              }
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., S, M, L, XL"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addVariantOption}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
                    >
                      <FiPlus className="inline-block mr-2" />
                      Add Variant Option
                    </button>

                    {/* Current Variants */}
                    {data.variants.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Product Variants ({data.variants.length})
                        </h4>
                        <div className="space-y-3">
                          {data.variants.map((variant, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Variant</label>
                                  <p className="text-sm font-medium text-gray-900">
                                    {Object.entries(variant.attributes)
                                      .map(([key, value]) => `${value}`)
                                      .join(' / ')}
                                  </p>
                                  {variant.id && (
                                    <p className="text-xs text-gray-500 mt-1">ID: {variant.id}</p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">SKU</label>
                                  <input
                                    type="text"
                                    value={variant.sku}
                                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Optional"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variant.price_cents / 100}
                                    onChange={(e) =>
                                      updateVariant(index, 'price_cents', Math.round(parseFloat(e.target.value) * 100))
                                    }
                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={variant.stock_quantity}
                                    onChange={(e) => updateVariant(index, 'stock_quantity', parseInt(e.target.value))}
                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SEO & Tags Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Tags</label>
                      <p className="text-sm text-gray-500 mb-3">Select tags that describe your product</p>

                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                              selectedTags.includes(tag.id)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">SEO Preview</h4>
                      <div className="space-y-2">
                        <p className="text-blue-600 text-lg font-medium">{data.title || 'Product Title'}</p>
                        <p className="text-sm text-green-700">/{product.slug}</p>
                        <p className="text-sm text-gray-600">
                          {data.description.slice(0, 160) || 'Product description will appear here...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-b-lg shadow p-6 mt-6">
              <div className="flex items-center justify-between">
                <Link
                  href={route('vendor.products.index')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FiSave className="mr-2" />
                    {processing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
