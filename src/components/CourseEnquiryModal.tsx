import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Clock, MessageSquare, CheckCircle2, ChevronDown, Check } from 'lucide-react';
import { CourseEnquiry } from '../types';
import {
  submitCourseEnquiry,
  generateWhatsAppLink,
  validateEmail,
  validatePhoneNumber,
  PREFERRED_TIMINGS,
  OBJECTION_OPTIONS
} from '../services/courseEnquiryService';
import { countryCodes } from '../data/countryCodes';
import { useAuth } from '../hooks/useAuth';

interface CourseEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
}

export const CourseEnquiryModal: React.FC<CourseEnquiryModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  courseCategory,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<CourseEnquiry | null>(null);
  const [continueAsGuest, setContinueAsGuest] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    country_code: '+91',
    preferred_timing: '',
    major_objection: '',
    other_objection_details: '',
  });

  useEffect(() => {
    if (isAuthenticated && user && !continueAsGuest) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone || '',
        country_code: user.country_code || '+91',
      }));
    }
  }, [isAuthenticated, user, continueAsGuest]);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone_number: '',
    preferred_timing: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone_number: false,
    preferred_timing: false,
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field as keyof typeof touched]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Please enter a valid email';
        break;
      case 'phone_number':
        if (!value.trim()) error = 'Phone number is required';
        else if (!validatePhoneNumber(value)) error = 'Please enter a valid phone number';
        break;
      case 'preferred_timing':
        if (!value) error = 'Please select a preferred timing';
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const isFormValid = () => {
    const nameValid = formData.name.trim().length >= 2;
    const emailValid = validateEmail(formData.email);
    const phoneValid = validatePhoneNumber(formData.phone_number);
    const timingValid = formData.preferred_timing !== '';

    return nameValid && emailValid && phoneValid && timingValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      phone_number: true,
      preferred_timing: true,
    });

    Object.keys(formData).forEach(key => {
      if (['name', 'email', 'phone_number', 'preferred_timing'].includes(key)) {
        validateField(key, formData[key as keyof typeof formData]);
      }
    });

    if (!isFormValid()) return;

    setIsSubmitting(true);

    const enquiry: CourseEnquiry = {
      course_id: courseId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone_number: formData.phone_number.trim(),
      country_code: formData.country_code,
      preferred_timing: formData.preferred_timing,
      major_objection: formData.major_objection || undefined,
      other_objection_details: formData.other_objection_details || undefined,
      source: 'course_detail',
    };

    const result = await submitCourseEnquiry(enquiry);

    setIsSubmitting(false);

    if (result.success && result.data) {
      setSubmittedEnquiry(result.data);
      setStep('success');
    } else {
      alert(result.error || 'Failed to submit enquiry. Please try again.');
    }
  };

  const handleWhatsAppClick = () => {
    if (submittedEnquiry) {
      const whatsappLink = generateWhatsAppLink(submittedEnquiry, courseTitle);
      window.open(whatsappLink, '_blank');
    }
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      country_code: '+91',
      preferred_timing: '',
      major_objection: '',
      other_objection_details: '',
    });
    setErrors({
      name: '',
      email: '',
      phone_number: '',
      preferred_timing: '',
    });
    setTouched({
      name: false,
      email: false,
      phone_number: false,
      preferred_timing: false,
    });
    setSubmittedEnquiry(null);
    onClose();
  };

  const selectedCountry = countryCodes.find(c => c.dialCode === formData.country_code) || countryCodes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {step === 'form' ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Enquire Now</h2>
                {isAuthenticated && !continueAsGuest && (
                  <button
                    type="button"
                    onClick={() => setContinueAsGuest(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Continue as Guest
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {courseTitle} • {courseCategory}
              </p>
            </div>

            {isAuthenticated && !continueAsGuest && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Logged in as {user?.name || user?.email}</p>
                  <p className="text-xs text-green-700 mt-0.5">Your information has been pre-filled</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    readOnly={isAuthenticated && !continueAsGuest && !!user?.name}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      touched.name && errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-brand-orange'
                    } ${isAuthenticated && !continueAsGuest && !!user?.name ? 'bg-gray-50' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    readOnly={isAuthenticated && !continueAsGuest}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      touched.email && errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-brand-orange'
                    } ${isAuthenticated && !continueAsGuest ? 'bg-gray-50' : ''}`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      disabled={isAuthenticated && !continueAsGuest && !!user?.phone}
                      className={`w-24 h-12 px-3 py-3 border-2 border-gray-200 rounded-xl hover:border-brand-orange focus:outline-none focus:border-brand-orange transition-colors flex items-center justify-between ${
                        isAuthenticated && !continueAsGuest && !!user?.phone ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showCountryDropdown && !(isAuthenticated && !continueAsGuest && !!user?.phone) && (
                      <div className="absolute top-14 left-0 w-72 max-h-64 overflow-y-auto bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20">
                        {countryCodes.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              handleInputChange('country_code', country.dialCode);
                              setShowCountryDropdown(false);
                            }}
                            className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                          >
                            <span className="text-xl">{country.flag}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{country.name}</div>
                              <div className="text-xs text-gray-500">{country.dialCode}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value.replace(/[^0-9]/g, ''))}
                      onBlur={() => handleBlur('phone_number')}
                      readOnly={isAuthenticated && !continueAsGuest && !!user?.phone}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        touched.phone_number && errors.phone_number
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-brand-orange'
                      } ${isAuthenticated && !continueAsGuest && !!user?.phone ? 'bg-gray-50' : ''}`}
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                {touched.phone_number && errors.phone_number && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Preferred timing to connect <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={formData.preferred_timing}
                    onChange={(e) => handleInputChange('preferred_timing', e.target.value)}
                    onBlur={() => handleBlur('preferred_timing')}
                    className={`w-full pl-11 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-colors appearance-none bg-white ${
                      touched.preferred_timing && errors.preferred_timing
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-brand-orange'
                    }`}
                  >
                    <option value="">Select a time slot</option>
                    {PREFERRED_TIMINGS.map((timing) => (
                      <option key={timing} value={timing}>
                        {timing}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {touched.preferred_timing && errors.preferred_timing && (
                  <p className="text-xs text-red-500 mt-1">{errors.preferred_timing}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  What's your main concern? <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={formData.major_objection}
                    onChange={(e) => handleInputChange('major_objection', e.target.value)}
                    className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange transition-colors appearance-none bg-white"
                  >
                    <option value="">Select a concern (optional)</option>
                    {OBJECTION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {formData.major_objection === 'Other (please describe)' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Please describe your concern
                  </label>
                  <textarea
                    value={formData.other_objection_details}
                    onChange={(e) => handleInputChange('other_objection_details', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange transition-colors resize-none"
                    placeholder="Tell us more about your concern..."
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-brand-orange to-brand-coral text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Enquiry Submitted!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in <strong>{courseTitle}</strong>. We've received your enquiry.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Your Details:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{submittedEnquiry?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">{submittedEnquiry?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">
                      {submittedEnquiry?.country_code} {submittedEnquiry?.phone_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timing:</span>
                    <span className="font-medium text-gray-900">{submittedEnquiry?.preferred_timing}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-3"
              >
                <MessageSquare className="w-5 h-5" />
                Talk on WhatsApp
              </button>

              <button
                onClick={handleClose}
                className="w-full py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
