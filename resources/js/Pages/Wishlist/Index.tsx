import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';

interface WishlistItem {
  id: number;
  image: string;
  name: string;
  date: string;
  price: string;
  status: string;
}

export default function WishlistIndex() {
  // Mock data for wishlist items
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      image: '/assets/img/product/p-1.jpg',
      name: 'Fresh Organic Strawberry',
      date: 'June 24, 2023',
      price: '$25.00',
      status: 'In Stock',
    },
    {
      id: 2,
      image: '/assets/img/product/p-2.jpg',
      name: 'Fresh Green Apple',
      date: 'June 25, 2023',
      price: '$15.00',
      status: 'In Stock',
    },
    {
      id: 3,
      image: '/assets/img/product/p-3.jpg',
      name: 'Fresh Orange Juice',
      date: 'June 26, 2023',
      price: '$18.00',
      status: 'Out of Stock',
    },
  ]);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <GuestLayout>
      <Head title="Wishlist" />
      
      {/* Breadcrumb Section */}
      <section className="gi-breadcrumb-section py-[20px] bg-[#f8f8fb]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="w-full px-[12px]">
            <div className="gi-breadcrumb-box">
              <h1 className="gi-breadcrumb-title text-[20px] font-medium text-[#4b5966] capitalize tracking-[0.02rem] leading-[1.2] mb-[6px]">Wishlist</h1>
              <ul className="gi-breadcrumb-list flex flex-wrap items-center">
                <li className="gi-breadcrumb-item text-[14px] text-[#777] font-normal leading-[1.5] tracking-[0.02rem] relative pr-[10px] mr-[10px] before:content-['/'] before:absolute before:right-0 before:top-0">
                  <Link href="/" className="text-[#777] hover:text-[#5caf90]">Home</Link>
                </li>
                <li className="gi-breadcrumb-item text-[14px] text-[#777] font-normal leading-[1.5] tracking-[0.02rem] relative">
                  Wishlist
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Wishlist Section */}
      <section className="gi-wishlist-section py-[40px] max-[767px]:py-[30px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] relative">
          <div className="w-full px-[12px]">
            <div className="gi-wishlist-table">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-spacing-0">
                  <thead>
                    <tr className="bg-[#f8f8fb]">
                      <th className="py-[15px] px-[10px] text-[14px] text-[#4b5966] font-medium tracking-[0.02rem] leading-[1.2] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">ID</th>
                      <th className="py-[15px] px-[10px] text-[14px] text-[#4b5966] font-medium tracking-[0.02rem] leading-[1.2] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">Image</th>
                      <th className="py-[15px] px-[10px] text-[14px] text-[#4b5966] font-medium tracking-[0.02rem] leading-[1.2] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">Name</th>
                      <th className="py-[15px] px-[10px] text-[14px] text-[#4b5966] font-medium tracking-[0.02rem] leading-[1.2] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">Date</th>
                      <th className="py-[15px] px-[10px] text-[14px] text-[#4b5966] font-medium tracking-[0.02rem] leading-[1.2] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">Price</th>
                      <th className="py-[15px] px-[10px] text-[14px] text-[#4b5966] font-medium tracking-[0.02rem] leading-[1.2] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">Status</th>
                      <th className="py-[15px] px-[10px] text-[14px] text-[#4b5966] font-medium tracking-[0.02rem] leading-[1.2] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistItems.length > 0 ? (
                      wishlistItems.map((item) => (
                        <tr key={item.id}>
                          <td className="py-[15px] px-[10px] text-[14px] text-[#777] font-normal tracking-[0.02rem] leading-[1.5] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">{item.id}</td>
                          <td className="py-[15px] px-[10px] text-[14px] text-[#777] font-normal tracking-[0.02rem] leading-[1.5] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">
                            <img src={item.image} alt={item.name} className="max-w-[80px] max-h-[80px] object-cover" />
                          </td>
                          <td className="py-[15px] px-[10px] text-[14px] text-[#777] font-normal tracking-[0.02rem] leading-[1.5] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">{item.name}</td>
                          <td className="py-[15px] px-[10px] text-[14px] text-[#777] font-normal tracking-[0.02rem] leading-[1.5] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">{item.date}</td>
                          <td className="py-[15px] px-[10px] text-[14px] text-[#777] font-normal tracking-[0.02rem] leading-[1.5] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">{item.price}</td>
                          <td className="py-[15px] px-[10px] text-[14px] text-[#777] font-normal tracking-[0.02rem] leading-[1.5] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">
                            <span className={item.status === 'In Stock' ? 'text-[#5caf90]' : 'text-[#ff6565]'}>{item.status}</span>
                          </td>
                          <td className="py-[15px] px-[10px] text-[14px] text-[#777] font-normal tracking-[0.02rem] leading-[1.5] text-left border-[1px] border-solid border-[#eee] max-[575px]:text-[13px]">
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <Link 
                                href="/cart" 
                                className={`gi-btn-1 py-[8px] px-[15px] bg-[#4b5966] text-[#fff] border-[0] transition-all duration-[0.3s] ease-in-out overflow-hidden text-center text-[14px] font-semibold relative rounded-[5px] hover:bg-[#5caf90] hover:text-[#fff] ${item.status !== 'In Stock' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={item.status !== 'In Stock'}
                              >
                                Add To Cart
                              </Link>
                              <button 
                                onClick={() => removeFromWishlist(item.id)} 
                                className="gi-btn-2 py-[8px] px-[15px] bg-[#ff6565] text-[#fff] border-[0] transition-all duration-[0.3s] ease-in-out overflow-hidden text-center text-[14px] font-semibold relative rounded-[5px] hover:bg-[#4b5966] hover:text-[#fff]"
                              >
                                Remove From List
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-[15px] px-[10px] text-[14px] text-[#777] font-normal tracking-[0.02rem] leading-[1.5] text-center border-[1px] border-solid border-[#eee]">
                          Your wishlist is empty
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}