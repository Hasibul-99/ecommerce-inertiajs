import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import RichTextDisplay from '@/Components/Core/RichTextDisplay';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiStar, FiCheck } from 'react-icons/fi';
import { PageProps } from '@/types';

interface ProductImage {
    id: number;
    url: string;
}

interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    attributes: { name: string; value: string }[];
}

interface ProductAttribute {
    name: string;
    values: string[];
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    compare_price?: number;
    stock: number;
    sku: string;
    images: ProductImage[];
    variants?: ProductVariant[];
    attributes?: ProductAttribute[];
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    vendor?: {
        id: number;
        name: string;
    };
    tags?: Array<{ id: number; name: string }>;
}

interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    old_price?: number;
    image?: string;
    in_stock?: boolean;
}

interface ProductShowProps extends PageProps {
    product: Product;
    relatedProducts: RelatedProduct[];
    cartCount?: number;
    wishlistCount?: number;
}

export default function ProductShow({
    auth,
    product,
    relatedProducts = [],
    cartCount = 0,
    wishlistCount = 0
}: ProductShowProps) {
    const [selectedImage, setSelectedImage] = useState(product.images[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [activeTab, setActiveTab] = useState('description');

    const formatPrice = (priceInCents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(priceInCents / 100);
    };

    const currentPrice = selectedVariant?.price || product.price;
    const currentStock = selectedVariant?.stock || product.stock;
    const discountPercentage =
        product.compare_price && product.compare_price > currentPrice
            ? Math.round(((product.compare_price - currentPrice) / product.compare_price) * 100)
            : 0;

    const handleQuantityChange = (action: 'increment' | 'decrement') => {
        if (action === 'increment' && quantity < currentStock) {
            setQuantity(quantity + 1);
        } else if (action === 'decrement' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        router.post('/cart', {
            product_id: product.id,
            variant_id: selectedVariant?.id,
            quantity: quantity,
        });
    };

    const handleAddToWishlist = () => {
        router.post('/wishlist', {
            product_id: product.id,
        });
    };

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title={`${product.name} - Product Details`} />

            {/* Breadcrumb */}
            <div className="bg-grabit-bg-light py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-grabit-gray">
                        <Link href="/" className="hover:text-grabit-primary">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/products" className="hover:text-grabit-primary">Products</Link>
                        {product.category && (
                            <>
                                <span className="mx-2">/</span>
                                <Link
                                    href={`/products?category=${product.category.slug}`}
                                    className="hover:text-grabit-primary"
                                >
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <span className="mx-2">/</span>
                        <span className="text-grabit-dark">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-white border border-grabit-border rounded-lg overflow-hidden">
                            <img
                                src={selectedImage?.url || '/images/placeholder-product.png'}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(image)}
                                        className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                                            selectedImage?.id === image.id
                                                ? 'border-grabit-primary'
                                                : 'border-grabit-border hover:border-grabit-primary'
                                        }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Product Title */}
                        <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-4">
                            {product.name}
                        </h1>

                        {/* Vendor & SKU */}
                        <div className="flex items-center gap-4 text-sm text-grabit-gray mb-4">
                            {product.vendor && (
                                <span>By <span className="text-grabit-primary">{product.vendor.name}</span></span>
                            )}
                            <span>SKU: {product.sku}</span>
                            <span className={currentStock > 0 ? 'text-green-600' : 'text-red-600'}>
                                {currentStock > 0 ? `In Stock (${currentStock})` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < 4 ? 'fill-grabit-star text-grabit-star' : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-grabit-gray">(0 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-bold text-grabit-primary">
                                {formatPrice(currentPrice)}
                            </span>
                            {product.compare_price && product.compare_price > currentPrice && (
                                <>
                                    <span className="text-2xl text-grabit-gray line-through">
                                        {formatPrice(product.compare_price)}
                                    </span>
                                    <span className="bg-grabit-sale text-white px-3 py-1 rounded-full text-sm font-medium">
                                        -{discountPercentage}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="text-grabit-gray mb-6 leading-relaxed line-clamp-3">
                            <RichTextDisplay
                                content={product.description || ''}
                                className="text-sm"
                            />
                        </div>

                        {/* Variants (if any) */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-medium text-grabit-dark mb-3">Select Variant:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-4 py-2 border rounded-md transition-colors ${
                                                selectedVariant?.id === variant.id
                                                    ? 'border-grabit-primary bg-grabit-primary text-white'
                                                    : 'border-grabit-border hover:border-grabit-primary'
                                            }`}
                                        >
                                            {variant.attributes.map(attr => attr.value).join(' / ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <h3 className="font-medium text-grabit-dark mb-3">Quantity:</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-grabit-border rounded-md">
                                    <button
                                        onClick={() => handleQuantityChange('decrement')}
                                        className="p-3 hover:bg-gray-50 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <FiMinus className="w-4 h-4" />
                                    </button>
                                    <span className="px-6 py-2 font-medium">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('increment')}
                                        className="p-3 hover:bg-gray-50 transition-colors"
                                        disabled={quantity >= currentStock}
                                    >
                                        <FiPlus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-sm text-grabit-gray">
                                    {currentStock} items available
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={handleAddToCart}
                                disabled={currentStock === 0}
                                className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                                    currentStock > 0
                                        ? 'bg-grabit-primary hover:bg-grabit-primary-dark text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <FiShoppingCart className="w-5 h-5" />
                                {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                className="p-3 border border-grabit-border rounded-md hover:border-grabit-primary hover:text-grabit-primary transition-colors"
                                title="Add to Wishlist"
                            >
                                <FiHeart className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="border-t border-grabit-border pt-6">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium text-grabit-dark">Tags:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map((tag) => (
                                            <Link
                                                key={tag.id}
                                                href={`/products?tags[]=${tag.name}`}
                                                className="bg-grabit-bg-light text-grabit-gray px-3 py-1 rounded-md text-sm hover:bg-grabit-primary hover:text-white transition-colors"
                                            >
                                                {tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="bg-white border border-grabit-border rounded-lg p-6 mb-12">
                    {/* Tab Headers */}
                    <div className="flex border-b border-grabit-border mb-6">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                                activeTab === 'description'
                                    ? 'border-grabit-primary text-grabit-primary'
                                    : 'border-transparent text-grabit-gray hover:text-grabit-primary'
                            }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('specifications')}
                            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                                activeTab === 'specifications'
                                    ? 'border-grabit-primary text-grabit-primary'
                                    : 'border-transparent text-grabit-gray hover:text-grabit-primary'
                            }`}
                        >
                            Specifications
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                                activeTab === 'reviews'
                                    ? 'border-grabit-primary text-grabit-primary'
                                    : 'border-transparent text-grabit-gray hover:text-grabit-primary'
                            }`}
                        >
                            Reviews (0)
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="text-grabit-gray leading-relaxed">
                        {activeTab === 'description' && (
                            <RichTextDisplay
                                content={product.description || '<p>No description available.</p>'}
                                className="text-grabit-dark"
                            />
                        )}
                        {activeTab === 'specifications' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-between py-2 border-b border-grabit-border">
                                    <span className="font-medium text-grabit-dark">SKU:</span>
                                    <span>{product.sku}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-grabit-border">
                                    <span className="font-medium text-grabit-dark">Category:</span>
                                    <span>{product.category?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-grabit-border">
                                    <span className="font-medium text-grabit-dark">Stock:</span>
                                    <span>{currentStock} units</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-grabit-border">
                                    <span className="font-medium text-grabit-dark">Vendor:</span>
                                    <span>{product.vendor?.name || 'N/A'}</span>
                                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-center py-8">
                                <p className="text-grabit-gray mb-4">No reviews yet.</p>
                                <p className="text-sm text-grabit-gray">Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-grabit-dark mb-6">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </FrontendLayout>
    );
}
