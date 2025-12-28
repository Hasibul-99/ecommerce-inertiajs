import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/Core/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FiUser, FiMail, FiLock, FiUserPlus, FiShoppingBag } from 'react-icons/fi';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="min-h-screen bg-gradient-to-br from-grabit-primary to-green-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
                            <FiShoppingBag className="w-10 h-10" />
                            <span className="text-3xl font-heading font-bold">Grabit</span>
                        </Link>
                        <p className="mt-2 text-white opacity-90">Create your account to get started</p>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white rounded-lg shadow-2xl p-8">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-grabit-dark mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-grabit-gray" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary focus:border-transparent"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-grabit-dark mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-grabit-gray" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary focus:border-transparent"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-grabit-dark mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-grabit-gray" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary focus:border-transparent"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-grabit-dark mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-grabit-gray" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary focus:border-transparent"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start">
                                <p className="text-xs text-grabit-gray">
                                    By creating an account, you agree to our{' '}
                                    <Link href="#" className="text-grabit-primary hover:text-grabit-primary-dark">
                                        Terms of Service
                                    </Link>
                                    {' '}and{' '}
                                    <Link href="#" className="text-grabit-primary hover:text-grabit-primary-dark">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-grabit-primary hover:bg-grabit-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-grabit-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FiUserPlus className="w-5 h-5" />
                                {processing ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-grabit-gray">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-medium text-grabit-primary hover:text-grabit-primary-dark"
                                >
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-white hover:text-gray-100 opacity-90 hover:opacity-100"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
