import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Users, TrendingUp, Shield, Award, Check, Star, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { fetchCourseById } from '../services/coursesService';
import { countryCodes } from '../data/countryCodes';
import { supabase } from '../lib/supabase';
import { Toast } from '../components/Toast';
import { Course } from '../types';
import { useAuth } from '../hooks/useAuth';

export const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [continueAsGuest, setContinueAsGuest] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourse(id);
    }
  }, [id]);

  const loadCourse = async (courseId: string) => {
    try {
      const data = await fetchCourseById(courseId);
      setCourse(data);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [childAge, setChildAge] = useState<number | ''>('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !continueAsGuest) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCountryCode(user.country_code || '+91');
      setChildAge(user.child_age || '');
    }
  }, [isAuthenticated, user, continueAsGuest]);

  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [spotsLeft] = useState(course?.spotsLeft || 3);
  const [viewingNow] = useState(course?.viewingNow || 12);
  const [recentEnrollment, setRecentEnrollment] = useState('Sarah from Mumbai');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  useEffect(() => {
    if (!loading && !course) {
      navigate('/');
      return;
    }
    if (!course) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const enrollmentNames = [
      'Sarah from Mumbai', 'Priya from Delhi', 'Amit from Bangalore',
      'Rahul from Pune', 'Neha from Chennai', 'Arjun from Hyderabad'
    ];
    const enrollmentTimer = setInterval(() => {
      const randomName = enrollmentNames[Math.floor(Math.random() * enrollmentNames.length)];
      setRecentEnrollment(randomName);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(enrollmentTimer);
    };
  }, [course, navigate]);

  if (!course) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const calculateDiscount = () => {
    if (!course.pricing) return 0;
    return course.pricing.originalPrice - course.pricing.discountedPrice;
  };

  const calculateDiscountPercent = () => {
    if (!course.pricing) return 0;
    return Math.round((calculateDiscount() / course.pricing.originalPrice) * 100);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !course.pricing) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          course_id: course.id,
          course_title: course.title,
          course_category: course.category,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          country_code: countryCode,
          child_age: childAge,
          original_price: course.pricing.originalPrice,
          discount_amount: calculateDiscount(),
          final_price: course.pricing.discountedPrice,
          payment_status: 'pending',
          order_status: 'pending',
          source: 'web'
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      setToastMessage('Order placed successfully! We will contact you shortly.');
      setToastType('success');
      setShowToast(true);

      setTimeout(() => {
        navigate(`/course/${course.id}`, { state: { orderSuccess: true } });
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      setToastMessage('Failed to place order. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = spotsLeft <= 5 ? ((10 - spotsLeft) / 10) * 100 : 70;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[420px] mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="font-medium text-gray-700">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-[420px] mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 mb-4 text-white shadow-lg animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">Limited Time Offer</span>
            </div>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold mb-1">{formatTime(timeLeft)}</div>
          <div className="text-sm opacity-90">Offer expires soon! Lock in this price now</div>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-4 shadow-md border border-orange-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 text-red-600">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold">High Demand Alert</span>
            </div>
            <div className="animate-bounce">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Only {spotsLeft} spots remaining</span>
              <span className="font-bold text-red-600">{spotsLeft} left!</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{viewingNow} parents viewing now</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 italic">
              {recentEnrollment} just enrolled
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Course Details</h2>
          <div className="flex gap-4">
            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${course.imageColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <span className="text-3xl">{course.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                {course.category} • Ages {course.ageRange}
              </p>
              {course.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                  <span className="text-sm font-bold">{course.rating}</span>
                  <span className="text-xs text-gray-500">({course.reviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-4 mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            What's Included
          </h3>
          <div className="space-y-2">
            {course.highlights?.slice(0, 4).map((highlight) => (
              <div key={highlight.id} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
              {isAuthenticated && !continueAsGuest && (
                <button
                  type="button"
                  onClick={() => setContinueAsGuest(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Continue as Guest
                </button>
              )}
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

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  readOnly={isAuthenticated && !continueAsGuest && !!user?.name}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-brand-orange text-base ${
                    isAuthenticated && !continueAsGuest && !!user?.name ? 'bg-gray-50' : ''
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  readOnly={isAuthenticated && !continueAsGuest}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-brand-orange text-base ${
                    isAuthenticated && !continueAsGuest ? 'bg-gray-50' : ''
                  }`}
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
                      disabled={isAuthenticated && !continueAsGuest && !!user?.phone}
                      className={`h-[48px] px-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium ${
                        isAuthenticated && !continueAsGuest && !!user?.phone ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span>{countryCodes.find(c => c.dialCode === countryCode)?.flag}</span>
                      <span>{countryCode}</span>
                    </button>
                    {showCountryDropdown && !(isAuthenticated && !continueAsGuest && !!user?.phone) && (
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
                    readOnly={isAuthenticated && !continueAsGuest && !!user?.phone}
                    className={`flex-1 px-4 py-3 rounded-xl border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-brand-orange text-base ${
                      isAuthenticated && !continueAsGuest && !!user?.phone ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="childAge" className="block text-sm font-semibold text-gray-700 mb-2">
                  Child's Age <span className="text-red-500">*</span>
                </label>
                <select
                  id="childAge"
                  value={childAge}
                  onChange={(e) => setChildAge(Number(e.target.value))}
                  disabled={isAuthenticated && !continueAsGuest && !!user?.child_age}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.childAge ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-brand-orange text-base ${
                    isAuthenticated && !continueAsGuest && !!user?.child_age ? 'bg-gray-50' : ''
                  }`}
                >
                  <option value="">Select child's age</option>
                  {Array.from({ length: 12 }, (_, i) => i + 3).map((age) => (
                    <option key={age} value={age}>
                      {age} years old
                    </option>
                  ))}
                </select>
                {errors.childAge && <p className="mt-1 text-sm text-red-500">{errors.childAge}</p>}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Payment Summary</h3>

            {course.pricing && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Course Price</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(course.pricing.originalPrice)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold text-sm">
                    Early Bird Discount ({calculateDiscountPercent()}% OFF)
                  </span>
                  <span className="font-bold text-green-600">
                    - {formatPrice(calculateDiscount())}
                  </span>
                </div>

                <div className="border-t-2 border-gray-300 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(course.pricing.discountedPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Just {formatPrice(course.pricing.perSessionPrice)}/session
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">100% Money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">First class free trial available</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Secure payment processing</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-orange to-brand-coral text-white hover:shadow-xl active:scale-95'
            }`}
          >
            {isSubmitting ? (
              'Processing...'
            ) : (
              <>
                <span>Complete Purchase</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 px-4">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>

        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3">Why Parents Trust Us</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Expert Instructors</div>
                <div className="text-xs text-gray-600">Certified teachers with 5+ years experience</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Proven Results</div>
                <div className="text-xs text-gray-600">10,000+ successful student outcomes</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Safe & Secure</div>
                <div className="text-xs text-gray-600">100% secure payments & data protection</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
const generateEventId = () => {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const sendAnalyticsEvent = async (
  event_name: string,
  event_id: string,
  value: number,
  email: string,
  phone: string
) => {
  try {
    await fetch('https://analytics.borngenius.in/collect.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name,
        event_id,
        currency: 'INR',
        value,
        user_data: { email, phone },
        user_agent: navigator.userAgent
      })
    });
  } catch (err) {
    console.error('Analytics error', err);
  }
};
