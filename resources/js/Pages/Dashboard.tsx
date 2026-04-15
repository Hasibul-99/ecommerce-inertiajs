import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { FiShoppingBag, FiUser, FiHeart, FiMapPin, FiGrid } from 'react-icons/fi';
import { PageProps } from '@/types';

interface DashboardPageProps extends PageProps {
    cartCount?: number;
    wishlistCount?: number;
}

export default function Dashboard({ auth, cartCount = 0, wishlistCount = 0 }: DashboardPageProps) {
    const { url } = usePage();

    const navLinkClass = (path: string) => {
        const active = url === path || url.startsWith(path + '?');
        return `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
            active ? 'bg-grabit-primary text-white' : 'text-grabit-gray hover:bg-grabit-bg-light'
        }`;
    };

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
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-grabit-border">
                                <div className="w-12 h-12 bg-grabit-primary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-medium text-grabit-dark">{auth.user.name}</h3>
                                    <p className="text-sm text-grabit-gray">{auth.user.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <Link href="/dashboard" className={navLinkClass('/dashboard')}>
                                    <FiGrid className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link href="/orders" className={navLinkClass('/orders')}>
                                    <FiShoppingBag className="w-5 h-5" />
                                    <span>My Orders</span>
                                </Link>
                                <Link href="/wishlist" className={navLinkClass('/wishlist')}>
                                    <FiHeart className="w-5 h-5" />
                                    <span>Wishlist</span>
                                </Link>
                                <Link href="/addresses" className={navLinkClass('/addresses')}>
                                    <FiMapPin className="w-5 h-5" />
                                    <span>Addresses</span>
                                </Link>
                                <Link href="/profile" className={navLinkClass('/profile')}>
                                    <FiUser className="w-5 h-5" />
                                    <span>Account Settings</span>
                                </Link>
                            </nav>
                        </div>
                    </aside>

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
