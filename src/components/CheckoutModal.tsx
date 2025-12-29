import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Course } from '../types';
import { countryCodes } from '../data/countryCodes';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  course,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [childAge, setChildAge] = useState<number | ''>('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    childAge?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setName('');
      setEmail('');
      setPhone('');
      setChildAge('');
      setErrors({});
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const calculateTotal = () => {
    if (!course.pricing) return 0;
    return course.pricing.discountedPrice;
  };

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      childAge?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (childAge === '') {
      newErrors.childAge = 'Please select child age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4 mb-6">
            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${course.imageColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <span className="text-3xl">{course.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                {course.category} • Ages {course.ageRange}
              </p>
              <p className="text-xs text-gray-500">
                {course.schedule?.totalSessions} sessions • {course.duration}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange text-base`}
                style={{ minHeight: '48px' }}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange text-base`}
                style={{ minHeight: '48px' }}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="h-[48px] px-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <span>{countryCodes.find(c => c.dialCode === countryCode)?.flag}</span>
                    <span>{countryCode}</span>
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
                      {countryCodes.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setCountryCode(country.dialCode);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left text-sm"
                        >
                          <span className="text-xl">{country.flag}</span>
                          <span className="flex-1 truncate">{country.name}</span>
                          <span className="text-gray-500">{country.dialCode}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="1234567890"
                  className={`flex-1 px-4 py-3 rounded-xl border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-brand-orange text-base`}
                  style={{ minHeight: '48px' }}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="childAge" className="block text-sm font-semibold text-gray-700 mb-2">
                Child Age <span className="text-red-500">*</span>
              </label>
              <select
                id="childAge"
                value={childAge}
                onChange={(e) => setChildAge(Number(e.target.value))}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.childAge ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-orange text-base`}
                style={{ minHeight: '48px' }}
              >
                <option value="">Select age</option>
                {Array.from({ length: 12 }, (_, i) => i + 3).map((age) => (
                  <option key={age} value={age}>
                    {age} years old
                  </option>
                ))}
              </select>
              {errors.childAge && <p className="mt-1 text-sm text-red-500">{errors.childAge}</p>}
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              <h3 className="text-base font-bold text-gray-900 mb-4">Bill Details</h3>

              {course.pricing && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Course Price</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(course.pricing.originalPrice)}
                    </span>
                  </div>

                  {course.pricing.originalPrice > course.pricing.discountedPrice && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 font-medium">Discount</span>
                      <span className="font-semibold text-green-600">
                        - {formatPrice(course.pricing.originalPrice - course.pricing.discountedPrice)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-3 flex items-start gap-2 mt-4">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-900">
                      {course.pricing.perSessionPrice && (
                        <span className="font-semibold">
                          Just {formatPrice(course.pricing.perSessionPrice)} per session
                        </span>
                      )}
                      {course.pricing.moneyBackGuarantee && (
                        <span className="block mt-1">100% money-back guarantee included</span>
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold transition-colors hover:bg-gray-50"
                style={{ minHeight: '48px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-coral text-white font-semibold transition-all hover:shadow-md"
                style={{ minHeight: '48px' }}
              >
                Proceed to Pay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
