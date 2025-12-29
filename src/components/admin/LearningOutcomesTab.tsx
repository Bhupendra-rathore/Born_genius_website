import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { CourseFormData } from '../../services/coursesService';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const LearningOutcomesTab: React.FC<Props> = ({ formData, setFormData }) => {
  const outcomes = formData.learningOutcomes || [];

  const addOutcome = () => {
    setFormData({
      ...formData,
      learningOutcomes: [...outcomes, { text: '', icon: '✅' }],
    });
  };

  const updateOutcome = (index: number, field: 'text' | 'icon', value: string) => {
    const updated = [...outcomes];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, learningOutcomes: updated });
  };

  const removeOutcome = (index: number) => {
    const updated = outcomes.filter((_, i) => i !== index);
    setFormData({ ...formData, learningOutcomes: updated });
  };

  const moveOutcome = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === outcomes.length - 1)
    ) {
      return;
    }

    const updated = [...outcomes];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setFormData({ ...formData, learningOutcomes: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Learning Outcomes</h3>
        <button
          type="button"
          onClick={addOutcome}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Outcome
        </button>
      </div>

      <div className="space-y-3">
        {outcomes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No learning outcomes added yet
          </div>
        ) : (
          outcomes.map((outcome, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex flex-col gap-1 mt-2">
                <button
                  type="button"
                  onClick={() => moveOutcome(index, 'up')}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                value={outcome.icon}
                onChange={(e) => updateOutcome(index, 'icon', e.target.value)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={2}
              />

              <input
                type="text"
                value={outcome.text}
                onChange={(e) => updateOutcome(index, 'text', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what students will learn"
              />

              <button
                type="button"
                onClick={() => removeOutcome(index)}
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
