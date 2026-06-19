export const DOMAINS = [
  {
    id: 'finance',
    label: 'Finance & Banking',
    icon: '📈',
    description: 'Investment banking, financial analysis, risk management',
    color: '#10B981',
    topics: ['DCF Valuation', 'Financial Modeling', 'Risk Analysis', 'M&A', 'Capital Markets'],
    sampleQuestions: [
      "Walk me through a DCF valuation. What are the key assumptions you'd make?",
      "How would you value a company with negative EBITDA?",
      "Explain the difference between enterprise value and equity value.",
      "What factors would you consider when analyzing credit risk for a corporate borrower?",
      "How does a leveraged buyout work, and what makes a good LBO candidate?",
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing & Brand',
    icon: '🎯',
    description: 'Brand strategy, digital marketing, growth and analytics',
    color: '#F59E0B',
    topics: ['Brand Strategy', 'Digital Marketing', 'Growth Hacking', 'Customer Analytics', 'Campaign Planning'],
    sampleQuestions: [
      "How would you develop a go-to-market strategy for a new product launch?",
      "Describe a time you used data to optimize a marketing campaign. What metrics mattered most?",
      "How do you measure the ROI of a brand awareness campaign?",
      "Walk me through how you'd build a customer segmentation model.",
      "What's your approach to A/B testing? How do you decide what to test?",
    ]
  },
  {
    id: 'software',
    label: 'Software Engineering',
    icon: '💻',
    description: 'System design, algorithms, software architecture',
    color: '#3B82F6',
    topics: ['System Design', 'Algorithms', 'Data Structures', 'Architecture', 'Code Quality'],
    sampleQuestions: [
      "Design a URL shortening service like bit.ly. Walk me through your approach.",
      "Explain the difference between SQL and NoSQL databases. When would you choose each?",
      "How would you design a distributed rate limiter?",
      "What is the CAP theorem and how does it affect distributed system design?",
      "Walk me through how you'd optimize a slow database query.",
    ]
  },
  {
    id: 'data_science',
    label: 'Data Science & AI',
    icon: '🤖',
    description: 'ML models, data analysis, AI product strategy',
    color: '#A78BFA',
    topics: ['Machine Learning', 'Statistical Analysis', 'Model Evaluation', 'Feature Engineering', 'Deep Learning'],
    sampleQuestions: [
      "Explain the bias-variance tradeoff. How do you manage it in practice?",
      "How would you handle a highly imbalanced dataset?",
      "Walk me through how you'd build and deploy a recommendation system.",
      "What's the difference between L1 and L2 regularization?",
      "How would you explain a machine learning model's decision to a non-technical stakeholder?",
    ]
  },
  {
    id: 'consulting',
    label: 'Management Consulting',
    icon: '🏢',
    description: 'Case interviews, business strategy, problem solving',
    color: '#F97316',
    topics: ['Case Analysis', 'Market Sizing', 'Strategy Frameworks', 'Operations', 'Business Problem Solving'],
    sampleQuestions: [
      "Our client, a retail chain, has seen a 20% drop in revenue. How would you diagnose this?",
      "Estimate the market size for electric vehicles in India over the next 5 years.",
      "How would you structure a profitability analysis for a struggling airline?",
      "A client wants to enter a new geographic market. How would you advise them?",
      "Walk me through how you'd prioritize cost-cutting initiatives for a manufacturing company.",
    ]
  },
  {
    id: 'product',
    label: 'Product Management',
    icon: '🚀',
    description: 'Product strategy, roadmaps, user research, metrics',
    color: '#EC4899',
    topics: ['Product Strategy', 'User Research', 'Roadmapping', 'Metrics & KPIs', 'Prioritization'],
    sampleQuestions: [
      "How would you improve Google Maps? Walk me through your thought process.",
      "Tell me about a product you love and what you'd change about it.",
      "How do you prioritize features when everything seems equally important?",
      "Design a product for elderly users to manage their medications.",
      "How would you measure the success of a new feature launch?",
    ]
  },
];

export const INTERVIEW_DURATIONS = [
  { label: '10 min', value: 10, questions: 3 },
  { label: '20 min', value: 20, questions: 5 },
  { label: '30 min', value: 30, questions: 7 },
];

export const DIFFICULTY_LEVELS = [
  { label: 'Entry Level', value: 'entry', description: 'Fresh graduates & juniors' },
  { label: 'Mid Level', value: 'mid', description: '2–5 years experience' },
  { label: 'Senior Level', value: 'senior', description: '5+ years experience' },
];
