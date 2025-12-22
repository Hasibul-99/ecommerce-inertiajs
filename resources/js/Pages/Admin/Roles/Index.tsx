import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, User } from '@/types/index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';
import { 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiShield, 
  FiUsers, 
  FiSettings, 
  FiLock,
  FiSearch,
  FiUserCheck,
  FiKey,
  FiActivity
} from 'react-icons/fi';

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
  users_count?: number;
  created_at: string;
  updated_at: string;
}

interface Props extends PageProps {
  roles: {
    data: Role[];
    links: any[];
    meta: any;
  };
  permissions: Permission[];
  filters: {
    search?: string;
  };
}

export default function RolesIndex({ auth, roles, permissions, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'web'
  });

  // Use actual data from backend
  const displayRoles = roles?.data || [];

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleCreateRole = () => {
    const permissionNames = selectedPermissions.map(id => {
      const permission = permissions?.find(p => p.id === id);
      return permission?.name;
    }).filter(Boolean);

    router.post(route('admin.roles.store'), {
      ...formData,
      permissions: permissionNames
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ name: '', guard_name: 'web' });
        setSelectedPermissions([]);
      },
      onError: (errors) => {
        console.error('Error creating role:', errors);
      }
    });
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      guard_name: role.guard_name
    });
    setSelectedPermissions(role.permissions.map(p => p.id));
    setShowEditDialog(true);
  };

  const handleUpdateRole = () => {
    if (!selectedRole) return;
    
    const permissionNames = selectedPermissions.map(id => {
      const permission = permissions?.find(p => p.id === id);
      return permission?.name;
    }).filter(Boolean);
    
    router.put(route('admin.roles.update', selectedRole.id), {
      ...formData,
      permissions: permissionNames
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedRole(null);
        setFormData({ name: '', guard_name: 'web' });
        setSelectedPermissions([]);
      },
      onError: (errors) => {
        console.error('Error updating role:', errors);
      }
    });
  };

  const handleDeleteRole = (role: Role) => {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      router.delete(route('admin.roles.destroy', role.id), {
        onError: (errors) => {
          console.error('Error deleting role:', errors);
        }
      });
    }
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
    <AdminLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
            <FiShield className="h-6 w-6" />
            Roles & Permissions
          </h2>
        </div>
      }
    >
      <Head title="Roles & Permissions" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiShield className="h-8 w-8" />
                Roles & Permissions
              </h1>
              <p className="text-gray-600 mt-1">Manage user roles and their permissions</p>
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
                  <DialogTitle className="flex items-center gap-2">
                    <FiShield className="h-5 w-5" />
                    Create New Role
                  </DialogTitle>
                  <DialogDescription>Create a new role and assign permissions</DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label>Role Name</Label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter role name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto border rounded-md p-4">
                      {permissions?.map((permission) => (
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

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiShield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-700">Total Roles</p>
                    <p className="text-2xl font-bold text-blue-900">{displayRoles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiLock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-700">Permissions</p>
                    <p className="text-2xl font-bold text-green-900">{permissions?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FiUsers className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-700">Total Users</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {displayRoles.reduce((sum, role) => sum + (role.users_count || 0), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FiActivity className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-orange-700">Active Roles</p>
                    <p className="text-2xl font-bold text-orange-900">{displayRoles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiSearch className="h-5 w-5" />
                Search & Filter
              </CardTitle>
              <CardDescription>Find roles and permissions quickly</CardDescription>
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
                <Button onClick={handleSearch} className="flex items-center gap-2">
                  <FiSearch className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiShield className="h-5 w-5" />
                Roles Management
              </CardTitle>
              <CardDescription>Manage system roles and their permissions</CardDescription>
            </CardHeader>
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
                    {displayRoles && displayRoles.length > 0 ? (
                      displayRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-md">
                                <FiShield className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{role.name}</div>
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
                            <div className="flex items-center gap-2">
                              <FiUsers className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{role.users_count}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500">{formatDate(role.created_at)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRole(role)}
                                className="flex items-center gap-1"
                              >
                                <FiEdit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRole(role)}
                                className="text-red-600 hover:text-red-700 flex items-center gap-1"
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
                <DialogTitle className="flex items-center gap-2">
                  <FiEdit className="h-5 w-5" />
                  Edit Role
                </DialogTitle>
                <DialogDescription>Update role information and permissions</DialogDescription>
              </DialogHeader>
              {selectedRole && (
                <form className="space-y-4">
                   <div className="space-y-2">
                     <Label>Role Name</Label>
                     <input
                       type="text"
                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Permissions</Label>
                     <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto border rounded-md p-4">
                       {permissions?.map((permission) => (
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
                <Button onClick={handleUpdateRole}>Update Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Role Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FiTrash2 className="h-5 w-5 text-red-600" />
                  Delete Role
                </DialogTitle>
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
                <Button variant="destructive" onClick={() => setShowDeleteDialog(false)}>Delete Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
}