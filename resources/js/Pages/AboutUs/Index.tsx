import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { PageProps } from '@/types';
import { FiChevronRight, FiTruck, FiHeadphones, FiRotateCw, FiShield, FiAward, FiUsers } from 'react-icons/fi';

interface AboutUsProps extends PageProps {
  cartCount?: number;
  wishlistCount?: number;
}

export default function AboutUs({
  auth,
  cartCount = 0,
  wishlistCount = 0
}: AboutUsProps) {
  const services = [
    {
      id: 1,
      title: 'Free Shipping',
      description: 'Free shipping on all orders over $200',
      icon: FiTruck,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 2,
      title: '24/7 Support',
      description: 'Dedicated customer support anytime',
      icon: FiHeadphones,
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 3,
      title: '30 Days Return',
      description: 'Easy returns within 30 days',
      icon: FiRotateCw,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      id: 4,
      title: 'Secure Payment',
      description: '100% secure payment processing',
      icon: FiShield,
      color: 'bg-purple-50 text-purple-600'
    },
  ];

  const stats = [
    { id: 1, value: '10K+', label: 'Happy Customers', icon: FiUsers },
    { id: 2, value: '5K+', label: 'Products', icon: FiAward },
    { id: 3, value: '50+', label: 'Categories', icon: FiShield },
    { id: 4, value: '99%', label: 'Satisfaction', icon: FiAward },
  ];

  return (
    <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
      <Head title="About Us" />

      {/* Breadcrumb */}
      <div className="bg-grabit-bg-light py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-grabit-gray">
            <Link href="/" className="hover:text-grabit-primary">Home</Link>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-grabit-dark">About Us</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-grabit-primary to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            About Our Store
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Your trusted partner for quality products and exceptional service
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b border-grabit-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 bg-grabit-primary bg-opacity-10 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-grabit-primary" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-grabit-dark mb-1">{stat.value}</h3>
                  <p className="text-grabit-gray">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-grabit-primary bg-opacity-10 rounded-lg p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <FiAward className="w-32 h-32 text-grabit-primary mx-auto mb-4" />
                <p className="text-2xl font-semibold text-grabit-dark">Quality First</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-heading font-bold text-grabit-dark mb-4">
              Who We <span className="text-grabit-primary">Are</span>
            </h2>
            <p className="text-grabit-gray mb-4 leading-relaxed">
              We're dedicated to bringing you the best products at competitive prices. Our mission is to provide
              exceptional quality and service that exceeds your expectations.
            </p>
            <p className="text-grabit-gray mb-4 leading-relaxed">
              With years of experience in the industry, we've built a reputation for reliability, quality, and
              customer satisfaction. Every product in our catalog is carefully selected to ensure it meets our
              high standards.
            </p>
            <p className="text-grabit-gray mb-6 leading-relaxed">
              Our team is passionate about what we do, and we're committed to making your shopping experience
              seamless and enjoyable. From browsing to delivery, we're here to help every step of the way.
            </p>
            <Link
              href="/products"
              className="inline-block bg-grabit-primary hover:bg-grabit-primary-dark text-white px-8 py-3 rounded-md font-medium transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-grabit-bg-light py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-grabit-dark mb-3">
              Our <span className="text-grabit-primary">Services</span>
            </h2>
            <p className="text-grabit-gray max-w-2xl mx-auto">
              We provide exceptional services to ensure your complete satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white border border-grabit-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-grabit-dark mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-grabit-gray">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-grabit-dark mb-3">
            Our <span className="text-grabit-primary">Values</span>
          </h2>
          <p className="text-grabit-gray max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-grabit-dark mb-2">Quality</h3>
            <p className="text-grabit-gray">
              We never compromise on quality. Every product is carefully vetted to meet our high standards.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-grabit-dark mb-2">Customer First</h3>
            <p className="text-grabit-gray">
              Your satisfaction is our priority. We're dedicated to providing exceptional customer service.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShield className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-grabit-dark mb-2">Trust</h3>
            <p className="text-grabit-gray">
              We build lasting relationships through transparency, honesty, and reliable service.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-grabit-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Explore our wide range of products and find exactly what you need
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-white text-grabit-primary hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/categories"
              className="inline-block bg-transparent border-2 border-white text-white hover:bg-white hover:text-grabit-primary px-8 py-3 rounded-md font-medium transition-colors"
            >
              View Categories
            </Link>
          </div>
        </div>
      </section>
    </FrontendLayout>
  );
}
