import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingCart, Users, MessageSquare, PlusCircle, Layout, Menu, X } from 'lucide-react';

export const Admin: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: Layout, exact: true },
    { path: '/admin/courses', label: 'Courses', icon: BookOpen },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
    { path: '/admin/course-requests', label: 'Course Requests', icon: PlusCircle },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage your courses</p>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-2 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center px-4 py-2.5 mb-1 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="lg:ml-64 pt-14 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};
