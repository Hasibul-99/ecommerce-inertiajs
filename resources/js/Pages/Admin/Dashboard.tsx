import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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

interface AdminStats {
  totalGmv: number;
  activeVendors: number;
  pendingVendors: number;
  pendingPayouts: number;
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
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Admin Dashboard</h2>}
    >
      <Head title="Admin Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total GMV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalGmv)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingPayouts}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="vendors" className="w-full">
            <TabsList>
              <TabsTrigger value="vendors">Vendor Approvals</TabsTrigger>
              <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vendors" className="space-y-4">
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
                                  <Button size="sm" variant="outline">View</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Vendor Details</DialogTitle>
                                    <DialogDescription>
                                      Review vendor information before making a decision.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <h3 className="font-medium">Vendor: {vendor.name}</h3>
                                    <p className="text-sm text-gray-500">Owner: {vendor.user.name}</p>
                                    <p className="text-sm text-gray-500">Email: {vendor.user.email}</p>
                                    <p className="text-sm text-gray-500">Applied on: {new Date(vendor.created_at).toLocaleDateString()}</p>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" type="button">
                                      Reject
                                    </Button>
                                    <Button type="button">
                                      Approve
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" variant="default">Approve</Button>
                              <Button size="sm" variant="outline">Reject</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No pending vendor approvals.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <Link href={route('admin.vendors.index')}>View All Vendors</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="payouts" className="space-y-4">
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
                          <TableCell>{formatCurrency(payout.amount_cents)}</TableCell>
                          <TableCell>{payout.payment_method}</TableCell>
                          <TableCell>{new Date(payout.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(payout.status)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm">Mark Paid</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Payout</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to mark this payout as paid?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p><strong>Vendor:</strong> {payout.vendor.name}</p>
                                  <p><strong>Amount:</strong> {formatCurrency(payout.amount_cents)}</p>
                                  <p><strong>Payment Method:</strong> {payout.payment_method}</p>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" type="button">
                                    Cancel
                                  </Button>
                                  <Button type="button">
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
                        <TableCell colSpan={7} className="text-center py-4">
                          No pending payout requests.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}