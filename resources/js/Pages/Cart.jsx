import Guest from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

export default function Cart({ cart }) {
    const cartItems = cart?.items || [];
    const cartTotal = cart?.total || 0;
    
    return (
        <>
            <Head title="Shopping Cart" />
            <Guest>
                <section className="gi-cart-section py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            {/* Breadcrumb */}
                            <div className="w-full px-[12px] mb-[30px]">
                                <div className="gi-breadcrumb flex flex-wrap items-center">
                                    <Link href={route('welcome')} className="text-[14px] text-[#777] hover:text-[#5caf90]">Home</Link>
                                    <span className="mx-[5px]">/</span>
                                    <span className="text-[14px] text-[#5caf90]">Shopping Cart</span>
                                </div>
                            </div>
                            
                            {/* Cart Content */}
                            <div className="w-full px-[12px]">
                                <div className="gi-cart-wrap">
                                    <div className="gi-cart-title mb-[30px]">
                                        <h2 className="text-[30px] text-[#333] font-semibold max-[767px]:text-[24px]">Shopping Cart</h2>
                                    </div>
                                    
                                    {cartItems.length > 0 ? (
                                        <div className="gi-cart-content">
                                            <div className="gi-cart-table">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-left p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Product</th>
                                                            <th className="text-center p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Price</th>
                                                            <th className="text-center p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Quantity</th>
                                                            <th className="text-center p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Subtotal</th>
                                                            <th className="text-center p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Remove</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cartItems.map(item => (
                                                            <tr key={item.id}>
                                                                <td className="p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <div className="gi-cart-product flex items-center">
                                                                        <div className="gi-cart-product-img w-[80px] h-[80px] mr-[15px]">
                                                                            <img 
                                                                                src={item.product.image ? `/storage/${item.product.image}` : '/assets/img/placeholder.jpg'} 
                                                                                alt={item.product.name} 
                                                                                className="w-full h-full object-cover rounded-[5px]" 
                                                                            />
                                                                        </div>
                                                                        <div className="gi-cart-product-info">
                                                                            <h5 className="gi-cart-product-title text-[16px] text-[#333] font-medium mb-[5px]">
                                                                                <Link href={route('product.detail', item.product.slug)}>{item.product.name}</Link>
                                                                            </h5>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <span className="gi-cart-product-price text-[16px] text-[#5caf90] font-medium">
                                                                        ${item.price}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <div className="gi-cart-product-quantity flex items-center justify-center">
                                                                        <div className="gi-quantity-wrap flex items-center border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                                            <button 
                                                                                type="button" 
                                                                                className="gi-quantity-btn h-[40px] w-[40px] flex items-center justify-center text-[#777] text-[20px] border-[0] bg-transparent cursor-pointer"
                                                                            >
                                                                                -
                                                                            </button>
                                                                            <input 
                                                                                type="text" 
                                                                                className="gi-quantity-input h-[40px] w-[40px] text-center text-[16px] text-[#333] border-[0] bg-transparent outline-none" 
                                                                                value={item.quantity} 
                                                                                readOnly 
                                                                            />
                                                                            <button 
                                                                                type="button" 
                                                                                className="gi-quantity-btn h-[40px] w-[40px] flex items-center justify-center text-[#777] text-[20px] border-[0] bg-transparent cursor-pointer"
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <span className="gi-cart-product-subtotal text-[16px] text-[#5caf90] font-medium">
                                                                        ${(item.price * item.quantity).toFixed(2)}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <button 
                                                                        type="button" 
                                                                        className="gi-cart-product-remove text-[20px] text-[#ff7070] border-[0] bg-transparent cursor-pointer"
                                                                    >
                                                                        <i className="fi-rr-trash" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                            <div className="gi-cart-actions flex flex-wrap justify-between items-center mt-[30px]">
                                                <div className="gi-cart-coupon flex items-center">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Coupon Code" 
                                                        className="h-[50px] px-[15px] border-[1px] border-solid border-[#eee] rounded-l-[5px] outline-none" 
                                                    />
                                                    <button 
                                                        type="button" 
                                                        className="h-[50px] px-[20px] bg-[#5caf90] text-[#fff] text-[14px] font-medium border-[0] rounded-r-[5px] cursor-pointer hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out"
                                                    >
                                                        Apply Coupon
                                                    </button>
                                                </div>
                                                <div className="gi-cart-update">
                                                    <button 
                                                        type="button" 
                                                        className="h-[50px] px-[20px] bg-[#5caf90] text-[#fff] text-[14px] font-medium border-[0] rounded-[5px] cursor-pointer hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out"
                                                    >
                                                        Update Cart
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="gi-cart-total mt-[50px]">
                                                <div className="gi-cart-total-wrap max-w-[400px] ml-auto">
                                                    <div className="gi-cart-total-title mb-[15px]">
                                                        <h4 className="text-[20px] text-[#333] font-medium">Cart Total</h4>
                                                    </div>
                                                    <div className="gi-cart-total-content border-[1px] border-solid border-[#eee] rounded-[5px] p-[20px]">
                                                        <div className="gi-cart-total-item flex justify-between items-center mb-[10px] pb-[10px] border-b-[1px] border-solid border-[#eee]">
                                                            <span className="text-[16px] text-[#333] font-medium">Subtotal</span>
                                                            <span className="text-[16px] text-[#5caf90] font-medium">${cartTotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="gi-cart-total-item flex justify-between items-center mb-[10px] pb-[10px] border-b-[1px] border-solid border-[#eee]">
                                                            <span className="text-[16px] text-[#333] font-medium">Shipping</span>
                                                            <span className="text-[16px] text-[#5caf90] font-medium">Free</span>
                                                        </div>
                                                        <div className="gi-cart-total-item flex justify-between items-center">
                                                            <span className="text-[16px] text-[#333] font-medium">Total</span>
                                                            <span className="text-[18px] text-[#5caf90] font-semibold">${cartTotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="gi-cart-checkout mt-[20px]">
                                                            <Link 
                                                                href={route('checkout')} 
                                                                className="w-full h-[50px] flex items-center justify-center bg-[#5caf90] text-[#fff] text-[14px] font-medium border-[0] rounded-[5px] cursor-pointer hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out"
                                                            >
                                                                Proceed to Checkout
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="gi-cart-empty text-center py-[50px]">
                                            <div className="gi-cart-empty-icon mb-[20px]">
                                                <i className="fi-rr-shopping-cart text-[60px] text-[#eee]" />
                                            </div>
                                            <h3 className="text-[24px] text-[#333] font-medium mb-[15px]">Your cart is empty</h3>
                                            <p className="text-[16px] text-[#777] mb-[20px]">Looks like you haven't added any products to your cart yet.</p>
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