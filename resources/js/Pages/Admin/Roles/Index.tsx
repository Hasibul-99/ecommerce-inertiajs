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
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiShield, FiUsers, FiSettings, FiLock } from 'react-icons/fi';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: Permission[];
  users_count: number;
  created_at: string;
  updated_at: string;
}

interface Props extends PageProps {
  auth: {
    user: User;
  };
  roles: Role[];
  permissions: Permission[];
}

export default function RolesIndex({ auth, roles, permissions }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // Mock data for demonstration
  const mockRoles: Role[] = [
    {
      id: 1,
      name: 'Super Admin',
      guard_name: 'web',
      permissions: [
        { id: 1, name: 'manage_users', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' },
        { id: 2, name: 'manage_products', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' },
        { id: 3, name: 'manage_orders', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' }
      ],
      users_count: 2,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z'
    },
    {
      id: 2,
      name: 'Admin',
      guard_name: 'web',
      permissions: [
        { id: 2, name: 'manage_products', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' },
        { id: 3, name: 'manage_orders', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' }
      ],
      users_count: 5,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z'
    },
    {
      id: 3,
      name: 'Editor',
      guard_name: 'web',
      permissions: [
        { id: 2, name: 'manage_products', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' }
      ],
      users_count: 8,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z'
    }
  ];

  const mockPermissions: Permission[] = [
    { id: 1, name: 'manage_users', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' },
    { id: 2, name: 'manage_products', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' },
    { id: 3, name: 'manage_orders', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' },
    { id: 4, name: 'manage_coupons', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' },
    { id: 5, name: 'view_reports', guard_name: 'web', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' }
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleCreateRole = () => {
    setShowCreateDialog(false);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions.map(p => p.id));
    setShowEditDialog(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteDialog(true);
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const formatPermissionName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
      <AuthenticatedLayout
        user={{
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          email_verified_at: new Date().toISOString()
        }}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Roles & Permissions</h2>}
      >
        <Head title="Roles & Permissions" />

        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Roles & Permissions</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage user roles and their permissions</p>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <FiPlus className="w-4 h-4" />
                    Create Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>Create a new role and assign permissions</DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label>Role Name</Label>
                      <Input />
                    </div>
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto border rounded-md p-4">
                        {mockPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`permission-${permission.id}`}
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                              {formatPermissionName(permission.name)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateRole}>Create Role</Button>
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
                    <FiShield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Roles</p>
                    <p className="text-2xl font-bold text-gray-900">{mockRoles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiLock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Permissions</p>
                    <p className="text-2xl font-bold text-gray-900">{mockPermissions.length}</p>
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
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockRoles.reduce((sum, role) => sum + role.users_count, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FiSettings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Roles</p>
                    <p className="text-2xl font-bold text-gray-900">{mockRoles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiShield className="w-5 h-5" />
                Search Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search roles..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                  <Button onClick={handleSearch}>
                    Search
                  </Button>
                </div>
            </CardContent>
          </Card>

          {/* Roles Table */}
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRoles && mockRoles.length > 0 ? (
                      mockRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-blue-100 rounded-md">
                                <FiShield className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{role.name}</div>
                                <div className="text-sm text-gray-500">Guard: {role.guard_name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.slice(0, 3).map((permission) => (
                                <Badge key={permission.id} variant="outline" className="text-xs">
                                  {formatPermissionName(permission.name)}
                                </Badge>
                              ))}
                              {role.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <FiUsers className="w-4 h-4 text-gray-400" />
                              <span>{role.users_count}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-500">
                              {formatDate(role.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRole(role)}
                              >
                                <FiEdit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRole(role)}
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
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <FiShield className="w-12 h-12 text-gray-400" />
                            <p className="text-gray-500">No roles found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Role Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogDescription>Update role information and permissions</DialogDescription>
              </DialogHeader>
              {selectedRole && (
                <form className="space-y-4">
                   <div className="space-y-2">
                     <Label>Role Name</Label>
                     <input
                       type="text"
                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                       defaultValue={selectedRole.name}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Permissions</Label>
                     <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto border rounded-md p-4">
                       {mockPermissions.map((permission) => (
                         <div key={permission.id} className="flex items-center space-x-2">
                           <input
                             type="checkbox"
                             id={`edit-permission-${permission.id}`}
                             checked={selectedPermissions.includes(permission.id)}
                             onChange={() => handlePermissionToggle(permission.id)}
                             className="rounded border-gray-300"
                           />
                           <Label htmlFor={`edit-permission-${permission.id}`} className="text-sm">
                             {formatPermissionName(permission.name)}
                           </Label>
                         </div>
                       ))}
                     </div>
                   </div>
                 </form>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                <Button>Update Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Role Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Role</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this role? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              {selectedRole && (
                <div className="py-4">
                  <p className="text-sm text-gray-600">
                    Role: <span className="font-medium">{selectedRole.name}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Users with this role: <span className="font-medium">{selectedRole.users_count}</span>
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button variant="destructive">Delete Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}