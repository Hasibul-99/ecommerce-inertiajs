import { useState, useEffect, PropsWithChildren, ReactNode } from 'react';
import ApplicationLogo from '@/Components/App/ApplicationLogo';
import NotificationBell from '@/Components/NotificationBell';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
import {
    FiHome,
    FiShoppingCart,
    FiHeart,
    FiUser,
    FiPackage,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX,
    FiSearch,
    FiSun,
    FiMoon,
    FiChevronDown,
    FiShoppingBag,
    FiMapPin,
} from 'react-icons/fi';

interface AuthenticatedLayoutProps {
    user: User;
    header?: ReactNode;
}

export default function AuthenticatedLayout({ user, header, children }: PropsWithChildren<AuthenticatedLayoutProps>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { url } = usePage();

    // Initialize dark mode from localStorage
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const isActiveRoute = (routeName: string) => {
        return url.startsWith(route(routeName));
    };

    const navigationLinks = [
        { name: 'Dashboard', href: 'dashboard', icon: FiHome },
        { name: 'Orders', href: 'orders.index', icon: FiShoppingCart },
        { name: 'Wishlist', href: 'wishlist', icon: FiHeart },
        { name: 'My Products', href: 'products.index', icon: FiPackage },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            {/* Modern Navigation Bar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
                    : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left Section - Logo & Navigation */}
                        <div className="flex items-center space-x-8">
                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-3 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                                        <ApplicationLogo className="block h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    GrabIt
                                </span>
                            </Link>

                            {/* Desktop Navigation Links */}
                            <div className="hidden lg:flex items-center space-x-1">
                                {navigationLinks.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActiveRoute(link.href);
                                    return (
                                        <Link
                                            key={link.name}
                                            href={route(link.href)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                active
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{link.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Section - Search, Actions & User Menu */}
                        <div className="flex items-center space-x-3">
                            {/* Search Bar */}
                            <div className="hidden md:block">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                            </button>

                            {/* Shopping Cart */}
                            <Link
                                href={route('cart')}
                                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <FiShoppingBag className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs flex items-center justify-center rounded-full">
                                    0
                                </span>
                            </Link>

                            {/* Notifications */}
                            <div className="hidden sm:block">
                                <NotificationBell />
                            </div>

                            {/* User Menu */}
                            <div className="relative hidden sm:block">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <FiUser className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                                    </div>
                                    <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FiUser className="w-4 h-4" />
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    href={route('orders.index')}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FiPackage className="w-4 h-4" />
                                                    <span>My Orders</span>
                                                </Link>
                                                <Link
                                                    href={route('customer.addresses')}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FiMapPin className="w-4 h-4" />
                                                    <span>Addresses</span>
                                                </Link>
                                                <Link
                                                    href={route('wishlist')}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FiHeart className="w-4 h-4" />
                                                    <span>Wishlist</span>
                                                </Link>
                                                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                                                <Link
                                                    href={route('notifications.index')}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FiSettings className="w-4 h-4" />
                                                    <span>Notifications</span>
                                                </Link>
                                                <Link
                                                    href={route('notifications.preferences')}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FiSettings className="w-4 h-4" />
                                                    <span>Notification Settings</span>
                                                </Link>
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FiSettings className="w-4 h-4" />
                                                    <span>Settings</span>
                                                </Link>
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <FiLogOut className="w-4 h-4" />
                                                    <span>Sign Out</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="sm:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                {showingNavigationDropdown ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`sm:hidden ${showingNavigationDropdown ? 'block' : 'hidden'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        {navigationLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActiveRoute(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={route(link.href)}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                        active
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile User Section */}
                    <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="px-4 flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <FiUser className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1 px-2">
                            <Link
                                href={route('profile.edit')}
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <FiSettings className="w-4 h-4" />
                                <span>Settings</span>
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <FiLogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header Section */}
            {header && (
                <header className="mt-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className={header ? 'pt-6' : 'pt-20'}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                                    <ApplicationLogo className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">GrabIt</span>
                            </div>
                            <p className="text-gray-400 text-sm">Your one-stop shop for quality products at amazing prices.</p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link href={route('home')} className="text-gray-400 hover:text-white text-sm transition-colors">Home</Link></li>
                                <li><Link href={route('products.index')} className="text-gray-400 hover:text-white text-sm transition-colors">Shop</Link></li>
                                <li><Link href={route('about')} className="text-gray-400 hover:text-white text-sm transition-colors">About Us</Link></li>
                                <li><Link href={route('contact')} className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
                            <ul className="space-y-2">
                                <li><Link href={route('orders.index')} className="text-gray-400 hover:text-white text-sm transition-colors">Track Order</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Returns</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Shipping Info</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">FAQs</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">My Account</h3>
                            <ul className="space-y-2">
                                <li><Link href={route('dashboard')} className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link></li>
                                <li><Link href={route('orders.index')} className="text-gray-400 hover:text-white text-sm transition-colors">My Orders</Link></li>
                                <li><Link href={route('wishlist')} className="text-gray-400 hover:text-white text-sm transition-colors">Wishlist</Link></li>
                                <li><Link href={route('profile.edit')} className="text-gray-400 hover:text-white text-sm transition-colors">Account Settings</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-gray-400 text-sm">&copy; 2026 GrabIt. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
