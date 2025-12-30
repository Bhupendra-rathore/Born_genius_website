import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  User,
  Baby,
  BookOpen,
  Heart,
  HelpCircle,
  LogOut,
  Phone,
  Sun,
  Moon,
} from 'lucide-react';
import { supabase } from '../lib/supabase';



/* ================= TYPES ================= */
type ViewType =
  | 'main'
  | 'profile'
  | 'children'
  | 'courses'
  | 'wishlist'
  | 'support';

/* ================= COMPONENT ================= */
export const Account: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  /* LOGIN MODAL */
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ONBOARDING */
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);


  /* FAVORITES */
  const [favorites, setFavorites] = useState<any[]>([]);

  /* ================= AUTH LISTENER ================= */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        checkProfile(data.user.id);
        loadFavorites(data.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          checkProfile(session.user.id);
          loadFavorites(session.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ================= LOAD PROFILE ================= */
  const checkProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, parent_name, child_name, child_age, phone')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Profile fetch error:', error);
    return;
  }

  if (!data) {
    setShowOnboarding(true);
    return;
  }

  // ✅ Profile exists
  setShowOnboarding(false);
  setParentName(data.parent_name || '');
  setChildName(data.child_name || '');
  setChildAge(data.child_age?.toString() || '');
  setPhone(data.phone || '');
};


  /* ================= LOAD FAVORITES ================= */
 const loadFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('course_favorites')
    .select(`
      course_id,
      courses (
        id,
        title,
        age_range,
        duration,
        image_color,
        icon
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Favorites load error:', error);
    return;
  }

  setFavorites(data || []);
};

  /* ================= AUTH ACTIONS ================= */
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const loginWithEmailLink = async () => {
    if (!email) return;
    setLoading(true);

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setEmailSent(true);
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  /* ================= SAVE ONBOARDING ================= */
  const submitOnboarding = async () => {
  if (!parentName || !childName || !childAge) return;

  const { error } = await supabase.from('user_profiles').upsert({
    id: user.id,
    parent_name: parentName,
    child_name: childName,
    child_age: Number(childAge),
    phone,
    email: user.email,
  });

  if (!error) {
    setShowOnboarding(false);
    setProfileSaved(true);

    // auto-hide popup after 2s
    setTimeout(() => setProfileSaved(false), 2000);
  }
};
/* ================= SUPPORT PAGE ================= */
if (currentView === 'support' && isAuthenticated) {
  const handleWhatsAppClick = () => {
    const phoneNumber = '918078694114'; // WhatsApp number without + or spaces
    const message = encodeURIComponent(
      `Hi Born Genius Team! I need support with my account.`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    const email = 'support@borngenius.in';
    const subject = encodeURIComponent('Support Request - Born Genius');
    const body = encodeURIComponent(
      `Hi Born Genius Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nAccount Email: ${user?.email || 'N/A'}\n\nBest regards`
    );
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+918078694114';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCurrentView('main')}
            className="text-brand-orange font-semibold"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold ml-4">Support</h1>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-br from-brand-orange to-brand-coral rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-2">Need Help? 🤝</h2>
          <p className="text-white/90">
            We're here to help! Reach out to us through any of the options below.
          </p>
        </div>

        {/* Contact Options */}
        <div className="space-y-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-white border rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900">Chat on WhatsApp</h3>
              <p className="text-sm text-gray-500">+91 8078694114</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Email */}
          <button
            onClick={handleEmailClick}
            className="w-full bg-white border rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900">Send us an Email</h3>
              <p className="text-sm text-gray-500">support@borngenius.in</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Phone Call */}
          <button
            onClick={handleCallClick}
            className="w-full bg-white border rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900">Call Us</h3>
              <p className="text-sm text-gray-500">+91 8078694114</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-2xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">Quick Help</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-600">
                <strong>Response Time:</strong> We typically respond within 2-4 hours during business hours (9 AM - 6 PM IST)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-600">
                <strong>For urgent issues:</strong> Please use WhatsApp for the fastest response
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-600">
                <strong>Course inquiries:</strong> Include course name and your questions
              </p>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h4 className="font-semibold text-gray-900">Support Hours</h4>
          </div>
          <p className="text-sm text-gray-600">
            Monday - Saturday: 9:00 AM - 6:00 PM IST<br />
            Sunday: Closed
          </p>
        </div>
      </div>
    </div>
  );
}



  /* ================= WISHLIST PAGE ================= */
  if (currentView === 'wishlist' && isAuthenticated) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-bold mb-4">Wishlist</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite courses yet</p>
      ) : (
        <div className="space-y-4">
          {favorites.map((item) => {
            const course = item.courses;
            if (!course) return null;

            return (
              <button
  key={course.id}
  onClick={() => window.location.href = `/course/${course.id}`}
  className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm text-left active:scale-95 transition"
>

                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.image_color} flex items-center justify-center text-2xl`}
                >
                  {course.icon}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ages {course.age_range} • {course.duration}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setCurrentView('main')}
        className="mt-6 text-brand-orange font-semibold"
      >
        ← Back
      </button>
    </div>
  );
}
if (currentView === 'profile' && isAuthenticated) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-bold mb-4">Profile & Family</h1>

      <div className="bg-white rounded-2xl p-5 space-y-4">
        <input
          className="w-full border rounded-xl px-4 py-3"
          placeholder="Parent Name"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
        />

        <input
          className="w-full border rounded-xl px-4 py-3"
          placeholder="Child Name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />

        <input
          type="number"
          className="w-full border rounded-xl px-4 py-3"
          placeholder="Child Age"
          value={childAge}
          onChange={(e) => setChildAge(e.target.value)}
        />

        <input
          className="w-full border rounded-xl px-4 py-3"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Email (read only) */}
        <input
          disabled
          className="w-full border rounded-xl px-4 py-3 bg-gray-100 text-gray-500"
          value={user.email}
        />

        <button
          onClick={submitOnboarding}
          className="w-full bg-gradient-to-r from-brand-orange to-brand-coral text-white rounded-xl py-3 font-semibold"
        >
          Save Changes
        </button>
      </div>

      <button
        onClick={() => setCurrentView('main')}
        className="mt-6 text-brand-orange font-semibold"
      >
        ← Back
      </button>
    </div>
  );
}



  /* ================= SUB PAGES PLACEHOLDER ================= */
  if (currentView !== 'main' && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <h1 className="text-xl font-bold capitalize">{currentView}</h1>
        <p className="text-gray-500 mt-6">Coming soon…</p>
        <button
          onClick={() => setCurrentView('main')}
          className="mt-6 text-brand-orange font-semibold"
        >
          ← Back
        </button>
      </div>
    );
  }

  /* ================= MAIN PAGE ================= */
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">
          {isAuthenticated ? 'Your Account' : 'Profile'}
        </h1>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <Phone size={18} />
            <span>{user.email}</span>
          </div>
        ) : (
          <p className="text-gray-600 mb-6">
            Sign in to access your account features
          </p>
        )}

        {/* Appearance */}
        <div className="bg-white border rounded-2xl p-4 flex justify-between mb-6">
          <span className="font-semibold">Appearance</span>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="bg-gray-100 px-4 py-2 rounded-lg"
          >
            {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Menu */}
        <MenuItem icon={User} label="Profile & Family" onClick={() => setCurrentView('profile')} />
        <MenuItem icon={Baby} label="Child Profiles" onClick={() => setCurrentView('children')} />
        <MenuItem icon={BookOpen} label="My Courses" onClick={() => setCurrentView('courses')} />
        <MenuItem icon={Heart} label="Wishlist" onClick={() => setCurrentView('wishlist')} />
        <MenuItem icon={HelpCircle} label="Support" onClick={() => setCurrentView('support')} />

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="w-full mt-6 bg-white border rounded-2xl p-4 flex gap-3 hover:bg-red-50"
          >
            <LogOut className="text-red-600" />
            <span className="font-semibold text-red-600">Logout</span>
          </button>
        ) : (
          <div className="space-y-3 mt-6">
            <button
              onClick={loginWithGoogle}
              className="w-full bg-white border-2 rounded-2xl py-3 font-semibold"
            >
              Continue with Google
            </button>

            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-coral text-white rounded-2xl py-3 font-semibold"
            >
              Continue with Email
            </button>
          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-6">
          Born Genius v1.0.0
        </p>
      </main>

      {/* ================= EMAIL LOGIN MODAL ================= */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2">Continue with Email</h2>

            {!emailSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border rounded-xl px-4 py-3 mb-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={loginWithEmailLink}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-brand-orange to-brand-coral text-white rounded-xl py-3 font-semibold"
                >
                  {loading ? 'Sending…' : 'Send Confirmation Link'}
                </button>
              </>
            ) : (
              <p className="text-green-600 font-medium text-center">
                ✅ Check your email and click the link
              </p>
            )}
          </div>
        </div>
      )}

      {/* ================= ONBOARDING ================= */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tell us about your child</h2>

            <input
              className="w-full border rounded-xl px-4 py-3 mb-3"
              placeholder="Parent Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />
            <input
              className="w-full border rounded-xl px-4 py-3 mb-3"
              placeholder="Child Name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
            <input
              type="number"
              className="w-full border rounded-xl px-4 py-3 mb-3"
              placeholder="Child Age"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
            />
            <input
              className="w-full border rounded-xl px-4 py-3 mb-4"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={submitOnboarding}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-coral text-white rounded-xl py-3 font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
};

/* ================= MENU ITEM ================= */
const MenuItem = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full bg-white border rounded-2xl p-4 mb-2 flex justify-between items-center hover:bg-gray-50"
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="font-semibold">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </button>
);
