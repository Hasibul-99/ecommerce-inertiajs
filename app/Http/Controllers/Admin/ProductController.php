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
        $products = Product::with(['vendor', 'category', 'variants'])
            ->when($request->search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('vendor', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
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

        $categories = Category::all();
        $vendors = Vendor::with('user')->get();

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
            'description' => 'required|string',
            'base_price_cents' => 'required|integer|min:0',
            'currency' => 'required|string|max:3',
            'status' => 'required|in:draft,published,archived',
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
            'slug' => Str::slug($request->title),
            'description' => $request->description,
            'base_price_cents' => $request->base_price_cents,
            'currency' => $request->currency,
            'status' => $request->status,
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
        $product->load(['variants', 'tags']);
        $categories = Category::all();
        $vendors = Vendor::with('user')->get();
        $tags = ProductTag::all();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
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
            'description' => 'required|string',
            'base_price_cents' => 'required|integer|min:0',
            'currency' => 'required|string|max:3',
            'status' => 'required|in:draft,published,archived',
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
            'slug' => Str::slug($request->title),
            'description' => $request->description,
            'base_price_cents' => $request->base_price_cents,
            'currency' => $request->currency,
            'status' => $request->status,
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