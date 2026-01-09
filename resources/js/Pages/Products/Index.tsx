import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import SearchBar from '@/Components/Search/SearchBar';
import FilterSidebar from '@/Components/Search/FilterSidebar';
import { FiGrid, FiList, FiFilter, FiX } from 'react-icons/fi';
import { PageProps } from '@/types';

interface Product {
    id: number;
    name: string;
    slug: string;
    price_cents: number;
    original_price_cents: number;
    image?: string;
    rating?: number;
    reviews_count?: number;
    is_new?: boolean;
    is_sale?: boolean;
    discount_percentage?: number;
    in_stock?: boolean;
    vendor_name?: string;
}

interface FilterOptions {
    price_range: {
        min: number;
        max: number;
    };
    categories: Array<{
        id: number;
        name: string;
        slug: string;
        count: number;
        parent_id: number | null;
    }>;
    vendors: Array<{
        id: number;
        name: string;
        count: number;
    }>;
    tags: Array<{
        id: number;
        name: string;
        count: number;
    }>;
    attributes: Array<{
        name: string;
        label: string;
        values: string[];
    }>;
    ratings: Array<{
        value: number;
        label: string;
        count: number;
    }>;
    availability: Array<{
        value: boolean;
        label: string;
        count: number;
    }>;
}

interface ActiveFilters {
    search?: string;
    category?: string;
    categories?: number[];
    vendors?: number[];
    tags?: number[];
    price_min?: number;
    price_max?: number;
    rating?: number;
    in_stock?: boolean;
    featured?: boolean;
    on_sale?: boolean;
    sort_by?: string;
    view?: 'grid' | 'list';
}

interface ProductsPageProps extends PageProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filterOptions: FilterOptions;
    filters: ActiveFilters;
    cartCount?: number;
    wishlistCount?: number;
}

export default function ProductsIndex({
    auth,
    products,
    filterOptions,
    filters = {},
    cartCount = 0,
    wishlistCount = 0,
}: ProductsPageProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>(filters.view || 'grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const handleViewChange = (view: 'grid' | 'list') => {
        setViewMode(view);
        router.get('/products', { ...filters, view }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get('/products', { ...filters, sort_by: e.target.value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (query: string) => {
        router.get('/products', { ...filters, search: query }, {
            preserveState: true,
            replace: true,
        });
    };

    const formatPrice = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.categories?.length) count++;
        if (filters.vendors?.length) count++;
        if (filters.tags?.length) count++;
        if (filters.price_min || filters.price_max) count++;
        if (filters.rating) count++;
        if (filters.in_stock) count++;
        if (filters.featured) count++;
        if (filters.on_sale) count++;
        return count;
    };

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Shop - All Products" />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">Products</span>
                    </div>
                </div>
            </div>

            {/* Search Bar Section */}
            <div className="bg-white border-b border-gray-200 py-6">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <SearchBar
                            initialQuery={filters.search}
                            onSearch={handleSearch}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:block lg:w-1/4">
                        <div className="sticky top-24">
                            <FilterSidebar
                                filterOptions={filterOptions}
                                activeFilters={filters}
                            />
                        </div>
                    </aside>

                    {/* Mobile Filters */}
                    <FilterSidebar
                        filterOptions={filterOptions}
                        activeFilters={filters}
                        isMobile={true}
                        isOpen={showMobileFilters}
                        onClose={() => setShowMobileFilters(false)}
                    />

                    {/* Main Content */}
                    <main className="lg:w-3/4">
                        {/* Toolbar */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    <FiFilter />
                                    <span>Filters</span>
                                    {getActiveFilterCount() > 0 && (
                                        <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                                            {getActiveFilterCount()}
                                        </span>
                                    )}
                                </button>

                                {/* View Mode Toggle */}
                                <div className="hidden sm:flex border border-gray-300 rounded-md">
                                    <button
                                        onClick={() => handleViewChange('grid')}
                                        className={'p-2 ' + (viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50')}
                                    >
                                        <FiGrid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleViewChange('list')}
                                        className={'p-2 ' + (viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50')}
                                    >
                                        <FiList className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Results Count */}
                                <span className="text-sm text-gray-600">
                                    Showing {products.from || 0}-{products.to || 0} of {products.total} products
                                </span>
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
                                <select
                                    value={filters.sort_by || 'newest'}
                                    onChange={handleSortChange}
                                    className="flex-1 sm:flex-initial border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_low_high">Price: Low to High</option>
                                    <option value="price_high_low">Price: High to Low</option>
                                    <option value="popularity">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="name_asc">Name: A to Z</option>
                                    <option value="name_desc">Name: Z to A</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        {products.data.length > 0 ? (
                            <>
                                <div
                                    className={
                                        'grid gap-6 ' +
                                        (viewMode === 'grid'
                                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                            : 'grid-cols-1')
                                    }
                                >
                                    {products.data.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={{
                                                ...product,
                                                price: product.price_cents,
                                                old_price: product.is_sale ? product.original_price_cents : undefined,
                                            }}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex items-center gap-2">
                                            {products.links.map((link, index) => {
                                                if (!link.url) {
                                                    return (
                                                        <span
                                                            key={index}
                                                            className="px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        preserveState
                                                        preserveScroll
                                                        className={
                                                            'px-4 py-2 rounded-md transition-colors ' +
                                                            (link.active
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white')
                                                        }
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your filters or search criteria
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                                >
                                    Clear All Filters
                                </Link>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </FrontendLayout>
    );
}
