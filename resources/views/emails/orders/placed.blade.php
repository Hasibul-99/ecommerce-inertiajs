<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation</title>
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
        <h1>Thank You for Your Order!</h1>
        <p>Order #{{ $order->order_number }}</p>
    </div>
    
    <p>Dear {{ $order->customer_name }},</p>
    
    <p>We're pleased to confirm that we've received your order. Here's a summary of your purchase:</p>
    
    <div class="order-details">
        <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y') }}</p>
        <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
        <p><strong>Payment Method:</strong> {{ $order->payment_method }}</p>
        <p><strong>Shipping Address:</strong> {{ $order->shipping_address }}</p>
    </div>
    
    <h2>Order Summary</h2>
    
    <table class="order-items">
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product->title }}</td>
                <td>{{ $item->quantity }}</td>
                <td>${{ number_format($item->price / 100, 2) }}</td>
                <td>${{ number_format($item->total / 100, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                <td>${{ number_format($order->subtotal / 100, 2) }}</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
                <td>${{ number_format($order->shipping_cost / 100, 2) }}</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: right;"><strong>Tax:</strong></td>
                <td>${{ number_format($order->tax / 100, 2) }}</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                <td>${{ number_format($order->total / 100, 2) }}</td>
            </tr>
        </tfoot>
    </table>
    
    <p>We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact our customer service team.</p>
    
    <p>Thank you for shopping with us!</p>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>