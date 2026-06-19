import React, { useState, useEffect, useRef, useCallback } from 'react';
import WaveformVisualizer from '../components/WaveformVisualizer';
import { buildAssistantConfig } from '../hooks/useVapi';
import { Mic, MicOff, Phone, PhoneOff, Clock, ChevronDown } from 'lucide-react';

export default function InterviewRoom({ config, onComplete }) {
  const { domain, difficulty, duration, candidateName, vapiKey } = config;

  const [status, setStatus] = useState('connecting'); // connecting | ready | live | ended
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [currentUtterance, setCurrentUtterance] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [qaHistory, setQaHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const vapiRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptRef = useRef(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Timer countdown
  useEffect(() => {
    if (status === 'live') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleEndCall();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  // Initialize Vapi
  useEffect(() => {
    initializeVapi();
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const initializeVapi = async () => {
    try {
      const { default: Vapi } = await import('@vapi-ai/web');
      const vapi = new Vapi(vapiKey);

      vapi.on('call-start', () => {
        setStatus('live');
        setIsListening(true);
        addToTranscript('system', 'Interview started. The AI interviewer will begin shortly...');
      });

      vapi.on('call-end', () => {
        setStatus('ended');
        setIsSpeaking(false);
        setIsListening(false);
        clearInterval(timerRef.current);
      });

      vapi.on('speech-start', () => {
        setIsSpeaking(true);
        setIsListening(false);
      });

      vapi.on('speech-end', () => {
        setIsSpeaking(false);
        setIsListening(true);
      });

      vapi.on('volume-level', (level) => {
        setVolume(level);
      });

      vapi.on('message', (msg) => {
        if (msg.type === 'transcript') {
          if (msg.transcriptType === 'partial') {
            setCurrentUtterance(msg.transcript);
          } else if (msg.transcriptType === 'final') {
            setCurrentUtterance('');
            const role = msg.role === 'assistant' ? 'interviewer' : 'candidate';
            addToTranscript(role, msg.transcript);

            // Build QA history for feedback
            setQaHistory(prev => {
              const newHistory = [...prev];
              if (role === 'interviewer') {
                newHistory.push({ question: msg.transcript, answer: '' });
              } else if (newHistory.length > 0) {
                newHistory[newHistory.length - 1].answer = msg.transcript;
              }
              return newHistory;
            });
          }
        }
      });

      vapi.on('error', (err) => {
        console.error('Vapi error:', err);
        setError('Connection error. Please check your Vapi key and try again.');
        setStatus('ready');
      });

      vapiRef.current = vapi;
      setStatus('ready');

    } catch (err) {
      setError('Failed to load Vapi SDK. Check your API key.');
      setStatus('ready');
      console.error(err);
    }
  };

  const addToTranscript = useCallback((role, text) => {
    setTranscript(prev => [...prev, { role, text, ts: Date.now() }]);
  }, []);

  const handleStartCall = async () => {
    if (!vapiRef.current) return;
    setStatus('connecting');
    setError(null);
    try {
      const assistantConfig = buildAssistantConfig(domain, difficulty, candidateName);
      await vapiRef.current.start(assistantConfig);
    } catch (err) {
      console.error('Call start error:', err);
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid')) {
        setError('Invalid Vapi key. Go to dashboard.vapi.ai → Account → copy your Public Key (not Private Key).');
      } else if (msg.includes('microphone') || msg.includes('permission') || msg.includes('notallowed')) {
        setError('Microphone access denied. Click the lock icon in your browser address bar and allow microphone.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('Network error. Check your internet connection and try again.');
      } else {
        setError('Could not start interview. Check your Vapi Public Key and try again.');
      }
      setStatus('ready');
    }
  };

  const handleEndCall = async () => {
    clearInterval(timerRef.current);
    if (vapiRef.current) {
      try { await vapiRef.current.stop(); } catch {}
    }
    setStatus('ended');
  };

  const handleToggleMute = () => {
    if (vapiRef.current) {
      const newMuted = !isMuted;
      vapiRef.current.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  };

  const handleGenerateReport = () => {
    onComplete(qaHistory, timeLeft);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const getRoleColor = (role) => {
    if (role === 'interviewer') return '#3B82F6';
    if (role === 'candidate') return '#10B981';
    return '#6B7280';
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ maxHeight: '100vh', overflow: 'hidden' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-navy-900 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: status === 'live' ? '#10B981' : '#F59E0B', boxShadow: status === 'live' ? '0 0 8px #10B981' : 'none' }}
          />
          <span className="font-display font-semibold text-sm">
            {domain.icon} {domain.label} Interview
          </span>
          <span className="text-white/30 text-sm font-body capitalize">· {difficulty} level</span>
        </div>

        <div className="flex items-center gap-3">
          {status === 'live' && (
            <div className="flex items-center gap-2 glass px-3 py-1.5">
              <Clock size={14} className="text-amber-400" />
              <span className="font-display font-semibold text-sm tabular-nums" style={{ color: timeLeft < 120 ? '#F59E0B' : '#F0F4FF' }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Interview visual */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 border-r border-white/10">

          {/* AI Avatar */}
          <div className="relative mb-8">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-4xl border-2"
              style={{
                background: 'linear-gradient(135deg, #1E293B, #111827)',
                borderColor: isSpeaking ? '#3B82F6' : isListening ? '#10B981' : '#2D3748',
                boxShadow: isSpeaking ? '0 0 30px rgba(59,130,246,0.4)' : isListening ? '0 0 20px rgba(16,185,129,0.3)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              🤖
            </div>
            {status === 'live' && (
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full font-body"
                style={{
                  background: isSpeaking ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)',
                  color: isSpeaking ? '#60A5FA' : '#34D399',
                  border: `1px solid ${isSpeaking ? 'rgba(59,130,246,0.4)' : 'rgba(16,185,129,0.4)'}`,
                }}
              >
                {isSpeaking ? 'Speaking' : 'Listening'}
              </div>
            )}
          </div>

          {/* Waveform */}
          <div className="mb-8">
            <WaveformVisualizer
              isActive={status === 'live'}
              isSpeaking={isSpeaking}
              isListening={isListening}
              volume={volume}
              size="lg"
            />
          </div>

          {/* Status message */}
          <div className="text-center mb-8">
            {status === 'ready' && (
              <>
                <p className="font-display text-xl font-semibold mb-2">Ready to begin</p>
                <p className="text-white/40 font-body text-sm">Your AI interviewer is waiting</p>
              </>
            )}
            {status === 'connecting' && (
              <>
                <p className="font-display text-xl font-semibold mb-2 text-electric-400">Connecting...</p>
                <p className="text-white/40 font-body text-sm">Setting up your voice session</p>
              </>
            )}
            {status === 'live' && (
              <>
                <p className="font-display text-xl font-semibold mb-2">
                  {isSpeaking ? 'Alex is speaking...' : 'Your turn to answer'}
                </p>
                <p className="text-white/40 font-body text-sm">
                  {isListening ? 'Speak clearly into your microphone' : 'Listen carefully to the question'}
                </p>
              </>
            )}
            {status === 'ended' && (
              <>
                <p className="font-display text-xl font-semibold mb-2 text-emerald-400">Interview complete!</p>
                <p className="text-white/40 font-body text-sm">Generate your feedback report below</p>
              </>
            )}
          </div>

          {error && (
            <div className="mb-6 glass p-4 border-red-500/30 bg-red-500/10 text-red-400 text-sm font-body text-center rounded-xl">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            {status === 'ready' && (
              <button onClick={handleStartCall} className="btn-primary flex items-center gap-2 px-8 py-4 text-lg">
                <Phone size={20} /> Start Interview
              </button>
            )}

            {status === 'live' && (
              <>
                <button
                  onClick={handleToggleMute}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${
                    isMuted
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all font-display font-semibold"
                >
                  <PhoneOff size={18} /> End Interview
                </button>
              </>
            )}

            {status === 'ended' && (
              <button onClick={handleGenerateReport} className="btn-primary flex items-center gap-2 px-8 py-4 text-lg">
                📊 Generate Feedback Report
              </button>
            )}
          </div>
        </div>

        {/* Live transcript panel */}
        <div className="w-80 flex flex-col bg-navy-900/50 flex-shrink-0">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-display font-semibold text-sm text-white/60 uppercase tracking-wider">Live Transcript</h3>
          </div>

          <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {transcript.length === 0 && (
              <p className="text-white/20 text-sm font-body text-center mt-8">
                Transcript will appear here once the interview starts
              </p>
            )}

            {transcript.map((entry, i) => (
              <div key={i} className={`${entry.role === 'system' ? 'text-center' : ''}`}>
                {entry.role !== 'system' && (
                  <div className="text-xs font-body font-semibold uppercase tracking-wider mb-1" style={{ color: getRoleColor(entry.role) }}>
                    {entry.role === 'interviewer' ? '🤖 Alex (Interviewer)' : '🎤 You'}
                  </div>
                )}
                <p className={`text-sm font-body leading-relaxed ${
                  entry.role === 'system' ? 'text-white/30 italic text-xs' : 'text-white/80'
                }`}>
                  {entry.text}
                </p>
              </div>
            ))}

            {currentUtterance && (
              <div>
                <div className="text-xs font-body font-semibold uppercase tracking-wider mb-1 text-white/30">
                  Live...
                </div>
                <p className="text-sm font-body text-white/40 italic">{currentUtterance}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
