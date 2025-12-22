import { Link } from '@inertiajs/react';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-grabit-dark text-gray-300">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <div className="mb-6">
                            <img
                                src="/images/logo/logo.png"
                                alt="Logo"
                                className="h-10 w-auto brightness-0 invert"
                            />
                        </div>
                        <p className="text-sm mb-4 text-gray-400">
                            Your trusted online shopping destination with quality products and fast delivery.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="w-8 h-8 bg-grabit-dark-secondary rounded-full flex items-center justify-center hover:bg-grabit-primary transition-colors"
                            >
                                <FiFacebook className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-grabit-dark-secondary rounded-full flex items-center justify-center hover:bg-grabit-primary transition-colors"
                            >
                                <FiTwitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-grabit-dark-secondary rounded-full flex items-center justify-center hover:bg-grabit-primary transition-colors"
                            >
                                <FiInstagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-sm hover:text-grabit-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm hover:text-grabit-primary transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-sm hover:text-grabit-primary transition-colors">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/track-order" className="text-sm hover:text-grabit-primary transition-colors">
                                    Track Order
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-lg mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/faq" className="text-sm hover:text-grabit-primary transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="text-sm hover:text-grabit-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm hover:text-grabit-primary transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-sm hover:text-grabit-primary transition-colors">
                                    Returns & Refunds
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-lg mb-4">Contact Info</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <FiMapPin className="w-5 h-5 text-grabit-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm">
                                    123 Street Name, City, Country
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FiPhone className="w-5 h-5 text-grabit-primary flex-shrink-0" />
                                <a href="tel:+919876543210" className="text-sm hover:text-grabit-primary">
                                    +91 987 654 3210
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FiMail className="w-5 h-5 text-grabit-primary flex-shrink-0" />
                                <a href="mailto:info@example.com" className="text-sm hover:text-grabit-primary">
                                    info@example.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Newsletter */}
            <div className="bg-grabit-dark-secondary">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                            <h3 className="text-white font-heading font-semibold text-lg mb-2">Subscribe to Newsletter</h3>
                            <p className="text-sm text-gray-400">Get latest updates and offers</p>
                        </div>
                        <div>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 rounded-md bg-grabit-dark text-white border border-gray-600 focus:outline-none focus:border-grabit-primary text-sm"
                                />
                                <button
                                    type="submit"
                                    className="bg-grabit-primary hover:bg-grabit-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors text-sm"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-grabit-dark-secondary border-t border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                        <p>&copy; {currentYear} Ecommerce. All rights reserved.</p>
                        <div className="flex items-center space-x-4 mt-2 md:mt-0">
                            <img src="/images/payment/visa.png" alt="Visa" className="h-6 opacity-70" onError={(e) => e.currentTarget.style.display = 'none'} />
                            <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-6 opacity-70" onError={(e) => e.currentTarget.style.display = 'none'} />
                            <img src="/images/payment/paypal.png" alt="PayPal" className="h-6 opacity-70" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
