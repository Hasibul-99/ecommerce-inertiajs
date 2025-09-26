import React, { Fragment } from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Link } from '@inertiajs/react'

export default function MobileMenuSidebar() {
    return (
        <Fragment>
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
                                <li><Link href="/about-us" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">About Us</Link></li>
                                <li><Link href="/contact-us" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Contact Us</Link></li>
                                <li><Link href="/cart" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Cart</Link></li>
                                <li><Link href="/checkout" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Checkout</Link></li>
                                <li><Link href="/compare" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Compare</Link></li>
                                <li><Link href="/faq" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">FAQ</Link></li>
                                <li><Link href="/login" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Login</Link></li>
                                <li><Link href="/register" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Register</Link></li>
                                <li><Link href="/track-order" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Track Order</Link></li>
                                <li><Link href="/terms-condition" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Terms Condition</Link></li>
                                <li><Link href="/privacy-policy" className="mb-[0] pl-[15px] pr-[0] py-[12px] capitalize block text-[14px] font-normal text-[#777]">Privacy Policy</Link></li>
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
                                    <button className="bg-transparent border-0 p-0"><FaFacebook className="text-[#fff]" /></button>
                                </li>
                                <li className="list-inline-item h-[30px] w-[30px] flex items-center justify-center bg-[#4b5966] rounded-[5px] mr-[15px]">
                                    <button className="bg-transparent border-0 p-0"><FaTwitter className="text-[#fff]" /></button>
                                </li>
                                <li className="list-inline-item h-[30px] w-[30px] flex items-center justify-center bg-[#4b5966] rounded-[5px] mr-[15px]">
                                    <button className="bg-transparent border-0 p-0"><FaInstagram className="text-[#fff]" /></button>
                                </li>
                                <li className="list-inline-item h-[30px] w-[30px] flex items-center justify-center bg-[#4b5966] rounded-[5px]">
                                    <button className="bg-transparent border-0 p-0"><FaLinkedin className="text-[#fff]" /></button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Social End */}
                </div>
            </div>
        </Fragment>
    )
}
