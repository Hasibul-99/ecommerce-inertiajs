<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class VendorController extends Controller
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
     * Display a listing of the vendors.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $vendors = Vendor::with('user')
            ->when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Vendors/Index', [
            'vendors' => $vendors,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new vendor.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Vendors/Create');
    }

    /**
     * Store a newly created vendor in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'vendor_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign vendor role
        $vendorRole = Role::findByName('vendor');
        $user->assignRole($vendorRole);

        // Create vendor profile
        $vendor = Vendor::create([
            'user_id' => $user->id,
            'name' => $request->vendor_name,
            'description' => $request->description,
            'phone' => $request->phone,
            'address' => $request->address,
            'status' => $request->status,
        ]);

        return redirect()->route('admin.vendors.index')
            ->with('success', 'Vendor created successfully.');
    }

    /**
     * Display the specified vendor.
     *
     * @param  \App\Models\Vendor  $vendor
     * @return \Inertia\Response
     */
    public function show(Vendor $vendor)
    {
        $vendor->load('user', 'products');

        return Inertia::render('Admin/Vendors/Show', [
            'vendor' => $vendor,
            'productCount' => $vendor->products->count(),
            'productStats' => [
                'published' => $vendor->products->where('status', 'published')->count(),
                'draft' => $vendor->products->where('status', 'draft')->count(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified vendor.
     *
     * @param  \App\Models\Vendor  $vendor
     * @return \Inertia\Response
     */
    public function edit(Vendor $vendor)
    {
        $vendor->load('user');

        return Inertia::render('Admin/Vendors/Edit', [
            'vendor' => $vendor,
        ]);
    }

    /**
     * Update the specified vendor in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Vendor  $vendor
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Vendor $vendor)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $vendor->user_id,
            'vendor_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        // Update user
        $vendor->user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Update vendor profile
        $vendor->update([
            'name' => $request->vendor_name,
            'description' => $request->description,
            'phone' => $request->phone,
            'address' => $request->address,
            'status' => $request->status,
        ]);

        return redirect()->route('admin.vendors.index')
            ->with('success', 'Vendor updated successfully.');
    }

    /**
     * Remove the specified vendor from storage.
     *
     * @param  \App\Models\Vendor  $vendor
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Vendor $vendor)
    {
        // Delete vendor profile
        $vendor->delete();

        // Optionally, you can also delete the user account
        // $vendor->user->delete();

        return redirect()->route('admin.vendors.index')
            ->with('success', 'Vendor deleted successfully.');
    }

    /**
     * Update the vendor's status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Vendor  $vendor
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(Request $request, Vendor $vendor)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $vendor->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Vendor status updated successfully.');
    }
}