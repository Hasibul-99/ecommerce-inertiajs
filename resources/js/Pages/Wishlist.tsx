import React from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { FiTrash2, FiShoppingCart, FiStar } from 'react-icons/fi';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  inStock: boolean;
}

const Wishlist: React.FC = () => {
  // Mock data for wishlist items
  const wishlistItems: WishlistItem[] = [
    {
      id: 1,
      name: 'Crunchy Triangle Chips Snacks',
      price: 56.00,
      oldPrice: 75.00,
      image: '/assets/img/product-images/1_1.jpg',
      rating: 4.5,
      inStock: true
    },
    {
      id: 2,
      name: 'Dates Value Pack Pouch',
      price: 75.00,
      image: '/assets/img/product-images/2_1.jpg',
      rating: 5,
      inStock: true
    },
    {
      id: 3,
      name: 'Californian Almonds Value Pack',
      price: 48.00,
      oldPrice: 60.00,
      image: '/assets/img/product-images/3_1.jpg',
      rating: 3.5,
      inStock: false
    },
    {
      id: 4,
      name: 'Banana Chips Snacks & Spices',
      price: 95.00,
      image: '/assets/img/product-images/4_1.jpg',
      rating: 4,
      inStock: true
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={`star-${i}`} className="text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half-star" className="relative">
          <FiStar className="text-gray-300" />
          <span className="absolute top-0 left-0 overflow-hidden w-1/2">
            <FiStar className="text-yellow-400 fill-current" />
          </span>
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FiStar key={`empty-star-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  return (
    <GuestLayout>
      <Head title="Wishlist" />
      
      {/* Breadcrumb start */}
      <div className="mb-10 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-3">
              <div className="flex flex-wrap p-4 border border-gray-200 rounded-b-md border-t-0">
                <div className="md:w-1/2 w-full px-3">
                  <h2 className="text-gray-700 text-base font-semibold my-0 mx-auto capitalize md:mb-0 mb-1 md:text-left text-center">Wishlist</h2>
                </div>
                <div className="md:w-1/2 w-full px-3">
                  <ul className="text-right md:text-right text-center">
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize">
                      <Link href="/" className="relative text-gray-700">Home</Link>
                    </li>
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize ml-2 before:content-['/'] before:mr-2">Wishlist</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb end */}

      {/* Wishlist section */}
      <section className="py-10 md:py-8">
        <h2 className="sr-only">Wishlist Page</h2>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-3">
              {wishlistItems.length > 0 ? (
                <div>
                  <div className="table-content wishlist-table-content">
                    <table className="w-full bg-white">
                      <thead className="md:table-header-group md:h-auto md:m-0 md:overflow-visible md:p-0 md:relative md:w-auto hidden">
                        <tr className="bg-white border-b-2 border-gray-200">
                          <th className="text-gray-700 text-sm font-medium pt-4 pb-3 px-4 text-left capitalize align-middle whitespace-nowrap leading-none tracking-normal">Product</th>
                          <th className="text-gray-700 text-sm font-medium pt-4 pb-3 px-4 text-left capitalize align-middle whitespace-nowrap leading-none tracking-normal">Price</th>
                          <th className="text-gray-700 text-sm font-medium pt-4 pb-3 px-4 text-center capitalize align-middle whitespace-nowrap leading-none tracking-normal">Stock Status</th>
                          <th className="text-gray-700 text-sm font-medium pt-4 pb-3 px-4 text-left capitalize align-middle whitespace-nowrap leading-none tracking-normal">Actions</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishlistItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-200 md:table-row md:border-b md:block md:mb-0 border mb-4">
                            <td data-label="Product" className="md:w-2/5 text-gray-700 text-base md:py-4 md:px-4 md:text-left w-full md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                              <Link href={`/product/${item.id}`} className="text-gray-600 font-normal text-sm flex leading-normal tracking-wide items-center">
                                <img className="w-14 mr-4" src={item.image} alt={item.name} />
                                <div>
                                  <span className="block">{item.name}</span>
                                  <div className="flex items-center mt-1">
                                    {renderStars(item.rating)}
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td data-label="Price" className="text-gray-700 font-medium text-sm md:py-4 md:px-4 md:text-left md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                              <div>
                                <span className="amount tracking-wide text-emerald-600 font-semibold">${item.price.toFixed(2)}</span>
                                {item.oldPrice && (
                                  <span className="amount tracking-wide text-gray-500 line-through ml-2">${item.oldPrice.toFixed(2)}</span>
                                )}
                              </div>
                            </td>
                            <td data-label="Stock Status" className="text-gray-700 text-base md:py-4 md:px-4 md:text-center md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                              <span className={`${item.inStock ? 'text-emerald-600' : 'text-red-500'} font-medium`}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td data-label="Actions" className="text-gray-700 text-sm font-medium md:py-4 md:px-4 md:text-left md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                              <button 
                                className={`transition-all duration-300 ease-in-out overflow-hidden text-center relative rounded-md py-2 px-4 ${item.inStock ? 'bg-emerald-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} border-0 text-sm tracking-normal font-medium inline-flex items-center`}
                                disabled={!item.inStock}
                              >
                                <FiShoppingCart className="mr-2" /> Add to Cart
                              </button>
                            </td>
                            <td data-label="Remove" className="text-gray-700 w-20 text-base md:py-4 md:px-4 md:text-right md:border-b-0 border-b border-gray-200 flex justify-between items-center text-sm py-2 px-2">
                              <button className="text-xl my-0 mx-auto text-gray-500 hover:text-red-500">
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-wrap">
                    <div className="w-full">
                      <div className="pt-8 flex justify-between">
                        <Link href="/products" className="text-gray-700 inline-block underline text-sm leading-5 font-medium tracking-wide">Continue Shopping</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-6">You don't have any products in your wishlist yet.</p>
                  <Link 
                    href="/products" 
                    className="transition-all duration-300 ease-in-out overflow-hidden text-center relative rounded-md py-3 px-6 bg-emerald-600 text-white border-0 text-sm tracking-normal font-medium inline-flex items-center hover:bg-gray-700 hover:text-white"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Wishlist section End */}
    </GuestLayout>
  );
};

export default Wishlist;