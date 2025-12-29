import { supabase } from '../lib/supabase';
import { CourseEnquiry } from '../types';

export const submitCourseEnquiry = async (enquiry: CourseEnquiry): Promise<{ success: boolean; error?: string; data?: CourseEnquiry }> => {
  try {
    const { data, error } = await supabase
      .from('course_enquiries')
      .insert([enquiry])
      .select()
      .single();

    if (error) {
      console.error('Error submitting enquiry:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error submitting enquiry:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

export const generateWhatsAppLink = (enquiry: CourseEnquiry, courseTitle: string): string => {
  const phoneNumber = '919876543210';

  const message = `Hi! I'm interested in the *${courseTitle}* course.\n\n` +
    `*Name:* ${enquiry.name}\n` +
    `*Email:* ${enquiry.email}\n` +
    `*Phone:* ${enquiry.country_code} ${enquiry.phone_number}\n` +
    `*Preferred timing:* ${enquiry.preferred_timing}\n` +
    (enquiry.major_objection ? `*Concern:* ${enquiry.major_objection}\n` : '') +
    (enquiry.other_objection_details ? `*Details:* ${enquiry.other_objection_details}\n` : '') +
    `\nLooking forward to connecting with you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{7,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

export const PREFERRED_TIMINGS = [
  'Morning (9AM - 12PM)',
  'Afternoon (12PM - 4PM)',
  'Evening (4PM - 8PM)',
  'Night (8PM - 10PM)',
];

export const OBJECTION_OPTIONS = [
  'Too expensive',
  'Not sure about quality',
  'Schedule doesn\'t fit',
  'Child might not be interested',
  'Need more information',
  'Other (please describe)',
];
