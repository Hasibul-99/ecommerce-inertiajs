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
        // Only admin and vendor can create products
        return $user->hasRole(['admin', 'vendor']) && ($user->hasRole('admin') || $user->vendor);
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

        // Vendor can only update their own products
        if ($user->hasRole('vendor')) {
            return $user->vendor && $product->vendor_id === $user->vendor->id;
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