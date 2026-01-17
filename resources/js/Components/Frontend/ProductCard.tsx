import { Link } from '@inertiajs/react';
import { FiHeart, FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    old_price?: number;
    image?: string;
    images?: Array<{ url: string }>;
    rating?: number;
    reviews_count?: number;
    is_new?: boolean;
    is_sale?: boolean;
    discount_percentage?: number;
    in_stock?: boolean;
}

interface ProductCardProps {
    product: Product;
    onAddToCart?: (productId: number) => void;
    onAddToWishlist?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    const productImage = product.image || product.images?.[0]?.url || '/images/placeholder-product.svg';
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(product.price / 100);

    const formattedOldPrice = product.old_price
        ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
          }).format(product.old_price / 100)
        : null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product.id);
        }
    };

    const handleAddToWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToWishlist) {
            onAddToWishlist(product.id);
        }
    };

    const renderRating = () => {
        const rating = product.rating || 0;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FiStar
                    key={i}
                    className={`w-3 h-3 ${
                        i <= rating ? 'fill-grabit-star text-grabit-star' : 'text-gray-300'
                    }`}
                />
            );
        }
        return stars;
    };

    return (
        <div
            className="group relative bg-white border border-grabit-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                {product.is_new && (
                    <span className="bg-grabit-primary text-white text-xs px-2 py-1 rounded">
                        New
                    </span>
                )}
                {product.is_sale && product.discount_percentage && (
                    <span className="bg-grabit-sale text-white text-xs px-2 py-1 rounded">
                        -{product.discount_percentage}%
                    </span>
                )}
                {!product.in_stock && (
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* Quick Actions */}
            <div
                className={`absolute top-2 right-2 z-10 flex flex-col gap-2 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
            >
                <button
                    onClick={handleAddToWishlist}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-grabit-primary hover:text-white transition-colors shadow-md"
                    title="Add to Wishlist"
                >
                    <FiHeart className="w-4 h-4" />
                </button>
                <Link
                    href={`/product/${product.slug}`}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-grabit-primary hover:text-white transition-colors shadow-md"
                    title="Quick View"
                >
                    <FiEye className="w-4 h-4" />
                </Link>
            </div>

            {/* Product Image */}
            <Link href={`/product/${product.slug}`} className="block relative overflow-hidden bg-gray-50">
                <div className="aspect-square">
                    <img
                        src={imageError ? '/images/placeholder-product.svg' : productImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={() => setImageError(true)}
                    />
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                {/* Product Name */}
                <Link href={`/product/${product.slug}`}>
                    <h3 className="text-sm font-medium text-grabit-dark line-clamp-2 hover:text-grabit-primary transition-colors h-10">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                {product.rating ? (
                    <div className="flex items-center gap-1 mt-2">
                        <div className="flex gap-0.5">{renderRating()}</div>
                        {product.reviews_count && (
                            <span className="text-xs text-grabit-gray ml-1">
                                ({product.reviews_count})
                            </span>
                        )}
                    </div>
                ) : null}

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-grabit-primary">
                        {formattedPrice}
                    </span>
                    {formattedOldPrice && (
                        <span className="text-sm text-grabit-gray line-through">
                            {formattedOldPrice}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!product.in_stock}
                    className={`w-full mt-3 py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                        product.in_stock
                            ? 'bg-grabit-primary hover:bg-grabit-primary-dark text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } ${isHovered && product.in_stock ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
                >
                    <FiShoppingCart className="w-4 h-4" />
                    <span>{product.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
            </div>
        </div>
    );
}
