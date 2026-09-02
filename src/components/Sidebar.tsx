import React, { useState } from 'react';
import { JournalEntry } from '../types';
import {
  Plus,
  Search,
  Heart,
  Trash2,
  Calendar,
  X,
  MessageSquare,
  Sparkles,
  Lock,
} from 'lucide-react';

interface SidebarProps {
  entries: JournalEntry[];
  activeEntryId: string | null;
  onSelectEntry: (id: string) => void;
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => void;
  onToggleFavorite: (id: string, currentStatus: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MOOD_OPTIONS = ['All', 'Reflective', 'Calm', 'Grateful', 'Anxious', 'Inspired', 'Overwhelmed'];

export const Sidebar: React.FC<SidebarProps> = ({
  entries,
  activeEntryId,
  onSelectEntry,
  onNewEntry,
  onDeleteEntry,
  onToggleFavorite,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMood = selectedMood === 'All' || entry.mood === selectedMood;
    const matchesFav = !showFavoritesOnly || entry.isFavorite;

    return matchesSearch && matchesMood && matchesFav;
  });

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch {
      return 'Recently';
    }
  };

  const getMoodBadgeColor = (mood?: string) => {
    switch (mood) {
      case 'Calm':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Grateful':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Anxious':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Inspired':
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'Overwhelmed':
        return 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-80 bg-stone-50 dark:bg-stone-900/95 border-r border-stone-200/80 dark:border-stone-800 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Journal Entries
            </h2>
            <span className="text-xs bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded-full font-medium text-stone-600 dark:text-stone-400">
              {entries.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: New Reflection */}
        <div className="p-4">
          <button
            id="sidebar-new-reflection-btn"
            onClick={() => {
              onNewEntry();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium text-sm transition shadow-sm cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Reflection Session</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="px-4 pb-3 space-y-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Favorites Filter & Mood Pills */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition whitespace-nowrap cursor-pointer ${
                    selectedMood === mood
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              title={showFavoritesOnly ? 'Show all entries' : 'Show favorites only'}
              className={`p-1.5 rounded-lg border transition cursor-pointer flex-shrink-0 ${
                showFavoritesOnly
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 divide-y divide-stone-200/40 dark:divide-stone-800/40">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-stone-400 dark:text-stone-500 text-xs">
              <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-40" />
              <p>No reflection sessions found.</p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isActive = entry.id === activeEntryId;
              const isDeleting = deletingId === entry.id;

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    onSelectEntry(entry.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`group relative p-3 rounded-xl transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs'
                      : 'hover:bg-white/80 dark:hover:bg-stone-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-xs text-stone-900 dark:text-stone-100 truncate flex-1">
                      {entry.title || 'Untitled Session'}
                    </h3>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(entry.id, !!entry.isFavorite);
                      }}
                      className="text-stone-400 hover:text-rose-500 transition p-0.5"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          entry.isFavorite ? 'fill-rose-500 text-rose-500' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Metadata line */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <span>{formatDate(entry.createdAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MessageSquare className="w-2.5 h-2.5" />
                        {entry.messages.length}
                      </span>
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded-md border text-[9px] font-medium ${getMoodBadgeColor(
                        entry.mood
                      )}`}
                    >
                      {entry.mood || 'Reflective'}
                    </span>
                  </div>

                  {/* Delete Confirmation Overlay */}
                  {isDeleting ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs"
                    >
                      <span className="text-rose-700 dark:text-rose-300 font-medium">Delete entry?</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onDeleteEntry(entry.id);
                            setDeletingId(null);
                          }}
                          className="px-2 py-0.5 bg-rose-600 text-white rounded hover:bg-rose-700 font-medium text-[10px]"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-2 py-0.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(entry.id);
                      }}
                      title="Delete Entry"
                      className="absolute right-2 bottom-2 p-1 text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Security & Isolation Footer */}
        <div className="p-3 border-t border-stone-200/80 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/40 text-[10px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-400 mb-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Strict Firestore Isolation</span>
          </div>
          <p className="leading-tight">
            Entries are stored securely under <code className="bg-white dark:bg-stone-800 px-1 py-0.5 rounded">/users/{'{uid}'}/journalEntries</code>.
          </p>
        </div>
      </aside>
    </>
  );
};
