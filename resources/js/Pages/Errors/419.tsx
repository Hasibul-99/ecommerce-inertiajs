import React from 'react';
import { Head, router } from '@inertiajs/react';
import { FiClock, FiHome, FiRefreshCw } from 'react-icons/fi';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';

interface Props {
    status: number;
    message?: string | null;
}

export default function Error419({ message }: Props) {
    return (
        <>
            <Head title="419 – Page Expired" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-brand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100 dark:bg-amber-900/10 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-900/10 rounded-full blur-3xl opacity-60" />
                </div>

                <Card className="relative w-full max-w-md shadow-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    <CardContent className="pt-10 pb-8 px-8 text-center">

                        <div className="flex justify-center mb-6">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-28 h-28 bg-amber-100 dark:bg-amber-900/20 rounded-full animate-ping opacity-20" />
                                <div className="relative w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 rounded-full flex items-center justify-center shadow-lg shadow-amber-100 dark:shadow-amber-900/20">
                                    <FiClock className="w-9 h-9 text-amber-500 dark:text-amber-400" />
                                </div>
                            </div>
                        </div>

                        <div className="relative mb-1">
                            <span className="text-[6rem] font-black leading-none tracking-tighter text-gray-100 dark:text-gray-700/80 select-none">
                                419
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white -mt-2">
                            Page Expired
                        </h1>

                        <div className="my-4 flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                Session Expired
                            </span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            {message || 'Your session has expired or the security token is invalid. Please refresh and try again.'}
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="w-full sm:w-auto gap-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <FiRefreshCw className="w-4 h-4" />
                                Refresh Page
                            </Button>
                            <Button
                                onClick={() => router.visit(route('home'))}
                                className="w-full sm:w-auto gap-2 bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700 text-white shadow-md shadow-brand-200 dark:shadow-none"
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
