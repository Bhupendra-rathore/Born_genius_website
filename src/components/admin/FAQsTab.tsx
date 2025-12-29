import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CourseFormData } from '../../services/coursesService';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const FAQsTab: React.FC<Props> = ({ formData, setFormData }) => {
  const faqs = formData.faqs || [];
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqs: [...faqs, { question: '', answer: '' }],
    });
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, faqs: updated });
  };

  const removeFAQ = (index: number) => {
    const updated = faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
        <button
          type="button"
          onClick={addFAQ}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No FAQs added yet</div>
        ) : (
          faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {faq.question || 'No question set'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFAQ(index);
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
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="What is the question?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Provide a detailed answer"
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
