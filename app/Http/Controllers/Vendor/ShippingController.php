<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\ShippingMethod;
use App\Models\VendorShippingMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ShippingController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:vendor']);
    }

    /**
     * Display vendor shipping settings.
     */
    public function index()
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('vendor.dashboard')
                ->with('error', 'Vendor profile not found.');
        }

        // Get all active shipping methods
        $shippingMethods = ShippingMethod::active()
            ->with(['vendorShippingMethods' => function ($query) use ($vendor) {
                $query->where('vendor_id', $vendor->id);
            }])
            ->get()
            ->map(function ($method) use ($vendor) {
                $vendorConfig = $method->vendorShippingMethods->first();

                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'description' => $method->description,
                    'carrier' => $method->carrier,
                    'type' => $method->type,
                    'estimated_days_min' => $method->estimated_days_min,
                    'estimated_days_max' => $method->estimated_days_max,
                    'is_enabled' => $vendorConfig ? $vendorConfig->is_enabled : false,
                    'custom_rate_cents' => $vendorConfig ? $vendorConfig->custom_rate_cents : null,
                    'handling_time_days' => $vendorConfig ? $vendorConfig->handling_time_days : 2,
                    'vendor_config_id' => $vendorConfig ? $vendorConfig->id : null,
                ];
            });

        return Inertia::render('Vendor/Settings/Shipping', [
            'shippingMethods' => $shippingMethods,
            'vendor' => $vendor,
        ]);
    }

    /**
     * Update vendor shipping method configuration.
     */
    public function update(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->back()->with('error', 'Vendor profile not found.');
        }

        $request->validate([
            'methods' => 'required|array',
            'methods.*.shipping_method_id' => 'required|exists:shipping_methods,id',
            'methods.*.is_enabled' => 'required|boolean',
            'methods.*.custom_rate_cents' => 'nullable|integer|min:0',
            'methods.*.handling_time_days' => 'required|integer|min:1|max:30',
        ]);

        DB::transaction(function () use ($vendor, $request) {
            foreach ($request->methods as $methodData) {
                VendorShippingMethod::updateOrCreate(
                    [
                        'vendor_id' => $vendor->id,
                        'shipping_method_id' => $methodData['shipping_method_id'],
                    ],
                    [
                        'is_enabled' => $methodData['is_enabled'],
                        'custom_rate_cents' => $methodData['custom_rate_cents'],
                        'handling_time_days' => $methodData['handling_time_days'],
                    ]
                );
            }

            activity()
                ->performedOn($vendor)
                ->causedBy(Auth::user())
                ->log('vendor_shipping_settings_updated');
        });

        return redirect()->back()->with('success', 'Shipping settings updated successfully.');
    }

    /**
     * Toggle a single shipping method.
     */
    public function toggleMethod(Request $request, ShippingMethod $method)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->back()->with('error', 'Vendor profile not found.');
        }

        $request->validate([
            'is_enabled' => 'required|boolean',
        ]);

        $vendorMethod = VendorShippingMethod::updateOrCreate(
            [
                'vendor_id' => $vendor->id,
                'shipping_method_id' => $method->id,
            ],
            [
                'is_enabled' => $request->is_enabled,
            ]
        );

        activity()
            ->performedOn($vendorMethod)
            ->causedBy(Auth::user())
            ->withProperties(['method' => $method->name, 'enabled' => $request->is_enabled])
            ->log('vendor_shipping_method_toggled');

        return redirect()->back()->with('success', 'Shipping method updated successfully.');
    }

    /**
     * Update custom rate for a shipping method.
     */
    public function updateRate(Request $request, ShippingMethod $method)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->back()->with('error', 'Vendor profile not found.');
        }

        $request->validate([
            'custom_rate_cents' => 'nullable|integer|min:0',
        ]);

        $vendorMethod = VendorShippingMethod::where('vendor_id', $vendor->id)
            ->where('shipping_method_id', $method->id)
            ->first();

        if (!$vendorMethod) {
            return redirect()->back()->with('error', 'Shipping method not found for this vendor.');
        }

        $vendorMethod->update([
            'custom_rate_cents' => $request->custom_rate_cents,
        ]);

        activity()
            ->performedOn($vendorMethod)
            ->causedBy(Auth::user())
            ->withProperties(['method' => $method->name, 'rate_cents' => $request->custom_rate_cents])
            ->log('vendor_shipping_rate_updated');

        return redirect()->back()->with('success', 'Custom shipping rate updated successfully.');
    }

    /**
     * Update handling time for a shipping method.
     */
    public function updateHandlingTime(Request $request, ShippingMethod $method)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->back()->with('error', 'Vendor profile not found.');
        }

        $request->validate([
            'handling_time_days' => 'required|integer|min:1|max:30',
        ]);

        $vendorMethod = VendorShippingMethod::where('vendor_id', $vendor->id)
            ->where('shipping_method_id', $method->id)
            ->first();

        if (!$vendorMethod) {
            return redirect()->back()->with('error', 'Shipping method not found for this vendor.');
        }

        $vendorMethod->update([
            'handling_time_days' => $request->handling_time_days,
        ]);

        activity()
            ->performedOn($vendorMethod)
            ->causedBy(Auth::user())
            ->withProperties(['method' => $method->name, 'handling_time_days' => $request->handling_time_days])
            ->log('vendor_handling_time_updated');

        return redirect()->back()->with('success', 'Handling time updated successfully.');
    }
}
