import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import CategoryCard from '@/Components/Frontend/CategoryCard';
import MetaTags from '@/Components/SEO/MetaTags';
import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
    image?: string;
    image_url?: string;
    products_count?: number;
    icon?: string;
    parent_id?: number | null;
}

interface HeroSlide {
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
    image: string;
}

interface WelcomeProps extends PageProps {
    heroSlides?: HeroSlide[];
    featuredProducts?: Product[];
    dealProducts?: Product[];
    newProducts?: Product[];
    categories?: Category[];
    cartCount?: number;
    wishlistCount?: number;
}

export default function Welcome({
    auth,
    heroSlides = [],
    featuredProducts = [],
    dealProducts = [],
    newProducts = [],
    categories = [],
    cartCount = 0,
    wishlistCount = 0
}: WelcomeProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fallback hero slides if none are configured in admin panel
    const defaultHeroSlides: HeroSlide[] = [
        {
            id: 1,
            title: 'Fresh Groceries',
            subtitle: 'Delivered to Your Doorstep',
            description: 'Get farm-fresh products with unbeatable prices',
            image: '/images/hero-bg/1.jpg',
            buttonText: 'Shop Now',
            buttonLink: '/products'
        },
        {
            id: 2,
            title: 'Big Sale',
            subtitle: 'Up to 50% Off',
            description: 'On all electronics and accessories',
            image: '/images/hero-bg/2.jpg',
            buttonText: 'Browse Deals',
            buttonLink: '/products?sale=1'
        },
        {
            id: 3,
            title: 'New Arrivals',
            subtitle: 'Latest Collection 2024',
            description: 'Discover the newest products in fashion and lifestyle',
            image: '/images/hero-bg/3.jpg',
            buttonText: 'Explore Now',
            buttonLink: '/products?new=1'
        }
    ];

    // Use dynamic slides from database, or fallback to default
    const slides = heroSlides.length > 0 ? heroSlides : defaultHeroSlides;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const organizationStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Premium E-commerce Store',
        'url': typeof window !== 'undefined' ? window.location.origin : '',
        'logo': `${typeof window !== 'undefined' ? window.location.origin : ''}/images/logo/logo.png`,
        'sameAs': [
            'https://www.facebook.com/yourstore',
            'https://www.twitter.com/yourstore',
            'https://www.instagram.com/yourstore'
        ],
        'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': '+1-555-123-4567',
            'contactType': 'customer service'
        }
    };

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <MetaTags
                title="Premium E-commerce Store - Your Online Shopping Destination"
                description="Discover thousands of premium products at unbeatable prices. Free shipping, easy returns, and 24/7 customer support. Shop electronics, fashion, home & garden, and more."
                keywords="ecommerce, online shopping, premium products, best deals, electronics, fashion, home garden, free shipping"
                type="website"
                structuredData={organizationStructuredData}
            />

            {/* Hero Slider */}
            <section className="relative h-[500px] bg-gray-100 overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-hero.jpg';
                            }}
                        />
                        <div className="absolute inset-0 z-20 flex items-center">
                            <div className="container mx-auto px-4">
                                <div className="max-w-2xl">
                                    <h2 className="text-5xl font-heading font-bold text-white mb-4">
                                        {slide.title}
                                    </h2>
                                    <p className="text-2xl text-white mb-2">{slide.subtitle}</p>
                                    <p className="text-lg text-white/90 mb-8">{slide.description}</p>
                                    <Link
                                        href={slide.buttonLink}
                                        className="inline-block bg-grabit-primary hover:bg-grabit-primary-dark text-white px-8 py-3 rounded-md font-medium transition-colors"
                                    >
                                        {slide.buttonText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                >
                    <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                >
                    <FiChevronRight className="w-6 h-6" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentSlide
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Categories */}
            {categories.length > 0 && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-heading font-bold text-grabit-dark">
                                Shop by Category
                            </h2>
                            <Link
                                href="/categories"
                                className="text-grabit-primary hover:text-grabit-primary-dark font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {categories
                                .filter(category => !category.parent_id)
                                .slice(0, 12)
                                .map((category) => (
                                    <CategoryCard key={category.id} category={category} variant="large" />
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Deal of the Day */}
            {dealProducts.length > 0 && (
                <section className="py-12 bg-grabit-bg-light">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
                                    Deal of the Day
                                </h2>
                                <p className="text-grabit-gray">Don't miss out on today's special offers</p>
                            </div>
                            <Link
                                href="/products?sale=1"
                                className="text-grabit-primary hover:text-grabit-primary-dark font-medium"
                            >
                                View All Deals →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dealProducts.slice(0, 5).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-heading font-bold text-grabit-dark">
                                Featured Products
                            </h2>
                            <Link
                                href="/products"
                                className="text-grabit-primary hover:text-grabit-primary-dark font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {featuredProducts.slice(0, 10).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* New Arrivals */}
            {newProducts.length > 0 && (
                <section className="py-12 bg-grabit-bg-light">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-heading font-bold text-grabit-dark">
                                New Arrivals
                            </h2>
                            <Link
                                href="/products?new=1"
                                className="text-grabit-primary hover:text-grabit-primary-dark font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {newProducts.slice(0, 10).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Services Banner */}
            <section className="py-12 bg-white border-t">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-grabit-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-3xl">🚚</span>
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-grabit-dark mb-1">
                                    Free Shipping
                                </h3>
                                <p className="text-sm text-grabit-gray">On orders over $50</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-grabit-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-3xl">💳</span>
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-grabit-dark mb-1">
                                    Secure Payment
                                </h3>
                                <p className="text-sm text-grabit-gray">100% secure payments</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-grabit-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-3xl">🔄</span>
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-grabit-dark mb-1">
                                    Easy Returns
                                </h3>
                                <p className="text-sm text-grabit-gray">30-day return policy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
