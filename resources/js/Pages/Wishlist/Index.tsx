import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { useState } from 'react';
import { PageProps } from '@/types';
import { useCartWishlist } from '@/Contexts/CartWishlistContext';
import { toast } from 'sonner';
import { FiShoppingCart, FiTrash2, FiHeart } from 'react-icons/fi';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price?: number;
    old_price?: number;
    image?: string;
    in_stock: boolean;
    stock: number;
}

interface WishlistItem {
    id: number;
    product: Product;
}

interface WishlistIndexProps extends PageProps {
    wishlistItems: WishlistItem[];
    cartCount?: number;
    wishlistCount?: number;
}

// Inner component that uses the context
function WishlistContent({
    initialItems,
}: {
    initialItems: WishlistItem[];
}) {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(initialItems || []);
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
    const [movingToCart, setMovingToCart] = useState<Set<number>>(new Set());

    const { addToCart, removeFromWishlist } = useCartWishlist();

    const formatPrice = (priceInCents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(priceInCents / 100);
    };

    const handleRemoveFromWishlist = async (item: WishlistItem) => {
        setRemovingItems(prev => new Set(prev).add(item.id));
        try {
            await removeFromWishlist(item.product.id);
            setWishlistItems(prev => prev.filter(i => i.id !== item.id));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove from wishlist');
        } finally {
            setRemovingItems(prev => {
                const next = new Set(prev);
                next.delete(item.id);
                return next;
            });
        }
    };

    const handleMoveToCart = async (item: WishlistItem) => {
        if (!item.product.in_stock) {
            toast.error('Product is out of stock');
            return;
        }

        setMovingToCart(prev => new Set(prev).add(item.id));
        try {
            await addToCart(item.product.id, 1);
            await removeFromWishlist(item.product.id);
            setWishlistItems(prev => prev.filter(i => i.id !== item.id));
            toast.success('Moved to cart!');
        } catch (error) {
            toast.error('Failed to move to cart');
        } finally {
            setMovingToCart(prev => {
                const next = new Set(prev);
                next.delete(item.id);
                return next;
            });
        }
    };

    return (
        <>
            <Head title="My Wishlist" />

            {/* Breadcrumb */}
            <div className="bg-grabit-bg-light py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-grabit-gray">
                        <Link href="/" className="hover:text-grabit-primary">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-grabit-dark">Wishlist</span>
                    </div>
                </div>
            </div>

            {/* Wishlist Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-heading font-bold text-grabit-dark">
                        My Wishlist ({wishlistItems.length} items)
                    </h1>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="bg-white border border-grabit-border rounded-lg overflow-hidden">
                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-grabit-bg-light">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-grabit-dark">Product</th>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-grabit-dark">Price</th>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-grabit-dark">Stock Status</th>
                                        <th className="py-4 px-6 text-right text-sm font-medium text-grabit-dark">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-grabit-border">
                                    {wishlistItems.map((item) => {
                                        const currentPrice = item.product.sale_price || item.product.price;
                                        const isRemoving = removingItems.has(item.id);
                                        const isMoving = movingToCart.has(item.id);

                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <Link href={`/product/${item.product.slug}`}>
                                                            <img
                                                                src={item.product.image || '/images/placeholder-product.svg'}
                                                                alt={item.product.name}
                                                                className="w-20 h-20 object-cover rounded-md border border-grabit-border"
                                                            />
                                                        </Link>
                                                        <div>
                                                            <Link
                                                                href={`/product/${item.product.slug}`}
                                                                className="font-medium text-grabit-dark hover:text-grabit-primary line-clamp-2"
                                                            >
                                                                {item.product.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-grabit-dark">
                                                            {formatPrice(currentPrice)}
                                                        </span>
                                                        {item.product.sale_price && item.product.old_price && (
                                                            <span className="text-sm text-grabit-gray line-through">
                                                                {formatPrice(item.product.old_price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                            item.product.in_stock
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {item.product.in_stock ? `In Stock (${item.product.stock})` : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleMoveToCart(item)}
                                                            disabled={!item.product.in_stock || isMoving || isRemoving}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                                                                item.product.in_stock && !isMoving && !isRemoving
                                                                    ? 'bg-grabit-primary hover:bg-grabit-primary-dark text-white'
                                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            <FiShoppingCart className="w-4 h-4" />
                                                            {isMoving ? 'Moving...' : 'Add to Cart'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveFromWishlist(item)}
                                                            disabled={isRemoving || isMoving}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Remove from wishlist"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-grabit-border">
                            {wishlistItems.map((item) => {
                                const currentPrice = item.product.sale_price || item.product.price;
                                const isRemoving = removingItems.has(item.id);
                                const isMoving = movingToCart.has(item.id);

                                return (
                                    <div key={item.id} className="p-4">
                                        <div className="flex gap-4 mb-4">
                                            <Link href={`/product/${item.product.slug}`}>
                                                <img
                                                    src={item.product.image || '/images/placeholder-product.svg'}
                                                    alt={item.product.name}
                                                    className="w-24 h-24 object-cover rounded-md border border-grabit-border"
                                                />
                                            </Link>
                                            <div className="flex-1">
                                                <Link
                                                    href={`/product/${item.product.slug}`}
                                                    className="font-medium text-grabit-dark hover:text-grabit-primary line-clamp-2 mb-2"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <div className="mb-2">
                                                    <span className="font-medium text-grabit-dark">
                                                        {formatPrice(currentPrice)}
                                                    </span>
                                                    {item.product.sale_price && item.product.old_price && (
                                                        <span className="text-sm text-grabit-gray line-through ml-2">
                                                            {formatPrice(item.product.old_price)}
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        item.product.in_stock
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {item.product.in_stock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleMoveToCart(item)}
                                                disabled={!item.product.in_stock || isMoving || isRemoving}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                                                    item.product.in_stock && !isMoving && !isRemoving
                                                        ? 'bg-grabit-primary hover:bg-grabit-primary-dark text-white'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                <FiShoppingCart className="w-4 h-4" />
                                                {isMoving ? 'Moving...' : 'Add to Cart'}
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFromWishlist(item)}
                                                disabled={isRemoving || isMoving}
                                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-grabit-border rounded-lg p-12 text-center">
                        <FiHeart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-medium text-grabit-dark mb-2">Your Wishlist is Empty</h2>
                        <p className="text-grabit-gray mb-6">
                            Start adding products to your wishlist by clicking the heart icon on products you love.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-6 py-3 bg-grabit-primary hover:bg-grabit-primary-dark text-white rounded-md font-medium transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

// Main export component that wraps with FrontendLayout
export default function WishlistIndex({
    auth,
    wishlistItems: initialItems,
    cartCount = 0,
    wishlistCount = 0
}: WishlistIndexProps) {
    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <WishlistContent initialItems={initialItems} />
        </FrontendLayout>
    );
}
