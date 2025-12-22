import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { PageProps } from '@/types';

interface CartItem {
    id: number;
    product_id: number;
    product_variant_id?: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        slug: string;
        image?: string;
        stock: number;
    };
    variant?: {
        id: number;
        sku: string;
        attributes: Array<{ name: string; value: string }>;
    };
}

interface Cart {
    id: number;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
}

interface CartPageProps extends PageProps {
    cart: Cart;
    cartCount?: number;
    wishlistCount?: number;
}

export default function CartIndex({
    auth,
    cart,
    cartCount = 0,
    wishlistCount = 0
}: CartPageProps) {
    const [processing, setProcessing] = useState(false);

    const formatPrice = (priceInCents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(priceInCents / 100);
    };

    const updateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        setProcessing(true);
        router.put(
            `/cart/${itemId}`,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    const removeItem = (itemId: number) => {
        if (!confirm('Are you sure you want to remove this item from your cart?')) return;

        setProcessing(true);
        router.delete(`/cart/${itemId}`, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const clearCart = () => {
        if (!confirm('Are you sure you want to clear your entire cart?')) return;

        setProcessing(true);
        router.delete('/cart/clear', {
            onFinish: () => setProcessing(false),
        });
    };

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <FrontendLayout auth={auth} cartCount={0} wishlistCount={wishlistCount}>
                <Head title="Shopping Cart" />

                {/* Breadcrumb */}
                <div className="bg-grabit-bg-light py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center text-sm text-grabit-gray">
                            <Link href="/" className="hover:text-grabit-primary">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-grabit-dark">Shopping Cart</span>
                        </div>
                    </div>
                </div>

                {/* Empty Cart */}
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto text-center">
                        <div className="text-8xl mb-6">🛒</div>
                        <h2 className="text-2xl font-heading font-bold text-grabit-dark mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-grabit-gray mb-8">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-grabit-primary hover:bg-grabit-primary-dark text-white px-8 py-3 rounded-md font-medium transition-colors"
                        >
                            <FiShoppingBag className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Shopping Cart" />

            {/* Breadcrumb */}
            <div className="bg-grabit-bg-light py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-grabit-gray">
                        <Link href="/" className="hover:text-grabit-primary">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-grabit-dark">Shopping Cart</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-heading font-bold text-grabit-dark">
                        Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
                    </h1>
                    <button
                        onClick={clearCart}
                        disabled={processing}
                        className="text-grabit-sale hover:text-red-700 text-sm font-medium transition-colors"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-grabit-border rounded-lg p-6 flex flex-col sm:flex-row gap-6"
                            >
                                {/* Product Image */}
                                <Link
                                    href={`/product/${item.product.slug}`}
                                    className="flex-shrink-0 w-full sm:w-32 h-32"
                                >
                                    <img
                                        src={item.product.image || '/images/placeholder-product.png'}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </Link>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <Link
                                        href={`/product/${item.product.slug}`}
                                        className="font-heading font-semibold text-lg text-grabit-dark hover:text-grabit-primary transition-colors block mb-2"
                                    >
                                        {item.product.name}
                                    </Link>

                                    {/* Variant Info */}
                                    {item.variant && item.variant.attributes && (
                                        <div className="text-sm text-grabit-gray mb-3">
                                            {item.variant.attributes.map((attr, index) => (
                                                <span key={index}>
                                                    {attr.name}: <span className="font-medium">{attr.value}</span>
                                                    {index < item.variant!.attributes.length - 1 && ' • '}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="text-xl font-bold text-grabit-primary mb-4">
                                        {formatPrice(item.price)}
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-grabit-border rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={processing || item.quantity <= 1}
                                                className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FiMinus className="w-4 h-4" />
                                            </button>
                                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={processing || item.quantity >= item.product.stock}
                                                className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            disabled={processing}
                                            className="text-grabit-sale hover:text-red-700 transition-colors disabled:opacity-50"
                                            title="Remove item"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Stock Warning */}
                                    {item.quantity >= item.product.stock && (
                                        <p className="text-sm text-grabit-sale mt-2">
                                            Maximum stock reached ({item.product.stock} available)
                                        </p>
                                    )}
                                </div>

                                {/* Item Total */}
                                <div className="text-right">
                                    <div className="text-sm text-grabit-gray mb-1">Total:</div>
                                    <div className="text-xl font-bold text-grabit-dark">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-grabit-border rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-grabit-gray">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-grabit-gray">
                                    <span>Tax (10%):</span>
                                    <span className="font-medium">{formatPrice(cart.tax)}</span>
                                </div>
                                <div className="flex justify-between text-grabit-gray">
                                    <span>Shipping:</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="border-t border-grabit-border pt-4">
                                    <div className="flex justify-between text-lg">
                                        <span className="font-heading font-semibold text-grabit-dark">Total:</span>
                                        <span className="font-bold text-grabit-primary text-2xl">
                                            {formatPrice(cart.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-grabit-primary hover:bg-grabit-primary-dark text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center gap-2 mb-4"
                            >
                                Proceed to Checkout
                                <FiArrowRight className="w-5 h-5" />
                            </Link>

                            <Link
                                href="/products"
                                className="w-full border border-grabit-border text-grabit-dark hover:border-grabit-primary hover:text-grabit-primary py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                Continue Shopping
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-grabit-border space-y-3">
                                <div className="flex items-center gap-3 text-sm text-grabit-gray">
                                    <span className="text-green-600 text-xl">✓</span>
                                    <span>Secure checkout</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-grabit-gray">
                                    <span className="text-green-600 text-xl">✓</span>
                                    <span>Free shipping on orders over $50</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-grabit-gray">
                                    <span className="text-green-600 text-xl">✓</span>
                                    <span>30-day return policy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
