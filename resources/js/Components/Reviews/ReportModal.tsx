import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

interface ReportModalProps {
    reviewId: number;
    productSlug: string;
    isOpen: boolean;
    onClose: () => void;
}

const REPORT_REASONS = [
    { value: 'spam', label: 'Spam or advertising' },
    { value: 'inappropriate', label: 'Inappropriate or offensive content' },
    { value: 'fake', label: 'Fake or misleading review' },
    { value: 'offensive', label: 'Harassment or hate speech' },
    { value: 'other', label: 'Other' },
];

export default function ReportModal({ reviewId, productSlug, isOpen, onClose }: ReportModalProps) {
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason) {
            toast.error('Please select a reason for reporting.');
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('reviews.report', { product: productSlug, review: reviewId }),
            { reason, details },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Thank you for your report. We will review it shortly.');
                    setReason('');
                    setDetails('');
                    onClose();
                },
                onError: (errors) => {
                    const message = Object.values(errors)[0] as string;
                    toast.error(message || 'Failed to submit report. Please try again.');
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FiAlertTriangle className="w-4 h-4 text-red-600" />
                        </div>
                        <h2 id="report-modal-title" className="text-base font-semibold text-gray-900">
                            Report Review
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <p className="text-sm text-gray-600">
                        Please select a reason for reporting this review. Our team will investigate and take appropriate action.
                    </p>

                    {/* Reason */}
                    <div className="space-y-2">
                        {REPORT_REASONS.map((opt) => (
                            <label
                                key={opt.value}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                    reason === opt.value
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="reason"
                                    value={opt.value}
                                    checked={reason === opt.value}
                                    onChange={() => setReason(opt.value)}
                                    className="text-red-500 focus:ring-red-400"
                                />
                                <span className="text-sm text-gray-700">{opt.label}</span>
                            </label>
                        ))}
                    </div>

                    {/* Details */}
                    <div>
                        <label htmlFor="report-details" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Additional details (optional)
                        </label>
                        <textarea
                            id="report-details"
                            rows={3}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            maxLength={500}
                            placeholder="Provide more context about your report..."
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{details.length}/500</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !reason}
                            className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
