import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { FiX, FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';

interface Category {
    id: number;
    name: string;
    slug: string;
    count: number;
    parent_id: number | null;
}

interface Vendor {
    id: number;
    name: string;
    count: number;
}

interface Tag {
    id: number;
    name: string;
    count: number;
}

interface Attribute {
    name: string;
    label: string;
    values: string[];
}

interface FilterOptions {
    price_range: {
        min: number;
        max: number;
    };
    categories: Category[];
    vendors: Vendor[];
    tags: Tag[];
    attributes: Attribute[];
    ratings: { value: number; label: string; count: number }[];
    availability: { value: boolean; label: string; count: number }[];
}

interface ActiveFilters {
    search?: string;
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
}

interface FilterSidebarProps {
    filterOptions: FilterOptions;
    activeFilters: ActiveFilters;
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function FilterSidebar({
    filterOptions,
    activeFilters,
    isMobile = false,
    isOpen = true,
    onClose,
}: FilterSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        categories: true,
        price: true,
        vendors: false,
        rating: false,
        tags: false,
        attributes: false,
        availability: false,
    });

    const [localPriceMin, setLocalPriceMin] = useState(activeFilters.price_min?.toString() || '');
    const [localPriceMax, setLocalPriceMax] = useState(activeFilters.price_max?.toString() || '');

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const updateFilter = (filterKey: string, value: any) => {
        const currentFilters = { ...activeFilters };

        if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
            delete currentFilters[filterKey];
        } else {
            currentFilters[filterKey] = value;
        }

        router.get('/products', currentFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const toggleArrayFilter = (filterKey: 'categories' | 'vendors' | 'tags', itemId: number) => {
        const currentArray = activeFilters[filterKey] || [];
        let newArray: number[];

        if (currentArray.includes(itemId)) {
            newArray = currentArray.filter((id) => id !== itemId);
        } else {
            newArray = [...currentArray, itemId];
        }

        updateFilter(filterKey, newArray.length > 0 ? newArray : null);
    };

    const handlePriceFilter = () => {
        const minPrice = localPriceMin ? parseFloat(localPriceMin) : null;
        const maxPrice = localPriceMax ? parseFloat(localPriceMax) : null;

        const currentFilters = { ...activeFilters };

        if (minPrice !== null) {
            currentFilters.price_min = minPrice;
        } else {
            delete currentFilters.price_min;
        }

        if (maxPrice !== null) {
            currentFilters.price_max = maxPrice;
        } else {
            delete currentFilters.price_max;
        }

        router.get('/products', currentFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearAllFilters = () => {
        router.get('/products', { search: activeFilters.search }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (activeFilters.categories?.length) count++;
        if (activeFilters.vendors?.length) count++;
        if (activeFilters.tags?.length) count++;
        if (activeFilters.price_min || activeFilters.price_max) count++;
        if (activeFilters.rating) count++;
        if (activeFilters.in_stock) count++;
        if (activeFilters.featured) count++;
        if (activeFilters.on_sale) count++;
        return count;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    };

    // Build category tree
    const buildCategoryTree = (categories: Category[]) => {
        const parentCategories = categories.filter(cat => !cat.parent_id);
        return parentCategories;
    };

    const FilterSection = ({ title, sectionKey, children }: { title: string; sectionKey: string; children: React.ReactNode }) => (
        <div className="border-b border-gray-200 pb-4 mb-4">
            <button
                onClick={() => toggleSection(sectionKey)}
                className="w-full flex items-center justify-between py-2 text-left font-semibold text-gray-900"
            >
                <span>{title}</span>
                {expandedSections[sectionKey] ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections[sectionKey] && <div className="mt-3">{children}</div>}
        </div>
    );

    const sidebarContent = (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    {getActiveFilterCount() > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                            {getActiveFilterCount()}
                        </span>
                    )}
                </div>
                {isMobile && onClose && (
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FiX className="text-xl" />
                    </button>
                )}
            </div>

            {/* Active Filters Summary */}
            {getActiveFilterCount() > 0 && (
                <div className="p-4 bg-blue-50 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Active Filters</span>
                        <button
                            onClick={clearAllFilters}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {activeFilters.categories?.map((catId) => {
                            const category = filterOptions.categories.find(c => c.id === catId);
                            return category && (
                                <button
                                    key={`cat-${catId}`}
                                    onClick={() => toggleArrayFilter('categories', catId)}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white border border-blue-300 text-blue-700 rounded-full hover:bg-blue-50"
                                >
                                    {category.name}
                                    <FiX className="text-xs" />
                                </button>
                            );
                        })}
                        {activeFilters.vendors?.map((vendorId) => {
                            const vendor = filterOptions.vendors.find(v => v.id === vendorId);
                            return vendor && (
                                <button
                                    key={`vendor-${vendorId}`}
                                    onClick={() => toggleArrayFilter('vendors', vendorId)}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white border border-blue-300 text-blue-700 rounded-full hover:bg-blue-50"
                                >
                                    {vendor.name}
                                    <FiX className="text-xs" />
                                </button>
                            );
                        })}
                        {(activeFilters.price_min || activeFilters.price_max) && (
                            <button
                                onClick={() => {
                                    setLocalPriceMin('');
                                    setLocalPriceMax('');
                                    updateFilter('price_min', null);
                                    updateFilter('price_max', null);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white border border-blue-300 text-blue-700 rounded-full hover:bg-blue-50"
                            >
                                {activeFilters.price_min && formatPrice(activeFilters.price_min)} - {activeFilters.price_max && formatPrice(activeFilters.price_max)}
                                <FiX className="text-xs" />
                            </button>
                        )}
                        {activeFilters.rating && (
                            <button
                                onClick={() => updateFilter('rating', null)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white border border-blue-300 text-blue-700 rounded-full hover:bg-blue-50"
                            >
                                {activeFilters.rating}+ Stars
                                <FiX className="text-xs" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Filter Options */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Categories */}
                {filterOptions.categories.length > 0 && (
                    <FilterSection title="Categories" sectionKey="categories">
                        <div className="space-y-2">
                            {buildCategoryTree(filterOptions.categories).map((category) => (
                                <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={activeFilters.categories?.includes(category.id) || false}
                                        onChange={() => toggleArrayFilter('categories', category.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                                        {category.name}
                                    </span>
                                    <span className="text-xs text-gray-500">({category.count})</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Price Range */}
                <FilterSection title="Price Range" sectionKey="price">
                    <div className="space-y-3">
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="Min"
                                value={localPriceMin}
                                onChange={(e) => setLocalPriceMin(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={localPriceMax}
                                onChange={(e) => setLocalPriceMax(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handlePriceFilter}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                            Apply
                        </button>
                        <div className="text-xs text-gray-500">
                            Range: {formatPrice(filterOptions.price_range.min)} - {formatPrice(filterOptions.price_range.max)}
                        </div>
                    </div>
                </FilterSection>

                {/* Rating */}
                {filterOptions.ratings.length > 0 && (
                    <FilterSection title="Customer Rating" sectionKey="rating">
                        <div className="space-y-2">
                            {filterOptions.ratings.map((rating) => (
                                <label key={rating.value} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={activeFilters.rating === rating.value}
                                        onChange={() => updateFilter('rating', rating.value)}
                                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                                        {rating.label}
                                    </span>
                                    <span className="text-xs text-gray-500">({rating.count})</span>
                                </label>
                            ))}
                            {activeFilters.rating && (
                                <button
                                    onClick={() => updateFilter('rating', null)}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                    Clear rating filter
                                </button>
                            )}
                        </div>
                    </FilterSection>
                )}

                {/* Vendors */}
                {filterOptions.vendors.length > 0 && (
                    <FilterSection title="Vendors" sectionKey="vendors">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {filterOptions.vendors.map((vendor) => (
                                <label key={vendor.id} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={activeFilters.vendors?.includes(vendor.id) || false}
                                        onChange={() => toggleArrayFilter('vendors', vendor.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                                        {vendor.name}
                                    </span>
                                    <span className="text-xs text-gray-500">({vendor.count})</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Tags */}
                {filterOptions.tags.length > 0 && (
                    <FilterSection title="Tags" sectionKey="tags">
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleArrayFilter('tags', tag.id)}
                                    className={
                                        'px-3 py-1 text-xs rounded-full border transition-colors ' +
                                        (activeFilters.tags?.includes(tag.id)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500')
                                    }
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Availability */}
                <FilterSection title="Availability" sectionKey="availability">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={activeFilters.in_stock || false}
                                onChange={(e) => updateFilter('in_stock', e.target.checked || null)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">In Stock Only</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={activeFilters.on_sale || false}
                                onChange={(e) => updateFilter('on_sale', e.target.checked || null)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">On Sale</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={activeFilters.featured || false}
                                onChange={(e) => updateFilter('featured', e.target.checked || null)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">Featured Products</span>
                        </label>
                    </div>
                </FilterSection>

                {/* Dynamic Attributes */}
                {filterOptions.attributes.length > 0 && filterOptions.attributes.map((attribute) => (
                    <FilterSection key={attribute.name} title={attribute.label} sectionKey={`attr-${attribute.name}`}>
                        <div className="flex flex-wrap gap-2">
                            {attribute.values.map((value) => (
                                <button
                                    key={value}
                                    className="px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded-full hover:border-blue-500"
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                ))}
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <>
                {/* Mobile Backdrop */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={onClose}
                    />
                )}

                {/* Mobile Drawer */}
                <div
                    className={
                        'fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 ' +
                        (isOpen ? 'translate-x-0' : '-translate-x-full')
                    }
                >
                    {sidebarContent}
                </div>
            </>
        );
    }

    return <div className="bg-white rounded-lg shadow">{sidebarContent}</div>;
}
