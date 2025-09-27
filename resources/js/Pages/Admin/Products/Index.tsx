import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, User } from '@/types/index';
import { Product, ProductVariant, Category, Vendor } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

import { Label } from '@/Components/ui/label';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiPackage, FiDollarSign, FiImage, FiStar } from 'react-icons/fi';



interface SimpleCategory {
  id: number;
  name: string;
  slug: string;
}

interface SimpleVendor {
  id: number;
  name: string;
}

interface ExtendedProduct extends Omit<Product, 'price_cents' | 'sale_price_cents'> {
  name: string;
  price: number;
  sale_price?: number;
  stock: number;
  sku: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  featured: boolean;
  category: SimpleCategory;
  vendor: SimpleVendor;
  images: string[];
  variants: ProductVariant[];
}

interface Props extends PageProps {
  products: ExtendedProduct[];
  categories: Category[];
  vendors: Vendor[];
}

export default function ProductsIndex({ products, categories, vendors, auth }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock brands data for demonstration
  const brands = [
    { id: 1, name: 'Organic Farms Co.' },
    { id: 2, name: 'Fresh Valley' },
    { id: 3, name: 'Premium Foods' }
  ];

  // Mock data for demonstration
  const mockProducts: ExtendedProduct[] = [
    {
      id: 1,
      title: 'Premium Organic Almonds',
      slug: 'premium-organic-almonds',
      description: 'High-quality organic almonds sourced from California farms.',
      name: 'Premium Organic Almonds',
      price: 24.99,
      sale_price: 19.99,
      stock: 150,
      sku: 'ALM-001',
      status: 'active',
      featured: true,
      category: { id: 1, name: 'Nuts & Seeds', slug: 'nuts-seeds' },
      vendor: { id: 1, name: 'Organic Farms Co.' },
      images: ['/images/almonds-1.jpg', '/images/almonds-2.jpg'],
      variants: [
        { id: 1, name: '500g Pack', price_cents: 1999, stock_quantity: 75, sku: 'ALM-001-500', product_id: 1, sale_price_cents: undefined, weight_grams: undefined, dimensions: undefined, created_at: '2024-01-15T10:30:00Z', updated_at: '2024-01-20T14:45:00Z' },
        { id: 2, name: '1kg Pack', price_cents: 3599, stock_quantity: 50, sku: 'ALM-001-1000', product_id: 1, sale_price_cents: undefined, weight_grams: undefined, dimensions: undefined, created_at: '2024-01-15T10:30:00Z', updated_at: '2024-01-20T14:45:00Z' },
        { id: 3, name: '2kg Bulk', price_cents: 6599, stock_quantity: 25, sku: 'ALM-001-2000', product_id: 1, sale_price_cents: undefined, weight_grams: undefined, dimensions: undefined, created_at: '2024-01-15T10:30:00Z', updated_at: '2024-01-20T14:45:00Z' }
      ],
      category_id: 1,
      vendor_id: 1,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T14:45:00Z'
    },
    {
      id: 2,
      title: 'Fresh Strawberries',
      slug: 'fresh-strawberries',
      description: 'Sweet and juicy strawberries, perfect for desserts and snacks.',
      name: 'Fresh Strawberries',
      price: 8.99,
      stock: 200,
      sku: 'STR-001',
      status: 'active',
      featured: false,
      category: { id: 2, name: 'Fresh Fruits', slug: 'fresh-fruits' },
      vendor: { id: 2, name: 'Fresh Produce Ltd.' },
      images: ['/images/strawberries-1.jpg'],
      variants: [],
      category_id: 2,
      vendor_id: 2,
      created_at: '2024-01-10T08:15:00Z',
      updated_at: '2024-01-18T16:20:00Z'
    }
  ];

  const handleSearch = () => {
    // Implement search logic
    console.log('Searching for:', searchTerm);
  };

  const handleCreateProduct = () => {
    router.visit(route('admin.products.create'));
  };

  const handleEditProduct = (product: ExtendedProduct) => {
    router.visit(route('admin.products.edit', product.id));
  };

  const handleDeleteProduct = (product: ExtendedProduct) => {
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      router.delete(route('admin.products.destroy', product.id), {
        onSuccess: () => {
          // Product deleted successfully, page will reload automatically
        },
        onError: (errors) => {
          console.error('Error deleting product:', errors);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  };

  const handleToggleFeatured = (product: ExtendedProduct) => {
    // Implement toggle featured logic
    console.log('Toggling featured for:', product.name);
  };

  const handleViewVariants = (product: ExtendedProduct) => {
    // Navigate to product variants page or show variants in a separate view
    console.log('Viewing variants for:', product.name);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product Management</h2>}
    >
      <Head title="Product Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header with Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <FiPackage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProducts.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active products in catalog
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <FiPackage className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {mockProducts.filter(p => p.stock < 10).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Products below 10 units
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured</CardTitle>
                <FiStar className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockProducts.filter(p => p.featured).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Featured products
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <FiDollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(mockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total inventory value
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your product catalog and inventory</p>
            </div>
                <Button className="flex items-center gap-2" onClick={handleCreateProduct}>
                  <FiPlus className="w-4 h-4" />
                  Add Product
                </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Filter Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vendor</Label>
                  <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Vendors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vendors</SelectItem>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Variants</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts && mockProducts.length > 0 ? (
                      mockProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <FiImage className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category.name}</Badge>
                          </TableCell>
                          <TableCell>{product.vendor.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{formatPrice(product.price)}</span>
                              {product.sale_price && (
                                <span className="text-sm text-green-600">{formatPrice(product.sale_price)}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(product.status)}>
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFeatured(product)}
                              className={product.featured ? 'text-yellow-600' : 'text-gray-400'}
                            >
                              <FiStar className={`w-4 h-4 ${product.featured ? 'fill-current' : ''}`} />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewVariants(product)}
                              className="flex items-center gap-1"
                            >
                              {product.variants.length}
                              <span className="text-xs">variants</span>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <FiEdit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <FiPackage className="w-12 h-12 text-gray-400" />
                            <p className="text-gray-500">No products found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}