import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { useState } from 'react';
import { 
  FiSettings, 
  FiGlobe, 
  FiMail, 
  FiDollarSign, 
  FiShield, 
  FiDatabase,
  FiTruck,
  FiCreditCard,
  FiImage,
  FiUsers
} from 'react-icons/fi';

interface Props extends PageProps {
  settings?: {
    site_name: string;
    site_description: string;
    site_logo: string;
    currency: string;
    timezone: string;
    maintenance_mode: boolean;
    email_notifications: boolean;
    sms_notifications: boolean;
    tax_rate: number;
    shipping_fee: number;
    free_shipping_threshold: number;
  };
}

export default function AdminSettings({ auth, settings }: Props) {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    site_name: settings?.site_name || 'E-Commerce Store',
    site_description: settings?.site_description || 'Your trusted online marketplace',
    site_logo: settings?.site_logo || '',
    currency: settings?.currency || 'USD',
    timezone: settings?.timezone || 'UTC',
    maintenance_mode: settings?.maintenance_mode || false,
    email_notifications: settings?.email_notifications || true,
    sms_notifications: settings?.sms_notifications || false,
    tax_rate: settings?.tax_rate || 0,
    shipping_fee: settings?.shipping_fee || 0,
    free_shipping_threshold: settings?.free_shipping_threshold || 100,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving settings:', formData);
  };

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Admin Settings</h2>}
    >
      <Head title="Admin Settings" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Configure your e-commerce platform settings</p>
            </div>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <FiSettings className="w-4 h-4" />
              Save Changes
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <FiGlobe className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="commerce" className="flex items-center gap-2">
                <FiDollarSign className="w-4 h-4" />
                Commerce
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <FiTruck className="w-4 h-4" />
                Shipping
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <FiShield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <FiDatabase className="w-4 h-4" />
                System
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiGlobe className="w-5 h-5" />
                    Site Information
                  </CardTitle>
                  <CardDescription>
                    Configure basic information about your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site_name">Site Name</Label>
                      <Input
                        id="site_name"
                        value={formData.site_name}
                        onChange={(e) => handleInputChange('site_name', e.target.value)}
                        placeholder="Enter site name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <textarea
                      id="site_description"
                      value={formData.site_description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('site_description', e.target.value)}
                      placeholder="Enter site description"
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('timezone', e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiMail className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={formData.email_notifications}
                      onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      checked={formData.sms_notifications}
                      onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commerce Settings */}
            <TabsContent value="commerce" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiDollarSign className="w-5 h-5" />
                    Commerce Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure pricing and tax settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                      <Input
                        id="tax_rate"
                        type="number"
                        step="0.01"
                        value={formData.tax_rate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('tax_rate', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_fee">Default Shipping Fee</Label>
                      <Input
                        id="shipping_fee"
                        type="number"
                        step="0.01"
                        value={formData.shipping_fee}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('shipping_fee', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="free_shipping_threshold">Free Shipping Threshold</Label>
                      <Input
                        id="free_shipping_threshold"
                        type="number"
                        step="0.01"
                        value={formData.free_shipping_threshold}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('free_shipping_threshold', parseFloat(e.target.value) || 0)}
                        placeholder="100.00"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping Settings */}
            <TabsContent value="shipping" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiTruck className="w-5 h-5" />
                    Shipping Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure shipping methods and zones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FiTruck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Settings</h3>
                    <p className="text-gray-500 mb-4">Configure shipping zones, methods, and rates</p>
                    <Button variant="outline">Configure Shipping</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiShield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure security and access control
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for admin accounts
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Auto-logout after inactivity
                      </p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiDatabase className="w-5 h-5" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>
                    System-level settings and maintenance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Put the site in maintenance mode
                      </p>
                    </div>
                    <Switch
                      checked={formData.maintenance_mode}
                      onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Cache Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <FiDatabase className="w-4 h-4" />
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FiImage className="w-4 h-4" />
                        Clear Images
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FiUsers className="w-4 h-4" />
                        Clear Sessions
                      </Button>
                    </div>
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