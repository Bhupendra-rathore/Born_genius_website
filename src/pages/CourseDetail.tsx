import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Star, ChevronDown, ChevronUp, Check, X, Clock, Calendar, Users, Award, Shield, CreditCard, ThumbsUp, Play } from 'lucide-react';
import { fetchCourseById } from '../services/coursesService';
import { Course } from '../types';
import { CourseEnquiryModal } from '../components/CourseEnquiryModal';
import { addToFavorites, removeFromFavorites } from '../services/favoritesService';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [instructorImageError, setInstructorImageError] = useState(false);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
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

  const relatedCourses: Course[] = [];

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handlePurchaseNow = () => {
  // Option 1: Open WhatsApp
  const phoneNumber = '918078694114';
  const message = encodeURIComponent(
    `Hi! I'm interested in purchasing "${course.title}". Can you help me with the enrollment process?`
  );
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  ;
  };

  const handleEnquireNow = () => {
    setShowEnquiryModal(true);
  };

  // Helper function to check if instructor photo is a URL
  const isImageUrl = (photo: string) => {
    return photo && (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('/'));
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const getVimeoId = (url?: string) => {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};


  return (
    <div className="pb-32 md:pb-0 bg-gray-50">
      <div className="relative">
<div className="w-full h-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 md:top-6 left-4 md:left-6 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
          </button>

          <div className="absolute top-4 md:top-6 right-4 md:right-6 flex gap-2 z-10">
            <button className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
            </button>
            <button
              onClick={async () => {
  if (!course) return;

  if (isFavorited) {
    await removeFromFavorites(course.id);
    setIsFavorited(false);
  } else {
    await addToFavorites(course.id);
    setIsFavorited(true);
  }
}}

              className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
            </button>
          </div>

          {/* COURSE MEDIA */}
<div className="w-full h-auto relative">

  {/* 1️⃣ Vimeo Video */}
  {getVimeoId(course.vimeo_video_url) ? (
    <div className="relative pt-[56.25%]">
      <iframe
        src={`https://player.vimeo.com/video/${getVimeoId(course.vimeo_video_url)}`}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>

  /* 2️⃣ Image */
  ) : course.image_url ? (
    <img
      src={course.image_url}
      alt={course.title}
      className="w-full h-[240px] object-cover"
      loading="lazy"
    />

  /* 3️⃣ Icon fallback */
  ) : (
    <div
      className={`h-[240px] flex items-center justify-center bg-gradient-to-br ${course.imageColor}`}
    >
      <span className="text-7xl">{course.icon}</span>
    </div>
  )}
</div>


          {course.pricing && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-gray-900">
              1 / 8
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[420px] md:max-w-4xl lg:max-w-5xl mx-auto bg-white rounded-t-3xl -mt-6 relative z-10">
        <div className="px-4 md:px-8 lg:px-12 pt-6 md:pt-8 pb-4 md:pb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{course.title}</h1>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            {course.category} • Live Online Sessions
          </p>
          <div className="flex items-center gap-2 text-sm md:text-base text-gray-600">
            <span className="font-medium">Ages {course.ageRange}</span>
            <span>•</span>
            <span className="font-medium">{course.duration}</span>
            <span>•</span>
            <span className="font-medium">{course.schedule?.totalSessions} sessions</span>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        {course.rating && course.reviewCount && (
          <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-6 h-6 fill-gray-900 text-gray-900" />
                  <span className="text-2xl font-bold text-gray-900">{course.rating}</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gray-900 text-gray-900" />
                  ))}
                </div>
              </div>

              <div className="h-12 w-px bg-gray-300" />

              {course.isPopular && (
                <>
                  <div className="text-center flex-1">
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs font-bold text-gray-900">Parent's Choice</div>
                  </div>
                  <div className="h-12 w-px bg-gray-300" />
                </>
              )}

              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-gray-900">{course.reviewCount}</div>
                <div className="text-xs text-gray-600">Reviews</div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200" />

        {course.instructor && (
          <>
            <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-brand-coral flex items-center justify-center overflow-hidden">
                    {isImageUrl(course.instructor.photo) && !instructorImageError ? (
                      <img 
                        src={course.instructor.photo}
                        alt={course.instructor.name}
                        className="w-full h-full object-cover"
                        onError={() => setInstructorImageError(true)}
                      />
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {instructorImageError 
                          ? getInitials(course.instructor.name)
                          : course.instructor.photo
                        }
                      </span>
                    )}
                  </div>
                  {course.instructor.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">
                    Learn with {course.instructor.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Expert • {course.instructor.yearsExperience} years teaching
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-3">{course.instructor.bio}</p>
            </div>
            <div className="border-t border-gray-200" />
          </>
        )}

        {(course.spotsLeft || course.viewingNow) && (
          <>
            <div className="px-4 md:px-8 lg:px-12 py-4 md:py-5 bg-gradient-to-r from-red-50 to-orange-50 border-y border-red-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600" />
                <span className="text-sm font-bold text-red-900">
                  {course.spotsLeft && `Only ${course.spotsLeft} spots left! `}
                  {course.viewingNow && `${course.viewingNow} parents viewing now`}
                </span>
              </div>
            </div>
          </>
        )}

        {course.highlights && course.highlights.length > 0 && (
          <>
            <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What's included</h3>
              <div className="space-y-3">
                {course.highlights.map((highlight) => (
                  <div key={highlight.id} className="flex items-start gap-3">
                    {highlight.included ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${highlight.included ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                      {highlight.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200" />
          </>
        )}

        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">About this course</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {showFullDescription ? course.fullDescription : course.description}
          </p>
          {course.fullDescription && course.fullDescription.length > course.description.length && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-sm font-semibold text-brand-orange mt-2 flex items-center gap-1"
            >
              {showFullDescription ? (
                <>
                  Show less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        <div className="border-t border-gray-200" />

        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <>
            <div className="px-4 py-6 bg-gradient-to-br from-blue-50 to-green-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What your child will learn</h3>
              <div className="grid grid-cols-1 gap-3">
                {course.learningOutcomes.map((outcome) => (
                  <div key={outcome.id} className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm">
                    <span className="text-2xl flex-shrink-0">{outcome.icon}</span>
                    <span className="text-sm text-gray-900 font-medium">{outcome.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200" />
          </>
        )}

        {course.curriculum && course.curriculum.length > 0 && (
          <>
            <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly curriculum</h3>
              <div className="space-y-3">
                {course.curriculum.map((module) => (
                  <div key={module.week} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full">
                        Week {module.week}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900">{module.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200" />
          </>
        )}

        {course.schedule && (
          <>
            <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule & Format</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {course.schedule.daysPerWeek} days per week
                    </div>
                    <div className="text-sm text-gray-600">Next batch starts {formatDate(course.schedule.nextBatchDate)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {course.schedule.sessionLength} per session
                    </div>
                    <div className="text-sm text-gray-600">{course.schedule.totalSessions} total sessions</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Available time slots</div>
                    <div className="text-sm text-gray-600">{course.schedule.timeSlots.join(' • ')}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200" />
          </>
        )}

        {course.reviews && course.reviews.length > 0 && (
          <>
            <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  <Star className="w-5 h-5 inline fill-gray-900 text-gray-900 mr-1" />
                  {course.rating} • {course.reviewCount} reviews
                </h3>
              </div>
              <div className="space-y-6">
                {course.reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-xl p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                        {review.parentPhoto}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-900">{review.parentName}</span>
                          {review.verified && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex-shrink-0">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{formatDate(review.date)}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.comment}</p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-3">
                        {review.images.map((image, idx) => (
                          <div key={idx} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                              src={image}
                              alt={`Review ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {review.videoUrl && (
                      <div className="mb-3">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <iframe
                            src={review.videoUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`Review video by ${review.parentName}`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-medium">Helpful</span>
                        {review.helpfulCount && review.helpfulCount > 0 && (
                          <span className="text-xs text-gray-500">({review.helpfulCount})</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {course.reviewCount && course.reviewCount > 3 && (
                <button className="w-full mt-4 py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-colors">
                  Show all {course.reviewCount} reviews
                </button>
              )}
            </div>
            <div className="border-t border-gray-200" />
          </>
        )}

        {course.faqs && course.faqs.length > 0 && (
          <>
            <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently asked questions</h3>
              <div className="space-y-2">
                {course.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-900 pr-2">{faq.question}</span>
                      {expandedFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-4 pb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200" />
          </>
        )}

        {course.pricing && (
          <>
            <div className="px-4 py-6 bg-gradient-to-br from-green-50 to-blue-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing & guarantee</h3>
              <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(course.pricing.discountedPrice)}
                  </span>
                  {course.pricing.originalPrice > course.pricing.discountedPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(course.pricing.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Just {formatPrice(course.pricing.perSessionPrice)} per session
                </p>
                <div className="flex flex-wrap gap-2">
                  {course.pricing.paymentPlans.map((plan, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-semibold rounded-full">
                      {plan}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {course.pricing.moneyBackGuarantee && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="font-medium">100% money-back guarantee</span>
                  </div>
                )}
                {course.pricing.freeTrial && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="font-medium">First class free trial available</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Secure payment processing</span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200" />
          </>
        )}

        {relatedCourses && relatedCourses.length > 0 && (
          <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">You might also like</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {relatedCourses.map((relatedCourse) => (
                <button
                  key={relatedCourse.id}
                  onClick={() => navigate(`/course/${relatedCourse.id}`)}
                  className="flex-shrink-0 w-[160px] transition-transform active:scale-95"
                >
                  <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${relatedCourse.imageColor} flex items-center justify-center mb-2 shadow-md`}>
                    <span className="text-5xl">{relatedCourse.icon}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1 text-left line-clamp-2">
                    {relatedCourse.title}
                  </h4>
                  <p className="text-xs text-gray-500 text-left">Ages {relatedCourse.ageRange}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="max-w-[420px] mx-auto px-4 py-3">
          {course.pricing && (
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-gray-500">Total price</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(course.pricing.discountedPrice)}
                  </span>
                  {course.pricing.originalPrice > course.pricing.discountedPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(course.pricing.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              {course.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                  <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleEnquireNow}
              className="flex-1 py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all active:scale-95"
            >
              Enquire Now
            </button>
            <button
              onClick={handlePurchaseNow}
              className="flex-1 py-3 bg-gradient-to-r from-brand-orange to-brand-coral text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Purchase Now
            </button>
          </div>
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
