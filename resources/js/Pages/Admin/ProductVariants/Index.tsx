import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types/index';
import { Product } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiPackage, FiDollarSign, FiBox } from 'react-icons/fi';
import { formatCurrency, formatDate } from '@/utils';

interface ExtendedProductVariant {
    id: number;
    product_id: number;
    sku: string;
    price_cents: number;
    stock_quantity: number;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    product: {
        id: number;
        title: string;
    };
}

interface Props extends PageProps {
    variants: {
        data: ExtendedProductVariant[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    products: Product[];
    filters: {
        search?: string;
        product_id?: string;
    };
}

export default function ProductVariantsIndex({ variants, products, filters, auth }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedProduct, setSelectedProduct] = useState(filters.product_id || 'all');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<ExtendedProductVariant | null>(null);
    const [formData, setFormData] = useState({
        product_id: '',
        sku: '',
        price_cents: 0,
        stock_quantity: 0,
        is_default: false,
    });

    const handleSearch = () => {
        router.get(route('admin.product-variants.index'), {
            search: searchTerm,
            product_id: selectedProduct !== 'all' ? selectedProduct : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCreateVariant = () => {
        router.post(route('admin.product-variants.store'), formData, {
            onSuccess: () => {
                setShowCreateDialog(false);
                setFormData({
                    product_id: '',
                    sku: '',
                    price_cents: 0,
                    stock_quantity: 0,
                    is_default: false,
                });
            },
            onError: (errors) => {
                console.error('Create variant errors:', errors);
            }
        });
    };

    const handleEditVariant = (variant: ExtendedProductVariant) => {
        setSelectedVariant(variant);
        setFormData({
            product_id: variant.product_id.toString(),
            sku: variant.sku || '',
            price_cents: variant.price_cents || 0,
            stock_quantity: variant.stock_quantity || 0,
            is_default: variant.is_default || false,
        });
        setShowEditDialog(true);
    };

    const handleUpdateVariant = () => {
        if (!selectedVariant) return;
        
        router.put(route('admin.product-variants.update', selectedVariant.id), formData, {
            onSuccess: () => {
                setShowEditDialog(false);
                setSelectedVariant(null);
                setFormData({
                    product_id: '',
                    sku: '',
                    price_cents: 0,
                    stock_quantity: 0,
                    is_default: false,
                });
            },
            onError: (errors) => {
                console.error('Update variant errors:', errors);
            }
        });
    };

    const handleDeleteVariant = (variant: ExtendedProductVariant) => {
        setSelectedVariant(variant);
        setShowDeleteDialog(true);
    };

    const confirmDeleteVariant = () => {
        if (!selectedVariant) return;
        
        router.delete(route('admin.product-variants.destroy', selectedVariant.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setSelectedVariant(null);
            },
            onError: (errors) => {
                console.error('Delete variant errors:', errors);
            }
        });
    };

    const formatPrice = (priceCents: number) => {
        return formatCurrency(priceCents / 100);
    };

    const getStockBadge = (quantity: number) => {
        if (quantity === 0) return 'bg-red-100 text-red-800';
        if (quantity < 10) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product Variants Management</h2>}
        >
            <Head title="Product Variants Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Variants</CardTitle>
                                <FiBox className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{variants.total}</div>
                                <p className="text-xs text-muted-foreground">Active product variants</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                                <FiPackage className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {variants.data.filter(v => (v.stock_quantity || 0) < 10).length}
                                </div>
                                <p className="text-xs text-muted-foreground">Variants below 10 units</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                                <FiPackage className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {variants.data.filter(v => (v.stock_quantity || 0) === 0).length}
                                </div>
                                <p className="text-xs text-muted-foreground">Variants with no stock</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                <FiDollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatPrice(variants.data.reduce((sum, v) => sum + ((v.price_cents || 0) * (v.stock_quantity || 0)), 0))}
                                </div>
                                <p className="text-xs text-muted-foreground">Total inventory value</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Product Variants</CardTitle>
                                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <FiPlus className="w-4 h-4 mr-2" />
                                            Add Variant
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle>Create New Product Variant</DialogTitle>
                                            <DialogDescription>
                                                Add a new variant to an existing product.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="product_id" className="text-right">Product</Label>
                                                <Select
                                                    value={formData.product_id}
                                                    onValueChange={(value) => setFormData({...formData, product_id: value})}
                                                >
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {products.map((product) => (
                                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                                {product.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="sku" className="text-right">SKU</Label>
                                                <Input
                                                    id="sku"
                                                    value={formData.sku}
                                                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                                    className="col-span-3"
                                                    placeholder="Enter SKU"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="price_cents" className="text-right">Price (cents)</Label>
                                                <Input
                                                    id="price_cents"
                                                    type="number"
                                                    value={formData.price_cents}
                                                    onChange={(e) => setFormData({...formData, price_cents: parseInt(e.target.value) || 0})}
                                                    className="col-span-3"
                                                    placeholder="Enter price in cents"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="stock_quantity" className="text-right">Stock</Label>
                                                <Input
                                                    id="stock_quantity"
                                                    type="number"
                                                    value={formData.stock_quantity}
                                                    onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                                                    className="col-span-3"
                                                    placeholder="Enter stock quantity"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" onClick={handleCreateVariant}>Create Variant</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Search and Filters */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search variants..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Products</SelectItem>
                                            {products.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleSearch}>Search</Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Default</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variants.data.map((variant) => (
                                        <TableRow key={variant.id}>
                                            <TableCell className="font-medium">
                                                {variant.product?.title || 'Unknown Product'}
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {variant.sku || 'N/A'}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">
                                                    {formatPrice(variant.price_cents || 0)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStockBadge(variant.stock_quantity || 0)}>
                                                    {variant.stock_quantity || 0} units
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {variant.is_default ? (
                                                    <Badge className="bg-blue-100 text-blue-800">Default</Badge>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(variant.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditVariant(variant)}
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteVariant(variant)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {variants.data.length === 0 && (
                                <div className="text-center py-8">
                                    <FiBox className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No variants found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new product variant.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Edit Dialog */}
                    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Edit Product Variant</DialogTitle>
                                <DialogDescription>
                                    Update the variant information.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit_product_id" className="text-right">Product</Label>
                                    <Select
                                        value={formData.product_id}
                                        onValueChange={(value) => setFormData({...formData, product_id: value})}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit_sku" className="text-right">SKU</Label>
                                    <Input
                                        id="edit_sku"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                        className="col-span-3"
                                        placeholder="Enter SKU"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit_price_cents" className="text-right">Price (cents)</Label>
                                    <Input
                                        id="edit_price_cents"
                                        type="number"
                                        value={formData.price_cents}
                                        onChange={(e) => setFormData({...formData, price_cents: parseInt(e.target.value) || 0})}
                                        className="col-span-3"
                                        placeholder="Enter price in cents"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit_stock_quantity" className="text-right">Stock</Label>
                                    <Input
                                        id="edit_stock_quantity"
                                        type="number"
                                        value={formData.stock_quantity}
                                        onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                                        className="col-span-3"
                                        placeholder="Enter stock quantity"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleUpdateVariant}>Update Variant</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Product Variant</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this variant? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={confirmDeleteVariant}>
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AdminLayout>
    );
}