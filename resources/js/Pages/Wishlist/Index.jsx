import Guest from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

export default function WishlistIndex({ wishlist }) {
    const wishlistItems = wishlist?.items || [];
    
    return (
        <>
            <Head title="Wishlist" />
            <Guest>
                <section className="gi-wishlist-section py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            {/* Breadcrumb */}
                            <div className="w-full px-[12px] mb-[30px]">
                                <div className="gi-breadcrumb flex flex-wrap items-center">
                                    <Link href={route('welcome')} className="text-[14px] text-[#777] hover:text-[#5caf90]">Home</Link>
                                    <span className="mx-[5px]">/</span>
                                    <span className="text-[14px] text-[#5caf90]">Wishlist</span>
                                </div>
                            </div>
                            
                            {/* Wishlist Content */}
                            <div className="w-full px-[12px]">
                                <div className="gi-wishlist-wrap">
                                    <div className="gi-wishlist-title mb-[30px]">
                                        <h2 className="text-[30px] text-[#333] font-semibold max-[767px]:text-[24px]">My Wishlist</h2>
                                    </div>
                                    
                                    {wishlistItems.length > 0 ? (
                                        <div className="gi-wishlist-content">
                                            <div className="gi-wishlist-table">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-left p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Product</th>
                                                            <th className="text-center p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Price</th>
                                                            <th className="text-center p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Stock Status</th>
                                                            <th className="text-center p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Actions</th>
                                                            <th className="text-center p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Remove</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {wishlistItems.map(item => (
                                                            <tr key={item.id}>
                                                                <td className="p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <div className="gi-wishlist-product flex items-center">
                                                                        <div className="gi-wishlist-product-img w-[80px] h-[80px] mr-[15px]">
                                                                            <img 
                                                                                src={item.product.image ? `/storage/${item.product.image}` : '/assets/img/placeholder.jpg'} 
                                                                                alt={item.product.name} 
                                                                                className="w-full h-full object-cover rounded-[5px]" 
                                                                            />
                                                                        </div>
                                                                        <div className="gi-wishlist-product-info">
                                                                            <h5 className="gi-wishlist-product-title text-[16px] text-[#333] font-medium mb-[5px]">
                                                                                <Link href={route('product.detail', item.product.slug)}>{item.product.name}</Link>
                                                                            </h5>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <span className="gi-wishlist-product-price text-[16px] text-[#5caf90] font-medium">
                                                                        ${item.product.price}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <span className={`gi-wishlist-product-stock text-[14px] font-medium ${item.product.in_stock ? 'text-[#5caf90]' : 'text-[#ff7070]'}`}>
                                                                        {item.product.in_stock ? 'In Stock' : 'Out of Stock'}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <button 
                                                                        type="button" 
                                                                        className={`gi-wishlist-product-cart h-[40px] px-[15px] text-[14px] font-medium rounded-[5px] ${item.product.in_stock ? 'bg-[#5caf90] text-[#fff] hover:bg-[#4b5966]' : 'bg-[#eee] text-[#777] cursor-not-allowed'} transition-all duration-[0.3s] ease-in-out`}
                                                                        disabled={!item.product.in_stock}
                                                                    >
                                                                        {item.product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                                                                    </button>
                                                                </td>
                                                                <td className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                    <button 
                                                                        type="button" 
                                                                        className="gi-wishlist-product-remove text-[20px] text-[#ff7070] border-[0] bg-transparent cursor-pointer"
                                                                    >
                                                                        <i className="fi-rr-trash" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                            <div className="gi-wishlist-actions flex justify-end mt-[30px]">
                                                <Link 
                                                    href={route('products.index')} 
                                                    className="gi-btn-primary text-[14px] text-[#fff] font-medium bg-[#5caf90] py-[10px] px-[30px] rounded-[5px] inline-block hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out"
                                                >
                                                    Continue Shopping
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="gi-wishlist-empty text-center py-[50px]">
                                            <div className="gi-wishlist-empty-icon mb-[20px]">
                                                <i className="fi-rr-heart text-[60px] text-[#eee]" />
                                            </div>
                                            <h3 className="text-[24px] text-[#333] font-medium mb-[15px]">Your wishlist is empty</h3>
                                            <p className="text-[16px] text-[#777] mb-[20px]">Looks like you haven't added any products to your wishlist yet.</p>
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