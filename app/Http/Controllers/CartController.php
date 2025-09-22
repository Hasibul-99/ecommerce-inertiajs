<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
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
            'cart' => $cart->load('items.product', 'items.productVariant'),
        ]);
    }

    /**
     * Add an item to the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart();
        $product = Product::findOrFail($request->product_id);
        $variant = ProductVariant::findOrFail($request->variant_id);
        
        // Check if there's enough stock
        if ($variant->stock_quantity < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Not enough stock available.'
            ], 422);
        }

        // Check if the item already exists in the cart
        $cartItem = $cart->items()
            ->where('product_id', $product->id)
            ->where('product_variant_id', $variant->id)
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
                'product_variant_id' => $variant->id,
                'quantity' => $request->quantity,
                'price_cents' => $variant->price_cents,
            ]);
        }

        // Calculate cart totals
        $this->updateCartTotals($cart);

        // Return cart token for guest users
        $cartToken = null;
        if (!Auth::check()) {
            $cartToken = $cart->session_id;
        }

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart.',
            'cart_token' => $cartToken,
            'cart' => $cart->load('items.product', 'items.productVariant')
        ]);
    }

    /**
     * Update cart item quantity.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $itemId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateItem(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart();
        $cartItem = $cart->items()->findOrFail($itemId);
        
        // Check if there's enough stock
        $variant = ProductVariant::findOrFail($cartItem->product_variant_id);
        if ($variant->stock_quantity < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Not enough stock available.'
            ], 422);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        // Calculate cart totals
        $this->updateCartTotals($cart);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated.',
            'cart' => $cart->load('items.product', 'items.productVariant')
        ]);
    }

    /**
     * Remove an item from the cart.
     *
     * @param  int  $itemId
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeItem($itemId)
    {
        $cart = $this->getCart();
        $cartItem = $cart->items()->findOrFail($itemId);

        $cartItem->delete();
        
        // Calculate cart totals
        $this->updateCartTotals($cart);

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart.',
            'cart' => $cart->load('items.product', 'items.productVariant')
        ]);
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
     * Calculate and update cart totals.
     *
     * @param  \App\Models\Cart  $cart
     * @return void
     */
    protected function updateCartTotals(Cart $cart)
    {
        $items = $cart->items()->with('productVariant')->get();
        
        $subtotalCents = 0;
        foreach ($items as $item) {
            $subtotalCents += $item->price_cents * $item->quantity;
        }
        
        // Simple tax calculation (can be made more complex as needed)
        $taxCents = (int)($subtotalCents * 0.1); // 10% tax
        $totalCents = $subtotalCents + $taxCents;
        
        $cart->update([
            'subtotal_cents' => $subtotalCents,
            'tax_cents' => $taxCents,
            'total_cents' => $totalCents,
        ]);
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
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        } else {
            // For guests, check if cart token is provided
            $cartToken = request()->header('X-Cart-Token');
            
            if ($cartToken) {
                $cart = Cart::where('session_id', $cartToken)->first();
            }
            
            // If no cart found or no token provided, create a new one
            if (empty($cart)) {
                $sessionId = Str::uuid()->toString();
                $cart = Cart::create([
                    'session_id' => $sessionId,
                    'expires_at' => now()->addDays(7), // Cart expires in 7 days
                ]);
            }
        }
        
        return $cart;
    }
}