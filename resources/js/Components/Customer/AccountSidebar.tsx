import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FiGrid, FiShoppingBag, FiHeart, FiMapPin, FiUser } from 'react-icons/fi';

interface User {
    name: string;
    email: string;
}

interface AccountSidebarProps {
    user: User;
}

export default function AccountSidebar({ user }: AccountSidebarProps) {
    const { url } = usePage();

    const navLinkClass = (path: string) => {
        const active = url === path || url.startsWith(path + '?');
        return `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
            active ? 'bg-grabit-primary text-white' : 'text-grabit-gray hover:bg-grabit-bg-light'
        }`;
    };

    return (
        <aside className="lg:col-span-1">
            <div className="bg-white border border-grabit-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-grabit-border">
                    <div className="w-12 h-12 bg-grabit-primary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-medium text-grabit-dark">{user.name}</h3>
                        <p className="text-sm text-grabit-gray">{user.email}</p>
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
                    <Link href="/customer/addresses" className={navLinkClass('/customer/addresses')}>
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
    );
}
