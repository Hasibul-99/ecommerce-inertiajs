<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ProductStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check() && (Auth::user()->hasPermissionTo('manage products') || Auth::user()->hasPermissionTo('manage own products'));
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if ($this->has('title') && !$this->has('slug')) {
            $this->merge([
                'slug' => Str::slug($this->title),
            ]);
        }

        // If user is a vendor, set the vendor_id to their vendor ID
        if (Auth::user()->hasPermissionTo('manage own products') && Auth::user()->vendor) {
            $this->merge([
                'vendor_id' => Auth::user()->vendor->id,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products',
            'description' => 'nullable|string',
            'base_price_cents' => 'required|integer|min:0',
            'sale_price_cents' => 'nullable|integer|min:0',
            'cost_cents' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|max:100|unique:products',
            'barcode' => 'nullable|string|max:100',
            'quantity' => 'nullable|integer|min:0',
            'status' => 'required|string|in:draft,published,archived',
            'vendor_id' => 'required|exists:vendors,id',
            'category_id' => 'required|exists:categories,id',
            'published_at' => 'nullable|date',
            'featured' => 'boolean',
            'images.*' => 'nullable|image|max:2048',
            'attributes' => 'nullable|array',
            'attributes.*.name' => 'required_with:attributes|string|max:255',
            'attributes.*.value' => 'required_with:attributes|string|max:255',
            'variants' => 'nullable|array',
            'variants.*.title' => 'required_with:variants|string|max:255',
            'variants.*.sku' => 'nullable|string|max:100|distinct',
            'variants.*.price_cents' => 'required_with:variants|integer|min:0',
            'variants.*.quantity' => 'nullable|integer|min:0',
            'variants.*.attributes' => 'nullable|array',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'title' => 'product title',
            'base_price_cents' => 'base price',
            'sale_price_cents' => 'sale price',
            'cost_cents' => 'cost',
            'vendor_id' => 'vendor',
            'category_id' => 'category',
            'variants.*.title' => 'variant title',
            'variants.*.price_cents' => 'variant price',
        ];
    }
}