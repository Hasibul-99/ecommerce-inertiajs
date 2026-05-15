import React from 'react';
import { Head, router } from '@inertiajs/react';
import { FiShield, FiHome, FiArrowLeft, FiLock } from 'react-icons/fi';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';

interface Props {
    status: number;
    message?: string | null;
}

export default function Error403({ message }: Props) {
    const isGenericMessage =
        !message ||
        message.toLowerCase().includes('does not have the right') ||
        message.toLowerCase().includes('this action is unauthorized');

    return (
        <>
            <Head title="403 – Access Denied" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-brand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">

                {/* Subtle background pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-100 dark:bg-brand-900/10 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-100 dark:bg-red-900/10 rounded-full blur-3xl opacity-60" />
                </div>

                <Card className="relative w-full max-w-md shadow-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    <CardContent className="pt-10 pb-8 px-8 text-center">

                        {/* Animated shield icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative flex items-center justify-center">
                                {/* Outer pulse ring */}
                                <div className="absolute w-28 h-28 bg-red-100 dark:bg-red-900/20 rounded-full animate-ping opacity-30" />
                                {/* Inner circle */}
                                <div className="relative w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/20 rounded-full flex items-center justify-center shadow-lg shadow-red-100 dark:shadow-red-900/20">
                                    <FiShield className="w-9 h-9 text-red-500 dark:text-red-400" />
                                    {/* Lock badge */}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600">
                                        <FiLock className="w-3 h-3 text-red-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status code — large watermark style */}
                        <div className="relative mb-1">
                            <span className="text-[6rem] font-black leading-none tracking-tighter text-gray-100 dark:text-gray-700/80 select-none">
                                403
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white -mt-2">
                            Access Denied
                        </h1>

                        {/* Divider */}
                        <div className="my-4 flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                Forbidden
                            </span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            {isGenericMessage
                                ? "You don't have permission to access this page. This area is restricted to users with specific roles."
                                : message}
                        </p>

                        {/* Permission hint chip */}
                        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40">
                            <FiShield className="w-3 h-3 text-red-400" />
                            <span className="text-xs text-red-500 dark:text-red-400 font-medium">
                                Insufficient permissions
                            </span>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="w-full sm:w-auto gap-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                Go Back
                            </Button>
                            <Button
                                onClick={() => router.visit(route('dashboard'))}
                                className="w-full sm:w-auto gap-2 bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700 text-white shadow-md shadow-brand-200 dark:shadow-none"
                            >
                                <FiHome className="w-4 h-4" />
                                Go to Dashboard
                            </Button>
                        </div>

                        {/* Footer */}
                        <p className="mt-6 text-xs text-gray-400 dark:text-gray-600">
                            If you believe this is a mistake, please{' '}
                            <span className="text-brand-500 dark:text-brand-400 cursor-pointer hover:underline">
                                contact your administrator
                            </span>
                            .
                        </p>

                    </CardContent>
                </Card>

            </div>
        </>
    );
}
