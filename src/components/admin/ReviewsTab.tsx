import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CourseFormData } from '../../services/coursesService';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const ReviewsTab: React.FC<Props> = ({ formData, setFormData }) => {
  const reviews = formData.reviews || [];
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const addReview = () => {
    setFormData({
      ...formData,
      reviews: [
        ...reviews,
        {
          parentName: '',
          parentPhoto: '👤',
          rating: 5,
          comment: '',
          reviewDate: new Date().toISOString().split('T')[0],
          verified: true,
          helpfulCount: 0,
        },
      ],
    });
  };

  const updateReview = (index: number, field: string, value: any) => {
    const updated = [...reviews];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, reviews: updated });
  };

  const removeReview = (index: number) => {
    const updated = reviews.filter((_, i) => i !== index);
    setFormData({ ...formData, reviews: updated });
  };

  const updateImages = (index: number, images: string) => {
    const imageArray = images.split('\n').filter((url) => url.trim());
    updateReview(index, 'images', imageArray);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Course Reviews</h3>
        <button
          type="button"
          onClick={addReview}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews added yet</div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{review.parentPhoto}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.parentName || 'Unnamed Parent'}
                    </div>
                    <div className="text-sm text-yellow-600">
                      {'⭐'.repeat(review.rating)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeReview(index);
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Name
                      </label>
                      <input
                        type="text"
                        value={review.parentName}
                        onChange={(e) => updateReview(index, 'parentName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John D."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo (Emoji)
                      </label>
                      <input
                        type="text"
                        value={review.parentPhoto}
                        onChange={(e) => updateReview(index, 'parentPhoto', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <select
                        value={review.rating}
                        onChange={(e) =>
                          updateReview(index, 'rating', parseInt(e.target.value))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={review.reviewDate}
                        onChange={(e) => updateReview(index, 'reviewDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Helpful Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={review.helpfulCount}
                        onChange={(e) =>
                          updateReview(index, 'helpfulCount', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={review.comment}
                      onChange={(e) => updateReview(index, 'comment', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Review text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URLs (one per line)
                    </label>
                    <textarea
                      value={(review.images || []).join('\n')}
                      onChange={(e) => updateImages(index, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image1.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL
                      </label>
                      <input
                        type="text"
                        value={review.videoUrl || ''}
                        onChange={(e) => updateReview(index, 'videoUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://youtube.com/embed/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Thumbnail URL
                      </label>
                      <input
                        type="text"
                        value={review.videoThumbnail || ''}
                        onChange={(e) => updateReview(index, 'videoThumbnail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/thumb.jpg"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={review.verified}
                      onChange={(e) => updateReview(index, 'verified', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Verified Review</span>
                  </label>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
