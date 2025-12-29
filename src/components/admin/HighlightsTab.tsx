import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CourseFormData } from '../../services/coursesService';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const HighlightsTab: React.FC<Props> = ({ formData, setFormData }) => {
  const highlights = formData.highlights || [];

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...highlights, { text: '', included: true }],
    });
  };

  const updateHighlight = (index: number, field: 'text' | 'included', value: string | boolean) => {
    const updated = [...highlights];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, highlights: updated });
  };

  const removeHighlight = (index: number) => {
    const updated = highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Course Highlights</h3>
        <button
          type="button"
          onClick={addHighlight}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Highlight
        </button>
      </div>

      <div className="space-y-3">
        {highlights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No highlights added yet
          </div>
        ) : (
          highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={highlight.included}
                onChange={(e) => updateHighlight(index, 'included', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                value={highlight.text}
                onChange={(e) => updateHighlight(index, 'text', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What's included in this course?"
              />

              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
