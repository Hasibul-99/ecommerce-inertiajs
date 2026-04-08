import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';

interface EmailTemplate {
    id: number;
    name: string;
    slug: string;
    subject: string;
    is_active: boolean;
    updated_at: string;
    last_modified_by: string | null;
}

interface Props extends PageProps {
    templates: EmailTemplate[];
}

export default function Index({ auth, templates }: Props) {
    const handleToggleStatus = (templateId: number) => {
        router.patch(
            route('admin.email-templates.toggle-status', templateId),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Email Templates
                    </h2>
                </div>
            }
        >
            <Head title="Email Templates" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    Manage and customize email templates sent to customers and vendors.
                                    Templates support variable substitution using &#123;&#123;variable.name&#125;&#125; syntax.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Template Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Subject
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Modified
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {templates.map((template) => (
                                            <tr key={template.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {template.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {template.slug}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 truncate max-w-md">
                                                        {template.subject}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleToggleStatus(template.id)}
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            template.is_active
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                        }`}
                                                    >
                                                        {template.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div>{template.updated_at}</div>
                                                    {template.last_modified_by && (
                                                        <div className="text-xs text-gray-400">
                                                            by {template.last_modified_by}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link
                                                        href={route('admin.email-templates.edit', template.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {templates.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No email templates found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
