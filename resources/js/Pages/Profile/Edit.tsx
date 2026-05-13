import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import {
    FiUser, FiLock, FiAlertTriangle,
    FiMail, FiCheck, FiEye, FiEyeOff, FiTrash2,
} from 'react-icons/fi';
import { PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import AccountSidebar from '@/Components/Customer/AccountSidebar';

interface ProfileEditProps extends PageProps {
    mustVerifyEmail: boolean;
    status?: string;
    cartCount?: number;
    wishlistCount?: number;
}

type TabId = 'profile' | 'security' | 'danger';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'profile',  label: 'Profile',      icon: <FiUser className="w-4 h-4" /> },
    { id: 'security', label: 'Security',     icon: <FiLock className="w-4 h-4" /> },
    { id: 'danger',   label: 'Danger Zone',  icon: <FiAlertTriangle className="w-4 h-4" /> },
];

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
    cartCount = 0,
    wishlistCount = 0,
}: ProfileEditProps) {
    const [activeTab, setActiveTab] = useState<TabId>('profile');

    return (
        <FrontendLayout auth={auth} cartCount={cartCount} wishlistCount={wishlistCount}>
            <Head title="Account Settings" />

            {/* Header */}
            <div className="bg-grabit-bg-light py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-heading font-bold text-grabit-dark mb-2">
                        Account Settings
                    </h1>
                    <p className="text-grabit-gray">Manage your profile and account preferences</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    <AccountSidebar user={auth.user} />

                    {/* ── Main content ── */}
                    <main className="lg:col-span-3 space-y-0">

                        {/* Tab bar */}
                        <div className="flex border-b border-grabit-border mb-6 bg-white rounded-t-lg overflow-hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                                        activeTab === tab.id
                                            ? 'border-grabit-primary text-grabit-primary bg-white'
                                            : 'border-transparent text-grabit-gray hover:text-grabit-dark hover:border-gray-300'
                                    } ${tab.id === 'danger' && activeTab !== 'danger' ? 'ml-auto' : ''}`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ── Profile tab ── */}
                        {activeTab === 'profile' && (
                            <ProfileForm
                                user={auth.user}
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        )}

                        {/* ── Security tab ── */}
                        {activeTab === 'security' && <SecurityForm />}

                        {/* ── Danger Zone tab ── */}
                        {activeTab === 'danger' && <DangerZone />}
                    </main>
                </div>
            </div>
        </FrontendLayout>
    );
}

/* ─────────────────────────────────────────
   Profile Information Form
───────────────────────────────────────── */
function ProfileForm({
    user,
    mustVerifyEmail,
    status,
}: {
    user: PageProps['auth']['user'];
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <div className="bg-white border border-grabit-border rounded-lg overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-5 border-b border-grabit-border">
                <h2 className="text-lg font-heading font-semibold text-grabit-dark">Profile Information</h2>
                <p className="text-sm text-grabit-gray mt-1">Update your name and email address.</p>
            </div>

            {/* Avatar strip */}
            <div className="px-6 py-5 border-b border-grabit-border bg-grabit-bg-light flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-grabit-primary flex items-center justify-center text-white text-3xl font-bold select-none">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-medium text-grabit-dark text-lg">{user.name}</p>
                    <p className="text-sm text-grabit-gray">{user.email}</p>
                </div>
            </div>

            {/* Form body */}
            <form onSubmit={submit} className="px-6 py-6 space-y-5">
                {/* Full Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-grabit-dark mb-1.5">
                        Full Name
                    </label>
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grabit-gray" />
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-grabit-primary transition-colors ${
                                errors.name ? 'border-red-400 bg-red-50' : 'border-grabit-border'
                            }`}
                            autoComplete="name"
                            required
                        />
                    </div>
                    {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-grabit-dark mb-1.5">
                        Email Address
                    </label>
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grabit-gray" />
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-grabit-primary transition-colors ${
                                errors.email ? 'border-red-400 bg-red-50' : 'border-grabit-border'
                            }`}
                            autoComplete="email"
                            required
                        />
                    </div>
                    {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}

                    {mustVerifyEmail && (user as any).email_verified_at === null && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                                Your email is unverified.{' '}
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="underline font-medium hover:text-yellow-900"
                                >
                                    Resend verification email
                                </Link>
                            </p>
                            {status === 'verification-link-sent' && (
                                <p className="mt-1 text-sm text-green-700 font-medium">
                                    Verification link sent to your inbox.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 bg-grabit-primary hover:bg-grabit-primary-dark disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        {processing ? 'Saving…' : 'Save Changes'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                            <FiCheck className="w-4 h-4" /> Saved
                        </span>
                    </Transition>
                </div>
            </form>
        </div>
    );
}

/* ─────────────────────────────────────────
   Security (Password) Form
───────────────────────────────────────── */
function SecurityForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const PasswordField = ({
        id,
        label,
        value,
        onChange,
        show,
        onToggle,
        inputRef,
        error,
        autoComplete,
    }: {
        id: string;
        label: string;
        value: string;
        onChange: (v: string) => void;
        show: boolean;
        onToggle: () => void;
        inputRef?: React.RefObject<HTMLInputElement>;
        error?: string;
        autoComplete?: string;
    }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-grabit-dark mb-1.5">
                {label}
            </label>
            <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grabit-gray" />
                <input
                    id={id}
                    ref={inputRef}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-grabit-primary transition-colors ${
                        error ? 'border-red-400 bg-red-50' : 'border-grabit-border'
                    }`}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grabit-gray hover:text-grabit-dark"
                    tabIndex={-1}
                >
                    {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        </div>
    );

    return (
        <div className="bg-white border border-grabit-border rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-grabit-border">
                <h2 className="text-lg font-heading font-semibold text-grabit-dark">Update Password</h2>
                <p className="text-sm text-grabit-gray mt-1">Use a long, random password to keep your account secure.</p>
            </div>

            <form onSubmit={submit} className="px-6 py-6 space-y-5">
                <PasswordField
                    id="current_password"
                    label="Current Password"
                    value={data.current_password}
                    onChange={(v) => setData('current_password', v)}
                    show={showCurrent}
                    onToggle={() => setShowCurrent(!showCurrent)}
                    inputRef={currentPasswordInput}
                    error={errors.current_password}
                    autoComplete="current-password"
                />
                <PasswordField
                    id="password"
                    label="New Password"
                    value={data.password}
                    onChange={(v) => setData('password', v)}
                    show={showNew}
                    onToggle={() => setShowNew(!showNew)}
                    inputRef={passwordInput}
                    error={errors.password}
                    autoComplete="new-password"
                />
                <PasswordField
                    id="password_confirmation"
                    label="Confirm New Password"
                    value={data.password_confirmation}
                    onChange={(v) => setData('password_confirmation', v)}
                    show={showConfirm}
                    onToggle={() => setShowConfirm(!showConfirm)}
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                />

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 bg-grabit-primary hover:bg-grabit-primary-dark disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        {processing ? 'Updating…' : 'Update Password'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                            <FiCheck className="w-4 h-4" /> Password updated
                        </span>
                    </Transition>
                </div>
            </form>
        </div>
    );
}

