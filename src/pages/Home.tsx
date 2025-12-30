import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';

import { RequestCourseModal } from '../components/RequestCourseModal';
import { Toast } from '../components/Toast';
import { fetchAllCourses } from '../services/coursesService';
import { Course } from '../types';
import { fetchRandomBlogs } from '../services/articlesService';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

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

    // Courses
    if (Array.isArray(coursesData)) {
      setCourses(coursesData.filter(c => !c.isLocked));
    } else {
      setCourses([]);
    }

    // Blogs (random 3)
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

  return (
    <div className="pb-20 md:pb-0">
      <main className="max-w-[420px] md:max-w-7xl mx-auto md:px-6 lg:px-8">

        {/* HERO */}
        <section className="px-4 md:px-0 py-8 md:py-12 bg-gradient-to-br from-brand-blue/10 via-brand-green/10 to-brand-orange/10 md:rounded-3xl md:mt-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-2">
            Learn. Play. Grow.
          </h2>
          <p className="text-lg md:text-2xl font-semibold text-brand-coral">
            For Kids 0–8
          </p>
        </section>

        {/* AGE GROUPS */}
        <section className="py-6 md:py-8">
          <div className="px-4 md:px-0 mb-4">
            <h3 className="text-sm md:text-base font-semibold text-gray-500 uppercase">
              Age Groups
            </h3>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-3 px-4 md:px-0">
            {categories.map(category => (
              <div
                key={category.id}
                className="px-5 py-3 rounded-2xl border-2 text-center font-bold"
              >
                <span className="text-2xl">{category.icon}</span>
                <div className="text-sm">{category.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* LOADING / ERROR */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading courses…
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
                <h3 className="text-lg md:text-2xl font-bold">Born Genius Mini</h3>
              </div>

              <div className="flex md:grid md:grid-cols-4 gap-4 px-4 md:px-0 overflow-x-auto">
                {courses
                  .filter(course => course.tier === 'mini')
                  .map(course => (
                    <button
                      key={course.id}
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="w-[200px] md:w-full"
                    >
                      <div
                        className={`aspect-square rounded-2xl bg-gradient-to-br ${course.imageColor} flex items-center justify-center`}
                      >
                        <span className="text-6xl">{course.icon}</span>
                      </div>
                      <h4 className="text-sm font-bold mt-2">{course.title}</h4>
                      <p className="text-xs text-gray-500">
                        Ages {course.ageRange}
                      </p>
                    </button>
                  ))}

                <button onClick={() => setIsModalOpen(true)}>
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-orange to-brand-coral flex items-center justify-center">
                    <Plus className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm font-bold mt-2">Request Course</p>
                </button>
              </div>
            </section>

            {/* PREMIUM COURSES */}
            <section className="py-6 md:py-8">
              <div className="px-4 md:px-0 mb-4">
                <h3 className="text-lg md:text-2xl font-bold">
                  Born Genius Premium
                </h3>
              </div>

              <div className="flex md:grid md:grid-cols-4 gap-4 px-4 md:px-0 overflow-x-auto">
                {courses
                  .filter(course => course.tier === 'premium')
                  .map(course => (
                    <button
                      key={course.id}
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="w-[200px] md:w-full"
                    >
                      <div
                        className={`aspect-square rounded-2xl bg-gradient-to-br ${course.imageColor} flex items-center justify-center`}
                      >
                        <span className="text-6xl">{course.icon}</span>
                      </div>
                      <h4 className="text-sm font-bold mt-2">{course.title}</h4>
                      <p className="text-xs text-gray-500">
                        Ages {course.ageRange}
                      </p>
                    </button>
                  ))}
              </div>
            </section>
          </>
        )}

        {/* BLOG SECTION (NEXT: SUPABASE) */}
        <section className="py-6 md:py-8 mb-12">
          <div className="px-4 md:px-0 mb-4 flex justify-between">
            <h3 className="text-lg md:text-2xl font-bold">
              Updates & News
            </h3>
            <button
              onClick={() => navigate('/updates')}
              className="flex items-center gap-1 text-brand-blue font-semibold"
            >
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 px-4 md:px-0">
          {blogs.map((blog) => (
  <button
    key={blog.id}
    onClick={() => navigate(`/updates/${blog.slug}`)}
    className="bg-white rounded-xl p-4 text-left shadow-sm hover:shadow-md"
  >
    <span className="text-xs text-brand-blue font-semibold">
      {blog.category}
    </span>

    <h3 className="font-bold text-gray-900 mt-1 line-clamp-2">
      {blog.title}
    </h3>

    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
      {blog.excerpt}
    </p>

    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
      <span>{blog.author_photo || '👨‍🏫'}</span>
      <span>{blog.author}</span>
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
