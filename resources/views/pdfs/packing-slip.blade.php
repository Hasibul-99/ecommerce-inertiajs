<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Packing Slip - Order #{{ $order->order_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #333;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }

        .header h1 {
            font-size: 28pt;
            color: #2563eb;
            margin-bottom: 5px;
        }

        .header .subtitle {
            font-size: 10pt;
            color: #666;
        }

        .info-section {
            margin-bottom: 20px;
        }

        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }

        .info-column {
            display: table-cell;
            width: 48%;
            vertical-align: top;
            padding: 15px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
        }

        .info-column + .info-column {
            margin-left: 4%;
        }

        .info-column h3 {
            font-size: 12pt;
            color: #1e40af;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-column p {
            margin: 5px 0;
            font-size: 10pt;
        }

        .info-column strong {
            display: inline-block;
            width: 120px;
            color: #475569;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .items-table th {
            background-color: #2563eb;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-size: 10pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .items-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 10pt;
        }

        .items-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .items-table tr:hover {
            background-color: #f1f5f9;
        }

        .items-table .text-right {
            text-align: right;
        }

        .items-table .text-center {
            text-align: center;
        }

        .totals {
            margin-top: 20px;
            float: right;
            width: 300px;
        }

        .totals table {
            width: 100%;
            border-collapse: collapse;
        }

        .totals td {
            padding: 8px 12px;
            font-size: 11pt;
        }

        .totals .label {
            text-align: right;
            color: #475569;
            font-weight: 500;
        }

        .totals .amount {
            text-align: right;
            font-weight: 600;
        }

        .totals .total-row {
            border-top: 2px solid #2563eb;
            background-color: #eff6ff;
        }

        .totals .total-row td {
            padding: 12px;
            font-size: 13pt;
            font-weight: bold;
            color: #1e40af;
        }

        .notes {
            clear: both;
            margin-top: 30px;
            padding: 15px;
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
        }

        .notes h4 {
            color: #92400e;
            margin-bottom: 8px;
            font-size: 11pt;
        }

        .notes p {
            color: #78350f;
            font-size: 10pt;
            line-height: 1.6;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 9pt;
            color: #64748b;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 9pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-confirmed { background-color: #dbeafe; color: #1e40af; }
        .status-processing { background-color: #e0e7ff; color: #4338ca; }
        .status-ready_to_ship { background-color: #dcfce7; color: #166534; }
        .status-shipped { background-color: #d1fae5; color: #065f46; }
        .status-delivered { background-color: #d1fae5; color: #065f46; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        .status-refunded { background-color: #fce7f3; color: #9f1239; }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>PACKING SLIP</h1>
        <p class="subtitle">Order #{{ $order->order_number }}</p>
    </div>

    <!-- Order & Vendor Information -->
    <div class="info-grid">
        <div class="info-column">
            <h3>Order Information</h3>
            <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
            <p><strong>Order Date:</strong> {{ $order->created_at->format('F d, Y') }}</p>
            <p><strong>Payment Method:</strong> {{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}</p>
            <p><strong>Payment Status:</strong> {{ ucfirst($order->payment_status) }}</p>
        </div>

        <div class="info-column">
            <h3>Vendor Information</h3>
            <p><strong>Business Name:</strong> {{ $vendor->business_name }}</p>
            @if($vendor->phone)
            <p><strong>Phone:</strong> {{ $vendor->phone }}</p>
            @endif
            @if($vendor->email)
            <p><strong>Email:</strong> {{ $vendor->email }}</p>
            @endif
        </div>
    </div>

    <div class="info-grid">
        <div class="info-column">
            <h3>Ship To</h3>
            <p><strong>Address:</strong></p>
            <p>{{ $order->shipping_street }}</p>
            <p>{{ $order->shipping_city }}, {{ $order->shipping_state }} {{ $order->shipping_postal_code }}</p>
            <p>{{ $order->shipping_country }}</p>
        </div>

        <div class="info-column">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> {{ $order->user->name }}</p>
            <p><strong>Email:</strong> {{ $order->user->email }}</p>
            @if($order->user->phone)
            <p><strong>Phone:</strong> {{ $order->user->phone }}</p>
            @endif
        </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 15%;">SKU</th>
                <th style="width: 35%;">Product</th>
                <th style="width: 10%;" class="text-center">Qty</th>
                <th style="width: 15%;" class="text-right">Unit Price</th>
                <th style="width: 15%;" class="text-right">Total</th>
                <th style="width: 10%;" class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr>
                <td>{{ $item->productVariant->sku ?? $item->product->sku ?? 'N/A' }}</td>
                <td>
                    <strong>{{ $item->product->title }}</strong>
                    @if($item->productVariant)
                    <br>
                    <span style="color: #64748b; font-size: 9pt;">{{ $item->productVariant->name }}</span>
                    @endif
                </td>
                <td class="text-center">{{ $item->quantity }}</td>
                <td class="text-right">${{ number_format($item->price_at_purchase_cents / 100, 2) }}</td>
                <td class="text-right"><strong>${{ number_format(($item->price_at_purchase_cents * $item->quantity) / 100, 2) }}</strong></td>
                <td class="text-center">
                    <span class="status-badge status-{{ $item->vendor_status }}">
                        {{ str_replace('_', ' ', $item->vendor_status) }}
                    </span>
                </td>
            </tr>
            @if($item->tracking_number)
            <tr>
                <td colspan="6" style="background-color: #f0f9ff; padding: 8px; font-size: 9pt;">
                    <strong style="color: #0369a1;">Tracking:</strong>
                    {{ $item->carrier }} - {{ $item->tracking_number }}
                    @if($item->shipped_at)
                    | Shipped: {{ $item->shipped_at->format('M d, Y') }}
                    @endif
                </td>
            </tr>
            @endif
            @endforeach
        </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
        <table>
            <tr>
                <td class="label">Subtotal:</td>
                <td class="amount">${{ number_format($subtotal_cents / 100, 2) }}</td>
            </tr>
            <tr>
                <td class="label">Tax:</td>
                <td class="amount">${{ number_format($tax_cents / 100, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td class="label">Total:</td>
                <td class="amount">${{ number_format($total_cents / 100, 2) }}</td>
            </tr>
        </table>
    </div>

    <!-- Vendor Notes (if any items have notes) -->
    @php
        $notesExist = $items->whereNotNull('vendor_notes')->isNotEmpty();
    @endphp
    @if($notesExist)
    <div class="notes">
        <h4>Vendor Notes</h4>
        @foreach($items as $item)
            @if($item->vendor_notes)
            <p><strong>{{ $item->product->title }}:</strong> {{ $item->vendor_notes }}</p>
            @endif
        @endforeach
    </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <p>This packing slip was generated on {{ $generated_at->format('F d, Y \a\t g:i A') }}</p>
        <p>Thank you for your business!</p>
    </div>
</body>
</html>
