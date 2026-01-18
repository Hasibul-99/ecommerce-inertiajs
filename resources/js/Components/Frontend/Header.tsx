import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { FiHeart, FiShoppingBag, FiUser, FiSearch, FiMenu, FiChevronDown } from 'react-icons/fi';
import { useCartWishlist } from '@/Contexts/CartWishlistContext';

interface HeaderProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
}

export default function Header({ auth }: HeaderProps) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Get dynamic cart and wishlist counts from context
    const { cartCount, wishlistCount } = useCartWishlist();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Header Top */}
            <div className="bg-grabit-bg-light py-2 text-grabit-gray text-sm">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        {/* Left side - Contact info */}
                        <div className="hidden md:flex items-center space-x-4">
                            <a href="tel:+919876543210" className="flex items-center hover:text-grabit-primary">
                                <span className="mr-1">📞</span> +91 987 654 3210
                            </a>
                        </div>

                        {/* Center - Message */}
                        <div className="hidden lg:block text-center">
                            <span>World's Fastest Online Shopping Destination</span>
                        </div>

                        {/* Right side - Help, Track, Language */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/help" className="hover:text-grabit-primary">Help?</Link>
                            <Link href="/track-order" className="hover:text-grabit-primary">Track Order</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Middle */}
            <div className="py-6 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <img
                                src="/images/logo/logo.png"
                                alt="Ecommerce Logo"
                                className="h-10 w-auto md:h-12"
                            />
                        </Link>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl mx-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search Products..."
                                    className="w-full h-12 px-4 pr-12 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary focus:border-transparent text-sm"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-12 px-4 text-grabit-dark hover:text-grabit-primary transition-colors"
                                >
                                    <FiSearch className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-6">
                            {/* User Account */}
                            <div className="hidden lg:block relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 text-grabit-dark hover:text-grabit-primary transition-colors"
                                >
                                    <FiUser className="w-6 h-6" />
                                    <div className="text-left">
                                        <div className="text-xs text-grabit-gray">Account</div>
                                        <div className="text-sm font-medium">
                                            {auth?.user ? auth.user.name.split(' ')[0] : 'Login'}
                                        </div>
                                    </div>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-grabit-border rounded-md shadow-lg py-1 z-50">
                                        {auth?.user ? (
                                            <>
                                                <Link
                                                    href="/dashboard"
                                                    className="block px-4 py-2 text-sm text-grabit-gray hover:bg-gray-50 hover:text-grabit-primary"
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    className="block px-4 py-2 text-sm text-grabit-gray hover:bg-gray-50 hover:text-grabit-primary"
                                                >
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="block w-full text-left px-4 py-2 text-sm text-grabit-gray hover:bg-gray-50 hover:text-grabit-primary"
                                                >
                                                    Logout
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/login"
                                                    className="block px-4 py-2 text-sm text-grabit-gray hover:bg-gray-50 hover:text-grabit-primary"
                                                >
                                                    Login
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Wishlist */}
                            <Link
                                href="/wishlist"
                                className="hidden lg:flex items-center space-x-2 text-grabit-dark hover:text-grabit-primary transition-colors relative"
                            >
                                <div className="relative">
                                    <FiHeart className="w-6 h-6" />
                                    {console.log("Wishlist count:", wishlistCount)
                                    }
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-grabit-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                            {wishlistCount > 99 ? '99+' : wishlistCount}
                                        </span>
                                    )}
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-grabit-gray">Wishlist</div>
                                    <div className="text-sm font-medium">{wishlistCount} items</div>
                                </div>
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="flex items-center space-x-2 text-grabit-dark hover:text-grabit-primary transition-colors relative"
                            >
                                <div className="relative">
                                    <FiShoppingBag className="w-6 h-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-grabit-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <div className="text-xs text-grabit-gray">Cart</div>
                                    <div className="text-sm font-medium">{cartCount} items</div>
                                </div>
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="lg:hidden text-grabit-dark"
                            >
                                <FiMenu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="hidden lg:block bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-8 py-3">
                        {/* Categories Dropdown */}
                        <div className="relative group">
                            <button className="bg-grabit-primary text-white px-6 py-3 rounded-md flex items-center space-x-2 hover:bg-grabit-primary-dark transition-colors">
                                <span className="text-sm font-medium">All Categories</span>
                                <FiChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Main Navigation */}
                        <nav className="flex items-center space-x-6">
                            <Link
                                href="/"
                                className="text-sm font-medium text-grabit-dark hover:text-grabit-primary transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                className="text-sm font-medium text-grabit-dark hover:text-grabit-primary transition-colors"
                            >
                                Shop
                            </Link>
                            <Link
                                href="/categories"
                                className="text-sm font-medium text-grabit-dark hover:text-grabit-primary transition-colors"
                            >
                                Categories
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-medium text-grabit-dark hover:text-grabit-primary transition-colors"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm font-medium text-grabit-dark hover:text-grabit-primary transition-colors"
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="lg:hidden bg-white border-b">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-3">
                            <Link href="/" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary">
                                Home
                            </Link>
                            <Link href="/products" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary">
                                Shop
                            </Link>
                            <Link href="/categories" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary">
                                Categories
                            </Link>
                            <Link href="/wishlist" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary">
                                Wishlist ({wishlistCount})
                            </Link>
                            <Link href="/about" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary">
                                About Us
                            </Link>
                            <Link href="/contact" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary">
                                Contact
                            </Link>
                            {auth?.user ? (
                                <>
                                    <Link href="/dashboard" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary">
                                        Dashboard
                                    </Link>
                                    <Link href="/logout" method="post" as="button" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary text-left">
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary">
                                        Login
                                    </Link>
                                    <Link href="/register" className="text-sm font-medium text-grabit-dark hover:text-grabit-primary">
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
