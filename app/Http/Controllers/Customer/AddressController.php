<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Display a listing of addresses.
     */
    public function index()
    {
        $addresses = Auth::user()->addresses()
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'addresses' => $addresses,
        ]);
    }

    /**
     * Store a newly created address.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'type' => 'required|in:billing,shipping,both',
            'is_default' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            // If this is set as default, unset other defaults
            if ($request->is_default) {
                Address::where('user_id', Auth::id())
                    ->update(['is_default' => false]);
            }

            $address = Auth::user()->addresses()->create($validated);

            activity()
                ->performedOn($address)
                ->causedBy(Auth::user())
                ->log('Address created');

            DB::commit();

            return redirect()->back()->with('success', 'Address added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to add address: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified address.
     */
    public function update(Request $request, Address $address)
    {
        // Verify ownership
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to address.');
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'type' => 'required|in:billing,shipping,both',
            'is_default' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            // If this is set as default, unset other defaults
            if ($request->is_default && !$address->is_default) {
                Address::where('user_id', Auth::id())
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }

            $address->update($validated);

            activity()
                ->performedOn($address)
                ->causedBy(Auth::user())
                ->log('Address updated');

            DB::commit();

            return redirect()->back()->with('success', 'Address updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update address: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified address.
     */
    public function destroy(Address $address)
    {
        // Verify ownership
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to address.');
        }

        // Don't allow deleting the only address
        $addressCount = Address::where('user_id', Auth::id())->count();
        if ($addressCount <= 1) {
            return redirect()->back()->with('error', 'Cannot delete your only address.');
        }

        try {
            DB::beginTransaction();

            $wasDefault = $address->is_default;
            $address->delete();

            // If this was default, set another as default
            if ($wasDefault) {
                Address::where('user_id', Auth::id())
                    ->first()
                    ?->update(['is_default' => true]);
            }

            activity()
                ->causedBy(Auth::user())
                ->withProperties(['address_id' => $address->id])
                ->log('Address deleted');

            DB::commit();

            return redirect()->back()->with('success', 'Address deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to delete address: ' . $e->getMessage());
        }
    }

    /**
     * Set an address as default.
     */
    public function setDefault(Address $address)
    {
        // Verify ownership
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to address.');
        }

        try {
            DB::beginTransaction();

            // Unset all other defaults
            Address::where('user_id', Auth::id())
                ->update(['is_default' => false]);

            // Set this as default
            $address->update(['is_default' => true]);

            activity()
                ->performedOn($address)
                ->causedBy(Auth::user())
                ->log('Address set as default');

            DB::commit();

            return redirect()->back()->with('success', 'Default address updated.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update default address: ' . $e->getMessage());
        }
    }
}
