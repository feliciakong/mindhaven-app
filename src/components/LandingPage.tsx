import React from 'react';
import { signInWithGoogle } from '../lib/firebase';
import { Sparkles, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2D2B2A] flex flex-col justify-between p-6 md:p-12">
      {/* Header */}
      <header className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6B9080] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-[#F4F1DE]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#2D2B2A]">MindHaven</h1>
            <p className="text-xs text-[#6C757D] font-medium">Personal AI Reflection Sanctuary</p>
          </div>
        </div>

        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B9080] hover:bg-[#52796F] text-white text-sm font-medium transition-all shadow-sm hover:shadow"
        >
          <span>Sign In with Google</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Hero Body */}
      <main className="max-w-3xl mx-auto text-center my-auto py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F1EE] border border-[#CCE3DE] text-[#2C5E4C] text-xs font-semibold mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#6B9080]" />
          <span>Powered by Gemini 3.6 Flash & Firebase Firestore</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-[#2D2B2A] leading-tight mb-6">
          A quiet space for your thoughts, guided by intuitive AI.
        </h2>

        <p className="text-lg md:text-xl text-[#5C5855] max-w-2xl mx-auto leading-relaxed mb-10">
          MindHaven combines continuous Socratic reflection with private cloud storage, 
          transforming daily thoughts into meaningful self-discoveries and actionable clarity.
        </p>

        <button
          onClick={signInWithGoogle}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#6B9080] hover:bg-[#52796F] text-white font-medium text-base transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#8C857B] py-4">
        © MindHaven. Minimalist AI Reflection Sanctuary.
      </footer>
    </div>
  );
}
