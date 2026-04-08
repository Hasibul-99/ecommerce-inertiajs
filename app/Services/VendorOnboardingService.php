<?php

namespace App\Services;

use App\Models\Vendor;
use App\Models\VendorDocument;
use App\Notifications\VendorApplicationReceived;
use App\Notifications\VendorApplicationSubmitted;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class VendorOnboardingService
{
    public function validateBusinessInfo(array $data): bool
    {
        $validator = Validator::make($data, [
            'business_name' => 'required|string|max:255|unique:vendors,business_name',
            'description' => 'required|string|min:50|max:1000',
            'business_type' => 'required|in:sole_proprietorship,partnership,llc,corporation',
            'tax_id' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return true;
    }

    public function processDocuments(Vendor $vendor, array $files): array
    {
        $uploadedDocuments = [];

        foreach ($files as $fileData) {
            if (!isset($fileData['file']) || !isset($fileData['type'])) {
                continue;
            }

            $file = $fileData['file'];
            $type = $fileData['type'];

            if (!$file instanceof UploadedFile) {
                continue;
            }

            $validator = Validator::make([
                'file' => $file,
                'type' => $type,
            ], [
                'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
                'type' => 'required|in:business_license,tax_certificate,id_proof,address_proof,other',
            ]);

            if ($validator->fails()) {
                continue;
            }

            $path = $file->store('vendor-documents/' . $vendor->id, 'private');

            $document = VendorDocument::create([
                'vendor_id' => $vendor->id,
                'type' => $type,
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'status' => 'pending',
            ]);

            $uploadedDocuments[] = $document;
        }

        return $uploadedDocuments;
    }

    public function validateBankDetails(array $data): bool
    {
        $validator = Validator::make($data, [
            'bank_name' => 'required|string|max:255',
            'bank_account_name' => 'required|string|max:255',
            'bank_account_number' => 'required|string|max:255',
            'bank_routing_number' => 'required|string|max:255',
            'bank_swift_code' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return true;
    }

    public function calculateApprovalScore(Vendor $vendor): int
    {
        $score = 0;

        if ($vendor->business_name) $score += 10;
        if ($vendor->description && strlen($vendor->description) >= 50) $score += 10;
        if ($vendor->tax_id) $score += 10;
        if ($vendor->address_line1 && $vendor->city && $vendor->state) $score += 10;

        $documentsCount = $vendor->documents()->count();
        if ($documentsCount >= 1) $score += 10;
        if ($documentsCount >= 2) $score += 10;
        if ($documentsCount >= 3) $score += 10;
        if ($documentsCount >= 4) $score += 10;

        if ($vendor->bank_name && $vendor->bank_account_number) $score += 20;

        return $score;
    }

    public function submitForReview(Vendor $vendor): bool
    {
        $score = $this->calculateApprovalScore($vendor);

        if ($score < 60) {
            throw new \Exception('Vendor does not meet minimum requirements. Score: ' . $score . '/100');
        }

        DB::transaction(function () use ($vendor) {
            $vendor->update([
                'onboarding_step' => 'completed',
                'status' => 'pending',
            ]);

            if ($vendor->user) {
                $vendor->user->notify(new VendorApplicationSubmitted($vendor));
            }

            $admins = \App\Models\User::role(['admin', 'super-admin'])->get();
            foreach ($admins as $admin) {
                $admin->notify(new VendorApplicationReceived($vendor));
            }
        });

        return true;
    }

    public function approveVendor(Vendor $vendor, int $approvedBy): bool
    {
        $vendor->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $approvedBy,
        ]);

        if ($vendor->user) {
            $vendor->user->notify(new \App\Notifications\VendorApplicationApproved($vendor));
        }

        return true;
    }

    public function rejectVendor(Vendor $vendor, int $rejectedBy, string $reason): bool
    {
        $vendor->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejected_by' => $rejectedBy,
            'rejection_reason' => $reason,
        ]);

        if ($vendor->user) {
            $vendor->user->notify(new \App\Notifications\VendorApplicationRejected($vendor, $reason));
        }

        return true;
    }

    public function canProceedToNextStep(Vendor $vendor, string $currentStep): bool
    {
        switch ($currentStep) {
            case 'business_info':
                return $vendor->business_name &&
                       $vendor->description &&
                       $vendor->tax_id &&
                       $vendor->address_line1 &&
                       $vendor->city &&
                       $vendor->state;

            case 'documents':
                return $vendor->documents()->count() >= 1;

            case 'bank_details':
                return $vendor->bank_name &&
                       $vendor->bank_account_name &&
                       $vendor->bank_account_number;

            default:
                return false;
        }
    }

    public function updateOnboardingStep(Vendor $vendor, string $step): bool
    {
        $validSteps = ['business_info', 'documents', 'bank_details', 'completed'];

        if (!in_array($step, $validSteps)) {
            return false;
        }

        $vendor->update(['onboarding_step' => $step]);

        return true;
    }
}
