export type MessageSender = 'user' | 'gemini' | 'system';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string; // ISO string
}

export interface SessionInsights {
  summary: string;
  moodAnalysis: string;
  keyInsights: string[];
  actionSteps: string[];
  suggestedPromptForNextTime?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
  mood?: string;
  tags?: string[];
  messages: ChatMessage[];
  summary?: SessionInsights | null;
  isFavorite?: boolean;
}

export type ReflectionCategory = 
  | 'General'
  | 'Gratitude'
  | 'Stress & Anxiety'
  | 'Career & Purpose'
  | 'Relationships'
  | 'Self-Discovery'
  | 'Mindfulness';

export interface PromptOption {
  category: ReflectionCategory;
  prompt: string;
  icon?: string;
}
