import React, { useState } from 'react';
import { 
  Sparkles, Plus, Shield, Search, LogOut, BookOpen, 
  Heart, Lock, Mic, Calendar, User as UserIcon
} from 'lucide-react';

interface DashboardProps {
  user: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  };
  onSignOut: () => void;
}

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'Reflective', 'Calm', 'Grateful', 'Anxious', 'Inspired', 'Overwhelmed'];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#EBF4F6',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      color: '#0F2C2C'
    }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '280px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #D6E8E8',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        boxSizing: 'border-box'
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', paddingLeft: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#0F5257',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Sparkles size={18} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#0F2C2C', letterSpacing: '-0.3px' }}>
              MindHaven
            </span>
          </div>

          {/* Action Button */}
          <button style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#007A5E',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 122, 94, 0.2)',
            marginBottom: '20px'
          }}>
            <Plus size={18} />
            <span>New Reflection Session</span>
          </button>

          {/* UID Security Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: '#EEF8F8',
            border: '1px solid #D1E5E5',
            fontSize: '12px',
            color: '#0F5257',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            <Shield size={14} color="#007A5E" />
            <span>UID Multi-Tenant Isolated</span>
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#E0F0F0',
              color: '#0F5257',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left'
            }}>
              <BookOpen size={16} /> Journal Entries
            </button>
          </nav>
        </div>

        {/* User Profile Footer Card */}
        <div style={{
          backgroundColor: '#F4FAFA',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid #E0F0F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
            ) : (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#0F5257',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                {user.displayName ? user.displayName.charAt(0) : 'U'}
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#0F2C2C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.displayName || 'User'}
              </p>
              <p style={{ fontSize: '11px', color: '#5C7E7F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </p>
            </div>
          </div>
          <button 
            onClick={onSignOut}
            title="Sign Out"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#5C7E7F',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={{
        flex: 1,
        padding: '32px 40px',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        {/* Top Search & Filter Bar */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0B2B2C', marginBottom: '16px' }}>
            Journal Entries
          </h1>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{
              flex: 1,
              minWidth: '240px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFFFFF',
              padding: '10px 16px',
              borderRadius: '50px',
              border: '1px solid #D6E8E8'
            }}>
              <Search size={16} color="#6A8E8F" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  color: '#0F2C2C'
                }}
              />
            </div>
          </div>

          {/* Mood Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid',
                  borderColor: activeFilter === filter ? '#0F5257' : '#D1E5E5',
                  backgroundColor: activeFilter === filter ? '#0F5257' : '#FFFFFF',
                  color: activeFilter === filter ? '#FFFFFF' : '#3B5E5F',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Security Banner */}
        <div style={{
          backgroundColor: '#E6F2F2',
          border: '1px solid #BCE0E0',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#0F5257'
        }}>
          <Lock size={16} color="#007A5E" />
          <span>
            <strong>Strict Firestore Isolation:</strong> Entries are stored securely under <code>/users/{'{uid}'}/entries</code> with client-side PII sanitization.
          </span>
        </div>

        {/* Hero Welcome Box */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid #D6E8E8',
          boxShadow: '0 8px 24px rgba(15, 82, 87, 0.05)',
          textAlign: 'center',
          maxWidth: '640px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#E0F0F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#0F5257'
          }}>
            <Mic size={22} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0B2B2C', marginBottom: '8px' }}>
            Welcome to Your MindHaven
          </h2>
          <p style={{ fontSize: '14px', color: '#5C7E7F', lineHeight: '1.5', marginBottom: '24px' }}>
            Begin a new reflection session to explore your thoughts, navigate challenges, or discover structured insights with Gemini AI.
          </p>

          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '50px',
            backgroundColor: '#007A5E',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 122, 94, 0.2)'
          }}>
            <Mic size={16} />
            <span>Start 1-Tap Audio Entry</span>
          </button>
        </div>
      </main>
    </div>
  );
}
