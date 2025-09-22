import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

const Header = ({ user, cartCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data, setData, get } = useForm({
    search: '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    get(route('products.index', { search: data.search }));
  };

  return (
    <header className="gi-header relative">
      {/* Top Header */}
      <div className="gi-top-header bg-[#f8f8f8] py-[10px] border-b-[1px] border-solid border-[#eee]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="gi-top-left min-[992px]:w-[50%] w-full">
            <div className="gi-top-call flex items-center">
              <span className="gi-call-icon mr-[10px]">
                <i className="fi fi-rr-phone-call text-[#777] text-[20px]"></i>
              </span>
              <span className="gi-call-content">
                <span className="gi-call-no text-[#777] text-[14px] font-normal">Call: +1 123 456 7890</span>
              </span>
            </div>
          </div>
          <div className="gi-top-right min-[992px]:w-[50%] w-full">
            <ul className="flex items-center justify-end">
              {user ? (
                <>
                  <li className="relative mr-[15px]">
                    <Link href={route('dashboard')} className="text-[#777] text-[14px] font-normal hover:text-[#5caf90]">
                      Dashboard
                    </Link>
                  </li>
                  <li className="relative mr-[15px]">
                    <Link href={route('profile.edit')} className="text-[#777] text-[14px] font-normal hover:text-[#5caf90]">
                      Profile
                    </Link>
                  </li>
                  <li className="relative">
                    <Link href={route('logout')} method="post" as="button" className="text-[#777] text-[14px] font-normal hover:text-[#5caf90]">
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="relative mr-[15px]">
                    <Link href={route('login')} className="text-[#777] text-[14px] font-normal hover:text-[#5caf90]">
                      Login
                    </Link>
                  </li>
                  <li className="relative">
                    <Link href={route('register')} className="text-[#777] text-[14px] font-normal hover:text-[#5caf90]">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Header Bottom */}
      <div className="gi-header-bottom py-[20px] bg-[#fff]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="gi-header-logo min-[992px]:w-[20%] min-[768px]:w-[25%] w-[50%]">
            <Link href="/" className="block">
              <img src="/assets/img/logo.png" alt="Site Logo" className="max-w-full" />
            </Link>
          </div>
          <div className="gi-header-search min-[992px]:w-[50%] min-[768px]:w-[50%] w-full order-last min-[768px]:order-none min-[768px]:mt-[0] mt-[15px]">
            <form onSubmit={handleSearch} className="gi-search-form relative">
              <input 
                type="text" 
                className="gi-search-input w-full h-[45px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[14px] text-[#777] outline-none focus:border-[#5caf90]" 
                placeholder="Search products..."
                value={data.search}
                onChange={(e) => setData('search', e.target.value)}
              />
              <button 
                type="submit" 
                className="gi-search-btn absolute top-[0] right-[0] h-[45px] px-[15px] bg-[#5caf90] text-[#fff] text-[14px] font-medium rounded-tr-[5px] rounded-br-[5px] hover:bg-[#4b5966]"
              >
                Search
              </button>
            </form>
          </div>
          <div className="gi-header-icons min-[992px]:w-[30%] min-[768px]:w-[25%] w-[50%] flex justify-end">
            <div className="gi-header-wishlist relative mr-[15px]">
              <Link href={route('wishlist.index')} className="gi-wishlist-icon flex items-center justify-center w-[45px] h-[45px] bg-[#f8f8f8] rounded-[5px] hover:bg-[#5caf90] hover:text-[#fff] transition-all duration-[0.3s] ease-in-out">
                <i className="fi fi-rr-heart text-[20px]"></i>
              </Link>
            </div>
            <div className="gi-header-cart relative">
              <Link href={route('cart')} className="gi-cart-icon flex items-center justify-center w-[45px] h-[45px] bg-[#f8f8f8] rounded-[5px] hover:bg-[#5caf90] hover:text-[#fff] transition-all duration-[0.3s] ease-in-out">
                <i className="fi fi-rr-shopping-basket text-[20px]"></i>
                {cartCount > 0 && (
                  <span className="gi-cart-count absolute top-[-5px] right-[-5px] w-[20px] h-[20px] bg-[#5caf90] text-[#fff] text-[10px] font-medium flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header Menu */}
      <div className="gi-header-menu bg-[#f8f8f8] border-t-[1px] border-solid border-[#eee] border-b-[1px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="gi-main-menu-wrapper min-[992px]:w-full w-auto">
            <div className="gi-menu-toggle min-[992px]:hidden block">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="gi-menu-btn flex items-center justify-center w-[45px] h-[45px] bg-[#5caf90] text-[#fff] rounded-[5px]"
              >
                <i className={`fi ${mobileMenuOpen ? 'fi-rr-cross' : 'fi-rr-menu-burger'} text-[20px]`}></i>
              </button>
            </div>
            <nav className={`gi-main-menu ${mobileMenuOpen ? 'block' : 'min-[992px]:block hidden'}`}>
              <ul className="flex min-[992px]:flex-row flex-col">
                <li className="relative min-[992px]:mr-[20px]">
                  <Link href="/" className="gi-menu-link block py-[15px] px-[0] text-[14px] font-medium text-[#333] hover:text-[#5caf90]">
                    Home
                  </Link>
                </li>
                <li className="relative min-[992px]:mr-[20px]">
                  <Link href={route('products.index')} className="gi-menu-link block py-[15px] px-[0] text-[14px] font-medium text-[#333] hover:text-[#5caf90]">
                    Products
                  </Link>
                </li>
                <li className="relative min-[992px]:mr-[20px]">
                  <Link href={route('categories.index')} className="gi-menu-link block py-[15px] px-[0] text-[14px] font-medium text-[#333] hover:text-[#5caf90]">
                    Categories
                  </Link>
                </li>
                <li className="relative min-[992px]:mr-[20px]">
                  <Link href={route('about-us')} className="gi-menu-link block py-[15px] px-[0] text-[14px] font-medium text-[#333] hover:text-[#5caf90]">
                    About Us
                  </Link>
                </li>
                <li className="relative">
                  <Link href={route('contact-us')} className="gi-menu-link block py-[15px] px-[0] text-[14px] font-medium text-[#333] hover:text-[#5caf90]">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;