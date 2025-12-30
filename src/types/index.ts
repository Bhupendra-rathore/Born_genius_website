export interface Instructor {
  id: string;
  name: string;
  photo: string;
  bio: string;
  yearsExperience: number;
  specialization: string;
  isOnline?: boolean;
}

export interface Review {
  id: string;
  parentName: string;
  parentPhoto: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  images?: string[];
  videoUrl?: string;
  videoThumbnail?: string;
  helpfulCount?: number;
}

export interface LearningOutcome {
  id: string;
  text: string;
  icon: string;
}

export interface CourseHighlight {
  id: string;
  text: string;
  included: boolean;
}

export interface WeeklyModule {
  week: number;
  title: string;
  description: string;
}

export interface Schedule {
  daysPerWeek: number;
  duration: string;
  sessionLength: string;
  totalSessions: number;
  nextBatchDate: string;
  timeSlots: string[];
}

export interface Pricing {
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  perSessionPrice: number;
  paymentPlans: string[];
  moneyBackGuarantee: boolean;
  freeTrial: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  ageRange: string;
  duration: string;
  description: string;
  tier?: 'mini' | 'premium';
  isLocked?: boolean;
  imageColor?: string;
  icon?: string;
  fullDescription?: string;
  instructor?: Instructor;
  rating?: number;
  reviewCount?: number;
  isPopular?: boolean;
  spotsLeft?: number;
  viewingNow?: number;
  learningOutcomes?: LearningOutcome[];
  highlights?: CourseHighlight[];
  curriculum?: WeeklyModule[];
  schedule?: Schedule;
  pricing?: Pricing;
  reviews?: Review[];
  faqs?: FAQ[];
  relatedCourses?: string[];
  prerequisites?: string[];
  image_url?: string | null;
  vimeo_video_url?: string | null;

}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  upvotes_count?: number;
  views_count?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  author_photo: string;
  image_url?: string;
  published_date: string;
  upvotes_count: number;
  views_count: number;
  featured: boolean;
  status: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  canonical_url?: string;
  image_alt_text?: string;
  include_in_sitemap?: boolean;
  scheduled_publish_date?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  schema_json?: Record<string, any>;
  table_of_contents?: TOCItem[];
  redirect_from?: string[];
  word_count?: number;
  reading_time_minutes?: number;
}

export interface ArticleUpvote {
  id: string;
  article_id: string;
  session_id: string;
  ip_address?: string;
  created_at: string;
}

export interface ArticleLead {
  id?: string;
  article_id?: string;
  email: string;
  name?: string;
  phone?: string;
  child_age?: number;
  interested_in?: string;
  source?: string;
  created_at?: string;
}

export interface ArticleView {
  id?: string;
  article_id: string;
  session_id: string;
  ip_address?: string;
  duration_seconds?: number;
  created_at?: string;
}

export interface ArticleStats {
  upvotes_count: number;
  views_count: number;
  has_upvoted: boolean;
}

export interface CourseRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  childAge: number;
  courseRequest: string;
  timestamp: string;
}

export interface CourseEnquiry {
  id?: string;
  course_id: string;
  name: string;
  email: string;
  phone_number: string;
  country_code: string;
  preferred_timing: string;
  major_objection?: string;
  other_objection_details?: string;
  source?: string;
  created_at?: string;
}

export interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export interface User {
  name: string;
  childAge: number;
  isLoggedIn: boolean;
}

export type ToastType = 'success' | 'error' | 'info';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

export interface SEOChecklistItem {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  message?: string;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  tags: string[];
  image_url: string;
  image_alt_text: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  secondary_keywords: string[];
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  robots_index: boolean;
  robots_follow: boolean;
  include_in_sitemap: boolean;
  status: 'draft' | 'published' | 'scheduled';
  scheduled_publish_date?: string;
  featured: boolean;
}

export interface CTABlock {
  type: 'cta';
  content: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    backgroundColor: string;
  };
}

export interface FAQBlock {
  type: 'faq';
  content: {
    question: string;
    answer: string;
  };
}
