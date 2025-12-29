import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { CourseFormData } from '../../services/coursesService';
import { fetchInstructors, createInstructor } from '../../services/coursesService';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const InstructorTab: React.FC<Props> = ({ formData, setFormData }) => {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    name: '',
    photo: '👨‍🏫',
    bio: '',
    yearsExperience: 0,
    specialization: '',
    isOnline: true,
  });

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      const data = await fetchInstructors();
      setInstructors(data);
    } catch (error) {
      console.error('Error loading instructors:', error);
    }
  };

  const handleCreateInstructor = async () => {
    if (!newInstructor.name) return;

    try {
      const created = await createInstructor(newInstructor);
      setInstructors([...instructors, created]);
      setFormData({ ...formData, instructorId: created.id });
      setShowNewForm(false);
      setNewInstructor({
        name: '',
        photo: '👨‍🏫',
        bio: '',
        yearsExperience: 0,
        specialization: '',
        isOnline: true,
      });
    } catch (error) {
      console.error('Error creating instructor:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Instructor
        </label>
        <select
          value={formData.instructorId || ''}
          onChange={(e) => setFormData({ ...formData, instructorId: e.target.value || undefined })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">No instructor</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.photo} {instructor.name} - {instructor.specialization}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => setShowNewForm(!showNewForm)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <Plus className="w-4 h-4" />
        {showNewForm ? 'Cancel' : 'Create New Instructor'}
      </button>

      {showNewForm && (
        <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">New Instructor</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={newInstructor.name}
                onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo (Emoji)
              </label>
              <input
                type="text"
                value={newInstructor.photo}
                onChange={(e) => setNewInstructor({ ...newInstructor, photo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={newInstructor.bio}
              onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief bio about the instructor"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                value={newInstructor.yearsExperience}
                onChange={(e) => setNewInstructor({ ...newInstructor, yearsExperience: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={newInstructor.specialization}
                onChange={(e) => setNewInstructor({ ...newInstructor, specialization: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Chess Strategy & Education"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newInstructor.isOnline}
              onChange={(e) => setNewInstructor({ ...newInstructor, isOnline: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Available Online</span>
          </label>

          <button
            type="button"
            onClick={handleCreateInstructor}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Instructor
          </button>
        </div>
      )}
    </div>
  );
};
