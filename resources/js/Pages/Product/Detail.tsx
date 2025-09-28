import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { FiHeart, FiShoppingCart, FiStar, FiMinus, FiPlus, FiShare2 } from 'react-icons/fi';

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

interface ProductReview {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

const ProductDetail: React.FC = () => {
  // Mock product data
  const product = {
    id: 1,
    name: 'Crunchy Triangle Chips Snacks',
    price: 56.00,
    oldPrice: 75.00,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae tortor ut ex pulvinar tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. Sed eu diam ut orci vehicula varius. Donec at nisi neque.',
    sku: 'SKU-12345',
    category: 'Snacks',
    tags: ['Chips', 'Snacks', 'Crunchy'],
    stock: 15,
    rating: 4.5,
    reviewCount: 12
  };

  const productImages: ProductImage[] = [
    { id: 1, src: '/assets/img/product-images/1_1.jpg', alt: 'Product Image 1' },
    { id: 2, src: '/assets/img/product-images/1_2.jpg', alt: 'Product Image 2' },
    { id: 3, src: '/assets/img/product-images/1_3.jpg', alt: 'Product Image 3' },
    { id: 4, src: '/assets/img/product-images/1_4.jpg', alt: 'Product Image 4' }
  ];

  const productReviews: ProductReview[] = [
    {
      id: 1,
      author: 'John Doe',
      rating: 5,
      date: 'June 15, 2023',
      comment: 'Great product! The chips are very crunchy and tasty. Would definitely buy again.'
    },
    {
      id: 2,
      author: 'Jane Smith',
      rating: 4,
      date: 'May 22, 2023',
      comment: 'Good quality snack. The packaging was a bit damaged but the product inside was fine.'
    }
  ];

  // Related products
  const relatedProducts = [
    {
      id: 2,
      name: 'Dates Value Pack Pouch',
      price: 75.00,
      image: '/assets/img/product-images/2_1.jpg'
    },
    {
      id: 3,
      name: 'Californian Almonds Value Pack',
      price: 48.00,
      image: '/assets/img/product-images/3_1.jpg'
    },
    {
      id: 4,
      name: 'Banana Chips Snacks & Spices',
      price: 95.00,
      image: '/assets/img/product-images/4_1.jpg'
    },
    {
      id: 5,
      name: 'Fresh Organic Strawberry',
      price: 35.00,
      image: '/assets/img/product-images/5_1.jpg'
    }
  ];

  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(productImages[0]);

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
      <Head title={product.name} />
      
      {/* Breadcrumb start */}
      <div className="mb-10 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-3">
              <div className="flex flex-wrap p-4 border border-gray-200 rounded-b-md border-t-0">
                <div className="md:w-1/2 w-full px-3">
                  <h2 className="text-gray-700 text-base font-semibold my-0 mx-auto capitalize md:mb-0 mb-1 md:text-left text-center">Product Details</h2>
                </div>
                <div className="md:w-1/2 w-full px-3">
                  <ul className="text-right md:text-right text-center">
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize">
                      <Link href="/" className="relative text-gray-700">Home</Link>
                    </li>
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize ml-2 before:content-['/'] before:mr-2">
                      <Link href="/products" className="relative text-gray-700">Products</Link>
                    </li>
                    <li className="inline-block text-sm font-normal tracking-wide leading-tight capitalize ml-2 before:content-['/'] before:mr-2">{product.name}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb end */}

