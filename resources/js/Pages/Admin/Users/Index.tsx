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
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
}

interface Props extends PageProps {
  users: {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  roles: Role[];
  filters: {
    search?: string;
    role?: string;
    status?: string;
  };
}

export default function UsersIndex({ auth, users, roles, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedRole, setSelectedRole] = useState(filters.role || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = () => {
    router.get(route('admin.users.index'), {
      search: searchTerm,
      role: selectedRole,
      status: selectedStatus,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedStatus('');
    router.get(route('admin.users.index'), {}, {
      preserveState: true,
      replace: true,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'vendor':
        return <Badge className="bg-blue-100 text-blue-800">Vendor</Badge>;
      case 'customer':
        return <Badge className="bg-emerald-100 text-emerald-800">Customer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      router.delete(route('admin.users.destroy', userId));
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">User Management</h2>}
    >
      <Head title="User Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header with Create Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Users</h3>
              <p className="text-sm text-gray-600">Manage system users, roles, and permissions</p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FiPlus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system with appropriate role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input type="email" placeholder="Enter email address" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" placeholder="Enter password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input type="password" placeholder="Confirm password" />
                  </div>
                </form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="min-w-[150px]">
                  <Label htmlFor="role-filter">Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[150px]">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSearch}>
                    <FiFilter className="mr-2 h-4 w-4" />
                    Apply
                  </Button>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Email Verified</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.data && users.data.length > 0 ? (
                      users.data.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            {user.email_verified_at ? (
                              <Badge className="bg-green-100 text-green-800">Verified</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">Unverified</Badge>
                            )}
                          </TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <FiEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {users.last_page > 1 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing {((users.current_page - 1) * users.per_page) + 1} to {Math.min(users.current_page * users.per_page, users.total)} of {users.total} results
              </div>
              <div className="flex space-x-2">
                {users.current_page > 1 && (
                  <Button variant="outline" asChild>
                    <Link href={route('admin.users.index', { ...filters, page: users.current_page - 1 })}>
                      Previous
                    </Link>
                  </Button>
                )}
                {users.current_page < users.last_page && (
                  <Button variant="outline" asChild>
                    <Link href={route('admin.users.index', { ...filters, page: users.current_page + 1 })}>
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user information and permissions.
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input defaultValue={selectedUser.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input type="email" defaultValue={selectedUser.email} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select defaultValue={selectedUser.role}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select defaultValue={selectedUser.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}