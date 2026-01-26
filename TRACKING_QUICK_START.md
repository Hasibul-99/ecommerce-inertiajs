# Order Tracking System - Quick Start Guide

## 🚀 Quick Test (5 Minutes)

### Step 1: Build Frontend Assets
```bash
npm run build
# or for development with hot reload:
npm run dev
```

### Step 2: Create Test Data
Run this in `php artisan tinker`:

```php
// Create a test user
$user = \App\Models\User::factory()->create([
    'email' => 'test@example.com',
    'name' => 'Test Customer'
]);

// Create a vendor (if not exists)
$vendor = \App\Models\Vendor::first() ?? \App\Models\Vendor::factory()->create();

// Create a test order
$order = \App\Models\Order::create([
    'user_id' => $user->id,
    'order_number' => 'ORD-TEST-' . rand(10000, 99999),
    'status' => 'in_transit',
    'payment_status' => 'paid',
    'payment_method' => 'stripe',
    'total_cents' => 9999,
    'subtotal_cents' => 8999,
    'tax_cents' => 800,
    'shipping_cents' => 200,
    'discount_cents' => 0,
    'tracking_number' => 'TRACK-' . rand(100000, 999999),
    'shipping_carrier' => 'fedex',
    'created_at' => now()->subDays(3),
]);

// Create shipping address
$address = \App\Models\Address::create([
    'user_id' => $user->id,
    'type' => 'shipping',
    'first_name' => 'John',
    'last_name' => 'Doe',
    'address_line_1' => '123 Main Street',
    'city' => 'New York',
    'state' => 'NY',
    'postal_code' => '10001',
    'country' => 'USA',
    'phone' => '+1-555-0123',
]);

$order->update(['shipping_address_id' => $address->id]);

// Create a shipment with tracking events
$shipment = \App\Models\OrderShipment::create([
    'order_id' => $order->id,
    'vendor_id' => $vendor->id,
    'tracking_number' => 'SHIP-' . rand(100000, 999999),
    'shipping_carrier' => 'fedex',
    'shipping_method' => 'express',
    'status' => 'in_transit',
    'shipped_at' => now()->subDays(2),
    'tracking_events' => [
        [
            'id' => '1',
            'status' => 'label_created',
            'message' => 'Shipping label created',
            'location' => 'Warehouse, Los Angeles, CA',
            'timestamp' => now()->subDays(3)->toIso8601String(),
        ],
        [
            'id' => '2',
            'status' => 'picked_up',
            'message' => 'Package picked up by carrier',
            'location' => 'Los Angeles Distribution Center',
            'timestamp' => now()->subDays(2)->toIso8601String(),
        ],
        [
            'id' => '3',
            'status' => 'in_transit',
            'message' => 'In transit to destination',
            'location' => 'Phoenix, AZ Distribution Center',
            'timestamp' => now()->subDays(1)->toIso8601String(),
        ],
        [
            'id' => '4',
            'status' => 'in_transit',
            'message' => 'Package arrived at destination facility',
            'location' => 'New York Distribution Center',
            'timestamp' => now()->subHours(6)->toIso8601String(),
        ],
    ],
]);

// Create order items
$product = \App\Models\Product::first() ?? \App\Models\Product::factory()->create(['vendor_id' => $vendor->id]);

\App\Models\OrderItem::create([
    'order_id' => $order->id,
    'product_id' => $product->id,
    'vendor_id' => $vendor->id,
    'product_name' => $product->title ?? 'Test Product',
    'quantity' => 2,
    'unit_price_cents' => 4499,
    'price_cents' => 4499,
    'subtotal_cents' => 8998,
    'tax_cents' => 800,
    'total_cents' => 9798,
]);

// Create order status history
\App\Models\OrderStatus::create([
    'order_id' => $order->id,
    'status' => 'pending',
    'created_at' => now()->subDays(3),
]);

\App\Models\OrderStatus::create([
    'order_id' => $order->id,
    'status' => 'processing',
    'created_at' => now()->subDays(2),
]);

\App\Models\OrderStatus::create([
    'order_id' => $order->id,
    'status' => 'shipped',
    'created_at' => now()->subDays(2),
]);

\App\Models\OrderStatus::create([
    'order_id' => $order->id,
    'status' => 'in_transit',
    'created_at' => now()->subDays(1),
]);

// Generate tracking URL
$trackingService = app(\App\Services\TrackingService::class);
$token = $trackingService->generateTrackingToken($order);
$trackingUrl = route('track-order.show', ['token' => $token]);

// Display test credentials
echo "\n✅ Test Order Created Successfully!\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "📦 Order Number: {$order->order_number}\n";
echo "📧 Email: {$user->email}\n";
echo "🔢 Tracking Number: {$order->tracking_number}\n";
echo "🔗 Direct Tracking URL:\n   {$trackingUrl}\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
```

### Step 3: Test the Tracking System

#### Option A: Search by Order Number + Email
1. Visit: `http://your-domain.test/track-order`
2. Select "Order Number + Email" tab
3. Enter the order number from above
4. Enter email: `test@example.com`
5. Click "Track Order"

#### Option B: Search by Tracking Number
1. Visit: `http://your-domain.test/track-order`
2. Select "Tracking Number" tab
3. Enter the tracking number from above
4. Click "Track Shipment"

