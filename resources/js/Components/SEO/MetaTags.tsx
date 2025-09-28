import { Head } from '@inertiajs/react';

interface MetaTagsProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    price?: string;
    currency?: string;
    availability?: string;
    structuredData?: object;
}

export default function MetaTags({
    title = 'Premium E-commerce Store',
    description = 'Discover premium products at unbeatable prices. Shop now for the best deals.',
    keywords = 'ecommerce, online shopping, premium products, best deals',
    image = '/assets/images/logo.png',
    url = window.location.href,
    type = 'website',
    siteName = 'E-commerce Store',
    price,
    currency = 'USD',
    availability,
    structuredData
}: MetaTagsProps) {
    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="author" content={siteName} />
            
            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            
            {/* Product-specific Meta Tags */}
            {type === 'product' && price && (
                <>
                    <meta property="product:price:amount" content={price} />
                    <meta property="product:price:currency" content={currency} />
                    {availability && (
                        <meta property="product:availability" content={availability} />
                    )}
                </>
            )}
            
            {/* Canonical URL */}
            <link rel="canonical" href={url} />
            
            {/* Structured Data */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData)
                    }}
                />
            )}
        </Head>
    );
}