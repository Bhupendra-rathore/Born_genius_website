import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Clock,
  Calendar,
  Users,
  Award,
  Shield,
  CreditCard,
  ThumbsUp,
} from 'lucide-react';
import { fetchCourseById } from '../services/coursesService';
import { Course } from '../types';
import { CourseEnquiryModal } from '../components/CourseEnquiryModal';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCourse(id);
  }, [id]);

  const loadCourse = async (courseId: string) => {
    try {
      const data = await fetchCourseById(courseId);
      setCourse(data);
    } catch (err) {
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return '—';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-brand-orange font-semibold"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-gray-50">
      {/* HERO */}
      <div className={`h-80 md:h-96 bg-gradient-to-br ${course.imageColor} flex items-center justify-center relative`}>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white rounded-full p-3 shadow"
        >
          <ArrowLeft />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white rounded-full p-3 shadow">
            <Share2 />
          </button>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="bg-white rounded-full p-3 shadow"
          >
            <Heart className={isFavorited ? 'fill-red-500 text-red-500' : ''} />
          </button>
        </div>

        <span className="text-9xl">{course.icon}</span>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto bg-white rounded-t-3xl -mt-6 relative z-10">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-3">
            {course.category} • Live Online Sessions
          </p>

          <div className="flex gap-3 text-sm text-gray-600">
            <span>Ages {course.ageRange}</span>
            <span>•</span>
            <span>{course.duration}</span>
            {course.schedule?.totalSessions && (
              <>
                <span>•</span>
                <span>{course.schedule.totalSessions} sessions</span>
              </>
            )}
          </div>
        </div>

        {/* INSTRUCTOR */}
        {course.instructor && (
          <div className="border-t px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-xl overflow-hidden">
                {course.instructor.photo?.startsWith('http') ? (
                  <img 
                    src={course.instructor.photo} 
                    alt={course.instructor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{course.instructor.photo || '👤'}</span>
                )}
              </div>
              <div>
                <h3 className="font-bold">Learn with {course.instructor.name}</h3>
                <p className="text-sm text-gray-600">
                  {course.instructor.yearsExperience} years experience
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700">{course.instructor.bio}</p>
          </div>
        )}

        {/* ABOUT */}
        <div className="border-t px-6 py-6">
          <h3 className="font-bold mb-2">About this course</h3>
          <p className="text-sm text-gray-700">
            {showFullDescription ? course.fullDescription : course.description}
          </p>

          {course.fullDescription &&
            course.fullDescription.length > course.description.length && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-brand-orange font-semibold mt-2 flex items-center gap-1"
              >
                {showFullDescription ? (
                  <>
                    Show less <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown size={16} />
                  </>
                )}
              </button>
            )}
        </div>

        {/* SCHEDULE */}
        {course.schedule && (
          <div className="border-t px-6 py-6">
            <h3 className="font-bold mb-3">Schedule & Format</h3>

            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Calendar className="text-brand-orange" />
                <span>
                  {course.schedule.daysPerWeek} days/week • Starts{' '}
                  {formatDate(course.schedule.nextBatchDate)}
                </span>
              </div>

              <div className="flex gap-2">
                <Clock className="text-brand-orange" />
                <span>
                  {course.schedule.sessionLength} •{' '}
                  {course.schedule.totalSessions} sessions
                </span>
              </div>

              <div className="flex gap-2">
                <Users className="text-brand-orange" />
                <span>
                  {course.schedule.timeSlots?.length
                    ? course.schedule.timeSlots.join(' • ')
                    : 'Time slots shared after enrolment'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PRICING */}
        {course.pricing && (
          <div className="border-t px-6 py-6 bg-gradient-to-br from-green-50 to-blue-50">
            <h3 className="font-bold mb-3">Pricing & Guarantee</h3>

            <div className="bg-white rounded-xl p-4 shadow mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {formatPrice(course.pricing.discountedPrice)}
                </span>

                {typeof course.pricing.originalPrice === 'number' &&
                  course.pricing.originalPrice >
                    (course.pricing.discountedPrice ?? 0) && (
                    <span className="line-through text-gray-400">
                      {formatPrice(course.pricing.originalPrice)}
                    </span>
                  )}
              </div>

              <p className="text-sm text-gray-600 mt-2">
                Just {formatPrice(course.pricing.perSessionPrice)} per session
              </p>

              {course.pricing.paymentPlans?.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {course.pricing.paymentPlans.map((plan, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-semibold rounded-full"
                    >
                      {plan}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              {course.pricing.moneyBackGuarantee && (
                <div className="flex gap-2">
                  <Shield className="text-green-600" />
                  100% money-back guarantee
                </div>
              )}

              {course.pricing.freeTrial && (
                <div className="flex gap-2">
                  <Award className="text-green-600" />
                  First class free trial available
                </div>
              )}

              <div className="flex gap-2">
                <CreditCard className="text-green-600" />
                Secure payment processing
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow">
        <div className="max-w-5xl mx-auto px-6 py-3 flex gap-3">
          <button
            onClick={() => setShowEnquiryModal(true)}
            className="flex-1 border-2 border-gray-900 font-bold py-3 rounded-xl"
          >
            Enquire Now
          </button>

          <button
            onClick={() => navigate(`/checkout/${course.id}`)}
            className="flex-1 bg-gradient-to-r from-brand-orange to-brand-coral text-white font-bold py-3 rounded-xl"
          >
            Purchase Now
          </button>
        </div>
      </div>

      <CourseEnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        courseId={course.id}
        courseTitle={course.title}
        courseCategory={course.category}
      />
    </div>
  );
};
