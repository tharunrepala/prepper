import React from 'react';
import WaveformVisualizer from '../components/WaveformVisualizer';

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }}
      />

      {/* Logo / brand */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-electric-500 flex items-center justify-center text-white font-display font-bold text-lg shadow-lg" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}>
          AI
        </div>
        <span className="font-display font-semibold text-white/60 text-lg tracking-wide">InterviewAI</span>
      </div>

      {/* Waveform hero */}
      <div className="mb-10 animate-float">
        <WaveformVisualizer isActive={true} isSpeaking={true} isListening={false} volume={0.3} size="lg" />
      </div>

      {/* Headline */}
      <h1 className="font-display text-5xl md:text-6xl font-bold text-center mb-4 leading-tight">
        Practice interviews
        <br />
        <span className="gradient-text">that talk back.</span>
      </h1>

      <p className="text-white/50 font-body text-lg text-center max-w-md mb-10 leading-relaxed">
        An AI voice interviewer asks domain-specific questions, adapts to your answers, and gives you a real feedback report — like the actual thing.
      </p>

      {/* Features row */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {[
          { icon: '🎙️', label: 'Voice-powered' },
          { icon: '🧠', label: 'Adaptive questions' },
          { icon: '📊', label: 'Feedback report' },
          { icon: '🎯', label: '6 domains' },
        ].map(f => (
          <div key={f.label} className="glass px-4 py-2 flex items-center gap-2 text-sm font-body text-white/70">
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button onClick={onStart} className="btn-primary text-lg px-10 py-4 font-display">
        Start Your Interview →
      </button>

      <p className="mt-5 text-white/30 text-sm font-body">
        Free to use · No account needed · Powered by Claude + Vapi
      </p>
    </div>
  );
}
