<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductTag;
use App\Models\ProductVariant;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    /**
     * Display a listing of the products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $products = Product::with(['vendor.user', 'category', 'variants', 'media'])
            ->when($request->search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('vendor', function ($q) use ($search) {
                        $q->where('business_name', 'like', "%{$search}%");
                    });
            })
            ->when($request->category, function ($query, $category) {
                return $query->where('category_id', $category);
            })
            ->when($request->vendor, function ($query, $vendor) {
                return $query->where('vendor_id', $vendor);
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Transform products for frontend
        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name ?: $product->title,
                'title' => $product->title,
                'sku' => $product->sku ?: 'N/A',
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => $product->price_cents ? $product->price_cents / 100 : ($product->base_price_cents / 100),
                'sale_price' => $product->sale_price_cents ? $product->sale_price_cents / 100 : null,
                'base_price_cents' => $product->base_price_cents,
                'price_cents' => $product->price_cents,
                'sale_price_cents' => $product->sale_price_cents,
                'compare_at_price_cents' => $product->compare_at_price_cents,
                'cost_cents' => $product->cost_cents,
                'stock' => $product->stock_quantity,
                'stock_quantity' => $product->stock_quantity,
                'status' => $product->status,
                'featured' => $product->is_featured ?? false,
                'is_featured' => $product->is_featured ?? false,
                'is_active' => $product->is_active ?? true,
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ],
                'vendor' => [
                    'id' => $product->vendor->id,
                    'name' => $product->vendor->business_name,
                ],
                'images' => $product->getMedia('images')->map(fn($media) => $media->getUrl())->toArray(),
                'variants' => $product->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'sku' => $variant->sku,
                        'price_cents' => $variant->price_cents,
                        'stock_quantity' => $variant->stock_quantity,
                        'is_default' => $variant->is_default,
                        'attributes' => $variant->attributes,
                    ];
                })->toArray(),
            ];
        });

        $categories = Category::all();
        $vendors = Vendor::with('user')->get()->map(function ($vendor) {
            return [
                'id' => $vendor->id,
                'name' => $vendor->business_name,
                'user' => $vendor->user,
            ];
        });

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'vendors' => $vendors,
            'filters' => $request->only(['search', 'category', 'vendor', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $categories = Category::all();
        $vendors = Vendor::with('user')->get();
        $tags = ProductTag::all();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
            'vendors' => $vendors,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sku' => 'nullable|string|max:255',
            'description' => 'required|string',
            'base_price_cents' => 'required|integer|min:0',
            'price_cents' => 'nullable|integer|min:0',
            'sale_price_cents' => 'nullable|integer|min:0',
            'compare_at_price_cents' => 'nullable|integer|min:0',
            'cost_cents' => 'nullable|integer|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'currency' => 'required|string|max:3',
            'status' => 'required|in:draft,published,archived',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:product_tags,id',
            'variants' => 'nullable|array',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.attributes' => 'nullable', // Can be string (JSON) or array
            'variants.*.price_cents' => 'required|integer|min:0',
            'variants.*.stock_quantity' => 'required|integer|min:0',
            'variants.*.is_default' => 'nullable',
        ]);

        $product = Product::create([
            'vendor_id' => $request->vendor_id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'name' => $request->name,
            'slug' => $request->slug ?: Str::slug($request->title),
            'sku' => $request->sku,
            'description' => $request->description,
            'base_price_cents' => $request->base_price_cents,
            'price_cents' => $request->price_cents,
            'sale_price_cents' => $request->sale_price_cents,
            'compare_at_price_cents' => $request->compare_at_price_cents,
            'cost_cents' => $request->cost_cents,
            'stock_quantity' => $request->stock_quantity,
            'currency' => $request->currency,
            'status' => $request->status,
            'is_active' => $request->is_active ?? true,
            'is_featured' => $request->is_featured ?? false,
            'published_at' => $request->status === 'published' ? now() : null,
        ]);

        // Attach tags if provided
        if ($request->tag_ids) {
            $product->tags()->attach($request->tag_ids);
        }

        // Create variants if provided
        if ($request->variants) {
            foreach ($request->variants as $variantData) {
                // Parse attributes if it's a JSON string
                $attributes = $variantData['attributes'] ?? null;
                if (is_string($attributes)) {
                    $attributes = json_decode($attributes, true);
                }

                ProductVariant::create([
                    'product_id' => $product->id,
                    'sku' => $variantData['sku'] ?? null,
                    'attributes' => $attributes,
                    'price_cents' => $variantData['price_cents'],
                    'stock_quantity' => $variantData['stock_quantity'],
                    'is_default' => $variantData['is_default'] ?? false,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product.
     *
     * @param  \App\Models\Product  $product
     * @return \Inertia\Response
     */
    public function show(Product $product)
    {
        $product->load(['vendor.user', 'category', 'variants', 'attributes']);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     *
     * @param  \App\Models\Product  $product
     * @return \Inertia\Response
     */
    public function edit(Product $product)
    {
        $product->load(['variants', 'tags', 'media']);
        $categories = Category::all();
        $vendors = Vendor::with('user')->get();
        $tags = ProductTag::all();

        // Get product images
        $images = $product->getMedia('images')->map(function ($media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'name' => $media->name,
                'size' => $media->size,
            ];
        });

        return Inertia::render('Admin/Products/Edit', [
            'product' => array_merge($product->toArray(), ['images' => $images]),
            'categories' => $categories,
            'vendors' => $vendors,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sku' => 'nullable|string|max:255',
            'description' => 'required|string',
            'base_price_cents' => 'required|integer|min:0',
            'price_cents' => 'nullable|integer|min:0',
            'sale_price_cents' => 'nullable|integer|min:0',
            'compare_at_price_cents' => 'nullable|integer|min:0',
            'cost_cents' => 'nullable|integer|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'currency' => 'required|string|max:3',
            'status' => 'required|in:draft,published,archived',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:product_tags,id',
            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|exists:product_variants,id',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.attributes' => 'nullable', // Can be string (JSON) or array
            'variants.*.price_cents' => 'required|integer|min:0',
            'variants.*.stock_quantity' => 'required|integer|min:0',
            'variants.*.is_default' => 'nullable',
        ]);

        $product->update([
            'vendor_id' => $request->vendor_id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'name' => $request->name,
            'slug' => $request->slug ?: Str::slug($request->title),
            'sku' => $request->sku,
            'description' => $request->description,
            'base_price_cents' => $request->base_price_cents,
            'price_cents' => $request->price_cents,
            'sale_price_cents' => $request->sale_price_cents,
            'compare_at_price_cents' => $request->compare_at_price_cents,
            'cost_cents' => $request->cost_cents,
            'stock_quantity' => $request->stock_quantity,
            'currency' => $request->currency,
            'status' => $request->status,
            'is_active' => $request->is_active ?? $product->is_active,
            'is_featured' => $request->is_featured ?? $product->is_featured,
            'published_at' => $request->status === 'published' && !$product->published_at ? now() : $product->published_at,
        ]);

        // Sync tags (sync even if empty array to remove all tags)
        $product->tags()->sync($request->input('tag_ids', []));

        // Update variants
        if ($request->variants) {
            $variantIds = [];

            foreach ($request->variants as $variantData) {
                // Parse attributes if it's a JSON string
                $attributes = $variantData['attributes'] ?? null;
                if (is_string($attributes)) {
                    $attributes = json_decode($attributes, true);
                }

                if (isset($variantData['id'])) {
                    // Update existing variant
                    $variant = ProductVariant::find($variantData['id']);
                    if ($variant && $variant->product_id === $product->id) {
                        $variant->update([
                            'sku' => $variantData['sku'] ?? null,
                            'attributes' => $attributes,
                            'price_cents' => $variantData['price_cents'],
                            'stock_quantity' => $variantData['stock_quantity'],
                            'is_default' => $variantData['is_default'] ?? false,
                        ]);
                        $variantIds[] = $variant->id;
                    }
                } else {
                    // Create new variant
                    $variant = ProductVariant::create([
                        'product_id' => $product->id,
                        'sku' => $variantData['sku'] ?? null,
                        'attributes' => $attributes,
                        'price_cents' => $variantData['price_cents'],
                        'stock_quantity' => $variantData['stock_quantity'],
                        'is_default' => $variantData['is_default'] ?? false,
                    ]);
                    $variantIds[] = $variant->id;
                }
            }

            // Delete variants that are no longer present
            $product->variants()->whereNotIn('id', $variantIds)->delete();
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Bulk update product status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
            'status' => 'required|in:draft,published,archived',
        ]);

        Product::whereIn('id', $request->product_ids)->update([
            'status' => $request->status,
            'published_at' => $request->status === 'published' ? now() : null,
        ]);

        return redirect()->back()
            ->with('success', 'Products updated successfully.');
    }
}