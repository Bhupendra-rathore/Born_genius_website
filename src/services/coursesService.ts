import { supabase } from '../lib/supabase';
import { Course } from '../types';

export interface CourseFormData {
  title: string;
  category: string;
  ageRange: string;
  duration: string;
  description: string;
  fullDescription?: string;
  tier?: string;
  imageColor?: string;
  icon?: string;
  rating?: number;
  reviewCount?: number;
  isPopular?: boolean;
  isLocked?: boolean;
  spotsLeft?: number;
  viewingNow?: number;
  instructorId?: string;
  status?: string;
  learningOutcomes?: Array<{ text: string; icon: string }>;
  highlights?: Array<{ text: string; included: boolean }>;
  curriculum?: Array<{ weekNumber: number; title: string; description: string }>;
  schedule?: {
    daysPerWeek: number;
    duration: string;
    sessionLength: string;
    totalSessions: number;
    nextBatchDate: string;
    timeSlots: string[];
  };
  pricing?: {
    originalPrice: number;
    discountedPrice: number;
    currency: string;
    perSessionPrice: number;
    paymentPlans: string[];
    moneyBackGuarantee: boolean;
    freeTrial: boolean;
  };
  reviews?: Array<{
    parentName: string;
    parentPhoto: string;
    rating: number;
    comment: string;
    reviewDate: string;
    verified: boolean;
    images?: string[];
    videoUrl?: string;
    videoThumbnail?: string;
    helpfulCount?: number;
  }>;
  faqs?: Array<{ question: string; answer: string }>;
  prerequisites?: string[];
  relatedCourseIds?: string[];
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  console.log('🔍 Fetching course with ID:', id);
  
  // First, fetch the main course data
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (courseError) {
    console.error('❌ Error fetching course:', courseError);
    return null;
  }
  
  if (!courseData) {
    console.error('❌ No course data found');
    return null;
  }

  console.log('✅ Course data fetched:', courseData);

