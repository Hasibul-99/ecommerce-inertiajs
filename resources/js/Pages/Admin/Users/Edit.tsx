import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, User } from '@/types/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import Checkbox from '@/Components/Core/Checkbox';
import { FiArrowLeft, FiSave, FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';

interface Role {
  id: number;
  name: string;
  display_name?: string;
}

interface ExtendedUser extends User {
  roles: Role[];
}

interface Props extends PageProps {
  user: ExtendedUser;
  roles: Role[];
}

export default function EditUser({ auth, user, roles }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    password: '',
    password_confirmation: '',
    roles: user.roles?.map(role => role.name) || [],
    email_verified: !!user.email_verified_at,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.users.update', user.id));
  };

  const handleRoleChange = (roleName: string, checked: boolean) => {
    if (checked) {
      setData('roles', [...data.roles, roleName]);
    } else {
      setData('roles', data.roles.filter(role => role !== roleName));
    }
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={route('admin.users.index')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Link>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              Edit User: {user.name}
            </h2>
          </div>
        </div>
      }
    >
      <Head title={`Edit User: ${user.name}`} />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FiUser className="w-5 h-5 mr-2" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center">
                      <FiUser className="w-4 h-4 mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Enter full name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <FiMail className="w-4 h-4 mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder="Enter email address"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center">
                      <FiLock className="w-4 h-4 mr-2" />
                      New Password (optional)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="flex items-center">
                      <FiLock className="w-4 h-4 mr-2" />
                      Confirm New Password
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      placeholder="Confirm new password"
                      className={errors.password_confirmation ? 'border-red-500' : ''}
                    />
                    {errors.password_confirmation && (
                      <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                  </div>
                </div>

                {/* Roles */}
                <div className="space-y-4">
                  <Label className="flex items-center text-base font-medium">
                    <FiShield className="w-4 h-4 mr-2" />
                    User Roles
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={data.roles.includes(role.name)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRoleChange(role.name, e.target.checked)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`role-${role.id}`} className="font-medium cursor-pointer">
                            {role.display_name || role.name}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.roles && (
                    <p className="text-sm text-red-600">{errors.roles}</p>
                  )}
                </div>

                {/* Email Verification */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email_verified"
                    checked={data.email_verified}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email_verified', e.target.checked)}
                  />
                  <Label htmlFor="email_verified" className="cursor-pointer">
                    Mark email as verified
                  </Label>
                </div>

                {/* User Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">User Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">User ID:</span> {user.id}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span> {new Date(user.updated_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Email Verified:</span> {user.email_verified_at ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Link
                    href={route('admin.users.index')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </Link>
                  <Button type="submit" disabled={processing} className="flex items-center">
                    <FiSave className="w-4 h-4 mr-2" />
                    {processing ? 'Updating...' : 'Update User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}