<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Order;
use Illuminate\Support\Facades\Config;

class CodService
{
    /**
     * COD configuration constants
     */
    private const DEFAULT_MIN_ORDER_AMOUNT_CENTS = 50000; // $500
    private const DEFAULT_MAX_ORDER_AMOUNT_CENTS = 50000000; // $500,000
    private const DEFAULT_COD_FEE_CENTS = 500; // $5
    private const DEFAULT_COD_FEE_PERCENTAGE = 0.02; // 2%
    private const DEFAULT_DELIVERY_DAYS = 3; // 3-5 days

    /**
     * List of cities/states where COD is not available
     * This can be moved to config or database in production
     */
    private const RESTRICTED_AREAS = [
        'states' => [],
        'cities' => [],
        'postal_codes' => [],
    ];

    /**
     * Check if COD is available for the given address.
     *
     * @param Address $address
     * @return bool
     */
    public function isAvailableForAddress(Address $address): bool
    {
        // Check if state is restricted
        if (in_array(strtoupper($address->state), self::RESTRICTED_AREAS['states'])) {
            return false;
        }

        // Check if city is restricted
        if (in_array(strtolower($address->city), array_map('strtolower', self::RESTRICTED_AREAS['cities']))) {
            return false;
        }

        // Check if postal code is restricted
        if (in_array($address->postal_code, self::RESTRICTED_AREAS['postal_codes'])) {
            return false;
        }

        // Additional checks can be added here:
        // - Distance from distribution center
        // - Rural/urban classification
        // - Historical delivery success rate

        return true;
    }

    /**
     * Calculate COD fee based on order amount.
     * Uses the higher of: fixed fee or percentage-based fee
     *
     * @param int $orderAmountCents
     * @return int
     */
    public function getCodFee(int $orderAmountCents): int
    {
        $fixedFee = config('cod.fixed_fee_cents', self::DEFAULT_COD_FEE_CENTS);
        $percentageFee = (int) ($orderAmountCents * config('cod.fee_percentage', self::DEFAULT_COD_FEE_PERCENTAGE));

        // Return the higher of the two fees
        return max($fixedFee, $percentageFee);
    }

    /**
     * Get minimum order amount for COD in cents.
     *
     * @return int
     */
    public function getMinOrderAmount(): int
    {
        return config('cod.min_order_amount_cents', self::DEFAULT_MIN_ORDER_AMOUNT_CENTS);
    }

    /**
     * Get maximum order amount for COD in cents.
     *
     * @return int
     */
    public function getMaxOrderAmount(): int
    {
        return config('cod.max_order_amount_cents', self::DEFAULT_MAX_ORDER_AMOUNT_CENTS);
    }

    /**
     * Get estimated delivery time range for COD orders.
     *
     * @return array
     */
    public function getDeliveryTimeEstimate(): array
    {
        $minDays = config('cod.min_delivery_days', self::DEFAULT_DELIVERY_DAYS);
        $maxDays = config('cod.max_delivery_days', self::DEFAULT_DELIVERY_DAYS + 2);

        return [
            'min_days' => $minDays,
            'max_days' => $maxDays,
            'text' => "{$minDays}-{$maxDays} business days",
        ];
    }

    /**
     * Validate if an order can use COD payment method.
     *
     * @param Order $order
     * @return array
     */
    public function validateCodOrder(Order $order): array
    {
        $errors = [];

        // Check if order amount is within limits
        if ($order->total_cents < $this->getMinOrderAmount()) {
            $minAmount = $this->getMinOrderAmount() / 100;
            $errors[] = "COD is only available for orders above $" . number_format($minAmount, 2);
        }

        if ($order->total_cents > $this->getMaxOrderAmount()) {
            $maxAmount = $this->getMaxOrderAmount() / 100;
            $errors[] = "COD is not available for orders above $" . number_format($maxAmount, 2);
        }

        // Check if shipping address supports COD
        if ($order->shippingAddress && !$this->isAvailableForAddress($order->shippingAddress)) {
            $errors[] = "COD is not available for your delivery location.";
        }

        // Check if phone number is provided
        if ($order->shippingAddress && empty($order->shippingAddress->phone)) {
            $errors[] = "Phone number is required for COD orders.";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Validate COD availability for an address and order amount.
     *
     * @param Address|null $address
     * @param int $orderAmountCents
     * @param string|null $phone
     * @return array
     */
    public function validateCodAvailability(?Address $address, int $orderAmountCents, ?string $phone = null): array
    {
        $errors = [];
        $warnings = [];

        // Check order amount limits
        if ($orderAmountCents < $this->getMinOrderAmount()) {
            $minAmount = $this->getMinOrderAmount() / 100;
            $errors[] = "COD is only available for orders above $" . number_format($minAmount, 2);
        }

        if ($orderAmountCents > $this->getMaxOrderAmount()) {
            $maxAmount = $this->getMaxOrderAmount() / 100;
            $errors[] = "COD is not available for orders above $" . number_format($maxAmount, 2);
        }

        // Check address availability
        if ($address && !$this->isAvailableForAddress($address)) {
            $errors[] = "COD is not available for your delivery location.";
        }

        // Check phone number
        if (empty($phone) && $address) {
            $phone = $address->phone ?? null;
        }

        if (empty($phone)) {
            $errors[] = "Phone number is required for COD orders.";
        }

        // Calculate COD fee
        $codFee = $this->getCodFee($orderAmountCents);
        $deliveryEstimate = $this->getDeliveryTimeEstimate();

        return [
            'available' => empty($errors),
            'errors' => $errors,
            'warnings' => $warnings,
            'cod_fee_cents' => $codFee,
            'cod_fee_dollars' => $codFee / 100,
            'delivery_estimate' => $deliveryEstimate,
            'min_order_amount_cents' => $this->getMinOrderAmount(),
            'max_order_amount_cents' => $this->getMaxOrderAmount(),
        ];
    }

    /**
     * Check if COD verification is required for an order.
     *
     * @param Order $order
     * @return bool
     */
    public function requiresVerification(Order $order): bool
    {
        // Verification is required for high-value orders
        $highValueThreshold = config('cod.high_value_threshold_cents', 1000000); // $10,000

        return $order->total_cents >= $highValueThreshold;
    }

    /**
     * Get COD payment instructions for customers.
     *
     * @return string
     */
    public function getPaymentInstructions(): string
    {
        return "Please keep the exact amount ready for the delivery person. " .
               "You can pay in cash at the time of delivery. " .
               "A small COD fee will be applied to your order.";
    }

    /**
     * Calculate total amount including COD fee.
     *
     * @param int $orderAmountCents
     * @return array
     */
    public function calculateTotalWithCodFee(int $orderAmountCents): array
    {
        $codFee = $this->getCodFee($orderAmountCents);
        $totalWithFee = $orderAmountCents + $codFee;

        return [
            'order_amount_cents' => $orderAmountCents,
            'cod_fee_cents' => $codFee,
            'total_cents' => $totalWithFee,
            'order_amount_dollars' => $orderAmountCents / 100,
            'cod_fee_dollars' => $codFee / 100,
            'total_dollars' => $totalWithFee / 100,
        ];
    }
}
