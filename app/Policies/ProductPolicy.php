<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'vendor']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Product $product): bool
    {
        // Admin can view all products
        if ($user->hasRole('admin')) {
            return true;
        }

        // Vendor can only view their own products
        if ($user->hasRole('vendor')) {
            return $user->vendor && $product->vendor_id === $user->vendor->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Admin can always create products
        if ($user->hasRole('admin')) {
            return true;
        }

        // Vendor must be approved to create products
        if ($user->hasRole('vendor')) {
            $vendor = $user->vendor;

            if (!$vendor || !$vendor->isApproved()) {
                return false;
            }

            // Check product limits (optional: implement tier-based limits)
            // Example: Free vendors limited to 10 products, Premium unlimited
            $productLimit = $this->getProductLimitForVendor($vendor);
            $currentProductCount = Product::where('vendor_id', $vendor->id)->count();

            return $productLimit === null || $currentProductCount < $productLimit;
        }

        return false;
    }

    /**
     * Get product limit for vendor based on tier.
     */
    protected function getProductLimitForVendor($vendor): ?int
    {
        // Default limits by tier - customize as needed
        $tier = $vendor->getSetting('tier', 'free');

        return match($tier) {
            'free' => 10,
            'basic' => 50,
            'premium' => 200,
            'enterprise' => null, // unlimited
            default => 10,
        };
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Product $product): bool
    {
        // Admin can update any product
        if ($user->hasRole('admin')) {
            return true;
        }

        // Vendor can only update their own products and must be approved
        if ($user->hasRole('vendor')) {
            $vendor = $user->vendor;

            return $vendor &&
                   $vendor->isApproved() &&
                   $product->vendor_id === $vendor->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Product $product): bool
    {
        // Admin can delete any product
        if ($user->hasRole('admin')) {
            return true;
        }

        // Vendor can only delete their own products
        if ($user->hasRole('vendor')) {
            return $user->vendor && $product->vendor_id === $user->vendor->id;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Product $product): bool
    {
        // Admin can restore any product
        if ($user->hasRole('admin')) {
            return true;
        }

        // Vendor can only restore their own products
        if ($user->hasRole('vendor')) {
            return $user->vendor && $product->vendor_id === $user->vendor->id;
        }

        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Product $product): bool
    {
        // Only admin can permanently delete products
        return $user->hasRole('admin');
    }
}