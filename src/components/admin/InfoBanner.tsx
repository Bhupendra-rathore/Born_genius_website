import React from 'react';
import { Info, X, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface InfoBannerProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  message: string;
  onDismiss?: () => void;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  type = 'info',
  message,
  onDismiss
}) => {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 mb-6`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`text-sm ${style.text}`}>{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
