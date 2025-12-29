import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/updates') ||
    location.pathname.startsWith('/course/') ||
    location.pathname.startsWith('/checkout/')
  ) {
    return null;
  }

  return (
    <header className="md:hidden sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4">
        <button onClick={() => navigate('/')} className="flex items-center">
          <img
            src="/copy_of_webinar_13042025_-_11999_999.png"
            alt="Born Genius"
            className="h-10 w-auto"
          />
        </button>

        <button
          className="relative p-2 hover:bg-brand-orange/10 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-brand-orange" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-coral rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
