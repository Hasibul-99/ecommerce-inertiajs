import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiPackage, FiGrid, FiList } from 'react-icons/fi';

import { Category as BaseCategory } from '@/types/models';

interface ExtendedCategory extends BaseCategory {
  parent?: ExtendedCategory;
  children?: ExtendedCategory[];
  products_count?: number;
}

interface Props extends PageProps {
  categories: {
    data: ExtendedCategory[];
    links: any[];
    meta: any;
  };
  filters: {
    search?: string;
    parent?: string;
  };
}

export default function CategoriesIndex({ auth, categories, filters }: Props) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BaseCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.categories.index'), { search: searchTerm }, { preserveState: true });
  };

  const handleCreate = () => {
    // Handle create logic here
    console.log('Creating category:', formData);
    setShowCreateDialog(false);
    setFormData({ name: '', parent_id: '' });
  };

  const handleEdit = (category: BaseCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      parent_id: category.parent_id?.toString() || '',
    });
    setShowEditDialog(true);
  };

  const handleUpdate = () => {
    // Handle update logic here
    console.log('Updating category:', selectedCategory?.id, formData);
    setShowEditDialog(false);
    setSelectedCategory(null);
    setFormData({ name: '', parent_id: '' });
  };

  const handleDelete = (category: BaseCategory) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      // Handle delete logic here
      console.log('Deleting category:', category.id);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    router.get(route('admin.categories.index'));
  };

  const getCategoryLevel = (category: BaseCategory): number => {
    let level = 0;
    let current = category;
    while (current.parent) {
      level++;
      current = current.parent;
    }
    return level;
  };

  const renderCategoryName = (category: BaseCategory) => {
    const level = getCategoryLevel(category);
    const indent = '—'.repeat(level);
    return level > 0 ? `${indent} ${category.name}` : category.name;
  };

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Categories Management</h2>}
    >
      <Head title="Categories Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categories.meta?.total || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FiPackage className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Parent Categories</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.data?.filter(cat => !cat.parent_id).length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FiGrid className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subcategories</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.data?.filter(cat => cat.parent_id).length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FiList className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.data?.reduce((sum, cat) => sum + (cat.products_count || 0), 0) || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <FiPackage className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FiPackage className="w-5 h-5" />
                  Categories
                </CardTitle>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <FiPlus className="w-4 h-4" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                      <DialogDescription>
                        Add a new category to organize your products.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Category Name</Label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter category name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parent_id">Parent Category (Optional)</Label>
                        <select
                          id="parent_id"
                          value={formData.parent_id}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, parent_id: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select parent category</option>
                          {categories.data?.filter(cat => !cat.parent_id).map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreate}>Create Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    />
                  </div>
                  <Button type="submit" variant="outline">
                    <FiSearch className="w-4 h-4" />
                  </Button>
                </form>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                    <FiFilter className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Categories Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Parent Category</TableHead>
                      <TableHead>Products Count</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.data && categories.data.length > 0 ? (
                      categories.data.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            {renderCategoryName(category)}
                          </TableCell>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {category.slug}
                            </code>
                          </TableCell>
                          <TableCell>
                            {category.parent ? (
                              <Badge variant="secondary">{category.parent.name}</Badge>
                            ) : (
                              <Badge variant="outline">Root Category</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {category.products_count || 0} products
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(category.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(category)}
                                className="flex items-center gap-1"
                              >
                                <FiEdit className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(category)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              >
                                <FiTrash2 className="w-3 h-3" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No categories found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the category information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_name">Category Name</Label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_parent_id">Parent Category (Optional)</Label>
                  <select
                    id="edit_parent_id"
                    value={formData.parent_id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, parent_id: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select parent category</option>
                    {categories.data?.filter(cat => !cat.parent_id && cat.id !== selectedCategory?.id).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Update Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
}