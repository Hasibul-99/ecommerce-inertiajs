import React from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { FiTrash2, FiShoppingCart, FiStar, FiCheck, FiX } from 'react-icons/fi';

interface CompareProduct {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  inStock: boolean;
  description: string;
  sku: string;
  weight: string;
  dimensions: string;
  color: string[];
  material: string;
}

const Compare: React.FC = () => {
  // Mock data for compare products
  const compareProducts: CompareProduct[] = [
    {
      id: 1,
      name: 'Crunchy Triangle Chips Snacks',
      price: 56.00,
      oldPrice: 75.00,
      image: '/assets/img/product-images/1_1.jpg',
      rating: 4.5,
      inStock: true,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae tortor ut ex pulvinar tincidunt.',
      sku: 'SKU-12345',
      weight: '250g',
      dimensions: '10 × 5 × 15 cm',
      color: ['Red', 'Blue', 'Green'],
      material: 'Organic'
    },
    {
      id: 2,
      name: 'Dates Value Pack Pouch',
      price: 75.00,
      image: '/assets/img/product-images/2_1.jpg',
      rating: 5,
      inStock: true,
      description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti.',
      sku: 'SKU-67890',
      weight: '500g',
      dimensions: '12 × 8 × 20 cm',
      color: ['Brown', 'Black'],
      material: 'Natural'
    },
    {
      id: 3,
      name: 'Californian Almonds Value Pack',
      price: 48.00,
      oldPrice: 60.00,
      image: '/assets/img/product-images/3_1.jpg',
      rating: 3.5,
      inStock: false,
      description: 'Sed eu diam ut orci vehicula varius. Donec at nisi neque.',
      sku: 'SKU-24680',
      weight: '350g',
      dimensions: '15 × 10 × 5 cm',
      color: ['Natural'],
      material: 'Organic'
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
      <Head title="Compare Products" />
      
      {/* Breadcrumb start */}
      <div className="mb-10 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-3">
              <div className="flex flex-wrap p-4 border border-gray-200 rounded-b-md border-t-0">
                <div className="md:w-1/2 w-full px-3">
                  <h2 className="text-gray-700 text-base font-semibold my-0 mx-auto capitalize md:mb-0 mb-1 md:text-left text-center">Compare Products</h2>
                </div>
                <div className="md:w-1/2 w-full px-3">
                  <ul className="text-right md:text-right text-center">
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize">
                      <Link href="/" className="relative text-gray-700">Home</Link>
                    </li>
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize ml-2 before:content-['/'] before:mr-2">Compare</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb end */}

      {/* Compare section */}
      <section className="py-10 md:py-8">
        <h2 className="sr-only">Compare Products Page</h2>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-3">
              {compareProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-200 p-4 text-left font-medium text-gray-700 w-1/4">Product Info</th>
                        {compareProducts.map((product) => (
                          <th key={product.id} className="border border-gray-200 p-4 text-center font-medium text-gray-700">
                            <div className="relative">
                              <button className="absolute top-0 right-0 text-gray-500 hover:text-red-500">
                                <FiTrash2 />
                              </button>
                              <div className="flex flex-col items-center">
                                <Link href={`/product/${product.id}`} className="block mb-2">
                                  <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mx-auto" />
                                </Link>
                                <h3 className="text-base font-medium mb-2">
                                  <Link href={`/product/${product.id}`} className="text-gray-800 hover:text-emerald-600">
                                    {product.name}
                                  </Link>
                                </h3>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">Price</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-price`} className="border border-gray-200 p-4 text-center">
                            <span className="text-emerald-600 font-semibold">${product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                              <span className="block text-gray-500 line-through text-sm">${product.oldPrice.toFixed(2)}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">Description</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-desc`} className="border border-gray-200 p-4 text-center text-gray-600 text-sm">
                            {product.description}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">Availability</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-stock`} className="border border-gray-200 p-4 text-center">
                            <span className={`${product.inStock ? 'text-emerald-600' : 'text-red-500'} font-medium`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">Rating</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-rating`} className="border border-gray-200 p-4 text-center">
                            <div className="flex items-center justify-center">
                              {renderStars(product.rating)}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">SKU</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-sku`} className="border border-gray-200 p-4 text-center text-gray-600">
                            {product.sku}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">Weight</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-weight`} className="border border-gray-200 p-4 text-center text-gray-600">
                            {product.weight}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">Dimensions</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-dimensions`} className="border border-gray-200 p-4 text-center text-gray-600">
                            {product.dimensions}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">Color</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-color`} className="border border-gray-200 p-4 text-center text-gray-600">
                            {product.color.join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">Material</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-material`} className="border border-gray-200 p-4 text-center text-gray-600">
                            {product.material}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-4 font-medium text-gray-700">Actions</td>
                        {compareProducts.map((product) => (
                          <td key={`${product.id}-actions`} className="border border-gray-200 p-4 text-center">
                            <button 
                              className={`transition-all duration-300 ease-in-out overflow-hidden text-center relative rounded-md py-2 px-4 ${product.inStock ? 'bg-emerald-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} border-0 text-sm tracking-normal font-medium inline-flex items-center mb-2 w-full justify-center`}
                              disabled={!product.inStock}
                            >
                              <FiShoppingCart className="mr-2" /> Add to Cart
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">No products to compare</h3>
                  <p className="text-gray-600 mb-6">You haven't added any products to compare yet.</p>
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
      {/* Compare section End */}
    </GuestLayout>
  );
};

export default Compare;