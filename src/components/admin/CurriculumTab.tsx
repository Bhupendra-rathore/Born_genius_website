import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CourseFormData } from '../../services/coursesService';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const CurriculumTab: React.FC<Props> = ({ formData, setFormData }) => {
  const curriculum = formData.curriculum || [];
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const addModule = () => {
    const newWeekNumber = curriculum.length + 1;
    setFormData({
      ...formData,
      curriculum: [
        ...curriculum,
        { weekNumber: newWeekNumber, title: '', description: '' },
      ],
    });
  };

  const updateModule = (
    index: number,
    field: 'weekNumber' | 'title' | 'description',
    value: string | number
  ) => {
    const updated = [...curriculum];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, curriculum: updated });
  };

  const removeModule = (index: number) => {
    const updated = curriculum.filter((_, i) => i !== index);
    const reindexed = updated.map((module, i) => ({
      ...module,
      weekNumber: i + 1,
    }));
    setFormData({ ...formData, curriculum: reindexed });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Curriculum</h3>
        <button
          type="button"
          onClick={addModule}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Week
        </button>
      </div>

      <div className="space-y-3">
        {curriculum.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No curriculum modules added yet
          </div>
        ) : (
          curriculum.map((module, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-700">Week {module.weekNumber}</span>
                  <span className="text-gray-900">{module.title || 'Untitled'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeModule(index);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedIndex === index && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Week Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={module.weekNumber}
                      onChange={(e) =>
                        updateModule(index, 'weekNumber', parseInt(e.target.value) || 1)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModule(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Introduction to Chess"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={module.description}
                      onChange={(e) => updateModule(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of what will be covered"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