#### Option C: Direct Link
1. Use the tracking URL from tinker output
2. Paste directly into browser
3. No search needed!

### Step 4: Verify Features

On the tracking page, you should see:

✅ **Progress Tracker**
- 4-step progress visualization
- Current status highlighted (In Transit)
- Animated progress bar showing ~75% complete

✅ **Delivery Countdown**
- Real-time countdown timer
- Animated circular progress ring
- Estimated delivery date

✅ **Shipment Card**
- Vendor information
- Tracking number with copy button
- FedEx carrier details
- Product items with quantities
- Progress bar

✅ **Tracking Timeline**
- 4 tracking events displayed
- Latest event highlighted in blue
- Timestamps and locations
- Icons for each status

✅ **Order Summary Sidebar**
- Order total: $99.99
- Payment method: Stripe
- Payment status: PAID
- Shipping address

✅ **Interactive Features**
- Share button (copies link)
- Get Updates button (shows subscription form)
- Copy tracking link
- Auto-refresh toggle

## 🎨 Visual Features to Notice

### Animations
- Progress bar fills from 0% to current percentage
- Countdown timer updates every second
- Latest event has pulse animation
- Hover effects on buttons and cards

### Color Coding
- **Blue** - In transit, current status
- **Green** - Delivered, completed
- **Yellow** - Processing, pending
- **Red** - Exceptions, cancelled
- **Gray** - Past events

### Responsive Design
- Desktop: 3-column layout (timeline, countdown, sidebar)
- Tablet: 2-column layout
- Mobile: Single column, stacked

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select iPhone/Android device
4. Navigate to tracking page
5. Verify responsive layout

## 🧪 Additional Test Scenarios

### Test Delivered Order
```php
$order->update([
    'status' => 'delivered',
    'delivered_at' => now()->subDays(2),
]);
$shipment->update([
    'status' => 'delivered',
    'delivered_at' => now()->subDays(2),
]);
```
Result: Green "Package Delivered!" message, 100% progress

### Test Cancelled Order
```php
$order->update(['status' => 'cancelled']);
```
Result: Red alert box with cancellation message

### Test Multiple Shipments
```php
// Create second vendor and shipment
$vendor2 = \App\Models\Vendor::factory()->create();
$shipment2 = \App\Models\OrderShipment::create([
    'order_id' => $order->id,
    'vendor_id' => $vendor2->id,
    'tracking_number' => 'SHIP-' . rand(100000, 999999),
    'shipping_carrier' => 'ups',
    'status' => 'shipped',
    'shipped_at' => now()->subDay(),
]);
```
Result: Two shipment cards displayed

### Test Subscription
1. Click "Get Updates" button
2. Enter email: `notifications@test.com`
3. Check "Email notifications"
4. Click "Subscribe to Updates"
5. Verify success message appears
6. Check database: `select * from tracking_subscriptions;`

## 🔍 Debugging

### Check Routes
```bash
php artisan route:list --name=track-order
```

Expected output:
```
track-order.index       | GET    | track-order
track-order.search      | POST   | track-order/search
track-order.show        | GET    | track-order/{token}
track-order.subscribe   | POST   | track-order/{token}/subscribe
track-order.unsubscribe | GET    | track-order/unsubscribe/{token}
```

### Check Database
```bash
php artisan tinker
```

```php
// Verify tables exist
\DB::table('tracking_tokens')->count();
\DB::table('tracking_subscriptions')->count();
\DB::table('tracking_views')->count();

// Check tracking data
$order = \App\Models\Order::where('order_number', 'LIKE', 'ORD-TEST-%')->first();
$order->shipments;
$order->trackingTokens;
```

### Check Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Laravel Logs
```bash
tail -f storage/logs/laravel.log
```

## ✨ Pro Tips

1. **Test with Different Order Statuses**
   - pending, processing, shipped, in_transit, delivered, cancelled

2. **Test Edge Cases**
   - No tracking number
   - No shipments
   - Empty timeline
   - Expired token (set expires_at in past)

3. **Performance Testing**
   - Create 1000+ tracking views
   - Check page load time
   - Verify caching works (5-minute TTL)

4. **Browser Testing**
   - Chrome ✅
   - Firefox ✅
   - Safari ✅
   - Edge ✅
   - Mobile browsers ✅

## 🎯 Expected Results

After following this guide, you should have:

✅ A fully functional tracking search page
✅ Beautiful tracking details page with all features
✅ Test order with complete tracking data
✅ Working share and subscribe features
✅ Responsive design across all devices
✅ Real-time countdown timer
✅ Animated progress indicators

## 📞 Troubleshooting

**Issue: Page not loading**
- Run `npm run build` or `npm run dev`
- Clear browser cache
- Check Laravel logs

**Issue: Data not showing**
- Verify order exists in database
- Check relationships are loaded
- Clear application cache

**Issue: Token invalid**
- Check token hasn't expired
- Verify token exists in database
- Try generating new token

**Issue: Styles not applying**
- Run `npm run build`
- Clear browser cache
- Check Tailwind is compiling

---

**Ready to test!** 🚀

For detailed documentation, see `TRACKING_SYSTEM_GUIDE.md`
