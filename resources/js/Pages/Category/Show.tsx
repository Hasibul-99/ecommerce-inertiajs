import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import { FiChevronRight, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { PageProps } from '@/types';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    old_price: number | null;
    image: string | null;
    rating: number;
    reviews_count: number;
    is_new: boolean;
    is_sale: boolean;
    discount_percentage: number;
    in_stock: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    products_count: number;
}

interface CategoryShowProps extends PageProps {
    category: Category;
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        sort: string;
        min_price?: number;
        max_price?: number;
    };
    cartCount?: number;
    wishlistCount?: number;
}

export default function CategoryShow({
    auth,
    category,
    products,
    filters,
    cartCount = 0,
    wishlistCount = 0
}: CategoryShowProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title={category.name} />

            {/* Breadcrumb */}
            <div className="bg-grabit-bg-light py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-grabit-gray">
                        <Link href="/" className="hover:text-grabit-primary">Home</Link>
                        <FiChevronRight className="w-4 h-4" />
                        <Link href="/products" className="hover:text-grabit-primary">Products</Link>
                        <FiChevronRight className="w-4 h-4" />
                        <span className="text-grabit-dark">{category.name}</span>
                    </div>
                </div>
            </div>

            {/* Category Header */}
            <div className="bg-white border-b border-grabit-border py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-grabit-gray max-w-3xl">{category.description}</p>
                    )}
                    <p className="text-sm text-grabit-gray mt-2">
                        {products.total} {products.total === 1 ? 'product' : 'products'} found
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white border border-grabit-border rounded-lg p-6 sticky top-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-heading font-semibold text-grabit-dark">
                                    Filters
                                </h2>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="lg:hidden text-grabit-gray hover:text-grabit-dark"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Sort Options */}
                            <div className="mb-6">
                                <h3 className="font-medium text-grabit-dark mb-3">Sort By</h3>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => {
                                        window.location.href = `${window.location.pathname}?sort=${e.target.value}`;
                                    }}
                                    className="w-full border border-grabit-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="font-medium text-grabit-dark mb-3">Price Range</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm text-grabit-gray mb-1 block">Min Price</label>
                                        <input
                                            type="number"
                                            placeholder="$0"
                                            className="w-full border border-grabit-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-grabit-gray mb-1 block">Max Price</label>
                                        <input
                                            type="number"
                                            placeholder="$1000"
                                            className="w-full border border-grabit-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                        />
                                    </div>
                                    <button className="w-full bg-grabit-primary hover:bg-grabit-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="lg:col-span-3">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-grabit-border rounded-md hover:border-grabit-primary transition-colors"
                                >
                                    <FiFilter className="w-4 h-4" />
                                    <span>Filters</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-grabit-primary text-white'
                                            : 'border border-grabit-border hover:border-grabit-primary'
                                    }`}
                                >
                                    <FiGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-grabit-primary text-white'
                                            : 'border border-grabit-border hover:border-grabit-primary'
                                    }`}
                                >
                                    <FiList className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Products Display */}
                        {products.data.length > 0 ? (
                            <>
                                <div className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                        : 'flex flex-col gap-4'
                                }>
                                    {products.data.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex items-center gap-2">
                                            {products.current_page > 1 && (
                                                <Link
                                                    href={`${window.location.pathname}?page=${products.current_page - 1}&sort=${filters.sort}`}
                                                    className="px-4 py-2 border border-grabit-border rounded-md hover:border-grabit-primary transition-colors"
                                                >
                                                    Previous
                                                </Link>
                                            )}

                                            {Array.from({ length: products.last_page }, (_, i) => i + 1)
                                                .filter(page => {
                                                    return page === 1 ||
                                                           page === products.last_page ||
                                                           Math.abs(page - products.current_page) <= 1;
                                                })
                                                .map((page, index, array) => {
                                                    if (index > 0 && page - array[index - 1] > 1) {
                                                        return [
                                                            <span key={`ellipsis-${page}`} className="px-2">...</span>,
                                                            <Link
                                                                key={page}
                                                                href={`${window.location.pathname}?page=${page}&sort=${filters.sort}`}
                                                                className={`px-4 py-2 border rounded-md transition-colors ${
                                                                    page === products.current_page
                                                                        ? 'bg-grabit-primary text-white border-grabit-primary'
                                                                        : 'border-grabit-border hover:border-grabit-primary'
                                                                }`}
                                                            >
                                                                {page}
                                                            </Link>
                                                        ];
                                                    }
                                                    return (
                                                        <Link
                                                            key={page}
                                                            href={`${window.location.pathname}?page=${page}&sort=${filters.sort}`}
                                                            className={`px-4 py-2 border rounded-md transition-colors ${
                                                                page === products.current_page
                                                                    ? 'bg-grabit-primary text-white border-grabit-primary'
                                                                    : 'border-grabit-border hover:border-grabit-primary'
                                                            }`}
                                                        >
                                                            {page}
                                                        </Link>
                                                    );
                                                })}

                                            {products.current_page < products.last_page && (
                                                <Link
                                                    href={`${window.location.pathname}?page=${products.current_page + 1}&sort=${filters.sort}`}
                                                    className="px-4 py-2 border border-grabit-border rounded-md hover:border-grabit-primary transition-colors"
                                                >
                                                    Next
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-grabit-dark mb-2">
                                    No products found
                                </h3>
                                <p className="text-grabit-gray mb-6">
                                    Try adjusting your filters or browse other categories
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-block bg-grabit-primary hover:bg-grabit-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
                                >
                                    Browse All Products
                                </Link>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </FrontendLayout>
    );
}
