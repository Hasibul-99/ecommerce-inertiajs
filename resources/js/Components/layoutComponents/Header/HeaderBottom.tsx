import React from 'react'
import { Link } from '@inertiajs/react'

export default function HeaderBottom() {
    return (
        <div className="gi-header-bottom py-[30px] max-[991px]:py-[15px] max-[991px]:border-b-[1px] border-solid border-[#eee]">
            <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                <div className="w-full flex flex-wrap px-[12px]">
                    <div className="gi-flex flex flex-row justify-between w-full max-[575px]:flex-col">
                        {/* Header Logo Start */}
                        <div className="self-center gi-header-logo max-[575px]:mb-[15px]">
                            <div className="header-logo text-left">
                                <Link href="/"><img src="assets/img/logo/logo.png" alt="Site Logo" className="w-[144px] max-[1199px]:w-[130px] max-[991px]:w-[120px] max-[767px]:w-[100px] " /></Link>
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
                                    <Link href="/login" className="gi-header-btn gi-header-user dropdown-toggle gi-user-toggle mr-[30px] transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center whitespace-nowrap" title="Account">
                                        <div className="header-icon relative flex">
                                            <i className="fi-rr-user text-[24px] leading-[17px]" />
                                        </div>
                                        <div className="gi-btn-desc flex flex-col uppercase ml-[10px]">
                                            <span className="gi-btn-title transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#777] mb-[6px] tracking-[0.6px] capitalize font-medium">Account</span>
                                            <span className="gi-btn-stitle transition-all duration-[0.3s] ease-in-out text-[13px] font-medium text-[#4b5966] leading-[14px] max-[1199px]:text-[11px] max-[1199px]:min-w-[48px]">Login</span>
                                        </div>
                                    </Link>
                                    <ul className="gi-dropdown-menu min-w-[150px] py-[5px] transition-all duration-[0.3s] ease-in-out mt-[25px] absolute z-[16] text-left bg-[#fff] block opacity-0 invisible left-[0] right-[auto] border-[1px] border-solid border-[#eee] rounded-[5px]">
                                        <li><Link className="dropdown-item py-[10px] px-[20px] block w-full font-normal text-[13px] text-[#777] hover:bg-transparent hover:text-[#5caf90]" href="/register">Register</Link></li>
                                        <li><Link className="dropdown-item py-[10px] px-[20px] block w-full font-normal text-[13px] text-[#777] hover:bg-transparent hover:text-[#5caf90]" href="/checkout">Checkout</Link></li>
                                        <li><Link className="dropdown-item py-[10px] px-[20px] block w-full font-normal text-[13px] text-[#777] hover:bg-transparent hover:text-[#5caf90]" href="/login">Login</Link></li>
                                    </ul>
                                </div>
                                {/* Header User End */}
                                {/* Header wishlist Start */}
                                <Link href="/wishlist" className="gi-header-btn gi-wish-toggle mr-[30px] transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center whitespace-nowrap" title="Wishlist">
                                    <div className="header-icon relative flex">
                                        <i className="fi-rr-heart text-[24px] leading-[17px]" />
                                    </div>
                                    <div className="gi-btn-desc flex flex-col uppercase ml-[10px]">
                                        <span className="gi-btn-title transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#777] mb-[6px] tracking-[0.6px] capitalize font-medium">Wishlist</span>
                                        <span className="gi-btn-stitle transition-all duration-[0.3s] ease-in-out text-[13px] font-medium text-[#4b5966] leading-[14px] max-[1199px]:text-[11px] max-[1199px]:min-w-[48px]"><b className="gi-wishlist-count">3</b>-items</span>
                                    </div>
                                </Link>
                                {/* Header wishlist End */}
                                {/* Header Cart Start */}
                                <Link href="/cart" className="gi-header-btn gi-cart-toggle transition-all duration-[0.3s] ease-in-out relative flex text-[#4b5966] w-[auto] items-center whitespace-nowrap" title="Cart">
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
                                </Link>
                                {/* Header Cart End */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
