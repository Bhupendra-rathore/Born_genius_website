import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RequestCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RequestCourseModal: React.FC<RequestCourseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childAge, setChildAge] = useState<number | ''>('');
  const [courseRequest, setCourseRequest] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    childAge?: string;
    courseRequest?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      resetForm();
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setChildAge('');
    setCourseRequest('');
    setErrors({});
    setSubmitting(false);
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = 'Please enter your name';
    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email';
    }
    if (childAge === '') newErrors.childAge = 'Select child age';
    if (!courseRequest.trim()) newErrors.courseRequest = 'Describe your request';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const { error } = await supabase.from('course_requests').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      child_age: childAge,
      course_request: courseRequest.trim(),
    });

    setSubmitting(false);

    if (error) {
      console.error('Supabase error:', error);
      return;
    }

    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-[420px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Request New Course</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />

          <select
            value={childAge}
            onChange={(e) => setChildAge(Number(e.target.value))}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select child age</option>
            {Array.from({ length: 12 }, (_, i) => i + 3).map((age) => (
              <option key={age} value={age}>
                {age} years
              </option>
            ))}
          </select>
          {errors.childAge && <p className="text-red-500 text-sm">{errors.childAge}</p>}

          <textarea
            placeholder="Describe the course you want"
            value={courseRequest}
            onChange={(e) => setCourseRequest(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />
          {errors.courseRequest && (
            <p className="text-red-500 text-sm">{errors.courseRequest}</p>
          )}

          <button
            disabled={submitting}
            className="w-full bg-brand-orange text-white py-3 rounded-xl font-semibold"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};
