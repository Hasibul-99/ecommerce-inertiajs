<!DOCTYPE html>
<html>
<head>
    <title>Payout Processed</title>
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
        .payout-details {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
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
        <h1>Payout Processed</h1>
        <p>Reference #{{ $payout->reference_number }}</p>
    </div>
    
    <p>Hello {{ $payout->vendor->name }},</p>
    
    <p>We're pleased to inform you that your payout has been processed. Here are the details:</p>
    
    <div class="payout-details">
        <p><strong>Payout Date:</strong> {{ $payout->processed_at->format('F j, Y') }}</p>
        <p><strong>Reference Number:</strong> {{ $payout->reference_number }}</p>
        <p><strong>Amount:</strong> ${{ number_format($payout->amount / 100, 2) }}</p>
        <p><strong>Payment Method:</strong> {{ $payout->payment_method }}</p>
        <p><strong>Status:</strong> {{ ucfirst($payout->status) }}</p>
    </div>
    
    <p>This payout includes earnings from orders between {{ $payout->period_start->format('F j, Y') }} and {{ $payout->period_end->format('F j, Y') }}.</p>
    
    <p>You can view the full details of this payout, including a breakdown of all orders, in your vendor dashboard.</p>
    
    <p>If you have any questions about this payout, please don't hesitate to contact our vendor support team.</p>
    
    <p>Thank you for your partnership!</p>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>