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
