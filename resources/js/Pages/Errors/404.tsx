import React from 'react';
import { Head, router } from '@inertiajs/react';
import { FiSearch, FiHome, FiArrowLeft } from 'react-icons/fi';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';

interface Props {
    status: number;
    message?: string | null;
}

export default function Error404({ message }: Props) {
    return (
        <>
            <Head title="404 – Page Not Found" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">

                {/* Subtle background pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-60" />
                </div>

                <Card className="relative w-full max-w-md shadow-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    <CardContent className="pt-10 pb-8 px-8 text-center">

                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-28 h-28 bg-blue-100 dark:bg-blue-900/20 rounded-full animate-ping opacity-20" />
                                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 rounded-full flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
                                    <FiSearch className="w-9 h-9 text-blue-500 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Status code */}
                        <div className="relative mb-1">
                            <span className="text-[6rem] font-black leading-none tracking-tighter text-gray-100 dark:text-gray-700/80 select-none">
                                404
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white -mt-2">
                            Page Not Found
                        </h1>

                        {/* Divider */}
                        <div className="my-4 flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                Not Found
                            </span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            {message || "The page you're looking for doesn't exist or has been moved."}
                        </p>

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
                                onClick={() => router.visit(route('home'))}
                                className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md shadow-blue-200 dark:shadow-none"
                            >
                                <FiHome className="w-4 h-4" />
                                Go to Home
                            </Button>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </>
    );
}
