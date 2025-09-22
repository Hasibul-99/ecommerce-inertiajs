import Guest from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import ProductGrid from '@/Components/ProductGrid'
import Pagination from '@/Components/Pagination'
import { Input } from '@/Components/ui/input'

export default function Products({ products, filters }) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        category: filters?.category || '',
        sort: filters?.sort || ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('products.index'));
    };

    return (
        <>
            <Head title="Products" />
            <Guest>
                <section className="gi-category py-[40px] max-[767px]:py-[30px]">
                    <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                        <div className="flex flex-wrap w-full">
                            <div className="gi-shop-rightside min-[992px]:order-[6] min-[768px]:order-[-1] min-[992px]:w-[75%] min-[768px]:w-full w-full px-[12px]">
                                {/* Search Form */}
                                <div className="mb-6">
                                    <form onSubmit={handleSearch} className="flex">
                                        <Input 
                                            type="text" 
                                            placeholder="Search products..." 
                                            className="rounded-r-none" 
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                        />
                                        <button 
                                            type="submit" 
                                            className="bg-[#5caf90] text-white px-4 rounded-r-md hover:bg-[#4b5966] transition-colors"
                                            disabled={processing}
                                        >
                                            Search
                                        </button>
                                    </form>
                                </div>
                                
                                {/* Shop Top Start */}
                                <div className="gi-pro-list-top flex items-center justify-between text-[14px] border-[1px] border-solid border-[#eee] rounded-[5px] mb-[30px]">
                                    <div className="min-[768px]:w-[50%] w-full gi-grid-list">
                                        <div className="gi-gl-btn ml-[5px] flex items-center flex-row">
                                            <button type="button" className="grid-btn btn-grid-50 h-[40px] w-[40px] border-[0] rounded-[0] flex items-center justify-center flex-row active">
                                                <i className="fi fi-rr-apps text-[20px] text-[#4b5966] leading-[0]" />
                                            </button>
                                            <button type="button" className="grid-btn btn-list-50 h-[40px] w-[40px] border-[0] rounded-[0] flex items-center justify-center flex-row">
                                                <i className="fi fi-rr-list text-[20px] text-[#4b5966] leading-[0]" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="min-[768px]:w-[50%] w-full gi-sort-select flex justify-end items-center">
                                        <div className="gi-select-inner relative flex w-[140px] h-[50px] leading-[1.5] bg-[#fff] overflow-hidden rounded-[0] border-l-[1px] border-solid border-[#eee]">
                                            <select 
                                                name="sort" 
                                                id="sort" 
                                                className="appearance-none outline-[0] border-[0] bg-[#fff] grow-[1] px-[10px] text-[#777] cursor-pointer"
                                                value={data.sort}
                                                onChange={(e) => {
                                                    setData('sort', e.target.value);
                                                    get(route('products.index'));
                                                }}
                                            >
                                                <option value="">Sort by</option>
                                                <option value="newest">Newest</option>
                                                <option value="price_asc">Price, low to high</option>
                                                <option value="price_desc">Price, high to low</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* Shop Top End */}
                                
                                {/* Active Filters */}
                                {filters && (filters.category || filters.search) && (
                                    <div className="gi-select-bar mt-[-5px] mx-[-5px] mb-[25px] flex flex-wrap justify-end">
                                        {filters.category && (
                                            <span className="gi-select-btn m-[5px] px-[10px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">
                                                Category: {filters.category}
                                                <a 
                                                    className="gi-select-cancel ml-[15px] text-[#ff8585] text-[18px] transition-all duration-[0.3s] ease-in-out" 
                                                    href={route('products.index', { ...filters, category: null })}
                                                >×</a>
                                            </span>
                                        )}
                                        {filters.search && (
                                            <span className="gi-select-btn m-[5px] px-[10px] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">
                                                Search: {filters.search}
                                                <a 
                                                    className="gi-select-cancel ml-[15px] text-[#ff8585] text-[18px] transition-all duration-[0.3s] ease-in-out" 
                                                    href={route('products.index', { ...filters, search: null })}
                                                >×</a>
                                            </span>
                                        )}
                                        <span className="gi-select-btn gi-select-btn-clear m-[5px] p-[0] border-[1px] border-solid border-[#eee] rounded-[5px] text-[#777] text-[14px] flex items-center capitalize">
                                            <a 
                                                className="gi-select-clear transition-all duration-[0.3s] ease-in-out h-full m-[0] py-[3px] px-[10px] text-[14px] flex items-center bg-[#4b5966] text-[#fff] rounded-[5px] hover:bg-[#5caf90] hover:text-[#fff]" 
                                                href={route('products.index')}
                                            >Clear All</a>
                                        </span>
                                    </div>
                                )}
                                
                                {/* Shop content Start */}
                                <div className="shop-pro-content">
                                    <ProductGrid products={products?.data || []} />
                                    
                                    {/* Pagination */}
                                    {products?.links && (
                                        <div className="mt-8">
                                            <Pagination links={products.links} />
                                        </div>
                                    )}
                                </div>
                                {/* Shop content End */}
                            </div>
                            
                            {/* Sidebar with filters */}
                            <div className="gi-shop-leftside min-[992px]:w-[25%] min-[768px]:w-full w-full px-[12px]">
                                <div className="gi-sidebar-wrap">
                                    <div className="gi-sidebar-block mb-[30px]">
                                        <div className="gi-sidebar-title mb-[15px]">
                                            <h3 className="text-[20px] font-semibold text-[#444] capitalize">Categories</h3>
                                        </div>
                                        <div className="gi-sidebar-content">
                                            <ul className="gi-category-sidebar">
                                                {filters?.categories?.map((category) => (
                                                    <li key={category.id}>
                                                        <a 
                                                            href={route('products.index', { category: category.slug })}
                                                            className={`flex items-center text-[14px] text-[#777] py-[5px] hover:text-[#5caf90] ${filters?.category === category.slug ? 'text-[#5caf90] font-medium' : ''}`}
                                                        >
                                                            {category.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
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