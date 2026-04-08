<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\VendorProductStoreRequest;
use App\Http\Requests\VendorProductUpdateRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductTag;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:vendor']);
    }

    public function index(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor || !$vendor->isApproved()) {
            return redirect()->route('dashboard')
                ->with('error', 'You must be an approved vendor to manage products.');
        }

        $query = Product::with(['category', 'variants', 'tags'])
            ->where('vendor_id', $vendor->id)
            ->withCount(['variants', 'orderItems'])
            ->when($request->search, function ($q, $search) {
                return $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->status, function ($q, $status) {
                return $q->where('status', $status);
            })
            ->when($request->category, function ($q, $category) {
                return $q->where('category_id', $category);
            });

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        if (in_array($sortBy, ['created_at', 'updated_at', 'title', 'base_price_cents'])) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate($request->get('per_page', 15))->withQueryString();

        $products->getCollection()->transform(function ($product) {
            $totalStock = $product->variants->sum('stock_quantity');
            $minPrice = $product->variants->min('price_cents') ?? $product->base_price_cents;

            return [
                'id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'description' => Str::limit($product->description, 100),
                'status' => $product->status,
                'base_price_cents' => $product->base_price_cents,
                'base_price' => $product->base_price_cents / 100,
                'min_price' => $minPrice / 100,
                'created_at' => $product->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $product->updated_at->format('Y-m-d H:i:s'),
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ] : null,
                'variants_count' => $product->variants_count,
                'total_stock' => $totalStock,
                'sales_count' => $product->order_items_count,
                'primary_image' => $product->getMedia('images')->first()?->getUrl(),
            ];
        });

        $categories = Category::all(['id', 'name']);

        return Inertia::render('Vendor/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'category', 'sort_by', 'sort_direction', 'per_page']),
            'stats' => [
                'total' => Product::where('vendor_id', $vendor->id)->count(),
                'published' => Product::where('vendor_id', $vendor->id)->where('status', 'published')->count(),
                'draft' => Product::where('vendor_id', $vendor->id)->where('status', 'draft')->count(),
                'out_of_stock' => Product::where('vendor_id', $vendor->id)
                    ->whereDoesntHave('variants', function ($q) {
                        $q->where('stock_quantity', '>', 0);
                    })->count(),
            ],
        ]);
    }

    public function create()
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor || !$vendor->isApproved()) {
            return redirect()->route('vendor.dashboard')
                ->with('error', 'You must be an approved vendor to create products.');
        }

        $this->authorize('create', Product::class);

        $categories = Category::all(['id', 'name', 'slug']);
        $tags = ProductTag::all(['id', 'name', 'slug']);

        return Inertia::render('Vendor/Products/Create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function store(VendorProductStoreRequest $request)
    {
        $vendor = Auth::user()->vendor;

        $this->authorize('create', Product::class);

        try {
            $product = DB::transaction(function () use ($request, $vendor) {
                $product = Product::create([
                    'vendor_id' => $vendor->id,
                    'category_id' => $request->category_id,
                    'title' => $request->title,
                    'slug' => Str::slug($request->title),
                    'description' => $request->description,
                    'base_price_cents' => $request->base_price_cents,
                    'currency' => $request->currency ?? 'USD',
                    'status' => $request->status ?? 'draft',
                    'published_at' => $request->status === 'published' ? now() : null,
                ]);

                if ($request->tag_ids) {
                    $product->tags()->attach($request->tag_ids);
                }

                if ($request->variants && count($request->variants) > 0) {
                    foreach ($request->variants as $index => $variantData) {
                        ProductVariant::create([
                            'product_id' => $product->id,
                            'sku' => $variantData['sku'] ?? $product->slug . '-' . ($index + 1),
                            'attributes' => $variantData['attributes'] ?? null,
                            'price_cents' => $variantData['price_cents'],
                            'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                            'is_default' => $index === 0,
                        ]);
                    }
                } else {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'sku' => $product->slug . '-default',
                        'price_cents' => $request->base_price_cents,
                        'stock_quantity' => $request->stock_quantity ?? 0,
                        'is_default' => true,
                    ]);
                }

                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $product->addMedia($image)->toMediaCollection('images');
                    }
                }

                activity()
                    ->performedOn($product)
                    ->causedBy(Auth::user())
                    ->log('Product created');

                return $product;
            });

            return redirect()->route('vendor.products.edit', $product)
                ->with('success', 'Product created successfully.');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);

        $product->load(['category', 'variants', 'tags']);

        return Inertia::render('Vendor/Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        $product->load(['variants', 'tags']);

        $categories = Category::all(['id', 'name', 'slug']);
        $tags = ProductTag::all(['id', 'name', 'slug']);

        return Inertia::render('Vendor/Products/Edit', [
            'product' => [
                'id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'description' => $product->description,
                'category_id' => $product->category_id,
                'base_price_cents' => $product->base_price_cents,
                'base_price' => $product->base_price_cents / 100,
                'currency' => $product->currency,
                'status' => $product->status,
                'tags' => $product->tags->pluck('id'),
                'variants' => $product->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'sku' => $variant->sku,
                        'attributes' => $variant->attributes,
                        'price_cents' => $variant->price_cents,
                        'price' => $variant->price_cents / 100,
                        'stock_quantity' => $variant->stock_quantity,
                        'is_default' => $variant->is_default,
                    ];
                }),
                'images' => $product->getMedia('images')->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'url' => $media->getUrl(),
                        'thumb' => $media->getUrl('thumb'),
                    ];
                }),
            ],
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function update(VendorProductUpdateRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        try {
            DB::transaction(function () use ($request, $product) {
                $product->update([
                    'category_id' => $request->category_id,
                    'title' => $request->title,
                    'slug' => Str::slug($request->title),
                    'description' => $request->description,
                    'base_price_cents' => $request->base_price_cents,
                    'currency' => $request->currency ?? 'USD',
                    'status' => $request->status,
                    'published_at' => $request->status === 'published' && !$product->published_at ? now() : $product->published_at,
                ]);

                if ($request->has('tag_ids')) {
                    $product->tags()->sync($request->tag_ids ?? []);
                }

                if ($request->variants) {
                    $variantIds = [];

                    foreach ($request->variants as $index => $variantData) {
                        if (isset($variantData['id'])) {
                            $variant = ProductVariant::find($variantData['id']);
                            if ($variant && $variant->product_id === $product->id) {
                                $variant->update([
                                    'sku' => $variantData['sku'] ?? $variant->sku,
                                    'attributes' => $variantData['attributes'] ?? null,
                                    'price_cents' => $variantData['price_cents'],
                                    'stock_quantity' => $variantData['stock_quantity'],
                                    'is_default' => $variantData['is_default'] ?? $variant->is_default,
                                ]);
                                $variantIds[] = $variant->id;
                            }
                        } else {
                            $variant = ProductVariant::create([
                                'product_id' => $product->id,
                                'sku' => $variantData['sku'] ?? $product->slug . '-' . ($index + 1),
                                'attributes' => $variantData['attributes'] ?? null,
                                'price_cents' => $variantData['price_cents'],
                                'stock_quantity' => $variantData['stock_quantity'],
                                'is_default' => $variantData['is_default'] ?? false,
                            ]);
                            $variantIds[] = $variant->id;
                        }
                    }

                    $product->variants()->whereNotIn('id', $variantIds)->delete();
                }

                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $product->addMedia($image)->toMediaCollection('images');
                    }
                }

                activity()
                    ->performedOn($product)
                    ->causedBy(Auth::user())
                    ->log('Product updated');
            });

            return redirect()->route('vendor.products.index')
                ->with('success', 'Product updated successfully.');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete();

        activity()
            ->performedOn($product)
            ->causedBy(Auth::user())
            ->log('Product deleted');

        return redirect()->route('vendor.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function duplicate(Product $product)
    {
        $this->authorize('create', Product::class);
        $this->authorize('view', $product);

        try {
            $newProduct = DB::transaction(function () use ($product) {
                $newProduct = $product->replicate();
                $newProduct->title = $product->title . ' (Copy)';
                $newProduct->slug = Str::slug($newProduct->title) . '-' . Str::random(6);
                $newProduct->status = 'draft';
                $newProduct->published_at = null;
                $newProduct->save();

                foreach ($product->variants as $variant) {
                    $newVariant = $variant->replicate();
                    $newVariant->product_id = $newProduct->id;
                    $newVariant->sku = $newProduct->slug . '-' . Str::random(4);
                    $newVariant->save();
                }

                $newProduct->tags()->sync($product->tags->pluck('id'));

                foreach ($product->getMedia('images') as $media) {
                    $media->copy($newProduct, 'images');
                }

                activity()
                    ->performedOn($newProduct)
                    ->causedBy(Auth::user())
                    ->log('Product duplicated from ' . $product->title);

                return $newProduct;
            });

            return redirect()->route('vendor.products.edit', $newProduct)
                ->with('success', 'Product duplicated successfully.');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function toggleStatus(Product $product)
    {
        $this->authorize('update', $product);

        $newStatus = $product->status === 'published' ? 'draft' : 'published';

        $product->update([
            'status' => $newStatus,
            'published_at' => $newStatus === 'published' && !$product->published_at ? now() : $product->published_at,
        ]);

        activity()
            ->performedOn($product)
            ->causedBy(Auth::user())
            ->log('Product status changed to ' . $newStatus);

        return back()->with('success', 'Product status updated to ' . $newStatus . '.');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete,publish,unpublish,archive',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'exists:products,id',
        ]);

        $vendor = Auth::user()->vendor;
        $products = Product::whereIn('id', $request->product_ids)
            ->where('vendor_id', $vendor->id)
            ->get();

        if ($products->isEmpty()) {
            return back()->with('error', 'No valid products found.');
        }

        foreach ($products as $product) {
            $this->authorize('update', $product);
        }

        try {
            DB::transaction(function () use ($request, $products) {
                switch ($request->action) {
                    case 'delete':
                        foreach ($products as $product) {
                            $this->authorize('delete', $product);
                            $product->delete();
                        }
                        $message = count($products) . ' products deleted successfully.';
                        break;

                    case 'publish':
                        Product::whereIn('id', $products->pluck('id'))
                            ->update([
                                'status' => 'published',
                                'published_at' => now(),
                            ]);
                        $message = count($products) . ' products published successfully.';
                        break;

                    case 'unpublish':
                        Product::whereIn('id', $products->pluck('id'))
                            ->update(['status' => 'draft']);
                        $message = count($products) . ' products unpublished successfully.';
                        break;

                    case 'archive':
                        Product::whereIn('id', $products->pluck('id'))
                            ->update(['status' => 'archived']);
                        $message = count($products) . ' products archived successfully.';
                        break;

                    default:
                        $message = 'Invalid action.';
                }

                activity()
                    ->causedBy(Auth::user())
                    ->log('Bulk action: ' . $request->action . ' on ' . count($products) . ' products');
            });

            return back()->with('success', $message);

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
