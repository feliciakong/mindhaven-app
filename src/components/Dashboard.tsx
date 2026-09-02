import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Plus, Shield, Search, LogOut, BookOpen, 
  Lock, Mic, MicOff, X, Loader2, Lightbulb, Calendar,
  Pencil, Trash2
} from 'lucide-react';
import { analyzeReflection } from '../services/aiService';
import { 
  createJournalEntry, 
  subscribeToUserEntries,
  updateJournalEntry, 
  deleteJournalEntry, 
  JournalEntry 
} from '../lib/journal';

interface DashboardProps {
  user: {
    uid: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  };
  onSignOut: () => void;
}

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognitionRef, setRecognitionRef] = useState<any>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const finalTranscriptRef = useRef<string>('');

  const filters = ['All', 'Reflective', 'Calm', 'Grateful', 'Anxious', 'Inspired', 'Overwhelmed'];

  const microPrompts = [
    "🌱 What made me feel grounded today?",
    "⚡ What drained my energy?",
    "🎯 What is one small win I had?",
    "💭 What am I overthinking right now?",
    "🙏 What am I genuinely grateful for?"
  ];

  useEffect(() => {
    if (!user.uid) return;
    const unsubscribe = subscribeToUserEntries(user.uid, (data) => {
      setEntries(data);
    });
    return () => unsubscribe();
  }, [user.uid]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Just now';
    }
  };

  const toggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening && recognitionRef) {
      recognitionRef.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    finalTranscriptRef.current = content ? content.trim() + ' ' : '';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: any) => {
      console.error("Speech recognition error:", e);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let currentFinal = finalTranscriptRef.current;
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinal += transcript + ' ';
          finalTranscriptRef.current = currentFinal;
        } else {
          interim += transcript;
        }
      }

      setContent(currentFinal + interim);
    };

    setRecognitionRef(recognition);
    recognition.start();
  };

  const handlePromptClick = (promptText: string) => {
    setContent((prev) => (prev ? `${prev}\n\n${promptText} ` : `${promptText} `));
  };

  const handleOpenNewModal = () => {
    setEditingEntryId(null);
    setTitle('');
    setContent('');
    setIsModalOpen(true);
  };

  const handleEditClick = (entry: JournalEntry) => {
    if (!entry.id) return;
    setEditingEntryId(entry.id);
    setTitle(entry.title || '');
    setContent(entry.content || '');
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (entryId: string) => {
    if (window.confirm("Are you sure you want to delete this reflection?")) {
      try {
        await deleteJournalEntry(user.uid, entryId);
      } catch (err) {
        console.error("Failed to delete entry:", err);
      }
    }
  };

const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (isListening && recognitionRef) {
      recognitionRef.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    try {
      // Always generate a fresh AI insight and mood on save/edit
      const aiResult = await analyzeReflection(content.trim());

      if (editingEntryId) {
        await updateJournalEntry(user.uid, editingEntryId, {
          title: title.trim() || aiResult.suggestedTitle || 'Untitled Reflection',
          content: content.trim(),
          aiInsight: aiResult.insight,
          mood: aiResult.detectedMood
        });
      } else {
        await createJournalEntry(user.uid, {
          title: title.trim() || aiResult.suggestedTitle || 'Untitled Reflection',
          content: content.trim(),
          aiInsight: aiResult.insight,
          mood: aiResult.detectedMood
        });
      }

      setTitle('');
      setContent('');
      setEditingEntryId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save entry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = activeFilter === 'All' || (entry.mood && entry.mood.toLowerCase() === activeFilter.toLowerCase());
    const matchesSearch = 
      (entry.title && entry.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.content && entry.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.aiInsight && entry.aiInsight.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#EBF4F6', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0F2C2C' }}>
      <aside style={{ width: '280px', backgroundColor: '#FFFFFF', borderRight: '1px solid #D6E8E8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px', boxSizing: 'border-box' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', paddingLeft: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0F5257', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Sparkles size={18} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#0F2C2C' }}>MindHaven</span>
          </div>

          <button 
            onClick={handleOpenNewModal}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', backgroundColor: '#007A5E', color: '#FFFFFF', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '20px' }}
          >
            <Plus size={18} />
            <span>New Reflection Session</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#EEF8F8', border: '1px solid #D1E5E5', fontSize: '12px', color: '#0F5257', fontWeight: '600', marginBottom: '24px' }}>
            <Shield size={14} color="#007A5E" />
            <span>UID Multi-Tenant Isolated</span>
          </div>

          <nav>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#E0F0F0', color: '#0F5257', border: 'none', fontSize: '14px', fontWeight: '600', width: '100%' }}>
              <BookOpen size={16} /> Journal Entries ({entries.length})
            </button>
          </nav>
        </div>

        <div style={{ backgroundColor: '#F4FAFA', borderRadius: '12px', padding: '12px', border: '1px solid #E0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0F2C2C', margin: 0 }}>{user.displayName || 'User'}</p>
            <p style={{ fontSize: '11px', color: '#5C7E7F', margin: 0 }}>{user.email}</p>
          </div>
          <button onClick={onSignOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C7E7F' }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0B2B2C', marginBottom: '16px' }}>Journal Entries</h1>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FFFFFF', padding: '10px 16px', borderRadius: '50px', border: '1px solid #D6E8E8' }}>
              <Search size={16} color="#6A8E8F" />
              <input type="text" placeholder="Search entries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filters.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '600', border: '1px solid', borderColor: activeFilter === filter ? '#0F5257' : '#D1E5E5', backgroundColor: activeFilter === filter ? '#0F5257' : '#FFFFFF', color: activeFilter === filter ? '#FFFFFF' : '#3B5E5F', cursor: 'pointer' }}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#E6F2F2', border: '1px solid #BCE0E0', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '13px', color: '#0F5257' }}>
          <Lock size={16} color="#007A5E" />
          <span><strong>Strict Firestore Isolation:</strong> Entries stored under <code>/users/{user.uid}/entries</code>.</span>
        </div>

        {filteredEntries.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '40px 32px', border: '1px solid #D6E8E8', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={handleOpenNewModal} style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#E0F0F0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#0F5257', cursor: 'pointer' }}>
              <Mic size={28} />
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0B2B2C', marginBottom: '8px' }}>Welcome to Your MindHaven</h2>
            <p style={{ fontSize: '14px', color: '#5C7E7F', marginBottom: '24px' }}>No entries found. Start a new reflection session to explore your thoughts.</p>
            <button onClick={handleOpenNewModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '50px', backgroundColor: '#007A5E', color: '#FFFFFF', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <Plus size={16} /><span>Create First Reflection</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredEntries.map((entry) => (
              <div key={entry.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #D6E8E8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '50px', backgroundColor: '#E0F0F0', color: '#0F5257', textTransform: 'uppercase' }}>
                      {entry.mood}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6A8E8F' }}>
                        <Calendar size={12} />
                        <span>{formatDate(entry.createdAt)}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleEditClick(entry)} 
                        title="Edit Entry"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C7E7F', padding: '2px' }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button 
                        onClick={() => entry.id && handleDeleteClick(entry.id)} 
                        title="Delete Entry"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E53E3E', padding: '2px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0B2B2C', marginBottom: '8px' }}>{entry.title}</h3>
                  <p style={{ fontSize: '14px', color: '#3A5758', lineHeight: '1.5', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>{entry.content}</p>
                </div>

                <div style={{ backgroundColor: '#F4FAFA', borderRadius: '10px', padding: '12px', borderLeft: '3px solid #007A5E' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#0F5257', marginBottom: '4px' }}>
                    <Sparkles size={14} /> Gemini Insight
                  </div>
                  <p style={{ fontSize: '12px', color: '#4A6B6C', margin: 0 }}>{entry.aiInsight}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 44, 44, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '560px', padding: '28px', position: 'relative' }}>
              <button onClick={() => { if (isListening && recognitionRef) recognitionRef.stop(); setIsListening(false); setIsModalOpen(false); }} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#6A8E8F' }}>
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0B2B2C', marginBottom: '16px' }}>
                {editingEntryId ? 'Edit Reflection' : 'New Reflection Session'}
              </h2>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#0F5257', marginBottom: '8px' }}>
                  <Lightbulb size={14} color="#007A5E" /> Micro-Prompts (Click to insert):
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {microPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePromptClick(prompt)}
                      style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', backgroundColor: '#EEF8F8', color: '#0F5257', border: '1px solid #D1E5E5', cursor: 'pointer' }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveEntry}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0F5257', marginBottom: '6px' }}>Title (Optional)</label>
                  <input type="text" placeholder="e.g. Evening Reflection" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D6E8E8', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#0F5257' }}>What's on your mind?</label>

                    <button
                      type="button"
                      onClick={toggleVoiceRecording}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '50px', border: 'none', backgroundColor: isListening ? '#E53E3E' : '#E0F0F0', color: isListening ? '#FFFFFF' : '#0F5257', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                      <span>{isListening ? 'Stop Listening' : 'Voice Dictate'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    placeholder="Express your thoughts or click a micro-prompt above..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D6E8E8', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={() => { if (isListening && recognitionRef) recognitionRef.stop(); setIsListening(false); setIsModalOpen(false); }} style={{ padding: '10px 18px', borderRadius: '50px', border: '1px solid #D1E5E5', backgroundColor: '#FFFFFF', color: '#0F5257', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '50px', backgroundColor: '#007A5E', color: '#FFFFFF', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    <span>{isSubmitting ? 'Analyzing...' : editingEntryId ? 'Update Reflection' : 'Save & Analyze'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}