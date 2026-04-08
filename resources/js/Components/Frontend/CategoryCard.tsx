import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string; // Legacy support
    image_url?: string; // New field from Spatie Media Library
    products_count?: number;
    icon?: string;
}

interface CategoryCardProps {
    category: Category;
    variant?: 'default' | 'icon' | 'large';
}

export default function CategoryCard({ category, variant = 'default' }: CategoryCardProps) {
    const [imageError, setImageError] = useState(false);

    // Support both new image_url (from Spatie) and legacy image field
    const categoryImage = category.image_url || category.image || '/images/category/placeholder.png';

    if (variant === 'icon') {
        // Icon style category card (for category carousel)
        return (
            <Link
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center text-center p-4 rounded-lg hover:shadow-md transition-all duration-300"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-grabit-primary/10 to-grabit-primary/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {category.icon ? (
                        <span className="text-3xl">{category.icon}</span>
                    ) : (
                        <img
                            src={imageError ? '/images/category/placeholder.png' : categoryImage}
                            alt={category.name}
                            className="w-12 h-12 object-contain"
                            onError={() => setImageError(true)}
                        />
                    )}
                </div>
                <h3 className="text-sm font-medium text-grabit-dark group-hover:text-grabit-primary transition-colors">
                    {category.name}
                </h3>
                {category.products_count !== undefined && (
                    <p className="text-xs text-grabit-gray mt-1">
                        {category.products_count} {category.products_count === 1 ? 'Product' : 'Products'}
                    </p>
                )}
            </Link>
        );
    }

    if (variant === 'large') {
        // Large category card with background image
        return (
            <Link
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg aspect-[3/2] block"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img
                    src={imageError ? '/images/category/placeholder.png' : categoryImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={() => setImageError(true)}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-heading font-bold text-white mb-1">
                        {category.name}
                    </h3>
                    {category.products_count !== undefined && (
                        <p className="text-sm text-white/90">
                            {category.products_count} {category.products_count === 1 ? 'Product' : 'Products'}
                        </p>
                    )}
                    <div className="mt-3 inline-flex items-center text-white text-sm font-medium group-hover:gap-2 transition-all">
                        <span>Shop Now</span>
                        <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </div>
            </Link>
        );
    }

    // Default category card
    return (
        <Link
            href={`/category/${category.slug}`}
            className="group bg-white border border-grabit-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
        >
            <div className="aspect-square bg-gray-50 overflow-hidden">
                <img
                    src={imageError ? '/images/category/placeholder.png' : categoryImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={() => setImageError(true)}
                />
            </div>
            <div className="p-4 text-center">
                <h3 className="text-base font-heading font-semibold text-grabit-dark group-hover:text-grabit-primary transition-colors">
                    {category.name}
                </h3>
                {category.products_count !== undefined && (
                    <p className="text-sm text-grabit-gray mt-1">
                        {category.products_count} {category.products_count === 1 ? 'Product' : 'Products'}
                    </p>
                )}
            </div>
        </Link>
    );
}
