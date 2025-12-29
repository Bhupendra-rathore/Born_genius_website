import React, { useState, useEffect } from 'react';
import { X, Mail, User, Phone, Baby, Sparkles } from 'lucide-react';
import { articleService } from '../services/articleService';
import { ArticleLead } from '../types';
import { useAuth } from '../hooks/useAuth';

interface LeadCaptureModalProps {
  articleId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  articleId,
  isOpen,
  onClose,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [continueAsGuest, setContinueAsGuest] = useState(false);
  const [formData, setFormData] = useState<ArticleLead>({
    article_id: articleId,
    email: '',
    name: '',
    phone: '',
    child_age: undefined,
    interested_in: '',
    source: 'article_modal',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user && !continueAsGuest) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: user.name || '',
        phone: user.phone || '',
        child_age: user.child_age || undefined,
      }));
    }
  }, [isAuthenticated, user, continueAsGuest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await articleService.submitLead(formData);
      if (success) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'child_age' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">
              We'll send you valuable parenting tips and educational insights straight to your inbox.
            </p>
          </div>
        ) : (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Get Free Learning Tips</h2>
              <div className="flex items-center gap-2">
                {isAuthenticated && !continueAsGuest && (
                  <button
                    type="button"
                    onClick={() => setContinueAsGuest(true)}
                    className="text-sm text-brand-blue hover:text-brand-blue/80 font-medium"
                  >
                    Continue as Guest
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {isAuthenticated && !continueAsGuest && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    Logged in as {user?.name || user?.email}
                  </p>
                </div>
              )}
              <div className="bg-gradient-to-br from-brand-blue/10 to-brand-green/10 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 font-medium">
                  Join 10,000+ parents receiving expert advice on early childhood education
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly={isAuthenticated && !continueAsGuest && !!user?.email}
                    className={`w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue ${
                      isAuthenticated && !continueAsGuest && !!user?.email ? 'bg-gray-50' : ''
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={isAuthenticated && !continueAsGuest && !!user?.name}
                    className={`w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue ${
                      isAuthenticated && !continueAsGuest && !!user?.name ? 'bg-gray-50' : ''
                    }`}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="child_age" className="block text-sm font-semibold text-gray-700 mb-2">
                  Child's Age
                </label>
                <div className="relative">
                  <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="child_age"
                    name="child_age"
                    value={formData.child_age || ''}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue appearance-none bg-white"
                  >
                    <option value="">Select age</option>
                    <option value="0">0-1 years</option>
                    <option value="1">1-2 years</option>
                    <option value="2">2-3 years</option>
                    <option value="3">3-4 years</option>
                    <option value="4">4-5 years</option>
                    <option value="5">5-6 years</option>
                    <option value="6">6-7 years</option>
                    <option value="7">7-8 years</option>
                    <option value="8">8+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    readOnly={isAuthenticated && !continueAsGuest && !!user?.phone}
                    className={`w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue ${
                      isAuthenticated && !continueAsGuest && !!user?.phone ? 'bg-gray-50' : ''
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="interested_in" className="block text-sm font-semibold text-gray-700 mb-2">
                  Interested In
                </label>
                <input
                  type="text"
                  id="interested_in"
                  name="interested_in"
                  value={formData.interested_in}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  placeholder="e.g., Chess, Math, Public Speaking"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-blue text-white py-3 rounded-xl font-semibold hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Get Free Tips'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By subscribing, you agree to receive educational content and course updates. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
