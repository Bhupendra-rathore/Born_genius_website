import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import {
  fetchCourseById,
  createCourse,
  updateCourse,
  CourseFormData,
} from '../../services/coursesService';
import { Toast } from '../../components/Toast';
import { BasicInfoTab } from '../../components/admin/BasicInfoTab';
import { InstructorTab } from '../../components/admin/InstructorTab';
import { LearningOutcomesTab } from '../../components/admin/LearningOutcomesTab';
import { HighlightsTab } from '../../components/admin/HighlightsTab';
import { CurriculumTab } from '../../components/admin/CurriculumTab';
import { ScheduleTab } from '../../components/admin/ScheduleTab';
import { PricingTab } from '../../components/admin/PricingTab';
import { ReviewsTab } from '../../components/admin/ReviewsTab';
import { FAQsTab } from '../../components/admin/FAQsTab';
import { AdditionalTab } from '../../components/admin/AdditionalTab';

type TabId =
  | 'basic'
  | 'instructor'
  | 'outcomes'
  | 'highlights'
  | 'curriculum'
  | 'schedule'
  | 'pricing'
  | 'reviews'
  | 'faqs'
  | 'additional';

export const CourseEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== 'new';

  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    category: '',
    ageRange: '',
    duration: '',
    description: '',
    fullDescription: '',
    tier: 'mini',
    imageColor: 'from-blue-500 to-blue-600',
    icon: '📚',
    rating: 0,
    reviewCount: 0,
    isPopular: false,
    isLocked: false,
    spotsLeft: 0,
    viewingNow: 0,
    instructorId: undefined,
    status: 'published',
    learningOutcomes: [],
    highlights: [],
    curriculum: [],
    schedule: undefined,
    pricing: undefined,
    reviews: [],
    faqs: [],
    prerequisites: [],
    relatedCourseIds: [],
  });

  useEffect(() => {
    if (isEdit && id) {
      loadCourse(id);
    }
  }, [id, isEdit]);

  const loadCourse = async (courseId: string) => {
    try {
      const course = await fetchCourseById(courseId);
      if (!course) {
        setToast({ type: 'error', message: 'Course not found' });
        navigate('/admin/courses');
        return;
      }

      setFormData({
        title: course.title,
        category: course.category,
        ageRange: course.ageRange,
        duration: course.duration,
        description: course.description,
        fullDescription: course.fullDescription || '',
        tier: course.tier || 'mini',
        imageColor: course.imageColor || 'from-blue-500 to-blue-600',
        icon: course.icon || '📚',
        rating: course.rating || 0,
        reviewCount: course.reviewCount || 0,
        isPopular: course.isPopular || false,
        isLocked: course.isLocked || false,
        spotsLeft: course.spotsLeft || 0,
        viewingNow: course.viewingNow || 0,
        instructorId: course.instructor?.id,
        status: 'published',
        learningOutcomes: course.learningOutcomes?.map((lo) => ({
          text: lo.text,
          icon: lo.icon,
        })) || [],
        highlights: course.highlights?.map((h) => ({
          text: h.text,
          included: h.included,
        })) || [],
        curriculum: course.curriculum?.map((c) => ({
          weekNumber: c.week,
          title: c.title,
          description: c.description,
        })) || [],
        schedule: course.schedule,
        pricing: course.pricing,
        reviews: course.reviews?.map((r) => ({
          parentName: r.parentName,
          parentPhoto: r.parentPhoto,
          rating: r.rating,
          comment: r.comment,
          reviewDate: r.date,
          verified: r.verified,
          images: r.images,
          videoUrl: r.videoUrl,
          videoThumbnail: r.videoThumbnail,
          helpfulCount: r.helpfulCount,
        })) || [],
        faqs: course.faqs || [],
        prerequisites: course.prerequisites || [],
        relatedCourseIds: course.relatedCourses || [],
      });
    } catch (error) {
      console.error('Error loading course:', error);
      setToast({ type: 'error', message: 'Failed to load course' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category || !formData.ageRange || !formData.duration || !formData.description) {
      setToast({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateCourse(id, formData);
        setToast({ type: 'success', message: 'Course updated successfully' });
      } else {
        const newId = await createCourse(formData);
        setToast({ type: 'success', message: 'Course created successfully' });
        navigate(`/admin/courses/${newId}/edit`);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      setToast({ type: 'error', message: 'Failed to save course' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'outcomes', label: 'Learning Outcomes' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'additional', label: 'Additional' },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading course...</div>
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/courses')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Course' : 'Create Course'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update course information' : 'Add a new course to your catalog'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Course'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <BasicInfoTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'instructor' && (
            <InstructorTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'outcomes' && (
            <LearningOutcomesTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'highlights' && (
            <HighlightsTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'curriculum' && (
            <CurriculumTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'schedule' && (
            <ScheduleTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'pricing' && (
            <PricingTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'reviews' && (
            <ReviewsTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'faqs' && (
            <FAQsTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'additional' && (
            <AdditionalTab formData={formData} setFormData={setFormData} />
          )}
        </div>
      </div>
    </div>
  );
};
