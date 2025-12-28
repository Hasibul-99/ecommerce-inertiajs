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
  image?: string;
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
            {categories.map((category, index) => {
              const colorClass = colorPalette[index % colorPalette.length];

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <div className={`${colorClass} border-2 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 h-full`}>
                    <div className="flex flex-col items-center justify-center text-center h-full">
                      {/* Category Icon/Image */}
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-grabit-primary transition-colors">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <FiPackage className="w-8 h-8 text-grabit-primary group-hover:text-white transition-colors" />
                        )}
                      </div>

                      {/* Category Info */}
                      <h3 className="text-lg font-heading font-semibold text-grabit-dark mb-2 group-hover:text-grabit-primary transition-colors">
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