/* ─────────────────────────────────────────
   Danger Zone
───────────────────────────────────────── */
function DangerZone() {
    const [showModal, setShowModal] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, delete: destroy, processing, reset, errors } = useForm({ password: '' });

    const deleteAccount: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setShowModal(false),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    return (
        <>
            <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-red-200 bg-red-50 flex items-center gap-3">
                    <FiAlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                        <h2 className="text-lg font-heading font-semibold text-red-800">Danger Zone</h2>
                        <p className="text-sm text-red-600 mt-0.5">Irreversible and destructive actions</p>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-200 rounded-lg bg-red-50">
                        <div>
                            <h3 className="font-medium text-red-900 mb-1">Delete This Account</h3>
                            <p className="text-sm text-red-700">
                                Once your account is deleted, all data will be permanently removed. This action cannot be undone.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                        >
                            <FiTrash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <FiAlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-grabit-dark">
                                Delete Account
                            </h3>
                        </div>

                        <p className="text-sm text-grabit-gray mb-6">
                            Are you sure you want to delete your account? All of your data will be permanently removed.
                            Please enter your password to confirm.
                        </p>

                        <form onSubmit={deleteAccount} className="space-y-4">
                            <div>
                                <label htmlFor="delete_password" className="block text-sm font-medium text-grabit-dark mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grabit-gray" />
                                    <input
                                        id="delete_password"
                                        ref={passwordInput}
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full pl-10 pr-10 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors ${
                                            errors.password ? 'border-red-400 bg-red-50' : 'border-grabit-border'
                                        }`}
                                        placeholder="Enter your password"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-grabit-gray hover:text-grabit-dark"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2.5 border border-grabit-border text-grabit-dark text-sm font-medium rounded-md hover:bg-grabit-bg-light transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    {processing ? 'Deleting…' : 'Yes, Delete My Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
