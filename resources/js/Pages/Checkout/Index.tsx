import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { FiTruck, FiMapPin, FiCreditCard, FiCheck, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

interface Address {
    id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        image?: string;
        vendor: {
            id: number;
            business_name: string;
        };
    };
    quantity: number;
    price_cents: number;
}

interface VendorShipping {
    vendor_id: number;
    vendor_name: string;
    items_count: number;
    subtotal_cents: number;
    available_methods: ShippingMethodOption[];
}

interface ShippingMethodOption {
    method_id: number;
    method_name: string;
    method_type: string;
    carrier: string;
    rate_cents: number;
    is_free: boolean;
    estimated_delivery: {
        formatted: string;
        min_days: number;
        max_days: number;
    };
}

interface Props {
    cart: {
        items: CartItem[];
        subtotal_cents: number;
    };
    addresses: Address[];
}

export default function Checkout({ cart, addresses }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses[0] || null);
    const [shippingData, setShippingData] = useState<{
        vendors: VendorShipping[];
        zone: any;
    } | null>(null);
    const [selectedShipping, setSelectedShipping] = useState<Record<number, number>>({});
    const [loadingShipping, setLoadingShipping] = useState(false);
    const [shippingTotal, setShippingTotal] = useState(0);

    const { data, setData, post, processing } = useForm({
        address_id: addresses[0]?.id || null,
        shipping_selections: {} as Record<number, number>,
        payment_method: 'card',
    });

    // Load shipping methods when address is selected
    useEffect(() => {
        if (selectedAddress) {
            loadShippingMethods(selectedAddress.id);
        }
    }, [selectedAddress]);

    // Calculate shipping total when selections change
    useEffect(() => {
        calculateShippingTotal();
    }, [selectedShipping]);

    const loadShippingMethods = async (addressId: number) => {
        setLoadingShipping(true);
        try {
            const response = await axios.get('/api/shipping/methods-for-cart', {
                params: { address_id: addressId },
            });

            if (response.data.success) {
                setShippingData(response.data.data);

                // Auto-select cheapest method for each vendor
                const autoSelections: Record<number, number> = {};
                response.data.data.vendors.forEach((vendor: VendorShipping) => {
                    if (vendor.available_methods.length > 0) {
                        const cheapest = vendor.available_methods.reduce((prev, curr) => {
                            if (curr.is_free) return curr;
                            if (prev.is_free) return prev;
                            return curr.rate_cents < prev.rate_cents ? curr : prev;
                        });
                        autoSelections[vendor.vendor_id] = cheapest.method_id;
                    }
                });
                setSelectedShipping(autoSelections);
                setData('shipping_selections', autoSelections);
            }
        } catch (error) {
            console.error('Error loading shipping methods:', error);
        } finally {
            setLoadingShipping(false);
        }
    };

    const calculateShippingTotal = () => {
        if (!shippingData) return;

        let total = 0;
        shippingData.vendors.forEach((vendor) => {
            const methodId = selectedShipping[vendor.vendor_id];
            if (methodId) {
                const method = vendor.available_methods.find(m => m.method_id === methodId);
                if (method && !method.is_free) {
                    total += method.rate_cents;
                }
            }
        });
        setShippingTotal(total);
    };

    const handleShippingSelection = (vendorId: number, methodId: number) => {
        const newSelections = { ...selectedShipping, [vendorId]: methodId };
        setSelectedShipping(newSelections);
        setData('shipping_selections', newSelections);
    };

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            alert('Please select a shipping address');
            return;
        }

        if (Object.keys(selectedShipping).length !== shippingData?.vendors.length) {
            alert('Please select shipping method for all vendors');
            return;
        }

        post(route('checkout.place-order'), {
            data: {
                ...data,
                address_id: selectedAddress.id,
            },
        });
    };

    const formatCents = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    const grandTotal = cart.subtotal_cents + shippingTotal;

    return (
        <>
            <Head title="Checkout" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            {[1, 2, 3].map((step) => (
                                <React.Fragment key={step}>
                                    <div className="flex items-center">
                                        <div
                                            className={"flex items-center justify-center w-10 h-10 rounded-full " + (
                                                currentStep >= step
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-300 text-gray-600'
                                            )}
                                        >
                                            {currentStep > step ? <FiCheck /> : step}
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-900">
                                            {step === 1 && 'Address'}
                                            {step === 2 && 'Shipping'}
                                            {step === 3 && 'Payment'}
                                        </span>
                                    </div>
                                    {step < 3 && (
                                        <div
                                            className={"w-24 h-1 mx-4 " + (
                                                currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                                            )}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Step 1: Shipping Address */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FiMapPin className="text-blue-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                                </div>

                                {addresses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No addresses found. Please add an address first.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                onClick={() => {
                                                    setSelectedAddress(address);
                                                    setData('address_id', address.id);
                                                    setCurrentStep(2);
                                                }}
                                                className={"border-2 rounded-lg p-4 cursor-pointer transition-colors " + (
                                                    selectedAddress?.id === address.id
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                )}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{address.address_line1}</p>
                                                        {address.address_line2 && (
                                                            <p className="text-sm text-gray-600">{address.address_line2}</p>
                                                        )}
                                                        <p className="text-sm text-gray-600">
                                                            {address.city}, {address.state} {address.postal_code}
                                                        </p>
                                                        <p className="text-sm text-gray-600">{address.country}</p>
                                                    </div>
                                                    {selectedAddress?.id === address.id && (
                                                        <FiCheck className="text-blue-600" size={20} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Shipping Methods - Multi-Vendor */}
                            {currentStep >= 2 && selectedAddress && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiTruck className="text-blue-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Shipping Methods</h2>
                                        <span className="text-sm text-gray-500">(Select shipping for each vendor)</span>
                                    </div>

                                    {loadingShipping ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">Loading shipping methods...</p>
                                        </div>
                                    ) : shippingData && shippingData.vendors.length > 0 ? (
                                        <div className="space-y-6">
                                            {shippingData.vendors.map((vendor) => (
                                                <div key={vendor.vendor_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                                <FiTruck size={16} />
                                                                {vendor.vendor_name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {vendor.items_count} item{vendor.items_count > 1 ? 's' : ''} • {formatCents(vendor.subtotal_cents)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {vendor.available_methods.map((method) => (
                                                            <div
                                                                key={method.method_id}
                                                                onClick={() => handleShippingSelection(vendor.vendor_id, method.method_id)}
                                                                className={"border-2 rounded-lg p-3 cursor-pointer transition-colors bg-white " + (
                                                                    selectedShipping[vendor.vendor_id] === method.method_id
                                                                        ? 'border-blue-600 bg-blue-50'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                )}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-medium text-gray-900">{method.method_name}</span>
                                                                            {method.is_free && (
                                                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                                    FREE SHIPPING
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm text-gray-500">
                                                                            {method.carrier && method.carrier + " • "}
                                                                            Delivery: {method.estimated_delivery.formatted}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right ml-4">
                                                                        <p className="font-semibold text-lg text-gray-900">
                                                                            {method.is_free ? 'FREE' : formatCents(method.rate_cents)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                                            <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-yellow-800">
                                                    Shipping is not available to this address. Please select a different address.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {shippingData && shippingData.vendors.length > 0 && (
                                        <button
                                            onClick={() => setCurrentStep(3)}
                                            disabled={Object.keys(selectedShipping).length !== shippingData.vendors.length}
                                            className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                        >
                                            Continue to Payment
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {currentStep >= 3 && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiCreditCard className="text-blue-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                                    </div>

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={processing}
                                        className="w-full px-6 py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Processing...' : 'Place Order - ' + formatCents(grandTotal)}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">{formatCents(cart.subtotal_cents)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium text-gray-900">
                                            {shippingTotal === 0 && shippingData ? 'FREE' : formatCents(shippingTotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>{formatCents(grandTotal)}</span>
                                    </div>
                                </div>

                                {shippingTotal === 0 && shippingData && shippingData.vendors.length > 0 && (
                                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                                            <FiCheck className="text-green-600" />
                                            Free shipping qualified!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
