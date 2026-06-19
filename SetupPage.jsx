import React, { useState } from 'react';
import { DOMAINS, DIFFICULTY_LEVELS, INTERVIEW_DURATIONS } from '../utils/domains';
import { ChevronRight, Eye, EyeOff, Info } from 'lucide-react';

export default function SetupPage({ onStart, onBack }) {
  const [step, setStep] = useState(1); // 1: domain, 2: settings, 3: api keys
  const [selected, setSelected] = useState({
    domain: null,
    difficulty: 'mid',
    duration: 20,
    candidateName: '',
    vapiKey: '',
    anthropicKey: '',
  });
  const [showVapi, setShowVapi] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);

  const update = (key, value) => setSelected(s => ({ ...s, [key]: value }));

  const handleStart = () => {
    onStart(selected);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">

        {/* Back */}
        <button onClick={onBack} className="text-white/40 hover:text-white text-sm font-body mb-8 flex items-center gap-2 transition-colors">
          ← Back
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-semibold transition-all ${
                  s === step ? 'bg-electric-500 text-white shadow-lg' :
                  s < step ? 'bg-electric-500/30 text-electric-400' :
                  'bg-navy-700 text-white/30'
                }`}
                style={s === step ? { boxShadow: '0 0 16px rgba(59,130,246,0.5)' } : {}}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && <div className={`flex-1 h-px ${s < step ? 'bg-electric-500/40' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Domain */}
        {step === 1 && (
          <>
            <h2 className="font-display text-3xl font-bold mb-2">Choose your domain</h2>
            <p className="text-white/40 font-body mb-8">What role are you interviewing for?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {DOMAINS.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => update('domain', domain)}
                  className={`card-hover text-left transition-all ${
                    selected.domain?.id === domain.id
                      ? 'border-electric-500/70 bg-electric-500/10'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${domain.color}20`, border: `1px solid ${domain.color}40` }}
                    >
                      {domain.icon}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-white mb-1">{domain.label}</div>
                      <div className="text-white/40 text-sm font-body leading-snug">{domain.description}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {domain.topics.slice(0, 3).map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: `${domain.color}15`, color: domain.color }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selected.domain}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continue <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Step 2: Settings */}
        {step === 2 && (
          <>
            <h2 className="font-display text-3xl font-bold mb-2">Interview settings</h2>
            <p className="text-white/40 font-body mb-8">Customize your session</p>

            {/* Name */}
            <div className="mb-6">
              <label className="block font-display font-semibold mb-2 text-white/80 text-sm uppercase tracking-wider">
                Your Name (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sathwik"
                value={selected.candidateName}
                onChange={e => update('candidateName', e.target.value)}
                className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 font-body text-white placeholder-white/30 focus:outline-none focus:border-electric-500/60 transition-colors"
              />
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block font-display font-semibold mb-3 text-white/80 text-sm uppercase tracking-wider">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTY_LEVELS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => update('difficulty', d.value)}
                    className={`card text-center transition-all hover:border-electric-500/40 ${
                      selected.difficulty === d.value ? 'border-electric-500/70 bg-electric-500/10' : ''
                    }`}
                  >
                    <div className="font-display font-semibold text-sm mb-1">{d.label}</div>
                    <div className="text-white/40 text-xs font-body">{d.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <label className="block font-display font-semibold mb-3 text-white/80 text-sm uppercase tracking-wider">
                Interview Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {INTERVIEW_DURATIONS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => update('duration', d.value)}
                    className={`card text-center transition-all hover:border-electric-500/40 ${
                      selected.duration === d.value ? 'border-electric-500/70 bg-electric-500/10' : ''
                    }`}
                  >
                    <div className="font-display font-bold text-xl mb-1">{d.label}</div>
                    <div className="text-white/40 text-xs font-body">~{d.questions} questions</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost flex-1">← Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}

        {/* Step 3: API Keys */}
        {step === 3 && (
          <>
            <h2 className="font-display text-3xl font-bold mb-2">API Keys</h2>
            <p className="text-white/40 font-body mb-2">Your keys stay in the browser — never sent to our servers.</p>

            <div className="glass p-4 mb-8 flex gap-3">
              <Info size={18} className="text-electric-400 flex-shrink-0 mt-0.5" />
              <p className="text-white/60 text-sm font-body leading-relaxed">
                <strong className="text-white">Vapi</strong> powers the voice interview. <strong className="text-white">Claude</strong> generates adaptive follow-ups and your feedback report.
                Get Vapi key at <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="text-electric-400 underline">vapi.ai</a> and
                Claude key at <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-electric-400 underline">console.anthropic.com</a>.
              </p>
            </div>

            {/* Vapi Key */}
            <div className="mb-5">
              <label className="block font-display font-semibold mb-2 text-white/80 text-sm uppercase tracking-wider">
                Vapi Public Key
              </label>
              <div className="relative">
                <input
                  type={showVapi ? 'text' : 'password'}
                  placeholder="vapi_pub_..."
                  value={selected.vapiKey}
                  onChange={e => update('vapiKey', e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 pr-12 font-body text-white placeholder-white/30 focus:outline-none focus:border-electric-500/60 transition-colors"
                />
                <button onClick={() => setShowVapi(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showVapi ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Anthropic Key */}
            <div className="mb-8">
              <label className="block font-display font-semibold mb-2 text-white/80 text-sm uppercase tracking-wider">
                Anthropic API Key
              </label>
              <div className="relative">
                <input
                  type={showAnthropic ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  value={selected.anthropicKey}
                  onChange={e => update('anthropicKey', e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 pr-12 font-body text-white placeholder-white/30 focus:outline-none focus:border-electric-500/60 transition-colors"
                />
                <button onClick={() => setShowAnthropic(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showAnthropic ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="card mb-6">
              <div className="text-white/40 text-xs font-body uppercase tracking-wider mb-3">Interview Summary</div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <div className="text-white/30 text-xs mb-1">Domain</div>
                  <div className="font-display font-semibold">{selected.domain?.label}</div>
                </div>
                <div>
                  <div className="text-white/30 text-xs mb-1">Level</div>
                  <div className="font-display font-semibold capitalize">{selected.difficulty}</div>
                </div>
                <div>
                  <div className="text-white/30 text-xs mb-1">Duration</div>
                  <div className="font-display font-semibold">{selected.duration} min</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-ghost flex-1">← Back</button>
              <button
                onClick={handleStart}
                disabled={!selected.vapiKey || !selected.anthropicKey}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                🎙️ Start Interview
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
