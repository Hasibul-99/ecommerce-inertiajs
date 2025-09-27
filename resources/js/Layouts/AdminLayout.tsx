import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
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
  FiActivity
} from 'react-icons/fi';

interface AdminLayoutProps {
  user: User;
  header: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminLayout({ user, header, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white">
          <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-white">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              <Link
                href={route('admin.dashboard')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiHome className="w-5 h-5 mr-3 text-gray-500" />
                Dashboard
              </Link>
              <Link
                href={route('admin.orders.index')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiShoppingCart className="w-5 h-5 mr-3 text-gray-500" />
                Orders
              </Link>
              <Link
                href={route('admin.products.index')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiShoppingBag className="w-5 h-5 mr-3 text-gray-500" />
                Products
              </Link>
              <Link
                href={route('admin.vendors.index')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiUsers className="w-5 h-5 mr-3 text-gray-500" />
                Vendors
              </Link>
              <Link
                href={route('admin.categories.index')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiPackage className="w-5 h-5 mr-3 text-gray-500" />
                Categories
              </Link>
              <Link
                href={route('admin.transactions.index')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiDollarSign className="w-5 h-5 mr-3 text-gray-500" />
                Transactions
              </Link>
              <Link
                href={route('admin.settings.index')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiSettings className="w-5 h-5 mr-3 text-gray-500" />
                Settings
              </Link>
              <Link
                href={route('admin.activity-logs.index')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiActivity className="w-5 h-5 mr-3 text-gray-500" />
                Activity Logs
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 bg-gray-800">
            <span className="text-xl font-semibold text-white">Admin Panel</span>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <Link
                href={route('admin.dashboard')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiHome className="w-5 h-5 mr-3 text-gray-500" />
                Dashboard
              </Link>
              <Link
                href={route('admin.orders.index')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiShoppingCart className="w-5 h-5 mr-3 text-gray-500" />
                Orders
              </Link>
              <Link
                href="#"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiShoppingBag className="w-5 h-5 mr-3 text-gray-500" />
                Products
              </Link>
              <Link
                href={route('admin.vendors.index')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiUsers className="w-5 h-5 mr-3 text-gray-500" />
                Vendors
              </Link>
              <Link
                href="#"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiPackage className="w-5 h-5 mr-3 text-gray-500" />
                Categories
              </Link>
              <Link
                href="#"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiDollarSign className="w-5 h-5 mr-3 text-gray-500" />
                Transactions
              </Link>
              <Link
                href="#"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FiSettings className="w-5 h-5 mr-3 text-gray-500" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex h-16 bg-white shadow">
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-4 text-gray-500 border-r border-gray-200 md:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="flex justify-between flex-1 px-4">
              <div className="flex items-center flex-1">
                {header}
              </div>
              <div className="flex items-center ml-4 md:ml-6">
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <span className="mr-3 text-sm font-medium text-gray-700">{user.name}</span>
                    <Link
                      href={route('logout')}
                      method="post"
                      as="button"
                      className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiLogOut className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}