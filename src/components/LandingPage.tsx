import React from 'react';
import { signInWithGoogle } from '../lib/firebase';
import { Sparkles, ArrowRight, BookOpen, ShieldCheck, HeartPulse } from 'lucide-react';

export function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #E6F2F2 0%, #EEF6F0 100%)',
      color: '#0F2C2C',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <header style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '12px 24px',
        borderRadius: '50px',
        border: '1px solid #D1E5E5',
        boxShadow: '0 4px 15px rgba(15, 44, 44, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

        <button
          onClick={signInWithGoogle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '50px',
            backgroundColor: '#0F5257',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(15, 82, 87, 0.2)'
          }}
        >
          <span>Sign In with Google</span>
          <ArrowRight size={14} />
        </button>
      </header>

      {/* Hero Body */}
      <main style={{
        maxWidth: '720px',
        width: '100%',
        margin: '40px auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '50px',
          backgroundColor: '#D8ECEC',
          border: '1px solid #BCE0E0',
          color: '#0B4347',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '24px'
        }}>
          <Sparkles size={14} color="#0F5257" />
          <span>MindHaven • Your Trusted Reflection Companion</span>
        </div>

        <h1 style={{
          fontSize: '38px',
          fontWeight: '800',
          lineHeight: '1.25',
          color: '#0B2B2C',
          marginBottom: '16px',
          letterSpacing: '-0.5px'
        }}>
          A quiet space for your thoughts, guided by intuitive AI.
        </h1>

        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#3B5E5F',
          maxWidth: '580px',
          margin: '0 auto 32px auto'
        }}>
          MindHaven combines continuous Socratic reflection with private cloud storage, 
          transforming daily thoughts into meaningful self-discoveries and actionable clarity.
        </p>

        {/* Action Button */}
        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={signInWithGoogle}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 28px',
              borderRadius: '50px',
              backgroundColor: '#007A5E',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0, 122, 94, 0.25)',
              transition: 'transform 0.15s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ fill: '#FFFFFF' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Central Workspace Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #D6E8E8',
          boxShadow: '0 12px 30px rgba(15, 82, 87, 0.08)',
          textAlign: 'left',
          maxWidth: '540px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #EBF3F3',
            paddingBottom: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF8A8A' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFC764' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#62D4A4' }} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#6A8E8F', letterSpacing: '0.5px' }}>
              MINDHAVEN WORKSPACE
            </span>
          </div>

          <div style={{
            backgroundColor: '#F4FAFA',
            borderRadius: '12px',
            padding: '14px 16px',
            border: '1px solid #E0F0F0',
            marginBottom: '16px'
          }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0F5257', marginBottom: '4px' }}>
              Today's Reflection
            </p>
            <p style={{ fontSize: '13px', color: '#4A6E6F', fontStyle: 'italic', lineHeight: '1.4' }}>
              "Taking time to step back helped me organize my goals..."
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px', color: '#3B5E5F', fontWeight: '600' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={15} color="#0F5257" /> Daily Journal
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HeartPulse size={15} color="#0F5257" /> Insights
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={15} color="#0F5257" /> Private Cloud
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', fontSize: '12px', color: '#6A8E8F', padding: '16px 0' }}>
        © MindHaven. Minimalist AI Reflection Sanctuary.
      </footer>
    </div>
  );
}
