import React, { useState } from 'react';
import { Wrench, Calculator, BookOpen, Brain, Palette, Music, Lock, Sparkles } from 'lucide-react';
import { Toast } from '../components/Toast';

const freeTools = [
  { id: '1', name: 'Math Calculator', icon: Calculator, description: 'Interactive calculator with step-by-step solutions', color: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Reading Assistant', icon: BookOpen, description: 'Text-to-speech and comprehension tools', color: 'from-green-500 to-emerald-500' },
  { id: '3', name: 'Brain Games', icon: Brain, description: 'Memory and logic puzzles for cognitive development', color: 'from-purple-500 to-pink-500' },
  { id: '4', name: 'Art Studio', icon: Palette, description: 'Digital drawing and coloring tools', color: 'from-orange-500 to-red-500' },
  { id: '5', name: 'Music Maker', icon: Music, description: 'Create melodies and learn music basics', color: 'from-indigo-500 to-blue-500' },
];

export const Games: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  const handleToolClick = () => {
    setShowToast(true);
  };

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      <main className="max-w-[420px] md:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-12">
        <div className="hidden md:block mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-8 h-8 text-brand-green" />
            <h1 className="text-3xl font-bold text-gray-900">Free Tools</h1>
          </div>
          <p className="text-base text-gray-600">Educational tools to support learning</p>
        </div>

        <div className="mb-6 md:mb-8 px-5 py-4 md:py-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-brand-green via-emerald-500 to-brand-sky text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-base md:text-xl font-bold">Coming Soon!</span>
          </div>
          <p className="text-sm md:text-base text-white/95 leading-relaxed">
            We're building powerful free educational tools to help your child learn better. Interactive calculators, reading aids, brain games, and more!
          </p>
        </div>

        <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Available Tools</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {freeTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={handleToolClick}
                className="bg-white rounded-2xl md:rounded-3xl shadow-sm border-2 border-gray-200 p-4 md:p-6 text-left transition-all hover:shadow-lg active:scale-[0.98] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-green/5 to-brand-sky/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-gray-900">{tool.name}</h3>
                        <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Free to use</span>
                    <span className="px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-bold">
                      Launch Soon
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 md:mt-12 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-green/20 to-brand-sky/20 flex items-center justify-center">
            <Wrench className="w-8 h-8 text-brand-green" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Get Early Access</h3>
          <p className="text-sm text-gray-600 mb-4">
            Be among the first to try our free educational tools when they launch!
          </p>
          <button
            onClick={handleToolClick}
            className="px-6 py-2.5 bg-gradient-to-r from-brand-green to-brand-sky text-white rounded-xl font-semibold text-sm hover:shadow-md transition-all"
          >
            Notify Me
          </button>
        </div>
      </main>

      {showToast && (
        <Toast
          message="We'll notify you when tools are ready!"
          type="info"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
