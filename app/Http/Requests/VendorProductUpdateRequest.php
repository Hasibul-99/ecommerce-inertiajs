<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class VendorProductUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $vendor = Auth::user()->vendor;
        $product = $this->route('product');

        return $vendor &&
               $vendor->isApproved() &&
               $product &&
               $product->vendor_id === $vendor->id;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:20',
            'base_price_cents' => 'required|integer|min:0',
            'currency' => 'nullable|string|size:3',
            'status' => 'required|in:draft,published,archived',

            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:product_tags,id',

            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|exists:product_variants,id',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.attributes' => 'nullable|array',
            'variants.*.price_cents' => 'required|integer|min:0',
            'variants.*.stock_quantity' => 'required|integer|min:0',
            'variants.*.is_default' => 'nullable|boolean',

            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',

            'delete_images' => 'nullable|array',
            'delete_images.*' => 'integer',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Please select a category for your product.',
            'title.required' => 'Product title is required.',
            'description.required' => 'Product description is required.',
            'description.min' => 'Product description must be at least 20 characters.',
            'base_price_cents.required' => 'Product price is required.',
            'images.*.max' => 'Each image must not exceed 5MB.',
        ];
    }
}
