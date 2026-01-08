<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Vendor;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;

class PackingSlipService
{
    /**
     * Generate and download packing slip PDF for vendor's items in an order.
     */
    public function generatePackingSlip(Vendor $vendor, Order $order)
    {
        $data = $this->getPackingSlipData($vendor, $order);

        $pdf = Pdf::loadView('pdfs.packing-slip', $data);
        $pdf->setPaper('letter', 'portrait');

        $filename = "packing-slip-{$order->order_number}-vendor-{$vendor->id}.pdf";

        return $pdf->download($filename);
    }

    /**
     * Stream packing slip PDF for preview in browser.
     */
    public function streamPackingSlip(Vendor $vendor, Order $order)
    {
        $data = $this->getPackingSlipData($vendor, $order);

        $pdf = Pdf::loadView('pdfs.packing-slip', $data);
        $pdf->setPaper('letter', 'portrait');

        return $pdf->stream();
    }

    /**
     * Get packing slip data for the given vendor and order.
     */
    public function getPackingSlipData(Vendor $vendor, Order $order): array
    {
        // Get only the vendor's items from this order
        $vendorItems = $order->items()
            ->where('vendor_id', $vendor->id)
            ->with(['product', 'productVariant'])
            ->get();

        // Calculate vendor-specific totals
        $subtotal = $vendorItems->sum(function ($item) {
            return $item->price_at_purchase_cents * $item->quantity;
        });

        // Calculate vendor's portion of tax (proportional to their items)
        $orderTotal = $order->total_amount_cents;
        $vendorProportion = $orderTotal > 0 ? $subtotal / $orderTotal : 0;
        $vendorTax = (int) ($order->tax_amount_cents * $vendorProportion);

        $total = $subtotal + $vendorTax;

        return [
            'order' => $order,
            'vendor' => $vendor,
            'items' => $vendorItems,
            'subtotal_cents' => $subtotal,
            'tax_cents' => $vendorTax,
            'total_cents' => $total,
            'generated_at' => now(),
        ];
    }
}
