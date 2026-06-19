const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function generateFollowUpQuestion(domain, previousQA, currentAnswer) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: `You are a senior ${domain.label} interviewer conducting a professional mock interview. 
      Your role is to ask ONE sharp, adaptive follow-up question based on the candidate's last answer.
      The question should probe deeper into their response, test their understanding, or explore a related concept.
      Keep the question concise (1-2 sentences max). Be professional and direct.
      Respond with ONLY the follow-up question, no preamble.`,
      messages: [
        {
          role: 'user',
          content: `Interview context: ${domain.label} interview
Previous Q&A:
${previousQA.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}

Candidate's latest answer: "${currentAnswer}"

Generate one sharp follow-up question.`
        }
      ]
    })
  });

  const data = await response.json();
  return data.content?.[0]?.text || "That's interesting. Can you elaborate further on that point?";
}

export async function generateFeedbackReport(domain, difficulty, qaHistory, duration) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: `You are a senior ${domain.label} interviewer generating a structured performance report. 
      Analyze the candidate's answers critically and provide actionable feedback.
      You must respond with ONLY valid JSON, no markdown, no preamble.`,
      messages: [
        {
          role: 'user',
          content: `Analyze this ${difficulty} level ${domain.label} interview (${duration} minutes) and generate a JSON report.

Interview transcript:
${qaHistory.map((qa, i) => `Q${i+1}: ${qa.question}\nA${i+1}: ${qa.answer || '[No answer provided]'}`).join('\n\n')}

Respond with this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "verdict": "<Hire / Strong Hire / No Hire / Maybe>",
  "summary": "<2-3 sentence overall assessment>",
  "categories": [
    {
      "name": "Technical Knowledge",
      "score": <0-100>,
      "feedback": "<specific feedback>",
      "examples": ["<quote from answer>"]
    },
    {
      "name": "Communication Clarity",
      "score": <0-100>,
      "feedback": "<specific feedback>",
      "examples": ["<quote from answer>"]
    },
    {
      "name": "Problem-Solving Approach",
      "score": <0-100>,
      "feedback": "<specific feedback>",
      "examples": ["<quote from answer>"]
    },
    {
      "name": "Depth of Experience",
      "score": <0-100>,
      "feedback": "<specific feedback>",
      "examples": ["<quote from answer>"]
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "nextSteps": ["<action 1>", "<action 2>", "<action 3>"]
}`
        }
      ]
    })
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || '{}';
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return generateFallbackReport(qaHistory);
  }
}

function generateFallbackReport(qaHistory) {
  const answered = qaHistory.filter(qa => qa.answer && qa.answer.length > 20).length;
  const score = Math.round((answered / Math.max(qaHistory.length, 1)) * 75 + 10);
  return {
    overallScore: score,
    verdict: score >= 70 ? 'Maybe' : 'No Hire',
    summary: "The interview has been completed. Please review the transcript for detailed insights.",
    categories: [
      { name: "Technical Knowledge", score: score, feedback: "Review your answers for technical accuracy.", examples: [] },
      { name: "Communication Clarity", score: score - 5, feedback: "Work on structuring answers more clearly.", examples: [] },
      { name: "Problem-Solving Approach", score: score + 5, feedback: "Good effort in approaching problems.", examples: [] },
      { name: "Depth of Experience", score: score - 10, feedback: "Provide more specific examples from experience.", examples: [] },
    ],
    strengths: ["Completed the interview", "Engaged with questions", "Showed willingness to learn"],
    improvements: ["Add more specific examples", "Structure answers with frameworks", "Go deeper on technical concepts"],
    nextSteps: ["Practice with STAR method", "Review domain fundamentals", "Do more mock interviews"]
  };
}
