import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEventHandler, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

interface EmailTemplate {
    id: number;
    name: string;
    slug: string;
    subject: string;
    body_html: string;
    body_text: string;
    variables: string[];
    is_active: boolean;
}

interface Props extends PageProps {
    template: EmailTemplate;
    sampleData: Record<string, any>;
}

export default function Edit({ auth, template, sampleData }: Props) {
    const [showPreview, setShowPreview] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const [showTestModal, setShowTestModal] = useState(false);
    const [testEmail, setTestEmail] = useState('');

    const { data, setData, put, processing, errors } = useForm({
        name: template.name,
        subject: template.subject,
        body_html: template.body_html,
        body_text: template.body_text,
        is_active: template.is_active,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.email-templates.update', template.id), {
            preserveScroll: true,
        });
    };

    const handlePreview = async () => {
        try {
            const response = await fetch(route('admin.email-templates.preview', template.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ sampleData }),
            });

            const result = await response.json();
            setPreviewHtml(result.body_html);
            setShowPreview(true);
        } catch (error) {
            console.error('Preview failed:', error);
        }
    };

    const handleSendTest = async () => {
        if (!testEmail) return;

        try {
            const response = await fetch(route('admin.email-templates.send-test', template.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email: testEmail }),
            });

            if (response.ok) {
                alert(`Test email sent to ${testEmail}`);
                setShowTestModal(false);
                setTestEmail('');
            }
        } catch (error) {
            console.error('Send test failed:', error);
        }
    };

    const insertVariable = (variable: string) => {
        const textarea = document.querySelector('textarea[name="body_html"]') as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = data.body_html;
            const before = text.substring(0, start);
            const after = text.substring(end);
            setData('body_html', before + `{{${variable}}}` + after);
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Email Template: {template.name}
                    </h2>
                    <Link
                        href={route('admin.email-templates.index')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Back to Templates
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Template: ${template.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Template Name" />
                                        <TextInput
                                            id="name"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            disabled
                                        />
                                        <p className="mt-1 text-sm text-gray-500">Template name cannot be changed</p>
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="subject" value="Email Subject" />
                                        <TextInput
                                            id="subject"
                                            className="mt-1 block w-full"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            required
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Use &#123;&#123;variable&#125;&#125; for dynamic content
                                        </p>
                                        <InputError className="mt-2" message={errors.subject} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="body_html" value="HTML Body" />
                                        <textarea
                                            id="body_html"
                                            name="body_html"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            rows={15}
                                            value={data.body_html}
                                            onChange={(e) => setData('body_html', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.body_html} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="body_text" value="Plain Text Body (Optional)" />
                                        <textarea
                                            id="body_text"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            rows={10}
                                            value={data.body_text}
                                            onChange={(e) => setData('body_text', e.target.value)}
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            If not provided, HTML will be converted to plain text
                                        </p>
                                        <InputError className="mt-2" message={errors.body_text} />
                                    </div>

                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Template is active</span>
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={processing}>
                                            Save Changes
                                        </PrimaryButton>

                                        <SecondaryButton type="button" onClick={handlePreview}>
                                            Preview
                                        </SecondaryButton>

                                        <SecondaryButton type="button" onClick={() => setShowTestModal(true)}>
                                            Send Test Email
                                        </SecondaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar - Available Variables */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Available Variables
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Click to insert into template
                                </p>
                                <div className="space-y-2">
                                    {template.variables.map((variable) => (
                                        <button
                                            key={variable}
                                            type="button"
                                            onClick={() => insertVariable(variable)}
                                            className="block w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md font-mono"
                                        >
                                            &#123;&#123;{variable}&#125;&#125;
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Template Info</h4>
                                    <dl className="text-sm space-y-1">
                                        <div>
                                            <dt className="text-gray-500">Slug</dt>
                                            <dd className="font-mono text-gray-900">{template.slug}</dd>
                                        </div>
                                        <div className="mt-2">
                                            <dt className="text-gray-500">Status</dt>
                                            <dd className={template.is_active ? 'text-green-600' : 'text-red-600'}>
                                                {template.is_active ? 'Active' : 'Inactive'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Email Preview</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="border rounded p-4 bg-gray-50 overflow-auto max-h-96">
                            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Test Email Modal */}
            {showTestModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Send Test Email</h3>
                            <button
                                onClick={() => setShowTestModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="test_email" value="Email Address" />
                                <TextInput
                                    id="test_email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="test@example.com"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <PrimaryButton onClick={handleSendTest}>
                                    Send Test
                                </PrimaryButton>
                                <SecondaryButton onClick={() => setShowTestModal(false)}>
                                    Cancel
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
