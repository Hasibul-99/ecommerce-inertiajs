<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the cart.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $cart = $this->getCart();

        return Inertia::render('Cart', [
            'cart' => $cart->load('items.product', 'items.variant'),
        ]);
    }

    /**
     * Add an item to the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart();
        $product = Product::findOrFail($request->product_id);
        $variant = $request->variant_id ? ProductVariant::findOrFail($request->variant_id) : null;

        // Check if the item already exists in the cart
        $cartItem = $cart->items()
            ->where('product_id', $product->id)
            ->when($variant, function ($query) use ($variant) {
                return $query->where('product_variant_id', $variant->id);
            }, function ($query) {
                return $query->whereNull('product_variant_id');
            })
            ->first();

        if ($cartItem) {
            // Update quantity if item exists
            $cartItem->update([
                'quantity' => $cartItem->quantity + $request->quantity,
            ]);
        } else {
            // Create new cart item
            $cart->items()->create([
                'product_id' => $product->id,
                'product_variant_id' => $variant ? $variant->id : null,
                'quantity' => $request->quantity,
                'price_cents' => $variant ? $variant->price_cents : $product->base_price_cents,
            ]);
        }

        return redirect()->back()->with('success', 'Item added to cart.');
    }

    /**
     * Update cart item quantity.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $itemId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateItem(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart();
        $cartItem = $cart->items()->findOrFail($itemId);

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return redirect()->back()->with('success', 'Cart updated.');
    }

    /**
     * Remove an item from the cart.
     *
     * @param  int  $itemId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeItem($itemId)
    {
        $cart = $this->getCart();
        $cartItem = $cart->items()->findOrFail($itemId);

        $cartItem->delete();

        return redirect()->back()->with('success', 'Item removed from cart.');
    }

    /**
     * Clear the cart.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clear()
    {
        $cart = $this->getCart();
        $cart->items()->delete();

        return redirect()->back()->with('success', 'Cart cleared.');
    }

    /**
     * Get the current user's cart or create a new one.
     *
     * @return \App\Models\Cart
     */
    protected function getCart()
    {
        $user = Auth::user();

        if ($user) {
            // For authenticated users, get or create their cart
            return Cart::firstOrCreate(['user_id' => $user->id]);
        } else {
            // For guests, use session-based cart
            $sessionId = session()->getId();
            return Cart::firstOrCreate(['session_id' => $sessionId]);
        }
    }
}