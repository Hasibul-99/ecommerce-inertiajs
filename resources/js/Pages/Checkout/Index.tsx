import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import InputError from '@/Components/Core/InputError';
import { FiCheck, FiMapPin, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { PageProps } from '@/types';
import { Address } from '@/types/models';

interface CheckoutCartItem {
    id: number;
    product: {
        name: string;
        image?: string | null;
    };
    quantity: number;
    price_cents: number;
}

interface CheckoutCart {
    items: CheckoutCartItem[];
    subtotal_cents: number;
    tax_cents: number;
    total_cents: number;
}

interface CodInfo {
    available: boolean;
    fee_cents: number;
    delivery_estimate: {
        min_days: number;
        max_days: number;
        text: string;
    };
    instructions: string;
    errors?: string[];
}

interface CheckoutPageProps extends PageProps {
    cart: CheckoutCart;
    addresses: Address[];
    codInfo: CodInfo;
    cartCount: number;
    wishlistCount: number;
}

interface FormData {
    payment_method: 'cod';
    shipping_address_id: number | null;
    shipping_name: string;
    shipping_address_line1: string;
    shipping_address_line2: string;
    shipping_city: string;
    shipping_state: string;
    shipping_postal_code: string;
    shipping_country: string;
    shipping_phone: string;
    save_address: boolean;
    same_billing_address: boolean;
}

const formatCents = (cents: number) =>
    '৳' + (cents / 100).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inputClass =
    'bg-transparent border-[1px] border-solid border-[#eee] text-[#4b5966] text-[14px] mb-[26px] px-[15px] w-full outline-0 rounded-[5px] h-[50px] focus:border-[#5caf90] transition-colors duration-200';

const labelClass =
    'mb-[7px] text-[#4b5966] text-[15px] font-medium tracking-[0] leading-[1] inline-block';

export default function CheckoutIndex({
    auth,
    cart,
    addresses,
    codInfo,
    cartCount,
    wishlistCount,
}: CheckoutPageProps) {
    const { props } = usePage<CheckoutPageProps>();
    const flash = (props as any).flash as { error?: string; success?: string } | undefined;

    const [showNewAddressForm, setShowNewAddressForm] = useState(addresses.length === 0);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        payment_method: 'cod',
        shipping_address_id: addresses[0]?.id ?? null,
        shipping_name: '',
        shipping_address_line1: '',
        shipping_address_line2: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
        shipping_country: 'US',
        shipping_phone: '',
        save_address: false,
        same_billing_address: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('checkout.process'));
    };

    const selectSavedAddress = (address: Address) => {
        setData('shipping_address_id', address.id);
        setShowNewAddressForm(false);
    };

    const openNewAddressForm = () => {
        setData('shipping_address_id', null);
        setShowNewAddressForm(true);
    };

    const grandTotal = cart.total_cents + codInfo.fee_cents;

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Checkout" />

            {/* Breadcrumb */}
            <div className="py-[10px] bg-[#f8f8fb] border-b-[1px] border-solid border-[#eee]">
                <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                    <div className="flex flex-wrap w-full px-[12px]">
                        <div className="flex items-center text-[13px] text-[#777]">
                            <Link href="/" className="hover:text-[#5caf90] transition-colors">Home</Link>
                            <span className="mx-[8px]">/</span>
                            <Link href="/cart" className="hover:text-[#5caf90] transition-colors">Cart</Link>
                            <span className="mx-[8px]">/</span>
                            <span className="text-[#4b5966]">Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flash error banner */}
            {flash?.error && (
                <div className="bg-[#fff5f5] border-b-[1px] border-solid border-[#ff7070] px-[12px] py-[10px]">
                    <div className="mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] flex items-center gap-[8px]">
                        <FiAlertCircle className="text-[#ff7070] flex-shrink-0" size={16} />
                        <span className="text-[13px] text-[#ff7070] font-medium">{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Checkout Section */}
            <section className="py-[40px] text-[14px] max-[767px]:py-[30px]">
                <div className="flex flex-wrap justify-between items-start mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
                    <form onSubmit={handleSubmit} className="flex flex-wrap w-full">

                        {/* ── RIGHT SIDEBAR (Order Summary + COD) ── */}
                        <div className="px-[12px] min-[992px]:w-[33.33%] w-full">

                            {/* Summary Block */}
                            <div className="border-[1px] border-solid border-[#eee] mb-[30px] p-[15px] rounded-[5px] bg-[#fff]">
                                <h3 className="text-[20px] max-[1199px]:text-[18px] font-semibold tracking-[0] mb-[0] text-[#4b5966] leading-[1.2]">
                                    Order Summary
                                </h3>
                                <div className="mt-[15px]">
                                    {/* Totals */}
                                    <div className="flex justify-between items-center mb-[10px]">
                                        <span className="text-[#777] text-[14px] leading-[24px]">Sub-Total</span>
                                        <span className="text-[#4b5966] text-[15px] leading-[24px] font-medium">
                                            {formatCents(cart.subtotal_cents)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-[10px]">
                                        <span className="text-[#777] text-[14px] leading-[24px]">Tax (10%)</span>
                                        <span className="text-[#4b5966] text-[15px] leading-[24px] font-medium">
                                            {formatCents(cart.tax_cents)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-[10px]">
                                        <span className="text-[#777] text-[14px] leading-[24px]">Shipping</span>
                                        <span className="text-[#5caf90] text-[15px] leading-[24px] font-medium">Free</span>
                                    </div>
                                    {codInfo.fee_cents > 0 && (
                                        <div className="flex justify-between items-center mb-[10px]">
                                            <span className="text-[#777] text-[14px] leading-[24px]">COD Fee</span>
                                            <span className="text-[#4b5966] text-[15px] leading-[24px] font-medium">
                                                {formatCents(codInfo.fee_cents)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="border-t-[1px] border-solid border-[#eee] pt-[19px] mb-[0] mt-[16px] flex justify-between items-center">
                                        <span className="text-[16px] font-semibold text-[#4b5966] font-heading">Total Amount</span>
                                        <span className="text-[16px] font-bold text-[#5caf90] font-heading">
                                            {formatCents(grandTotal)}
                                        </span>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="mt-[20px] space-y-[12px]">
                                        {cart.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-[12px] border-[1px] border-solid border-[#eee] rounded-[5px] p-[10px]"
                                            >
                                                <div className="w-[50px] h-[50px] flex-shrink-0 rounded-[5px] overflow-hidden border-[1px] border-solid border-[#eee] bg-[#f8f8fb]">
                                                    {item.product.image ? (
                                                        <img
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#777] text-[10px]">
                                                            No img
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-medium text-[#4b5966] truncate leading-[1.3]">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-[12px] text-[#777] mt-[2px]">
                                                        {formatCents(item.price_cents)} × {item.quantity}
                                                    </p>
                                                </div>
                                                <span className="text-[13px] font-semibold text-[#4b5966] flex-shrink-0">
                                                    {formatCents(item.price_cents * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Method Block */}
                            <div className="border-[1px] border-solid border-[#eee] mb-[30px] p-[15px] rounded-[5px] bg-[#fff]">
                                <h3 className="text-[20px] max-[1199px]:text-[18px] font-semibold tracking-[0] mb-[0] text-[#4b5966] leading-[1.2]">
                                    Delivery Method
                                </h3>
                                <div className="mt-[15px]">
                                    <p className="text-[#777] text-[14px] font-light leading-[24px] mb-[12px]">
                                        Please select the preferred shipping method to use on this order.
                                    </p>
                                    <div className="flex items-center gap-[10px] p-[12px] border-[1px] border-solid border-[#5caf90] rounded-[5px] bg-[#f8f8fb]">
                                        <div className="w-[18px] h-[18px] rounded-full border-[2px] border-solid border-[#5caf90] flex items-center justify-center flex-shrink-0">
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#5caf90]" />
                                        </div>
                                        <div>
                                            <span className="text-[#4b5966] text-[14px] font-medium">Free Shipping</span>
                                            <span className="text-[#777] text-[13px] ml-[8px]">Rate – $0.00</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-[8px] mt-[12px] text-[13px] text-[#777]">
                                        <FiTruck className="text-[#5caf90] flex-shrink-0" size={15} />
                                        <span>
                                            Estimated delivery:{' '}
                                            <strong className="text-[#4b5966]">{codInfo.delivery_estimate.text}</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Block */}
                            <div className="border-[1px] border-solid border-[#eee] mb-[30px] p-[15px] rounded-[5px] bg-[#fff]">
                                <h3 className="text-[20px] max-[1199px]:text-[18px] font-semibold tracking-[0] mb-[0] text-[#4b5966] leading-[1.2]">
                                    Payment Method
                                </h3>
                                <div className="mt-[15px]">
                                    <p className="text-[#777] text-[14px] font-light leading-[24px] mb-[12px]">
                                        {codInfo.instructions}
                                    </p>
                                    <div className="flex items-center gap-[10px] p-[12px] border-[1px] border-solid border-[#5caf90] rounded-[5px] bg-[#f8f8fb]">
                                        <div className="w-[18px] h-[18px] rounded-full border-[2px] border-solid border-[#5caf90] flex items-center justify-center flex-shrink-0">
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#5caf90]" />
                                        </div>
                                        <span className="text-[#4b5966] text-[14px] font-medium">Cash on Delivery</span>
                                    </div>

                                    {/* COD unavailable warning */}
                                    {!codInfo.available && codInfo.errors && codInfo.errors.length > 0 && (
                                        <div className="mt-[12px] p-[12px] bg-[#fff5f5] border-[1px] border-solid border-[#ff7070] rounded-[5px]">
                                            <p className="text-[13px] font-medium text-[#ff7070] mb-[4px]">
                                                COD not available for this address
                                            </p>
                                            <ul className="list-disc list-inside space-y-[2px]">
                                                {codInfo.errors.map((error, i) => (
                                                    <li key={i} className="text-[13px] text-[#ff7070]">{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {codInfo.fee_cents > 0 && (
                                        <p className="mt-[10px] text-[13px] text-[#777]">
                                            A COD fee of{' '}
                                            <strong className="text-[#4b5966]">{formatCents(codInfo.fee_cents)}</strong>{' '}
                                            will be collected on delivery.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── LEFT MAIN (Billing / Shipping Details) ── */}
                        <div className="px-[12px] min-[992px]:w-[66.66%] w-full max-[991px]:mt-[30px]">
                            <div className="pb-[3px] p-[30px] border-[1px] border-solid border-[#eee] bg-[#fff] rounded-[5px] mb-[40px]">
                                <h3 className="text-[20px] font-semibold tracking-[0] mb-[25px] text-[#4b5966] font-heading leading-[1] max-[575px]:text-[18px]">
                                    Shipping Details
                                </h3>

                                {/* Saved address cards */}
                                {addresses.length > 0 && (
                                    <div className="mb-[24px]">
                                        <p className="text-[#4b5966] text-[15px] font-medium tracking-[0] leading-[1] mb-[14px]">
                                            Saved Addresses
                                        </p>
                                        <div className="flex flex-col gap-[10px]">
                                            {addresses.map((address) => {
                                                const isSelected =
                                                    data.shipping_address_id === address.id && !showNewAddressForm;
                                                return (
                                                    <div
                                                        key={address.id}
                                                        onClick={() => selectSavedAddress(address)}
                                                        className={`flex items-start justify-between p-[15px] border-[1px] border-solid rounded-[5px] cursor-pointer transition-all duration-[0.2s] ${
                                                            isSelected
                                                                ? 'border-[#5caf90] bg-[#f8f8fb]'
                                                                : 'border-[#eee] hover:border-[#5caf90]'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-[12px]">
                                                            <div
                                                                className={`mt-[2px] w-[18px] h-[18px] rounded-full border-[2px] border-solid flex-shrink-0 flex items-center justify-center transition-colors ${
                                                                    isSelected
                                                                        ? 'border-[#5caf90]'
                                                                        : 'border-[#eee]'
                                                                }`}
                                                            >
                                                                {isSelected && (
                                                                    <div className="w-[8px] h-[8px] rounded-full bg-[#5caf90]" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-[14px] font-medium text-[#4b5966] mb-[2px]">
                                                                    {address.first_name} {address.last_name}
                                                                </p>
                                                                <p className="text-[13px] text-[#777]">
                                                                    {address.address_line_1}
                                                                    {address.address_line_2 && `, ${address.address_line_2}`}
                                                                </p>
                                                                <p className="text-[13px] text-[#777]">
                                                                    {address.city}, {address.state} {address.postal_code}, {address.country}
                                                                </p>
                                                                {address.phone && (
                                                                    <p className="text-[13px] text-[#777] mt-[2px]">
                                                                        📞 {address.phone}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-[8px] flex-shrink-0 ml-[10px]">
                                                            {address.is_default && (
                                                                <span className="text-[11px] bg-[#5caf90] text-[#fff] px-[8px] py-[2px] rounded-full">
                                                                    Default
                                                                </span>
                                                            )}
                                                            {isSelected && (
                                                                <div className="w-[22px] h-[22px] rounded-full bg-[#5caf90] flex items-center justify-center">
                                                                    <FiCheck className="text-[#fff]" size={12} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={openNewAddressForm}
                                            className="mt-[14px] text-[14px] text-[#5caf90] font-medium hover:text-[#4a9377] transition-colors flex items-center gap-[6px]"
                                        >
                                            <FiMapPin size={14} />
                                            {showNewAddressForm ? '← Back to saved addresses' : '+ Add a new address'}
                                        </button>
                                    </div>
                                )}

                                {/* New Address Form */}
                                {showNewAddressForm && (
                                    <div className="gi-check-bill-form mb-[2px]">
                                        <div className="flex flex-row flex-wrap mx-[-15px]">

                                            {/* Full Name */}
                                            <div className="w-full px-[15px]">
                                                <label className={labelClass}>Full Name *</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_name}
                                                    onChange={(e) => setData('shipping_name', e.target.value)}
                                                    placeholder="Enter your full name"
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.shipping_name} className="mt-[-20px] mb-[10px]" />
                                            </div>

                                            {/* Address Line 1 */}
                                            <div className="w-full px-[15px]">
                                                <label className={labelClass}>Address *</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_address_line1}
                                                    onChange={(e) => setData('shipping_address_line1', e.target.value)}
                                                    placeholder="Address Line 1"
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.shipping_address_line1} className="mt-[-20px] mb-[10px]" />
                                            </div>

                                            {/* Address Line 2 */}
                                            <div className="w-full px-[15px]">
                                                <label className={labelClass}>
                                                    Address Line 2{' '}
                                                    <span className="text-[#777] font-normal text-[13px]">(optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_address_line2}
                                                    onChange={(e) => setData('shipping_address_line2', e.target.value)}
                                                    placeholder="Apartment, suite, unit, etc."
                                                    className={inputClass}
                                                />
                                            </div>

                                            {/* City */}
                                            <div className="w-[50%] max-[575px]:w-full px-[15px]">
                                                <label className={labelClass}>City *</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_city}
                                                    onChange={(e) => setData('shipping_city', e.target.value)}
                                                    placeholder="City"
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.shipping_city} className="mt-[-20px] mb-[10px]" />
                                            </div>

                                            {/* State */}
                                            <div className="w-[50%] max-[575px]:w-full px-[15px]">
                                                <label className={labelClass}>State / Province *</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_state}
                                                    onChange={(e) => setData('shipping_state', e.target.value)}
                                                    placeholder="State"
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.shipping_state} className="mt-[-20px] mb-[10px]" />
                                            </div>

                                            {/* Postal Code */}
                                            <div className="w-[50%] max-[575px]:w-full px-[15px]">
                                                <label className={labelClass}>Post Code *</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_postal_code}
                                                    onChange={(e) => setData('shipping_postal_code', e.target.value)}
                                                    placeholder="Post Code"
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.shipping_postal_code} className="mt-[-20px] mb-[10px]" />
                                            </div>

                                            {/* Country */}
                                            <div className="w-[50%] max-[575px]:w-full px-[15px]">
                                                <label className={labelClass}>Country *</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_country}
                                                    onChange={(e) => setData('shipping_country', e.target.value.toUpperCase())}
                                                    placeholder="US"
                                                    maxLength={2}
                                                    className={inputClass + ' uppercase'}
                                                />
                                                <InputError message={errors.shipping_country} className="mt-[-20px] mb-[10px]" />
                                            </div>

                                            {/* Phone */}
                                            <div className="w-full px-[15px]">
                                                <label className={labelClass}>
                                                    Phone Number *
                                                    <span className="text-[#777] font-normal text-[13px] ml-[6px]">
                                                        (required for COD)
                                                    </span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={data.shipping_phone}
                                                    onChange={(e) => setData('shipping_phone', e.target.value)}
                                                    placeholder="+1 (555) 000-0000"
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.shipping_phone} className="mt-[-20px] mb-[10px]" />
                                            </div>

                                            {/* Save Address */}
                                            <div className="w-full px-[15px]">
                                                <label className="flex items-center gap-[10px] cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.save_address}
                                                        onChange={(e) => setData('save_address', e.target.checked)}
                                                        className="w-[15px] h-[15px] accent-[#5caf90] cursor-pointer"
                                                    />
                                                    <span className="text-[14px] text-[#777]">
                                                        Save this address for future orders
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Place Order Button */}
                            <div className="flex flex-col gap-[12px]">
                                <button
                                    type="submit"
                                    disabled={processing || !codInfo.available}
                                    className="transition-all duration-[0.3s] ease-in-out py-[12px] px-[30px] text-[15px] font-medium bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-[8px]"
                                >
                                    {processing ? (
                                        <>
                                            <span className="animate-spin inline-block w-[16px] h-[16px] border-[2px] border-[#fff] border-t-transparent rounded-full" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        `Place Order — ${formatCents(grandTotal)}`
                                    )}
                                </button>
                                <Link
                                    href="/cart"
                                    className="transition-all duration-[0.3s] ease-in-out py-[12px] px-[30px] text-[15px] font-medium border-[1px] border-solid border-[#eee] text-[#4b5966] text-center rounded-[5px] hover:border-[#5caf90] hover:text-[#5caf90]"
                                >
                                    ← Back to Cart
                                </Link>
                            </div>
                        </div>

                    </form>
                </div>
            </section>
        </FrontendLayout>
    );
}
