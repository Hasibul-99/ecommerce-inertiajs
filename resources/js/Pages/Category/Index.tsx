import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { PageProps } from '@/types';
import { FiChevronRight, FiPackage } from 'react-icons/fi';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string; // Legacy support
  image_url?: string; // New field from Spatie Media Library
  products_count: number;
}

interface CategoryIndexProps extends PageProps {
  categories: Category[];
  cartCount?: number;
  wishlistCount?: number;
}

// Color palette for category cards
const colorPalette = [
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-yellow-50 border-yellow-200',
  'bg-purple-50 border-purple-200',
  'bg-pink-50 border-pink-200',
  'bg-indigo-50 border-indigo-200',
  'bg-red-50 border-red-200',
  'bg-orange-50 border-orange-200',
];

export default function CategoryIndex({
  auth,
  categories = [],
  cartCount = 0,
  wishlistCount = 0
}: CategoryIndexProps) {

  return (
    <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
      <Head title="All Categories" />

      {/* Breadcrumb */}
      <div className="bg-grabit-bg-light py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-grabit-gray">
            <Link href="/" className="hover:text-grabit-primary">Home</Link>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-grabit-dark">Categories</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-grabit-border py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
            Shop by Category
          </h1>
          <p className="text-grabit-gray">
            Browse our wide range of product categories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const categoryImage = category.image_url || category.image;

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300"
                >
                  {/* Category Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    {categoryImage ? (
                      <img
                        src={categoryImage}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-heading font-semibold text-grabit-dark group-hover:text-grabit-primary transition-colors mb-2">
                      {category.name}
                    </h3>

                    {category.description && (
                      <p className="text-sm text-grabit-gray mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    <p className="text-sm text-grabit-gray">
                      {category.products_count} {category.products_count === 1 ? 'Product' : 'Products'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-heading font-semibold text-grabit-dark mb-2">
              No categories found
            </h3>
            <p className="text-grabit-gray mb-6">
              Categories will appear here once they are added
            </p>
            <Link
              href="/"
              className="inline-block bg-grabit-primary hover:bg-grabit-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </section>
    </FrontendLayout>
  );
}