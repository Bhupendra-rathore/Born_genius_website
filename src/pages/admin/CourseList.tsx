import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { fetchAllCourses, deleteCourse } from '../../services/coursesService';
import { Course } from '../../types';
import { Toast } from '../../components/Toast';
import { AdminHeader } from '../../components/admin/AdminHeader';

export const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, categoryFilter, tierFilter]);

  const loadCourses = async () => {
    try {
      const data = await fetchAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      setToast({ type: 'error', message: 'Failed to load courses' });
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((course) => course.category === categoryFilter);
    }

    if (tierFilter !== 'all') {
      filtered = filtered.filter((course) => course.tier === tierFilter);
    }

    setFilteredCourses(filtered);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteCourse(id);
      setToast({ type: 'success', message: 'Course deleted successfully' });
      loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      setToast({ type: 'error', message: 'Failed to delete course' });
    }
  };

  const categories = Array.from(new Set(courses.map((c) => c.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <AdminHeader
        title="Courses"
        subtitle="Manage all your courses"
        action={
          <Link
            to="/admin/courses/new"
            className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </Link>
        }
      />

      <div className="px-4 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex gap-3 flex-col sm:flex-row`}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tiers</option>
                <option value="mini">Mini</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>

        <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Age Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      No courses found
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{course.icon}</span>
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {course.description.substring(0, 40)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.ageRange}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.duration}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            course.tier === 'premium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {course.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            course.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id, course.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:hidden space-y-4">
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
              No courses found
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{course.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-1 text-gray-900">{course.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <span className="ml-1 text-gray-900">{course.ageRange}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-1 text-gray-900">{course.duration}</span>
                  </div>
                  <div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        course.tier === 'premium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {course.tier}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      course.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Link
          to="/admin/courses/new"
          className="sm:hidden fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-20"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};
