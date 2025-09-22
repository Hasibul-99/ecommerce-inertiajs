<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $product = $this->route('product');
        
        // Admin can update any product
        if (Auth::user()->hasPermissionTo('manage products')) {
            return true;
        }
        
        // Vendor can only update their own products
        if (Auth::user()->hasPermissionTo('manage own products') && Auth::user()->vendor) {
            return $product->vendor_id === Auth::user()->vendor->id;
        }
        
        return false;
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
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $product = $this->route('product');
        
        return [
            'title' => 'sometimes|required|string|max:255',
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products')->ignore($product->id),
            ],
            'description' => 'nullable|string',
            'base_price_cents' => 'sometimes|required|integer|min:0',
            'sale_price_cents' => 'nullable|integer|min:0',
            'cost_cents' => 'nullable|integer|min:0',
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products')->ignore($product->id),
            ],
            'barcode' => 'nullable|string|max:100',
            'quantity' => 'nullable|integer|min:0',
            'status' => 'sometimes|required|string|in:draft,published,archived',
            'category_id' => 'sometimes|required|exists:categories,id',
            'published_at' => 'nullable|date',
            'featured' => 'boolean',
            'images.*' => 'nullable|image|max:2048',
            'attributes' => 'nullable|array',
            'attributes.*.name' => 'required_with:attributes|string|max:255',
            'attributes.*.value' => 'required_with:attributes|string|max:255',
            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|exists:product_variants,id',
            'variants.*.title' => 'required_with:variants|string|max:255',
            'variants.*.sku' => [
                'nullable',
                'string',
                'max:100',
                'distinct',
            ],
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
            'category_id' => 'category',
            'variants.*.title' => 'variant title',
            'variants.*.price_cents' => 'variant price',
        ];
    }
}