import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CourseFormData } from '../../services/coursesService';

interface Props {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const ScheduleTab: React.FC<Props> = ({ formData, setFormData }) => {
  const schedule = formData.schedule || {
    daysPerWeek: 2,
    duration: '',
    sessionLength: '',
    totalSessions: 0,
    nextBatchDate: '',
    timeSlots: [],
  };

  const updateSchedule = (field: string, value: any) => {
    setFormData({
      ...formData,
      schedule: { ...schedule, [field]: value },
    });
  };

  const addTimeSlot = () => {
    updateSchedule('timeSlots', [...schedule.timeSlots, '']);
  };

  const updateTimeSlot = (index: number, value: string) => {
    const updated = [...schedule.timeSlots];
    updated[index] = value;
    updateSchedule('timeSlots', updated);
  };

  const removeTimeSlot = (index: number) => {
    const updated = schedule.timeSlots.filter((_, i) => i !== index);
    updateSchedule('timeSlots', updated);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Schedule Information</h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Days per Week
          </label>
          <input
            type="number"
            min="1"
            max="7"
            value={schedule.daysPerWeek}
            onChange={(e) => updateSchedule('daysPerWeek', parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            value={schedule.duration}
            onChange={(e) => updateSchedule('duration', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 8 weeks"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Length
          </label>
          <input
            type="text"
            value={schedule.sessionLength}
            onChange={(e) => updateSchedule('sessionLength', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 45 minutes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Sessions
          </label>
          <input
            type="number"
            min="0"
            value={schedule.totalSessions}
            onChange={(e) => updateSchedule('totalSessions', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Next Batch Date
        </label>
        <input
          type="date"
          value={schedule.nextBatchDate}
          onChange={(e) => updateSchedule('nextBatchDate', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Available Time Slots
          </label>
          <button
            type="button"
            onClick={addTimeSlot}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Time Slot
          </button>
        </div>

        <div className="space-y-2">
          {schedule.timeSlots.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No time slots added yet
            </div>
          ) : (
            schedule.timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={slot}
                  onChange={(e) => updateTimeSlot(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 4:00 PM - 4:45 PM"
                />
                <button
                  type="button"
                  onClick={() => removeTimeSlot(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
