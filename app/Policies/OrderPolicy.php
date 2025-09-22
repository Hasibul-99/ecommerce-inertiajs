<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'vendor', 'customer']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Order $order): bool
    {
        // Admin can view all orders
        if ($user->hasRole('admin')) {
            return true;
        }

        // Customer can only view their own orders
        if ($user->hasRole('customer')) {
            return $order->user_id === $user->id;
        }

        // Vendor can view orders that include their products
        if ($user->hasRole('vendor') && $user->vendor) {
            // Check if any order items belong to this vendor's products
            return $order->items()->whereHas('product', function ($query) use ($user) {
                $query->where('vendor_id', $user->vendor->id);
            })->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admin can create orders manually
        // Customers create orders through the checkout process
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Order $order): bool
    {
        // Admin can update any order
        if ($user->hasRole('admin')) {
            return true;
        }

        // Vendor can update orders that include their products, but only certain fields
        if ($user->hasRole('vendor') && $user->vendor) {
            // Check if any order items belong to this vendor's products
            return $order->items()->whereHas('product', function ($query) use ($user) {
                $query->where('vendor_id', $user->vendor->id);
            })->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Order $order): bool
    {
        // Only admin can delete orders
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Order $order): bool
    {
        // Only admin can restore orders
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Order $order): bool
    {
        // Only admin can permanently delete orders
        return $user->hasRole('admin');
    }
}