# 🎙️ InterviewAI — AI-Powered Mock Interview Platform

An AI voice interview platform powered by **Vapi** (voice AI) + **Claude** (adaptive questions & feedback reports).

## Features
- 🎙️ **Voice interviews** via Vapi AI voice agents
- 🧠 **Adaptive follow-ups** — Claude generates follow-up questions based on your answers
- 📊 **Structured feedback reports** — scored across 4 categories with strengths & next steps
- 🎯 **6 domains** — Finance, Marketing, Software Engineering, Data Science, Consulting, Product Management
- 🔐 **Privacy-first** — API keys stay in the browser, never sent to any server

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run the dev server
```bash
npm run dev
```

### 3. Get your API keys

**Vapi (voice AI):**
1. Go to [vapi.ai](https://vapi.ai) and create an account
2. Navigate to Dashboard → API Keys
3. Copy your **Public Key** (starts with `vapi_pub_`)

**Anthropic (Claude AI):**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Navigate to API Keys → Create Key
3. Copy the key (starts with `sk-ant-`)

### 4. Enter keys in the app
When you start an interview, paste both keys in Step 3 of the setup. They stay in your browser only.

---

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx      # Hero landing page
│   ├── SetupPage.jsx        # 3-step setup wizard
│   ├── InterviewRoom.jsx    # Live interview with Vapi
│   └── FeedbackReport.jsx   # AI-generated report
├── components/
│   └── WaveformVisualizer.jsx  # Canvas-based voice visualizer
├── hooks/
│   └── useVapi.js           # Vapi SDK integration
├── utils/
│   ├── claudeApi.js         # Claude API for feedback
│   └── domains.js           # Domain data & questions
└── App.jsx                  # Page router
```

---

## Build for Production

```bash
npm run build
```

Outputs to `dist/`. Deploy to Vercel, Netlify, or any static host.

---

## Tech Stack
- **React + Vite** — frontend
- **Tailwind CSS** — styling
- **Vapi Web SDK** — voice AI interviews
- **Claude API** — adaptive questions + feedback generation
- **Canvas API** — real-time waveform visualizer
