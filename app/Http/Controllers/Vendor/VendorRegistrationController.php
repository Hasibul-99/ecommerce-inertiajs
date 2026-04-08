<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Services\VendorOnboardingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VendorRegistrationController extends Controller
{
    protected $onboardingService;

    public function __construct(VendorOnboardingService $onboardingService)
    {
        $this->middleware(['auth', 'verified']);
        $this->onboardingService = $onboardingService;
    }

    public function showRegistrationForm()
    {
        $vendor = Auth::user()->vendor;

        if ($vendor && $vendor->status === 'approved') {
            return redirect()->route('vendor.dashboard')
                ->with('info', 'You are already registered as a vendor.');
        }

        if (!$vendor) {
            $vendor = Vendor::create([
                'user_id' => Auth::id(),
                'business_name' => 'Draft',
                'slug' => 'draft-' . Str::random(8),
                'phone' => '',
                'status' => 'pending',
                'onboarding_step' => 'business_info',
            ]);
        }

        return $this->showStep($vendor->onboarding_step);
    }

    protected function showStep(string $step)
    {
        $vendor = Auth::user()->vendor()->with('documents')->first();

        switch ($step) {
            case 'business_info':
                return Inertia::render('Vendor/Register/Step1', [
                    'vendor' => $vendor,
                ]);

            case 'documents':
                return Inertia::render('Vendor/Register/Step2', [
                    'vendor' => $vendor,
                    'documents' => $vendor->documents,
                ]);

            case 'bank_details':
                return Inertia::render('Vendor/Register/Step3', [
                    'vendor' => $vendor,
                ]);

            case 'completed':
                return Inertia::render('Vendor/Register/Complete', [
                    'vendor' => $vendor,
                ]);

            default:
                return redirect()->route('vendor.register');
        }
    }

    public function storeStep1(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('vendor.register')
                ->with('error', 'Vendor not found. Please start registration.');
        }

        try {
            $this->onboardingService->validateBusinessInfo($request->all());

            DB::transaction(function () use ($request, $vendor) {
                $vendor->update([
                    'business_name' => $request->business_name,
                    'slug' => Str::slug($request->business_name),
                    'description' => $request->description,
                    'business_type' => $request->business_type,
                    'tax_id' => $request->tax_id,
                    'phone' => $request->phone,
                    'website' => $request->website,
                    'address_line1' => $request->address_line1,
                    'address_line2' => $request->address_line2,
                    'city' => $request->city,
                    'state' => $request->state,
                    'postal_code' => $request->postal_code,
                    'country' => $request->country,
                    'onboarding_step' => 'documents',
                ]);

                if ($request->hasFile('logo')) {
                    $vendor->addMediaFromRequest('logo')
                        ->toMediaCollection('logo');
                }

                if ($request->hasFile('banner')) {
                    $vendor->addMediaFromRequest('banner')
                        ->toMediaCollection('banner');
                }
            });

            return redirect()->route('vendor.register.step2')
                ->with('success', 'Business information saved successfully.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    public function storeStep2(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('vendor.register')
                ->with('error', 'Vendor not found.');
        }

        $request->validate([
            'documents' => 'required|array|min:1',
            'documents.*.file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'documents.*.type' => 'required|in:business_license,tax_certificate,id_proof,address_proof,other',
        ]);

        try {
            DB::transaction(function () use ($request, $vendor) {
                $documentsData = [];

                foreach ($request->file('documents') as $index => $file) {
                    $documentsData[] = [
                        'file' => $file,
                        'type' => $request->input("documents.{$index}.type"),
                    ];
                }

                $this->onboardingService->processDocuments($vendor, $documentsData);

                $vendor->update(['onboarding_step' => 'bank_details']);
            });

            return redirect()->route('vendor.register.step3')
                ->with('success', 'Documents uploaded successfully.');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    public function storeStep3(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('vendor.register')
                ->with('error', 'Vendor not found.');
        }

        try {
            $this->onboardingService->validateBankDetails($request->all());

            $vendor->update([
                'bank_name' => $request->bank_name,
                'bank_account_name' => $request->bank_account_name,
                'bank_account_number' => $request->bank_account_number,
                'bank_routing_number' => $request->bank_routing_number,
                'bank_swift_code' => $request->bank_swift_code,
                'onboarding_step' => 'completed',
            ]);

            return redirect()->route('vendor.register.complete')
                ->with('success', 'Bank details saved successfully.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    public function complete(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('vendor.register')
                ->with('error', 'Vendor not found.');
        }

        if ($vendor->onboarding_step !== 'completed') {
            return redirect()->route('vendor.register')
                ->with('error', 'Please complete all steps before submitting.');
        }

        try {
            $this->onboardingService->submitForReview($vendor);

            return redirect()->route('dashboard')
                ->with('success', 'Your vendor application has been submitted for review!');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function showStep1()
    {
        return $this->showStep('business_info');
    }

    public function showStep2()
    {
        return $this->showStep('documents');
    }

    public function showStep3()
    {
        return $this->showStep('bank_details');
    }

    public function showComplete()
    {
        return $this->showStep('completed');
    }
}
