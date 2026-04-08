import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/Table';
import { Badge } from '@/Components/ui/Badge';
import { Input } from '@/Components/ui/Input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/Dialog';
import { Label } from '@/Components/ui/Label';

interface User {
    id: number;
    name: string;
    email: string;
}

interface BlockedIp {
    id: number;
    ip: string;
    reason: string;
    blocked_by_id?: number;
    blocked_by?: User;
    blocked_until?: string;
    created_at: string;
}

interface Props {
    blockedIps: {
        data: BlockedIp[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function BlockedIps({ blockedIps, filters }: Props) {
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [filterValues, setFilterValues] = useState({
        search: filters.search || '',
        status: filters.status || '',
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        ip: '',
        reason: '',
        duration: 24,
    });

    const applyFilters = () => {
        router.get(route('admin.security.blocked-ips'), filterValues, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFilterValues({ search: '', status: '' });
        router.get(route('admin.security.blocked-ips'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleBlock = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.security.block-ip'), {
            onSuccess: () => {
                setShowBlockModal(false);
                reset();
            },
        });
    };

    const handleUnblock = (blockedIp: BlockedIp) => {
        if (confirm(`Are you sure you want to unblock ${blockedIp.ip}?`)) {
            router.delete(route('admin.security.unblock-ip', blockedIp.id));
        }
    };

    const isActive = (blockedIp: BlockedIp) => {
        if (!blockedIp.blocked_until) return true;
        return new Date(blockedIp.blocked_until) > new Date();
    };

    return (
        <AdminLayout>
            <Head title="Blocked IPs" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Blocked IP Addresses</h1>
                        <p className="text-gray-600 mt-1">Manage blocked IP addresses</p>
                    </div>
                    <Button onClick={() => setShowBlockModal(true)}>
                        Block IP Address
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Search</label>
                                <Input
                                    type="text"
                                    placeholder="Search by IP or reason..."
                                    value={filterValues.search}
                                    onChange={(e) => setFilterValues({ ...filterValues, search: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="w-full border rounded-md px-3 py-2"
                                    value={filterValues.status}
                                    onChange={(e) => setFilterValues({ ...filterValues, status: e.target.value })}
                                >
                                    <option value="">All</option>
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button onClick={applyFilters}>Apply Filters</Button>
                            <Button variant="outline" onClick={resetFilters}>Reset</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Blocked IPs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Blocked IPs</CardTitle>
                        <CardDescription>
                            Showing {blockedIps.data.length} of {blockedIps.total} blocked IPs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Blocked By</TableHead>
                                    <TableHead>Blocked Until</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blockedIps.data.map((blockedIp) => (
                                    <TableRow key={blockedIp.id}>
                                        <TableCell className="font-mono font-semibold">
                                            {blockedIp.ip}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {blockedIp.reason}
                                        </TableCell>
                                        <TableCell>
                                            {blockedIp.blocked_by ? (
                                                <div>
                                                    <div className="font-medium">{blockedIp.blocked_by.name}</div>
                                                    <div className="text-sm text-gray-500">{blockedIp.blocked_by.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">System</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {blockedIp.blocked_until ? (
                                                new Date(blockedIp.blocked_until).toLocaleString()
                                            ) : (
                                                <Badge>Permanent</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isActive(blockedIp) ? (
                                                <Badge variant="destructive">Active</Badge>
                                            ) : (
                                                <Badge variant="outline">Expired</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(blockedIp.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {isActive(blockedIp) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUnblock(blockedIp)}
                                                >
                                                    Unblock
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {blockedIps.data.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No blocked IP addresses found
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Block IP Modal */}
            <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Block IP Address</DialogTitle>
                        <DialogDescription>
                            Block an IP address from accessing the platform
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBlock}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="ip">IP Address *</Label>
                                <Input
                                    id="ip"
                                    type="text"
                                    placeholder="192.168.1.1"
                                    value={data.ip}
                                    onChange={(e) => setData('ip', e.target.value)}
                                    className={errors.ip ? 'border-red-500' : ''}
                                />
                                {errors.ip && <p className="text-sm text-red-500 mt-1">{errors.ip}</p>}
                            </div>

                            <div>
                                <Label htmlFor="reason">Reason *</Label>
                                <Input
                                    id="reason"
                                    type="text"
                                    placeholder="E.g., Multiple failed login attempts"
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    className={errors.reason ? 'border-red-500' : ''}
                                />
                                {errors.reason && <p className="text-sm text-red-500 mt-1">{errors.reason}</p>}
                            </div>

                            <div>
                                <Label htmlFor="duration">Duration (hours) *</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    max="8760"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', parseInt(e.target.value))}
                                    className={errors.duration ? 'border-red-500' : ''}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Maximum 8760 hours (1 year)
                                </p>
                                {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration}</p>}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowBlockModal(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                {processing ? 'Blocking...' : 'Block IP'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
