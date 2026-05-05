import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { FiThumbsUp, FiFlag, FiEdit2, FiTrash2, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import StarRating from './StarRating';
import ReportModal from './ReportModal';

export interface Review {
    id: number;
    rating: number;
    title: string | null;
    comment: string;
    pros: string | null;
    cons: string | null;
    is_verified_purchase: boolean;
    helpful_count: number;
    is_helpful: boolean;
    created_at: string;
    images: { id: number; url: string }[];
    vendor_response: string | null;
    vendor_response_at: string | null;
    vendor_responder: { name: string } | null;
    user: { name: string; avatar?: string | null };
    user_id: number;
}

interface ReviewCardProps {
    review: Review;
    productSlug: string;
    currentUserId?: number;
    onHelpfulToggle: (reviewId: number, newIsHelpful: boolean, newCount: number) => void;
    onEdit: (review: Review) => void;
    onDelete: (reviewId: number) => void;
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Dhaka',
    }).format(new Date(iso));
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function ReviewCard({
    review,
    productSlug,
    currentUserId,
    onHelpfulToggle,
    onEdit,
    onDelete,
}: ReviewCardProps) {
    const [reportOpen, setReportOpen] = useState(false);
    const [isHelpfulLoading, setIsHelpfulLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [vendorResponseExpanded, setVendorResponseExpanded] = useState(false);

    const isOwner = currentUserId !== undefined && currentUserId === review.user_id;

    const handleHelpful = () => {
        if (!currentUserId) {
            toast.error('Please sign in to mark reviews as helpful.');
            return;
        }

        if (isOwner) {
            toast.error('You cannot mark your own review as helpful.');
            return;
        }

        setIsHelpfulLoading(true);

        fetch(route('reviews.helpful', { product: productSlug, review: review.id }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                'Accept': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    onHelpfulToggle(review.id, data.is_helpful, data.helpful_count);
                } else {
                    toast.error('Failed to update helpful status.');
                }
            })
            .catch(() => toast.error('An error occurred. Please try again.'))
            .finally(() => setIsHelpfulLoading(false));
    };

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        setIsDeleteLoading(true);
        router.delete(route('reviews.destroy', { product: productSlug, review: review.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Review deleted successfully.');
                onDelete(review.id);
            },
            onError: () => toast.error('Failed to delete review.'),
            onFinish: () => setIsDeleteLoading(false),
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        {review.user.avatar ? (
                            <img
                                src={review.user.avatar}
                                alt={review.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-semibold text-indigo-600">
                                {getInitials(review.user.name)}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{review.user.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
                    </div>
                </div>

                {/* Badges + Owner actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {review.is_verified_purchase && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                            <FiCheckCircle className="w-3 h-3" />
                            Verified
                        </span>
                    )}
                    {isOwner && (
                        <>
                            <button
                                onClick={() => onEdit(review)}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                title="Edit review"
                            >
                                <FiEdit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleteLoading}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                title="Delete review"
                            >
                                <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Star + Title */}
            <div className="mb-3">
                <StarRating rating={review.rating} size="sm" />
                {review.title && (
                    <h4 className="text-sm font-semibold text-gray-900 mt-1.5">{review.title}</h4>
                )}
            </div>

            {/* Comment */}
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{review.comment}</p>

            {/* Pros / Cons */}
            {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {review.pros && (
                        <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-green-700 mb-1.5">Pros</p>
                            <p className="text-xs text-green-800 leading-relaxed whitespace-pre-line">{review.pros}</p>
                        </div>
                    )}
                    {review.cons && (
                        <div className="bg-red-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-red-700 mb-1.5">Cons</p>
                            <p className="text-xs text-red-800 leading-relaxed whitespace-pre-line">{review.cons}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Images */}
            {review.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {review.images.map((img) => (
                        <button
                            key={img.id}
                            onClick={() => setLightboxImage(img.url)}
                            className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-400 transition-colors"
                        >
                            <img
                                src={img.url}
                                alt="Review image"
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Vendor Response */}
            {review.vendor_response && (
                <div className="mb-4 bg-indigo-50 rounded-lg border border-indigo-100 overflow-hidden">
                    <button
                        onClick={() => setVendorResponseExpanded(!vendorResponseExpanded)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                        <span className="text-xs font-semibold text-indigo-700">
                            Vendor Response
                            {review.vendor_response_at && (
                                <span className="font-normal text-indigo-500 ml-2">
                                    — {formatDate(review.vendor_response_at)}
                                </span>
                            )}
                        </span>
                        {vendorResponseExpanded ? (
                            <FiChevronUp className="w-3.5 h-3.5 text-indigo-400" />
                        ) : (
                            <FiChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                    </button>
                    {vendorResponseExpanded && (
                        <div className="px-4 pb-3">
                            <p className="text-sm text-indigo-900 leading-relaxed">
                                {review.vendor_response}
                            </p>
                            {review.vendor_responder && (
                                <p className="text-xs text-indigo-500 mt-1">
                                    — {review.vendor_responder.name}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                    onClick={handleHelpful}
                    disabled={isHelpfulLoading}
                    className={`inline-flex items-center gap-2 text-sm rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50 ${
                        review.is_helpful
                            ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                            : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                    <FiThumbsUp className={`w-4 h-4 ${review.is_helpful ? 'fill-current' : ''}`} />
                    <span>Helpful ({review.helpful_count})</span>
                </button>

                {!isOwner && (
                    <button
                        onClick={() => setReportOpen(true)}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <FiFlag className="w-3.5 h-3.5" />
                        Report
                    </button>
                )}
            </div>

            {/* Image Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <img
                        src={lightboxImage}
                        alt="Review image"
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                    />
                </div>
            )}

            <ReportModal
                reviewId={review.id}
                productSlug={productSlug}
                isOpen={reportOpen}
                onClose={() => setReportOpen(false)}
            />
        </div>
    );
}
