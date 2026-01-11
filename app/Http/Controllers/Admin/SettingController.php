<?php

namespace App\Http\Controllers\Admin;

use App\Facades\Settings;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    /**
     * Display settings navigation/index.
     */
    public function index()
    {
        $groups = Settings::getGroups();

        return Inertia::render('Admin/Settings/Index', [
            'groups' => $groups,
        ]);
    }

    /**
     * Display general settings.
     */
    public function general()
    {
        $settings = Settings::getGroupWithMetadata('general');

        return Inertia::render('Admin/Settings/General', [
            'settings' => $settings,
        ]);
    }

    /**
     * Display payment settings.
     */
    public function payment()
    {
        $settings = Settings::getGroupWithMetadata('payment');

        return Inertia::render('Admin/Settings/Payment', [
            'settings' => $settings,
        ]);
    }

    /**
     * Display shipping settings.
     */
    public function shipping()
    {
        $settings = Settings::getGroupWithMetadata('shipping');

        return Inertia::render('Admin/Settings/Shipping', [
            'settings' => $settings,
        ]);
    }

    /**
     * Display email/SMTP settings.
     */
    public function email()
    {
        $settings = Settings::getGroupWithMetadata('email');

        return Inertia::render('Admin/Settings/Email', [
            'settings' => $settings,
        ]);
    }

    /**
     * Display vendor settings.
     */
    public function vendor()
    {
        $settings = Settings::getGroupWithMetadata('vendor');

        return Inertia::render('Admin/Settings/Vendor', [
            'settings' => $settings,
        ]);
    }

    /**
     * Display tax settings.
     */
    public function tax()
    {
        $settings = Settings::getGroupWithMetadata('tax');

        return Inertia::render('Admin/Settings/Tax', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update settings for a specific group.
     */
    public function update(Request $request, string $group)
    {
        // Validate based on group
        $validatedData = $this->validateGroup($request, $group);

        // Handle file uploads
        foreach ($validatedData as $key => $value) {
            if ($request->hasFile($key)) {
                Settings::uploadFile("{$group}.{$key}", $request->file($key));
                unset($validatedData[$key]);
            }
        }

        // Update regular settings
        Settings::updateGroup($group, $validatedData);

        return redirect()->back()->with('success', ucfirst($group) . ' settings updated successfully.');
    }

    /**
     * Validate settings based on group.
     */
    protected function validateGroup(Request $request, string $group): array
    {
        return match ($group) {
            'general' => $request->validate([
                'site_name' => 'nullable|string|max:255',
                'site_logo' => 'nullable|image|max:2048',
                'favicon' => 'nullable|image|max:1024',
                'contact_email' => 'nullable|email|max:255',
                'contact_phone' => 'nullable|string|max:50',
                'address' => 'nullable|string|max:500',
                'currency' => 'nullable|string|max:10',
                'timezone' => 'nullable|string|max:100',
            ]),
            'payment' => $request->validate([
                'enabled_methods' => 'nullable|array',
                'cod_enabled' => 'nullable|boolean',
                'cod_fee' => 'nullable|numeric|min:0',
                'min_cod_amount' => 'nullable|numeric|min:0',
                'max_cod_amount' => 'nullable|numeric|min:0',
            ]),
            'shipping' => $request->validate([
                'default_carrier' => 'nullable|string|max:255',
                'free_shipping_threshold' => 'nullable|numeric|min:0',
                'handling_time' => 'nullable|integer|min:0',
                'default_weight_unit' => 'nullable|string|max:10',
            ]),
            'email' => $request->validate([
                'from_name' => 'nullable|string|max:255',
                'from_email' => 'nullable|email|max:255',
                'smtp_host' => 'nullable|string|max:255',
                'smtp_port' => 'nullable|integer',
                'smtp_username' => 'nullable|string|max:255',
                'smtp_password' => 'nullable|string|max:255',
                'smtp_encryption' => 'nullable|string|in:tls,ssl',
            ]),
            'vendor' => $request->validate([
                'commission_rate' => 'nullable|numeric|min:0|max:100',
                'min_payout' => 'nullable|numeric|min:0',
                'payout_schedule' => 'nullable|string|in:weekly,biweekly,monthly',
                'auto_approve' => 'nullable|boolean',
                'require_verification' => 'nullable|boolean',
            ]),
            'tax' => $request->validate([
                'tax_enabled' => 'nullable|boolean',
                'tax_rate' => 'nullable|numeric|min:0|max:100',
                'tax_included_in_price' => 'nullable|boolean',
                'tax_label' => 'nullable|string|max:100',
            ]),
            default => [],
        };
    }

    /**
     * Send test email.
     */
    public function sendTestEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            \Illuminate\Support\Facades\Mail::raw(
                'This is a test email from your e-commerce platform.',
                function ($message) use ($request) {
                    $message->to($request->email)
                        ->subject('Test Email - ' . settings('general.site_name', 'E-commerce Platform'));
                }
            );

            return redirect()->back()->with('success', 'Test email sent successfully to ' . $request->email);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send test email: ' . $e->getMessage());
        }
    }
}
