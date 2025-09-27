import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, User } from '@/types';
import { formatDate } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
  FiActivity, 
  FiUser, 
  FiMonitor, 
  FiClock, 
  FiDatabase, 
  FiGlobe, 
  FiArrowLeft,
  FiInfo
} from 'react-icons/fi';

interface ActivityLog {
  id: number;
  user_id: number | null;
  ip_address: string | null;
  user_agent: string | null;
  event: string;
  event_type: string;
  loggable_type: string;
  loggable_id: number;
  properties: any;
  created_at: string;
  updated_at: string;
  user?: User;
}

interface Props extends PageProps {
  activityLog: ActivityLog;
}

export default function Show({ auth, activityLog }: Props) {
  const getEventLabel = (event: string) => {
    switch (event) {
      case 'created':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Created</Badge>;
      case 'updated':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Updated</Badge>;
      case 'deleted':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Deleted</Badge>;
      case 'restored':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Restored</Badge>;
      default:
        return <Badge variant="outline">{event}</Badge>;
    }
  };

  const getModelName = (type: string) => {
    return type.split('\\').pop();
  };

  const renderProperties = (properties: any) => {
    if (!properties || Object.keys(properties).length === 0) {
      return <p className="text-gray-500 italic">No additional properties</p>;
    }

    return (
      <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
        <pre className="text-sm">{JSON.stringify(properties, null, 2)}</pre>
      </div>
    );
  };

  return (
    <AdminLayout 
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Activity Log Details</h2>}
    >
      <Head title={`Activity Log #${activityLog.id}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FiActivity className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Activity Log #{activityLog.id}</h1>
            </div>
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link href={route('admin.activity-logs.index')}>
                <FiArrowLeft className="w-4 h-4" />
                Back to Logs
              </Link>
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiInfo className="w-5 h-5" />
                    Log Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Date & Time</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <FiClock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{formatDate(activityLog.created_at, {}, true)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">User</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        {activityLog.user ? (
                          <>
                            <FiUser className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium">{activityLog.user.name}</div>
                              <div className="text-xs text-gray-500">{activityLog.user.email}</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <FiMonitor className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">System</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Event</label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {getEventLabel(activityLog.event)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Event Type</label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <Badge variant="outline">{activityLog.event_type}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Model</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <FiDatabase className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {getModelName(activityLog.loggable_type)} #{activityLog.loggable_id}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">IP Address</label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <FiGlobe className="w-4 h-4 text-gray-400" />
                        <code className="text-sm bg-white px-2 py-1 rounded border">
                          {activityLog.ip_address || 'N/A'}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">User Agent</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-xs break-all">
                        {activityLog.user_agent || 'N/A'}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Properties */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiDatabase className="w-5 h-5" />
                    Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderProperties(activityLog.properties)}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}