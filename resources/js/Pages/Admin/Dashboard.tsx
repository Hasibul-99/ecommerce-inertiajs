import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Link } from '@inertiajs/react';
import SalesChart from '@/Components/Charts/SalesChart';
import DonutChart from '@/Components/Charts/DonutChart';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign, 
  FiPackage,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiCheck,
  FiX
} from 'react-icons/fi';

interface AdminStats {
  totalGmv: number;
  activeVendors: number;
  pendingVendors: number;
  pendingPayouts: number;
  totalOrders?: number;
  totalProducts?: number;
  totalUsers?: number;
  monthlyGrowth?: number;
}

interface Vendor {
  id: number;
  name: string;
  user: {
    name: string;
    email: string;
  };
  status: string;
  created_at: string;
}

interface Payout {
  id: number;
  vendor: {
    id: number;
    name: string;
  };
  amount_cents: number;
  status: string;
  created_at: string;
  payment_method: string;
}

interface Props extends PageProps {
  stats: AdminStats;
  pendingVendors: Vendor[];
  pendingPayouts: Payout[];
}

export default function AdminDashboard({ auth, stats, pendingVendors, pendingPayouts }: Props) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      approved: { variant: 'default' as const, label: 'Approved' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
      paid: { variant: 'default' as const, label: 'Paid' },
      processing: { variant: 'secondary' as const, label: 'Processing' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
            <FiActivity className="h-6 w-6" />
            Admin Dashboard
          </h2>
        </div>
      }
    >
      <Head title="Admin Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total GMV</CardTitle>
                <FiDollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{formatCurrency(stats.totalGmv)}</div>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <FiTrendingUp className="h-3 w-3" />
                  +{stats.monthlyGrowth || 12}% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Active Vendors</CardTitle>
                <FiUsers className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{stats.activeVendors}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <FiCheckCircle className="h-3 w-3" />
                  {stats.pendingVendors} pending approval
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Total Orders</CardTitle>
                <FiShoppingCart className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{stats.totalOrders || 1247}</div>
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                  <FiActivity className="h-3 w-3" />
                  +8% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Pending Payouts</CardTitle>
                <FiClock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{stats.pendingPayouts}</div>
                <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                  <FiAlertCircle className="h-3 w-3" />
                  Requires attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Statistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <FiPackage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts || 3456}</div>
                <p className="text-xs text-muted-foreground">Across all vendors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <FiUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers || 8923}</div>
                <p className="text-xs text-muted-foreground">Registered customers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <FiTrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">+0.5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiTrendingUp className="h-5 w-5" />
                  Monthly Sales
                </CardTitle>
                <CardDescription>Revenue trends over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      label: 'Sales',
                      data: [12000, 19000, 15000, 25000, 22000, 30000],
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4
                    }]
                  }}
                  title="Monthly Sales"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiUsers className="h-5 w-5" />
                  Vendor Distribution
                </CardTitle>
                <CardDescription>Active vs Pending vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={{
                    labels: ['Active Vendors', 'Pending Vendors'],
                    datasets: [{
                      data: [stats.activeVendors, stats.pendingVendors],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                      ],
                      borderColor: [
                        'rgba(34, 197, 94, 1)',
                        'rgba(239, 68, 68, 1)'
                      ],
                      borderWidth: 2
                    }]
                  }}
                  title="Vendor Status"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="vendors" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vendors" className="flex items-center gap-2">
                <FiUsers className="h-4 w-4" />
                Vendor Approvals
              </TabsTrigger>
              <TabsTrigger value="payouts" className="flex items-center gap-2">
                <FiDollarSign className="h-4 w-4" />
                Payout Requests
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vendors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiClock className="h-5 w-5" />
                    Pending Vendor Approvals
                  </CardTitle>
                  <CardDescription>
                    Review and approve new vendor applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Applied</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingVendors && pendingVendors.length > 0 ? (
                          pendingVendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                              <TableCell className="font-medium">{vendor.name}</TableCell>
                              <TableCell>{vendor.user.name}</TableCell>
                              <TableCell>{vendor.user.email}</TableCell>
                              <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                              <TableCell>{new Date(vendor.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                                        <FiEye className="h-3 w-3" />
                                        View
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Vendor Details</DialogTitle>
                                        <DialogDescription>
                                          Review vendor information before making a decision.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="py-4 space-y-3">
                                        <div>
                                          <h3 className="font-medium text-lg">{vendor.name}</h3>
                                          <p className="text-sm text-muted-foreground">Vendor Name</p>
                                        </div>
                                        <div>
                                          <p className="font-medium">{vendor.user.name}</p>
                                          <p className="text-sm text-muted-foreground">Owner Name</p>
                                        </div>
                                        <div>
                                          <p className="font-medium">{vendor.user.email}</p>
                                          <p className="text-sm text-muted-foreground">Contact Email</p>
                                        </div>
                                        <div>
                                          <p className="font-medium">{new Date(vendor.created_at).toLocaleDateString()}</p>
                                          <p className="text-sm text-muted-foreground">Application Date</p>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" type="button" className="flex items-center gap-1">
                                          <FiX className="h-3 w-3" />
                                          Reject
                                        </Button>
                                        <Button type="button" className="flex items-center gap-1">
                                          <FiCheck className="h-3 w-3" />
                                          Approve
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Button size="sm" variant="default" className="flex items-center gap-1">
                                    <FiCheck className="h-3 w-3" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <FiX className="h-3 w-3" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex flex-col items-center gap-2">
                                <FiCheckCircle className="h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">No pending vendor approvals.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href={route('admin.vendors.index')}>View All Vendors</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="payouts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiDollarSign className="h-5 w-5" />
                    Pending Payout Requests
                  </CardTitle>
                  <CardDescription>
                    Process vendor payout requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Date Requested</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingPayouts && pendingPayouts.length > 0 ? (
                          pendingPayouts.map((payout) => (
                            <TableRow key={payout.id}>
                              <TableCell className="font-medium">#{payout.id}</TableCell>
                              <TableCell>{payout.vendor.name}</TableCell>
                              <TableCell className="font-medium">{formatCurrency(payout.amount_cents)}</TableCell>
                              <TableCell>{payout.payment_method}</TableCell>
                              <TableCell>{new Date(payout.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>{getStatusBadge(payout.status)}</TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="flex items-center gap-1">
                                      <FiCheck className="h-3 w-3" />
                                      Mark Paid
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Confirm Payout</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to mark this payout as paid?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 space-y-3">
                                      <div>
                                        <p className="font-medium">{payout.vendor.name}</p>
                                        <p className="text-sm text-muted-foreground">Vendor</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">{formatCurrency(payout.amount_cents)}</p>
                                        <p className="text-sm text-muted-foreground">Amount</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">{payout.payment_method}</p>
                                        <p className="text-sm text-muted-foreground">Payment Method</p>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" type="button">
                                        Cancel
                                      </Button>
                                      <Button type="button" className="flex items-center gap-1">
                                        <FiCheck className="h-3 w-3" />
                                        Confirm Payment
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <div className="flex flex-col items-center gap-2">
                                <FiCheckCircle className="h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">No pending payout requests.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}