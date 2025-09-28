import React from 'react'
import { FiMenu, FiUser, FiHeart, FiShoppingBag, FiPhoneCall, FiChevronDown } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { Link } from '@inertiajs/react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet"
import MobileMenuSidebar from './MobileMenuSidebar'


export default function TopHeader() {
    return (
        <div className="header-top py-[10px] text-[#777] bg-[#f8f8fb]">
            <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                <div className="w-full flex flex-wrap px-[12px]">
                    {/* Header Top social Start */}
                    <div className="grow-[1] shrink-[0] basis-[0%] min-[992px]:block max-[767px]:hidden">
                        <div className="header-top-social">
                            <ul className="mb-[0] p-[0] flex">
                                <li className="list-inline-item transition-all duration-[0.3s] ease-in-out flex text-[13px] mr-[15px]">
                                    <button className="mx-[5px] text-center flex items-center justify-center text-[15px] bg-transparent border-0">
                                        <FiPhoneCall className="transition-all duration-[0.3s] ease-in-out text-[#777]" />
                                    </button>
                                    +91 987 654 3210
                                </li>
                                <li className="list-inline-item transition-all duration-[0.3s] ease-in-out flex text-[13px]">
                                    <button className="mx-[5px] text-center flex items-center justify-center text-[15px] bg-transparent border-0">
                                        <FaWhatsapp className="transition-all duration-[0.3s] ease-in-out text-[#777]" />
                                    </button>
                                    +91 987 654 3210
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Header Top social End */}
                    {/* Header Top Message Start */}
                    <div className="grow-[1] shrink-[0] basis-[0%] text-center max-[1199px]:hidden">
                        <div className="header-top-message text-[13px]">
                            World's Fastest Online Shopping Destination
                        </div>
                    </div>
                    {/* Header Top Message End */}
                    {/* Header Top Language Currency */}
                    <div className="grow-[1] shrink-[0] basis-[0%] hidden min-[992px]:block">
                        <div className="header-top-right-inner flex justify-end">
                            <Link className="gi-help pl-[20px] text-[13px] text-[#777] tracking-[0.7px] font-normal hover:text-[#5caf90]" href="/faq">Help?</Link>
                            <Link className="gi-help pl-[20px] text-[13px] text-[#777] tracking-[0.7px] font-normal hover:text-[#5caf90]" href="/track-order">Track Order?</Link>
                            {/* Language Start */}
                            <div className="header-top-lan-curr header-top-lan dropdown pl-[20px] flex flex-wrap relative">
                                <button type="button" className="dropdown-toggle text-[13px] flex items-center p-[0] transition-all duration-[0.3s] ease delay-0 text-[#777] border-[0] tracking-[0.7px]">English
                                    <FiChevronDown className="text-[14px] ml-[5px] text-[#777] transition-all duration-[0.3s] ease delay-0 flex" />
                                </button>
                                <ul className="hidden dropdown-menu absolute top-[32px] left-[auto] right-[0] min-w-[130px] truncate px-[10px] bg-[#fff] z-[1] rounded-[5px] border-[1px] border-solid border-[#eee]">
                                    <li className="active border-b-[1px] border-solid border-[#eee] leading-[1.5] py-[5px]">
                                        <button className="dropdown-item p-[7px] text-[14px] bg-transparent w-full text-left">English</button>
                                    </li>
                                    <li className="leading-[1.5] py-[5px]">
                                        <button className="dropdown-item p-[7px] text-[14px] bg-transparent w-full text-left">Italiano</button>
                                    </li>
                                </ul>
                            </div>
                            {/* Language End */}
                            {/* Currency Start */}
                            <div className="header-top-lan-curr header-top-curr dropdown pl-[20px] flex flex-wrap relative">
                                <button type="button" className="dropdown-toggle text-[13px] flex items-center p-[0] transition-all duration-[0.3s] ease delay-0 text-[#777] border-[0] tracking-[0.7px]">Dollar
                                    <FiChevronDown className="text-[14px] ml-[5px] text-[#777] transition-all duration-[0.3s] ease delay-0 flex" />
                                </button>
                                <ul className="hidden dropdown-menu absolute top-[32px] left-[auto] right-[0] min-w-[130px] truncate px-[10px] bg-[#fff] z-[1] rounded-[5px] border-[1px] border-solid border-[#eee]">
                                    <li className="active border-b-[1px] border-solid border-[#eee] leading-[1.5] py-[5px]">
                                        <button className="dropdown-item p-[7px] text-[14px] bg-transparent w-full text-left">USD $</button>
                                    </li>
                                    <li className="leading-[1.5] py-[5px]">
                                        <button className="dropdown-item p-[7px] text-[14px] bg-transparent w-full text-left">EUR €</button>
                                    </li>
                                </ul>
                            </div>
                            {/* Currency End */}
                        </div>
                    </div>
                    {/* Header Top Language Currency */}
                    {/* Header Top responsive Action */}
                    <div className="grow-[1] shrink-[0] basis-[0%] min-[992px]:hidden">
                        <div className="gi-header-bottons flex justify-end">
                            <div className="right-icons flex flex-row">
                                {/* Header User Start */}
                                <Link href="/login" className="gi-header-btn gi-header-user mr-[30px] relative transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center">
                                    <div className="header-icon relative flex">
                                        <FiUser className="text-[24px] leading-[17px]" />
                                    </div>
                                </Link>
                                {/* Header User End */}
                                {/* Header Wishlist Start */}
                                <Link href="/wishlist" className="gi-header-btn gi-wish-toggle mr-[30px] relative transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center">
                                    <div className="header-icon relative flex">
                                        <FiHeart className="text-[24px] leading-[17px]" />
                                    </div>
                                    <span className="gi-header-count gi-wishlist-count w-[15px] h-[15px] text-[#fff] flex items-center justify-center rounded-[50%] text-[11px] absolute top-[-2px] right-[-6px] opacity-[0.8]">3</span>
                                </Link>
                                {/* Header Wishlist End */}
                                {/* Header Cart Start */}
                                <Link href="/cart" className="gi-header-btn gi-cart-toggle mr-[30px] transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center">
                                    <div className="header-icon relative flex">
                                        <FiShoppingBag className="text-[24px] leading-[17px]" />
                                        <span className="main-label-note-new" />
                                    </div>
                                    <span className="gi-header-count gi-cart-count  w-[15px] h-[15px] text-[#fff] flex items-center justify-center rounded-[50%] text-[11px] absolute top-[-2px] right-[-6px] opacity-[0.8]">3</span>
                                </Link>
                                {/* Header Cart End */}
                                {/* Header menu Start */}

                                <Sheet>
                                    <SheetTrigger asChild>
                                        <div className="gi-header-btn gi-site-menu-icon relative transition-all duration-[0.3s] ease-in-out flex text-[#4b5966] w-[auto] items-center">
                                            <FiMenu className="fi-rr-menu-burger text-[24px] leading-[17px]" />
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent side="left"> {/* This opens from the left */}
                                        <SheetHeader>
                                            <SheetTitle>My Menu</SheetTitle>
                                            {/* <SheetDescription> */}
                                                <MobileMenuSidebar />
                                            {/* </SheetDescription> */}
                                        </SheetHeader>
                                        {/* Your content here */}
                                    </SheetContent>
                                </Sheet>
                                {/* Header menu End */}
                            </div>
                        </div>
                    </div>
                    {/* Header Top responsive Action */}
                </div>
            </div>
        </div>
    )
}
