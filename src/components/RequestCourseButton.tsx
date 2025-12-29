import React from 'react';
import { Plus } from 'lucide-react';

interface RequestCourseButtonProps {
  onClick: () => void;
}

export const RequestCourseButton: React.FC<RequestCourseButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-20 left-0 right-0 z-30 pointer-events-none">
      <div className="max-w-[420px] mx-auto px-4">
        <button
          onClick={onClick}
          className="w-full bg-gradient-to-r from-brand-orange to-brand-coral text-white rounded-2xl shadow-lg py-3.5 px-6 flex items-center justify-center gap-2 font-semibold text-base transition-transform active:scale-95 hover:shadow-xl pointer-events-auto"
          style={{ minHeight: '48px' }}
        >
          <Plus className="w-5 h-5" />
          Request New Course
        </button>
      </div>
    </div>
  );
};
