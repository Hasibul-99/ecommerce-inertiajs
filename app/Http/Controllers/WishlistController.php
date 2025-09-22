<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display the user's wishlist.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)
            ->with('products.images')
            ->first();

        return Inertia::render('Wishlist', [
            'wishlist' => $wishlist ?? new Wishlist(['products' => []]),
        ]);
    }

    /**
     * Add a product to the wishlist.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();
        $wishlist = Wishlist::firstOrCreate(['user_id' => $user->id]);

        // Check if product is already in wishlist
        if (!$wishlist->products()->where('product_id', $request->product_id)->exists()) {
            $wishlist->products()->attach($request->product_id);
            $message = 'Product added to wishlist.';
        } else {
            $message = 'Product is already in your wishlist.';
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Remove a product from the wishlist.
     *
     * @param  int  $productId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeItem($productId)
    {
        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)->first();

        if ($wishlist) {
            $wishlist->products()->detach($productId);
        }

        return redirect()->back()->with('success', 'Product removed from wishlist.');
    }

    /**
     * Clear the wishlist.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clear()
    {
        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)->first();

        if ($wishlist) {
            $wishlist->products()->detach();
        }

        return redirect()->back()->with('success', 'Wishlist cleared.');
    }

    /**
     * Move a product from wishlist to cart.
     *
     * @param  int  $productId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function moveToCart($productId)
    {
        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)->first();

        if (!$wishlist) {
            return redirect()->back()->with('error', 'Wishlist not found.');
        }

        $product = Product::find($productId);
        if (!$product) {
            return redirect()->back()->with('error', 'Product not found.');
        }

        // Remove from wishlist
        $wishlist->products()->detach($productId);

        // Add to cart
        app(CartController::class)->addItem(new Request([
            'product_id' => $productId,
            'quantity' => 1,
        ]));

        return redirect()->back()->with('success', 'Product moved to cart.');
    }
}