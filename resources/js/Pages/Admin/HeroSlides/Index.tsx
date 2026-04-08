import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { FiEdit2, FiTrash2, FiPlus, FiImage, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'sonner';
import { PageProps } from '@/types';

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    button_text: string;
    button_link: string;
    image_url: string;
    order: number;
    is_active: boolean;
}

interface Props extends PageProps {
    slides: HeroSlide[];
}

export default function Index({ auth, slides }: Props) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this hero slide?')) {
            return;
        }

        setIsDeleting(id);
        router.delete(route('admin.hero-slides.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Hero slide deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete hero slide');
            },
            onFinish: () => {
                setIsDeleting(null);
            },
        });
    };

    const handleToggleStatus = (id: number) => {
        router.patch(
            route('admin.hero-slides.toggle-status', id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Slide status updated');
                },
                onError: () => {
                    toast.error('Failed to update status');
                },
            }
        );
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <FiImage className="h-6 w-6" />
                        Hero Slides Management
                    </h2>
                </div>
            }
        >
            <Head title="Hero Slides Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage homepage hero slider content
                            </p>
                        </div>
                        <Link href={route('admin.hero-slides.create')}>
                            <Button className="flex items-center gap-2">
                                <FiPlus className="w-5 h-5" />
                                Add New Slide
                            </Button>
                        </Link>
                    </div>

                    {/* Slides List */}
                    {slides.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <FiImage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No hero slides yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Get started by creating your first hero slide for the homepage
                            </p>
                            <Link href={route('admin.hero-slides.create')}>
                                <Button>Create First Slide</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="grid grid-cols-1 divide-y">
                                {slides.map((slide) => (
                                    <div
                                        key={slide.id}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex gap-6">
                                            {/* Slide Preview */}
                                            <div className="flex-shrink-0">
                                                <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-gray-100">
                                                    <img
                                                        src={slide.image_url}
                                                        alt={slide.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                '/images/placeholder-hero.jpg';
                                                        }}
                                                    />
                                                    {!slide.is_active && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                            <span className="text-white text-sm font-medium">
                                                                Inactive
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Slide Info */}
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {slide.title}
                                                        </h3>
                                                        {slide.subtitle && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {slide.subtitle}
                                                            </p>
                                                        )}
                                                        {slide.description && (
                                                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                                                {slide.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <strong>Button:</strong> {slide.button_text}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <strong>Order:</strong> {slide.order}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    slide.is_active
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-gray-100 text-gray-700'
                                                                }`}
                                                            >
                                                                {slide.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleToggleStatus(slide.id)}
                                                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title={
                                                                slide.is_active
                                                                    ? 'Deactivate'
                                                                    : 'Activate'
                                                            }
                                                        >
                                                            {slide.is_active ? (
                                                                <FiEyeOff className="w-5 h-5" />
                                                            ) : (
                                                                <FiEye className="w-5 h-5" />
                                                            )}
                                                        </button>

                                                        <Link
                                                            href={route('admin.hero-slides.edit', slide.id)}
                                                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <FiEdit2 className="w-5 h-5" />
                                                        </Link>

                                                        <button
                                                            onClick={() => handleDelete(slide.id)}
                                                            disabled={isDeleting === slide.id}
                                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Info Note */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Hero slides are displayed on the homepage in the order
                            specified. Active slides will automatically rotate every 5 seconds. Make sure to
                            upload high-quality images (recommended size: 1920x500px).
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
