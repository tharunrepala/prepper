import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import InterviewRoom from './pages/InterviewRoom';
import FeedbackReport from './pages/FeedbackReport';

const PAGES = {
  LANDING: 'landing',
  SETUP: 'setup',
  INTERVIEW: 'interview',
  REPORT: 'report',
};

export default function App() {
  const [page, setPage] = useState(PAGES.LANDING);
  const [config, setConfig] = useState(null);
  const [qaHistory, setQaHistory] = useState([]);

  const handleStart = (settings) => {
    setConfig(settings);
    setPage(PAGES.INTERVIEW);
  };

  const handleInterviewComplete = (history) => {
    setQaHistory(history);
    setPage(PAGES.REPORT);
  };

  const handleRestart = () => {
    setConfig(null);
    setQaHistory([]);
    setPage(PAGES.LANDING);
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {page === PAGES.LANDING && (
        <LandingPage onStart={() => setPage(PAGES.SETUP)} />
      )}

      {page === PAGES.SETUP && (
        <SetupPage
          onStart={handleStart}
          onBack={() => setPage(PAGES.LANDING)}
        />
      )}

      {page === PAGES.INTERVIEW && config && (
        <InterviewRoom
          config={config}
          onComplete={handleInterviewComplete}
        />
      )}

      {page === PAGES.REPORT && config && (
        <FeedbackReport
          config={config}
          qaHistory={qaHistory}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
