import { ChatMessage, SessionInsights } from '../types';

export async function sendChatToGemini(params: {
  messages: ChatMessage[];
  userPrompt: string;
  mood?: string;
  userDisplayName?: string;
}): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.details || 'Failed to get reflection response');
  }

  const data = await response.json();
  return data.reply;
}

export async function generateSessionSummary(params: {
  messages: ChatMessage[];
  mood?: string;
}): Promise<SessionInsights> {
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.details || 'Failed to summarize session');
  }

  const data = await response.json();
  return data.summary;
}

export async function fetchCategoryPrompts(category: string): Promise<string[]> {
  const response = await fetch('/api/prompts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ category }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch prompts');
  }

  const data = await response.json();
  return data.prompts || [];
}
