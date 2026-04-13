import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { FiStar, FiX, FiImage, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import type { Review } from './ReviewCard';

interface ReviewFormProps {
    productId: number;
    productSlug: string;
    canReview?: {
        can_review: boolean;
        message: string | null;
        is_verified_purchase: boolean;
    };
    editingReview?: Review;
    onSuccess?: () => void;
}

export default function ReviewForm({ productId, productSlug, canReview, editingReview, onSuccess }: ReviewFormProps) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const isEditing = !!editingReview;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        rating: editingReview?.rating ?? 0,
        title: editingReview?.title ?? '',
        comment: editingReview?.comment ?? '',
        pros: editingReview?.pros ?? '',
        cons: editingReview?.cons ?? '',
        images: [] as File[],
    });

    // Re-populate when editingReview changes
    useEffect(() => {
        if (editingReview) {
            setData({
                rating: editingReview.rating,
                title: editingReview.title ?? '',
                comment: editingReview.comment,
                pros: editingReview.pros ?? '',
                cons: editingReview.cons ?? '',
                images: [],
            });
            setImagePreviews([]);
        }
    }, [editingReview?.id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + data.images.length > 5) {
            toast.error('You can only upload up to 5 images.');
            return;
        }

        setData('images', [...data.images, ...files]);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (isEditing && editingReview) {
            // PATCH for edit (no images on edit — keep it simple)
            patch(route('reviews.update', { product: productSlug, review: editingReview.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Review updated successfully.');
                    if (onSuccess) onSuccess();
                },
                onError: () => toast.error('Failed to update review.'),
            });
            return;
        }

        // POST for new review — useForm sends its own tracked state,
        // forceFormData handles File objects in data.images automatically
        post(route('reviews.store', productSlug), {
            forceFormData: true,
            onSuccess: (page) => {
                const flash = (page.props as any)?.flash;
                if (flash?.error) {
                    toast.error(flash.error);
                    return;
                }
                toast.success('Review submitted successfully.');
                reset();
                setImagePreviews([]);
                if (onSuccess) onSuccess();
            },
            onError: () => toast.error('Failed to submit review.'),
        });
    };

    // Check if user can review (only enforce for new reviews, not editing)
    if (!isEditing && canReview && !canReview.can_review) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-yellow-800">{canReview.message}</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setData('rating', star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="text-3xl transition-colors focus:outline-none"
                        >
                            <FiStar
                                className={
                                    star <= (hoveredRating || data.rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                }
                            />
                        </button>
                    ))}
                    {data.rating > 0 && (
                        <span className="ml-2 text-sm text-gray-600 self-center">
                            {data.rating} out of 5 stars
                        </span>
                    )}
                </div>
                {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
            </div>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title (Optional)
                </label>
                <input
                    type="text"
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={255}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Comment */}
            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="comment"
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={5}
                    maxLength={2000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">{data.comment.length}/2000 characters</p>
                {errors.comment && <p className="mt-1 text-sm text-red-600">{errors.comment}</p>}
            </div>

            {/* Pros */}
            <div>
                <label htmlFor="pros" className="block text-sm font-medium text-gray-700 mb-2">
                    What did you like? (Optional)
                </label>
                <textarea
                    id="pros"
                    value={data.pros}
                    onChange={(e) => setData('pros', e.target.value)}
                    placeholder="List the positive aspects..."
                    rows={3}
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.pros && <p className="mt-1 text-sm text-red-600">{errors.pros}</p>}
            </div>

            {/* Cons */}
            <div>
                <label htmlFor="cons" className="block text-sm font-medium text-gray-700 mb-2">
                    What could be better? (Optional)
                </label>
                <textarea
                    id="cons"
                    value={data.cons}
                    onChange={(e) => setData('cons', e.target.value)}
                    placeholder="List areas for improvement..."
                    rows={3}
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.cons && <p className="mt-1 text-sm text-red-600">{errors.cons}</p>}
            </div>

            {/* Images — only for new reviews */}
            {!isEditing && <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Photos (Optional, up to 5)
                </label>

                <div className="flex flex-wrap gap-3">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                    ))}

                    {data.images.length < 5 && (
                        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                            <FiImage className="text-gray-400 mb-1" size={24} />
                            <span className="text-xs text-gray-500">Add Photo</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
                {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
            </div>}

            {/* Verified Purchase Badge */}
            {canReview?.is_verified_purchase && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-800">Verified Purchase - Your review will be marked as verified</span>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => reset()}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={processing}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing || data.rating === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (isEditing ? 'Saving...' : 'Submitting...') : (isEditing ? 'Save Changes' : 'Submit Review')}
                </button>
            </div>
        </form>
    );
}
