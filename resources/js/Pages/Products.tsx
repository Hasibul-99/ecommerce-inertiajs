import Guest from '@/Layouts/GuestLayout'
import { Head } from '@inertiajs/react'
import React from 'react'
import { FiGrid, FiList, FiHeart, FiEye, FiRepeat, FiShoppingCart, FiChevronRight } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { GiCupcake, GiFruitBowl, GiPopcorn, GiDrinkMe } from 'react-icons/gi'

export default function Products() {
    return (
        <>
            <Head title="Welcome" />
            <Guest>
                <section className="gi-category py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            <div className="gi-shop-rightside min-[992px]:order-[6] min-[768px]:order-[-1] min-[992px]:w-[75%] min-[768px]:w-full w-full px-[12px]">
                                {/* Shop Top Start */}
                                <div className="gi-pro-list-top flex items-center justify-between text-[14px] border-[1px] border-solid border-[#eee] rounded-[5px] mb-[30px]">
                                    <div className="min-[768px]:w-[50%] w-full gi-grid-list">
                                        <div className="gi-gl-btn ml-[5px] flex items-center flex-row">
                                            <button type="button" className="grid-btn btn-grid-50 h-[40px] w-[40px] border-[0] rounded-[0] flex items-center justify-center flex-row active">
                                                <FiGrid className="text-[20px] text-[#4b5966] leading-[0]" />
                                            </button>
                                            <button type="button" className="grid-btn btn-list-50 h-[40px] w-[40px] border-[0] rounded-[0] flex items-center justify-center flex-row">
                                                <FiList className="text-[20px] text-[#4b5966] leading-[0]" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="min-[768px]:w-[50%] w-full gi-sort-select flex justify-end items-center">
                                        <div className="gi-select-inner relative flex w-[140px] h-[50px] leading-[1.5] bg-[#fff] overflow-hidden rounded-[0] border-l-[1px] border-solid border-[#eee]">
                                            <select name="gi-select" id="gi-select" className="appearance-none outline-[0] border-[0] bg-[#fff] grow-[1] px-[10px] text-[#777] cursor-pointer">
                                                <option selected disabled>Sort by</option>
                                                <option value={1}>Position</option>
                                                <option value={2}>Relevance</option>
                                                <option value={3}>Name, A to Z</option>
                                                <option value={4}>Name, Z to A</option>
                                                <option value={5}>Price, low to high</option>
                                                <option value={6}>Price, high to low</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* Shop Top End */}
                                {/* Select Bar Start */}
                                <div className="gi-select-bar mt-[-5px] mx-[-5px] mb-[25px] flex flex-wrap justify-end ">
                                    <span className="gi-select-btn m-[5px] px-[10px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">Clothes
                                        <a className="gi-select-cancel ml-[15px] text-[#ff8585] text-[18px] transition-all duration-[0.3s] ease-in-out" href="javascript:void(0)">×</a>
                                    </span>
                                    <span className="gi-select-btn m-[5px] px-[10px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">Fruits
                                        <a className="gi-select-cancel ml-[15px] text-[#ff8585] text-[18px] transition-all duration-[0.3s] ease-in-out" href="javascript:void(0)">×</a>
                                    </span>
                                    <span className="gi-select-btn m-[5px] px-[10px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">Snacks
                                        <a className="gi-select-cancel ml-[15px] text-[#ff8585] text-[18px] transition-all duration-[0.3s] ease-in-out" href="javascript:void(0)">×</a>
                                    </span>
                                    <span className="gi-select-btn m-[5px] px-[10px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">Dairy
                                        <a className="gi-select-cancel ml-[15px] text-[#ff8585] text-[18px] transition-all duration-[0.3s] ease-in-out" href="javascript:void(0)">×</a>
                                    </span>
                                    <span className="gi-select-btn m-[5px] px-[10px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">perfume
                                        <a className="gi-select-cancel ml-[15px] text-[#ff8585] text-[18px] transition-all duration-[0.3s] ease-in-out" href="javascript:void(0)">×</a>
                                    </span>
                                    <span className="gi-select-btn m-[5px] px-[10px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">jewelry
                                        <a className="gi-select-cancel ml-[15px] text-[#ff8585] text-[18px] transition-all duration-[0.3s] ease-in-out" href="javascript:void(0)">×</a>
                                    </span>
                                    <span className="gi-select-btn gi-select-btn-clear m-[5px] p-[0] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">
                                        <a className="gi-select-clear transition-all duration-[0.3s] ease-in-out h-full m-[0] py-[3px] px-[10px] text-[14px] flex items-center bg-[#4b5966] text-[#fff] rounded-[5px] hover:bg-[#5caf90] hover:text-[#fff]" href="javascript:void(0)">Clear All</a>
                                    </span>
                                </div>
                                {/* Select Bar End */}
                                {/* Shop content Start */}
                                <div className="shop-pro-content">
                                    <div className="shop-pro-inner mx-[-12px]">
                                        <div className="flex flex-wrap w-full">
                                            <div className="min-[1200px]:w-[25%] min-[992px]:w-[33.33%] min-[768px]:w-[50%] min-[576px]:w-[50%] max-[420px]:w-full px-[12px] gi-product-box max-[575px]:w-[50%] max-[575px]:mx-auto pro-gl-content">
                                                <div className="gi-product-content pb-[24px] h-full flex">
                                                    <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px]">
                                                        <div className="gi-pro-image-outer transition-all duration-[0.3s] ease delay-[0s] z-[11] relative">
                                                            <div className="gi-pro-image overflow-hidden">
                                                                <a href="product-left-sidebar.html" className="image relative block overflow-hidden pointer-events-none transition-all duration-[0.3s] ease-in-out">
                                                                    <span className="label veg max-[991px]:hidden">
                                                                        <span className="dot" />
                                                                    </span>
                                                                    <img className="main-image max-w-full z-[1] transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/2_1.jpg" alt="Product" />
                                                                    <img className="hover-image absolute z-[2] top-[0] left-[0] opacity-[0] max-w-full transition-all duration-[0.3s] ease delay-[0s]" src="assets/img/product-images/2_2.jpg" alt="Product" />
                                                                </a>
                                                                <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                                                                    <span className="sale py-[5px] px-[10px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#ff7070] text-[#fff] tracking-[0.5px] relative rounded-[5px]">Sale</span>
                                                                </span>
                                                                <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-[0]">
                                                                    <a className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] hover:bg-[#5caf90]" title="Wishlist">
                                                                        <FiHeart className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                                    </a>
                                                                    <a href="javascript:void(0)" className="gi-btn-group modal-toggle quickview transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] hover:bg-[#5caf90]">
                                                                        <FiEye className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                                    </a>
                                                                    <a href="javascript:void(0)" className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] hover:bg-[#5caf90]" title="Compare">
                                                                        <FiRepeat className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                                    </a>
                                                                    <a href="javascript:void(0)" title="Add To Cart" className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] hover:bg-[#5caf90]">
                                                                        <FiShoppingCart className="transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px]" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="gi-pro-content p-[20px] border-t-[1px] border-solid border-[#eee]">
                                                            <h5 className="gi-pro-title mb-[10px] text-[16px] leading-[1.2]"><a href="product-left-sidebar.html" className="text-[#4b5966] capitalize leading-[1.2] font-medium text-[16px] hover:text-[#5caf90] transition-all duration-[0.3s] ease-in-out">Fresh organic villa farm lomon 500gm pack</a></h5>
                                                            <div className="gi-pro-rat-price mt-[5px] mb-[8px] flex items-center justify-between">
                                                                <span className="gi-pro-rating flex">
                                                                    <FaStar className="inline-block text-[#f27d0c] float-left text-[14px] mr-[3px]" />
                                                                    <FaStar className="inline-block text-[#f27d0c] float-left text-[14px] mr-[3px]" />
                                                                    <FaStar className="inline-block text-[#f27d0c] float-left text-[14px] mr-[3px]" />
                                                                    <FaStar className="inline-block text-[#777] float-left text-[14px] mr-[3px]" />
                                                                    <FaStar className="inline-block text-[#777] float-left text-[14px] mr-[3px]" />
                                                                </span>
                                                                <span className="gi-price">
                                                                    <span className="new-price text-[#4b5966] font-bold text-[16px] mr-[7px]">$25.00</span>
                                                                    <span className="old-price text-[14px] text-[#777] line-through">$35.00</span>
                                                                </span>
                                                            </div>
                                                            <p className="gi-pro-desc mb-[15px] text-[#777] text-[14px] leading-[20px] max-[1199px]:mb-[10px]">Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Pagination Start */}
                                    <div className="gi-pro-pagination pt-[15px] flex justify-between items-center border-t-[1px] border-solid border-[#eee] max-[575px]:flex-col">
                                        <span className="text-[14px] text-[#777] max-[575px]:mb-[10px]">Showing 1-12 of 21 item(s)</span>
                                        <ul className="gi-pro-pagination-inner">
                                            <li className="inline-block float-left mr-[5px]"><a className="transition-all duration-[0.3s] ease-in-out w-[32px] h-[32px] font-light text-[#777] leading-[32px] bg-[#eee] flex text-center align-top text-[16px] justify-center items-center rounded-[5px] active" href="#">1</a></li>
                                            <li className="inline-block float-left mr-[5px]"><a className="transition-all duration-[0.3s] ease-in-out w-[32px] h-[32px] font-light text-[#777] leading-[32px] bg-[#eee] flex text-center align-top text-[16px] justify-center items-center rounded-[5px] hover:text-[#fff] hover:bg-[#5caf90]" href="#">2</a></li>
                                            <li className="inline-block float-left mr-[5px]"><a className="transition-all duration-[0.3s] ease-in-out w-[32px] h-[32px] font-light text-[#777] leading-[32px] bg-[#eee] flex text-center align-top text-[16px] justify-center items-center rounded-[5px] hover:text-[#fff] hover:bg-[#5caf90]" href="#">3</a></li>
                                            <li className="inline-block float-left mr-[5px]"><span className="w-[20px] text-[#777] block text-center text-[14px] tracking-[0.02rem] max-[575px]:mb-[10px]">...</span></li>
                                            <li className="inline-block float-left mr-[5px]"><a className="transition-all duration-[0.3s] ease-in-out w-[32px] h-[32px] font-light text-[#777] leading-[32px] bg-[#eee] flex text-center align-top text-[16px] justify-center items-center rounded-[5px] hover:text-[#fff] hover:bg-[#5caf90]" href="#">8</a></li>
                                            <li className="inline-block float-left"><a className="next w-auto px-[13px] text-[#fff] bg-[#5caf90] leading-[30px] h-[32px] bg-[#eee] flex text-center align-top text-[16px] justify-center items-center rounded-[5px]" href="#">Next <FiChevronRight className="ml-[10px] transition-all duration-[0.3s] ease-in-out text-[#fff]" /></a></li>
                                        </ul>
                                    </div>
                                    {/* Pagination End */}
                                </div>
                                {/*Shop content End */}
                            </div>
                            {/* Sidebar Area Start */}
                            <div className="gi-shop-sidebar sticky top-[24px] min-[992px]:order-[-1] min-[768px]:order-[6] min-[992px]:w-[25%] min-[768px]:w-full w-full max-[991px]:mt-[30px] px-[12px]">
                                <div id="shop_sidebar">
                                    <div className="gi-sidebar-wrap p-[15px] rounded-[5px] border-[1px] border-solid border-[#eee]">
                                        {/* Sidebar Category Block */}
                                        <div className="gi-sidebar-block mb-[15px]">
                                            <div className="gi-sb-title border-b-[1px] border-solid border-[#eee] pb-[15px]">
                                                <h3 className="gi-sidebar-title font-semibold tracking-[0] relative text-[#4b5966] w-full flex justify-between font-Poppins text-[17px] leading-[1.2]">Category</h3>
                                            </div>
                                            <div className="gi-sb-block-content mt-[15px]">
                                                <ul>
                                                    <li>
                                                        <div className="gi-sidebar-block-item py-[15px] relative flex flex-row">
                                                            <input type="checkbox" className="w-full h-[calc(100% - 5px)] absolute opacity-[0] cursor-pointer z-[9] top-[50%] translate-y-[-50%]" defaultChecked />
                                                            <a href="javascript:void(0)" className="w-full text-[#777] text-[14px] mt-[0] leading-[20px] font-normal capitalize cursor-pointer flex justify-between pl-[30px]">
                                                                <span className="flex"><GiCupcake className="w-[20px] h-[20px] mr-[7px] text-[17px]" />Dairy &amp; Bakery</span>
                                                            </a>
                                                            <span className="checked absolute top-[50%] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="gi-sidebar-block-item py-[15px] relative flex flex-row">
                                                            <input type="checkbox" className="w-full h-[calc(100% - 5px)] absolute opacity-[0] cursor-pointer z-[9] top-[50%] translate-y-[-50%]" />
                                                            <a href="javascript:void(0)" className="w-full text-[#777] text-[14px] mt-[0] leading-[20px] font-normal capitalize cursor-pointer flex justify-between pl-[30px]">
                                                                <span className="flex"><GiFruitBowl className="w-[20px] h-[20px] mr-[7px] text-[17px]" />Fruits &amp; Vegetable</span>
                                                            </a>
                                                            <span className="checked absolute top-[50%] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="gi-sidebar-block-item py-[15px] relative flex flex-row">
                                                            <input type="checkbox" className="w-full h-[calc(100% - 5px)] absolute opacity-[0] cursor-pointer z-[9] top-[50%] translate-y-[-50%]" />
                                                            <a href="javascript:void(0)" className="w-full text-[#777] text-[14px] mt-[0] leading-[20px] font-normal capitalize cursor-pointer flex justify-between pl-[30px]">
                                                                <span className="flex"><GiPopcorn className="w-[20px] h-[20px] mr-[7px] text-[17px]" />Snack &amp; Spice</span>
                                                            </a>
                                                            <span className="checked absolute top-[50%] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="gi-sidebar-block-item py-[15px] relative flex flex-row">
                                                            <input type="checkbox" className="w-full h-[calc(100% - 5px)] absolute opacity-[0] cursor-pointer z-[9] top-[50%] translate-y-[-50%]" />
                                                            <a href="javascript:void(0)" className="w-full text-[#777] text-[14px] mt-[0] leading-[20px] font-normal capitalize cursor-pointer flex justify-between pl-[30px]">
                                                                <span className="flex"><GiDrinkMe className="w-[20px] h-[20px] mr-[7px] text-[17px]" />Juice &amp; Drinks</span>
                                                            </a>
                                                            <span className="checked absolute top-[50%] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Sidebar Weight Block */}
                                        <div className="gi-sidebar-block mb-[15px]">
                                            <div className="gi-sb-title border-b-[1px] border-solid border-[#eee] pb-[15px]">
                                                <h3 className="gi-sidebar-title font-semibold tracking-[0] relative text-[#4b5966] w-full flex justify-between font-Poppins text-[17px] leading-[1.2]">Weight</h3>
                                            </div>
                                            <div className="gi-sb-block-content mt-[15px]">
                                                <ul>
                                                    <li>
                                                        <div className="gi-sidebar-block-item py-[15px] relative flex flex-row">
                                                            <input type="checkbox" className="w-full h-[calc(100% - 5px)] absolute opacity-[0] cursor-pointer z-[9] top-[50%] translate-y-[-50%]" defaultChecked />
                                                            <a href="#" className="w-full text-[#777] text-[14px] mt-[0] leading-[20px] font-normal capitalize cursor-pointer flex justify-between pl-[30px]">500gm Pack</a>
                                                            <span className="checked absolute top-[50%] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="gi-sidebar-block-item py-[15px] relative flex flex-row">
                                                            <input type="checkbox" className="w-full h-[calc(100% - 5px)] absolute opacity-[0] cursor-pointer z-[9] top-[50%] translate-y-[-50%]" />
                                                            <a href="#" className="w-full text-[#777] text-[14px] mt-[0] leading-[20px] font-normal capitalize cursor-pointer flex justify-between pl-[30px]">1kg Pack</a>
                                                            <span className="checked absolute top-[50%] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="gi-sidebar-block-item py-[15px] relative flex flex-row">
                                                            <input type="checkbox" className="w-full h-[calc(100% - 5px)] absolute opacity-[0] cursor-pointer z-[9] top-[50%] translate-y-[-50%]" />
                                                            <a href="#" className="w-full text-[#777] text-[14px] mt-[0] leading-[20px] font-normal capitalize cursor-pointer flex justify-between pl-[30px]">2kg Pack</a>
                                                            <span className="checked absolute top-[50%] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="gi-sidebar-block-item py-[15px] relative flex flex-row">
                                                            <input type="checkbox" className="w-full h-[calc(100% - 5px)] absolute opacity-[0] cursor-pointer z-[9] top-[50%] translate-y-[-50%]" />
                                                            <a href="#" className="w-full text-[#777] text-[14px] mt-[0] leading-[20px] font-normal capitalize cursor-pointer flex justify-between pl-[30px]">5kg Pack</a>
                                                            <span className="checked absolute top-[50%] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="gi-sidebar-block-item py-[15px] relative flex flex-row">
                                                            <input type="checkbox" className="w-full h-[calc(100% - 5px)] absolute opacity-[0] cursor-pointer z-[9] top-[50%] translate-y-[-50%]" />
                                                            <a href="#" className="w-full text-[#777] text-[14px] mt-[0] leading-[20px] font-normal capitalize cursor-pointer flex justify-between pl-[30px]">10kg Pack</a>
                                                            <span className="checked absolute top-[50%] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Sidebar Color item */}
                                        <div className="gi-sidebar-block mb-[15px] color-block gi-sidebar-block-clr">
                                            <div className="gi-sb-title border-b-[1px] border-solid border-[#eee] pb-[15px]">
                                                <h3 className="gi-sidebar-title font-semibold tracking-[0] relative text-[#4b5966] w-full flex justify-between font-Poppins text-[17px] leading-[1.2]">Color</h3>
                                            </div>
                                            <div className="gi-sb-block-content mt-[20px]">
                                                <ul className="w-full flex flex-wrap flex-row">
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#c4d6f9' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#ff748b' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#000000' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="active mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#2bff4a' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#ff7c5e' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#f155ff' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#ffef00' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#c89fff' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#7bfffa' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#56ffc1' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#ffdb9f' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#9f9f9f' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                    <li className="mr-[10px]">
                                                        <div className="gi-sidebar-block-item py-[5px] border-[0] flex flex-row relative">
                                                            <input type="checkbox" className="w-[20px] h-[20px] absolute opacity-[0] cursor-pointer z-[9] top-[50%] left-[0] translate-y-[-50%]" />
                                                            <span className="gi-clr-block transition-all duration-[0.3s] ease-in-out w-[22px] h-[22px] rounded-[50%] opacity-[0.7] bg-transparent cursor-pointer tracking-[0.02rem]" style={{ backgroundColor: '#6556ff' }} />
                                                            <span className="checked w-[20px] h-[20px] bg-transparent border-[0] absolute top-[50%] left-[0] transition-all duration-[300ms] linear translate-y-[-50%] rounded-[5px] overflow-hidden" />
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Sidebar Price Block */}
                                        <div className="gi-sidebar-block mb-[15px]">
                                            <div className="gi-sb-title border-b-[1px] border-solid border-[#eee] pb-[15px]">
                                                <h3 className="gi-sidebar-title font-semibold tracking-[0] relative text-[#4b5966] w-full flex justify-between font-Poppins text-[17px] leading-[1.2]">Price</h3>
                                            </div>
                                            <div className="gi-sb-block-content gi-price-range-slider es-price-slider mt-[20px]">
                                                <div className="gi-price-filter flex justify-between flex-col">
                                                    <div className="gi-price-input mb-[15px] p-[10px] flex justify-center items-center rounded-[5px] bg-[#f8f8fb]">
                                                        <label className="filter__label text-[14px] text-[#777] flex flex-col justify-center items-center">
                                                            From
                                                            <input type="text" className="filter__input rounded-[5px] h-[30px] border-[0] p-[0] max-w-[48px] leading-[30px] bg-[#fff] text-center text-[14px] text-[#777] outline-[0]" />
                                                        </label>
                                                        <span className="gi-price-divider relative border-b-[1px] border-solid border-[#777] w-[10px] h-[1px] mx-[10px]" />
                                                        <label className="filter__label text-[14px] text-[#777] flex flex-col justify-center items-center">
                                                            To<input type="text" className="filter__input rounded-[5px] h-[30px] border-[0] p-[0] max-w-[48px] leading-[30px] bg-[#fff] text-center text-[14px] text-[#777] outline-[0]" />
                                                        </label>
                                                    </div>
                                                    <div id="gi-sliderPrice" className="filter__slider-price" data-min={0} data-max={250} data-step={10} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Sidebar tags */}
                                        <div className="gi-sidebar-block">
                                            <div className="gi-sb-title border-b-[1px] border-solid border-[#eee] pb-[15px]">
                                                <h3 className="gi-sidebar-title font-semibold tracking-[0] relative text-[#4b5966] w-full flex justify-between font-Poppins text-[17px] leading-[1.2]">Tags</h3>
                                            </div>
                                            <div className="gi-tag-block gi-sb-block-content mt-[15px]">
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">Clothes</a>
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">Fruits</a>
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">Snacks</a>
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">Dairy</a>
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">Seafood</a>
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">Fastfood</a>
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">Toys</a>
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">perfume</a>
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">jewelry</a>
                                                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2 transition-all duration-[0.3s] ease-in-out my-[2px] py-[3px] px-[8px] inline-flex flex-row flex-wrap capitalize font-light text-[13px] tracking-[0.02rem] bg-[#5caf90] text-[#fff] text-center rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]">Bags</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Guest>
        </>
    )
}
