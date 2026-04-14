<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = [
            'payment_method'       => 'required|string|in:cod',
            'save_address'         => 'boolean',
            'same_billing_address' => 'boolean',
        ];

        if ($this->shipping_address_id) {
            $rules['shipping_address_id'] = 'required|exists:addresses,id';
        } else {
            $rules = array_merge($rules, [
                'shipping_name'          => 'required|string|max:255',
                'shipping_address_line1' => 'required|string|max:255',
                'shipping_address_line2' => 'nullable|string|max:255',
                'shipping_city'          => 'required|string|max:255',
                'shipping_state'         => 'required|string|max:255',
                'shipping_postal_code'   => 'required|string|max:20',
                'shipping_country'       => 'required|string|max:2',
                'shipping_phone'         => 'required|string|max:20',
            ]);
        }

        return $rules;
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'shipping_name' => 'full name',
            'shipping_address_line1' => 'address line 1',
            'shipping_address_line2' => 'address line 2',
            'shipping_city' => 'city',
            'shipping_state' => 'state/province',
            'shipping_postal_code' => 'postal code',
            'shipping_country' => 'country',
            'shipping_phone' => 'phone number',
            'billing_name' => 'billing full name',
            'billing_address_line1' => 'billing address line 1',
            'billing_address_line2' => 'billing address line 2',
            'billing_city' => 'billing city',
            'billing_state' => 'billing state/province',
            'billing_postal_code' => 'billing postal code',
            'billing_country' => 'billing country',
            'billing_phone' => 'billing phone number',
        ];
    }

}