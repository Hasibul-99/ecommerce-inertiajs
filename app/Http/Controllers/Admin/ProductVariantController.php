<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductVariantController extends Controller
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
     * Display a listing of the product variants.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $variants = ProductVariant::with(['product'])
            ->when($request->search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%");
                    });
            })
            ->when($request->product_id, function ($query, $productId) {
                return $query->where('product_id', $productId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $products = Product::select('id', 'title')->get();

        return Inertia::render('Admin/ProductVariants/Index', [
            'variants' => $variants,
            'products' => $products,
            'filters' => $request->only(['search', 'product_id']),
        ]);
    }

    /**
     * Show the form for creating a new product variant.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $products = Product::select('id', 'title')->get();

        return Inertia::render('Admin/ProductVariants/Create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created product variant in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'title' => 'required|string|max:255',
            'price_cents' => 'required|integer|min:0',
            'compare_at_price_cents' => 'nullable|integer|min:0',
            'cost_cents' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|max:100|unique:product_variants,sku',
            'inventory_quantity' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
        ]);

        ProductVariant::create($validated);

        return redirect()->route('admin.product-variants.index')
            ->with('success', 'Product variant created successfully.');
    }

    /**
     * Display the specified product variant.
     *
     * @param  \App\Models\ProductVariant  $productVariant
     * @return \Inertia\Response
     */
    public function show(ProductVariant $productVariant)
    {
        $productVariant->load(['product']);

        return Inertia::render('Admin/ProductVariants/Show', [
            'variant' => $productVariant,
        ]);
    }

    /**
     * Show the form for editing the specified product variant.
     *
     * @param  \App\Models\ProductVariant  $productVariant
     * @return \Inertia\Response
     */
    public function edit(ProductVariant $productVariant)
    {
        $productVariant->load(['product']);
        $products = Product::select('id', 'title')->get();

        return Inertia::render('Admin/ProductVariants/Edit', [
            'variant' => $productVariant,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified product variant in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProductVariant  $productVariant
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, ProductVariant $productVariant)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'title' => 'required|string|max:255',
            'price_cents' => 'required|integer|min:0',
            'compare_at_price_cents' => 'nullable|integer|min:0',
            'cost_cents' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|max:100|unique:product_variants,sku,' . $productVariant->id,
            'inventory_quantity' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
        ]);

        $productVariant->update($validated);

        return redirect()->route('admin.product-variants.index')
            ->with('success', 'Product variant updated successfully.');
    }

    /**
     * Remove the specified product variant from storage.
     *
     * @param  \App\Models\ProductVariant  $productVariant
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(ProductVariant $productVariant)
    {
        $productVariant->delete();

        return redirect()->route('admin.product-variants.index')
            ->with('success', 'Product variant deleted successfully.');
    }
}