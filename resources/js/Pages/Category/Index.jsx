import Guest from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'
import ProductGrid from '@/Components/ProductGrid'
import Pagination from '@/Components/Pagination'

export default function CategoryIndex({ category, products }) {
    const categoryData = category || {};
    const productsData = products || { data: [] };
    
    return (
        <>
            <Head title={categoryData.name || 'Category'} />
            <Guest>
                <section className="gi-category-section py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            {/* Breadcrumb */}
                            <div className="w-full px-[12px] mb-[30px]">
                                <div className="gi-breadcrumb flex flex-wrap items-center">
                                    <Link href={route('welcome')} className="text-[14px] text-[#777] hover:text-[#5caf90]">Home</Link>
                                    <span className="mx-[5px]">/</span>
                                    <Link href={route('products.index')} className="text-[14px] text-[#777] hover:text-[#5caf90]">Products</Link>
                                    <span className="mx-[5px]">/</span>
                                    <span className="text-[14px] text-[#5caf90]">{categoryData.name}</span>
                                </div>
                            </div>
                            
                            {/* Category Banner */}
                            {categoryData.banner && (
                                <div className="w-full px-[12px] mb-[30px]">
                                    <div className="gi-category-banner relative rounded-[10px] overflow-hidden">
                                        <img 
                                            src={`/storage/${categoryData.banner}`} 
                                            alt={categoryData.name} 
                                            className="w-full h-[200px] md:h-[300px] object-cover" 
                                        />
                                        <div className="gi-category-banner-content absolute top-0 left-0 w-full h-full flex items-center p-[30px] bg-[rgba(0,0,0,0.3)]">
                                            <div>
                                                <h1 className="text-[30px] md:text-[40px] text-[#fff] font-bold mb-[10px]">{categoryData.name}</h1>
                                                {categoryData.description && (
                                                    <p className="text-[16px] text-[#fff] max-w-[500px]">{categoryData.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Category Content */}
                            <div className="w-full px-[12px]">
                                <div className="gi-category-wrap">
                                    {!categoryData.banner && (
                                        <div className="gi-category-title mb-[30px]">
                                            <h1 className="text-[30px] text-[#333] font-semibold max-[767px]:text-[24px]">{categoryData.name}</h1>
                                            {categoryData.description && (
                                                <p className="text-[16px] text-[#777] mt-[10px]">{categoryData.description}</p>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Subcategories if any */}
                                    {categoryData.subcategories && categoryData.subcategories.length > 0 && (
                                        <div className="gi-subcategories mb-[30px]">
                                            <h3 className="text-[18px] text-[#333] font-medium mb-[15px]">Browse Subcategories</h3>
                                            <div className="flex flex-wrap -mx-[10px]">
                                                {categoryData.subcategories.map(subcategory => (
                                                    <div key={subcategory.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-[10px] mb-[20px]">
                                                        <Link 
                                                            href={route('category.index', subcategory.slug)}
                                                            className="gi-subcategory-item block p-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] transition-all duration-[0.3s] ease-in-out hover:border-[#5caf90] hover:shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                                                        >
                                                            <div className="gi-subcategory-img w-full h-[120px] mb-[10px] rounded-[5px] overflow-hidden">
                                                                <img 
                                                                    src={subcategory.image ? `/storage/${subcategory.image}` : '/assets/img/placeholder.jpg'} 
                                                                    alt={subcategory.name} 
                                                                    className="w-full h-full object-cover" 
                                                                />
                                                            </div>
                                                            <h5 className="gi-subcategory-title text-[16px] text-[#333] font-medium text-center">{subcategory.name}</h5>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Products */}
                                    <div className="gi-category-products">
                                        {productsData.data.length > 0 ? (
                                            <>
                                                <div className="gi-category-products-header flex flex-wrap justify-between items-center mb-[20px]">
                                                    <div className="gi-category-products-count mb-[10px]">
                                                        <p className="text-[14px] text-[#777]">
                                                            Showing {productsData.from || 1}-{productsData.to || productsData.data.length} of {productsData.total || productsData.data.length} products
                                                        </p>
                                                    </div>
                                                    <div className="gi-category-products-sort mb-[10px]">
                                                        <select 
                                                            className="h-[40px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[5px] outline-none text-[14px] text-[#333]"
                                                        >
                                                            <option value="default">Default sorting</option>
                                                            <option value="price-low-high">Price: Low to High</option>
                                                            <option value="price-high-low">Price: High to Low</option>
                                                            <option value="latest">Latest</option>
                                                            <option value="popularity">Popularity</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <ProductGrid products={productsData.data} />
                                                
                                                {productsData.links && productsData.links.length > 3 && (
                                                    <div className="gi-category-products-pagination mt-[30px]">
                                                        <Pagination links={productsData.links} />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="gi-category-products-empty text-center py-[50px]">
                                                <div className="gi-category-products-empty-icon mb-[20px]">
                                                    <i className="fi-rr-shopping-bag text-[60px] text-[#eee]" />
                                                </div>
                                                <h3 className="text-[24px] text-[#333] font-medium mb-[15px]">No products found</h3>
                                                <p className="text-[16px] text-[#777] mb-[20px]">There are no products in this category yet.</p>
                                                <Link 
                                                    href={route('products.index')} 
                                                    className="gi-btn-primary text-[14px] text-[#fff] font-medium bg-[#5caf90] py-[10px] px-[30px] rounded-[5px] inline-block hover:bg-[#4b5966] transition-all duration-[0.3s] ease-in-out"
                                                >
                                                    Browse All Products
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Guest>
        </>
    )
}