  // Fetch all related data separately for better error handling
  const [
    instructorResult,
    pricingResult,
    scheduleResult,
    learningOutcomesResult,
    highlightsResult,
    curriculumResult,
    reviewsResult,
    faqsResult,
    prerequisitesResult,
  ] = await Promise.all([
    supabase
      .from('instructors')
      .select('*')
      .eq('id', courseData.instructor_id)
      .maybeSingle(),
    supabase
      .from('course_pricing')
      .select('*')
      .eq('course_id', id)
      .maybeSingle(),
    supabase
      .from('course_schedules')
      .select('*')
      .eq('course_id', id)
      .maybeSingle(),
    supabase
      .from('learning_outcomes')
      .select('*')
      .eq('course_id', id)
      .order('order_position'),
    supabase
      .from('course_highlights')
      .select('*')
      .eq('course_id', id)
      .order('order_position'),
    supabase
      .from('curriculum_modules')
      .select('*')
      .eq('course_id', id)
      .order('order_position'),
    supabase
      .from('course_reviews')
      .select('*')
      .eq('course_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('course_faqs')
      .select('*')
      .eq('course_id', id)
      .order('order_position'),
    supabase
      .from('course_prerequisites')
      .select('*')
      .eq('course_id', id)
      .order('order_position'),
  ]);

  // Debug logging for pricing
  console.log('💰 Pricing result:', {
    data: pricingResult.data,
    error: pricingResult.error,
  });

  if (pricingResult.error) {
    console.error('❌ Pricing fetch error:', pricingResult.error);
  }

  if (!pricingResult.data) {
    console.warn('⚠️ No pricing data found for course:', id);
  } else {
    console.log('✅ Pricing data:', pricingResult.data);
  }

  const pricing = pricingResult.data;
  const schedule = scheduleResult.data;
  const instructor = instructorResult.data;

  return {
    id: courseData.id,
    title: courseData.title,
    category: courseData.category,
    ageRange: courseData.age_range,
    duration: courseData.duration,
    description: courseData.description,
    fullDescription: courseData.full_description,
    tier: courseData.tier,
    imageColor: courseData.image_color,
    icon: courseData.icon,
    rating: courseData.rating,
    reviewCount: courseData.review_count,
    isPopular: courseData.is_popular,
    isLocked: courseData.is_locked,
    spotsLeft: courseData.spots_left,
    viewingNow: courseData.viewing_now,

    instructor: instructor
      ? {
          id: instructor.id,
          name: instructor.name,
          photo: instructor.photo,
          bio: instructor.bio,
          yearsExperience: instructor.years_experience,
          specialization: instructor.specialization,
          isOnline: instructor.is_online,
        }
      : undefined,

    pricing: pricing
      ? {
          originalPrice: Number(pricing.original_price),
          discountedPrice: Number(pricing.discounted_price),
          currency: pricing.currency,
          perSessionPrice: Number(pricing.per_session_price),
          paymentPlans: pricing.payment_plans || [],
          moneyBackGuarantee: pricing.money_back_guarantee,
          freeTrial: pricing.free_trial,
        }
      : {
          originalPrice: 9999,
          discountedPrice: 7999,
          currency: 'INR',
          perSessionPrice: 500,
          paymentPlans: ['Full payment', '2 installments'],
          moneyBackGuarantee: true,
          freeTrial: true,
        },

    schedule: schedule
      ? {
          daysPerWeek: schedule.days_per_week,
          duration: schedule.duration,
          sessionLength: schedule.session_length,
          totalSessions: schedule.total_sessions,
          nextBatchDate: schedule.next_batch_date,
          timeSlots: schedule.time_slots || [],
        }
      : undefined,

    learningOutcomes:
      learningOutcomesResult.data?.map((lo) => ({
        id: lo.id,
        text: lo.text,
        icon: lo.icon,
      })) || [],
    highlights:
      highlightsResult.data?.map((h) => ({
        id: h.id,
        text: h.text,
        included: h.included,
      })) || [],
    curriculum:
      curriculumResult.data?.map((c) => ({
        week: c.week_number,
        title: c.title,
        description: c.description,
      })) || [],
    reviews:
      reviewsResult.data?.map((r) => ({
        id: r.id,
        parentName: r.parent_name,
        parentPhoto: r.parent_photo,
        rating: r.rating,
        comment: r.comment,
        date: r.review_date,
        verified: r.verified,
        images: r.images,
        videoUrl: r.video_url,
        videoThumbnail: r.video_thumbnail,
        helpfulCount: r.helpful_count,
      })) || [],
    faqs:
      faqsResult.data?.map((f) => ({
        question: f.question,
        answer: f.answer,
      })) || [],
    prerequisites:
      prerequisitesResult.data?.map((p) => p.prerequisite_text) || [],
  };
}

// ... rest of the functions remain the same
export async function fetchAllCourses(): Promise<Course[]> {
  const { data: coursesData, error: coursesError } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:instructors(*)
    `)
    .order('created_at', { ascending: false });

  if (coursesError) throw coursesError;
  if (!coursesData) return [];

  const courses = await Promise.all(
    coursesData.map(async (course) => {
      const [
        learningOutcomes,
        highlights,
        curriculum,
        schedule,
        pricing,
        reviews,
        faqs,
        prerequisites,
        relations,
      ] = await Promise.all([
        supabase
          .from('learning_outcomes')
          .select('*')
          .eq('course_id', course.id)
          .order('order_position'),
        supabase
          .from('course_highlights')
          .select('*')
          .eq('course_id', course.id)
          .order('order_position'),
        supabase
          .from('curriculum_modules')
          .select('*')
          .eq('course_id', course.id)
          .order('order_position'),
        supabase
          .from('course_schedules')
          .select('*')
          .eq('course_id', course.id)
          .maybeSingle(),
        supabase
          .from('course_pricing')
          .select('*')
          .eq('course_id', course.id)
          .maybeSingle(),
        supabase
          .from('course_reviews')
          .select('*')
          .eq('course_id', course.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('course_faqs')
          .select('*')
          .eq('course_id', course.id)
          .order('order_position'),
        supabase
          .from('course_prerequisites')
          .select('*')
          .eq('course_id', course.id)
          .order('order_position'),
        supabase
          .from('course_relations')
          .select('related_course_id')
          .eq('course_id', course.id),
      ]);

      return {
        id: course.id,
        title: course.title,
        category: course.category,
        ageRange: course.age_range,
        duration: course.duration,
        description: course.description,
        fullDescription: course.full_description,
        tier: course.tier,
        imageColor: course.image_color,
        icon: course.icon,
        rating: course.rating,
        reviewCount: course.review_count,
        isPopular: course.is_popular,
        isLocked: course.is_locked,
        spotsLeft: course.spots_left,
        viewingNow: course.viewing_now,
        instructor: course.instructor ? {
          id: course.instructor.id,
          name: course.instructor.name,
          photo: course.instructor.photo,
          bio: course.instructor.bio,
          yearsExperience: course.instructor.years_experience,
          specialization: course.instructor.specialization,
          isOnline: course.instructor.is_online,
        } : undefined,
        learningOutcomes: learningOutcomes.data?.map((lo) => ({
          id: lo.id,
          text: lo.text,
          icon: lo.icon,
        })),
        highlights: highlights.data?.map((h) => ({
          id: h.id,
          text: h.text,
          included: h.included,
        })),
        curriculum: curriculum.data?.map((c) => ({
          week: c.week_number,
          title: c.title,
          description: c.description,
        })),
        schedule: schedule.data ? {
          daysPerWeek: schedule.data.days_per_week,
          duration: schedule.data.duration,
          sessionLength: schedule.data.session_length,
          totalSessions: schedule.data.total_sessions,
          nextBatchDate: schedule.data.next_batch_date,
          timeSlots: schedule.data.time_slots,
        } : undefined,
        pricing: pricing.data ? {
          originalPrice: Number(pricing.data.original_price),
          discountedPrice: Number(pricing.data.discounted_price),
          currency: pricing.data.currency,
          perSessionPrice: Number(pricing.data.per_session_price),
          paymentPlans: pricing.data.payment_plans,
          moneyBackGuarantee: pricing.data.money_back_guarantee,
          freeTrial: pricing.data.free_trial,
        } : {
          originalPrice: 9999,
          discountedPrice: 7999,
          currency: 'INR',
          perSessionPrice: 500,
          paymentPlans: ['Full payment', '2 installments'],
          moneyBackGuarantee: true,
          freeTrial: true,
        },
        reviews: reviews.data?.map((r) => ({
          id: r.id,
          parentName: r.parent_name,
          parentPhoto: r.parent_photo,
          rating: r.rating,
          comment: r.comment,
          date: r.review_date,
          verified: r.verified,
          images: r.images,
          videoUrl: r.video_url,
          videoThumbnail: r.video_thumbnail,
          helpfulCount: r.helpful_count,
        })),
        faqs: faqs.data?.map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
        prerequisites: prerequisites.data?.map((p) => p.prerequisite_text),
        relatedCourses: relations.data?.map((r) => r.related_course_id),
      } as Course;
    })
  );

  return courses;
}

export async function createCourse(courseData: CourseFormData): Promise<string> {
  const { data: courseRow, error: courseError } = await supabase
    .from('courses')
    .insert({
      title: courseData.title,
      category: courseData.category,
      age_range: courseData.ageRange,
      duration: courseData.duration,
      description: courseData.description,
      full_description: courseData.fullDescription || '',
      tier: courseData.tier || 'mini',
      image_color: courseData.imageColor || 'from-blue-500 to-blue-600',
      icon: courseData.icon || '📚',
      rating: courseData.rating || 0,
      review_count: courseData.reviewCount || 0,
      is_popular: courseData.isPopular || false,
      is_locked: courseData.isLocked || false,
      spots_left: courseData.spotsLeft || 0,
      viewing_now: courseData.viewingNow || 0,
      instructor_id: courseData.instructorId || null,
      status: courseData.status || 'published',
    })
    .select()
    .single();

  if (courseError) throw courseError;
  if (!courseRow) throw new Error('Failed to create course');

  const courseId = courseRow.id;

  if (courseData.learningOutcomes?.length) {
    const outcomes = courseData.learningOutcomes.map((lo, index) => ({
      course_id: courseId,
      text: lo.text,
      icon: lo.icon,
      order_position: index,
    }));
    await supabase.from('learning_outcomes').insert(outcomes);
  }

  if (courseData.highlights?.length) {
    const highlights = courseData.highlights.map((h, index) => ({
      course_id: courseId,
      text: h.text,
      included: h.included,
      order_position: index,
    }));
    await supabase.from('course_highlights').insert(highlights);
  }

  if (courseData.curriculum?.length) {
    const modules = courseData.curriculum.map((c, index) => ({
      course_id: courseId,
      week_number: c.weekNumber,
      title: c.title,
      description: c.description,
      order_position: index,
    }));
    await supabase.from('curriculum_modules').insert(modules);
  }

  if (courseData.schedule) {
    await supabase.from('course_schedules').insert({
      course_id: courseId,
      days_per_week: courseData.schedule.daysPerWeek,
      duration: courseData.schedule.duration,
      session_length: courseData.schedule.sessionLength,
      total_sessions: courseData.schedule.totalSessions,
      next_batch_date: courseData.schedule.nextBatchDate,
      time_slots: courseData.schedule.timeSlots,
    });
  }

  if (courseData.pricing) {
    await supabase.from('course_pricing').insert({
      course_id: courseId,
      original_price: courseData.pricing.originalPrice,
      discounted_price: courseData.pricing.discountedPrice,
      currency: courseData.pricing.currency,
      per_session_price: courseData.pricing.perSessionPrice,
      payment_plans: courseData.pricing.paymentPlans,
      money_back_guarantee: courseData.pricing.moneyBackGuarantee,
      free_trial: courseData.pricing.freeTrial,
    });
  }

  if (courseData.reviews?.length) {
    const reviews = courseData.reviews.map((r) => ({
      course_id: courseId,
      parent_name: r.parentName,
      parent_photo: r.parentPhoto,
      rating: r.rating,
      comment: r.comment,
      review_date: r.reviewDate,
      verified: r.verified,
      images: r.images || [],
      video_url: r.videoUrl,
      video_thumbnail: r.videoThumbnail,
      helpful_count: r.helpfulCount || 0,
    }));
    await supabase.from('course_reviews').insert(reviews);
  }

  if (courseData.faqs?.length) {
    const faqs = courseData.faqs.map((f, index) => ({
      course_id: courseId,
      question: f.question,
      answer: f.answer,
      order_position: index,
    }));
    await supabase.from('course_faqs').insert(faqs);
  }

  if (courseData.prerequisites?.length) {
    const prerequisites = courseData.prerequisites.map((p, index) => ({
      course_id: courseId,
      prerequisite_text: p,
      order_position: index,
    }));
    await supabase.from('course_prerequisites').insert(prerequisites);
  }

  if (courseData.relatedCourseIds?.length) {
    const relations = courseData.relatedCourseIds.map((rcId) => ({
      course_id: courseId,
      related_course_id: rcId,
    }));
    await supabase.from('course_relations').insert(relations);
  }

  return courseId;
}

export async function updateCourse(
  id: string,
  courseData: CourseFormData
): Promise<void> {
  const { error: courseError } = await supabase
    .from('courses')
    .update({
      title: courseData.title,
      category: courseData.category,
      age_range: courseData.ageRange,
      duration: courseData.duration,
      description: courseData.description,
      full_description: courseData.fullDescription || '',
      tier: courseData.tier || 'mini',
      image_color: courseData.imageColor || 'from-blue-500 to-blue-600',
      icon: courseData.icon || '📚',
      rating: courseData.rating || 0,
      review_count: courseData.reviewCount || 0,
      is_popular: courseData.isPopular || false,
      is_locked: courseData.isLocked || false,
      spots_left: courseData.spotsLeft || 0,
      viewing_now: courseData.viewingNow || 0,
      instructor_id: courseData.instructorId || null,
      status: courseData.status || 'published',
    })
    .eq('id', id);

  if (courseError) throw courseError;

  await supabase.from('learning_outcomes').delete().eq('course_id', id);
  if (courseData.learningOutcomes?.length) {
    const outcomes = courseData.learningOutcomes.map((lo, index) => ({
      course_id: id,
      text: lo.text,
      icon: lo.icon,
      order_position: index,
    }));
    await supabase.from('learning_outcomes').insert(outcomes);
  }

  await supabase.from('course_highlights').delete().eq('course_id', id);
  if (courseData.highlights?.length) {
    const highlights = courseData.highlights.map((h, index) => ({
      course_id: id,
      text: h.text,
      included: h.included,
      order_position: index,
    }));
    await supabase.from('course_highlights').insert(highlights);
  }

  await supabase.from('curriculum_modules').delete().eq('course_id', id);
  if (courseData.curriculum?.length) {
    const modules = courseData.curriculum.map((c, index) => ({
      course_id: id,
      week_number: c.weekNumber,
      title: c.title,
      description: c.description,
      order_position: index,
    }));
    await supabase.from('curriculum_modules').insert(modules);
  }

  await supabase.from('course_schedules').delete().eq('course_id', id);
  if (courseData.schedule) {
    await supabase.from('course_schedules').insert({
      course_id: id,
      days_per_week: courseData.schedule.daysPerWeek,
      duration: courseData.schedule.duration,
      session_length: courseData.schedule.sessionLength,
      total_sessions: courseData.schedule.totalSessions,
      next_batch_date: courseData.schedule.nextBatchDate,
      time_slots: courseData.schedule.timeSlots,
    });
  }

  await supabase.from('course_pricing').delete().eq('course_id', id);
  if (courseData.pricing) {
    await supabase.from('course_pricing').insert({
      course_id: id,
      original_price: courseData.pricing.originalPrice,
      discounted_price: courseData.pricing.discountedPrice,
      currency: courseData.pricing.currency,
      per_session_price: courseData.pricing.perSessionPrice,
      payment_plans: courseData.pricing.paymentPlans,
      money_back_guarantee: courseData.pricing.moneyBackGuarantee,
      free_trial: courseData.pricing.freeTrial,
    });
  }

  await supabase.from('course_reviews').delete().eq('course_id', id);
  if (courseData.reviews?.length) {
    const reviews = courseData.reviews.map((r) => ({
      course_id: id,
      parent_name: r.parentName,
      parent_photo: r.parentPhoto,
      rating: r.rating,
      comment: r.comment,
      review_date: r.reviewDate,
      verified: r.verified,
      images: r.images || [],
      video_url: r.videoUrl,
      video_thumbnail: r.videoThumbnail,
      helpful_count: r.helpfulCount || 0,
    }));
    await supabase.from('course_reviews').insert(reviews);
  }

  await supabase.from('course_faqs').delete().eq('course_id', id);
  if (courseData.faqs?.length) {
    const faqs = courseData.faqs.map((f, index) => ({
      course_id: id,
      question: f.question,
      answer: f.answer,
      order_position: index,
    }));
    await supabase.from('course_faqs').insert(faqs);
  }

  await supabase.from('course_prerequisites').delete().eq('course_id', id);
  if (courseData.prerequisites?.length) {
    const prerequisites = courseData.prerequisites.map((p, index) => ({
      course_id: id,
      prerequisite_text: p,
      order_position: index,
    }));
    await supabase.from('course_prerequisites').insert(prerequisites);
  }

  await supabase.from('course_relations').delete().eq('course_id', id);
  if (courseData.relatedCourseIds?.length) {
    const relations = courseData.relatedCourseIds.map((rcId) => ({
      course_id: id,
      related_course_id: rcId,
    }));
    await supabase.from('course_relations').insert(relations);
  }
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchInstructors() {
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createInstructor(instructor: {
  name: string;
  photo: string;
  bio: string;
  yearsExperience: number;
  specialization: string;
  isOnline: boolean;
}) {
  const { data, error } = await supabase
    .from('instructors')
    .insert({
      name: instructor.name,
      photo: instructor.photo,
      bio: instructor.bio,
      years_experience: instructor.yearsExperience,
      specialization: instructor.specialization,
      is_online: instructor.isOnline,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}