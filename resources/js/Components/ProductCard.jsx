import React from 'react';
import { Link } from '@inertiajs/react';

const ProductCard = ({ product }) => {
  // Extract product data with defaults for missing values
  const {
    id,
    title,
    slug,
    base_price_cents = 0,
    sale_price_cents,
    images = [],
    category,
  } = product || {};

  // Format price in dollars
  const formatPrice = (cents) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  // Get primary image or placeholder
  const primaryImage = images && images.length > 0 
    ? images[0].url 
    : 'assets/img/product-images/placeholder.jpg';
  
  // Get secondary image or use primary as fallback
  const secondaryImage = images && images.length > 1 
    ? images[1].url 
    : primaryImage;

  // Calculate discount percentage if sale price exists
  const discountPercentage = sale_price_cents && base_price_cents 
    ? Math.round(((base_price_cents - sale_price_cents) / base_price_cents) * 100) 
    : 0;

  return (
    <div className="min-[1200px]:w-[25%] min-[992px]:w-[33.33%] min-[768px]:w-[50%] min-[576px]:w-[50%] max-[420px]:w-full px-[12px] gi-product-box max-[575px]:w-[50%] max-[575px]:mx-auto pro-gl-content">
      <div className="gi-product-content pb-[24px] h-full flex">
        <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out cursor-pointer flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px] w-full">
          {/* Product Image */}
          <div className="gi-pro-image-outer transition-all duration-[0.3s] ease delay-[0s] z-[11] relative">
            <div className="gi-pro-image overflow-hidden">
              <Link href={`/products/${slug}`} className="image relative block overflow-hidden transition-all duration-[0.3s] ease-in-out">
                {category && (
                  <span className="label veg max-[991px]:hidden">
                    <span className="dot" />
                  </span>
                )}
                <img 
                  className="main-image max-w-full z-[1] transition-all duration-[0.3s] ease delay-[0s]" 
                  src={primaryImage} 
                  alt={title} 
                />
                <img 
                  className="hover-image absolute z-[2] top-[0] left-[0] opacity-[0] max-w-full transition-all duration-[0.3s] ease delay-[0s]" 
                  src={secondaryImage} 
                  alt={title} 
                />
              </Link>
              
              {/* Sale Badge */}
              {sale_price_cents && discountPercentage > 0 && (
                <span className="flags flex flex-col p-[0] uppercase absolute top-[10px] right-[10px] z-[2]">
                  <span className="sale py-[5px] px-[10px] text-[11px] font-medium leading-[12px] text-left uppercase flex items-center bg-[#ff7070] text-[#fff] tracking-[0.5px] relative rounded-[5px]">
                    {discountPercentage}% Off
                  </span>
                </span>
              )}
              
              {/* Product Actions */}
              <div className="gi-pro-actions transition-all duration-[0.3s] ease-in-out absolute z-[9] left-[0] right-[0] bottom-[-10px] max-[991px]:opacity-[1] max-[991px]:bottom-[10px] flex flex-row items-center justify-center my-[0] mx-auto opacity-[0] group-hover:opacity-100 group-hover:bottom-[10px]">
                <Link 
                  href="#" 
                  className="gi-btn-group wishlist transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] hover:bg-[#5caf90]" 
                  title="Wishlist"
                >
                  <i className="fi-rr-heart transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px] hover:text-white" />
                </Link>
                <Link 
                  href={`/products/${slug}`} 
                  className="gi-btn-group quickview transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] hover:bg-[#5caf90]"
                >
                  <i className="fi-rr-eye transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px] hover:text-white" />
                </Link>
                <Link 
                  href="#" 
                  className="gi-btn-group compare transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] hover:bg-[#5caf90]" 
                  title="Compare"
                >
                  <i className="fi fi-rr-arrows-repeat transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px] hover:text-white" />
                </Link>
                <Link 
                  href="#" 
                  title="Add To Cart" 
                  className="gi-btn-group add-to-cart transition-all duration-[0.3s] ease-in-out w-[30px] h-[30px] mx-[2px] flex items-center justify-center text-[#fff] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] hover:bg-[#5caf90]"
                >
                  <i className="fi-rr-shopping-basket transition-all duration-[0.3s] ease-in-out text-[#777] leading-[10px] hover:text-white" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Product Content */}
          <div className="gi-pro-content p-[20px] flex flex-col grow">
            {/* Category */}
            {category && (
              <span className="gi-pro-category text-[14px] text-[#777] mb-[5px] block">
                <Link href={`/categories/${category.slug}`}>{category.name}</Link>
              </span>
            )}
            
            {/* Title */}
            <h5 className="gi-pro-title text-[16px] font-medium mb-[5px] leading-[1.2] overflow-hidden text-ellipsis whitespace-nowrap">
              <Link href={`/products/${slug}`}>{title}</Link>
            </h5>
            
            {/* Price */}
            <div className="gi-price-box flex items-center">
              {sale_price_cents ? (
                <>
                  <span className="new-price text-[16px] font-medium text-[#5caf90] mr-[10px]">
                    {formatPrice(sale_price_cents)}
                  </span>
                  <span className="old-price text-[14px] text-[#777] line-through">
                    {formatPrice(base_price_cents)}
                  </span>
                </>
              ) : (
                <span className="new-price text-[16px] font-medium text-[#5caf90]">
                  {formatPrice(base_price_cents)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;