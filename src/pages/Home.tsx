import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';

import { RequestCourseModal } from '../components/RequestCourseModal';
import { Toast } from '../components/Toast';
import { fetchAllCourses } from '../services/coursesService';
import { Course } from '../types';
import { fetchRandomBlogs } from '../services/articlesService';

// Course Card Component with image error handling
const CourseCard: React.FC<{ course: Course; onClick: () => void }> = ({ course, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[160px] md:w-full transition-transform hover:scale-105 active:scale-95"
    >
      <div className="aspect-square rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
        {course.image_url && !imageError ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${course.imageColor}`}
          >
            <span className="text-6xl">{course.icon}</span>
          </div>
        )}
      </div>

      <h4 className="text-sm font-bold mt-2 text-left line-clamp-2">{course.title}</h4>
      <p className="text-xs text-gray-500 text-left">
        Ages {course.ageRange}
      </p>
    </button>
  );
};

// Request Course Card Component
const RequestCourseCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex-shrink-0 w-[160px] md:w-full transition-transform hover:scale-105 active:scale-95"
  >
    <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-orange to-brand-coral flex flex-col items-center justify-center shadow-md">
      <Plus className="w-12 h-12 text-white mb-2" />
      <span className="text-white font-bold text-sm">Request Course</span>
    </div>
    <h4 className="text-sm font-bold mt-2 text-left">Can't find what you need?</h4>
    <p className="text-xs text-gray-500 text-left">Tell us what you want</p>
  </button>
);

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const coursesData = await fetchAllCourses();
      const blogsData = await fetchRandomBlogs();

      if (Array.isArray(coursesData)) {
        setCourses(coursesData.filter(c => !c.isLocked));
      } else {
        setCourses([]);
      }

      setBlogs(Array.isArray(blogsData) ? blogsData : []);
    } catch (err) {
      console.error('Home loadData error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSuccess = () => {
    setShowToast(true);
  };

  const filterCoursesByAge = (courses: Course[]) => {
    if (!selectedAgeGroup) return courses;

    return courses.filter(course => {
      const ageRange = course.ageRange.toLowerCase();
      
      if (selectedAgeGroup === '0-2' && (ageRange.includes('0-2') || ageRange.includes('0') || ageRange.includes('1') || ageRange.includes('2'))) {
        return true;
      }
      if (selectedAgeGroup === '3-5' && (ageRange.includes('3-5') || ageRange.includes('3') || ageRange.includes('4') || ageRange.includes('5'))) {
        return true;
      }
      if (selectedAgeGroup === '6-8' && (ageRange.includes('6-8') || ageRange.includes('6') || ageRange.includes('7') || ageRange.includes('8'))) {
        return true;
      }
      
      return false;
    });
  };

  const filteredCourses = filterCoursesByAge(courses);

  return (
    <div className="pb-20 md:pb-0 bg-gray-50">
      <main className="max-w-[420px] md:max-w-7xl mx-auto md:px-6 lg:px-8">

        {/* HERO */}
       {/* HERO */}
<section className="py-8 md:py-12 md:mx-6 md:rounded-3xl md:mt-6 bg-gradient-to-br from-blue-50 via-green-50 to-orange-50">
  <div className="px-6 md:px-8">
    <h2 className="text-3xl md:text-5xl font-bold mb-2">
      <span className="bg-gradient-to-r from-brand-blue via-brand-green to-brand-orange bg-clip-text text-transparent">
        Learn. Play. Grow.
      </span>
    </h2>
    <p className="text-lg md:text-2xl font-semibold text-brand-coral">
      For Kids 0–8
    </p>
  </div>
</section>

        {/* AGE GROUPS */}
<section className="py-4 md:py-6">
  <div className="px-4 md:px-0 mb-3">
    <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">
      Age Groups
    </h3>
  </div>

  <div className="flex md:grid md:grid-cols-3 gap-3 px-4 md:px-0">
    {categories.map(category => (
      <button
        key={category.id}
        onClick={() => {
          setSelectedAgeGroup(selectedAgeGroup === category.ageRange ? null : category.ageRange);
        }}
        className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all text-sm ${
          selectedAgeGroup === category.ageRange
            ? 'border-brand-orange bg-brand-orange text-white shadow-md'
            : 'border-gray-200 bg-white hover:border-brand-orange hover:shadow-sm'
        }`}
      >
        <span className="text-lg">{category.icon}</span>
        <span className="whitespace-nowrap">{category.name}</span>
      </button>
    ))}
  </div>

  {selectedAgeGroup && (
    <div className="px-4 md:px-0 mt-2 text-center">
      <button
        onClick={() => setSelectedAgeGroup(null)}
        className="text-xs text-brand-orange font-semibold hover:underline"
      >
        ✕ Clear filter
      </button>
    </div>
  )}
</section>

        {/* LOADING / ERROR */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-brand-orange"></div>
            <p className="mt-2">Loading courses…</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        )}

        {/* MINI COURSES */}
        {!loading && !error && (
          <>
            <section className="py-6 md:py-8">
              <div className="px-4 md:px-0 mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Born Genius Mini</h3>
              </div>

              <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 md:px-0 overflow-x-auto pb-4 scrollbar-hide">
                {filteredCourses
                  .filter(course => course.tier === 'mini')
                  .map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => navigate(`/course/${course.id}`)}
                    />
                  ))}
                
                {/* Request Course Button for Mini */}
                <RequestCourseCard onClick={() => setIsModalOpen(true)} />
              </div>
            </section>

            {/* PREMIUM COURSES */}
            <section className="py-6 md:py-8">
              <div className="px-4 md:px-0 mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Born Genius Premium
                </h3>
              </div>

              <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 md:px-0 overflow-x-auto pb-4 scrollbar-hide">
                {filteredCourses
                  .filter(course => course.tier === 'premium')
                  .map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => navigate(`/course/${course.id}`)}
                    />
                  ))}
                
                {/* Request Course Button for Premium */}
                <RequestCourseCard onClick={() => setIsModalOpen(true)} />
              </div>
            </section>
          </>
        )}

        {/* BLOG SECTION */}
        <section className="py-6 md:py-8 mb-12 bg-white md:bg-transparent">
          <div className="px-4 md:px-0 mb-4 flex justify-between items-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Updates & News
            </h3>
            <button
              onClick={() => navigate('/updates')}
              className="flex items-center gap-1 text-brand-blue font-semibold text-sm hover:underline"
            >
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 px-4 md:px-0">
            {blogs.map((blog) => (
              <button
                key={blog.id}
                onClick={() => navigate(`/updates/${blog.slug}`)}
                className="bg-white rounded-xl p-4 text-left shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <span className="inline-block px-2 py-1 bg-brand-blue/10 text-brand-blue text-xs font-semibold rounded-md mb-2">
                  {blog.category}
                </span>

                <h3 className="font-bold text-gray-900 mt-1 line-clamp-2 text-base">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                  {blog.excerpt}
                </p>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-lg">{blog.author_photo || '👨‍🏫'}</span>
                  <span className="text-xs text-gray-500">{blog.author}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* MODAL + TOAST */}
      <RequestCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRequestSuccess}
      />

      {showToast && (
        <Toast
          message="Request submitted successfully"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
