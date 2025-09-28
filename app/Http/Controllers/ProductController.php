<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
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
        $this->middleware('auth')->except(['index', 'show']);
    }

    /**
     * Display a listing of the products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // If search query is provided, use Meilisearch
        if ($request->has('q')) {
            $searchResults = Product::search($request->q)
                ->when($request->category, function ($query, $category) {
                    return $query->where('category.slug', $category);
                })
                ->get();
                
            // Get the IDs from search results
            $productIds = $searchResults->pluck('id')->toArray();
            
            // Query the database with these IDs to get full product data with relationships
            $products = Product::with(['category', 'media'])
                ->whereIn('id', $productIds)
                ->where('status', 'published')
                ->when($request->sort, function ($query, $sort) {
                    if ($sort === 'price_asc') {
                        return $query->orderBy('base_price_cents', 'asc');
                    } elseif ($sort === 'price_desc') {
                        return $query->orderBy('base_price_cents', 'desc');
                    } elseif ($sort === 'newest') {
                        return $query->orderBy('created_at', 'desc');
                    } else {
                        return $query->orderBy('created_at', 'desc');
                    }
                }, function ($query) {
                    return $query->orderBy('created_at', 'desc');
                })
                ->paginate(12)
                ->appends($request->query());
        } else {
            // Regular database query without search
            $products = Product::with(['category', 'media'])
                ->where('status', 'published')
                ->when($request->category, function ($query, $category) {
                    return $query->whereHas('category', function ($q) use ($category) {
                        $q->where('slug', $category);
                    });
                })
                ->when($request->search, function ($query, $search) {
                    return $query->where('title', 'like', "%{$search}%");
                })
                ->when($request->sort, function ($query, $sort) {
                    if ($sort === 'price_asc') {
                        return $query->orderBy('base_price_cents', 'asc');
                    } elseif ($sort === 'price_desc') {
                        return $query->orderBy('base_price_cents', 'desc');
                    } elseif ($sort === 'newest') {
                        return $query->orderBy('created_at', 'desc');
                    } else {
                        return $query->orderBy('created_at', 'desc');
                    }
                }, function ($query) {
                    return $query->orderBy('created_at', 'desc');
                })
                ->paginate(12)
                ->appends($request->query());
        }

        return Inertia::render('Products', [
            'products' => $products,
            'filters' => $request->only(['search', 'category', 'sort']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $this->authorize('create', Product::class);

        $categories = Category::all();

        return Inertia::render('Product/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product in storage.
     *
     * @param  \App\Http\Requests\ProductStoreRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ProductStoreRequest $request)
    {
        $this->authorize('create', Product::class);

        $product = Product::create($request->validated());

        return redirect()->route('products.show', $product)
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product.
     *
     * @param  string  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $product = Product::with(['category', 'images', 'variants', 'attributes'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return Inertia::render('Product/Detail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
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
        $this->authorize('update', $product);

        $categories = Category::all();

        return Inertia::render('Product/Edit', [
            'product' => $product->load(['images', 'variants', 'attributes']),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified product in storage.
     *
     * @param  \App\Http\Requests\ProductUpdateRequest  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ProductUpdateRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $product->update($request->validated());

        return redirect()->route('products.show', $product)
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
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}