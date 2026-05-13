import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { FiShoppingBag, FiUser, FiHeart } from 'react-icons/fi';
import { PageProps } from '@/types';
import AccountSidebar from '@/Components/Customer/AccountSidebar';

interface DashboardPageProps extends PageProps {
    cartCount?: number;
    wishlistCount?: number;
}

export default function Dashboard({ auth, cartCount = 0, wishlistCount = 0 }: DashboardPageProps) {
    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Dashboard" />

            {/* Header */}
            <div className="bg-grabit-bg-light py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
                        My Account
                    </h1>
                    <p className="text-grabit-gray">Welcome back, {auth.user.name}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <AccountSidebar user={auth.user} />

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        <div className="bg-white border border-grabit-border rounded-lg p-8">
                            <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-2">
                                Welcome back, {auth.user.name}!
                            </h2>
                            <p className="text-grabit-gray mb-6">
                                From your account dashboard you can view your recent orders, manage your shipping addresses, and edit your account details.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Link
                                    href="/orders"
                                    className="flex flex-col items-center gap-3 p-6 border border-grabit-border rounded-lg hover:border-grabit-primary hover:bg-grabit-bg-light transition-colors text-center"
                                >
                                    <FiShoppingBag className="w-8 h-8 text-grabit-primary" />
                                    <span className="font-medium text-grabit-dark">My Orders</span>
                                    <span className="text-sm text-grabit-gray">View order history</span>
                                </Link>
                                <Link
                                    href="/wishlist"
                                    className="flex flex-col items-center gap-3 p-6 border border-grabit-border rounded-lg hover:border-grabit-primary hover:bg-grabit-bg-light transition-colors text-center"
                                >
                                    <FiHeart className="w-8 h-8 text-grabit-primary" />
                                    <span className="font-medium text-grabit-dark">Wishlist</span>
                                    <span className="text-sm text-grabit-gray">Saved items</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex flex-col items-center gap-3 p-6 border border-grabit-border rounded-lg hover:border-grabit-primary hover:bg-grabit-bg-light transition-colors text-center"
                                >
                                    <FiUser className="w-8 h-8 text-grabit-primary" />
                                    <span className="font-medium text-grabit-dark">Account Settings</span>
                                    <span className="text-sm text-grabit-gray">Update your profile</span>
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </FrontendLayout>
    );
}
