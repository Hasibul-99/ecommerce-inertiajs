import React from 'react'
import { Link } from '@inertiajs/react'

export default function Footer() {
    return (
        <footer className="gi-footer bg-[#fff] border-t-[1px] border-solid border-[#eee] mt-[40px]">
            <div className="footer-container">
                <div className="footer-top py-[80px] max-[767px]:py-[60px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="w-full flex flex-wrap">
                            <div className="min-[992px]:w-[25%] px-[12px] w-full gi-footer-cat wow fadeInUp">
                                <div className="gi-footer-widget gi-footer-company flex flex-col">
                                    <Link href="/"><img src="assets/img/logo/logo.png" className="gi-footer-logo max-w-[144px] max-[767px]:max-w-[130px]  mb-[30px]" alt="footer logo" /></Link>
                                    <p className="gi-footer-detail max-w-[400px] mb-[30px] p-[0] text-[14px] leading-[27px] font-normal text-[#777] inline-block relative max-[1199px]:text-[14px]">Grabit is the biggest market of grocery products. Get your
                                        daily needs from our store.</p>
                                    <div className="gi-app-store mb-[30px] flex flex-row max-[1199px]:flex-col max-[991px]:flex-row max-[320px]:flex-col">
                                        <Link href="#" className="app-img"><img src="assets/img/app/android.png" className="adroid max-w-[140px] max-[1399px]:max-w-[120px]  mb-[15px] rounded-[5px] mr-[15px]" alt="apple" /></Link>
                                        <Link href="#" className="app-img"><img src="assets/img/app/apple.png" className="apple max-w-[140px] max-[1399px]:max-w-[120px] mb-[15px] rounded-[5px]" alt="apple" /></Link>
                                    </div>
                                </div>
                            </div>
                            <div className="min-[992px]:w-[16.66%] gi-footer-toggle px-[12px] w-full gi-footer-info wow fadeInUp" data-wow-delay="0.2s">
                                <div className="gi-footer-widget">
                                    <h4 className="gi-footer-heading text-[18px] font-medium mb-[20px] text-[#4b5966] leading-[1.2] tracking-[0] relative block w-full pb-[15px] capitalize font-Poppins border-b-[1px] border-solid border-[#eee] max-[991px]:mb-[20px] max-[991px]:text-[14px]">Category</h4>
                                    <div className="gi-footer-links gi-footer-dropdown">
                                        <ul className="align-itegi-center">
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/shop" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Dairy &amp; Milk</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/shop" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Snack &amp; Spice</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/shop" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Fast Food</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/shop" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Juice &amp; Drinks</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/shop" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Bakery</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center">
                                                <Link href="/shop" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Seafood</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="min-[992px]:w-[16.66%] gi-footer-toggle px-[12px] w-full gi-footer-account wow fadeInUp" data-wow-delay="0.3s">
                                <div className="gi-footer-widget">
                                    <h4 className="gi-footer-heading text-[18px] font-medium mb-[20px] text-[#4b5966] leading-[1.2] tracking-[0] relative block w-full pb-[15px] capitalize font-Poppins border-b-[1px] border-solid border-[#eee] max-[991px]:mb-[20px] max-[991px]:text-[14px]">Company</h4>
                                    <div className="gi-footer-links gi-footer-dropdown">
                                        <ul className="align-itegi-center">
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/about" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">About us</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/track-order" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Delivery</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/privacy-policy" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Legal Notice</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/terms-conditions" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Terms &amp; conditions</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/checkout" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Secure payment</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center">
                                                <Link href="/contact" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Contact us</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="min-[992px]:w-[16.66%] gi-footer-toggle px-[12px] w-full gi-footer-service wow fadeInUp" data-wow-delay="0.4s">
                                <div className="gi-footer-widget">
                                    <h4 className="gi-footer-heading text-[18px] font-medium mb-[20px] text-[#4b5966] leading-[1.2] tracking-[0] relative block w-full pb-[15px] capitalize font-Poppins border-b-[1px] border-solid border-[#eee] max-[991px]:mb-[20px] max-[991px]:text-[14px]">Account</h4>
                                    <div className="gi-footer-links gi-footer-dropdown">
                                        <ul className="align-itegi-center">
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/login" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Sign In</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/cart" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">View Cart</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="/return-policy" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Return Policy</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="#" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Become a Vendor</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                <Link href="#" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Affiliate Program</Link>
                                            </li>
                                            <li className="gi-footer-link m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center">
                                                <Link href="/checkout" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">Payments</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="min-[992px]:w-[25%] gi-footer-toggle px-[12px] w-full gi-footer-cont-social mb-[-20px] wow fadeInUp" data-wow-delay="0.5s">
                                <div className="gi-footer-contact mb-[30px] max-[991px]:mb-[0]">
                                    <div className="gi-footer-widget">
                                        <h4 className="gi-footer-heading text-[18px] font-medium mb-[20px] text-[#4b5966] leading-[1.2] tracking-[0] relative block w-full pb-[15px] capitalize font-Poppins border-b-[1px] border-solid border-[#eee] max-[991px]:mb-[20px] max-[991px]:text-[14px]">Contact</h4>
                                        <div className="gi-footer-links gi-footer-dropdown">
                                            <ul className="align-itegi-center">
                                                <li className="gi-footer-link gi-foo-location m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                    <span className="w-[25px] flex basis-auto grow-[0] shrink-[0]">
                                                        <i className="fi fi-rr-marker location leading-[0] text-[18px] mt-[5px] h-[25px] text-[#5caf90] w-[auto]" />
                                                    </span>
                                                    <p className="m-[0] text-[14px] font-normal text-[#777]">2548 Broaddus Maple Court, Madisonville KY 4783, USA.</p>
                                                </li>
                                                <li className="gi-footer-link gi-foo-call m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                    <span className="w-[25px] flex basis-auto grow-[0] shrink-[0]">
                                                        <i className="fi fi-brands-whatsapp leading-[0] text-[18px] h-[20px] text-[#5caf90] w-[auto]" />
                                                    </span>
                                                    <Link href="tel:+009876543210" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">+00 9876543210</Link>
                                                </li>
                                                <li className="gi-footer-link gi-foo-mail m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
                                                    <span className="w-[25px] flex basis-auto grow-[0] shrink-[0]">
                                                        <i className="fi fi-rr-envelope leading-[0] text-[18px] h-[20px] text-[#5caf90] w-[auto]" />
                                                    </span>
                                                    <Link href="mailto:example@email.com" className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-[#777] mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]">example@email.com</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="gi-footer-social">
                                    <div className="gi-footer-widget">
                                        <div className="gi-footer-links gi-footer-dropdown">
                                            <ul className="align-itegi-center flex flex-wrap">
                                                <li className="gi-footer-link pr-[5px]">
                                                    <Link href="#" className="h-[30px] w-[30px] bg-[#4b5966] rounded-[5px] capitalize flex items-center justify-center text-[15px]"><i className="gicon gi-facebook text-[16px] text-[#fff]" aria-hidden="true" /></Link>
                                                </li>
                                                <li className="gi-footer-link pr-[5px]">
                                                    <Link href="#" className="h-[30px] w-[30px] bg-[#4b5966] rounded-[5px] capitalize flex items-center justify-center text-[15px]"><i className="gicon gi-twitter text-[16px] text-[#fff]" aria-hidden="true" /></Link>
                                                </li>
                                                <li className="gi-footer-link pr-[5px]">
                                                    <Link href="#" className="h-[30px] w-[30px] bg-[#4b5966] rounded-[5px] capitalize flex items-center justify-center text-[15px]"><i className="gicon gi-linkedin text-[16px] text-[#fff]" aria-hidden="true" /></Link>
                                                </li>
                                                <li className="gi-footer-link pr-[5px]">
                                                    <Link href="#" className="h-[30px] w-[30px] bg-[#4b5966] rounded-[5px] capitalize flex items-center justify-center text-[15px]"><i className="gicon gi-instagram text-[16px] text-[#fff]" aria-hidden="true" /></Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom py-[10px] max-[991px]:py-[15px] border-t-[1px] border-solid border-[#eee] bg-[#f8f8fb]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="w-full flex flex-wrap">
                            <div className="gi-bottom-info flex flex-row items-center justify-between w-full px-[12px] max-[991px]:flex-col">
                                {/* Footer Copyright Start */}
                                <div className="footer-copy max-[991px]:mb-[15px]">
                                    <div className="footer-bottom-copy">
                                        <div className="gi-copy text-[#777] text-[13px] tracking-[1px] text-center font-light">Copyright ©
                                            <Link className="site-name text-[#5caf90]" href="/">Grabit</Link>
                                            all rights reserved. Powered by Grabit.</div>
                                    </div>
                                </div>
                                {/* Footer Copyright End */}
                                {/* Footer payment */}
                                <div className="footer-bottom-right">
                                    <div className="footer-bottom-payment flex justify-content-center">
                                        <div className="payment-link">
                                            <img src="assets/img/hero-bg/payment.png" alt="payment" />
                                        </div>
                                    </div>
                                </div>
                                {/* Footer payment */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    )
}
