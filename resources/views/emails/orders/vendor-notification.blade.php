<!DOCTYPE html>
<html>
<head>
    <title>New Order Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
        }
        .order-details {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .order-items {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .order-items th, .order-items td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }
        .order-items th {
            background-color: #f2f2f2;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 0.9em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Order Received</h1>
        <p>Order #{{ $order->order_number }}</p>
    </div>
    
    <p>Hello {{ $order->vendor->name }},</p>
    
    <p>You have received a new order. Here are the details:</p>
    
    <div class="order-details">
        <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y') }}</p>
        <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
        <p><strong>Customer:</strong> {{ $order->customer_name }}</p>
        <p><strong>Shipping Address:</strong> {{ $order->shipping_address }}</p>
    </div>
    
    <h2>Order Items</h2>
    
    <table class="order-items">
        <thead>
            <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items->where('vendor_id', $order->vendor->id) as $item)
            <tr>
                <td>{{ $item->product->title }}</td>
                <td>{{ $item->product->sku }}</td>
                <td>{{ $item->quantity }}</td>
                <td>${{ number_format($item->price / 100, 2) }}</td>
                <td>${{ number_format($item->total / 100, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" style="text-align: right;"><strong>Subtotal:</strong></td>
                <td>${{ number_format($order->items->where('vendor_id', $order->vendor->id)->sum('total') / 100, 2) }}</td>
            </tr>
        </tfoot>
    </table>
    
    <p>Please process this order as soon as possible. You can view the full order details in your vendor dashboard.</p>
    
    <p>Thank you for your partnership!</p>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>