<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CouponController extends Controller
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
     * Display a listing of the coupons.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $coupons = Coupon::query()
            ->when($request->search, function ($query, $search) {
                return $query->where('coupon_code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                if ($status === 'active') {
                    return $query->where('is_active', true);
                } elseif ($status === 'inactive') {
                    return $query->where('is_active', false);
                } elseif ($status === 'expired') {
                    return $query->where('expires_at', '<', now());
                } elseif ($status === 'upcoming') {
                    return $query->where('starts_at', '>', now());
                }
            })
            ->when($request->discount_type, function ($query, $discountType) {
                return $query->where('discount_type', $discountType);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
            'filters' => $request->only(['search', 'status', 'discount_type']),
        ]);
    }

    /**
     * Show the form for creating a new coupon.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Coupons/Create');
    }

    /**
     * Store a newly created coupon in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required|string|max:255|unique:coupons',
            'description' => 'nullable|string|max:500',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => 'required|numeric|min:0',
            'minimum_spend_cents' => 'nullable|integer|min:0',
            'maximum_discount_cents' => 'nullable|integer|min:0',
            'starts_at' => 'required|date',
            'expires_at' => 'required|date|after:starts_at',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        // Additional validation for percentage discount
        if ($request->discount_type === 'percentage' && $request->discount_value > 100) {
            return back()->withErrors(['discount_value' => 'Percentage discount cannot exceed 100%']);
        }

        Coupon::create([
            'coupon_code' => strtoupper($request->coupon_code),
            'description' => $request->description,
            'discount_type' => $request->discount_type,
            'discount_value' => $request->discount_value,
            'minimum_spend_cents' => $request->minimum_spend_cents,
            'maximum_discount_cents' => $request->maximum_discount_cents,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'usage_limit' => $request->usage_limit,
            'usage_count' => 0,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon created successfully.');
    }

    /**
     * Display the specified coupon.
     *
     * @param  \App\Models\Coupon  $coupon
     * @return \Inertia\Response
     */
    public function show(Coupon $coupon)
    {
        $coupon->load(['orders', 'carts']);

        return Inertia::render('Admin/Coupons/Show', [
            'coupon' => $coupon,
            'usageStats' => [
                'total_orders' => $coupon->orders->count(),
                'total_carts' => $coupon->carts->count(),
                'usage_percentage' => $coupon->usage_limit ? 
                    round(($coupon->usage_count / $coupon->usage_limit) * 100, 2) : 0,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified coupon.
     *
     * @param  \App\Models\Coupon  $coupon
     * @return \Inertia\Response
     */
    public function edit(Coupon $coupon)
    {
        return Inertia::render('Admin/Coupons/Edit', [
            'coupon' => $coupon,
        ]);
    }

    /**
     * Update the specified coupon in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Coupon  $coupon
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Coupon $coupon)
    {
        $request->validate([
            'coupon_code' => ['required', 'string', 'max:255', Rule::unique('coupons')->ignore($coupon->id)],
            'description' => 'nullable|string|max:500',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => 'required|numeric|min:0',
            'minimum_spend_cents' => 'nullable|integer|min:0',
            'maximum_discount_cents' => 'nullable|integer|min:0',
            'starts_at' => 'required|date',
            'expires_at' => 'required|date|after:starts_at',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        // Additional validation for percentage discount
        if ($request->discount_type === 'percentage' && $request->discount_value > 100) {
            return back()->withErrors(['discount_value' => 'Percentage discount cannot exceed 100%']);
        }

        $coupon->update([
            'coupon_code' => strtoupper($request->coupon_code),
            'description' => $request->description,
            'discount_type' => $request->discount_type,
            'discount_value' => $request->discount_value,
            'minimum_spend_cents' => $request->minimum_spend_cents,
            'maximum_discount_cents' => $request->maximum_discount_cents,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'usage_limit' => $request->usage_limit,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon updated successfully.');
    }

    /**
     * Remove the specified coupon from storage.
     *
     * @param  \App\Models\Coupon  $coupon
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Coupon $coupon)
    {
        // Check if coupon is being used
        if ($coupon->usage_count > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete coupon that has been used.');
        }

        $coupon->delete();

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon deleted successfully.');
    }

    /**
     * Toggle coupon active status.
     *
     * @param  \App\Models\Coupon  $coupon
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleStatus(Coupon $coupon)
    {
        $coupon->update([
            'is_active' => !$coupon->is_active,
        ]);

        $status = $coupon->is_active ? 'activated' : 'deactivated';

        return redirect()->back()
            ->with('success', "Coupon {$status} successfully.");
    }

    /**
     * Bulk update coupon status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'coupon_ids' => 'required|array',
            'coupon_ids.*' => 'exists:coupons,id',
            'is_active' => 'required|boolean',
        ]);

        Coupon::whereIn('id', $request->coupon_ids)->update([
            'is_active' => $request->is_active,
        ]);

        $status = $request->is_active ? 'activated' : 'deactivated';

        return redirect()->back()
            ->with('success', "Coupons {$status} successfully.");
    }
}