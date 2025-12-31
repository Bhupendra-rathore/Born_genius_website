import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-brand-orange to-brand-coral text-white rounded-2xl shadow-2xl p-4 z-50 animate-slide-up">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🎓</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Install Born Genius</h3>
          <p className="text-sm text-white/90 mb-3">
            Install our app for quick access and offline learning!
          </p>
          <button
            onClick={handleInstall}
            className="bg-white text-brand-orange px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <Download className="w-4 h-4" />
            Install Now
          </button>
        </div>
      </div>
    </div>
  );
};
