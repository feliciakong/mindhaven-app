import React, { useState, useRef, useEffect } from 'react';
import { JournalEntry, ChatMessage, ReflectionCategory } from '../types';
import {
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  Edit2,
  Trash2,
  Compass,
  Mic,
  MicOff,
} from 'lucide-react';

interface ChatWorkspaceProps {
  entry: JournalEntry | null;
  onSendMessage: (text: string) => Promise<void>;
  onUpdateMeta: (updates: { title?: string; mood?: string }) => Promise<void>;
  onGenerateSummary: () => void;
  isGenerating: boolean;
  onNewSession: () => void;
  onDeleteEntry?: (entryId: string) => Promise<void>;
}

const CATEGORIES: ReflectionCategory[] = [
  'General',
  'Gratitude',
  'Stress & Anxiety',
  'Career & Purpose',
  'Relationships',
  'Self-Discovery',
  'Mindfulness',
];

const PRESET_PROMPTS: Record<ReflectionCategory, string[]> = {
  General: [
    'What has been occupying your mind the most today?',
    'What is one thing you learned about yourself recently?',
    'How are you feeling right now, in this exact moment?',
  ],
  Gratitude: [
    'What is a simple pleasure that brought you unexpected joy today?',
    'Who is someone you feel deeply thankful for, and why?',
    'What is a past challenge that turned into a meaningful blessing?',
  ],
  'Stress & Anxiety': [
    'What is currently feeling heavy, and what part of it can you let go of?',
    'If you took a deep breath, what fear would you release right now?',
    'What is one small boundary that could restore your peace today?',
  ],
  'Career & Purpose': [
    'What project or task made you feel most energized this week?',
    'Where do you feel aligned or misaligned with your long-term goals?',
    'What would you pursue if failure was completely off the table?',
  ],
  Relationships: [
    'How can you show up more authentically for someone you care about?',
    'Is there a conversation you have been avoiding that needs gentle attention?',
    'What quality do you appreciate most in your closest friend?',
  ],
  'Self-Discovery': [
    'What values are guiding your choices right now?',
    'What advice would your future 80-year-old self give to you today?',
    'When do you feel most authentically like yourself?',
  ],
  Mindfulness: [
    'Focus on your breath: what physical sensations are present right now?',
    'Look around you: what are three subtle details you normally overlook?',
    'How can you bring a sense of gentle presence into the rest of your day?',
  ],
};

const MOODS = ['Reflective', 'Calm', 'Grateful', 'Anxious', 'Inspired', 'Overwhelmed'];

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  entry,
  onSendMessage,
  onUpdateMeta,
  onGenerateSummary,
  isGenerating,
  onNewSession,
  onDeleteEntry,
}) => {
  const [inputText, setInputText] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReflectionCategory>('General');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (entry) {
      setTitleText(entry.title || '');
    }
  }, [entry]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entry?.messages, isGenerating]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInputText((prev) => (prev ? `${prev} ${finalTranscript.trim()}` : finalTranscript.trim()));
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = async () => {
    if (!inputText.trim() || isGenerating) return;
    const textToSend = inputText.trim();
    setInputText('');
    await onSendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveTitle = async () => {
    if (entry && titleText.trim() && titleText !== entry.title) {
      await onUpdateMeta({ title: titleText.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteSession = async () => {
    if (entry && onDeleteEntry && window.confirm('Are you sure you want to delete this reflection entry?')) {
      await onDeleteEntry(entry.id);
    }
  };

  if (!entry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-50/50 dark:bg-stone-950/20">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          Welcome to Your MindHaven
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm max-w-md mb-8 leading-relaxed">
          Begin a new reflection session to explore your thoughts, navigate challenges, or discover insights with Gemini AI.
        </p>
        <button
          onClick={onNewSession}
          className="px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium text-sm transition shadow-md cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start First Reflection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-stone-50/30 dark:bg-stone-950/20 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 bg-white/70 dark:bg-stone-900/80 border-b border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 backdrop-blur-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                className="w-full px-3 py-1 rounded-lg border border-emerald-500 bg-white dark:bg-stone-800 text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                {entry.title || 'Reflection Session'}
              </h2>
              <Edit2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-400 dark:text-stone-500 font-medium hidden sm:inline">Mood:</span>
            <select
              value={entry.mood || 'Reflective'}
              onChange={(e) => onUpdateMeta({ mood: e.target.value })}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button
            id="workspace-ai-insights-btn"
            onClick={onGenerateSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40 text-xs font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>AI Session Insights</span>
          </button>

          {onDeleteEntry && (
            <button
              onClick={handleDeleteSession}
              title="Delete Entry"
              className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {entry.messages.length === 0 ? (
          <div className="max-w-xl mx-auto py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-200">
              How can I support your reflection today?
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs max-w-md mx-auto leading-relaxed">
              Share what is on your heart, speak your thoughts, or select a prompt below.
            </p>
          </div>
        ) : (
          entry.messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs ${
                    isUser
                      ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                      : 'bg-emerald-600 text-white dark:bg-emerald-500'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="group relative flex flex-col max-w-[85%]">
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-700 text-white dark:bg-emerald-600 rounded-tr-none shadow-2xs'
                        : 'bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700/80 rounded-tl-none shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words font-sans">{msg.text}</div>
                  </div>

                  <div
                    className={`flex items-center gap-2 mt-1 text-[10px] text-stone-400 dark:text-stone-500 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isGenerating && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-tl-none flex items-center gap-2 text-xs text-stone-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Gemini is generating reflection guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-2 bg-white/50 dark:bg-stone-900/50 border-t border-stone-200/60 dark:border-stone-800/60">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex-shrink-0">
            Prompts:
          </span>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5">
          {PRESET_PROMPTS[selectedCategory].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(promptText)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition whitespace-nowrap text-left cursor-pointer flex-shrink-0"
            >
              "{promptText}"
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200/80 dark:border-stone-800">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-stone-50 dark:bg-stone-800 p-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 focus-within:ring-2 focus-within:ring-emerald-500/50 transition">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write or speak your reflection... (Press Enter to send, Shift+Enter for new line)"
            className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 resize-none font-sans"
          />

          <div className="flex items-center gap-2 pb-1">
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Start voice input'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer flex-shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              id="workspace-send-msg-btn"
              onClick={handleSend}
              disabled={!inputText.trim() || isGenerating}
              className="w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white flex items-center justify-center transition disabled:opacity-40 cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};