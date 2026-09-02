import React, { useState, useEffect } from 'react';
import { auth, signOutUser } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EBF4F6',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: '#0F5257',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        Loading MindHaven...
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <Dashboard user={user} onSignOut={signOutUser} />;
}

export default App;
