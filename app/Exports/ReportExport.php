<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Illuminate\Support\Collection;

class ReportExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
    protected string $type;
    protected array $data;

    public function __construct(string $type, array $data)
    {
        $this->type = $type;
        $this->data = $data;
    }

    /**
     * Get the data collection for export.
     *
     * @return Collection
     */
    public function collection()
    {
        return match($this->type) {
            'sales' => $this->getSalesCollection(),
            'orders' => $this->getOrdersCollection(),
            'products' => $this->getProductsCollection(),
            'vendors' => $this->getVendorsCollection(),
            'customers' => $this->getCustomersCollection(),
            'cod' => $this->getCodCollection(),
            default => collect([]),
        };
    }

    /**
     * Get headings for the export.
     *
     * @return array
     */
    public function headings(): array
    {
        return match($this->type) {
            'sales' => [
                'Date',
                'Revenue (USD)',
                'Orders Count',
                'Average Order Value (USD)',
            ],
            'orders' => [
                'Date',
                'Total Orders',
                'Delivered',
                'Failed/Cancelled',
                'Success Rate (%)',
            ],
            'products' => [
                'Product ID',
                'Product Name',
                'Units Sold',
                'Revenue (USD)',
            ],
            'vendors' => [
                'Vendor ID',
                'Vendor Name',
                'Orders Count',
                'Products Count',
                'Revenue (USD)',
                'Commission (USD)',
                'Fulfillment Rate (%)',
            ],
            'customers' => [
                'Customer ID',
                'Customer Name',
                'Email',
                'Orders Count',
                'Total Spent (USD)',
                'Average Order Value (USD)',
            ],
            'cod' => [
                'Date',
                'COD Orders',
                'Prepaid Orders',
                'COD Revenue (USD)',
                'Prepaid Revenue (USD)',
            ],
            default => [],
        };
    }

    /**
     * Map the data for each row.
     *
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        return match($this->type) {
            'sales' => [
                $row['date'] ?? '',
                $row['revenue'] ?? 0,
                $row['orders_count'] ?? 0,
                isset($row['revenue'], $row['orders_count']) && $row['orders_count'] > 0
                    ? round($row['revenue'] / $row['orders_count'], 2)
                    : 0,
            ],
            'orders' => [
                $row['date'] ?? '',
                $row['count'] ?? 0,
                $row['delivered'] ?? 0,
                $row['failed'] ?? 0,
                isset($row['delivered'], $row['count']) && $row['count'] > 0
                    ? round(($row['delivered'] / $row['count']) * 100, 2)
                    : 0,
            ],
            'products' => [
                $row['product_id'] ?? '',
                $row['product_name'] ?? '',
                $row['units_sold'] ?? 0,
                $row['revenue'] ?? 0,
            ],
            'vendors' => [
                $row['vendor_id'] ?? '',
                $row['vendor_name'] ?? '',
                $row['orders_count'] ?? 0,
                $row['products_count'] ?? 0,
                $row['revenue'] ?? 0,
                $row['commission'] ?? 0,
                $row['fulfillment_rate'] ?? 0,
            ],
            'customers' => [
                $row['customer_id'] ?? '',
                $row['customer_name'] ?? '',
                $row['customer_email'] ?? '',
                $row['orders_count'] ?? 0,
                $row['total_spent'] ?? 0,
                $row['avg_order_value'] ?? 0,
            ],
            'cod' => [
                $row['date'] ?? '',
                $row['cod_orders'] ?? 0,
                $row['prepaid_orders'] ?? 0,
                $row['cod_revenue'] ?? 0,
                $row['prepaid_revenue'] ?? 0,
            ],
            default => [],
        };
    }

    /**
     * Get the sheet title.
     *
     * @return string
     */
    public function title(): string
    {
        return ucfirst($this->type) . ' Report';
    }

    /**
     * Get sales data collection.
     *
     * @return Collection
     */
    protected function getSalesCollection(): Collection
    {
        return collect($this->data['daily_trend'] ?? []);
    }

    /**
     * Get orders data collection.
     *
     * @return Collection
     */
    protected function getOrdersCollection(): Collection
    {
        return collect($this->data['daily_trend'] ?? []);
    }

    /**
     * Get products data collection.
     *
     * @return Collection
     */
    protected function getProductsCollection(): Collection
    {
        return collect($this->data['top_products'] ?? []);
    }

    /**
     * Get vendors data collection.
     *
     * @return Collection
     */
    protected function getVendorsCollection(): Collection
    {
        return collect($this->data['vendor_performance'] ?? []);
    }

    /**
     * Get customers data collection.
     *
     * @return Collection
     */
    protected function getCustomersCollection(): Collection
    {
        return collect($this->data['top_customers'] ?? []);
    }

    /**
     * Get COD data collection.
     *
     * @return Collection
     */
    protected function getCodCollection(): Collection
    {
        return collect($this->data['daily_comparison'] ?? []);
    }
}
