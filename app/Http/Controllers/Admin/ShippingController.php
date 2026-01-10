<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingZone;
use App\Models\ShippingMethod;
use App\Models\ShippingRate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ShippingController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    // ============ ZONES ============

    /**
     * Display shipping zones.
     */
    public function zones(Request $request)
    {
        $query = ShippingZone::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $zones = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('Admin/Shipping/Zones', [
            'zones' => $zones,
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    /**
     * Store a new shipping zone.
     */
    public function storeZone(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'countries' => 'nullable|array',
            'states' => 'nullable|array',
            'status' => 'required|in:active,inactive',
        ]);

        $zone = ShippingZone::create($request->all());

        activity()
            ->performedOn($zone)
            ->causedBy(Auth::user())
            ->log('shipping_zone_created');

        return redirect()->back()->with('success', 'Shipping zone created successfully.');
    }

    /**
     * Update a shipping zone.
     */
    public function updateZone(Request $request, ShippingZone $zone)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'countries' => 'nullable|array',
            'states' => 'nullable|array',
            'status' => 'required|in:active,inactive',
        ]);

        $zone->update($request->all());

        activity()
            ->performedOn($zone)
            ->causedBy(Auth::user())
            ->log('shipping_zone_updated');

        return redirect()->back()->with('success', 'Shipping zone updated successfully.');
    }

    /**
     * Delete a shipping zone.
     */
    public function destroyZone(ShippingZone $zone)
    {
        activity()
            ->performedOn($zone)
            ->causedBy(Auth::user())
            ->withProperties($zone->toArray())
            ->log('shipping_zone_deleted');

        $zone->delete();

        return redirect()->back()->with('success', 'Shipping zone deleted successfully.');
    }

    // ============ METHODS ============

    /**
     * Display shipping methods.
     */
    public function methods(Request $request)
    {
        $query = ShippingMethod::withCount('shippingRates');

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $methods = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return Inertia::render('Admin/Shipping/Methods', [
            'methods' => $methods,
            'filters' => $request->only(['search', 'type', 'status', 'per_page']),
        ]);
    }

    /**
     * Store a new shipping method.
     */
    public function storeMethod(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'carrier' => 'nullable|string|max:255',
            'type' => 'required|in:standard,express,overnight,pickup,free',
            'estimated_days_min' => 'required|integer|min:1',
            'estimated_days_max' => 'required|integer|min:1',
            'status' => 'required|in:active,inactive',
        ]);

        $method = ShippingMethod::create($request->all());

        activity()
            ->performedOn($method)
            ->causedBy(Auth::user())
            ->log('shipping_method_created');

        return redirect()->back()->with('success', 'Shipping method created successfully.');
    }

    /**
     * Update a shipping method.
     */
    public function updateMethod(Request $request, ShippingMethod $method)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'carrier' => 'nullable|string|max:255',
            'type' => 'required|in:standard,express,overnight,pickup,free',
            'estimated_days_min' => 'required|integer|min:1',
            'estimated_days_max' => 'required|integer|min:1',
            'status' => 'required|in:active,inactive',
        ]);

        $method->update($request->all());

        activity()
            ->performedOn($method)
            ->causedBy(Auth::user())
            ->log('shipping_method_updated');

        return redirect()->back()->with('success', 'Shipping method updated successfully.');
    }

    /**
     * Delete a shipping method.
     */
    public function destroyMethod(ShippingMethod $method)
    {
        activity()
            ->performedOn($method)
            ->causedBy(Auth::user())
            ->withProperties($method->toArray())
            ->log('shipping_method_deleted');

        $method->delete();

        return redirect()->back()->with('success', 'Shipping method deleted successfully.');
    }

    // ============ RATES ============

    /**
     * Display shipping rates.
     */
    public function rates(Request $request)
    {
        $query = ShippingRate::with(['shippingZone', 'shippingMethod']);

        if ($request->has('zone_id')) {
            $query->where('shipping_zone_id', $request->zone_id);
        }

        if ($request->has('method_id')) {
            $query->where('shipping_method_id', $request->method_id);
        }

        $rates = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        $zones = ShippingZone::active()->get();
        $methods = ShippingMethod::active()->get();

        return Inertia::render('Admin/Shipping/Rates', [
            'rates' => $rates,
            'zones' => $zones,
            'methods' => $methods,
            'filters' => $request->only(['zone_id', 'method_id', 'per_page']),
        ]);
    }

    /**
     * Store a new shipping rate.
     */
    public function storeRate(Request $request)
    {
        $request->validate([
            'shipping_zone_id' => 'required|exists:shipping_zones,id',
            'shipping_method_id' => 'required|exists:shipping_methods,id',
            'min_weight' => 'required|integer|min:0',
            'max_weight' => 'nullable|integer|min:0',
            'min_order_cents' => 'required|integer|min:0',
            'max_order_cents' => 'nullable|integer|min:0',
            'rate_cents' => 'required|integer|min:0',
            'free_shipping_threshold_cents' => 'nullable|integer|min:0',
        ]);

        $rate = ShippingRate::create($request->all());

        activity()
            ->performedOn($rate)
            ->causedBy(Auth::user())
            ->log('shipping_rate_created');

        return redirect()->back()->with('success', 'Shipping rate created successfully.');
    }

    /**
     * Update a shipping rate.
     */
    public function updateRate(Request $request, ShippingRate $rate)
    {
        $request->validate([
            'shipping_zone_id' => 'required|exists:shipping_zones,id',
            'shipping_method_id' => 'required|exists:shipping_methods,id',
            'min_weight' => 'required|integer|min:0',
            'max_weight' => 'nullable|integer|min:0',
            'min_order_cents' => 'required|integer|min:0',
            'max_order_cents' => 'nullable|integer|min:0',
            'rate_cents' => 'required|integer|min:0',
            'free_shipping_threshold_cents' => 'nullable|integer|min:0',
        ]);

        $rate->update($request->all());

        activity()
            ->performedOn($rate)
            ->causedBy(Auth::user())
            ->log('shipping_rate_updated');

        return redirect()->back()->with('success', 'Shipping rate updated successfully.');
    }

    /**
     * Delete a shipping rate.
     */
    public function destroyRate(ShippingRate $rate)
    {
        activity()
            ->performedOn($rate)
            ->causedBy(Auth::user())
            ->withProperties($rate->toArray())
            ->log('shipping_rate_deleted');

        $rate->delete();

        return redirect()->back()->with('success', 'Shipping rate deleted successfully.');
    }

    /**
     * Import shipping rates from CSV.
     */
    public function importRates(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
            'shipping_zone_id' => 'required|exists:shipping_zones,id',
            'shipping_method_id' => 'required|exists:shipping_methods,id',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        // Skip header row
        fgetcsv($handle);

        $imported = 0;
        $errors = [];

        DB::beginTransaction();

        try {
            while (($data = fgetcsv($handle)) !== false) {
                // Expected CSV format: min_weight, max_weight, min_order_cents, max_order_cents, rate_cents, free_shipping_threshold_cents
                if (count($data) < 5) {
                    $errors[] = "Skipped row with insufficient data: " . implode(',', $data);
                    continue;
                }

                ShippingRate::create([
                    'shipping_zone_id' => $request->shipping_zone_id,
                    'shipping_method_id' => $request->shipping_method_id,
                    'min_weight' => (int)$data[0],
                    'max_weight' => !empty($data[1]) ? (int)$data[1] : null,
                    'min_order_cents' => (int)$data[2],
                    'max_order_cents' => !empty($data[3]) ? (int)$data[3] : null,
                    'rate_cents' => (int)$data[4],
                    'free_shipping_threshold_cents' => !empty($data[5]) ? (int)$data[5] : null,
                ]);

                $imported++;
            }

            fclose($handle);

            DB::commit();

            activity()
                ->causedBy(Auth::user())
                ->withProperties(['imported' => $imported, 'zone_id' => $request->shipping_zone_id, 'method_id' => $request->shipping_method_id])
                ->log('shipping_rates_imported');

            $message = "Successfully imported {$imported} shipping rates.";
            if (!empty($errors)) {
                $message .= " " . count($errors) . " rows had errors.";
            }

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            DB::rollBack();
            fclose($handle);

            return redirect()->back()->with('error', 'Error importing rates: ' . $e->getMessage());
        }
    }
}
