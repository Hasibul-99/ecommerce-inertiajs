import Guest from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

export default function Welcome({ featuredProducts }) {
    return (
        <>
            <Head title="Welcome" />
            <Guest>
                <section className="gi-hero-section py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            <div className="w-full px-[12px]">
                                <div className="gi-hero-banner relative overflow-hidden rounded-[5px]">
                                    <div className="gi-hero-banner-content absolute top-[50%] translate-y-[-50%] left-[30px] max-[767px]:left-[15px]">
                                        <span className="gi-hero-banner-subtitle text-[16px] text-[#777] font-normal block mb-[15px] max-[767px]:mb-[10px] max-[767px]:text-[14px]">Fresh & Healthy</span>
                                        <h1 className="gi-hero-banner-title text-[40px] text-[#333] font-semibold mb-[15px] max-[767px]:mb-[10px] max-[767px]:text-[24px]">Organic Vegetables</h1>
                                        <p className="gi-hero-banner-desc text-[16px] text-[#777] font-normal mb-[25px] max-[767px]:mb-[15px] max-[767px]:text-[14px]">Free shipping on all your orders.</p>
                                        <Link href={route('products.index')} className="gi-hero-banner-btn text-[14px] text-[#fff] font-medium bg-[#5caf90] py-[10px] px-[30px] rounded-[5px] inline-block hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out">Shop Now</Link>
                                    </div>
                                    <div className="gi-hero-banner-img">
                                        <img src="/assets/img/banner/hero-banner.jpg" alt="Hero Banner" className="w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Products Section */}
                <section className="gi-featured-products py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            <div className="w-full px-[12px] mb-[30px]">
                                <div className="gi-section-title text-center">
                                    <h2 className="text-[30px] text-[#333] font-semibold mb-[15px] max-[767px]:text-[24px]">Featured Products</h2>
                                    <p className="text-[16px] text-[#777] font-normal max-[767px]:text-[14px]">Browse our selection of top products</p>
                                </div>
                            </div>
                            
                            {featuredProducts && featuredProducts.map(product => (
                                <div key={product.id} className="min-[1200px]:w-[25%] min-[992px]:w-[33.33%] min-[768px]:w-[50%] min-[576px]:w-[50%] max-[420px]:w-full px-[12px] gi-product-box max-[575px]:w-[50%] max-[575px]:mx-auto pro-gl-content">
                                    <div className="gi-product-content pb-[24px] h-full flex">
                                        <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                            <div className="gi-pro-image-outer transition-all duration-[0.3s] ease delay-[0s] z-[11] relative">
                                                <div className="gi-pro-image overflow-hidden">
                                                    <Link href={route('product.detail', product.slug)} className="image relative block overflow-hidden transition-all duration-[0.3s] ease-in-out">
                                                        <img 
                                                            className="main-image max-w-full z-[1] transition-all duration-[0.3s] ease delay-[0s]" 
                                                            src={product.image ? `/storage/${product.image}` : '/assets/img/placeholder.jpg'} 
                                                            alt={product.name} 
                                                        />
                                                    </Link>
                                                    {product.sale_price && (
                                                        <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                            <span className="sale py-[5px] px-[10px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#ff7070] text-[#fff] tracking-[0.5px] relative rounded-[5px]">Sale</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="gi-pro-content p-[20px]">
                                                <h5 className="gi-pro-title text-[16px] font-medium text-[#444] mb-[5px] leading-[1.5]">
                                                    <Link href={route('product.detail', product.slug)}>{product.name}</Link>
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
                                                        {product.sale_price ? (
                                                            <span className="gi-price flex items-center">
                                                                <span className="new-price text-[#5caf90] text-[16px] font-medium mr-[10px]">${product.sale_price}</span>
                                                                <span className="old-price text-[#777] text-[14px] font-normal line-through">${product.price}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="gi-price flex items-center">
                                                                <span className="new-price text-[#5caf90] text-[16px] font-medium">${product.price}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="w-full px-[12px] mt-[30px] text-center">
                                <Link href={route('products.index')} className="gi-btn-primary text-[14px] text-[#fff] font-medium bg-[#5caf90] py-[10px] px-[30px] rounded-[5px] inline-block hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out">View All Products</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Guest>
        </>
    )
}