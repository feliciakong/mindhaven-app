import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle, logoutUser } from './lib/firebase';
import {
  fetchUserJournalEntries,
  createNewJournalEntry,
  saveJournalMessages,
  updateJournalEntryMeta,
  deleteJournalEntry,
} from './lib/firestore';
import { sendChatToGemini, generateSessionSummary } from './lib/api';
import { JournalEntry, ChatMessage, SessionInsights } from './types';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatWorkspace } from './components/ChatWorkspace';
import { SessionSummaryModal } from './components/SessionSummaryModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Journal entries state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [entriesLoading, setEntriesLoading] = useState(false);

  // AI & UI State
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [activeSummary, setActiveSummary] = useState<SessionInsights | null>(null);

  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); 

  // Apply dark mode class to html element
  useEffect(() => {
      document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        // Load Firestore entries for this specific user UID
        loadUserEntries(currentUser.uid);
      } else {
        setEntries([]);
        setActiveEntryId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserEntries = async (uid: string) => {
    setEntriesLoading(true);
    try {
      const fetched = await fetchUserJournalEntries(uid);
      setEntries(fetched);

      if (fetched.length > 0) {
        setActiveEntryId(fetched[0].id);
      } else {
        // Create initial welcoming session for the user
        const newEntry = await createNewJournalEntry(uid, undefined, 'Reflective');
        setEntries([newEntry]);
        setActiveEntryId(newEntry.id);
      }
    } catch (err: any) {
      console.error('Failed to load journal entries from Firestore:', err);
    } finally {
      setEntriesLoading(false);
    }
  };

  const handleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Sign in error:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const activeEntry = entries.find((e) => e.id === activeEntryId) || null;

  // Start a new reflection session
  const handleNewEntry = async () => {
    if (!user) return;
    try {
      const newEntry = await createNewJournalEntry(user.uid, undefined, 'Reflective');
      setEntries((prev) => [newEntry, ...prev]);
      setActiveEntryId(newEntry.id);
    } catch (err) {
      console.error('Failed to create new journal entry:', err);
    }
  };

  // Delete an entry from Firestore
  const handleDeleteEntry = async (entryId: string) => {
    if (!user) return;
    try {
      await deleteJournalEntry(user.uid, entryId);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));

      if (activeEntryId === entryId) {
        const remaining = entries.filter((e) => e.id !== entryId);
        if (remaining.length > 0) {
          setActiveEntryId(remaining[0].id);
        } else {
          handleNewEntry();
        }
      }
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (entryId: string, currentStatus: boolean) => {
    if (!user) return;
    const newStatus = !currentStatus;
    try {
      setEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, isFavorite: newStatus } : e))
      );
      await updateJournalEntryMeta(user.uid, entryId, { isFavorite: newStatus });
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  // Update entry title or mood
  const handleUpdateEntryMeta = async (updates: { title?: string; mood?: string }) => {
    if (!user || !activeEntryId) return;
    try {
      setEntries((prev) =>
        prev.map((e) => (e.id === activeEntryId ? { ...e, ...updates } : e))
      );
      await updateJournalEntryMeta(user.uid, activeEntryId, updates);
    } catch (err) {
      console.error('Failed to update entry meta:', err);
    }
  };

  // Send message to Gemini and update thread
  const handleSendMessage = async (text: string) => {
    if (!user || !activeEntry) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...activeEntry.messages, userMessage];

    // Optimistically update UI
    setEntries((prev) =>
      prev.map((e) =>
        e.id === activeEntry.id ? { ...e, messages: updatedMessages } : e
      )
    );

    setIsGeneratingReply(true);

    try {
      // Call Gemini backend
      const replyText = await sendChatToGemini({
        messages: updatedMessages,
        userPrompt: text,
        mood: activeEntry.mood,
        userDisplayName: user.displayName || undefined,
      });

      const geminiMessage: ChatMessage = {
        id: `msg-${Date.now()}-gemini`,
        sender: 'gemini',
        text: replyText,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, geminiMessage];

      // Update state
      setEntries((prev) =>
        prev.map((e) =>
          e.id === activeEntry.id ? { ...e, messages: finalMessages } : e
        )
      );

      // Persist to Firestore
      await saveJournalMessages(
        user.uid,
        activeEntry.id,
        finalMessages,
        activeEntry.summary,
        activeEntry.mood
      );
    } catch (err: any) {
      console.error('Error generating Gemini reply:', err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'system',
        text: `Error connecting to Gemini AI: ${err.message || 'Please check network connection.'}`,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setEntries((prev) =>
        prev.map((e) =>
          e.id === activeEntry.id ? { ...e, messages: finalMessages } : e
        )
      );
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // Generate Session Summary and Insights via Gemini
  const handleGenerateSummary = async () => {
    if (!user || !activeEntry || activeEntry.messages.length === 0) return;

    setIsSummaryModalOpen(true);
    setIsSummarizing(true);
    setActiveSummary(activeEntry.summary || null);

    try {
      const summaryResult = await generateSessionSummary({
        messages: activeEntry.messages,
        mood: activeEntry.mood,
      });

      setActiveSummary(summaryResult);

      // Update local state
      setEntries((prev) =>
        prev.map((e) =>
          e.id === activeEntry.id ? { ...e, summary: summaryResult } : e
        )
      );

      // Save summary to Firestore subcollection
      await saveJournalMessages(
        user.uid,
        activeEntry.id,
        activeEntry.messages,
        summaryResult,
        activeEntry.mood
      );
    } catch (err) {
      console.error('Error generating session summary:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Render Loading Screen during initial Auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-50 flex flex-col items-center justify-center p-6 text-stone-700 dark:text-stone-300">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-serif font-medium text-lg">Opening MindHaven Sanctuary...</p>
      </div>
    );
  }

  // Render Landing Page if unauthenticated
  if (!user) {
    return <LandingPage onSignIn={handleSignIn} isLoading={authLoading} authError={authError} />;
  }

  // Main Authenticated Workspace Layout
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-50 text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <Header
        user={user}
        onSignOut={handleSignOut}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewEntry={handleNewEntry}
        activeEntryTitle={activeEntry?.title}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar
          entries={entries}
          activeEntryId={activeEntryId}
          onSelectEntry={(id) => setActiveEntryId(id)}
          onNewEntry={handleNewEntry}
          onDeleteEntry={handleDeleteEntry}
          onToggleFavorite={handleToggleFavorite}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Central Chat & Reflection Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <ChatWorkspace
            entry={activeEntry}
            onSendMessage={handleSendMessage}
            onUpdateMeta={handleUpdateEntryMeta}
            onGenerateSummary={handleGenerateSummary}
            isGenerating={isGeneratingReply}
            onNewSession={handleNewEntry}
          />
        </main>
      </div>

      {/* AI Session Summary Modal */}
      <SessionSummaryModal
        insights={activeSummary}
        isLoading={isSummarizing}
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        entryTitle={activeEntry?.title}
        onSelectSuggestedPrompt={(promptText) => {
          if (activeEntry) {
            handleSendMessage(promptText);
          }
        }}
      />
    </div>
  );
}
