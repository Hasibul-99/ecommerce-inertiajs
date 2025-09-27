<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\URL;

class SeoController extends Controller
{
    /**
     * Generate XML sitemap
     */
    public function sitemap()
    {
        $urls = collect();

        // Add static pages
        $staticPages = [
            ['url' => route('home'), 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => route('products.index'), 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => route('categories.index'), 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => route('about'), 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => route('contact'), 'priority' => '0.6', 'changefreq' => 'monthly'],
        ];

        foreach ($staticPages as $page) {
            $urls->push($page);
        }

        // Add product pages
        Product::where('status', 'active')
            ->where('published_at', '<=', now())
            ->chunk(100, function ($products) use ($urls) {
                foreach ($products as $product) {
                    $urls->push([
                        'url' => route('products.show', $product->slug),
                        'lastmod' => $product->updated_at->toAtomString(),
                        'priority' => '0.8',
                        'changefreq' => 'weekly'
                    ]);
                }
            });

        // Add category pages
        Category::where('status', 'active')
            ->chunk(100, function ($categories) use ($urls) {
                foreach ($categories as $category) {
                    $urls->push([
                        'url' => route('categories.show', $category->slug),
                        'lastmod' => $category->updated_at->toAtomString(),
                        'priority' => '0.7',
                        'changefreq' => 'weekly'
                    ]);
                }
            });

        $xml = view('seo.sitemap', compact('urls'))->render();

        return Response::make($xml, 200, [
            'Content-Type' => 'application/xml'
        ]);
    }

    /**
     * Generate robots.txt
     */
    public function robots()
    {
        $content = "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Disallow: /admin/\n";
        $content .= "Disallow: /vendor/\n";
        $content .= "Disallow: /cart\n";
        $content .= "Disallow: /checkout\n";
        $content .= "Disallow: /login\n";
        $content .= "Disallow: /register\n";
        $content .= "\n";
        $content .= "Sitemap: " . URL::to('/sitemap.xml') . "\n";

        return Response::make($content, 200, [
            'Content-Type' => 'text/plain'
        ]);
    }

    /**
     * Get SEO meta data for a given page
     */
    public static function getMetaData($page, $data = [])
    {
        $defaults = [
            'title' => config('app.name') . ' - Premium E-commerce Store',
            'description' => 'Discover premium products at unbeatable prices. Shop now for the best deals on electronics, fashion, home & garden, and more.',
            'keywords' => 'ecommerce, online shopping, premium products, best deals, electronics, fashion, home garden',
            'image' => asset('assets/images/logo.png'),
            'url' => request()->url(),
            'type' => 'website',
            'site_name' => config('app.name'),
        ];

        switch ($page) {
            case 'product':
                if (isset($data['product'])) {
                    $product = $data['product'];
                    return array_merge($defaults, [
                        'title' => $product->name . ' - ' . config('app.name'),
                        'description' => $product->short_description ?: $product->description,
                        'keywords' => $product->tags->pluck('name')->join(', '),
                        'image' => $product->getFirstMediaUrl('images') ?: $defaults['image'],
                        'type' => 'product',
                        'price' => $product->price,
                        'currency' => 'USD',
                        'availability' => $product->stock_quantity > 0 ? 'in stock' : 'out of stock',
                    ]);
                }
                break;

            case 'category':
                if (isset($data['category'])) {
                    $category = $data['category'];
                    return array_merge($defaults, [
                        'title' => $category->name . ' - ' . config('app.name'),
                        'description' => $category->description ?: "Shop the best {$category->name} products at {$defaults['site_name']}",
                        'keywords' => $category->name . ', ' . $defaults['keywords'],
                        'image' => $category->getFirstMediaUrl('images') ?: $defaults['image'],
                    ]);
                }
                break;

            case 'home':
                return array_merge($defaults, [
                    'title' => config('app.name') . ' - Your Premium Online Shopping Destination',
                    'description' => 'Discover thousands of premium products at unbeatable prices. Free shipping, easy returns, and 24/7 customer support.',
                ]);

            case 'products':
                return array_merge($defaults, [
                    'title' => 'All Products - ' . config('app.name'),
                    'description' => 'Browse our complete collection of premium products. Find exactly what you\'re looking for with our advanced filtering options.',
                ]);
        }

        return $defaults;
    }

    /**
     * Generate structured data for products
     */
    public static function getProductStructuredData($product)
    {
        return [
            '@context' => 'https://schema.org/',
            '@type' => 'Product',
            'name' => $product->name,
            'description' => $product->description,
            'image' => $product->getFirstMediaUrl('images'),
            'sku' => $product->sku,
            'brand' => [
                '@type' => 'Brand',
                'name' => $product->vendor->name ?? config('app.name')
            ],
            'offers' => [
                '@type' => 'Offer',
                'price' => $product->price,
                'priceCurrency' => 'USD',
                'availability' => $product->stock_quantity > 0 
                    ? 'https://schema.org/InStock' 
                    : 'https://schema.org/OutOfStock',
                'seller' => [
                    '@type' => 'Organization',
                    'name' => config('app.name')
                ]
            ],
            'aggregateRating' => [
                '@type' => 'AggregateRating',
                'ratingValue' => $product->average_rating ?? 5,
                'reviewCount' => $product->reviews_count ?? 1
            ]
        ];
    }

    /**
     * Generate structured data for organization
     */
    public static function getOrganizationStructuredData()
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => config('app.name'),
            'url' => config('app.url'),
            'logo' => asset('assets/images/logo.png'),
            'sameAs' => [
                'https://www.facebook.com/yourstore',
                'https://www.twitter.com/yourstore',
                'https://www.instagram.com/yourstore'
            ],
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'telephone' => '+1-555-123-4567',
                'contactType' => 'customer service'
            ]
        ];
    }
}