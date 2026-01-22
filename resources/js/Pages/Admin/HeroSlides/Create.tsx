import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { FiImage } from 'react-icons/fi';
import { PageProps } from '@/types';

export default function Create() {
    const { auth } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        subtitle: '',
        description: '',
        button_text: 'Shop Now',
        button_link: '/products',
        image: null as File | null,
        order: 0,
        is_active: true,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.hero-slides.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Hero slide created successfully');
            },
            onError: () => {
                toast.error('Failed to create hero slide');
            },
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <FiImage className="h-6 w-6" />
                        Create Hero Slide
                    </h2>
                </div>
            }
        >
            <Head title="Create Hero Slide" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create Hero Slide</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Add a new slide to the homepage hero slider
                            </p>
                        </div>
                        <Link href={route('admin.hero-slides.index')}>
                            <Button variant="outline">Back to List</Button>
                        </Link>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Fresh Groceries Delivered"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Subtitle */}
                            <div>
                                <label
                                    htmlFor="subtitle"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    id="subtitle"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="To Your Doorstep"
                                />
                                {errors.subtitle && (
                                    <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Get the freshest groceries delivered to your home..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Button Text */}
                            <div>
                                <label
                                    htmlFor="button_text"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Button Text <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="button_text"
                                    value={data.button_text}
                                    onChange={(e) => setData('button_text', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Shop Now"
                                />
                                {errors.button_text && (
                                    <p className="mt-1 text-sm text-red-600">{errors.button_text}</p>
                                )}
                            </div>

                            {/* Button Link */}
                            <div>
                                <label
                                    htmlFor="button_link"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Button Link <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="button_link"
                                    value={data.button_link}
                                    onChange={(e) => setData('button_link', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="/products"
                                />
                                {errors.button_link && (
                                    <p className="mt-1 text-sm text-red-600">{errors.button_link}</p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label
                                    htmlFor="image"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Hero Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.image && (
                                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    Recommended size: 1920x500px. Max file size: 2MB
                                </p>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Order */}
                            <div>
                                <label
                                    htmlFor="order"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Order <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="order"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value))}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                                {errors.order && (
                                    <p className="mt-1 text-sm text-red-600">{errors.order}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    Lower numbers appear first in the slider
                                </p>
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                                    Active (show this slide on the homepage)
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 pt-4 border-t">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Hero Slide'}
                                </Button>
                                <Link href={route('admin.hero-slides.index')}>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
