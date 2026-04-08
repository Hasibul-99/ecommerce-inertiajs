<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportExport;

class ReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Display the main analytics dashboard.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function dashboard(Request $request)
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        // Get all reports for dashboard
        $salesReport = $this->reportService->getSalesReport($from, $to);
        $ordersReport = $this->reportService->getOrdersReport($from, $to);
        $productsReport = $this->reportService->getProductsReport($from, $to);
        $vendorsReport = $this->reportService->getVendorsReport($from, $to);
        $customersReport = $this->reportService->getCustomersReport($from, $to);

        return Inertia::render('Admin/Reports/Dashboard', [
            'dateRange' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'metrics' => [
                'revenue' => $salesReport['total_revenue'],
                'revenue_cents' => $salesReport['total_revenue_cents'],
                'orders' => $ordersReport['total_orders'],
                'customers' => $customersReport['total_customers'],
                'vendors' => $vendorsReport['total_vendors'],
                'avg_order_value' => $salesReport['avg_order_value'],
                'success_rate' => $ordersReport['success_rate'],
            ],
            'charts' => [
                'revenue_trend' => $salesReport['daily_trend'],
                'orders_trend' => $ordersReport['daily_trend'],
                'orders_by_status' => $ordersReport['by_status'],
            ],
            'top_products' => $productsReport['top_products']->take(10),
            'top_vendors' => $vendorsReport['vendor_performance']->take(10),
        ]);
    }

    /**
     * Display detailed sales reports.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function sales(Request $request)
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        $filters = $request->only(['vendor_id', 'payment_method']);

        $report = $this->reportService->getSalesReport($from, $to, $filters);

        return Inertia::render('Admin/Reports/Sales', [
            'dateRange' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'filters' => $filters,
            'report' => $report,
        ]);
    }

    /**
     * Display order analytics.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function orders(Request $request)
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        $filters = $request->only(['status', 'payment_method']);

        $ordersReport = $this->reportService->getOrdersReport($from, $to, $filters);
        $codReport = $this->reportService->getCodReport($from, $to);

        return Inertia::render('Admin/Reports/Orders', [
            'dateRange' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'filters' => $filters,
            'report' => $ordersReport,
            'codReport' => $codReport,
        ]);
    }

    /**
     * Display product performance.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function products(Request $request)
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        $filters = $request->only(['category_id']);

        $report = $this->reportService->getProductsReport($from, $to, $filters);

        return Inertia::render('Admin/Reports/Products', [
            'dateRange' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'filters' => $filters,
            'report' => $report,
        ]);
    }

    /**
     * Display vendor performance.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function vendors(Request $request)
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        $report = $this->reportService->getVendorsReport($from, $to);

        return Inertia::render('Admin/Reports/Vendors', [
            'dateRange' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'report' => $report,
        ]);
    }

    /**
     * Display customer analytics.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function customers(Request $request)
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        $report = $this->reportService->getCustomersReport($from, $to);

        return Inertia::render('Admin/Reports/Customers', [
            'dateRange' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'report' => $report,
        ]);
    }

    /**
     * Export reports to CSV/Excel.
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:sales,orders,products,vendors,customers,cod',
            'format' => 'required|in:csv,xlsx',
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $type = $request->input('type');
        $format = $request->input('format');
        $from = Carbon::parse($request->input('from'));
        $to = Carbon::parse($request->input('to'));
        $filters = $request->only(['vendor_id', 'payment_method', 'status', 'category_id']);

        // Get the appropriate report data
        $reportData = match($type) {
            'sales' => $this->reportService->getSalesReport($from, $to, $filters),
            'orders' => $this->reportService->getOrdersReport($from, $to, $filters),
            'products' => $this->reportService->getProductsReport($from, $to, $filters),
            'vendors' => $this->reportService->getVendorsReport($from, $to, $filters),
            'customers' => $this->reportService->getCustomersReport($from, $to, $filters),
            'cod' => $this->reportService->getCodReport($from, $to),
        };

        $fileName = "{$type}_report_{$from->format('Y-m-d')}_to_{$to->format('Y-m-d')}.{$format}";

        return Excel::download(
            new ReportExport($type, $reportData),
            $fileName,
            $format === 'csv' ? \Maatwebsite\Excel\Excel::CSV : \Maatwebsite\Excel\Excel::XLSX
        );
    }

    /**
     * Clear report cache.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearCache()
    {
        $this->reportService->clearCache();

        return response()->json([
            'success' => true,
            'message' => 'Report cache cleared successfully',
        ]);
    }
}
