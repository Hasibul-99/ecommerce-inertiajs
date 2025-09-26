import React from 'react'
import { FiHeart, FiEye, FiRepeat, FiShoppingCart } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'

export default function TopSellingProducts() {
    return (
        <section className="gi-product-tab gi-products py-[40px] max-[767px]:py-[30px] wow fadeInUp" data-wow-duration="2s">
            <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                <div className="gi-tab-title w-full inline-flex justify-between px-[12px] max-[991px]:flex-col">
                    <div className="gi-main-title">
                        <div className="section-title mb-[20px] pb-[20px] flex flex-start">
                            <div className="section-detail">
                                <h2 className="gi-title mb-[0] text-[25px] max-[991px]:text-[24px] max-[767px]:text-[22px] max-[575px]:text-[20px] font-semibold text-[#4b5966] relative inline p-[0] capitalize leading-[1] font-manrope tracking-[0.01rem]">New <span className="text-[#5caf90]">Arrivals</span></h2>
                                <p className="max-w-[400px] mt-[10px] text-[14px] text-[#777] leading-[18px] font-light">Shop online for new arrivals and get free shipping!</p>
                            </div>
                        </div>
                    </div>
                    {/* Tab Start */}
                    <div className="gi-pro-tab mt-[40px] max-[991px]:mt-[-20px] max-[991px]:mb-[30px]">
                        <ul className="nav-tabs flex flex-wrap max-[991px]:justify-start" id="myproTab">
                            <li className="active inline-block align-top text-[14px] text-[#777] uppercase p-[0] cursor-pointer font-medium transition-all duration-[0.3s] ease delay-[0s] leading-[20px] tracking-[0.7px] mr-[50px] max-[991px]:mr-[30px] max-[480px]:mr-[20px]">
                                <a className="nav-link relative font-medium p-[0] max-[480px]:text-[13px] max-[480px]:leading-[28px]" href="#all">All</a>
                            </li>
                            <li className="inline-block align-top text-[14px] text-[#777] uppercase p-[0] cursor-pointer font-medium transition-all duration-[0.3s] ease delay-[0s] leading-[20px] tracking-[0.7px] mr-[50px] max-[991px]:mr-[30px] max-[480px]:mr-[20px]">
                                <a className="nav-link relative font-medium p-[0] max-[480px]:text-[13px] max-[480px]:leading-[28px]" href="#snack">Snack &amp; Spices</a>
                            </li>
                            <li className="inline-block align-top text-[14px] text-[#777] uppercase p-[0] cursor-pointer font-medium transition-all duration-[0.3s] ease delay-[0s] leading-[20px] tracking-[0.7px] mr-[50px] max-[991px]:mr-[30px] max-[480px]:mr-[20px]">
                                <a className="nav-link relative font-medium p-[0] max-[480px]:text-[13px] max-[480px]:leading-[28px]" href="#fruit">Fruits</a>
                            </li>
                            <li className="inline-block align-top text-[14px] text-[#777] uppercase p-[0] cursor-pointer font-medium transition-all duration-[0.3s] ease delay-[0s] leading-[20px] tracking-[0.7px]">
                                <a className="nav-link relative font-medium p-[0] max-[480px]:text-[13px] max-[480px]:leading-[28px]" href="#veg">Vegetables</a>
                            </li>
                        </ul>
                    </div>
                    {/* Tab End */}
                </div>
                {/* New Product */}
                <div className="w-full flex flex-wrap mb-[-24px]">
                    <div className="col">
                        <div className="tab-content" id="myproTabContent">
                            {/* 1st Product tab start */}
                            <div className="tab-pro-pane" id="all">
                                <div className="w-full flex flex-wrap">
                                    <div className="min-[1200px]:w-[20%] min-[768px]:w-[33.33%] min-[576px]:w-[50%] max-[575px]:w-[50%] max-[420px]:w-full px-[12px]">
                                        <div className="gi-product-content h-full pb-[24px] flex">
                                            <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                <div className="gi-pro-image-outer transition-all duration-[0.3s] delay-[0s] ease z-[11] relative">
                                                    <div className="gi-pro-image overflow-hidden">
                                                        <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none">
                                                            <span className="label veg max-[991px]:hidden">
                                                                <span className="dot" />
                                                            </span>
                                                            <img className="main-image max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/3_1.jpg" alt="Product" />
                                                            <img className="hover-image absolute z-[1] top-[0] left-[0] opacity-[0] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/3_1.jpg" alt="Product" />
                                                        </a>
                                                        <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                            <span className="sale px-[10px] py-[5px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#ff7070] text-[#fff] tracking-[0.5px] relative rounded-[5px]">Sale</span>
                                                        </span>
                                                        <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-0">
                                                            <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Wishlist">
                                                                <FiHeart className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                            </a>
                                                            <a href="javascript:void(0)" className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] modal-toggle">
                                                                <FiEye className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                            </a>
                                                            <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Compare">
                                                                <FiRepeat className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                            </a>
                                                            <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                                <FiShoppingCart className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="gi-pro-content h-full p-[20px] relative z-[10] flex flex-col text-left border-t-[1px] border-solid border-[#eee]">
                                                    <a href="shop-left-sidebar-col-3.html">
                                                        <h6 className="gi-pro-stitle mb-[10px] font-normal text-[#999] text-[13px] leading-[1.2] capitalize">Dried Fruits</h6>
                                                    </a>
                                                    <h5 className="gi-pro-title h-full mb-[10px] text-[16px]"><a href="product-left-sidebar.html" className="block text-[14px] leading-[22px] font-normal text-[#4b5966] tracking-[0.85px] capitalize font-Poppins hover:text-[#5caf90]">Californian
                                                        Almonds Value 250g + 50g Pack</a></h5>
                                                    <div className="gi-pro-rat-price mt-[5px] mb-[0] flex flex-col">
                                                        <span className="gi-pro-rating mb-[10px] opacity-[0.7] relative">
                                                            <FaStar className="fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                            <FaStar className="fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                            <FaStar className="fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                            <FaStar className="text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                            <FaStar className="text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        </span>
                                                        <span className="gi-price">
                                                            <span className="new-price text-[#4b5966] font-bold text-[14px] mr-[7px]">$58.00</span>
                                                            <span className="old-price text-[14px] text-[#777] line-through">$65.00</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-[1200px]:w-[20%] min-[768px]:w-[33.33%] min-[576px]:w-[50%] max-[575px]:w-[50%] max-[420px]:w-full px-[12px]">
                                        <div className="gi-product-content h-full pb-[24px] flex">
                                            <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                <div className="gi-pro-image-outer transition-all duration-[0.3s] delay-[0s] ease z-[11] relative">
                                                    <div className="gi-pro-image overflow-hidden">
                                                        <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none">
                                                            <span className="label veg max-[991px]:hidden">
                                                                <span className="dot" />
                                                            </span>
                                                            <img className="main-image max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/2_1.jpg" alt="Product" />
                                                            <img className="hover-image absolute z-[1] top-[0] left-[0] opacity-[0] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/2_2.jpg" alt="Product" />
                                                        </a>
                                                        <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                            <span className="sale px-[10px] py-[5px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#ff7070] text-[#fff] tracking-[0.5px] relative rounded-[5px]">Sale</span>
                                                        </span>
                                                        <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-0">
                                                            <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Wishlist">
                                                                <FiHeart className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                            </a>
                                                            <a href="javascript:void(0)" className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] modal-toggle">
                                                                <FiEye className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                            </a>
                                                            <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Compare">
                                                                <FiRepeat className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                            </a>
                                                            <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                                <FiShoppingCart className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="gi-pro-content h-full p-[20px] relative z-[10] flex flex-col text-left border-t-[1px] border-solid border-[#eee]">
                                                    <a href="shop-left-sidebar-col-3.html">
                                                        <h6 className="gi-pro-stitle mb-[10px] font-normal text-[#999] text-[13px] leading-[1.2] capitalize">Dried Fruits</h6>
                                                    </a>
                                                    <h5 className="gi-pro-title h-full mb-[10px] text-[16px]"><a href="product-left-sidebar.html" className="block text-[14px] leading-[22px] font-normal text-[#4b5966] tracking-[0.85px] capitalize font-Poppins hover:text-[#5caf90]">Dates Value
                                                        Pouch Dates Value Pouch</a></h5>
                                                    <div className="gi-pro-rat-price mt-[5px] mb-[0] flex flex-col">
                                                        <span className="gi-pro-rating mb-[10px] opacity-[0.7] relative">
                                                            <FaStar className="fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                            <FaStar className="fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                            <FaStar className="fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                            <FaStar className="text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                            <FaStar className="text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        </span>
                                                        <span className="gi-price">
                                                            <span className="new-price text-[#4b5966] font-bold text-[14px] mr-[7px]">$78.00</span>
                                                            <span className="old-price text-[14px] text-[#777] line-through">$85.00</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
