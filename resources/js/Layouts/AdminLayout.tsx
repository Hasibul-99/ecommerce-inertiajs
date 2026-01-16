import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types/index';
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiPackage,
  FiDollarSign,
  FiMenu,
  FiX,
  FiLogOut,
  FiShoppingCart,
  FiActivity,
  FiSearch,
  FiBell,
  FiUser,
  FiChevronDown,
  FiChevronRight,
  FiSun,
  FiMoon,
  FiGrid,
  FiBarChart,
  FiTag,
  FiCreditCard,
  FiShield,
  FiFileText,
  FiTruck,
  FiGift,
  FiMessageSquare,
  FiMaximize2,
  FiMinimize2
} from 'react-icons/fi';

interface AdminLayoutProps {
  user: User;
  header: React.ReactNode;
  children: React.ReactNode;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<any>;
  badge?: string;
  children?: MenuItem[];
}

// Separate component for menu items with children to avoid hooks violation
const MenuItemWithChildren = ({
  item,
  sidebarCollapsed
}: {
  item: MenuItem;
  sidebarCollapsed: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = item.icon;

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
          text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
        `}
      >
        <Icon className="flex-shrink-0 w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
        <span className="flex-1 text-left">{item.name}</span>
        {item.badge && (
          <span className="mr-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {item.badge}
          </span>
        )}
        {isExpanded ? (
          <FiChevronDown className="w-4 h-4" />
        ) : (
          <FiChevronRight className="w-4 h-4" />
        )}
      </button>
      {isExpanded && (
        <div className="space-y-1 ml-3">
          {item.children?.map((child: MenuItem) => (
            <MenuItemLink key={child.name} item={child} isChild={true} sidebarCollapsed={sidebarCollapsed} />
          ))}
        </div>
      )}
    </div>
  );
};

// Separate component for regular menu items
const MenuItemLink = ({
  item,
  isChild = false,
  sidebarCollapsed
}: {
  item: MenuItem;
  isChild?: boolean;
  sidebarCollapsed: boolean;
}) => {
  const { url } = usePage();
  const Icon = item.icon;

  const isActiveRoute = (href: string) => {
    if (href === '#') return false;
    return url.startsWith(href) || url === href;
  };

  const isActive = item.href ? isActiveRoute(item.href) : false;

  return (
    <Link
      href={item.href || '#'}
      className={`
        group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
        ${isChild ? 'ml-6 pl-8' : ''}
        ${isActive
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
        }
        ${sidebarCollapsed && !isChild ? 'justify-center px-2' : ''}
      `}
    >
      <Icon className={`flex-shrink-0 ${sidebarCollapsed && !isChild ? 'w-6 h-6' : 'w-5 h-5 mr-3'} ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
      {(!sidebarCollapsed || isChild) && (
        <>
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
};

export default function AdminLayout({ user, header, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['main']);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { url } = usePage();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const menuGroups = {
    main: {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: FiHome },
        {
          name: 'Reports & Analytics',
          icon: FiBarChart,
          children: [
            { name: 'Overview', href: route('admin.reports.dashboard'), icon: FiHome },
            { name: 'Sales', href: route('admin.reports.sales'), icon: FiDollarSign },
            { name: 'Orders', href: route('admin.reports.orders'), icon: FiShoppingCart },
            { name: 'Products', href: route('admin.reports.products'), icon: FiPackage },
            { name: 'Vendors', href: route('admin.reports.vendors'), icon: FiTruck },
            { name: 'Customers', href: route('admin.reports.customers'), icon: FiUsers },
          ]
        },
      ]
    },
    ecommerce: {
      title: 'E-Commerce',
      items: [
        { name: 'Orders', href: route('admin.orders.index'), icon: FiShoppingCart },
        { name: 'Products', href: route('admin.products.index'), icon: FiShoppingBag },
        { name: 'Product Variants', href: route('admin.product-variants.index'), icon: FiPackage },
        { name: 'Categories', href: route('admin.categories.index'), icon: FiGrid },
        { name: 'Tags', href: route('admin.tags.index'), icon: FiTag },
        { name: 'Coupons', href: route('admin.coupons.index'), icon: FiGift },
      ]
    },
    users: {
      title: 'User Management',
      items: [
        { name: 'Users', href: route('admin.users.index'), icon: FiUsers },
        { name: 'Vendors', href: route('admin.vendors.index'), icon: FiTruck },
        { name: 'Roles & Permissions', href: route('admin.roles.index'), icon: FiShield },
      ]
    },
    finance: {
      title: 'Finance',
      items: [
        { name: 'Payouts', href: route('admin.payouts.index'), icon: FiDollarSign },
        { name: 'COD Reconciliation', href: route('admin.cod-reconciliation.index'), icon: FiCreditCard },
      ]
    },
    communications: {
      title: 'Communications',
      items: [
        { name: 'Email Templates', href: route('admin.email-templates.index'), icon: FiMessageSquare },
        { name: 'Notifications', href: route('admin.notifications.index'), icon: FiBell },
      ]
    },
    system: {
      title: 'System',
      items: [
        {
          name: 'Settings',
          icon: FiSettings,
          children: [
            { name: 'General', href: route('admin.settings.general'), icon: FiSettings },
            { name: 'Payment', href: route('admin.settings.payment'), icon: FiCreditCard },
            { name: 'Shipping', href: route('admin.settings.shipping'), icon: FiTruck },
            { name: 'Email', href: route('admin.settings.email'), icon: FiMessageSquare },
            { name: 'Vendor', href: route('admin.settings.vendor'), icon: FiShoppingBag },
            { name: 'Tax', href: route('admin.settings.tax'), icon: FiFileText },
          ]
        },
        { name: 'Activity Logs', href: route('admin.activity-logs.index'), icon: FiActivity },
      ]
    }
  };

  const renderMenuGroup = (groupKey: string, group: any) => {
    const isExpanded = expandedGroups.includes(groupKey);

    if (sidebarCollapsed) {
      return (
        <div key={groupKey} className="space-y-1">
          {group.items.map((item: MenuItem) => {
            const hasChildren = item.children && item.children.length > 0;
            if (hasChildren) {
              return <MenuItemLink key={item.name} item={item} sidebarCollapsed={sidebarCollapsed} />;
            }
            return <MenuItemLink key={item.name} item={item} sidebarCollapsed={sidebarCollapsed} />;
          })}
        </div>
      );
    }

    return (
      <div key={groupKey} className="space-y-1">
        <button
          onClick={() => toggleGroup(groupKey)}
          className="w-full flex items-center px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <span className="flex-1 text-left">{group.title}</span>
          {isExpanded ? (
            <FiChevronDown className="w-4 h-4" />
          ) : (
            <FiChevronRight className="w-4 h-4" />
          )}
        </button>
        {isExpanded && (
          <div className="space-y-1">
            {group.items.map((item: MenuItem) => {
              const hasChildren = item.children && item.children.length > 0;
              if (hasChildren) {
                return <MenuItemWithChildren key={item.name} item={item} sidebarCollapsed={sidebarCollapsed} />;
              }
              return <MenuItemLink key={item.name} item={item} sidebarCollapsed={sidebarCollapsed} />;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <FiGrid className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-white">AdminHub</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-6">
            {Object.entries(menuGroups).map(([key, group]) => renderMenuGroup(key, group))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ${
        sidebarCollapsed ? 'md:w-16' : 'md:w-64'
      }`}>
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <FiGrid className="w-5 h-5 text-blue-600" />
              </div>
              {!sidebarCollapsed && (
                <span className="ml-3 text-xl font-bold text-white">AdminHub</span>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-auto text-white hover:text-gray-200 transition-colors"
            >
              {sidebarCollapsed ? <FiMaximize2 className="w-5 h-5" /> : <FiMinimize2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-6">
              {Object.entries(menuGroups).map(([key, group]) => renderMenuGroup(key, group))}
            </nav>
          </div>

          {/* User section */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}>
        {/* Enhanced Header */}
        <div className="sticky top-0 z-30 flex h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 md:hidden hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <div className="flex justify-between flex-1 px-4 sm:px-6">
            {/* Left side - Header content */}
            <div className="flex items-center flex-1">
              {header}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden sm:block">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  />
                </div>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                >
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <p className="text-sm text-gray-900 dark:text-white">New order received</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <p className="text-sm text-gray-900 dark:text-white">Vendor approval pending</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
                    {user.name}
                  </span>
                  <FiChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiUser className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiSettings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <Link
                      href={route('logout')}
                      method="post"
                      as="button"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {children}
        </main>
      </div>

      {/* Click outside handlers */}
      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
      )}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
      )}
    </div>
  );
}