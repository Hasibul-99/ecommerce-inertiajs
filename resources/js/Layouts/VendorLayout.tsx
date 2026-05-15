import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import NotificationBell from '@/Components/NotificationBell';
import { User, PageProps } from '@/types/index';
import {
    FiHome,
    FiPackage,
    FiShoppingCart,
    FiDollarSign,
    FiBarChart2,
    FiSettings,
    FiMenu,
    FiX,
    FiLogOut,
    FiUser,
    FiChevronDown,
    FiChevronRight,
    FiSun,
    FiMoon,
    FiPlus,
    FiList,
    FiTrendingUp,
    FiUsers,
    FiCreditCard,
    FiRepeat,
    FiGrid,
    FiMaximize2,
    FiMinimize2,
    FiExternalLink,
} from 'react-icons/fi';

interface VendorLayoutProps {
    user: User;
    header?: React.ReactNode;
    children: React.ReactNode;
}

interface MenuItem {
    name: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    children?: MenuItem[];
}

interface MenuGroup {
    key: string;
    label?: string;
    items: MenuItem[];
}

// Defined outside component — stable reference across renders
const MENU_GROUPS: MenuGroup[] = [
    {
        key: 'main',
        items: [
            { name: 'Dashboard', href: route('vendor.dashboard'), icon: FiHome },
        ],
    },
    {
        key: 'store',
        label: 'Store',
        items: [
            {
                name: 'Products',
                icon: FiPackage,
                children: [
                    { name: 'All Products', href: route('vendor.products.index'), icon: FiList },
                    { name: 'Add Product',  href: route('vendor.products.create'), icon: FiPlus },
                ],
            },
            { name: 'Orders', href: route('vendor.orders.index'), icon: FiShoppingCart },
        ],
    },
    {
        key: 'finance',
        label: 'Finance',
        items: [
            {
                name: 'Earnings',
                icon: FiDollarSign,
                children: [
                    { name: 'Overview',     href: route('vendor.earnings.dashboard'),    icon: FiGrid },
                    { name: 'Transactions', href: route('vendor.earnings.transactions'), icon: FiRepeat },
                    { name: 'Payouts',      href: route('vendor.earnings.payouts'),      icon: FiCreditCard },
                ],
            },
        ],
    },
    {
        key: 'analytics',
        label: 'Analytics',
        items: [
            {
                name: 'Analytics',
                icon: FiBarChart2,
                children: [
                    { name: 'Sales',     href: route('vendor.analytics.sales'),     icon: FiTrendingUp },
                    { name: 'Products',  href: route('vendor.analytics.products'),  icon: FiPackage },
                    { name: 'Customers', href: route('vendor.analytics.customers'), icon: FiUsers },
                ],
            },
        ],
    },
    {
        key: 'account',
        label: 'Account',
        items: [
            { name: 'Settings', href: route('vendor.settings'), icon: FiSettings },
        ],
    },
];

