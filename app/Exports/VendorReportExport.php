<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class VendorReportExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
    protected string $type;
    protected array $data;

    public function __construct(string $type, array $data)
    {
        $this->type = $type;
        $this->data = $data;
    }

    public function collection()
    {
        return collect($this->getData());
    }

    public function headings(): array
    {
        return match($this->type) {
            'sales_daily' => ['Date', 'Revenue (USD)', 'Orders Count', 'Items Sold'],
            'sales_products' => ['Product', 'SKU', 'Units Sold', 'Revenue (USD)', 'Avg Price (USD)'],
            'products' => ['Product', 'SKU', 'Stock', 'Price (USD)', 'Units Sold', 'Revenue (USD)', 'Status'],
            'customers' => ['Customer', 'Email', 'Orders Count', 'Total Spent (USD)', 'Avg Order Value (USD)'],
            'customers_geo' => ['Country', 'Customers', 'Orders', 'Revenue (USD)', 'Avg per Customer (USD)'],
            default => ['Data'],
        };
    }

    public function map($row): array
    {
        return match($this->type) {
            'sales_daily' => [
                $row['date'] ?? '',
                $row['revenue'] ?? 0,
                $row['orders_count'] ?? 0,
                $row['items_sold'] ?? 0,
            ],
            'sales_products' => [
                $row['product_name'] ?? '',
                $row['sku'] ?? '',
                $row['units_sold'] ?? 0,
                $row['revenue'] ?? 0,
                $row['units_sold'] > 0 ? $row['revenue'] / $row['units_sold'] : 0,
            ],
            'products' => [
                $row['product_name'] ?? '',
                $row['sku'] ?? '',
                $row['stock'] ?? 0,
                $row['price'] ?? 0,
                $row['units_sold'] ?? 0,
                $row['revenue'] ?? 0,
                $row['status'] ?? '',
            ],
            'customers' => [
                $row['customer_name'] ?? '',
                $row['customer_email'] ?? '',
                $row['orders_count'] ?? 0,
                $row['total_spent'] ?? 0,
                $row['avg_order_value'] ?? 0,
            ],
            'customers_geo' => [
                $row['country'] ?? '',
                $row['customers_count'] ?? 0,
                $row['orders_count'] ?? 0,
                $row['revenue'] ?? 0,
                $row['customers_count'] > 0 ? $row['revenue'] / $row['customers_count'] : 0,
            ],
            default => [$row],
        };
    }

    public function title(): string
    {
        return match($this->type) {
            'sales_daily' => 'Daily Sales',
            'sales_products' => 'Product Sales',
            'products' => 'Product Performance',
            'customers' => 'Top Customers',
            'customers_geo' => 'Geographic Distribution',
            default => 'Report',
        };
    }

    protected function getData(): array
    {
        return match($this->type) {
            'sales_daily' => $this->data['revenueByDay'] ?? [],
            'sales_products' => $this->data['productPerformance'] ?? [],
            'products' => $this->data['productPerformance'] ?? [],
            'customers' => $this->data['customerInsights']['top_customers'] ?? [],
            'customers_geo' => $this->data['customerInsights']['geo_distribution'] ?? [],
            default => [],
        };
    }
}
