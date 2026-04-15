import { Head, Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { FiShoppingBag, FiUser, FiHeart, FiMapPin, FiGrid } from 'react-icons/fi';
import { PageProps } from '@/types';

interface ProfileEditProps extends PageProps {
    mustVerifyEmail: boolean;
    status?: string;
    cartCount?: number;
    wishlistCount?: number;
}

export default function Edit({ auth, mustVerifyEmail, status, cartCount = 0, wishlistCount = 0 }: ProfileEditProps) {
    const { url } = usePage();

    const navLinkClass = (path: string) => {
        const active = url === path || url.startsWith(path + '?');
        return `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
            active ? 'bg-grabit-primary text-white' : 'text-grabit-gray hover:bg-grabit-bg-light'
        }`;
    };

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Account Settings" />

            {/* Header */}
            <div className="bg-grabit-bg-light py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
                        Account Settings
                    </h1>
                    <p className="text-grabit-gray">Manage your profile, password, and account preferences</p>
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
                    <main className="lg:col-span-3 space-y-6">
                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        <div className="bg-white border border-grabit-border rounded-lg p-6">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </main>
                </div>
            </div>
        </FrontendLayout>
    );
}
