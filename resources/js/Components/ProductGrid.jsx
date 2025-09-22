import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, isLoading = false }) => {
  // Show loading skeleton if data is loading
  if (isLoading) {
    return (
      <div className="shop-pro-inner mx-[-12px]">
        <div className="flex flex-wrap w-full">
          {[...Array(8)].map((_, index) => (
            <div 
              key={`skeleton-${index}`}
              className="min-[1200px]:w-[25%] min-[992px]:w-[33.33%] min-[768px]:w-[50%] min-[576px]:w-[50%] max-[420px]:w-full px-[12px] gi-product-box max-[575px]:w-[50%] max-[575px]:mx-auto pro-gl-content"
            >
              <div className="gi-product-content pb-[24px] h-full flex">
                <div className="gi-product-inner transition-all duration-[0.3s] ease-in-out flex flex-col overflow-hidden border-[1px] border-solid border-[#eee] rounded-[5px] w-full">
                  <div className="gi-pro-image-outer transition-all duration-[0.3s] ease delay-[0s] z-[11] relative">
                    <div className="gi-pro-image overflow-hidden">
                      <div className="h-[200px] bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                  <div className="gi-pro-content p-[20px] flex flex-col grow">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no products
  if (!products || products.length === 0) {
    return (
      <div className="shop-pro-inner mx-[-12px]">
        <div className="flex flex-wrap w-full justify-center py-12">
          <div className="text-center">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render product grid
  return (
    <div className="shop-pro-inner mx-[-12px]">
      <div className="flex flex-wrap w-full">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;