import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, User } from '@/types/index';
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

interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_amount?: number;
  maximum_discount?: number;
  usage_limit?: number;
  used_count: number;
  status: string;
  starts_at?: string;
  expires_at?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

interface Props extends PageProps {
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
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minimum_amount: '',
    maximum_discount: '',
    usage_limit: '',
    starts_at: '',
    expires_at: ''
  });

  // Use actual coupons data from the backend
  const displayCoupons = coupons || [];

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleCreateCoupon = () => {
    router.post(route('admin.coupons.store'), {
      ...formData,
      value: Number(formData.value)
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({
          code: '',
          name: '',
          description: '',
          type: 'percentage',
          value: 0,
          minimum_amount: '',
          maximum_discount: '',
          usage_limit: '',
          starts_at: '',
          expires_at: ''
        });
      },
      onError: (errors) => {
        console.error('Error creating coupon:', errors);
      }
    });
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minimum_amount: coupon.minimum_amount?.toString() || '',
      maximum_discount: coupon.maximum_discount?.toString() || '',
      usage_limit: coupon.usage_limit?.toString() || '',
      starts_at: coupon.starts_at || '',
      expires_at: coupon.expires_at || ''
    });
    setShowEditDialog(true);
  };

  const handleUpdateCoupon = () => {
    if (!selectedCoupon) return;
    
    router.put(route('admin.coupons.update', selectedCoupon.id), {
      ...formData,
      value: Number(formData.value)
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedCoupon(null);
        setFormData({
          code: '',
          name: '',
          description: '',
          type: 'percentage',
          value: 0,
          minimum_amount: '',
          maximum_discount: '',
          usage_limit: '',
          starts_at: '',
          expires_at: ''
        });
      },
      onError: (errors) => {
        console.error('Error updating coupon:', errors);
      }
    });
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    if (confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      router.delete(route('admin.coupons.destroy', coupon.id), {
        onError: (errors) => {
          console.error('Error deleting coupon:', errors);
        }
      });
    }
  };

  const handleToggleStatus = (coupon: Coupon) => {
    const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
    router.patch(route('admin.coupons.toggle-status', coupon.id), { status: newStatus }, {
      onError: (errors) => {
        console.error('Error toggling coupon status:', errors);
      }
    });
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
      inactive: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.inactive;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
                      <Input 
                        placeholder="Enter coupon code" 
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Coupon Name</Label>
                      <Input 
                        placeholder="Enter coupon name" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea 
                      className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter coupon description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as 'percentage' | 'fixed' })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Value</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Minimum Amount</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={formData.minimum_amount}
                        onChange={(e) => setFormData({ ...formData, minimum_amount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Usage Limit</Label>
                      <Input 
                        type="number" 
                        placeholder="Unlimited" 
                        value={formData.usage_limit}
                        onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input 
                        type="date" 
                        value={formData.starts_at}
                        onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input 
                        type="date" 
                        value={formData.expires_at}
                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      />
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
                    <p className="text-2xl font-bold text-gray-900">{displayCoupons.length}</p>
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
                      {displayCoupons.filter(c => c.status === 'active').length}
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
                      {displayCoupons.reduce((sum, c) => sum + c.used_count, 0)}
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
                      {displayCoupons.filter(c => c.status === 'expired').length}
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
                    {displayCoupons && displayCoupons.length > 0 ? (
                      displayCoupons.map((coupon) => (
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