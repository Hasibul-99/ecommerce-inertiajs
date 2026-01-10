<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Cart;
use App\Models\ShippingMethod;
use App\Models\ShippingRate;
use App\Models\ShippingZone;
use App\Models\Vendor;
use App\Models\VendorShippingMethod;
use App\Events\ShippingRateCalculated;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class ShippingService
{
    /**
     * Get available shipping methods for an address.
     *
     * @param Address $address
     * @return Collection
     */
    public function getAvailableMethodsForAddress(Address $address): Collection
    {
        $zone = $this->getShippingZoneForAddress($address);

        if (!$zone) {
            return collect([]);
        }

        // Get all active shipping methods that have rates for this zone
        $methods = ShippingMethod::active()
            ->whereHas('shippingRates', function ($query) use ($zone) {
                $query->where('shipping_zone_id', $zone->id);
            })
            ->with(['shippingRates' => function ($query) use ($zone) {
                $query->where('shipping_zone_id', $zone->id);
            }])
            ->get();

        return $methods;
    }

    /**
     * Calculate shipping rate for a cart with specific method.
     *
     * @param Cart $cart
     * @param Address $address
     * @param ShippingMethod $method
     * @return int Shipping cost in cents
     */
    public function calculateShippingRate(Cart $cart, Address $address, ShippingMethod $method): int
    {
        $zone = $this->getShippingZoneForAddress($address);

        if (!$zone) {
            return 0;
        }

        // Group cart items by vendor
        $cartItems = $cart->items()->with('product.vendor')->get();
        $vendorGroups = $cartItems->groupBy('product.vendor_id');

        $totalShippingCents = 0;

        foreach ($vendorGroups as $vendorId => $items) {
            $vendor = $items->first()->product->vendor;

            // Calculate weight and subtotal for this vendor's items
            $totalWeight = $items->sum(function ($item) {
                return ($item->product->weight ?? 0) * $item->quantity;
            });

            $subtotalCents = $items->sum(function ($item) {
                return $item->price_cents * $item->quantity;
            });

            // Check if vendor has custom shipping configuration
            $vendorShipping = VendorShippingMethod::where('vendor_id', $vendorId)
                ->where('shipping_method_id', $method->id)
                ->where('is_enabled', true)
                ->first();

            if (!$vendorShipping) {
                // Vendor hasn't enabled this method
                continue;
            }

            // Check for free shipping eligibility
            if ($this->isFreeShippingEligible($items, $method, $zone)) {
                continue; // Free shipping for this vendor
            }

            // Use custom vendor rate if set, otherwise use standard rate
            if ($vendorShipping->custom_rate_cents) {
                $totalShippingCents += $vendorShipping->custom_rate_cents;
            } else {
                // Find applicable shipping rate
                $rate = $this->findApplicableRate($zone, $method, $totalWeight, $subtotalCents);

                if ($rate) {
                    $totalShippingCents += $rate->rate_cents;
                }
            }
        }

        // Dispatch event for logging/analytics
        event(new ShippingRateCalculated($cart, $address, $method, $totalShippingCents));

        return $totalShippingCents;
    }

    /**
     * Get estimated delivery date for a shipping method and vendor.
     *
     * @param ShippingMethod $method
     * @param Vendor $vendor
     * @return array
     */
    public function getEstimatedDeliveryDate(ShippingMethod $method, Vendor $vendor): array
    {
        // Get vendor handling time
        $vendorShipping = VendorShippingMethod::where('vendor_id', $vendor->id)
            ->where('shipping_method_id', $method->id)
            ->first();

        $handlingDays = $vendorShipping->handling_time_days ?? 2;

        // Calculate estimated dates
        $minDays = $handlingDays + $method->estimated_days_min;
        $maxDays = $handlingDays + $method->estimated_days_max;

        $minDate = now()->addDays($minDays);
        $maxDate = now()->addDays($maxDays);

        return [
            'min_date' => $minDate,
            'max_date' => $maxDate,
            'min_days' => $minDays,
            'max_days' => $maxDays,
            'formatted' => $minDate->format('M d') . ' - ' . $maxDate->format('M d, Y'),
        ];
    }

    /**
     * Check if cart is eligible for free shipping.
     *
     * @param Collection $cartItems
     * @param ShippingMethod $method
     * @param ShippingZone $zone
     * @return bool
     */
    public function isFreeShippingEligible($cartItems, ShippingMethod $method, ShippingZone $zone): bool
    {
        // Get the shipping rate for this method/zone
        $rate = ShippingRate::where('shipping_zone_id', $zone->id)
            ->where('shipping_method_id', $method->id)
            ->first();

        if (!$rate || !$rate->free_shipping_threshold_cents) {
            return false;
        }

        // Calculate subtotal
        if ($cartItems instanceof Collection) {
            $subtotalCents = $cartItems->sum(function ($item) {
                return $item->price_cents * $item->quantity;
            });
        } else {
            $subtotalCents = $cartItems->items->sum(function ($item) {
                return $item->price_cents * $item->quantity;
            });
        }

        return $subtotalCents >= $rate->free_shipping_threshold_cents;
    }

    /**
     * Get shipping zone for an address.
     *
     * @param Address $address
     * @return ShippingZone|null
     */
    public function getShippingZoneForAddress(Address $address): ?ShippingZone
    {
        // Cache zone lookup for 1 hour
        $cacheKey = "shipping_zone_{$address->country}_{$address->state}";

        return Cache::remember($cacheKey, 3600, function () use ($address) {
            // First, try to find a zone with specific state matching
            $zones = ShippingZone::active()->get();

            foreach ($zones as $zone) {
                // Check if zone has state-specific configuration
                if ($zone->hasState($address->country, $address->state)) {
                    return $zone;
                }
            }

            // If no state match, check for country-level zone
            foreach ($zones as $zone) {
                if ($zone->hasCountry($address->country)) {
                    return $zone;
                }
            }

            return null;
        });
    }

    /**
     * Find applicable shipping rate based on weight and order total.
     *
     * @param ShippingZone $zone
     * @param ShippingMethod $method
     * @param int $weight
     * @param int $orderTotalCents
     * @return ShippingRate|null
     */
    protected function findApplicableRate(
        ShippingZone $zone,
        ShippingMethod $method,
        int $weight,
        int $orderTotalCents
    ): ?ShippingRate {
        return ShippingRate::where('shipping_zone_id', $zone->id)
            ->where('shipping_method_id', $method->id)
            ->where('min_weight', '<=', $weight)
            ->where(function ($query) use ($weight) {
                $query->whereNull('max_weight')
                    ->orWhere('max_weight', '>=', $weight);
            })
            ->where('min_order_cents', '<=', $orderTotalCents)
            ->where(function ($query) use ($orderTotalCents) {
                $query->whereNull('max_order_cents')
                    ->orWhere('max_order_cents', '>=', $orderTotalCents);
            })
            ->orderBy('rate_cents', 'asc')
            ->first();
    }

    /**
     * Calculate shipping for multi-vendor cart (per vendor).
     *
     * @param Cart $cart
     * @param Address $address
     * @return array
     */
    public function calculateMultiVendorShipping(Cart $cart, Address $address): array
    {
        $zone = $this->getShippingZoneForAddress($address);

        if (!$zone) {
            return [
                'total_shipping_cents' => 0,
                'vendors' => [],
                'available_methods' => [],
            ];
        }

        $cartItems = $cart->items()->with('product.vendor')->get();
        $vendorGroups = $cartItems->groupBy('product.vendor_id');

        $vendorShipping = [];
        $availableMethods = $this->getAvailableMethodsForAddress($address);

        foreach ($vendorGroups as $vendorId => $items) {
            $vendor = $items->first()->product->vendor;

            $vendorMethods = [];

            foreach ($availableMethods as $method) {
                // Check if vendor supports this method
                $vendorShipping = VendorShippingMethod::where('vendor_id', $vendorId)
                    ->where('shipping_method_id', $method->id)
                    ->where('is_enabled', true)
                    ->first();

                if (!$vendorShipping) {
                    continue;
                }

                $totalWeight = $items->sum(function ($item) {
                    return ($item->product->weight ?? 0) * $item->quantity;
                });

                $subtotalCents = $items->sum(function ($item) {
                    return $item->price_cents * $item->quantity;
                });

                $isFree = $this->isFreeShippingEligible($items, $method, $zone);
                $rateCents = 0;

                if (!$isFree) {
                    if ($vendorShipping->custom_rate_cents) {
                        $rateCents = $vendorShipping->custom_rate_cents;
                    } else {
                        $rate = $this->findApplicableRate($zone, $method, $totalWeight, $subtotalCents);
                        $rateCents = $rate ? $rate->rate_cents : 0;
                    }
                }

                $delivery = $this->getEstimatedDeliveryDate($method, $vendor);

                $vendorMethods[] = [
                    'method_id' => $method->id,
                    'method_name' => $method->name,
                    'method_type' => $method->type,
                    'carrier' => $method->carrier,
                    'rate_cents' => $rateCents,
                    'is_free' => $isFree,
                    'estimated_delivery' => $delivery,
                ];
            }

            $vendorShipping[$vendorId] = [
                'vendor_id' => $vendorId,
                'vendor_name' => $vendor->business_name,
                'items_count' => $items->count(),
                'subtotal_cents' => $items->sum(fn($item) => $item->price_cents * $item->quantity),
                'available_methods' => $vendorMethods,
            ];
        }

        return [
            'zone' => $zone,
            'vendors' => $vendorShipping,
            'available_methods' => $availableMethods,
        ];
    }

    /**
     * Validate shipping selection for checkout.
     *
     * @param Cart $cart
     * @param Address $address
     * @param array $vendorMethodSelections Array of [vendor_id => shipping_method_id]
     * @return array
     */
    public function validateShippingSelection(Cart $cart, Address $address, array $vendorMethodSelections): array
    {
        $errors = [];
        $totalShippingCents = 0;

        $cartItems = $cart->items()->with('product.vendor')->get();
        $vendorGroups = $cartItems->groupBy('product.vendor_id');

        foreach ($vendorGroups as $vendorId => $items) {
            if (!isset($vendorMethodSelections[$vendorId])) {
                $errors[] = "No shipping method selected for vendor {$vendorId}";
                continue;
            }

            $methodId = $vendorMethodSelections[$vendorId];
            $method = ShippingMethod::find($methodId);

            if (!$method) {
                $errors[] = "Invalid shipping method for vendor {$vendorId}";
                continue;
            }

            // Verify vendor supports this method
            $vendorShipping = VendorShippingMethod::where('vendor_id', $vendorId)
                ->where('shipping_method_id', $methodId)
                ->where('is_enabled', true)
                ->first();

            if (!$vendorShipping) {
                $errors[] = "Shipping method not available for vendor {$vendorId}";
                continue;
            }

            // Calculate cost for this vendor
            $zone = $this->getShippingZoneForAddress($address);
            if (!$zone) {
                $errors[] = "Shipping not available to your address";
                continue;
            }

            $subtotalCents = $items->sum(fn($item) => $item->price_cents * $item->quantity);
            $totalWeight = $items->sum(fn($item) => ($item->product->weight ?? 0) * $item->quantity);

            if (!$this->isFreeShippingEligible($items, $method, $zone)) {
                if ($vendorShipping->custom_rate_cents) {
                    $totalShippingCents += $vendorShipping->custom_rate_cents;
                } else {
                    $rate = $this->findApplicableRate($zone, $method, $totalWeight, $subtotalCents);
                    $totalShippingCents += $rate ? $rate->rate_cents : 0;
                }
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'total_shipping_cents' => $totalShippingCents,
        ];
    }
}
