import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/Table';
import { Badge } from '@/Components/ui/Badge';
import { Input } from '@/Components/ui/Input';

interface User {
    id: number;
    name: string;
    email: string;
}

interface LoginAttempt {
    id: number;
    user_id?: number;
    user?: User;
    email: string;
    ip: string;
    user_agent: string;
    successful: boolean;
    failure_reason?: string;
    metadata?: Record<string, any>;
    created_at: string;
}

interface Stats {
    total: number;
    successful: number;
    failed: number;
    today: number;
}

interface Props {
    attempts: {
        data: LoginAttempt[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        status?: string;
        user_id?: number;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
    stats: Stats;
}

export default function LoginAttempts({ attempts, filters, stats }: Props) {
    const [filterValues, setFilterValues] = useState({
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        search: filters.search || '',
    });

    const applyFilters = () => {
        router.get(route('admin.security.login-attempts'), filterValues, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFilterValues({ status: '', date_from: '', date_to: '', search: '' });
        router.get(route('admin.security.login-attempts'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getDeviceInfo = (userAgent: string): string => {
        if (userAgent.includes('Mobile')) return 'Mobile';
        if (userAgent.includes('Tablet')) return 'Tablet';
        return 'Desktop';
    };

    const getBrowserInfo = (userAgent: string): string => {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    };

    return (
        <AdminLayout>
            <Head title="Login Attempts" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Login Attempts</h1>
                    <p className="text-gray-600 mt-1">Monitor user login attempts and authentication activity</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Attempts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Successful</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.successful.toLocaleString()}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(1) : 0}%
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.failed.toLocaleString()}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.total > 0 ? ((stats.failed / stats.total) * 100).toFixed(1) : 0}%
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.today.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="w-full border rounded-md px-3 py-2"
                                    value={filterValues.status}
                                    onChange={(e) => setFilterValues({ ...filterValues, status: e.target.value })}
                                >
                                    <option value="">All</option>
                                    <option value="successful">Successful</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">From Date</label>
                                <Input
                                    type="date"
                                    value={filterValues.date_from}
                                    onChange={(e) => setFilterValues({ ...filterValues, date_from: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">To Date</label>
                                <Input
                                    type="date"
                                    value={filterValues.date_to}
                                    onChange={(e) => setFilterValues({ ...filterValues, date_to: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Search</label>
                                <Input
                                    type="text"
                                    placeholder="Email, IP..."
                                    value={filterValues.search}
                                    onChange={(e) => setFilterValues({ ...filterValues, search: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button onClick={applyFilters}>Apply Filters</Button>
                            <Button variant="outline" onClick={resetFilters}>Reset</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Login Attempts Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Login Attempts</CardTitle>
                        <CardDescription>
                            Showing {attempts.data.length} of {attempts.total} attempts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date/Time</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Browser</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Failure Reason</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attempts.data.map((attempt) => (
                                    <TableRow key={attempt.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(attempt.created_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {attempt.email}
                                        </TableCell>
                                        <TableCell>
                                            {attempt.user ? (
                                                <div>
                                                    <div className="font-medium">{attempt.user.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {attempt.user.id}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {attempt.ip}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {getDeviceInfo(attempt.user_agent)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {getBrowserInfo(attempt.user_agent)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {attempt.successful ? (
                                                <Badge variant="default" className="bg-green-600">
                                                    Success
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive">
                                                    Failed
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {attempt.failure_reason ? (
                                                <span className="text-sm text-red-600">
                                                    {attempt.failure_reason}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {attempts.data.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No login attempts found
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
