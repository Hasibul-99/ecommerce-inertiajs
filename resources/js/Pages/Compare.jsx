import Guest from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

export default function Compare({ compareItems }) {
    const items = compareItems || [];
    
    return (
        <>
            <Head title="Compare Products" />
            <Guest>
                <section className="gi-compare-section py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            {/* Breadcrumb */}
                            <div className="w-full px-[12px] mb-[30px]">
                                <div className="gi-breadcrumb flex flex-wrap items-center">
                                    <Link href={route('welcome')} className="text-[14px] text-[#777] hover:text-[#5caf90]">Home</Link>
                                    <span className="mx-[5px]">/</span>
                                    <span className="text-[14px] text-[#5caf90]">Compare Products</span>
                                </div>
                            </div>
                            
                            {/* Compare Content */}
                            <div className="w-full px-[12px]">
                                <div className="gi-compare-wrap">
                                    <div className="gi-compare-title mb-[30px]">
                                        <h2 className="text-[30px] text-[#333] font-semibold max-[767px]:text-[24px]">Compare Products</h2>
                                    </div>
                                    
                                    {items.length > 0 ? (
                                        <div className="gi-compare-content overflow-x-auto">
                                            <table className="w-full border-collapse min-w-[800px]">
                                                <thead>
                                                    <tr>
                                                        <th className="text-left p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee] w-[200px]">Product Info</th>
                                                        {items.map(item => (
                                                            <th key={item.id} className="text-center p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">
                                                                <div className="gi-compare-product-remove flex justify-end mb-[10px]">
                                                                    <button 
                                                                        type="button" 
                                                                        className="gi-compare-product-remove-btn text-[16px] text-[#ff7070] border-[0] bg-transparent cursor-pointer"
                                                                    >
                                                                        <i className="fi-rr-cross-small" />
                                                                    </button>
                                                                </div>
                                                                <div className="gi-compare-product-img w-[120px] h-[120px] mx-auto mb-[10px]">
                                                                    <img 
                                                                        src={item.image ? `/storage/${item.image}` : '/assets/img/placeholder.jpg'} 
                                                                        alt={item.name} 
                                                                        className="w-full h-full object-cover rounded-[5px]" 
                                                                    />
                                                                </div>
                                                                <div className="gi-compare-product-title">
                                                                    <h5 className="text-[16px] text-[#333] font-medium">
                                                                        <Link href={route('product.detail', item.slug)}>{item.name}</Link>
                                                                    </h5>
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="text-left p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Price</td>
                                                        {items.map(item => (
                                                            <td key={`${item.id}-price`} className="text-center p-[15px] text-[16px] text-[#5caf90] font-medium border-[1px] border-solid border-[#eee]">
                                                                ${item.price}
                                                                {item.old_price && (
                                                                    <span className="text-[14px] text-[#777] line-through ml-[5px]">${item.old_price}</span>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Availability</td>
                                                        {items.map(item => (
                                                            <td key={`${item.id}-stock`} className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                <span className={`text-[14px] font-medium ${item.in_stock ? 'text-[#5caf90]' : 'text-[#ff7070]'}`}>
                                                                    {item.in_stock ? 'In Stock' : 'Out of Stock'}
                                                                </span>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Rating</td>
                                                        {items.map(item => (
                                                            <td key={`${item.id}-rating`} className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                <div className="gi-compare-product-rating flex justify-center">
                                                                    {[1, 2, 3, 4, 5].map(star => (
                                                                        <i 
                                                                            key={star}
                                                                            className={`fi-rr-star text-[14px] ${star <= item.rating ? 'text-[#ffc107]' : 'text-[#ddd]'} mx-[1px]`} 
                                                                        />
                                                                    ))}
                                                                    <span className="text-[14px] text-[#777] ml-[5px]">({item.review_count})</span>
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Description</td>
                                                        {items.map(item => (
                                                            <td key={`${item.id}-desc`} className="text-center p-[15px] text-[14px] text-[#777] border-[1px] border-solid border-[#eee]">
                                                                {item.short_description}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Category</td>
                                                        {items.map(item => (
                                                            <td key={`${item.id}-category`} className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                <Link 
                                                                    href={route('category.index', item.category.slug)} 
                                                                    className="text-[14px] text-[#5caf90] hover:underline"
                                                                >
                                                                    {item.category.name}
                                                                </Link>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left p-[15px] text-[16px] text-[#333] font-medium border-[1px] border-solid border-[#eee]">Actions</td>
                                                        {items.map(item => (
                                                            <td key={`${item.id}-actions`} className="text-center p-[15px] border-[1px] border-solid border-[#eee]">
                                                                <div className="gi-compare-product-actions flex flex-col items-center gap-[10px]">
                                                                    <button 
                                                                        type="button" 
                                                                        className={`gi-compare-product-cart w-full h-[40px] px-[15px] text-[14px] font-medium rounded-[5px] ${item.in_stock ? 'bg-[#5caf90] text-[#fff] hover:bg-[#4b5966]' : 'bg-[#eee] text-[#777] cursor-not-allowed'} transition-all duration-[0.3s] ease-in-out`}
                                                                        disabled={!item.in_stock}
                                                                    >
                                                                        {item.in_stock ? 'Add to Cart' : 'Out of Stock'}
                                                                    </button>
                                                                    <button 
                                                                        type="button" 
                                                                        className="gi-compare-product-wishlist w-full h-[40px] px-[15px] text-[14px] font-medium rounded-[5px] border-[1px] border-solid border-[#eee] bg-transparent text-[#333] hover:bg-[#f5f5f5] transition-all duration-[0.3s] ease-in-out"
                                                                    >
                                                                        Add to Wishlist
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="gi-compare-empty text-center py-[50px]">
                                            <div className="gi-compare-empty-icon mb-[20px]">
                                                <i className="fi-rr-shuffle text-[60px] text-[#eee]" />
                                            </div>
                                            <h3 className="text-[24px] text-[#333] font-medium mb-[15px]">No products to compare</h3>
                                            <p className="text-[16px] text-[#777] mb-[20px]">You haven't added any products to compare yet.</p>
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