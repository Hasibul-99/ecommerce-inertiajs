import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, User } from '@/types';
import Pagination from '@/Components/Pagination';
import { formatDate } from '@/utils';

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
    <AdminLayout user={auth.user as User}>
      <Head title="Activity Logs" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h1 className="text-2xl font-semibold mb-6">Activity Logs</h1>

              {/* Filters */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-3">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">Event Type</label>
                    <select
                      id="event_type"
                      name="event_type"
                      value={filterData.event_type}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">All Types</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="from_date" className="block text-sm font-medium text-gray-700">From Date</label>
                    <input
                      type="date"
                      id="from_date"
                      name="from_date"
                      value={filterData.from_date}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="to_date" className="block text-sm font-medium text-gray-700">To Date</label>
                    <input
                      type="date"
                      id="to_date"
                      name="to_date"
                      value={filterData.to_date}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={applyFilters}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply
                    </button>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity Logs Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activityLogs.data.length > 0 ? (
                      activityLogs.data.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(log.created_at, {}, true)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.user ? (
                              <span>{log.user.name}</span>
                            ) : (
                              <span className="text-gray-400">System</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getEventLabel(log.event)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.event_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getModelName(log.loggable_type)} #{log.loggable_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.ip_address || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              href={route('admin.activity-logs.show', log.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No activity logs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6">
                <Pagination links={activityLogs.links} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}