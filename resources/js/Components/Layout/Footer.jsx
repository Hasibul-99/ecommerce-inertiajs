import React from 'react';
import { Link } from '@inertiajs/react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gi-footer bg-[#f8f8f8] pt-[40px] pb-[20px] border-t-[1px] border-solid border-[#eee]">
      <div className="flex flex-wrap justify-between items-start mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
        {/* Footer Logo */}
        <div className="gi-footer-logo min-[992px]:w-[25%] min-[768px]:w-[50%] w-full mb-[30px]">
          <Link href="/" className="block mb-[15px]">
            <img src="/assets/img/logo.png" alt="Site Logo" className="max-w-full" />
          </Link>
          <p className="text-[14px] text-[#777] mb-[15px]">
            We are a team of designers and developers that create high quality e-commerce websites.
          </p>
          <div className="gi-footer-social flex">
            <a href="#" className="gi-social-btn flex items-center justify-center w-[35px] h-[35px] bg-[#fff] text-[#777] rounded-full mr-[10px] hover:bg-[#5caf90] hover:text-[#fff] transition-all duration-[0.3s] ease-in-out">
              <i className="fi fi-brands-facebook text-[16px]"></i>
            </a>
            <a href="#" className="gi-social-btn flex items-center justify-center w-[35px] h-[35px] bg-[#fff] text-[#777] rounded-full mr-[10px] hover:bg-[#5caf90] hover:text-[#fff] transition-all duration-[0.3s] ease-in-out">
              <i className="fi fi-brands-twitter text-[16px]"></i>
            </a>
            <a href="#" className="gi-social-btn flex items-center justify-center w-[35px] h-[35px] bg-[#fff] text-[#777] rounded-full mr-[10px] hover:bg-[#5caf90] hover:text-[#fff] transition-all duration-[0.3s] ease-in-out">
              <i className="fi fi-brands-instagram text-[16px]"></i>
            </a>
            <a href="#" className="gi-social-btn flex items-center justify-center w-[35px] h-[35px] bg-[#fff] text-[#777] rounded-full hover:bg-[#5caf90] hover:text-[#fff] transition-all duration-[0.3s] ease-in-out">
              <i className="fi fi-brands-youtube text-[16px]"></i>
            </a>
          </div>
        </div>

        {/* Information Links */}
        <div className="gi-footer-info min-[992px]:w-[25%] min-[768px]:w-[50%] w-full mb-[30px]">
          <h3 className="gi-footer-title text-[16px] font-medium text-[#333] mb-[15px] pb-[10px] border-b-[1px] border-solid border-[#eee]">
            Information
          </h3>
          <ul className="gi-footer-links">
            <li className="mb-[8px]">
              <Link href={route('about-us')} className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                About Us
              </Link>
            </li>
            <li className="mb-[8px]">
              <Link href={route('contact-us')} className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                Contact Us
              </Link>
            </li>
            <li className="mb-[8px]">
              <Link href="#" className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                Terms & Conditions
              </Link>
            </li>
            <li className="mb-[8px]">
              <Link href="#" className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                Returns & Exchanges
              </Link>
            </li>
            <li className="mb-[8px]">
              <Link href="#" className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Account Links */}
        <div className="gi-footer-account min-[992px]:w-[25%] min-[768px]:w-[50%] w-full mb-[30px]">
          <h3 className="gi-footer-title text-[16px] font-medium text-[#333] mb-[15px] pb-[10px] border-b-[1px] border-solid border-[#eee]">
            Account
          </h3>
          <ul className="gi-footer-links">
            <li className="mb-[8px]">
              <Link href={route('login')} className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                Sign In
              </Link>
            </li>
            <li className="mb-[8px]">
              <Link href={route('cart')} className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                View Cart
              </Link>
            </li>
            <li className="mb-[8px]">
              <Link href={route('wishlist.index')} className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                My Wishlist
              </Link>
            </li>
            <li className="mb-[8px]">
              <Link href="#" className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                Track My Order
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[14px] text-[#777] hover:text-[#5caf90] hover:ml-[5px] transition-all duration-[0.3s] ease-in-out">
                Help
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="gi-footer-newsletter min-[992px]:w-[25%] min-[768px]:w-[50%] w-full mb-[30px]">
          <h3 className="gi-footer-title text-[16px] font-medium text-[#333] mb-[15px] pb-[10px] border-b-[1px] border-solid border-[#eee]">
            Newsletter
          </h3>
          <p className="text-[14px] text-[#777] mb-[15px]">
            Sign up for our newsletter to receive updates and exclusive offers.
          </p>
          <form className="gi-newsletter-form relative">
            <input 
              type="email" 
              className="gi-newsletter-input w-full h-[45px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[14px] text-[#777] outline-none focus:border-[#5caf90]" 
              placeholder="Your email address"
            />
            <button 
              type="submit" 
              className="gi-newsletter-btn absolute top-[0] right-[0] h-[45px] px-[15px] bg-[#5caf90] text-[#fff] text-[14px] font-medium rounded-tr-[5px] rounded-br-[5px] hover:bg-[#4b5966]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="gi-footer-bottom pt-[20px] mt-[10px] border-t-[1px] border-solid border-[#eee]">
        <div className="flex flex-wrap justify-center items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="gi-copyright w-full text-center">
            <p className="text-[14px] text-[#777]">
              © {currentYear} All Rights Reserved. Designed by Your Company Name
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;