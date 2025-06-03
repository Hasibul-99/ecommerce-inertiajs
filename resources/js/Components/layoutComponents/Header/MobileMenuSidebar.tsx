import React, { Fragment } from 'react'

export default function MobileMenuSidebar() {
    return (
        <Fragment>
            <div className="gi-mobile-menu-overlay hidden w-full h-screen fixed top-[0] left-[0] bg-[#000000cc] z-[16]" />
            <div id="gi-mobile-menu" className="gi-mobile-menu transition-all duration-[0.3s] ease-in-out w-[340px] h-full pt-[15px] pb-[20px] px-[20px] fixed top-[0] right-[auto] left-[0] bg-[#fff] flex flex-col z-[17] overflow-auto max-[480px]:w-[300px]">
                <div className="gi-menu-title w-full pb-[10px] flex flex-wrap justify-between">
                    <span className="menu_title flex items-center text-[16px] text-[#4b5966] font-semibold">My Menu</span>
                    <button type="button" className="gi-close-menu relative text-[30px] leading-[1] text-[#777] bg-transparent border-0 mx-[5px]">×</button>
                </div>
                <div className="gi-menu-inner">
                    <div className="gi-menu-content">
                        <ul>
                            <li className="dropdown relative drop-list">
                                <a href="javascript:void(0)" className="dropdown-arrow mb-[12px] p-[12px] block capitalize text-[#777] border-[1px] border-solid border-[#eee] rounded-[5px] text-[15px] font-medium">Home</a>
                                <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                    <li><a href="index.html" className="mb-[0] pl-[15px] py-[12px] pr-[0] capitalize block text-[14px] font-normal text-[#777]">Grocery</a></li>
                                    <li><a href="demo-2.html" className="mb-[0] pl-[15px] py-[12px] pr-[0] capitalize block text-[14px] font-normal text-[#777]">Fashion</a></li>
                                    <li><a href="demo-3.html" className="mb-[0] pl-[15px] py-[12px] pr-[0] capitalize block text-[14px] font-normal text-[#777]">Fashion 2</a></li>
                                </ul>
                            </li>
                            <li className="relative">
                                <a href="javascript:void(0)" className="dropdown-arrow mb-[12px] p-[12px] block capitalize text-[#777] border-[1px] border-solid border-[#eee] rounded-[5px] text-[15px] font-medium">Categories</a>
                                <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                    <li className="relative">
                                        <a href="javascript:void(0)" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Classic Variation</a>
                                        <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                            <li><a href="shop-left-sidebar-col-3.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Left sidebar 3 column</a></li>
                                            <li><a href="shop-left-sidebar-col-4.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Left sidebar 4 column</a></li>
                                            <li><a href="shop-right-sidebar-col-3.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Right sidebar 3 column</a></li>
                                            <li><a href="shop-right-sidebar-col-4.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Right sidebar 4 column</a></li>
                                            <li><a href="shop-full-width.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Full width 4 column</a></li>
                                        </ul>
                                    </li>
                                    <li className="relative">
                                        <a href="javascript:void(0)" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Classic Variation</a>
                                        <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                            <li><a href="shop-banner-left-sidebar-col-3.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Banner left sidebar 3 column</a></li>
                                            <li><a href="shop-banner-left-sidebar-col-4.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Banner left sidebar 4 column</a></li>
                                            <li><a href="shop-banner-right-sidebar-col-3.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Banner right sidebar 3 column</a></li>
                                            <li><a href="shop-banner-right-sidebar-col-4.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Banner right sidebar 4 column</a></li>
                                            <li><a href="shop-banner-full-width.html" className="pl-[30px] py-[12px] text-[14px] block text-[#999] font-normal">Banner Full width 4 column</a></li>
                                        </ul>
                                    </li>
                                    <li className="relative">
                                        <a href="javascript:void(0)" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Columns Variation</a>
                                        <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                            <li><a href="shop-full-width-col-3.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">3 Columns full width</a></li>
                                            <li><a href="shop-full-width-col-4.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">4 Columns full width</a></li>
                                            <li><a href="shop-full-width-col-5.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">5 Columns full width</a></li>
                                            <li><a href="shop-full-width-col-6.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">6 Columns full width</a></li>
                                            <li><a href="shop-banner-full-width-col-3.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Banner 3 Columns</a></li>
                                        </ul>
                                    </li>
                                    <li className="relative">
                                        <a href="javascript:void(0)" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">List Variation</a>
                                        <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                            <li><a href="shop-list-left-sidebar.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Shop left sidebar</a></li>
                                            <li><a href="shop-list-right-sidebar.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Shop right sidebar</a></li>
                                            <li><a href="shop-list-banner-left-sidebar.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Banner left sidebar</a></li>
                                            <li><a href="shop-list-banner-right-sidebar.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Banner right sidebar</a></li>
                                            <li><a href="shop-list-full-col-2.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Full width 2 columns</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <a href="javascript:void(0)" className="dropdown-arrow mb-[12px] p-[12px] block capitalize text-[#777] border-[1px] border-solid border-[#eee] rounded-[5px] text-[15px] font-medium">Products</a>
                                <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                    <li className="relative">
                                        <a href="javascript:void(0)" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Product page</a>
                                        <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                            <li><a href="product-left-sidebar.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Product left sidebar</a></li>
                                            <li><a href="product-right-sidebar.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">Product right sidebar</a></li>
                                        </ul>
                                    </li>
                                    <li className="relative">
                                        <a href="javascript:void(0)" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Product accordion</a>
                                        <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                            <li><a href="product-accordion-left-sidebar.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">left sidebar</a></li>
                                            <li><a href="product-accordion-right-sidebar.html" className="pl-[30px] py-[12px] block text-[14px] text-[#999] font-normal">right sidebar</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="product-full-width.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">product full width</a></li>
                                    <li><a href="product-accordion-full-width.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">accordion full width</a></li>
                                </ul>
                            </li>
                            <li className="dropdown relative">
                                <a href="javascript:void(0)" className="dropdown-arrow mb-[12px] p-[12px] block capitalize text-[#777] border-[1px] border-solid border-[#eee] rounded-[5px] text-[15px] font-medium">Blog</a>
                                <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                    <li><a href="blog-left-sidebar.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Blog left sidebar</a></li>
                                    <li><a href="blog-right-sidebar.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Blog right sidebar</a></li>
                                    <li><a href="blog-detail-left-sidebar.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Blog detail left sidebar</a></li>
                                    <li><a href="blog-detail-right-sidebar.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Blog detail right sidebar</a></li>
                                    <li><a href="blog-full-width.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Blog full width</a></li>
                                    <li><a href="blog-detail-full-width.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Blog detail full width</a></li>
                                </ul>
                            </li>
                            <li className="relative">
                                <a href="javascript:void(0)" className="dropdown-arrow p-[12px] block capitalize text-[#777] border-[1px] border-solid border-[#eee] rounded-[5px] text-[15px] font-medium">Others</a>
                                <ul className="sub-menu w-full min-w-[auto] p-0 mb-[10px] static hidden visible transition-none opacity-[1]">
                                    <li><a href="about-us.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">About Us</a></li>
                                    <li><a href="contact-us.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Contact Us</a></li>
                                    <li><a href="cart.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Cart</a></li>
                                    <li><a href="checkout.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Checkout</a></li>
                                    <li><a href="compare.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Compare</a></li>
                                    <li><a href="faq.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">FAQ</a></li>
                                    <li><a href="login.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Login</a></li>
                                    <li><a href="register.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Register</a></li>
                                    <li><a href="track-order.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Track Order</a></li>
                                    <li><a href="terms-condition.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Terms Condition</a></li>
                                    <li><a href="privacy-policy.html" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Privacy Policy</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className="header-res-lan-curr">
                        {/* Social Start */}
                        <div className="header-res-social mt-[30px]">
                            <div className="header-top-social">
                                <ul className="flex flex-row justify-center">
                                    <li className="list-inline-item h-[30px] w-[30px] flex items-center justify-center bg-[#4b5966] rounded-[5px] mr-[15px]">
                                        <a href="#"><i className="gicon gi-facebook text-[#fff]" /></a>
                                    </li>
                                    <li className="list-inline-item h-[30px] w-[30px] flex items-center justify-center bg-[#4b5966] rounded-[5px] mr-[15px]">
                                        <a href="#"><i className="gicon gi-twitter text-[#fff]" /></a>
                                    </li>
                                    <li className="list-inline-item h-[30px] w-[30px] flex items-center justify-center bg-[#4b5966] rounded-[5px] mr-[15px]">
                                        <a href="#"><i className="gicon gi-instagram text-[#fff]" /></a>
                                    </li>
                                    <li className="list-inline-item h-[30px] w-[30px] flex items-center justify-center bg-[#4b5966] rounded-[5px]">
                                        <a href="#"><i className="gicon gi-linkedin text-[#fff]" /></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Social End */}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
