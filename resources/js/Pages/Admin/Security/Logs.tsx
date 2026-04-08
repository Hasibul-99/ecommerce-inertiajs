import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/Table';
import { Badge } from '@/Components/ui/Badge';
import { Input } from '@/Components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/Select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/Dialog';

interface User {
    id: number;
    name: string;
    email: string;
}

interface SecurityEvent {
    id: number;
    type: string;
    user_id?: number;
    user?: User;
    ip: string;
    description: string;
    url?: string;
    user_agent: string;
    data?: Record<string, any>;
    created_at: string;
}

interface Summary {
    total_events: number;
    failed_logins: number;
    xss_attempts: number;
    suspicious_activities: number;
    blocked_ips: number;
}

interface Props {
    events: {
        data: SecurityEvent[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    eventTypes: string[];
    filters: {
        type?: string;
        user_id?: number;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
    summary: Summary;
}

export default function Logs({ events, eventTypes, filters, summary }: Props) {
    const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCleanupModal, setShowCleanupModal] = useState(false);
    const [cleanupDays, setCleanupDays] = useState(90);

    const [filterValues, setFilterValues] = useState({
        type: filters.type || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        search: filters.search || '',
    });

    const applyFilters = () => {
        router.get(route('admin.security.logs'), filterValues, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFilterValues({ type: '', date_from: '', date_to: '', search: '' });
        router.get(route('admin.security.logs'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportLogs = () => {
        window.location.href = route('admin.security.export-logs', filterValues);
    };

    const handleCleanup = () => {
        router.post(route('admin.security.cleanup-events'), { days: cleanupDays }, {
            onSuccess: () => {
                setShowCleanupModal(false);
            },
        });
    };

    const viewDetails = (event: SecurityEvent) => {
        setSelectedEvent(event);
        setShowDetailsModal(true);
    };

    const getEventBadgeVariant = (type: string) => {
        const variants: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
            login_success: 'default',
            login_failed: 'destructive',
            xss_attempt: 'destructive',
            suspicious_activity: 'destructive',
            account_locked: 'destructive',
            rate_limit_exceeded: 'secondary',
            unauthorized_access: 'destructive',
        };
        return variants[type] || 'outline';
    };

    return (
        <AdminLayout>
            <Head title="Security Logs" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Security Logs</h1>
                    <p className="text-gray-600 mt-1">Monitor security events and activities</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.total_events.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Failed Logins</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{summary.failed_logins.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">XSS Attempts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{summary.xss_attempts.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Suspicious Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{summary.suspicious_activities.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Blocked IPs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.blocked_ips.toLocaleString()}</div>
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
                                <label className="block text-sm font-medium mb-1">Event Type</label>
                                <Select
                                    value={filterValues.type}
                                    onValueChange={(value) => setFilterValues({ ...filterValues, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All types</SelectItem>
                                        {eventTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    placeholder="IP, description, URL..."
                                    value={filterValues.search}
                                    onChange={(e) => setFilterValues({ ...filterValues, search: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button onClick={applyFilters}>Apply Filters</Button>
                            <Button variant="outline" onClick={resetFilters}>Reset</Button>
                            <Button variant="outline" onClick={exportLogs} className="ml-auto">Export CSV</Button>
                            <Button variant="destructive" onClick={() => setShowCleanupModal(true)}>Cleanup Old Logs</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Events Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Security Events</CardTitle>
                        <CardDescription>
                            Showing {events.data.length} of {events.total} events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date/Time</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.data.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(event.created_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getEventBadgeVariant(event.type)}>
                                                {event.type.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {event.user ? (
                                                <div>
                                                    <div className="font-medium">{event.user.name}</div>
                                                    <div className="text-sm text-gray-500">{event.user.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                                        <TableCell className="max-w-md truncate">{event.description}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => viewDetails(event)}>
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {events.data.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No security events found
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Event Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Event Details</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="space-y-4">
                            <div>
                                <label className="font-semibold">Type:</label>
                                <p><Badge variant={getEventBadgeVariant(selectedEvent.type)}>{selectedEvent.type}</Badge></p>
                            </div>
                            <div>
                                <label className="font-semibold">Description:</label>
                                <p>{selectedEvent.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold">IP Address:</label>
                                    <p className="font-mono">{selectedEvent.ip}</p>
                                </div>
                                <div>
                                    <label className="font-semibold">Date/Time:</label>
                                    <p>{new Date(selectedEvent.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            {selectedEvent.url && (
                                <div>
                                    <label className="font-semibold">URL:</label>
                                    <p className="text-sm break-all">{selectedEvent.url}</p>
                                </div>
                            )}
                            {selectedEvent.user_agent && (
                                <div>
                                    <label className="font-semibold">User Agent:</label>
                                    <p className="text-sm break-all">{selectedEvent.user_agent}</p>
                                </div>
                            )}
                            {selectedEvent.data && Object.keys(selectedEvent.data).length > 0 && (
                                <div>
                                    <label className="font-semibold">Additional Data:</label>
                                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                                        {JSON.stringify(selectedEvent.data, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Cleanup Modal */}
            <Dialog open={showCleanupModal} onOpenChange={setShowCleanupModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cleanup Old Logs</DialogTitle>
                        <DialogDescription>
                            Delete security logs older than the specified number of days.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="block text-sm font-medium mb-2">Days to keep</label>
                        <Input
                            type="number"
                            min="7"
                            max="365"
                            value={cleanupDays}
                            onChange={(e) => setCleanupDays(parseInt(e.target.value))}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            This will permanently delete all events older than {cleanupDays} days.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCleanupModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleCleanup}>
                            Delete Old Logs
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