// ── Sub-item with children (collapsible) ────────────────────────────────────
function MenuItemWithChildren({ item, collapsed }: { item: MenuItem; collapsed: boolean }) {
    const { url } = usePage();
    const anyChildActive = item.children?.some(c => c.href && url.startsWith(c.href)) ?? false;
    const [open, setOpen] = useState(anyChildActive);
    const Icon = item.icon;

    return (
        <div className="space-y-0.5">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-gray-700 hover:text-brand-700 dark:hover:text-brand-300"
            >
                <Icon className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400 group-hover:text-brand-500" />
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {open
                            ? <FiChevronDown className="w-4 h-4 text-gray-400" />
                            : <FiChevronRight className="w-4 h-4 text-gray-400" />}
                    </>
                )}
            </button>
            {open && !collapsed && (
                <div className="ml-3 pl-3 border-l-2 border-brand-100 dark:border-brand-900/50 space-y-0.5">
                    {item.children?.map(child => (
                        <MenuItemLink key={child.name} item={child} isChild collapsed={false} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Leaf nav link ────────────────────────────────────────────────────────────
function MenuItemLink({ item, isChild = false, collapsed }: { item: MenuItem; isChild?: boolean; collapsed: boolean }) {
    const { url } = usePage();
    const Icon = item.icon;
    const active = item.href
        ? item.href !== '#' && (url === item.href || url.startsWith(item.href + '/') || url.startsWith(item.href + '?'))
        : false;

    return (
        <Link
            href={item.href ?? '#'}
            className={[
                'group flex items-center rounded-lg transition-colors text-sm font-medium',
                isChild ? 'px-3 py-2' : 'px-3 py-2.5',
                collapsed && !isChild ? 'justify-center px-2' : '',
                active
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-gray-700 hover:text-brand-700 dark:hover:text-brand-300',
            ].join(' ')}
        >
            <Icon className={[
                'flex-shrink-0',
                collapsed && !isChild ? 'w-5 h-5' : 'w-4 h-4 mr-3',
                active ? 'text-white' : 'text-gray-400 group-hover:text-brand-500',
            ].join(' ')} />
            {(!collapsed || isChild) && <span className="flex-1">{item.name}</span>}
        </Link>
    );
}

// ── Sidebar content (extracted — stable reference) ───────────────────────────
interface SidebarProps {
    user: User;
    collapsed: boolean;
    onCollapse: (v: boolean) => void;
}

function SidebarContent({ user, collapsed, onCollapse }: SidebarProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Brand header */}
            <div className={`flex items-center h-16 px-4 bg-gradient-to-r from-brand-500 to-brand-600 flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed ? (
                    <>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <FiGrid className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm leading-none">Vendor Hub</p>
                                <p className="text-brand-100 text-xs mt-0.5 truncate max-w-[130px]">{user.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onCollapse(true)}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <FiMinimize2 className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <FiGrid className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
                {MENU_GROUPS.map(group => (
                    <div key={group.key}>
                        {group.label && !collapsed && (
                            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                {group.label}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map(item =>
                                item.children
                                    ? <MenuItemWithChildren key={item.name} item={item} collapsed={collapsed} />
                                    : <MenuItemLink key={item.name} item={item} collapsed={collapsed} />
                            )}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Expand button (collapsed state) */}
            {collapsed && (
                <div className="px-2 pb-3">
                    <button
                        onClick={() => onCollapse(false)}
                        title="Expand sidebar"
                        className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiMaximize2 className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* User footer (expanded) */}
            {!collapsed && (
                <div className="px-3 pb-4 flex-shrink-0 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link
                            href={route('vendor.settings')}
                            title="Settings"
                            className="text-gray-400 hover:text-brand-500 transition-colors"
                        >
                            <FiSettings className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main layout ──────────────────────────────────────────────────────────────
export default function VendorLayout({ user, header, children }: VendorLayoutProps) {
    const [sidebarOpen, setSidebarOpen]       = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [darkMode, setDarkMode]             = useState(false);
    const [showUserMenu, setShowUserMenu]     = useState(false);
    const { props } = usePage<PageProps>();
    const flash = props.flash as PageProps['flash'];

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error)   toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const saved = localStorage.getItem('darkMode') === 'true';
        setDarkMode(saved);
        if (saved) document.documentElement.classList.add('dark');
    }, []);

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('darkMode', String(next));
        document.documentElement.classList.toggle('dark', next);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 md:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
                >
                    <FiX className="w-5 h-5" />
                </button>
                <SidebarContent user={user} collapsed={false} onCollapse={() => setSidebarOpen(false)} />
            </div>

            {/* Desktop sidebar */}
            <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm ${
                sidebarCollapsed ? 'md:w-16' : 'md:w-60'
            }`}>
                <SidebarContent user={user} collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
            </div>

            {/* Content area */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-60'}`}>

                {/* Top bar */}
                <div className="sticky top-0 z-50 flex h-14 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 md:hidden hover:text-gray-700"
                    >
                        <FiMenu className="w-5 h-5" />
                    </button>

                    <div className="flex justify-between flex-1 px-4 sm:px-5">
                        <div className="flex items-center flex-1 gap-3">
                            {header && (
                                <span className="text-sm font-semibold text-gray-800 dark:text-white">{header}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                            >
                                <FiExternalLink className="w-3.5 h-3.5" />
                                View Store
                            </a>

                            <button
                                onClick={toggleDarkMode}
                                title="Toggle dark mode"
                                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                            </button>

                            <NotificationBell />

                            {/* User dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(v => !v)}
                                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <FiChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50">
                                        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href={route('vendor.settings')}
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <FiSettings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <Link
                                            href={route('profile.edit')}
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <FiUser className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                                            <button
                                                onClick={() => router.post(route('logout'))}
                                                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <FiLogOut className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page */}
                <main className="min-h-[calc(100vh-3.5rem)]">
                    {children}
                </main>
            </div>

            {/* Click-outside to close user menu */}
            {showUserMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            )}

            <Toaster position="top-right" richColors closeButton />
        </div>
    );
}
