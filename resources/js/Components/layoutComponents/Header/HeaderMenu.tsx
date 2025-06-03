import React from 'react'

export default function HeaderMenu() {
    return (
        <div className="gi-header-cat transition-all duration-[0.3s] ease-in-out bg-[#fff] border-t-[1px] border-b-[1px] border-solid border-[#eee] hidden min-[992px]:block">
            <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
                <div className="gi-nav-bar flex flex-row justify-between relative w-full px-[12px]">
                    {/* Category Toggle */}
                    <div className="gi-category-icon-block py-[5px] static">
                        <div className="gi-category-menu relative">
                            <div className="gi-category-toggle w-[200px] min-h-[50px] px-[15px] flex items-center bg-[#5caf90] rounded-[5px] cursor-pointer max-[1199px]:w-auto max-[991px]:border-[0]">
                                <i className="fi fi-rr-apps text-[18px] text-[#fff] leading-[0]" />
                                <span className="text ml-[10px] text-[15px] text-[#fff] font-medium max-[1199px]:hidden">All Categories</span>
                                <i className="fi-rr-angle-small-down text-[18px] uppercase text-[#fff] text-center absolute right-[15px] leading-[0] max-[1199px]:hidden" aria-hidden="true" />
                            </div>
                        </div>
                        <div className="gi-cat-dropdown transition-all duration-[0.3s] ease-in-out w-[600px] mt-[15px] p-[15px] absolute bg-[#fff] opacity-[0] invisible left-[0] z-[-15] rounded-[5px] border-[1px] border-solid border-[#eee]">
                            <div className="gi-cat-block">
                                <div className="gi-cat-tab flex">
                                    <ul className="nav-tabs min-w-[230px] bg-[#f8f8fb] p-[15px] rounded-[5px] flex-col justify-center mr-[16px]" id="myTab">
                                        <li className="active transition-all duration-[0.3s] ease-in-out cursor-pointer px-[15px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-[1px] border-solid border-[#eee] rounded-[5px] flex items-center mb-[10px]">
                                            <a href="#v-pills-home">
                                                <i className="fi-rr-cupcake transition-all duration-[0.3s] ease-in-out mr-[10px] text-[18px] leading-[0]" />Dairy &amp; Bakery
                                            </a>
                                        </li>
                                        <li className="transition-all duration-[0.3s] ease-in-out cursor-pointer px-[15px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-[1px] border-solid border-[#eee] rounded-[5px] flex items-center mb-[10px]">
                                            <a href="#v-pills-profile">
                                                <i className="fi fi-rs-apple-whole transition-all duration-[0.3s] ease-in-out mr-[10px] text-[18px] leading-[0]" />Fruits &amp; Vegetable
                                            </a>
                                        </li>
                                        <li className="transition-all duration-[0.3s] ease-in-out cursor-pointer px-[15px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-[1px] border-solid border-[#eee] rounded-[5px] flex items-center mb-[10px]">
                                            <a href="#v-pills-messages">
                                                <i className="fi fi-rr-popcorn transition-all duration-[0.3s] ease-in-out mr-[10px] text-[18px] leading-[0]" />Snack &amp; Spice
                                            </a>
                                        </li>
                                        <li className="transition-all duration-[0.3s] ease-in-out cursor-pointer px-[15px] py-[10px] bg-[#fff] text-[13px] text-[#4b5966] font-medium text-left capitalize border-[1px] border-solid border-[#eee] rounded-[5px] flex items-center">
                                            <a href="#v-pills-settings">
                                                <i className="fi fi-rr-popcorn transition-all duration-[0.3s] ease-in-out mr-[10px] text-[18px] leading-[0]" />Juice &amp; Drinks
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content transition-all w-full" id="myTabContent">
                                        <div className="tab-pane" id="v-pills-home">
                                            <div className="tab-list w-full flex flex-wrap">
                                                <div className="px-[12px] grow-[1]">
                                                    <h6 className="gi-col-title text-[#5caf90] font-Poppins text-[15px] font-medium leading-[30px] capitalize block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Dairy</h6>
                                                    <ul className="cat-list">
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Milk</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Ice cream</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Cheese</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Frozen custard</a> </li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Frozen yogurt</a> </li>
                                                    </ul>
                                                </div>
                                                <div className="px-[12px] grow-[1]">
                                                    <h6 className="gi-col-title text-[#5caf90] font-Poppins text-[15px] font-medium leading-[30px] capitalize block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Bakery</h6>
                                                    <ul className="cat-list">
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Cake and Pastry</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Rusk Toast</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Bread &amp; Buns</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Chocolate Brownie</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Cream Roll</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="v-pills-profile">
                                            <div className="tab-list w-full flex flex-wrap">
                                                <div className="px-[12px] grow-[1]">
                                                    <h6 className="gi-col-title text-[#5caf90] font-Poppins text-[15px] font-medium leading-[30px] capitalize block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Fruits</h6>
                                                    <ul className="cat-list">
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Cauliflower</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Bell Peppers</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Broccoli</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Cabbage</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Tomato</a></li>
                                                    </ul>
                                                </div>
                                                <div className="px-[12px] grow-[1]">
                                                    <h6 className="gi-col-title text-[#5caf90] font-Poppins text-[15px] font-medium leading-[30px] capitalize block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Vegetable</h6>
                                                    <ul className="cat-list">
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Cauliflower</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Bell Peppers</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Broccoli</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Cabbage</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Tomato</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="v-pills-messages">
                                            <div className="tab-list w-full flex flex-wrap">
                                                <div className="px-[12px] grow-[1]">
                                                    <h6 className="gi-col-title text-[#5caf90] font-Poppins text-[15px] font-medium leading-[30px] capitalize block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Snacks</h6>
                                                    <ul className="cat-list">
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">French fries</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">potato chips</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Biscuits &amp; Cookies</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Popcorn</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Rice Cakes</a></li>
                                                    </ul>
                                                </div>
                                                <div className="px-[12px] grow-[1]">
                                                    <h6 className="gi-col-title text-[#5caf90] font-Poppins text-[15px] font-medium leading-[30px] capitalize block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Spice</h6>
                                                    <ul className="cat-list">
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Cinnamon Powder</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Cumin Powder</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Fenugreek Powder</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Pepper Powder</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Long Pepper</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="v-pills-settings">
                                            <div className="tab-list w-full flex flex-wrap">
                                                <div className="px-[12px] grow-[1]">
                                                    <h6 className="gi-col-title text-[#5caf90] font-Poppins text-[15px] font-medium leading-[30px] capitalize block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Juice</h6>
                                                    <ul className="cat-list">
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Mango Juice</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Coconut Water</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Tetra Pack</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Apple Juices</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Lychee Juice</a></li>
                                                    </ul>
                                                </div>
                                                <div className="px-[12px] grow-[1]">
                                                    <h6 className="gi-col-title text-[#5caf90] font-Poppins text-[15px] font-medium leading-[30px] capitalize block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">soft drink</h6>
                                                    <ul className="cat-list">
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Breizh Cola</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Green Cola</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Jolt Cola</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Mecca Cola</a></li>
                                                        <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[28px] font-normal text-[13px] block py-[5px] border-[0] h-auto hover:text-[#5caf90]">Topsia Cola</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Main Menu Start */}
                    <div id="gi-main-menu-desk" className="w-full flex items-center min-[992px]:block hidden">
                        <div className="nav-desk">
                            <div className="w-full flex flex-wrap px-[12px] min-[1400px]:relative">
                                <div className="basis-auto w-full self-center">
                                    <div className="gi-main-menu flex">
                                        <ul className="w-full flex justify-center flex-wrap pl-[0]">
                                            <li className="dropdown drop-list relative ml-[20px] mr-[30px] transition-all duration-[0.3s] ease-in-out max-[1199px]:ml-[15px]">
                                                <a href="javascript:void(0)" className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium">Home<i className="fi-rr-angle-small-right transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
                                                <ul className="sub-menu transition-all duration-[0.3s] ease-in-out mt-[15px] absolute z-[16] text-left opacity-0 invisible min-w-[205px] left-0 right-auto bg-[#fff] block rounded-[5px] border-[1px] border-solid border-[#eee] py-[5px]">
                                                    <li><a href="index.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Grocery</a></li>
                                                    <li><a href="demo-2.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Fashion</a></li>
                                                    <li><a href="demo-3.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Fashion 2</a></li>
                                                </ul>
                                            </li>
                                            <li className="dropdown drop-list static ml-[20px] mr-[30px] transition-all duration-[0.3s] ease-in-out max-[1199px]:ml-[15px]">
                                                <a href="javascript:void(0)" className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium">Categories<i className="fi-rr-angle-small-right transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
                                                <ul className="mega-menu block transition-all duration-[0.3s] ease-in-out w-full max-[1399px]:mx-[12px] max-[1399px]:w-[calc(100%-24px)] mt-[15px] absolute bg-[#fff] pl-[30px] opacity-0 invisible left-0 z-[15] rounded-[5px] border-[1px] border-solid border-[#eee] truncate">
                                                    <li className="flex">
                                                        <span className="bg" />
                                                        <ul className="mega-block w-[calc(25%-30px)] mr-[30px] py-[15px] block">
                                                            <li className="menu_title">
                                                                <a href="javascript:void(0)" className="text-[#5caf90] text-[15px] capitalize leading-[30px] font-medium block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Classic</a>
                                                            </li>
                                                            <li><a href="shop-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Left sidebar 3 column</a></li>
                                                            <li><a href="shop-left-sidebar-col-4.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Left sidebar 4 column</a></li>
                                                            <li><a href="shop-right-sidebar-col-3.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Right sidebar 3 column</a></li>
                                                            <li><a href="shop-right-sidebar-col-4.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Right sidebar 4 column</a></li>
                                                            <li><a href="shop-full-width.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Full width 4 column</a></li>
                                                        </ul>
                                                        <ul className="mega-block w-[calc(25%-30px)] mr-[30px] py-[15px] block">
                                                            <li className="menu_title">
                                                                <a href="javascript:void(0)" className="text-[#5caf90] text-[15px] capitalize leading-[30px] font-medium block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Banner</a>
                                                            </li>
                                                            <li><a href="shop-banner-left-sidebar-col-3.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">left sidebar 3 column</a></li>
                                                            <li><a href="shop-banner-left-sidebar-col-4.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">left sidebar 4 column</a></li>
                                                            <li><a href="shop-banner-right-sidebar-col-3.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">right sidebar  column</a></li>
                                                            <li><a href="shop-banner-right-sidebar-col-4.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">right sidebar 4 column</a></li>
                                                            <li><a href="shop-banner-full-width.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Full width 4 column</a></li>
                                                        </ul>
                                                        <ul className="mega-block w-[calc(25%-30px)] mr-[30px] py-[15px] block">
                                                            <li className="menu_title">
                                                                <a href="javascript:void(0)" className="text-[#5caf90] text-[15px] capitalize leading-[30px] font-medium block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">Columns</a>
                                                            </li>
                                                            <li><a href="shop-full-width-col-3.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">3 Columns full width</a></li>
                                                            <li><a href="shop-full-width-col-4.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">4 Columns full width</a></li>
                                                            <li><a href="shop-full-width-col-5.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">5 Columns full width</a></li>
                                                            <li><a href="shop-full-width-col-6.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">6 Columns full width</a></li>
                                                            <li><a href="shop-banner-full-width-col-3.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Banner 3 Columns</a></li>
                                                        </ul>
                                                        <ul className="mega-block w-[calc(25%-30px)] mr-[30px] py-[15px] block">
                                                            <li className="menu_title">
                                                                <a href="javascript:void(0)" className="text-[#5caf90] text-[15px] capitalize leading-[30px] font-medium block border-b-[1px] border-solid border-[#eee] mb-[10px] pb-[5px] h-auto">List</a>
                                                            </li>
                                                            <li><a href="shop-list-left-sidebar.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Shop left sidebar</a></li>
                                                            <li><a href="shop-list-right-sidebar.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Shop right sidebar</a></li>
                                                            <li><a href="shop-list-banner-left-sidebar.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Banner left sidebar</a></li>
                                                            <li><a href="shop-list-banner-right-sidebar.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Banner right sidebar</a></li>
                                                            <li><a href="shop-list-full-col-2.html" className="text-[#777] capitalize leading-[30px] font-normal text-[13px] block py-[5px] border-0 h-auto hover:text-[#5caf90]">Full width 2 columns</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="dropdown drop-list relative ml-[20px] mr-[30px] transition-all duration-[0.3s] ease-in-out max-[1199px]:ml-[15px]">
                                                <a href="javascript:void(0)" className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium">Products<i className="fi-rr-angle-small-right transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
                                                <ul className="sub-menu transition-all duration-[0.3s] ease-in-out mt-[15px] absolute z-[16] text-left opacity-0 invisible min-w-[205px] left-0 right-auto bg-[#fff] block rounded-[5px] border-[1px] border-solid border-[#eee] py-[5px]">
                                                    <li className="dropdown position-static">
                                                        <a href="javascript:void(0)" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Product page
                                                            <i className="fi-rr-angle-small-right transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[2px] text-[18px] flex" />
                                                        </a>
                                                        <ul className="sub-menu sub-menu-child transition-all duration-[0.3s] ease-in-out mt-[15px] absolute z-[16] text-left opacity-0 invisible min-w-[205px] left-0 right-auto bg-[#fff] block rounded-[5px] border-[1px] border-solid border-[#eee] py-[5px]">
                                                            <li><a href="product-left-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Product left sidebar</a></li>
                                                            <li><a href="product-right-sidebar.html" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Product right sidebar</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="dropdown position-static">
                                                        <a href="javascript:void(0)" className="transition-all duration-[0.3s] ease-in-out leading-[20px] px-[20px] py-[10px] font-normal text-[13px] text-[#777] capitalize flex justify-between items-center hover:text-[#5caf90]">Product Accordion
                                                            <i className="fi-rr-angle-small-right transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[2px] text-[18px] flex" />
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
                                                <a href="javascript:void(0)" className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium">Blog<i className="fi-rr-angle-small-right transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
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
                                                <a href="javascript:void(0)" className="dropdown-arrow relative transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium">Others<i className="fi-rr-angle-small-right transition-all duration-[0.3s] ease-in-out mr-[5px] text-[#4b5966] absolute right-[-27px] text-[18px] rotate-[90deg] flex" /></a>
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
                                            <li className="non-drop mx-[20px] transition-all duration-[0.3s] ease-in-out max-[1199px]:mx-[15px]">
                                                <a href="shop-banner-left-sidebar-col-3.html" className="transition-all duration-[0.3s] ease-in-out text-[15px] leading-[60px] capitalize text-[#4b5966] flex items-center font-medium">
                                                    <i className="fi-rr-badge-percent transition-all duration-[0.3s] ease-in-out mr-[5px] text-[18px] text-[#4b5966] flex" />Offers
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Main Menu End */}
                    <div className="gi-location-block py-[5px]">
                        <div className="gi-location-menu transition-all duration-[0.3s] ease-in-out relative">
                            <div className="gi-location-toggle w-[200px] min-h-[50px] px-[15px] flex items-center bg-[#5caf90] rounded-[5px] cursor-pointer">
                                <i className="fi fi-rr-marker location text-[#fff] text-[18px] leading-[0]" />
                                <span className="gi-location-title gi-location w-[calc(100%-30px)] px-[10px] text-[15px] text-[#fff] font-medium tracking-[0.2px] whitespace-nowrap truncate">New York</span>
                                <i className="fi-rr-angle-small-down gi-angle text-[18px] uppercase text-[#fff] text-center absolute right-[15px] leading-[0]" aria-hidden="true" />
                            </div>
                            <div className="gi-location-content transition-all duration-[0.3s] ease-in-out w-[200px] py-[15px] px-[13px] mt-[15px] block absolute invisible left-auto right-0 top-[100%] rounded-[5px] z-[14] border-[1px] border-solid border-[#eee] bg-[#fff] overflow-auto">
                                <div className="gi-location-dropdown">
                                    <div className="w-full flex flex-wrap gi-location-wrapper">
                                        <ul className="loc-grid w-full">
                                            <li className="loc-list current w-full p-[10px] relative flex items-center flex-row justify-left text-[13px] font-medium capitalize border-[1px] border-solid border-[#eee] rounded-[5px] cursor-pointer hover:border-[#5caf90] hover:text-[#5caf90] mb-[10px]">
                                                <i className="fi fi-rr-map-marker-plus text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                                <span className="gi-detail-current w-[calc(100%-30px)] block truncate text-[#4b5966]">current Location</span>
                                            </li>
                                            <li className="loc-list current w-full p-[10px] relative flex items-center flex-row justify-left text-[13px] font-medium capitalize border-[1px] border-solid border-[#eee] rounded-[5px] cursor-pointer hover:border-[#5caf90] hover:text-[#5caf90] mb-[10px]">
                                                <i className="fi fi-rr-map-marker-plus text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                                <span className="gi-detail gi-detail-current w-[calc(100%-30px)] block truncate text-[#4b5966]">Los Angeles</span>
                                            </li>
                                            <li className="loc-list current w-full p-[10px] relative flex items-center flex-row justify-left text-[13px] font-medium capitalize border-[1px] border-solid border-[#eee] rounded-[5px] cursor-pointer hover:border-[#5caf90] hover:text-[#5caf90] mb-[10px]">
                                                <i className="fi fi-rr-map-marker-plus text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                                <span className="gi-detail gi-detail-current w-[calc(100%-30px)] block truncate text-[#4b5966]">Chicago</span>
                                            </li>
                                            <li className="loc-list current w-full p-[10px] relative flex items-center flex-row justify-left text-[13px] font-medium capitalize border-[1px] border-solid border-[#eee] rounded-[5px] cursor-pointer hover:border-[#5caf90] hover:text-[#5caf90] mb-[10px]">
                                                <i className="fi fi-rr-map-marker-plus text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                                <span className="gi-detail gi-detail-current w-[calc(100%-30px)] block truncate text-[#4b5966]">Houston</span>
                                            </li>
                                            <li className="loc-list current w-full p-[10px] relative flex items-center flex-row justify-left text-[13px] font-medium capitalize border-[1px] border-solid border-[#eee] rounded-[5px] cursor-pointer hover:border-[#5caf90] hover:text-[#5caf90] mb-[10px]">
                                                <i className="fi fi-rr-map-marker-plus text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                                <span className="gi-detail gi-detail-current w-[calc(100%-30px)] block truncate text-[#4b5966]">Phoenix</span>
                                            </li>
                                            <li className="loc-list current w-full p-[10px] relative flex items-center flex-row justify-left text-[13px] font-medium capitalize border-[1px] border-solid border-[#eee] rounded-[5px] cursor-pointer hover:border-[#5caf90] hover:text-[#5caf90]">
                                                <i className="fi fi-rr-map-marker-plus text-[14px] mr-[10px] text-[#777] leading-[0]" />
                                                <span className="gi-detail gi-detail-current w-[calc(100%-30px)] block truncate text-[#4b5966]">San Diego</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