      {/* Product Detail section */}
      <section className="py-10 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-3">
            {/* Product Images */}
            <div className="lg:w-1/2 w-full px-3 mb-8 lg:mb-0">
              <div className="flex flex-wrap">
                {/* Main Image */}
                <div className="w-full mb-4">
                  <div className="border border-gray-200 rounded-md p-2">
                    <img 
                      src={activeImage.src} 
                      alt={activeImage.alt} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                {/* Thumbnail Images */}
                <div className="w-full">
                  <div className="flex flex-wrap -mx-2">
                    {productImages.map((image) => (
                      <div key={image.id} className="w-1/4 px-2 mb-4">
                        <button 
                          onClick={() => setActiveImage(image)}
                          className={`border ${activeImage.id === image.id ? 'border-emerald-500' : 'border-gray-200'} rounded-md p-1 w-full`}
                        >
                          <img 
                            src={image.src} 
                            alt={image.alt} 
                            className="w-full h-auto object-cover"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 w-full px-3">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviewCount} Reviews)</span>
                </div>
                <div className="mb-4">
                  <span className="text-xl font-semibold text-emerald-600 mr-2">${product.price.toFixed(2)}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.oldPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-gray-700 font-medium mr-2">Quantity:</span>
                  <div className="flex border border-gray-200 rounded-md">
                    <button 
                      onClick={decrementQuantity}
                      className="px-3 py-2 border-r border-gray-200 flex items-center justify-center"
                      disabled={quantity <= 1}
                    >
                      <FiMinus className={quantity <= 1 ? 'text-gray-300' : 'text-gray-600'} />
                    </button>
                    <input 
                      type="text" 
                      value={quantity} 
                      readOnly 
                      className="w-12 text-center border-none focus:outline-none"
                    />
                    <button 
                      onClick={incrementQuantity}
                      className="px-3 py-2 border-l border-gray-200 flex items-center justify-center"
                      disabled={quantity >= product.stock}
                    >
                      <FiPlus className={quantity >= product.stock ? 'text-gray-300' : 'text-gray-600'} />
                    </button>
                  </div>
                  <span className="ml-4 text-sm text-gray-600">{product.stock} items available</span>
                </div>

                <div className="flex flex-wrap items-center">
                  <button className="transition-all duration-300 ease-in-out overflow-hidden text-center relative rounded-md py-3 px-6 bg-emerald-600 text-white border-0 text-sm tracking-normal font-medium inline-flex items-center hover:bg-gray-700 hover:text-white mr-4 mb-2">
                    <FiShoppingCart className="mr-2" /> Add to Cart
                  </button>
                  <button className="transition-all duration-300 ease-in-out overflow-hidden text-center relative rounded-md py-3 px-6 bg-gray-100 text-gray-700 border-0 text-sm tracking-normal font-medium inline-flex items-center hover:bg-gray-200 mb-2">
                    <FiHeart className="mr-2" /> Add to Wishlist
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="mb-2">
                  <span className="text-gray-700 font-medium">SKU:</span>
                  <span className="text-gray-600 ml-2">{product.sku}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-700 font-medium">Category:</span>
                  <span className="text-gray-600 ml-2">{product.category}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-700 font-medium">Tags:</span>
                  <span className="text-gray-600 ml-2">{product.tags.join(', ')}</span>
                </div>
                <div className="mt-4">
                  <span className="text-gray-700 font-medium mr-2">Share:</span>
                  <div className="inline-flex items-center">
                    <button className="text-gray-500 hover:text-emerald-600 mr-3 bg-transparent border-0 p-0">
                      <FiShare2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <div className="flex flex-wrap">
                <button 
                  onClick={() => setActiveTab('description')}
                  className={`py-3 px-6 text-sm font-medium ${activeTab === 'description' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600'}`}
                >
                  Description
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`py-3 px-6 text-sm font-medium ${activeTab === 'reviews' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600'}`}
                >
                  Reviews ({productReviews.length})
                </button>
              </div>
            </div>

            <div className="py-6">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-gray-600 mb-4">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                  <p className="text-gray-600">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                  
                  {productReviews.length > 0 ? (
                    <div>
                      {productReviews.map((review) => (
                        <div key={review.id} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                          <div className="flex items-center mb-2">
                            <h4 className="text-base font-medium text-gray-800 mr-2">{review.author}</h4>
                            <span className="text-sm text-gray-500">- {review.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}

                      <div className="mt-8">
                        <h4 className="text-lg font-semibold mb-4">Add a Review</h4>
                        <form>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Your Rating *</label>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                  key={star} 
                                  type="button"
                                  className="text-gray-300 hover:text-yellow-400 mr-1"
                                >
                                  <FiStar className="text-xl" />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reviewComment">Your Review *</label>
                            <textarea 
                              id="reviewComment" 
                              rows={4} 
                              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500"
                              required
                            ></textarea>
                          </div>
                          <div className="flex flex-wrap -mx-2 mb-4">
                            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reviewName">Name *</label>
                              <input 
                                type="text" 
                                id="reviewName" 
                                className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500"
                                required
                              />
                            </div>
                            <div className="w-full md:w-1/2 px-2">
                              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reviewEmail">Email *</label>
                              <input 
                                type="email" 
                                id="reviewEmail" 
                                className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-emerald-500"
                                required
                              />
                            </div>
                          </div>
                          <button 
                            type="submit" 
                            className="transition-all duration-300 ease-in-out overflow-hidden text-center relative rounded-md py-3 px-6 bg-emerald-600 text-white border-0 text-sm tracking-normal font-medium inline-flex items-center hover:bg-gray-700 hover:text-white"
                          >
                            Submit Review
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">There are no reviews yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Related Products</h3>
            <div className="flex flex-wrap -mx-3">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-3 mb-6">
                  <div className="border border-gray-200 rounded-md p-4 h-full flex flex-col">
                    <div className="mb-4 relative">
                      <Link href={`/product/${relatedProduct.id}`}>
                        <img 
                          src={relatedProduct.image} 
                          alt={relatedProduct.name} 
                          className="w-full h-auto object-cover"
                        />
                      </Link>
                      <div className="absolute top-2 right-2 flex flex-col gap-2">
                        <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-emerald-600">
                          <FiHeart />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-emerald-600">
                          <FiShoppingCart />
                        </button>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-base font-medium text-gray-800 mb-2">
                        <Link href={`/product/${relatedProduct.id}`} className="hover:text-emerald-600">
                          {relatedProduct.name}
                        </Link>
                      </h4>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-yellow-400">
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <FiStar className="text-gray-300" />
                        </div>
                      </div>
                      <div>
                        <span className="text-emerald-600 font-semibold">${relatedProduct.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Product Detail section End */}
    </GuestLayout>
  );
};

export default ProductDetail;