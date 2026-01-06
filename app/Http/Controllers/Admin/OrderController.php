<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatus as OrderStatusModel;
use App\Models\User;
use App\Services\CodOrderWorkflow;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['user', 'items'])
            ->orderBy('created_at', 'desc');
            
        // Filter by status if provided
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Filter by payment status if provided
        if ($request->has('payment_status') && $request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }
        
        // Filter by payment method if provided
        if ($request->has('payment_method') && $request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }
        
        $orders = $query->paginate(10)->withQueryString();
        
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status', 'payment_method']),
            'statuses' => [
                'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
            ],
            'paymentStatuses' => [
                'pending', 'paid', 'refunded', 'failed'
            ],
            'paymentMethods' => [
                'credit_card', 'paypal', 'bank_transfer', 'cod'
            ],
        ]);
    }
    
    /**
     * Display the specified order.
     *
     * @param  \App\Models\Order  $order
     * @return \Inertia\Response
     */
    public function show(Order $order)
    {
        $order->load([
            'items.product',
            'shippingAddress',
            'billingAddress',
            'user',
            'deliveryPerson',
            'codCollector',
            'statuses.user',
        ]);

        // Get workflow state for COD orders
        $workflowState = null;
        if ($order->isCod()) {
            $workflow = new CodOrderWorkflow();
            $workflowState = $workflow->getWorkflowState($order);
        }

        // Get activity logs
        $activityLogs = ActivityLogService::getActivitiesFor($order);

        // Get available delivery persons (users with delivery role)
        $deliveryPersons = User::whereHas('roles', function ($query) {
            $query->where('name', 'delivery_person');
        })->get(['id', 'name', 'email']);

        // If no specific delivery role, get all users (for demo)
        if ($deliveryPersons->isEmpty()) {
            $deliveryPersons = User::limit(20)->get(['id', 'name', 'email']);
        }

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'workflowState' => $workflowState,
            'activityLogs' => $activityLogs,
            'deliveryPersons' => $deliveryPersons,
        ]);
    }
    
    /**
     * Update the order status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled,refunded',
            'comment' => 'nullable|string|max:500',
        ]);
        
        $order->update([
            'status' => $request->status,
        ]);
        
        // Create order status history
        OrderStatusModel::create([
            'order_id' => $order->id,
            'user_id' => Auth::id(),
            'status' => $request->status,
            'comment' => $request->comment,
        ]);

        // Log activity
        ActivityLogService::log(
            'status_updated',
            'order',
            $order,
            [
                'old_status' => $order->getOriginal('status'),
                'new_status' => $request->status,
                'comment' => $request->comment,
            ]
        );

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }
    
    /**
     * Mark a Cash on Delivery order as paid.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsPaid(Order $order)
    {
        // Verify this is a COD order
        if ($order->payment_method !== 'cod') {
            return redirect()->back()->with('error', 'Only Cash on Delivery orders can be marked as paid using this method.');
        }
        
        // Update payment status
        $order->update([
            'payment_status' => 'paid',
            'status' => 'processing', // Update order status to processing after payment
        ]);
        
        // Create order status history
        OrderStatusModel::create([
            'order_id' => $order->id,
            'user_id' => Auth::id(),
            'status' => 'processing',
            'comment' => 'Cash on Delivery payment received and marked as paid.',
        ]);

        // Log activity
        ActivityLogService::log(
            'marked_as_paid',
            'cod_order',
            $order,
            ['payment_method' => 'cod']
        );

        return redirect()->back()->with('success', 'Order marked as paid successfully.');
    }

    /**
     * Confirm a COD order.
     *
     * @param Request $request
     * @param Order $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function confirmOrder(Request $request, Order $order)
    {
        $request->validate([
            'comment' => 'nullable|string|max:500',
        ]);

        $workflow = new CodOrderWorkflow();
        $result = $workflow->confirmOrder($order, $request->comment);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    /**
     * Start processing a COD order.
     *
     * @param Request $request
     * @param Order $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function startProcessing(Request $request, Order $order)
    {
        $request->validate([
            'comment' => 'nullable|string|max:500',
        ]);

        $workflow = new CodOrderWorkflow();
        $result = $workflow->startProcessing($order, $request->comment);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    /**
     * Assign delivery person to order.
     *
     * @param Request $request
     * @param Order $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function assignDeliveryPerson(Request $request, Order $order)
    {
        $request->validate([
            'delivery_person_id' => 'required|exists:users,id',
        ]);

        $success = $order->assignDeliveryPerson($request->delivery_person_id);

        if ($success) {
            ActivityLogService::log(
                'delivery_person_assigned',
                'cod_order',
                $order,
                ['delivery_person_id' => $request->delivery_person_id]
            );

            return redirect()->back()->with('success', 'Delivery person assigned successfully.');
        }

        return redirect()->back()->with('error', 'Failed to assign delivery person.');
    }

    /**
     * Mark order as out for delivery.
     *
     * @param Request $request
     * @param Order $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markOutForDelivery(Request $request, Order $order)
    {
        $request->validate([
            'delivery_person_id' => 'required|exists:users,id',
            'comment' => 'nullable|string|max:500',
        ]);

        $workflow = new CodOrderWorkflow();
        $result = $workflow->markOutForDelivery(
            $order,
            $request->delivery_person_id,
            $request->comment
        );

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    /**
     * Confirm COD collection and mark order as delivered.
     *
     * @param Request $request
     * @param Order $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function confirmCodCollection(Request $request, Order $order)
    {
        $request->validate([
            'amount_collected_cents' => 'required|integer|min:0',
            'collected_by' => 'nullable|exists:users,id',
            'comment' => 'nullable|string|max:500',
        ]);

        $workflow = new CodOrderWorkflow();
        $result = $workflow->confirmCodCollection(
            $order,
            $request->amount_collected_cents,
            $request->collected_by,
            $request->comment
        );

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    /**
     * Handle delivery failure.
     *
     * @param Request $request
     * @param Order $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleDeliveryFailure(Request $request, Order $order)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
            'attempt_number' => 'required|integer|min:1|max:10',
            'reschedule' => 'required|boolean',
        ]);

        $workflow = new CodOrderWorkflow();
        $result = $workflow->handleDeliveryFailure(
            $order,
            $request->reason,
            $request->attempt_number,
            $request->reschedule
        );

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    /**
     * Complete a COD order.
     *
     * @param Request $request
     * @param Order $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function completeOrder(Request $request, Order $order)
    {
        $request->validate([
            'comment' => 'nullable|string|max:500',
        ]);

        $workflow = new CodOrderWorkflow();
        $result = $workflow->completeOrder($order, $request->comment);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    /**
     * Cancel an order.
     *
     * @param Request $request
     * @param Order $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancelOrder(Request $request, Order $order)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
            'comment' => 'nullable|string|max:500',
        ]);

        $workflow = new CodOrderWorkflow();
        $result = $workflow->cancelOrder($order, $request->reason, $request->comment);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }
}