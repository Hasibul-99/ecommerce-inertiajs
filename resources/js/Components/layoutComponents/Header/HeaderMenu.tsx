import React from 'react'
import { 
    FiGrid, 
    FiChevronDown, 
    FiChevronRight,
    FiMapPin, 
    FiPercent 
} from 'react-icons/fi'
import { 
    GiCupcake, 
    GiAppleCore, 
    GiPopcorn 
} from 'react-icons/gi'

export default function HeaderMenu() {
    return (
        <div className="gi-header-bottom py-[30px] max-[991px]:py-[15px]">
            <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] px-[12px]">
                <div className="flex flex-wrap w-full">
                    <div className="gi-flex gi-main-menu-desk w-full flex">
                        <div className="gi-main-menu w-full block max-[991px]:hidden">
                            <div className="nav-bar">
                                <nav className="navbar p-[0] transition-all duration-[0.3s] ease-in-out delay-[0s] z-[16] relative">
                                    <div className="gi-main-menu-inner">
                                        <div className="gi-menu-toggle w-[30px] h-[20px] flex-col justify-between items-center transition-all duration-[0.3s] ease-in-out cursor-pointer relative hidden max-[991px]:flex">
                                            <span className="gi-menu-line w-full h-[2px] bg-[#4b5966] transition-all duration-[0.3s] ease-in-out delay-[0s] block"></span>
                                            <span className="gi-menu-line w-full h-[2px] bg-[#4b5966] transition-all duration-[0.3s] ease-in-out delay-[0s] block"></span>
                                            <span className="gi-menu-line w-full h-[2px] bg-[#4b5966] transition-all duration-[0.3s] ease-in-out delay-[0s] block"></span>
                                        </div>
                                        <div className="gi-main-menu-content w-full flex justify-between">
                                            <div className="gi-main-menu-left">
                                                <div className="gi-dropdown-category relative">
                                                    <div className="gi-category-toggle w-[270px] min-h-[50px] px-[30px] cursor-pointer flex items-center bg-[#5caf90] rounded-[5px] max-[1199px]:w-auto max-[991px]:border-[0]">
                                                        <div className="gi-category-content flex items-center">
                                                            <FiGrid className="gi-category-icon mr-[10px] text-[16px] text-[#fff] leading-[0]" />
                                                            <span className="gi-category-text text-[15px] text-[#fff] font-medium max-[1199px]:hidden">Browse Categories</span>
                                                            <FiChevronDown className="gi-category-arrow text-[14px] text-[#fff] absolute right-[20px] leading-[0] max-[1199px]:relative max-[1199px]:right-[auto] max-[1199px]:ml-[10px]" />
                                                        </div>
                                                    </div>
                                                    <div className="gi-cat-dropdown transition-all duration-[0.3s] ease-in-out w-[270px] mt-[15px] px-[0] absolute bg-[#fff] opacity-[0] invisible left-[0] z-[-15] rounded-[5px] border-[1px] border-solid border-[#eee] max-[1199px]:w-[250px]">
                                                        <div className="gi-cat-block">
                                                            <div className="gi-cat-tab">
                                                                <div className="gi-tab-list">
                                                                    <ul className="gi-cat-list">
                                                                        <li className="gi-cat-item transition-all duration-[0.3s] ease-in-out cursor-pointer px-[20px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-b-[1px] border-solid border-[#eee] flex items-center justify-between">
                                                                            <div className="gi-cat-name flex items-center">
                                                                                <GiCupcake className="w-[30px] h-[30px] mr-[15px] text-[30px] text-[#5caf90] leading-[0]" />
                                                                                <span>Cake & Milk</span>
                                                                                <span className="gi-cat-count text-[11px] bg-[#5caf90] text-[#fff] transition-all duration-[0.3s] ease-in-out py-[2px] px-[8px] rounded-[15px] ml-[10px]">30</span>
                                                                            </div>
                                                                            <FiChevronRight className="gi-cat-arrow transition-all duration-[0.3s] ease-in-out text-[14px] text-[#687188] leading-[0]" />
                                                                        </li>
                                                                        <li className="gi-cat-item transition-all duration-[0.3s] ease-in-out cursor-pointer px-[20px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-b-[1px] border-solid border-[#eee] flex items-center justify-between">
                                                                            <div className="gi-cat-name flex items-center">
                                                                                <GiAppleCore className="w-[30px] h-[30px] mr-[15px] text-[30px] text-[#5caf90] leading-[0]" />
                                                                                <span>Fresh Fruit</span>
                                                                                <span className="gi-cat-count text-[11px] bg-[#5caf90] text-[#fff] transition-all duration-[0.3s] ease-in-out py-[2px] px-[8px] rounded-[15px] ml-[10px]">25</span>
                                                                            </div>
                                                                            <FiChevronRight className="gi-cat-arrow transition-all duration-[0.3s] ease-in-out text-[14px] text-[#687188] leading-[0]" />
                                                                        </li>
                                                                        <li className="gi-cat-item transition-all duration-[0.3s] ease-in-out cursor-pointer px-[20px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-b-[1px] border-solid border-[#eee] flex items-center justify-between">
                                                                            <div className="gi-cat-name flex items-center">
                                                                                <GiPopcorn className="w-[30px] h-[30px] mr-[15px] text-[30px] text-[#5caf90] leading-[0]" />
                                                                                <span>Snack & Spice</span>
                                                                                <span className="gi-cat-count text-[11px] bg-[#5caf90] text-[#fff] transition-all duration-[0.3s] ease-in-out py-[2px] px-[8px] rounded-[15px] ml-[10px]">39</span>
                                                                            </div>
                                                                            <FiChevronRight className="gi-cat-arrow transition-all duration-[0.3s] ease-in-out text-[14px] text-[#687188] leading-[0]" />
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="gi-main-menu-right flex items-center">
                                                <div className="main-menu">
                                                    <div className="navbar-nav">
                                                        <ul className="w-full flex justify-center flex-wrap pl-[0]">
                                                            <li className="dropdown drop-list relative ml-[20px] mr-[30px] transition-all duration-[0.3s] ease-in-out max-[1199px]:ml-[15px]">
                                                                <a onClick={(e) => e.preventDefault()} className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium cursor-pointer">Home<FiChevronRight className="transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
                                                                <ul className="sub-menu transition-all duration-[0.3s] ease-in-out mt-[15px] absolute z-[16] text-left opacity-0 invisible min-w-[205px] left-0 right-auto bg-[#fff] block rounded-[5px] border-[1px] border-solid border-[#eee] py-[5px]">
                                                                    <li><a href="index.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Grocery</a></li>
                                                                    <li><a href="demo-2.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Fashion</a></li>
                                                                    <li><a href="demo-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Fashion 2</a></li>
                                                                </ul>
                                                            </li>
                                                            <li className="dropdown drop-list static ml-[20px] mr-[30px] transition-all duration-[0.3s] ease-in-out max-[1199px]:ml-[15px]">
                                                                <a onClick={(e) => e.preventDefault()} className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium cursor-pointer">Categories<FiChevronRight className="transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
                                                                <ul className="mega-menu block transition-all duration-[0.3s] ease-in-out w-full max-[1399px]:mx-[12px] max-[1399px]:w-[calc(100%-24px)] mt-[15px] absolute bg-[#fff] pl-[30px] opacity-0 invisible left-0 z-[15] rounded-[5px] border-[1px] border-solid border-[#eee] truncate">
                                                                    <li className="flex">
                                                                        <ul className="mega-block w-[calc(25%-30px)] mr-[30px] py-[15px]">
                                                                            <li className="menu_title">
                                                                                <a onClick={(e) => e.preventDefault()} className="transition-all duration-[0.3s] ease-in-out font-medium text-[15px] leading-[20px] px-[0] py-[10px] capitalize text-[#4b5966] flex justify-between items-center border-b-[1px] border-solid border-[#eee] mb-[10px] block cursor-pointer">Dairy & Bakery</a>
                                                                            </li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Milk</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Ice cream</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Cheese</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Frozen custard</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Yogurt</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Butter</a></li>
                                                                        </ul>
                                                                        <ul className="mega-block w-[calc(25%-30px)] mr-[30px] py-[15px]">
                                                                            <li className="menu_title">
                                                                                <a onClick={(e) => e.preventDefault()} className="transition-all duration-[0.3s] ease-in-out font-medium text-[15px] leading-[20px] px-[0] py-[10px] capitalize text-[#4b5966] flex justify-between items-center border-b-[1px] border-solid border-[#eee] mb-[10px] block cursor-pointer">Breakfast & instant food</a>
                                                                            </li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Breakfast Cereal</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Noodles, Pasta & Soup</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Frozen Veg Snacks</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Frozen Non-Veg Snacks</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Vermicelli</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Instant Mixes</a></li>
                                                                        </ul>
                                                                        <ul className="mega-block w-[calc(25%-30px)] mr-[30px] py-[15px]">
                                                                            <li className="menu_title">
                                                                                <a onClick={(e) => e.preventDefault()} className="transition-all duration-[0.3s] ease-in-out font-medium text-[15px] leading-[20px] px-[0] py-[10px] capitalize text-[#4b5966] flex justify-between items-center border-b-[1px] border-solid border-[#eee] mb-[10px] block cursor-pointer">Biscuits & snacks</a>
                                                                            </li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Salted Biscuits</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Marie, Health, Digestive</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Cream Biscuits & Wafers</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Glucose & Milk biscuits</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Cookies</a></li>
                                                                        </ul>
                                                                        <ul className="mega-block w-[calc(25%-30px)] mr-[30px] py-[15px]">
                                                                            <li className="menu_title">
                                                                                <a onClick={(e) => e.preventDefault()} className="transition-all duration-[0.3s] ease-in-out font-medium text-[15px] leading-[20px] px-[0] py-[10px] capitalize text-[#4b5966] flex justify-between items-center border-b-[1px] border-solid border-[#eee] mb-[10px] block cursor-pointer">Grocery & Staples</a>
                                                                            </li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Lemon, Ginger & Garlic</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Indian & Exotic Herbs</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Organic Vegetables</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Cuts & Sprouts</a></li>
                                                                            <li><a href="shop-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[0] py-[5px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Exotic Vegetables</a></li>
                                                                        </ul>
                                                                    </li>
                                                                </ul>
                                                            </li>
                                                            <li className="dropdown drop-list relative ml-[20px] mr-[30px] transition-all duration-[0.3s] ease-in-out max-[1199px]:ml-[15px]">
                                                                <a onClick={(e) => e.preventDefault()} className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium cursor-pointer">Products<FiChevronRight className="transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
                                                                <ul className="sub-menu transition-all duration-[0.3s] ease-in-out mt-[15px] absolute z-[16] text-left opacity-0 invisible min-w-[205px] left-0 right-auto bg-[#fff] block rounded-[5px] border-[1px] border-solid border-[#eee] py-[5px]">
                                                                    <li className="dropdown position-static">
                                                                        <a onClick={(e) => e.preventDefault()} className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90] cursor-pointer">Product page
                                                                            <FiChevronRight className="transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[2px] text-[18px] flex" />
                                                                        </a>
                                                                        <ul className="sub-menu sub-menu-child transition-all duration-[0.3s] ease-in-out mt-[15px] absolute z-[16] text-left opacity-0 invisible min-w-[205px] left-0 right-auto bg-[#fff] block rounded-[5px] border-[1px] border-solid border-[#eee] py-[5px]">
                                                                            <li><a href="product-left-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Product left sidebar</a></li>
                                                                            <li><a href="product-right-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Product right sidebar</a></li>
                                                                        </ul>
                                                                    </li>
                                                                    <li className="dropdown position-static">
                                                                        <a onClick={(e) => e.preventDefault()} className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90] cursor-pointer">Product Accordion
                                                                            <FiChevronRight className="transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[2px] text-[18px] flex" />
                                                                        </a>
                                                                        <ul className="sub-menu sub-menu-child transition-all duration-[0.3s] ease-in-out mt-[15px] absolute z-[16] text-left opacity-0 invisible min-w-[205px] left-0 right-auto bg-[#fff] block rounded-[5px] border-[1px] border-solid border-[#eee] py-[5px]">
                                                                            <li><a href="product-accordion-left-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">left sidebar</a></li>
                                                                            <li><a href="product-accordion-right-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">right sidebar</a></li>
                                                                        </ul>
                                                                    </li>
                                                                    <li><a href="product-full-width.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Product full width</a></li>
                                                                    <li><a href="product-accordion-full-width.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">accordion full width</a></li>
                                                                </ul>
                                                            </li>
                                                            <li className="dropdown drop-list relative ml-[20px] mr-[30px] transition-all duration-[0.3s] ease-in-out max-[1199px]:ml-[15px]">
                                                                <a onClick={(e) => e.preventDefault()} className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium cursor-pointer">Blog<FiChevronRight className="transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
                                                                <ul className="sub-menu transition-all duration-[0.3s] ease-in-out mt-[15px] absolute z-[16] text-left opacity-0 invisible min-w-[205px] left-0 right-auto bg-[#fff] block rounded-[5px] border-[1px] border-solid border-[#eee] py-[5px]">
                                                                    <li><a href="blog-left-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">left sidebar</a></li>
                                                                    <li><a href="blog-right-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">right sidebar</a></li>
                                                                    <li><a href="blog-full-width.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Full Width</a></li>
                                                                    <li><a href="blog-detail-left-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Detail left sidebar</a></li>
                                                                    <li><a href="blog-detail-right-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Detail right sidebar</a></li>
                                                                    <li><a href="blog-detail-full-width.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Detail Full Width</a></li>
                                                                </ul>
                                                            </li>
                                                            <li className="dropdown drop-list relative ml-[20px] mr-[30px] transition-all duration-[0.3s] ease-in-out max-[1199px]:ml-[15px]">
                                                                <a onClick={(e) => e.preventDefault()} className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium cursor-pointer">Others<FiChevronRight className="transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
                                                                <ul className="sub-menu transition-all duration-[0.3s] ease-in-out mt-[15px] absolute z-[16] text-left opacity-0 invisible min-w-[205px] left-0 right-auto bg-[#fff] block rounded-[5px] border-[1px] border-solid border-[#eee] py-[5px]">
                                                                    <li><a href="about-us.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">About Us</a></li>
                                                                    <li><a href="contact-us.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Contact Us</a></li>
                                                                    <li><a href="cart.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Cart</a></li>
                                                                    <li><a href="checkout.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Checkout</a></li>
                                                                    <li><a href="compare.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Compare</a></li>
                                                                    <li><a href="faq.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">FAQ</a></li>
                                                                    <li><a href="login.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Login</a></li>
                                                                    <li><a href="register.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Register</a></li>
                                                                    <li><a href="track-order.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Track Order</a></li>
                                                                    <li><a href="terms-condition.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Terms Condition</a></li>
                                                                    <li><a href="privacy-policy.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Privacy Policy</a></li>
                                                                </ul>
                                                            </li>
                                                            <li className="relative ml-[20px] mr-[30px] transition-all duration-[0.3s] ease-in-out max-[1199px]:ml-[15px]">
                                                                <a href="offer.html" className="relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium">
                                                                    <FiPercent className="transition-all duration-[0.3s] ease-in-out mr-[5px] text-[18px] text-[#4b5966] flex" />Offers
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="gi-location-block py-[5px] static">
                        <div className="gi-location-menu relative">
                            <div className="gi-location-toggle w-[200px] min-h-[50px] px-[15px] flex items-center bg-[#4b5966] rounded-[5px] cursor-pointer max-[1199px]:w-auto max-[991px]:border-[0]">
                                <FiMapPin className="location text-[#fff] text-[18px] leading-[0]" />
                                <span className="text ml-[10px] text-[15px] text-[#fff] font-medium max-[1199px]:hidden">Your Location</span>
                                <FiChevronDown className="gi-angle text-[18px] uppercase text-[#fff] text-center absolute right-[15px] leading-[0]" aria-hidden="true" />
                            </div>
                        </div>
                        <div className="gi-location-dropdown transition-all duration-[0.3s] ease-in-out w-[250px] mt-[15px] p-[15px] absolute bg-[#fff] opacity-[0] invisible left-[0] z-[-15] rounded-[5px] border-[1px] border-solid border-[#eee]">
                            <div className="gi-location-block">
                                <ul className="gi-location-list">
                                    <li className="gi-location-item transition-all duration-[0.3s] ease-in-out cursor-pointer px-[15px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-[1px] border-solid border-[#eee] rounded-[5px] flex items-center mb-[10px]">
                                        <FiMapPin className="text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                        <span>Alabama</span>
                                    </li>
                                    <li className="gi-location-item transition-all duration-[0.3s] ease-in-out cursor-pointer px-[15px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-[1px] border-solid border-[#eee] rounded-[5px] flex items-center mb-[10px]">
                                        <FiMapPin className="text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                        <span>Arizona</span>
                                    </li>
                                    <li className="gi-location-item transition-all duration-[0.3s] ease-in-out cursor-pointer px-[15px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-[1px] border-solid border-[#eee] rounded-[5px] flex items-center mb-[10px]">
                                        <FiMapPin className="text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                        <span>California</span>
                                    </li>
                                    <li className="gi-location-item transition-all duration-[0.3s] ease-in-out cursor-pointer px-[15px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-[1px] border-solid border-[#eee] rounded-[5px] flex items-center mb-[10px]">
                                        <FiMapPin className="text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                        <span>Colorado</span>
                                    </li>
                                    <li className="gi-location-item transition-all duration-[0.3s] ease-in-out cursor-pointer px-[15px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-[1px] border-solid border-[#eee] rounded-[5px] flex items-center">
                                        <FiMapPin className="text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                        <span>Florida</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
