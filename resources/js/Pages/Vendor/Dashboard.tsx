import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';

interface VendorStats {
  totalSales: number;
  totalProducts: number;
  publishedProducts: number;
  pendingOrders: number;
}

interface Order {
  id: number;
  status: string;
  total_cents: number;
  created_at: string;
  user: {
    name: string;
  };
  items: Array<{
    id: number;
    product: {
      title: string;
    };
    quantity: number;
    price_cents: number;
  }>;
}

interface Vendor {
  id: number;
  name: string;
  description: string | null;
  available_balance_cents: number;
  status: string;
}

interface Props extends PageProps {
  vendor: Vendor;
  recentOrders: Order[];
  stats: VendorStats;
}

export default function VendorDashboard({ auth, vendor, recentOrders, stats }: Props) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Vendor Dashboard</h2>}
    >
      <Head title="Vendor Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sales (30d)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalSales * 100)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(vendor.available_balance_cents)}</div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#payout-form">Request Payout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.user.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{formatCurrency(order.total_cents)}</TableCell>
                        <TableCell>
                          {order.status === 'processing' && (
                            <Button size="sm" variant="outline">
                              Mark Shipped
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <Link href={route('vendor.orders')}>View All Orders</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your Products</h3>
                <Button asChild>
                  <Link href={route('vendor.products')}>Add New Product</Link>
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <Link href={route('vendor.products')}>Manage All Products</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="payouts" className="space-y-4" id="payout-form">
              <Card>
                <CardHeader>
                  <CardTitle>Request Payout</CardTitle>
                  <CardDescription>Request a payout of your available balance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Amount (USD)
                      </label>
                      <input 
                        type="number" 
                        id="amount" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="0.00"
                        min="1"
                        max={vendor.available_balance_cents / 100}
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="payment_method" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Payment Method
                      </label>
                      <select 
                        id="payment_method" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="notes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Notes (Optional)
                      </label>
                      <textarea 
                        id="notes" 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Any additional information"
                      ></textarea>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit Request</Button>
                </CardFooter>
              </Card>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Payout History</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No payout history found.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}