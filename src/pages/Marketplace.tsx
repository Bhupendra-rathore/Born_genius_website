import React, { useState } from 'react';
import { Lock, ShoppingBag, Package, Sparkles } from 'lucide-react';
import { Toast } from '../components/Toast';

const productCategories = [
  { id: '1', name: 'Educational Toys', icon: '🧩', description: 'Fun learning tools and educational games' },
  { id: '2', name: 'Books & Stationery', icon: '📚', description: 'Age-appropriate books and school supplies' },
  { id: '3', name: 'Arts & Crafts', icon: '🎨', description: 'Creative materials and craft kits' },
  { id: '4', name: 'STEM Kits', icon: '🔬', description: 'Science experiments and robotics kits' },
  { id: '5', name: 'Sports Equipment', icon: '⚽', description: 'Active play and sports gear' },
  { id: '6', name: 'Musical Instruments', icon: '🎸', description: 'Beginner-friendly instruments' },
];

export const Marketplace: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  const handleCategoryClick = () => {
    setShowToast(true);
  };

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      <main className="max-w-[420px] md:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-12">
        <div className="hidden md:block mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-8 h-8 text-brand-orange" />
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          </div>
          <p className="text-base text-gray-600">Shop educational products for kids</p>
        </div>

        <div className="mb-6 md:mb-8 px-5 py-4 md:py-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-brand-orange via-brand-coral to-pink-500 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-base md:text-xl font-bold">Coming Soon!</span>
          </div>
          <p className="text-sm md:text-base text-white/95 leading-relaxed">
            We're building an amazing marketplace with educational products, toys, books, and learning materials for your child. Stay tuned!
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Package className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">Product Categories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {productCategories.map((category) => (
            <button
              key={category.id}
              onClick={handleCategoryClick}
              className="bg-white rounded-2xl md:rounded-3xl shadow-sm border-2 border-gray-200 p-4 md:p-6 text-left transition-all hover:shadow-lg active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 to-brand-coral/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-gray-900">{category.name}</h3>
                      <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">View products</span>
                  <span className="px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold">
                    Launch Soon
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 md:mt-12 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-orange/20 to-brand-coral/20 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-brand-orange" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Get Notified</h3>
          <p className="text-sm text-gray-600 mb-4">
            Be the first to know when we launch our marketplace with exclusive products and special launch offers!
          </p>
          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors">
            Notify Me
          </button>
        </div>
      </main>

      {showToast && (
        <Toast
          message="Marketplace launching soon!"
          type="info"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
