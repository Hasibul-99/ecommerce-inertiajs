import React from 'react'

export default function GuestLayoutHeader() {
    return (
        <header className="gi-header bg-[#fff] z-[14] max-[991px]:z-[16] relative">
            {/* Header Top Start */}
            <div className="header-top py-[10px] text-[#777] bg-[#f8f8fb]">
                <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                    <div className="w-full flex flex-wrap px-[12px]">
                        {/* Header Top social Start */}
                        <div className="grow-[1] shrink-[0] basis-[0%] min-[992px]:block max-[767px]:hidden">
                            <div className="header-top-social">
                                <ul className="mb-[0] p-[0] flex">
                                    <li className="list-inline-item transition-all duration-[0.3s] ease-in-out flex text-[13px] mr-[15px]">
                                        <a href="javascript:void(0)" className="mx-[5px] text-center flex items-center justify-center text-[15px]">
                                            <i className="fi fi-rr-phone-call transition-all duration-[0.3s] ease-in-out text-[#777]" />
                                        </a>
                                        +91 987 654 3210
                                    </li>
                                    <li className="list-inline-item transition-all duration-[0.3s] ease-in-out flex text-[13px]">
                                        <a href="javascript:void(0)" className="mx-[5px] text-center flex items-center justify-center text-[15px]">
                                            <i className="fi fi-brands-whatsapp transition-all duration-[0.3s] ease-in-out text-[#777]" />
                                        </a>
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
                                <a className="gi-help pl-[20px] text-[13px] text-[#777] tracking-[0.7px] font-normal hover:text-[#5caf90]" href="faq.html">Help?</a>
                                <a className="gi-help pl-[20px] text-[13px] text-[#777] tracking-[0.7px] font-normal hover:text-[#5caf90]" href="track-order.html">Track Order?</a>
                                {/* Language Start */}
                                <div className="header-top-lan-curr header-top-lan dropdown pl-[20px] flex flex-wrap relative">
                                    <button type="button" className="dropdown-toggle text-[13px] flex items-center p-[0] transition-all duration-[0.3s] ease delay-0 text-[#777] border-[0] tracking-[0.7px]">English
                                        <i className="fi-rr-angle-small-down text-[14px] ml-[5px] text-[#777] transition-all duration-[0.3s] ease delay-0 flex" />
                                    </button>
                                    <ul className="hidden dropdown-menu absolute top-[32px] left-[auto] right-[0] min-w-[130px] truncate px-[10px] bg-[#fff] z-[1] rounded-[5px] border-[1px] border-solid border-[#eee]">
                                        <li className="active border-b-[1px] border-solid border-[#eee] leading-[1.5] py-[5px]">
                                            <a className="dropdown-item p-[7px] text-[14px] bg-transparent" href="#">English</a>
                                        </li>
                                        <li className="leading-[1.5] py-[5px]">
                                            <a className="dropdown-item p-[7px] text-[14px] bg-transparent" href="#">Italiano</a>
                                        </li>
                                    </ul>
                                </div>
                                {/* Language End */}
                                {/* Currency Start */}
                                <div className="header-top-lan-curr header-top-curr dropdown pl-[20px] flex flex-wrap relative">
                                    <button type="button" className="dropdown-toggle text-[13px] flex items-center p-[0] transition-all duration-[0.3s] ease delay-0 text-[#777] border-[0] tracking-[0.7px]">Dollar
                                        <i className="fi-rr-angle-small-down text-[14px] ml-[5px] text-[#777] transition-all duration-[0.3s] ease delay-0 flex" />
                                    </button>
                                    <ul className="hidden dropdown-menu absolute top-[32px] left-[auto] right-[0] min-w-[130px] truncate px-[10px] bg-[#fff] z-[1] rounded-[5px] border-[1px] border-solid border-[#eee]">
                                        <li className="active border-b-[1px] border-solid border-[#eee] leading-[1.5] py-[5px]">
                                            <a className="dropdown-item p-[7px] text-[14px] bg-transparent" href="#">USD $</a>
                                        </li>
                                        <li className="leading-[1.5] py-[5px]">
                                            <a className="dropdown-item p-[7px] text-[14px] bg-transparent" href="#">EUR €</a>
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
                                    <a href="login.html" className="gi-header-btn gi-header-user mr-[30px] relative transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center">
                                        <div className="header-icon relative flex">
                                            <i className="fi-rr-user text-[24px] leading-[17px]" />
                                        </div>
                                    </a>
                                    {/* Header User End */}
                                    {/* Header Wishlist Start */}
                                    <a href="wishlist.html" className="gi-header-btn gi-wish-toggle mr-[30px] relative transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center">
                                        <div className="header-icon relative flex">
                                            <i className="fi-rr-heart text-[24px] leading-[17px]" />
                                        </div>
                                        <span className="gi-header-count gi-wishlist-count w-[15px] h-[15px] text-[#fff] flex items-center justify-center rounded-[50%] text-[11px] absolute top-[-2px] right-[-6px] opacity-[0.8]">3</span>
                                    </a>
                                    {/* Header Wishlist End */}
                                    {/* Header Cart Start */}
                                    <a href="javascript:void(0)" className="gi-header-btn gi-cart-toggle mr-[30px] relative transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center">
                                        <div className="header-icon relative flex">
                                            <i className="fi-rr-shopping-bag text-[24px] leading-[17px]" />
                                            <span className="main-label-note-new" />
                                        </div>
                                        <span className="gi-header-count gi-cart-count  w-[15px] h-[15px] text-[#fff] flex items-center justify-center rounded-[50%] text-[11px] absolute top-[-2px] right-[-6px] opacity-[0.8]">3</span>
                                    </a>
                                    {/* Header Cart End */}
                                    {/* Header menu Start */}
                                    <a href="javascript:void(0)" className="gi-header-btn gi-site-menu-icon relative transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center">
                                        <i className="fi-rr-menu-burger text-[24px] leading-[17px]" />
                                    </a>
                                    {/* Header menu End */}
                                </div>
                            </div>
                        </div>
                        {/* Header Top responsive Action */}
                    </div>
                </div>
            </div>
            {/* Header Top  End */}
            {/* Header Bottom  Start */}
            <div className="gi-header-bottom py-[30px] max-[991px]:py-[15px] max-[991px]:border-b-[1px] border-solid border-[#eee]">
                <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                    <div className="w-full flex flex-wrap px-[12px]">
                        <div className="gi-flex flex flex-row justify-between w-full max-[575px]:flex-col">
                            {/* Header Logo Start */}
                            <div className="self-center gi-header-logo max-[575px]:mb-[15px]">
                                <div className="header-logo text-left">
                                    <a href="index.html"><img src="assets/img/logo/logo.png" alt="Site Logo" className="w-[144px] max-[1199px]:w-[130px] max-[991px]:w-[120px] max-[767px]:w-[100px] " /></a>
                                </div>
                            </div>
                            {/* Header Logo End */}
                            {/* Header Search Start */}
                            <div className="self-center gi-header-search my-[0] mx-[auto] max-[991px]:m-0">
                                <div className="header-search w-full min-w-[700px] px-[30px] relative max-[1399px]:min-w-[500px] max-[1199px]:min-w-[400px] max-[991px]:p-0 max-[767px]:min-w-[350px] max-[480px]:min-w-[300px] max-[320px]:min-w-full">
                                    <form className="gi-search-group-form relative flex border-[1px] border-solid border-[#eee] items-center rounded-[5px]" action="#">
                                        <input className="form-control gi-search-bar block w-full min-h-[50px] h-[50px] max-[991px]:h-[40px] max-[991px]:min-h-[40px] px-[15px] text-[13px] font-normal leading-[1] text-[#777] bg-transparent outline-[0] border-[0] tracking-[0.6px]" placeholder="Search Products..." type="text" />
                                        <button type="submit" className="search_submit relative flex items-center justify-center w-[48px] h-[40px] basis-[48px]">
                                            <i className="fi-rr-search text-[#4b5966] h-[18px] w-[18px] transition-all duration-[0.3s] ease-in-out" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                            {/* Header Search End */}
                            {/* Header Button Start */}
                            <div className="gi-header-action self-center max-[991px]:hidden">
                                <div className="gi-header-bottons flex justify-end">
                                    {/* Header User Start */}
                                    <div className="gi-acc-drop relative">
                                        <a href="javascript:void(0)" className="gi-header-btn gi-header-user dropdown-toggle gi-user-toggle mr-[30px] transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center whitespace-nowrap" title="Account">
                                            <div className="header-icon relative flex">
                                                <i className="fi-rr-user text-[24px] leading-[17px]" />
                                            </div>
                                            <div className="gi-btn-desc flex flex-col uppercase ml-[10px]">
                                                <span className="gi-btn-title transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#777] mb-[6px] tracking-[0.6px] capitalize font-medium">Account</span>
                                                <span className="gi-btn-stitle transition-all duration-[0.3s] ease-in-out text-[13px] font-medium text-[#4b5966] leading-[14px] max-[1199px]:text-[11px] max-[1199px]:min-w-[48px]">Login</span>
                                            </div>
                                        </a>
                                        <ul className="gi-dropdown-menu min-w-[150px] py-[5px] transition-all duration-[0.3s] ease-in-out mt-[25px] absolute z-[16] text-left bg-[#fff] block opacity-0 invisible left-[0] right-[auto] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                            <li><a className="dropdown-item py-[10px] px-[20px] block w-full font-normal text-[13px] text-[#777] hover:bg-transparent hover:text-[#5caf90]" href="register.html">Register</a></li>
                                            <li><a className="dropdown-item py-[10px] px-[20px] block w-full font-normal text-[13px] text-[#777] hover:bg-transparent hover:text-[#5caf90]" href="checkout.html">Checkout</a></li>
                                            <li><a className="dropdown-item py-[10px] px-[20px] block w-full font-normal text-[13px] text-[#777] hover:bg-transparent hover:text-[#5caf90]" href="login.html">Login</a></li>
                                        </ul>
                                    </div>
                                    {/* Header User End */}
                                    {/* Header wishlist Start */}
                                    <a href="wishlist.html" className="gi-header-btn gi-wish-toggle mr-[30px] transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center whitespace-nowrap" title="Wishlist">
                                        <div className="header-icon relative flex">
                                            <i className="fi-rr-heart text-[24px] leading-[17px]" />
                                        </div>
                                        <div className="gi-btn-desc flex flex-col uppercase ml-[10px]">
                                            <span className="gi-btn-title transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#777] mb-[6px] tracking-[0.6px] capitalize font-medium">Wishlist</span>
                                            <span className="gi-btn-stitle transition-all duration-[0.3s] ease-in-out text-[13px] font-medium text-[#4b5966] leading-[14px] max-[1199px]:text-[11px] max-[1199px]:min-w-[48px]"><b className="gi-wishlist-count">3</b>-items</span>
                                        </div>
                                    </a>
                                    {/* Header wishlist End */}
                                    {/* Header Cart Start */}
                                    <a href="javascript:void(0)" className="gi-header-btn gi-cart-toggle transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center whitespace-nowrap" title="Cart">
                                        <div className="header-icon relative flex">
                                            <i className="fi-rr-shopping-bag text-[24px] leading-[17px]" />
                                            <span className="main-label-note-new transition-all duration-[0.3s] ease-in-out h-[10px] w-[10px] m-auto bg-[#ec716d] rounded-[50%] cursor-default hidden absolute bottom-[15px] left-[0] right-[0] z-[3]" />
                                        </div>
                                        <div className="gi-btn-desc flex flex-col uppercase ml-[10px]">
                                            <span className="gi-btn-title transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#777] mb-[6px] tracking-[0.6px] capitalize font-medium">Cart</span>
                                            <span className="gi-btn-stitle transition-all duration-[0.3s] ease-in-out text-[13px] font-medium text-[#4b5966] leading-[14px] max-[1199px]:text-[11px] max-[1199px]:min-w-[48px]">
                                                <b className="gi-cart-count">3</b>-items
                                            </span>
                                        </div>
                                    </a>
                                    {/* Header Cart End */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header Button End */}
            {/* Header menu */}
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
            {/* Header menu End */}
            {/* Mobile Menu sidebar Start */}
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
            {/* Mobile Menu sidebar End */}
        </header>

    )
}
