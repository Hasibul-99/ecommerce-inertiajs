<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Auth\Access\HandlesAuthorization;

class VendorPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Vendor $vendor): bool
    {
        // Admin can view any vendor
        if ($user->hasRole('admin')) {
            return true;
        }

        // Vendor can only view their own vendor profile
        if ($user->hasRole('vendor')) {
            return $user->vendor && $vendor->id === $user->vendor->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admin can create vendors directly
        // Users can apply to become vendors through registration
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Vendor $vendor): bool
    {
        // Admin can update any vendor
        if ($user->hasRole('admin')) {
            return true;
        }

        // Vendor can only update their own profile, but not status
        if ($user->hasRole('vendor')) {
            return $user->vendor && $vendor->id === $user->vendor->id;
        }

        return false;
    }

    /**
     * Determine whether the user can approve or reject vendors.
     */
    public function approveReject(User $user, Vendor $vendor): bool
    {
        // Only admin can approve or reject vendors
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Vendor $vendor): bool
    {
        // Only admin can delete vendors
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Vendor $vendor): bool
    {
        // Only admin can restore vendors
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Vendor $vendor): bool
    {
        // Only admin can permanently delete vendors
        return $user->hasRole('admin');
    }
}