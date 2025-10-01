import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { FiTag, FiArrowLeft, FiEdit, FiTrash2, FiPackage } from 'react-icons/fi';

interface Product {
  id: number;
  title: string;
  slug: string;
  base_price: number;
  currency: string;
  status: string;
}

interface ProductTag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  products?: Product[];
}

interface Props extends PageProps {
  tag: ProductTag;
}

export default function TagsShow({ auth, tag }: Props) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this tag?')) {
      // This would typically use Inertia's delete method
      // delete(route('admin.tags.destroy', tag.id));
    }
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
            <FiTag className="h-6 w-6" />
            Tag Details
          </h2>
        </div>
      }
    >
      <Head title={`Tag - ${tag.name}`} />

      <div className="py-12">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiTag className="h-8 w-8" />
                {tag.name}
              </h1>
              <p className="text-gray-600 mt-1">Tag details and associated products</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={route('admin.tags.index')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to Tags
              </Link>
              <Link
                href={route('admin.tags.edit', tag.id)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiEdit className="h-4 w-4" />
                Edit
              </Link>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tag Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Tag Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg font-semibold text-gray-900">{tag.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Slug</label>
                    <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                      {tag.slug}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Products Count</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {tag.products?.length || 0} products
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-900">
                      {new Date(tag.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-900">
                      {new Date(tag.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Associated Products */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiPackage className="h-5 w-5" />
                    Associated Products ({tag.products?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tag.products && tag.products.length > 0 ? (
                    <div className="space-y-4">
                      {tag.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{product.title}</h3>
                            <p className="text-sm text-gray-500 font-mono">{product.slug}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                {product.status}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {product.currency} {product.base_price}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={route('admin.products.show', product.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Product
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiPackage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No products associated with this tag yet.</p>
                      <Link
                        href={route('admin.products.index')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                      >
                        Browse Products
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}