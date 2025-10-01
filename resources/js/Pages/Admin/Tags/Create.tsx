import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { FiTag, FiArrowLeft, FiSave } from 'react-icons/fi';

interface Props extends PageProps {}

export default function TagsCreate({ auth }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    slug: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.tags.store'));
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
            <FiTag className="h-6 w-6" />
            Create Tag
          </h2>
        </div>
      }
    >
      <Head title="Create Tag" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiTag className="h-8 w-8" />
                Create New Tag
              </h1>
              <p className="text-gray-600 mt-1">Add a new product tag</p>
            </div>
            <Link
              href={route('admin.tags.index')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to Tags
            </Link>
          </div>

          {/* Create Form */}
          <Card>
            <CardHeader>
              <CardTitle>Tag Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tag Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Tag Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Enter tag name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Tag Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      type="text"
                      value={data.slug}
                      onChange={(e) => setData('slug', e.target.value)}
                      placeholder="Leave empty to auto-generate"
                      className={errors.slug ? 'border-red-500' : ''}
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-600">{errors.slug}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      If left empty, slug will be automatically generated from the tag name
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Link
                    href={route('admin.tags.index')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <Button type="submit" disabled={processing} className="flex items-center gap-2">
                    <FiSave className="h-4 w-4" />
                    {processing ? 'Creating...' : 'Create Tag'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}