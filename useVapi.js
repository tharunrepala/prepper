import { useState, useRef, useCallback } from 'react';

// Vapi Web SDK integration
// Install: npm install @vapi-ai/web
// Docs: https://docs.vapi.ai/sdk/web

export function useVapiInterview({ onTranscript, onCallEnd, onError }) {
  const vapiRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);

  const initVapi = useCallback(async (apiKey) => {
    try {
      // Dynamic import of Vapi SDK
      const { default: Vapi } = await import('@vapi-ai/web');
      const vapi = new Vapi(apiKey);

      vapi.on('call-start', () => {
        setIsConnected(true);
        setIsListening(true);
      });

      vapi.on('call-end', () => {
        setIsConnected(false);
        setIsSpeaking(false);
        setIsListening(false);
        if (onCallEnd) onCallEnd();
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

      vapi.on('message', (message) => {
        if (message.type === 'transcript' && message.role === 'user' && message.transcriptType === 'final') {
          if (onTranscript) onTranscript(message.transcript);
        }
      });

      vapi.on('error', (error) => {
        console.error('Vapi error:', error);
        if (onError) onError(error);
      });

      vapiRef.current = vapi;
      return vapi;
    } catch (err) {
      console.error('Failed to initialize Vapi:', err);
      throw err;
    }
  }, [onTranscript, onCallEnd, onError]);

  const startCall = useCallback(async (assistantConfig) => {
    if (!vapiRef.current) throw new Error('Vapi not initialized');
    await vapiRef.current.start(assistantConfig);
  }, []);

  const endCall = useCallback(async () => {
    if (vapiRef.current) {
      await vapiRef.current.stop();
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (vapiRef.current && isConnected) {
      vapiRef.current.send({ type: 'add-message', message: { role: 'user', content: message } });
    }
  }, [isConnected]);

  return {
    initVapi,
    startCall,
    endCall,
    sendMessage,
    isConnected,
    isSpeaking,
    isListening,
    volume,
  };
}

// Build Vapi assistant config from domain + difficulty
export function buildAssistantConfig(domain, difficulty, candidateName) {
  const difficultyContext = {
    entry: 'fresh graduate or junior professional with 0-2 years experience',
    mid: 'mid-level professional with 2-5 years experience',
    senior: 'senior professional with 5+ years experience',
  };

  const systemPrompt = `You are Alex, a professional ${domain.label} interviewer at a top-tier firm conducting a mock interview.

Candidate: ${candidateName || 'the candidate'}
Level: ${difficultyContext[difficulty] || difficultyContext.mid}
Domain: ${domain.label}
Topics: ${domain.topics.join(', ')}

Interview guidelines:
1. Start by warmly introducing yourself and explaining the format
2. Ask ONE question at a time from the domain topics
3. Listen to the answer, then ask ONE targeted follow-up question
4. After the follow-up, move to the next main question
5. Keep a professional but encouraging tone
6. Total interview: ${domain.topics.length} main questions with follow-ups
7. End by thanking the candidate and saying the report will be generated

Start the interview now with a brief introduction.`;

  return {
    name: 'InterviewAI',
    firstMessage: `Hello${candidateName ? ` ${candidateName}` : ''}! I'm Alex, your AI interviewer today. We'll be doing a ${domain.label} interview. I'll ask you a series of questions and follow up based on your answers. Let's get started — ${domain.sampleQuestions[0]}`,
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en-US',
    },
    voice: {
      provider: 'playht',
      voiceId: 'jennifer',
    },
    model: {
      provider: 'anthropic',
      model: 'claude-haiku-4-5-20251001',
      systemPrompt,
      temperature: 0.7,
      maxTokens: 300,
    },
    recordingEnabled: false,
    endCallFunctionEnabled: true,
    endCallMessage: "That concludes our interview. Your feedback report will be generated shortly. Thank you for your time!",
    endCallPhrases: ["that concludes our interview", "thank you for your time today", "the interview is now complete"],
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 1800,
    backgroundSound: 'off',
  };
}
