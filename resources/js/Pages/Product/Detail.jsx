import Guest from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import React, { useState } from 'react'

export default function Detail({ product, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    
    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };
    
    const decrementQuantity = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : 1);
    };

    return (
        <>
            <Head title={product.name} />
            <Guest>
                <section className="gi-product-detail py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            {/* Breadcrumb */}
                            <div className="w-full px-[12px] mb-[30px]">
                                <div className="gi-breadcrumb flex flex-wrap items-center">
                                    <Link href={route('welcome')} className="text-[14px] text-[#777] hover:text-[#5caf90]">Home</Link>
                                    <span className="mx-[5px]">/</span>
                                    <Link href={route('products.index')} className="text-[14px] text-[#777] hover:text-[#5caf90]">Products</Link>
                                    <span className="mx-[5px]">/</span>
                                    <span className="text-[14px] text-[#5caf90]">{product.name}</span>
                                </div>
                            </div>
                            
                            {/* Product Detail */}
                            <div className="w-full px-[12px]">
                                <div className="gi-product-detail-wrap flex flex-wrap">
                                    {/* Product Image */}
                                    <div className="min-[992px]:w-[50%] w-full px-[12px]">
                                        <div className="gi-product-image-wrap">
                                            <div className="gi-product-image">
                                                <img 
                                                    src={product.image ? `/storage/${product.image}` : '/assets/img/placeholder.jpg'} 
                                                    alt={product.name} 
                                                    className="w-full rounded-[5px]" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="min-[992px]:w-[50%] w-full px-[12px]">
                                        <div className="gi-product-info p-[30px] max-[767px]:p-[15px]">
                                            <h1 className="gi-product-title text-[30px] text-[#333] font-semibold mb-[15px] max-[767px]:text-[24px]">
                                                {product.name}
                                            </h1>
                                            
                                            <div className="gi-product-rating flex items-center mb-[15px]">
                                                <span className="gi-rating-wrap text-[#777] text-[14px] flex items-center">
                                                    <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                    <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                    <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                    <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                    <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                    <span className="ml-[5px]">(5)</span>
                                                </span>
                                            </div>
                                            
                                            <div className="gi-product-price mb-[15px]">
                                                {product.sale_price ? (
                                                    <span className="gi-price flex items-center">
                                                        <span className="new-price text-[#5caf90] text-[24px] font-medium mr-[10px]">${product.sale_price}</span>
                                                        <span className="old-price text-[#777] text-[18px] font-normal line-through">${product.price}</span>
                                                    </span>
                                                ) : (
                                                    <span className="gi-price flex items-center">
                                                        <span className="new-price text-[#5caf90] text-[24px] font-medium">${product.price}</span>
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="gi-product-desc mb-[20px]">
                                                <p className="text-[16px] text-[#777] font-normal">
                                                    {product.description}
                                                </p>
                                            </div>
                                            
                                            <div className="gi-product-stock mb-[20px]">
                                                <span className="text-[16px] text-[#333] font-medium">
                                                    Availability: 
                                                    <span className="text-[#5caf90] ml-[5px]">
                                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                </span>
                                            </div>
                                            
                                            {product.stock > 0 && (
                                                <div className="gi-product-quantity mb-[20px] flex items-center">
                                                    <span className="text-[16px] text-[#333] font-medium mr-[15px]">Quantity:</span>
                                                    <div className="gi-quantity-wrap flex items-center border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                        <button 
                                                            type="button" 
                                                            className="gi-quantity-btn h-[40px] w-[40px] flex items-center justify-center text-[#777] text-[20px] border-[0] bg-transparent cursor-pointer"
                                                            onClick={decrementQuantity}
                                                        >
                                                            -
                                                        </button>
                                                        <input 
                                                            type="text" 
                                                            className="gi-quantity-input h-[40px] w-[40px] text-center text-[16px] text-[#333] border-[0] bg-transparent outline-none" 
                                                            value={quantity} 
                                                            readOnly 
                                                        />
                                                        <button 
                                                            type="button" 
                                                            className="gi-quantity-btn h-[40px] w-[40px] flex items-center justify-center text-[#777] text-[20px] border-[0] bg-transparent cursor-pointer"
                                                            onClick={incrementQuantity}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="gi-product-actions flex flex-wrap items-center">
                                                <button 
                                                    type="button" 
                                                    className="gi-btn-primary text-[14px] text-[#fff] font-medium bg-[#5caf90] py-[10px] px-[30px] rounded-[5px] inline-block hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out mr-[10px] mb-[10px]"
                                                    disabled={product.stock <= 0}
                                                >
                                                    Add to Cart
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="gi-btn-secondary text-[14px] text-[#333] font-medium bg-transparent py-[10px] px-[30px] rounded-[5px] inline-block border-[1px] border-solid border-[#eee] hover:bg-[#5caf90] hover:text-[#fff] hover:border-[#5caf90] transition-all duration-[0.3s] ease-in-out mr-[10px] mb-[10px]"
                                                >
                                                    Add to Wishlist
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="gi-btn-secondary text-[14px] text-[#333] font-medium bg-transparent py-[10px] px-[30px] rounded-[5px] inline-block border-[1px] border-solid border-[#eee] hover:bg-[#5caf90] hover:text-[#fff] hover:border-[#5caf90] transition-all duration-[0.3s] ease-in-out mb-[10px]"
                                                >
                                                    Add to Compare
                                                </button>
                                            </div>
                                            
                                            {product.category && (
                                                <div className="gi-product-meta mt-[20px] pt-[20px] border-t-[1px] border-solid border-[#eee]">
                                                    <span className="text-[16px] text-[#333] font-medium">
                                                        Category: 
                                                        <Link 
                                                            href={route('products.index', { category: product.category.slug })}
                                                            className="text-[#5caf90] ml-[5px] hover:underline"
                                                        >
                                                            {product.category.name}
                                                        </Link>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Related Products */}
                            {relatedProducts && relatedProducts.length > 0 && (
                                <div className="w-full px-[12px] mt-[50px]">
                                    <div className="gi-section-title mb-[30px]">
                                        <h2 className="text-[24px] text-[#333] font-semibold">Related Products</h2>
                                    </div>
                                    
                                    <div className="gi-related-products flex flex-wrap mx-[-12px]">
                                        {relatedProducts.map(relatedProduct => (
                                            <div key={relatedProduct.id} className="min-[1200px]:w-[25%] min-[992px]:w-[33.33%] min-[768px]:w-[50%] min-[576px]:w-[50%] max-[420px]:w-full px-[12px] gi-product-box max-[575px]:w-[50%] max-[575px]:mx-auto pro-gl-content">
                                                <div className="gi-product-content pb-[24px] h-full flex">
                                                    <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                        <div className="gi-pro-image-outer transition-all duration-[0.3s] ease delay-[0s] z-[11] relative">
                                                            <div className="gi-pro-image overflow-hidden">
                                                                <Link href={route('product.detail', relatedProduct.slug)} className="image relative block overflow-hidden transition-all duration-[0.3s] ease-in-out">
                                                                    <img 
                                                                        className="main-image max-w-full z-[1] transition-all duration-[0.3s] ease delay-[0s]" 
                                                                        src={relatedProduct.image ? `/storage/${relatedProduct.image}` : '/assets/img/placeholder.jpg'} 
                                                                        alt={relatedProduct.name} 
                                                                    />
                                                                </Link>
                                                                {relatedProduct.sale_price && (
                                                                    <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                                        <span className="sale py-[5px] px-[10px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#ff7070] text-[#fff] tracking-[0.5px] relative rounded-[5px]">Sale</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="gi-pro-content p-[20px]">
                                                            <h5 className="gi-pro-title text-[16px] font-medium text-[#444] mb-[5px] leading-[1.5]">
                                                                <Link href={route('product.detail', relatedProduct.slug)}>{relatedProduct.name}</Link>
                                                            </h5>
                                                            <div className="gi-pro-rat-price flex flex-wrap justify-between items-center">
                                                                <div className="gi-pro-ratting flex items-center">
                                                                    <span className="gi-rating-wrap text-[#777] text-[14px] flex items-center">
                                                                        <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                                        <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                                        <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                                        <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                                        <i className="fi-rs-star text-[#ffde0d] mr-[1px]" />
                                                                        <span className="ml-[5px]">(5)</span>
                                                                    </span>
                                                                </div>
                                                                <div className="gi-pro-price">
                                                                    {relatedProduct.sale_price ? (
                                                                        <span className="gi-price flex items-center">
                                                                            <span className="new-price text-[#5caf90] text-[16px] font-medium mr-[10px]">${relatedProduct.sale_price}</span>
                                                                            <span className="old-price text-[#777] text-[14px] font-normal line-through">${relatedProduct.price}</span>
                                                                        </span>
                                                                    ) : (
                                                                        <span className="gi-price flex items-center">
                                                                            <span className="new-price text-[#5caf90] text-[16px] font-medium">${relatedProduct.price}</span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </Guest>
        </>
    )
}