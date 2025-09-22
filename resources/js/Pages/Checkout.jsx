import Guest from '@/Layouts/GuestLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import React from 'react'

export default function Checkout({ cart }) {
    const cartItems = cart?.items || [];
    const cartTotal = cart?.total || 0;
    
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        payment_method: 'credit_card',
        notes: ''
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('checkout.process'));
    };
    
    return (
        <>
            <Head title="Checkout" />
            <Guest>
                <section className="gi-checkout-section py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            {/* Breadcrumb */}
                            <div className="w-full px-[12px] mb-[30px]">
                                <div className="gi-breadcrumb flex flex-wrap items-center">
                                    <Link href={route('welcome')} className="text-[14px] text-[#777] hover:text-[#5caf90]">Home</Link>
                                    <span className="mx-[5px]">/</span>
                                    <Link href={route('cart')} className="text-[14px] text-[#777] hover:text-[#5caf90]">Cart</Link>
                                    <span className="mx-[5px]">/</span>
                                    <span className="text-[14px] text-[#5caf90]">Checkout</span>
                                </div>
                            </div>
                            
                            {/* Checkout Content */}
                            <div className="w-full px-[12px]">
                                <div className="gi-checkout-wrap">
                                    <div className="gi-checkout-title mb-[30px]">
                                        <h2 className="text-[30px] text-[#333] font-semibold max-[767px]:text-[24px]">Checkout</h2>
                                    </div>
                                    
                                    {cartItems.length > 0 ? (
                                        <div className="gi-checkout-content">
                                            <form onSubmit={handleSubmit}>
                                                <div className="flex flex-wrap -mx-[12px]">
                                                    {/* Billing Details */}
                                                    <div className="w-full lg:w-[60%] px-[12px] mb-[30px]">
                                                        <div className="gi-checkout-billing p-[30px] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                            <h3 className="text-[20px] text-[#333] font-medium mb-[20px]">Billing Details</h3>
                                                            
                                                            <div className="flex flex-wrap -mx-[10px]">
                                                                <div className="w-full md:w-1/2 px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">First Name *</label>
                                                                        <input 
                                                                            type="text" 
                                                                            className={`w-full h-[45px] px-[15px] border-[1px] border-solid ${errors.first_name ? 'border-[#ff0000]' : 'border-[#eee]'} rounded-[5px] outline-none`}
                                                                            value={data.first_name}
                                                                            onChange={(e) => setData('first_name', e.target.value)}
                                                                            required
                                                                        />
                                                                        {errors.first_name && <div className="text-[12px] text-[#ff0000] mt-[5px]">{errors.first_name}</div>}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full md:w-1/2 px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">Last Name *</label>
                                                                        <input 
                                                                            type="text" 
                                                                            className={`w-full h-[45px] px-[15px] border-[1px] border-solid ${errors.last_name ? 'border-[#ff0000]' : 'border-[#eee]'} rounded-[5px] outline-none`}
                                                                            value={data.last_name}
                                                                            onChange={(e) => setData('last_name', e.target.value)}
                                                                            required
                                                                        />
                                                                        {errors.last_name && <div className="text-[12px] text-[#ff0000] mt-[5px]">{errors.last_name}</div>}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">Email Address *</label>
                                                                        <input 
                                                                            type="email" 
                                                                            className={`w-full h-[45px] px-[15px] border-[1px] border-solid ${errors.email ? 'border-[#ff0000]' : 'border-[#eee]'} rounded-[5px] outline-none`}
                                                                            value={data.email}
                                                                            onChange={(e) => setData('email', e.target.value)}
                                                                            required
                                                                        />
                                                                        {errors.email && <div className="text-[12px] text-[#ff0000] mt-[5px]">{errors.email}</div>}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">Phone *</label>
                                                                        <input 
                                                                            type="tel" 
                                                                            className={`w-full h-[45px] px-[15px] border-[1px] border-solid ${errors.phone ? 'border-[#ff0000]' : 'border-[#eee]'} rounded-[5px] outline-none`}
                                                                            value={data.phone}
                                                                            onChange={(e) => setData('phone', e.target.value)}
                                                                            required
                                                                        />
                                                                        {errors.phone && <div className="text-[12px] text-[#ff0000] mt-[5px]">{errors.phone}</div>}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">Address *</label>
                                                                        <input 
                                                                            type="text" 
                                                                            className={`w-full h-[45px] px-[15px] border-[1px] border-solid ${errors.address ? 'border-[#ff0000]' : 'border-[#eee]'} rounded-[5px] outline-none`}
                                                                            value={data.address}
                                                                            onChange={(e) => setData('address', e.target.value)}
                                                                            required
                                                                        />
                                                                        {errors.address && <div className="text-[12px] text-[#ff0000] mt-[5px]">{errors.address}</div>}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full md:w-1/3 px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">City *</label>
                                                                        <input 
                                                                            type="text" 
                                                                            className={`w-full h-[45px] px-[15px] border-[1px] border-solid ${errors.city ? 'border-[#ff0000]' : 'border-[#eee]'} rounded-[5px] outline-none`}
                                                                            value={data.city}
                                                                            onChange={(e) => setData('city', e.target.value)}
                                                                            required
                                                                        />
                                                                        {errors.city && <div className="text-[12px] text-[#ff0000] mt-[5px]">{errors.city}</div>}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full md:w-1/3 px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">State *</label>
                                                                        <input 
                                                                            type="text" 
                                                                            className={`w-full h-[45px] px-[15px] border-[1px] border-solid ${errors.state ? 'border-[#ff0000]' : 'border-[#eee]'} rounded-[5px] outline-none`}
                                                                            value={data.state}
                                                                            onChange={(e) => setData('state', e.target.value)}
                                                                            required
                                                                        />
                                                                        {errors.state && <div className="text-[12px] text-[#ff0000] mt-[5px]">{errors.state}</div>}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full md:w-1/3 px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">ZIP Code *</label>
                                                                        <input 
                                                                            type="text" 
                                                                            className={`w-full h-[45px] px-[15px] border-[1px] border-solid ${errors.zip_code ? 'border-[#ff0000]' : 'border-[#eee]'} rounded-[5px] outline-none`}
                                                                            value={data.zip_code}
                                                                            onChange={(e) => setData('zip_code', e.target.value)}
                                                                            required
                                                                        />
                                                                        {errors.zip_code && <div className="text-[12px] text-[#ff0000] mt-[5px]">{errors.zip_code}</div>}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">Country *</label>
                                                                        <select 
                                                                            className={`w-full h-[45px] px-[15px] border-[1px] border-solid ${errors.country ? 'border-[#ff0000]' : 'border-[#eee]'} rounded-[5px] outline-none`}
                                                                            value={data.country}
                                                                            onChange={(e) => setData('country', e.target.value)}
                                                                            required
                                                                        >
                                                                            <option value="">Select Country</option>
                                                                            <option value="US">United States</option>
                                                                            <option value="CA">Canada</option>
                                                                            <option value="UK">United Kingdom</option>
                                                                            <option value="AU">Australia</option>
                                                                            <option value="DE">Germany</option>
                                                                            <option value="FR">France</option>
                                                                        </select>
                                                                        {errors.country && <div className="text-[12px] text-[#ff0000] mt-[5px]">{errors.country}</div>}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full px-[10px] mb-[20px]">
                                                                    <div className="gi-form-group">
                                                                        <label className="text-[14px] text-[#333] font-medium mb-[5px] block">Order Notes (Optional)</label>
                                                                        <textarea 
                                                                            className="w-full h-[100px] p-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] outline-none resize-none"
                                                                            value={data.notes}
                                                                            onChange={(e) => setData('notes', e.target.value)}
                                                                            placeholder="Notes about your order, e.g. special notes for delivery."
                                                                        ></textarea>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Order Summary */}
                                                    <div className="w-full lg:w-[40%] px-[12px] mb-[30px]">
                                                        <div className="gi-checkout-summary p-[30px] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                            <h3 className="text-[20px] text-[#333] font-medium mb-[20px]">Your Order</h3>
                                                            
                                                            <div className="gi-checkout-summary-content">
                                                                <div className="gi-checkout-summary-header flex justify-between items-center mb-[10px] pb-[10px] border-b-[1px] border-solid border-[#eee]">
                                                                    <span className="text-[16px] text-[#333] font-medium">Product</span>
                                                                    <span className="text-[16px] text-[#333] font-medium">Subtotal</span>
                                                                </div>
                                                                
                                                                <div className="gi-checkout-summary-body">
                                                                    {cartItems.map(item => (
                                                                        <div key={item.id} className="gi-checkout-summary-item flex justify-between items-center mb-[10px] pb-[10px] border-b-[1px] border-solid border-[#eee]">
                                                                            <span className="text-[14px] text-[#777]">{item.product.name} × {item.quantity}</span>
                                                                            <span className="text-[14px] text-[#5caf90] font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                
                                                                <div className="gi-checkout-summary-footer">
                                                                    <div className="gi-checkout-summary-item flex justify-between items-center mb-[10px] pb-[10px] border-b-[1px] border-solid border-[#eee]">
                                                                        <span className="text-[16px] text-[#333] font-medium">Subtotal</span>
                                                                        <span className="text-[16px] text-[#5caf90] font-medium">${cartTotal.toFixed(2)}</span>
                                                                    </div>
                                                                    <div className="gi-checkout-summary-item flex justify-between items-center mb-[10px] pb-[10px] border-b-[1px] border-solid border-[#eee]">
                                                                        <span className="text-[16px] text-[#333] font-medium">Shipping</span>
                                                                        <span className="text-[16px] text-[#5caf90] font-medium">Free</span>
                                                                    </div>
                                                                    <div className="gi-checkout-summary-item flex justify-between items-center mb-[20px]">
                                                                        <span className="text-[16px] text-[#333] font-medium">Total</span>
                                                                        <span className="text-[18px] text-[#5caf90] font-semibold">${cartTotal.toFixed(2)}</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="gi-checkout-payment">
                                                                    <h4 className="text-[16px] text-[#333] font-medium mb-[15px]">Payment Method</h4>
                                                                    
                                                                    <div className="gi-checkout-payment-methods">
                                                                        <div className="gi-checkout-payment-method mb-[10px]">
                                                                            <label className="flex items-center cursor-pointer">
                                                                                <input 
                                                                                    type="radio" 
                                                                                    name="payment_method" 
                                                                                    value="credit_card" 
                                                                                    checked={data.payment_method === 'credit_card'}
                                                                                    onChange={() => setData('payment_method', 'credit_card')}
                                                                                    className="mr-[10px]"
                                                                                />
                                                                                <span className="text-[14px] text-[#333]">Credit Card</span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="gi-checkout-payment-method mb-[10px]">
                                                                            <label className="flex items-center cursor-pointer">
                                                                                <input 
                                                                                    type="radio" 
                                                                                    name="payment_method" 
                                                                                    value="paypal" 
                                                                                    checked={data.payment_method === 'paypal'}
                                                                                    onChange={() => setData('payment_method', 'paypal')}
                                                                                    className="mr-[10px]"
                                                                                />
                                                                                <span className="text-[14px] text-[#333]">PayPal</span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="gi-checkout-payment-method mb-[10px]">
                                                                            <label className="flex items-center cursor-pointer">
                                                                                <input 
                                                                                    type="radio" 
                                                                                    name="payment_method" 
                                                                                    value="bank_transfer" 
                                                                                    checked={data.payment_method === 'bank_transfer'}
                                                                                    onChange={() => setData('payment_method', 'bank_transfer')}
                                                                                    className="mr-[10px]"
                                                                                />
                                                                                <span className="text-[14px] text-[#333]">Direct Bank Transfer</span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="gi-checkout-payment-method mb-[10px]">
                                                                            <label className="flex items-center cursor-pointer">
                                                                                <input 
                                                                                    type="radio" 
                                                                                    name="payment_method" 
                                                                                    value="cash_on_delivery" 
                                                                                    checked={data.payment_method === 'cash_on_delivery'}
                                                                                    onChange={() => setData('payment_method', 'cash_on_delivery')}
                                                                                    className="mr-[10px]"
                                                                                />
                                                                                <span className="text-[14px] text-[#333]">Cash on Delivery</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="gi-checkout-place-order mt-[30px]">
                                                                    <button 
                                                                        type="submit" 
                                                                        className="w-full h-[50px] flex items-center justify-center bg-[#5caf90] text-[#fff] text-[14px] font-medium border-[0] rounded-[5px] cursor-pointer hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                                                                        disabled={processing}
                                                                    >
                                                                        {processing ? 'Processing...' : 'Place Order'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="gi-checkout-empty text-center py-[50px]">
                                            <div className="gi-checkout-empty-icon mb-[20px]">
                                                <i className="fi-rr-shopping-cart text-[60px] text-[#eee]" />
                                            </div>
                                            <h3 className="text-[24px] text-[#333] font-medium mb-[15px]">Your cart is empty</h3>
                                            <p className="text-[16px] text-[#777] mb-[20px]">You need to add some products to your cart before proceeding to checkout.</p>
                                            <Link 
                                                href={route('products.index')} 
                                                className="gi-btn-primary text-[14px] text-[#fff] font-medium bg-[#5caf90] py-[10px] px-[30px] rounded-[5px] inline-block hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out"
                                            >
                                                Continue Shopping
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Guest>
        </>
    )
}