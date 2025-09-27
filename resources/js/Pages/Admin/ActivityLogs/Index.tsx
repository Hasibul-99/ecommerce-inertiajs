import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, User } from '@/types';
import Pagination from '@/Components/Pagination';
import { formatDate } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
  FiActivity, 
  FiUser, 
  FiClock, 
  FiEye, 
  FiFilter, 
  FiSearch,
  FiMonitor,
  FiShield,
  FiDatabase,
  FiRefreshCw
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
  activityLogs: {
    data: ActivityLog[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  filters: {
    event_type?: string;
    user_id?: number;
    from_date?: string;
    to_date?: string;
  };
  eventTypes: string[];
}

export default function Index({ auth, activityLogs, filters, eventTypes }: Props) {
  const [filterData, setFilterData] = useState({
    event_type: filters.event_type || '',
    user_id: filters.user_id || '',
    from_date: filters.from_date || '',
    to_date: filters.to_date || '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterData(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    router.get(route('admin.activity-logs.index'), filterData, {
      preserveState: true,
      replace: true,
    });
  };

  const resetFilters = () => {
    setFilterData({
      event_type: '',
      user_id: '',
      from_date: '',
      to_date: '',
    });
    router.get(route('admin.activity-logs.index'), undefined, {
      preserveState: true,
      replace: true,
    });
  };

  const getEventLabel = (event: string) => {
    switch (event) {
      case 'created':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Created</span>;
      case 'updated':
        return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">Updated</span>;
      case 'deleted':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Deleted</span>;
      case 'restored':
        return <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">Restored</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{event}</span>;
    }
  };

  const getModelName = (type: string) => {
    return type.split('\\').pop();
  };

  return (
    <AdminLayout 
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Activity Logs</h2>}
    >
      <Head title="Activity Logs" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Activities</p>
                    <p className="text-2xl font-bold text-gray-900">{activityLogs.data?.length || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FiActivity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">User Actions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {activityLogs.data?.filter(log => log.user_id).length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FiUser className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Events</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {activityLogs.data?.filter(log => !log.user_id).length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FiMonitor className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Logs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {activityLogs.data?.filter(log => 
                        new Date(log.created_at).toDateString() === new Date().toDateString()
                      ).length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <FiClock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiActivity className="w-5 h-5" />
                Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <FiFilter className="w-4 h-4" />
                  Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <select
                      id="event_type"
                      name="event_type"
                      value={filterData.event_type}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">All Types</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="from_date" className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      id="from_date"
                      name="from_date"
                      value={filterData.from_date}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="to_date" className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      id="to_date"
                      name="to_date"
                      value={filterData.to_date}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <Button
                      onClick={applyFilters}
                      className="flex items-center gap-2"
                    >
                      <FiSearch className="w-4 h-4" />
                      Apply
                    </Button>
                    <Button
                      onClick={resetFilters}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              {/* Activity Logs Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.data.length > 0 ? (
                      activityLogs.data.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <FiClock className="w-3 h-3 text-gray-400" />
                              {formatDate(log.created_at, {}, true)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.user ? (
                              <div className="flex items-center gap-2">
                                <FiUser className="w-3 h-3 text-gray-400" />
                                <span className="font-medium">{log.user.name}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <FiMonitor className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-500">System</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {getEventLabel(log.event)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.event_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FiDatabase className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">
                                {getModelName(log.loggable_type)} #{log.loggable_id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {log.ip_address || 'N/A'}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="flex items-center gap-1"
                            >
                              <Link href={route('admin.activity-logs.show', log.id)}>
                                <FiEye className="w-3 h-3" />
                                View Details
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No activity logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-6">
                <Pagination links={activityLogs.links} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}