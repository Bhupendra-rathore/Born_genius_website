import React from 'react';
import { Search, Bell, Calendar, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Global search"
                className="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                ⌘K
              </kbd>
            </div>

            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Calendar className="w-5 h-5" />
            </button>

            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                NA
              </div>
            </button>
          </div>

          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
