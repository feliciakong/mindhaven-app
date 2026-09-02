import React from 'react';
import { User } from 'firebase/auth';
import { Feather, LogOut, Sun, Moon, ShieldCheck, Menu, Plus } from 'lucide-react';

interface HeaderProps {
  user: User;
  onSignOut: () => void;
  onToggleSidebar: () => void;
  onNewEntry: () => void;
  activeEntryTitle?: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onSignOut,
  onToggleSidebar,
  onNewEntry,
  activeEntryTitle,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="h-16 px-4 sm:px-6 bg-white/80 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Sidebar Toggle + App Branding */}
      <div className="flex items-center gap-3">
        <button
          id="header-sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Feather className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 hidden sm:inline">
            MindHaven
          </span>
        </div>

        {/* Active Entry Title Breadcrumb */}
        {activeEntryTitle && (
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-stone-200 dark:border-stone-800">
            <span className="text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Entry:
            </span>
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300 max-w-xs truncate">
              {activeEntryTitle}
            </span>
          </div>
        )}
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Entry Button */}
        <button
          id="header-new-entry-btn"
          onClick={onNewEntry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Entry</span>
        </button>

        {/* Firestore Auth Isolation Security Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>UID Isolated</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          id="header-theme-toggle-btn"
          onClick={onToggleDarkMode}
          aria-label="Toggle Theme"
          className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-semibold text-xs flex items-center justify-center">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-medium text-stone-800 dark:text-stone-200 leading-tight">
              {user.displayName || 'Journaler'}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 max-w-[120px] truncate">
              {user.email || 'Authenticated'}
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            id="header-signout-btn"
            onClick={onSignOut}
            title="Sign Out"
            className="p-2 ml-1 rounded-lg text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
