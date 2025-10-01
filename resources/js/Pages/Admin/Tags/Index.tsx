import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiTag } from 'react-icons/fi';

interface ProductTag {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

interface Props extends PageProps {
  tags: {
    data: ProductTag[];
    links: any[];
    meta: any;
  };
  filters: {
    search?: string;
  };
}

export default function TagsIndex({ auth, tags, filters }: Props) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ProductTag | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.tags.index'), { search: searchTerm }, { preserveState: true });
  };

  const handleCreate = () => {
    router.post(route('admin.tags.store'), formData, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ name: '', slug: '' });
      },
      onError: (errors) => {
        console.error('Error creating tag:', errors);
      }
    });
  };

  const handleEdit = (tag: ProductTag) => {
    setSelectedTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setShowEditDialog(true);
  };

  const handleUpdate = () => {
    if (!selectedTag) return;
    
    router.put(route('admin.tags.update', selectedTag.id), formData, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedTag(null);
        setFormData({ name: '', slug: '' });
      },
      onError: (errors) => {
        console.error('Error updating tag:', errors);
      }
    });
  };

  const handleDelete = (tag: ProductTag) => {
    if (confirm(`Are you sure you want to delete "${tag.name}"?`)) {
      router.delete(route('admin.tags.destroy', tag.id), {
        onError: (errors) => {
          console.error('Error deleting tag:', errors);
        }
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    router.get(route('admin.tags.index'));
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
            <FiTag className="h-6 w-6" />
            Tags Management
          </h2>
        </div>
      }
    >
      <Head title="Tags Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiTag className="h-8 w-8" />
                Tags Management
              </h1>
              <p className="text-gray-600 mt-1">Manage product tags</p>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <FiPlus className="h-4 w-4" />
                  Create Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Tag</DialogTitle>
                  <DialogDescription>
                    Add a new product tag to organize your products.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter tag name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="slug" className="text-right">
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="col-span-3"
                      placeholder="Leave empty to auto-generate"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreate}>
                    Create Tag
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiSearch className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="search">Search Tags</Label>
                  <Input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by tag name..."
                    className="mt-1"
                  />
                </div>
                <Button type="submit">Search</Button>
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tags Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tags ({tags.meta?.total || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Products Count</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.data.length > 0 ? (
                    tags.data.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{tag.slug}</Badge>
                        </TableCell>
                        <TableCell>{tag.products_count || 0}</TableCell>
                        <TableCell>
                          {new Date(tag.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(tag)}
                            >
                              <FiEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(tag)}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <FiTag className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No tags found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {tags.links && tags.links.length > 3 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    {tags.links.map((link: any, index: number) => (
                      <Button
                        key={index}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url)}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the tag information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-slug" className="text-right">
                Slug
              </Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdate}>
              Update Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}