import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Guest from '@/Layouts/GuestLayout';
import DayDeals from '@/Components/App/Home/DayDeals';
import TopSellingProducts from '@/Components/App/Home/Top-SellingProducts';
import MetaTags from '@/Components/SEO/MetaTags';


export default function Welcome({ auth, laravelVersion, phpVersion }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    const organizationStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Premium E-commerce Store',
        'url': window.location.origin,
        'logo': `${window.location.origin}/assets/images/logo.png`,
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
        <>
            <MetaTags
                title="Premium E-commerce Store - Your Online Shopping Destination"
                description="Discover thousands of premium products at unbeatable prices. Free shipping, easy returns, and 24/7 customer support. Shop electronics, fashion, home & garden, and more."
                keywords="ecommerce, online shopping, premium products, best deals, electronics, fashion, home garden, free shipping"
                type="website"
                structuredData={organizationStructuredData}
            />
            <Guest>
                <DayDeals />
                <TopSellingProducts />
            </Guest>
        </>
    );
}
