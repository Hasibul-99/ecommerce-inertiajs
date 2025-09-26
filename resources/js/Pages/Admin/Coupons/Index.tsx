import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiPercent, FiDollarSign, FiCalendar, FiUsers, FiTag } from 'react-icons/fi';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  role?: string;
}

interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  minimum_amount?: number;
  maximum_discount?: number;
  usage_limit?: number;
  used_count: number;
  status: 'active' | 'inactive' | 'expired';
  starts_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

interface Props extends PageProps {
  auth: {
    user: User;
  };
  coupons: Coupon[];
}

export default function CouponsIndex({ auth, coupons }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Mock data for demonstration
  const mockCoupons: Coupon[] = [
    {
      id: 1,
      code: 'WELCOME20',
      name: 'Welcome Discount',
      description: '20% off for new customers',
      type: 'percentage',
      value: 20,
      minimum_amount: 50,
      maximum_discount: 100,
      usage_limit: 1000,
      used_count: 245,
      status: 'active',
      starts_at: '2024-01-01T00:00:00Z',
      expires_at: '2024-12-31T23:59:59Z',
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z'
    },
    {
      id: 2,
      code: 'SAVE10',
      name: 'Save $10',
      description: '$10 off on orders over $100',
      type: 'fixed_amount',
      value: 10,
      minimum_amount: 100,
      usage_limit: 500,
      used_count: 89,
      status: 'active',
      starts_at: '2024-01-15T00:00:00Z',
      expires_at: '2024-06-30T23:59:59Z',
      created_at: '2024-01-15T09:00:00Z',
      updated_at: '2024-01-20T11:45:00Z'
    },
    {
      id: 3,
      code: 'EXPIRED50',
      name: 'Expired Coupon',
      description: '50% off - expired',
      type: 'percentage',
      value: 50,
      minimum_amount: 25,
      usage_limit: 100,
      used_count: 100,
      status: 'expired',
      starts_at: '2023-12-01T00:00:00Z',
      expires_at: '2023-12-31T23:59:59Z',
      created_at: '2023-12-01T08:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleCreateCoupon = () => {
    setShowCreateDialog(false);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowEditDialog(true);
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDeleteDialog(true);
  };

  const handleToggleStatus = (coupon: Coupon) => {
    console.log('Toggling status for:', coupon.code);
  };

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}%`;
    }
    return `$${coupon.value.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.inactive;
  };

  const getUsagePercentage = (used: number, limit?: number) => {
    if (!limit) return 0;
    return Math.round((used / limit) * 100);
  };

  return (
    <AuthenticatedLayout
      user={{
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        email_verified_at: new Date().toISOString(),
        role: 'admin'
      }}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Coupon Management</h2>}
    >
      <Head title="Coupon Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Coupons</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage discount coupons and promotional codes</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <FiPlus className="w-4 h-4" />
                  Create Coupon
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Coupon</DialogTitle>
                  <DialogDescription>Create a new discount coupon for your store</DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Coupon Code</Label>
                      <Input placeholder="Enter coupon code" />
                    </div>
                    <div className="space-y-2">
                      <Label>Coupon Name</Label>
                      <Input placeholder="Enter coupon name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea 
                      className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter coupon description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Value</Label>
                      <Input type="number" step="0.01" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Minimum Amount</Label>
                      <Input type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Usage Limit</Label>
                      <Input type="number" placeholder="Unlimited" />
                    </div>
                  </div>
                </form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreateCoupon}>Create Coupon</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiTag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Coupons</p>
                    <p className="text-2xl font-bold text-gray-900">{mockCoupons.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiPercent className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Coupons</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockCoupons.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FiUsers className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Uses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockCoupons.reduce((sum, c) => sum + c.used_count, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FiCalendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Expired</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockCoupons.filter(c => c.status === 'expired').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiTag className="w-5 h-5" />
                Filter Coupons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    placeholder="Search coupons..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coupons Table */}
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCoupons && mockCoupons.length > 0 ? (
                      mockCoupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-gray-100 rounded-md">
                                <FiTag className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-mono font-medium">{coupon.code}</div>
                                <div className="text-sm text-gray-500">{coupon.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{coupon.name}</div>
                              {coupon.description && (
                                <div className="text-sm text-gray-500">{coupon.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              {coupon.type === 'percentage' ? (
                                <FiPercent className="w-3 h-3" />
                              ) : (
                                <FiDollarSign className="w-3 h-3" />
                              )}
                              {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{formatValue(coupon)}</div>
                            {coupon.minimum_amount && (
                              <div className="text-sm text-gray-500">
                                Min: ${coupon.minimum_amount}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {coupon.used_count} / {coupon.usage_limit || '∞'}
                              </div>
                              {coupon.usage_limit && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${getUsagePercentage(coupon.used_count, coupon.usage_limit)}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(coupon.status)}>
                              {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {coupon.expires_at ? formatDate(coupon.expires_at) : 'No expiry'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCoupon(coupon)}
                              >
                                <FiEdit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCoupon(coupon)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <FiTag className="w-12 h-12 text-gray-400" />
                            <p className="text-gray-500">No coupons found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}