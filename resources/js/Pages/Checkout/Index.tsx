import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import { PageProps } from '@/types';

interface CartItem {
    id: number;
    product: {
        name: string;
        image?: string;
    };
    quantity: number;
    price_cents: number;
}

interface Cart {
    items: CartItem[];
    subtotal_cents: number;
    tax_cents: number;
    total_cents: number;
}

interface Address {
    id: number;
    name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
}

interface CheckoutPageProps extends PageProps {
    cart: Cart;
    addresses: Address[];
    paymentMethods: Array<{ value: string; label: string }>;
    reservation_id: string;
    cartCount?: number;
    wishlistCount?: number;
}

export default function CheckoutIndex({
    auth,
    cart,
    addresses = [],
    paymentMethods = [],
    reservation_id,
    cartCount = 0,
    wishlistCount = 0
}: CheckoutPageProps) {
    const [useExistingAddress, setUseExistingAddress] = useState(addresses.length > 0);
    const [sameBillingAddress, setSameBillingAddress] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        reservation_id: reservation_id,
        // Shipping Address
        address_id: addresses.length > 0 ? addresses[0].id : null,
        shipping_name: '',
        shipping_address_line1: '',
        shipping_address_line2: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
        shipping_country: 'US',
        shipping_phone: '',
        // Billing
        same_billing_address: true,
        // Payment
        payment_method: paymentMethods.length > 0 ? paymentMethods[0].value : 'credit_card',
        // Additional
        notes: '',
    });

    const formatPrice = (priceInCents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(priceInCents / 100);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout/process');
    };

    const handleAddressChange = (addressId: number) => {
        const selected = addresses.find(addr => addr.id === addressId);
        if (selected) {
            setData({
                ...data,
                address_id: addressId,
                shipping_name: selected.name,
                shipping_address_line1: selected.address_line1,
                shipping_address_line2: selected.address_line2 || '',
                shipping_city: selected.city,
                shipping_state: selected.state,
                shipping_postal_code: selected.postal_code,
                shipping_country: selected.country,
                shipping_phone: selected.phone,
            });
        }
    };

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Checkout" />

            {/* Breadcrumb */}
            <div className="bg-grabit-bg-light py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-grabit-gray">
                        <Link href="/" className="hover:text-grabit-primary">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/cart" className="hover:text-grabit-primary">Cart</Link>
                        <span className="mx-2">/</span>
                        <span className="text-grabit-dark">Checkout</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-4">
                                    Shipping Address
                                </h2>

                                {addresses.length > 0 && (
                                    <div className="mb-4">
                                        <label className="flex items-center gap-2 cursor-pointer mb-3">
                                            <input
                                                type="checkbox"
                                                checked={useExistingAddress}
                                                onChange={(e) => setUseExistingAddress(e.target.checked)}
                                                className="w-4 h-4 text-grabit-primary border-grabit-border rounded focus:ring-grabit-primary"
                                            />
                                            <span className="text-sm text-grabit-gray">Use saved address</span>
                                        </label>

                                        {useExistingAddress && (
                                            <select
                                                value={data.address_id || ''}
                                                onChange={(e) => handleAddressChange(Number(e.target.value))}
                                                className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                            >
                                                {addresses.map((address) => (
                                                    <option key={address.id} value={address.id}>
                                                        {address.name} - {address.address_line1}, {address.city}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                )}

                                {!useExistingAddress && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-grabit-dark mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.shipping_name}
                                                onChange={(e) => setData('shipping_name', e.target.value)}
                                                required={!useExistingAddress}
                                                className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                            />
                                            {errors.shipping_name && (
                                                <p className="text-sm text-red-600 mt-1">{errors.shipping_name}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-grabit-dark mb-2">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.shipping_address_line1}
                                                onChange={(e) => setData('shipping_address_line1', e.target.value)}
                                                required={!useExistingAddress}
                                                className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                            />
                                            {errors.shipping_address_line1 && (
                                                <p className="text-sm text-red-600 mt-1">{errors.shipping_address_line1}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-grabit-dark mb-2">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                value={data.shipping_address_line2}
                                                onChange={(e) => setData('shipping_address_line2', e.target.value)}
                                                className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-grabit-dark mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.shipping_city}
                                                onChange={(e) => setData('shipping_city', e.target.value)}
                                                required={!useExistingAddress}
                                                className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                            />
                                            {errors.shipping_city && (
                                                <p className="text-sm text-red-600 mt-1">{errors.shipping_city}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-grabit-dark mb-2">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.shipping_state}
                                                onChange={(e) => setData('shipping_state', e.target.value)}
                                                required={!useExistingAddress}
                                                className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                            />
                                            {errors.shipping_state && (
                                                <p className="text-sm text-red-600 mt-1">{errors.shipping_state}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-grabit-dark mb-2">
                                                Postal Code *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.shipping_postal_code}
                                                onChange={(e) => setData('shipping_postal_code', e.target.value)}
                                                required={!useExistingAddress}
                                                className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                            />
                                            {errors.shipping_postal_code && (
                                                <p className="text-sm text-red-600 mt-1">{errors.shipping_postal_code}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-grabit-dark mb-2">
                                                Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.shipping_phone}
                                                onChange={(e) => setData('shipping_phone', e.target.value)}
                                                required={!useExistingAddress}
                                                className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                            />
                                            {errors.shipping_phone && (
                                                <p className="text-sm text-red-600 mt-1">{errors.shipping_phone}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sameBillingAddress}
                                            onChange={(e) => {
                                                setSameBillingAddress(e.target.checked);
                                                setData('same_billing_address', e.target.checked);
                                            }}
                                            className="w-4 h-4 text-grabit-primary border-grabit-border rounded focus:ring-grabit-primary"
                                        />
                                        <span className="text-sm text-grabit-gray">
                                            Billing address same as shipping
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-4">
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.value}
                                            className="flex items-center gap-3 p-4 border border-grabit-border rounded-md cursor-pointer hover:border-grabit-primary transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.value}
                                                checked={data.payment_method === method.value}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="w-4 h-4 text-grabit-primary border-grabit-border focus:ring-grabit-primary"
                                            />
                                            <FiCreditCard className="w-5 h-5 text-grabit-gray" />
                                            <span className="font-medium text-grabit-dark">{method.label}</span>
                                        </label>
                                    ))}
                                </div>

                                {errors.payment_method && (
                                    <p className="text-sm text-red-600 mt-2">{errors.payment_method}</p>
                                )}
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white border border-grabit-border rounded-lg p-6">
                                <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-4">
                                    Order Notes (Optional)
                                </h2>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={4}
                                    placeholder="Any special instructions for your order?"
                                    className="w-full px-4 py-2 border border-grabit-border rounded-md focus:outline-none focus:ring-2 focus:ring-grabit-primary resize-none"
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-grabit-border rounded-lg p-6 sticky top-24">
                                <h2 className="text-xl font-heading font-semibold text-grabit-dark mb-6">
                                    Order Summary
                                </h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <img
                                                src={item.product.image || '/images/placeholder-product.png'}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-grabit-dark line-clamp-2">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-grabit-gray">Qty: {item.quantity}</p>
                                                <p className="text-sm font-medium text-grabit-primary">
                                                    {formatPrice(item.price_cents * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 pt-4 border-t border-grabit-border">
                                    <div className="flex justify-between text-grabit-gray">
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(cart.subtotal_cents)}</span>
                                    </div>
                                    <div className="flex justify-between text-grabit-gray">
                                        <span>Tax:</span>
                                        <span>{formatPrice(cart.tax_cents)}</span>
                                    </div>
                                    <div className="flex justify-between text-grabit-gray">
                                        <span>Shipping:</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold pt-3 border-t border-grabit-border">
                                        <span className="text-grabit-dark">Total:</span>
                                        <span className="text-grabit-primary">{formatPrice(cart.total_cents)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-grabit-primary hover:bg-grabit-primary-dark text-white py-3 px-6 rounded-md font-medium transition-colors mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiLock className="w-5 h-5" />
                                    {processing ? 'Processing...' : 'Place Order'}
                                </button>

                                {/* Security Note */}
                                <p className="text-xs text-grabit-gray text-center mt-4">
                                    Your payment information is secure and encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </FrontendLayout>
    );
}
