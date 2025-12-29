import React from 'react';
import { CourseFormData } from '../../services/coursesService';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const BasicInfoTab: React.FC<Props> = ({ formData, setFormData }) => {
  const gradients = [
    'from-blue-500 to-blue-600',
    'from-orange-500 to-orange-600',
    'from-red-500 to-pink-500',
    'from-green-500 to-emerald-600',
    'from-cyan-500 to-blue-500',
    'from-pink-500 to-rose-600',
    'from-yellow-500 to-amber-600',
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Chess for Beginners"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Chess, Math, Science"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Range <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.ageRange}
            onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 6-10, 8-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 8 weeks"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description shown in course cards"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Description
        </label>
        <textarea
          value={formData.fullDescription}
          onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Detailed description for course detail page"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon (Emoji)
          </label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl"
            placeholder="📚"
            maxLength={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tier
          </label>
          <select
            value={formData.tier}
            onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="mini">Mini</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Gradient
        </label>
        <div className="grid grid-cols-4 gap-3">
          {gradients.map((gradient) => (
            <button
              key={gradient}
              type="button"
              onClick={() => setFormData({ ...formData, imageColor: gradient })}
              className={`h-12 rounded-lg bg-gradient-to-r ${gradient} ${
                formData.imageColor === gradient
                  ? 'ring-4 ring-blue-500 ring-offset-2'
                  : ''
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Count
          </label>
          <input
            type="number"
            min="0"
            value={formData.reviewCount}
            onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spots Left
          </label>
          <input
            type="number"
            min="0"
            value={formData.spotsLeft}
            onChange={(e) => setFormData({ ...formData, spotsLeft: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Viewing Now
          </label>
          <input
            type="number"
            min="0"
            value={formData.viewingNow}
            onChange={(e) => setFormData({ ...formData, viewingNow: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isPopular}
            onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Popular Course</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isLocked}
            onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Locked (Marketplace)</span>
        </label>
      </div>
    </div>
  );
};
