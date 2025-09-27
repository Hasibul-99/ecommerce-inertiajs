import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { 
  FiEye, 
  FiEdit, 
  FiSearch, 
  FiFilter, 
  FiDollarSign, 
  FiShoppingCart, 
  FiTruck, 
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPackage,
  FiUser,
  FiCalendar,
  FiDownload
} from 'react-icons/fi';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Transaction {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  shipping_address: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

interface Props extends PageProps {
  transactions: {
    data: Transaction[];
    links: any[];
    meta: any;
  };
  filters: {
    search?: string;
    status?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
  };
  stats: {
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    completed_orders: number;
  };
}

export default function TransactionsIndex({ auth, transactions, filters, stats }: Props) {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(filters.payment_status || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.transactions.index'), { 
      search: searchTerm,
      status: statusFilter,
      payment_status: paymentStatusFilter
    }, { preserveState: true });
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsDialog(true);
  };

  const handleStatusUpdate = (transactionId: number, newStatus: string) => {
    // Handle status update logic here
    console.log('Updating transaction status:', transactionId, newStatus);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentStatusFilter('');
    router.get(route('admin.transactions.index'));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: FiClock, color: 'text-yellow-600' },
      processing: { variant: 'default' as const, icon: FiPackage, color: 'text-blue-600' },
      shipped: { variant: 'default' as const, icon: FiTruck, color: 'text-purple-600' },
      delivered: { variant: 'default' as const, icon: FiCheckCircle, color: 'text-green-600' },
      cancelled: { variant: 'destructive' as const, icon: FiXCircle, color: 'text-red-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, color: 'text-yellow-600' },
      paid: { variant: 'default' as const, color: 'text-green-600' },
      failed: { variant: 'destructive' as const, color: 'text-red-600' },
      refunded: { variant: 'outline' as const, color: 'text-gray-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge variant={config.variant}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Transactions & Orders</h2>}
    >
      <Head title="Transactions & Orders" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_orders || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FiShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(stats?.total_revenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FiDollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.pending_orders || 0}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FiClock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.completed_orders || 0}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FiCheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FiShoppingCart className="w-5 h-5" />
                  Orders & Transactions
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FiDownload className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-6 space-y-4">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by order number, customer name, or email..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    className="flex h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentStatusFilter(e.target.value)}
                    className="flex h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <Button type="submit" variant="outline">
                    <FiSearch className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="outline" onClick={resetFilters}>
                    <FiFilter className="w-4 h-4" />
                  </Button>
                </form>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.data && transactions.data.length > 0 ? (
                      transactions.data.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {transaction.order_number}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.customer_name}</p>
                              <p className="text-sm text-gray-500">{transaction.customer_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">
                              ${transaction.total_amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(transaction.payment_status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <FiCalendar className="w-3 h-3" />
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(transaction)}
                                className="flex items-center gap-1"
                              >
                                <FiEye className="w-3 h-3" />
                                View
                              </Button>
                              <select
                                value={transaction.status}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusUpdate(transaction.id, e.target.value)}
                                className="text-xs border rounded px-2 py-1"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Order Details Dialog */}
          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FiShoppingCart className="w-5 h-5" />
                  Order Details - {selectedTransaction?.order_number}
                </DialogTitle>
                <DialogDescription>
                  Complete order information and items
                </DialogDescription>
              </DialogHeader>
              
              {selectedTransaction && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FiUser className="w-4 h-4" />
                          Customer Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium">Name</Label>
                          <p>{selectedTransaction.customer_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <p>{selectedTransaction.customer_email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Shipping Address</Label>
                          <p className="text-sm">{selectedTransaction.shipping_address}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FiPackage className="w-4 h-4" />
                          Order Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium">Order Number</Label>
                          <p>{selectedTransaction.order_number}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Status</Label>
                          <div className="mt-1">
                            {getStatusBadge(selectedTransaction.status)}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Payment Status</Label>
                          <div className="mt-1">
                            {getPaymentStatusBadge(selectedTransaction.payment_status)}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Payment Method</Label>
                          <p>{selectedTransaction.payment_method}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Order Date</Label>
                          <p>{new Date(selectedTransaction.created_at).toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTransaction.items?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.product_name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.price.toFixed(2)}</TableCell>
                              <TableCell>${item.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} className="font-semibold text-right">
                              Total Amount:
                            </TableCell>
                            <TableCell className="font-bold text-lg">
                              ${selectedTransaction.total_amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
}