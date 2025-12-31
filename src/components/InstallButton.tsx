import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show banner after 5 seconds
      setTimeout(() => setShowBanner(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed');
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  // Don't show if no prompt or already dismissed
  if (!showBanner || !deferredPrompt) return null;

  return (
    <>
      {/* Fixed Bottom Banner */}
      <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl p-4 z-50 border-2 border-brand-orange animate-slide-up">
        <button
          onClick={() => setShowBanner(false)}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-coral rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🎓</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Install Born Genius
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Get quick access and learn offline!
            </p>
            <button
              onClick={handleInstall}
              className="bg-gradient-to-r from-brand-orange to-brand-coral text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Install Now
            </button>
          </div>
        </div>
      </div>

      {/* Or Simple Floating Button */}
      {/* <button
        onClick={handleInstall}
        className="fixed bottom-24 right-4 bg-gradient-to-r from-brand-orange to-brand-coral text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-50 flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        <span className="font-semibold">Install App</span>
      </button> */}
    </>
  );
};
