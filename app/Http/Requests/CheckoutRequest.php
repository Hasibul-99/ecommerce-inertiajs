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
    public function rules()
    {
        $rules = [
            'payment_method' => 'required|string|in:credit_card,paypal,bank_transfer',
            'save_address' => 'boolean',
            'same_billing_address' => 'boolean',
        ];

        // If using an existing address
        if ($this->shipping_address_id) {
            $rules['shipping_address_id'] = 'required|exists:addresses,id';
        } else {
            // If creating a new address
            $rules = array_merge($rules, [
                'shipping_name' => 'required|string|max:255',
                'shipping_address_line1' => 'required|string|max:255',
                'shipping_address_line2' => 'nullable|string|max:255',
                'shipping_city' => 'required|string|max:255',
                'shipping_state' => 'required|string|max:255',
                'shipping_postal_code' => 'required|string|max:20',
                'shipping_country' => 'required|string|max:2',
                'shipping_phone' => 'required|string|max:20',
            ]);
        }

        // If not using same billing address
        if ($this->has('same_billing_address') && !$this->same_billing_address) {
            if ($this->billing_address_id) {
                $rules['billing_address_id'] = 'required|exists:addresses,id';
            } else {
                $rules = array_merge($rules, [
                    'billing_name' => 'required|string|max:255',
                    'billing_address_line1' => 'required|string|max:255',
                    'billing_address_line2' => 'nullable|string|max:255',
                    'billing_city' => 'required|string|max:255',
                    'billing_state' => 'required|string|max:255',
                    'billing_postal_code' => 'required|string|max:20',
                    'billing_country' => 'required|string|max:2',
                    'billing_phone' => 'required|string|max:20',
                ]);
            }
        }

        // Payment method specific validation
        if ($this->payment_method === 'credit_card') {
            $rules = array_merge($rules, [
                'card_number' => 'required|string|min:13|max:19',
                'card_name' => 'required|string|max:255',
                'card_expiry_month' => 'required|string|size:2',
                'card_expiry_year' => 'required|string|size:2',
                'card_cvv' => 'required|string|size:3',
            ]);
        } elseif ($this->payment_method === 'paypal') {
            $rules['paypal_email'] = 'required|email';
        } elseif ($this->payment_method === 'bank_transfer') {
            $rules['bank_account_name'] = 'required|string|max:255';
            $rules['bank_account_number'] = 'required|string|max:50';
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