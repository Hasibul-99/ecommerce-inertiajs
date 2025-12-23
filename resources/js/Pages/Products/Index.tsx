import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import { FiGrid, FiList, FiX, FiChevronDown } from 'react-icons/fi';
import { PageProps } from '@/types';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    old_price?: number;
    image?: string;
    rating?: number;
    reviews_count?: number;
    is_new?: boolean;
    is_sale?: boolean;
    discount_percentage?: number;
    in_stock?: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
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
    };
    categories?: Category[];
    tags?: Tag[];
    filters?: {
        search?: string;
        category?: string;
        tags?: string[];
        min_price?: number;
        max_price?: number;
        sort?: string;
    };
    cartCount?: number;
    wishlistCount?: number;
}

export default function ProductsIndex({
    auth,
    products,
    categories = [],
    tags = [],
    filters = {},
    cartCount = 0,
    wishlistCount = 0
}: ProductsPageProps) {
    // Ensure filters is always an object
    const safeFilters = filters || {};

    // Ensure products has a valid structure
    const safeProducts = products || {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        from: 0,
        to: 0
    };

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        safeFilters.category ? [safeFilters.category] : []
    );
    const [selectedTags, setSelectedTags] = useState<string[]>(safeFilters.tags || []);
    const [priceRange, setPriceRange] = useState({
        min: safeFilters.min_price || 0,
        max: safeFilters.max_price || 1000
    });
    const [sortBy, setSortBy] = useState(safeFilters.sort || '');

    // Apply filters
    const applyFilters = () => {
        const params: any = {};

        if (selectedCategories.length > 0) {
            params.category = selectedCategories[0]; // Single category for now
        }
        if (selectedTags.length > 0) {
            params.tags = selectedTags;
        }
        if (priceRange.min > 0) {
            params.min_price = priceRange.min;
        }
        if (priceRange.max < 1000) {
            params.max_price = priceRange.max;
        }
        if (sortBy) {
            params.sort = sortBy;
        }
        if (safeFilters.search) {
            params.search = safeFilters.search;
        }

        router.get('/products', params, { preserveState: true });
    };

    // Remove filter
    const removeFilter = (type: 'category' | 'tag', value: string) => {
        if (type === 'category') {
            setSelectedCategories(selectedCategories.filter(c => c !== value));
        } else if (type === 'tag') {
            setSelectedTags(selectedTags.filter(t => t !== value));
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedTags([]);
        setPriceRange({ min: 0, max: 1000 });
        setSortBy('');
        router.get('/products', {}, { preserveState: true });
    };

    // Handle sort change
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        setSortBy(newSort);

        const params: any = { ...safeFilters };
        if (newSort) {
            params.sort = newSort;
        } else {
            delete params.sort;
        }

        router.get('/products', params, { preserveState: true });
    };

    const activeFilters = [
        ...selectedCategories.map(slug => ({
            type: 'category' as const,
            value: slug,
            label: categories.find(c => c.slug === slug)?.name || slug
        })),
        ...selectedTags.map(slug => ({
            type: 'tag' as const,
            value: slug,
            label: tags.find(t => t.slug === slug)?.name || slug
        }))
    ];

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Shop - All Products" />

            {/* Breadcrumb */}
            <div className="bg-grabit-bg-light py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-grabit-gray">
                        <Link href="/" className="hover:text-grabit-primary">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-grabit-dark">Products</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-1/4">
                        <div className="bg-white border border-grabit-border rounded-lg p-6 sticky top-24">
                            <h2 className="text-lg font-heading font-semibold text-grabit-dark mb-4">Filters</h2>

                            {/* Categories */}
                            {categories.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-grabit-dark mb-3 pb-3 border-b">Categories</h3>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {categories.map((category) => (
                                            <label key={category.id} className="flex items-center cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.slug)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedCategories([category.slug]);
                                                        } else {
                                                            setSelectedCategories([]);
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-grabit-primary border-grabit-border rounded focus:ring-grabit-primary"
                                                />
                                                <span className="ml-2 text-sm text-grabit-gray group-hover:text-grabit-primary">
                                                    {category.name}
                                                    {category.products_count !== undefined && (
                                                        <span className="text-xs ml-1">({category.products_count})</span>
                                                    )}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="font-medium text-grabit-dark mb-3 pb-3 border-b">Price Range</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 bg-grabit-bg-light p-3 rounded">
                                        <div className="flex-1">
                                            <label className="text-xs text-grabit-gray block mb-1">Min</label>
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                                className="w-full px-2 py-1 text-sm border border-grabit-border rounded"
                                                min="0"
                                            />
                                        </div>
                                        <span className="text-grabit-gray mt-5">-</span>
                                        <div className="flex-1">
                                            <label className="text-xs text-grabit-gray block mb-1">Max</label>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                                className="w-full px-2 py-1 text-sm border border-grabit-border rounded"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-grabit-dark mb-3 pb-3 border-b">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <button
                                                key={tag.id}
                                                onClick={() => {
                                                    if (selectedTags.includes(tag.slug)) {
                                                        setSelectedTags(selectedTags.filter(t => t !== tag.slug));
                                                    } else {
                                                        setSelectedTags([...selectedTags, tag.slug]);
                                                    }
                                                }}
                                                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                                    selectedTags.includes(tag.slug)
                                                        ? 'bg-grabit-primary text-white'
                                                        : 'bg-grabit-bg-light text-grabit-gray hover:bg-grabit-primary hover:text-white'
                                                }`}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Apply Filters Button */}
                            <button
                                onClick={applyFilters}
                                className="w-full bg-grabit-primary hover:bg-grabit-primary-dark text-white py-2 rounded-md transition-colors font-medium"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-3/4">
                        {/* Toolbar */}
                        <div className="bg-white border border-grabit-border rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                {/* View Mode Toggle */}
                                <div className="flex border border-grabit-border rounded-md">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-grabit-primary text-white' : 'text-grabit-gray hover:bg-gray-50'}`}
                                    >
                                        <FiGrid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-grabit-primary text-white' : 'text-grabit-gray hover:bg-gray-50'}`}
                                    >
                                        <FiList className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Results Count */}
                                <span className="text-sm text-grabit-gray">
                                    Showing {safeProducts.from}-{safeProducts.to} of {safeProducts.total} products
                                </span>
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-grabit-gray">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="border border-grabit-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grabit-primary"
                                >
                                    <option value="">Default</option>
                                    <option value="name_asc">Name, A to Z</option>
                                    <option value="name_desc">Name, Z to A</option>
                                    <option value="price_asc">Price, Low to High</option>
                                    <option value="price_desc">Price, High to Low</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {activeFilters.map((filter, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 bg-grabit-bg-light text-grabit-gray px-3 py-1 rounded-md text-sm"
                                    >
                                        {filter.label}
                                        <button
                                            onClick={() => removeFilter(filter.type, filter.value)}
                                            className="text-grabit-sale hover:text-red-700"
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-grabit-dark text-white px-3 py-1 rounded-md text-sm hover:bg-grabit-dark-secondary transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}

                        {/* Products Grid */}
                        {safeProducts.data.length > 0 ? (
                            <>
                                <div className={`grid gap-6 ${
                                    viewMode === 'grid'
                                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                        : 'grid-cols-1'
                                }`}>
                                    {safeProducts.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {safeProducts.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: safeProducts.last_page }, (_, i) => i + 1).map((page) => (
                                                <Link
                                                    key={page}
                                                    href={`/products?page=${page}`}
                                                    preserveState
                                                    className={`px-4 py-2 rounded-md transition-colors ${
                                                        page === safeProducts.current_page
                                                            ? 'bg-grabit-primary text-white'
                                                            : 'bg-gray-100 text-grabit-gray hover:bg-grabit-primary hover:text-white'
                                                    }`}
                                                >
                                                    {page}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-heading font-semibold text-grabit-dark mb-2">
                                    No products found
                                </h3>
                                <p className="text-grabit-gray mb-4">
                                    Try adjusting your filters or search criteria
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-grabit-primary hover:bg-grabit-primary-dark text-white px-6 py-2 rounded-md transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </FrontendLayout>
    );
}
