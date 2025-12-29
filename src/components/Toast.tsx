import React, { useEffect } from 'react';
import { CheckCircle, Info, XCircle } from 'lucide-react';
import { ToastType } from '../types';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-brand-green" />,
    error: <XCircle className="w-5 h-5 text-brand-red" />,
    info: <Info className="w-5 h-5 text-brand-sky" />,
  };

  const bgColors = {
    success: 'bg-brand-green/10 border-brand-green/30',
    error: 'bg-brand-red/10 border-brand-red/30',
    info: 'bg-brand-sky/10 border-brand-sky/30',
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className={`${bgColors[type]} border rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-[90vw]`}>
        {icons[type]}
        <p className="text-sm font-medium text-gray-800">{message}</p>
      </div>
    </div>
  );
};
