import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CourseFormData } from '../../services/coursesService';
import { fetchAllCourses } from '../../services/coursesService';
import { Course } from '../../types';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const AdditionalTab: React.FC<Props> = ({ formData, setFormData }) => {
  const prerequisites = formData.prerequisites || [];
  const relatedCourseIds = formData.relatedCourseIds || [];
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const courses = await fetchAllCourses();
      setAllCourses(courses);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const addPrerequisite = () => {
    setFormData({
      ...formData,
      prerequisites: [...prerequisites, ''],
    });
  };

  const updatePrerequisite = (index: number, value: string) => {
    const updated = [...prerequisites];
    updated[index] = value;
    setFormData({ ...formData, prerequisites: updated });
  };

  const removePrerequisite = (index: number) => {
    const updated = prerequisites.filter((_, i) => i !== index);
    setFormData({ ...formData, prerequisites: updated });
  };

  const toggleRelatedCourse = (courseId: string) => {
    const isSelected = relatedCourseIds.includes(courseId);
    const updated = isSelected
      ? relatedCourseIds.filter((id) => id !== courseId)
      : [...relatedCourseIds, courseId];
    setFormData({ ...formData, relatedCourseIds: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Prerequisites</h3>
          <button
            type="button"
            onClick={addPrerequisite}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Prerequisite
          </button>
        </div>

        <div className="space-y-2">
          {prerequisites.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No prerequisites added yet
            </div>
          ) : (
            prerequisites.map((prereq, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={prereq}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Basic computer skills"
                />
                <button
                  type="button"
                  onClick={() => removePrerequisite(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Courses</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select courses that are related or recommended after this course
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allCourses.length === 0 ? (
            <div className="col-span-2 text-center py-4 text-gray-500 text-sm">
              No other courses available
            </div>
          ) : (
            allCourses.map((course) => (
              <label
                key={course.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={relatedCourseIds.includes(course.id)}
                  onChange={() => toggleRelatedCourse(course.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xl">{course.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{course.title}</div>
                  <div className="text-sm text-gray-500">{course.category}</div>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>
  );
};
