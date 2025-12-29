import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Wrench, ShoppingBag, User, Bell } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/games', label: 'Tools', icon: Wrench },
  { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
];

export const DesktopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="hidden md:block sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <img
                src="/copy_of_webinar_13042025_-_11999_999.png"
                alt="Born Genius"
                className="h-12 w-auto"
              />
            </button>

            <div className="flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = path === '/'
                  ? location.pathname === path
                  : location.pathname.startsWith(path);
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      isActive
                        ? 'bg-brand-blue/10 text-brand-blue'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative p-2 hover:bg-brand-orange/10 rounded-full transition-colors group"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 text-brand-orange" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-coral rounded-full"></span>
            </button>

            <button
              onClick={() => navigate('/account')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                location.pathname.startsWith('/account')
                  ? 'bg-gradient-to-r from-brand-orange to-brand-coral text-white shadow-md'
                  : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
              }`}
            >
              <User className="w-5 h-5" strokeWidth={2.5} />
              <span>Account</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
