import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Wrench, ShoppingBag, User } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/games', label: 'Tools', icon: Wrench },
  { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { path: '/account', label: 'Account', icon: User },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname.startsWith('/course/') || location.pathname.startsWith('/updates/')) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-[420px] mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/'
            ? location.pathname === path
            : location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-brand-blue' : 'text-gray-500'
              }`}
              aria-label={label}
            >
              <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
