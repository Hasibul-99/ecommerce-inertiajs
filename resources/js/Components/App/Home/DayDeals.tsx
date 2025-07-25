import React from 'react'

export default function DayDeals() {
    return (
        <section className="gi-deal-section py-[40px] max-[767px]:py-[30px] wow fadeInUp" data-wow-duration="2s">
            <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                <div className="w-full flex flex-wrap px-[12px] overflow-hidden">
                    <div className="gi-deal-section w-full">
                        <div className="gi-products">
                            <div className="section-title mb-[20px] relative flex justify-between pb-[20px] z-[5] max-[767px]:flex-col" data-aos="fade-up" data-aos-duration={2000} data-aos-delay={200}>
                                <div className="section-detail">
                                    <h2 className="gi-title mb-[0] text-[25px] font-semibold text-[#4b5966] relative inline p-[0] capitalize leading-[1] font-manrope max-[991px]:text-[24px] max-[767px]:text-[22px] max-[575px]:text-[20px]">Day of the <span className="text-[#5caf90]">deal</span></h2>
                                    <p className="max-w-[400px] mt-[10px] text-[14px] text-[#777] leading-[18px]">Don't wait. The time will never be just right.</p>
                                </div>
                                <div id="dealend" className="dealend-timer max-[767px]:mt-[15px]" />
                            </div>
                            <div className="gi-deal-block mx-[-12px]" data-aos="fade-up" data-aos-duration={2000} data-aos-delay={300}>
                                <div className="deal-slick-carousel flex gi-product-slider">
                                    <div className="gi-product-content h-full px-[12px] flex">
                                        <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                            <div className="gi-pro-image-outer transition-all duration-[0.3s] delay-[0s] ease z-[11] relative">
                                                <div className="gi-pro-image overflow-hidden">
                                                    <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none">
                                                        <span className="label veg max-[991px]:hidden">
                                                            <span className="dot" />
                                                        </span>
                                                        <img className="main-image max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/6_1.jpg" alt="Product" />
                                                        <img className="hover-image absolute z-[1] top-[0] left-[0] opacity-[0] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/6_2.jpg" alt="Product" />
                                                    </a>
                                                    <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                        <span className="sale px-[10px] py-[5px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#ff7070] text-[#fff] tracking-[0.5px] relative rounded-[5px]">Sale</span>
                                                    </span>
                                                    <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-0">
                                                        <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Wishlist">
                                                            <i className="fi-rr-heart transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] modal-toggle">
                                                            <i className="fi-rr-eye transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Compare">
                                                            <i className="fi fi-rr-arrows-repeat transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                            <i className="fi-rr-shopping-basket transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="gi-pro-content h-full p-[20px] relative z-[10] flex flex-col text-left border-t-[1px] border-solid border-[#eee]">
                                                <a href="shop-left-sidebar-col-3.html">
                                                    <h6 className="gi-pro-stitle mb-[10px] font-normal text-[#999] text-[13px] leading-[1.2] capitalize">Dried Fruits</h6>
                                                </a>
                                                <h5 className="gi-pro-title h-full mb-[10px] text-[16px]">
                                                    <a href="product-left-sidebar.html" className="block text-[14px] leading-[22px] font-normal text-[#4b5966] tracking-[0.85px] capitalize font-Poppins hover:text-[#5caf90]">Mixed Nuts Berries Pack</a>
                                                </h5>
                                                <div className="gi-pro-rat-price mt-[5px] mb-[0] flex flex-col">
                                                    <span className="gi-pro-rating mb-[10px] opacity-[0.7] relative">
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                    </span>
                                                    <span className="gi-price">
                                                        <span className="new-price text-[#4b5966] font-bold text-[14px] mr-[7px]">$45.00</span>
                                                        <span className="old-price text-[14px] text-[#777] line-through">$56.00</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gi-product-content h-full px-[12px] flex">
                                        <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                            <div className="gi-pro-image-outer transition-all duration-[0.3s] delay-[0s] ease z-[11] relative">
                                                <div className="gi-pro-image overflow-hidden">
                                                    <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none">
                                                        <img className="main-image max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/3_1.jpg" alt="Product" />
                                                        <img className="hover-image absolute z-[1] top-[0] left-[0] opacity-[0] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/3_1.jpg" alt="Product" />
                                                    </a>
                                                    <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                        <span className="sale px-[10px] py-[5px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#ff7070] text-[#fff] tracking-[0.5px] relative rounded-[5px]">Sale</span>
                                                    </span>
                                                    <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-0">
                                                        <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Wishlist">
                                                            <i className="fi-rr-heart transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] modal-toggle">
                                                            <i className="fi-rr-eye transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Compare">
                                                            <i className="fi fi-rr-arrows-repeat transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                            <i className="fi-rr-shopping-basket transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="gi-pro-content h-full p-[20px] relative z-[10] flex flex-col text-left border-t-[1px] border-solid border-[#eee]">
                                                <a href="shop-left-sidebar-col-3.html">
                                                    <h6 className="gi-pro-stitle mb-[10px] font-normal text-[#999] text-[13px] leading-[1.2] capitalize">Cookies</h6>
                                                </a>
                                                <h5 className="gi-pro-title h-full mb-[10px] text-[16px]">
                                                    <a href="product-left-sidebar.html" className="block text-[14px] leading-[22px] font-normal text-[#4b5966] tracking-[0.85px] capitalize font-Poppins hover:text-[#5caf90]">Multi Grain Combo Cookies</a>
                                                </h5>
                                                <div className="gi-pro-rat-price mt-[5px] mb-[0] flex flex-col">
                                                    <span className="gi-pro-rating mb-[10px] opacity-[0.7] relative">
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <span className="qty absolute bottom-[0] right-[0] text-[#777] text-[13px]">10 kg</span>
                                                    </span>
                                                    <span className="gi-price">
                                                        <span className="new-price text-[#4b5966] font-bold text-[14px] mr-[7px]">$25.00</span>
                                                        <span className="old-price text-[14px] text-[#777] line-through">$30.00</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gi-product-content h-full px-[12px] flex">
                                        <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                            <div className="gi-pro-image-outer transition-all duration-[0.3s] delay-[0s] ease z-[11] relative">
                                                <div className="gi-pro-image overflow-hidden">
                                                    <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none">
                                                        <span className="label nonveg max-[991px]:hidden">
                                                            <span className="dot" />
                                                        </span>
                                                        <img className="main-image max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/9_1.jpg" alt="Product" />
                                                        <img className="hover-image absolute z-[1] top-[0] left-[0] opacity-[0] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/9_2.jpg" alt="Product" />
                                                    </a>
                                                    <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-0">
                                                        <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Wishlist">
                                                            <i className="fi-rr-heart transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] modal-toggle">
                                                            <i className="fi-rr-eye transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Compare">
                                                            <i className="fi fi-rr-arrows-repeat transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                            <i className="fi-rr-shopping-basket transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="gi-pro-content h-full p-[20px] relative z-[10] flex flex-col text-left border-t-[1px] border-solid border-[#eee]">
                                                <a href="shop-left-sidebar-col-3.html">
                                                    <h6 className="gi-pro-stitle mb-[10px] font-normal text-[#999] text-[13px] leading-[1.2] capitalize">Foods</h6>
                                                </a>
                                                <h5 className="gi-pro-title h-full mb-[10px] text-[16px]">
                                                    <a href="product-left-sidebar.html" className="block text-[14px] leading-[22px] font-normal text-[#4b5966] tracking-[0.85px] capitalize font-Poppins hover:text-[#5caf90]">Fresh Mango juice pack</a>
                                                </h5>
                                                <div className="gi-pro-rat-price mt-[5px] mb-[0] flex flex-col">
                                                    <span className="gi-pro-rating mb-[10px] opacity-[0.7] relative">
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                    </span>
                                                    <span className="gi-price">
                                                        <span className="new-price text-[#4b5966] font-bold text-[14px] mr-[7px]">$49.00</span>
                                                        <span className="old-price text-[14px] text-[#777] line-through">$65.00</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gi-product-content h-full px-[12px] flex">
                                        <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                            <div className="gi-pro-image-outer transition-all duration-[0.3s] delay-[0s] ease z-[11] relative">
                                                <div className="gi-pro-image overflow-hidden">
                                                    <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none">
                                                        <img className="main-image max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/2_1.jpg" alt="Product" />
                                                        <img className="hover-image absolute z-[1] top-[0] left-[0] opacity-[0] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/2_2.jpg" alt="Product" />
                                                    </a>
                                                    <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                        <span className="sale px-[10px] py-[5px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#ff7070] text-[#fff] tracking-[0.5px] relative rounded-[5px]">Sale</span>
                                                    </span>
                                                    <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-0">
                                                        <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Wishlist">
                                                            <i className="fi-rr-heart transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] modal-toggle">
                                                            <i className="fi-rr-eye transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Compare">
                                                            <i className="fi fi-rr-arrows-repeat transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                            <i className="fi-rr-shopping-basket transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="gi-pro-content h-full p-[20px] relative z-[10] flex flex-col text-left border-t-[1px] border-solid border-[#eee]">
                                                <a href="shop-left-sidebar-col-3.html">
                                                    <h6 className="gi-pro-stitle mb-[10px] font-normal text-[#999] text-[13px] leading-[1.2] capitalize">Dried Fruits</h6>
                                                </a>
                                                <h5 className="gi-pro-title h-full mb-[10px] text-[16px]">
                                                    <a href="product-left-sidebar.html" className="block text-[14px] leading-[22px] font-normal text-[#4b5966] tracking-[0.85px] capitalize font-Poppins hover:text-[#5caf90]">Dates Value Fresh Pouch</a>
                                                </h5>
                                                <div className="gi-pro-rat-price mt-[5px] mb-[0] flex flex-col">
                                                    <span className="gi-pro-rating mb-[10px] opacity-[0.7] relative">
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                    </span>
                                                    <span className="gi-price">
                                                        <span className="new-price text-[#4b5966] font-bold text-[14px] mr-[7px]">$78.00</span>
                                                        <span className="old-price text-[14px] text-[#777] line-through">$85.00</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gi-product-content h-full px-[12px] flex">
                                        <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                            <div className="gi-pro-image-outer transition-all duration-[0.3s] delay-[0s] ease z-[11] relative">
                                                <div className="gi-pro-image overflow-hidden">
                                                    <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none">
                                                        <img className="main-image max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/1_1.jpg" alt="Product" />
                                                        <img className="hover-image absolute z-[1] top-[0] left-[0] opacity-[0] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/1_2.jpg" alt="Product" />
                                                    </a>
                                                    <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                        <span className="new sale px-[10px] py-[5px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#5caf90] text-[#fff] tracking-[0.5px] relative rounded-[5px]">New</span>
                                                    </span>
                                                    <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-0">
                                                        <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Wishlist">
                                                            <i className="fi-rr-heart transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] modal-toggle">
                                                            <i className="fi-rr-eye transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Compare">
                                                            <i className="fi fi-rr-arrows-repeat transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                            <i className="fi-rr-shopping-basket transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="gi-pro-content h-full p-[20px] relative z-[10] flex flex-col text-left border-t-[1px] border-solid border-[#eee]">
                                                <a href="shop-left-sidebar-col-3.html">
                                                    <h6 className="gi-pro-stitle mb-[10px] font-normal text-[#999] text-[13px] leading-[1.2] capitalize">Foods</h6>
                                                </a>
                                                <h5 className="gi-pro-title h-full mb-[10px] text-[16px]">
                                                    <a href="product-left-sidebar.html" className="block text-[14px] leading-[22px] font-normal text-[#4b5966] tracking-[0.85px] capitalize font-Poppins hover:text-[#5caf90]">Stick Fiber Masala Magic</a>
                                                </h5>
                                                <div className="gi-pro-rat-price mt-[5px] mb-[0] flex flex-col">
                                                    <span className="gi-pro-rating mb-[10px] opacity-[0.7] relative">
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <span className="qty absolute bottom-[0] right-[0] text-[#777] text-[13px]">2 pack</span>
                                                    </span>
                                                    <span className="gi-price">
                                                        <span className="new-price text-[#4b5966] font-bold text-[14px] mr-[7px]">$45.00</span>
                                                        <span className="old-price text-[14px] text-[#777] line-through">$50.00</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gi-product-content h-full px-[12px] flex">
                                        <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                            <div className="gi-pro-image-outer transition-all duration-[0.3s] delay-[0s] ease z-[11] relative">
                                                <div className="gi-pro-image overflow-hidden">
                                                    <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none">
                                                        <img className="main-image max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/24_1.jpg" alt="Product" />
                                                        <img className="hover-image absolute z-[1] top-[0] left-[0] opacity-[0] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/24_1.jpg" alt="Product" />
                                                    </a>
                                                    <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                        <span className="new sale px-[10px] py-[5px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#5caf90] text-[#fff] tracking-[0.5px] relative rounded-[5px]">New</span>
                                                    </span>
                                                    <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-0">
                                                        <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Wishlist">
                                                            <i className="fi-rr-heart" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] modal-toggle">
                                                            <i className="fi-rr-eye transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Compare">
                                                            <i className="fi fi-rr-arrows-repeat transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                            <i className="fi-rr-shopping-basket transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="gi-pro-content h-full p-[20px] relative z-[10] flex flex-col text-left border-t-[1px] border-solid border-[#eee]">
                                                <a href="shop-left-sidebar-col-3.html">
                                                    <h6 className="gi-pro-stitle mb-[10px] font-normal text-[#999] text-[13px] leading-[1.2] capitalize">Fresh Fruit</h6>
                                                </a>
                                                <h5 className="gi-pro-title h-full mb-[10px] text-[16px]">
                                                    <a href="product-left-sidebar.html" className="block text-[14px] leading-[22px] font-normal text-[#4b5966] tracking-[0.85px] capitalize font-Poppins hover:text-[#5caf90]">Natural Hub Cherry Karonda</a>
                                                </h5>
                                                <div className="gi-pro-rat-price mt-[5px] mb-[0] flex flex-col">
                                                    <span className="gi-pro-rating mb-[10px] opacity-[0.7] relative">
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <span className="qty absolute bottom-[0] right-[0] text-[#777] text-[13px]">1 kg</span>
                                                    </span>
                                                    <span className="gi-price">
                                                        <span className="new-price text-[#4b5966] font-bold text-[14px] mr-[7px]">$20.00</span>
                                                        <span className="old-price text-[14px] text-[#777] line-through">$21.00</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gi-product-content h-full px-[12px] flex">
                                        <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                            <div className="gi-pro-image-outer transition-all duration-[0.3s] delay-[0s] ease z-[11] relative">
                                                <div className="gi-pro-image overflow-hidden">
                                                    <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none">
                                                        <img className="main-image max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/17_1.jpg" alt="Product" />
                                                        <img className="hover-image absolute z-[1] top-[0] left-[0] opacity-[0] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/17_1.jpg" alt="Product" />
                                                    </a>
                                                    <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-0">
                                                        <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Wishlist">
                                                            <i className="fi-rr-heart transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] modal-toggle">
                                                            <i className="fi-rr-eye transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]" title="Compare">
                                                            <i className="fi fi-rr-arrows-repeat transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                        <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out h-[30px] w-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                            <i className="fi-rr-shopping-basket transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="gi-pro-content h-full p-[20px] relative z-[10] flex flex-col text-left border-t-[1px] border-solid border-[#eee]">
                                                <a href="shop-left-sidebar-col-3.html">
                                                    <h6 className="gi-pro-stitle mb-[10px] font-normal text-[#999] text-[13px] leading-[1.2] capitalize">Tuber root</h6>
                                                </a>
                                                <h5 className="gi-pro-title h-full mb-[10px] text-[16px]">
                                                    <a href="product-left-sidebar.html" className="block text-[14px] leading-[22px] font-normal text-[#4b5966] tracking-[0.85px] capitalize font-Poppins hover:text-[#5caf90]">Fresh Organic Ginger Pack</a>
                                                </h5>
                                                <div className="gi-pro-rat-price mt-[5px] mb-[0] flex flex-col">
                                                    <span className="gi-pro-rating mb-[10px] opacity-[0.7] relative">
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star fill text-[14px] text-[#f27d0c] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <i className="gicon gi-star text-[14px] text-[#777] mr-[3px] float-left mr-[3px]" />
                                                        <span className="qty absolute bottom-[0] right-[0] text-[#777] text-[13px]">100 g</span>
                                                    </span>
                                                    <span className="gi-price">
                                                        <span className="new-price text-[#4b5966] font-bold text-[14px] mr-[7px]">$2.00</span>
                                                        <span className="old-price text-[14px] text-[#777] line-through">$3.00</span>
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
        </section>

    )
}
