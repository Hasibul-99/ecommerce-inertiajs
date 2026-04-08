<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\ShippingMethod;
use App\Services\ShippingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShippingController extends Controller
{
    protected $shippingService;

    public function __construct(ShippingService $shippingService)
    {
        $this->shippingService = $shippingService;
        $this->middleware('auth');
    }

    /**
     * Get available shipping methods for cart.
     * Used during checkout to display shipping options per vendor.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMethodsForCart(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
        ]);

        $user = Auth::user();

        // Get user's cart
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->items()->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty',
            ], 400);
        }

        // Get shipping address
        $address = Address::where('id', $request->address_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found',
            ], 404);
        }

        // Calculate multi-vendor shipping
        $shippingData = $this->shippingService->calculateMultiVendorShipping($cart, $address);

        return response()->json([
            'success' => true,
            'data' => $shippingData,
        ]);
    }

    /**
     * Calculate shipping rate for specific method.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function calculateRate(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'shipping_method_id' => 'required|exists:shipping_methods,id',
        ]);

        $user = Auth::user();

        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->items()->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty',
            ], 400);
        }

        $address = Address::where('id', $request->address_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found',
            ], 404);
        }

        $shippingMethod = ShippingMethod::find($request->shipping_method_id);

        if (!$shippingMethod) {
            return response()->json([
                'success' => false,
                'message' => 'Shipping method not found',
            ], 404);
        }

        $rateCents = $this->shippingService->calculateShippingRate($cart, $address, $shippingMethod);

        return response()->json([
            'success' => true,
            'data' => [
                'rate_cents' => $rateCents,
                'rate_formatted' => '$' . number_format($rateCents / 100, 2),
                'shipping_method' => [
                    'id' => $shippingMethod->id,
                    'name' => $shippingMethod->name,
                    'type' => $shippingMethod->type,
                    'estimated_delivery' => $shippingMethod->estimated_delivery,
                ],
            ],
        ]);
    }

    /**
     * Validate shipping selections before checkout.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateSelection(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'shipping_selections' => 'required|array',
            'shipping_selections.*' => 'required|exists:shipping_methods,id',
        ]);

        $user = Auth::user();

        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->items()->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty',
            ], 400);
        }

        $address = Address::where('id', $request->address_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found',
            ], 404);
        }

        $validation = $this->shippingService->validateShippingSelection(
            $cart,
            $address,
            $request->shipping_selections
        );

        if (!$validation['valid']) {
            return response()->json([
                'success' => false,
                'errors' => $validation['errors'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_shipping_cents' => $validation['total_shipping_cents'],
                'total_shipping_formatted' => '$' . number_format($validation['total_shipping_cents'] / 100, 2),
            ],
        ]);
    }
}
