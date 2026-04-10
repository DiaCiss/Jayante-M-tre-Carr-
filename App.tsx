
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Register } from './views/Register';
import { Login } from './views/Login';
import { MemberDashboard } from './views/MemberDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { Presentation } from './views/Presentation';
import { Contact } from './views/Contact';
import { LegalPageView } from './views/LegalPage';
import { Donation } from './views/Donation';
import { Member, Contribution, ViewState, UserRole, GlobalSettings } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  // Global Data State
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Simulation State
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    targetSqm: 250,
    manualRaisedOffset: 0,
    isSimulationMode: false
  });
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- THEME MANAGEMENT ---
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, contributionsData] = await Promise.all([
          api.getMembers(),
          api.getContributions()
        ]);
        setMembers(membersData);
        setContributions(contributionsData);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // WebSocket Connection
    let ws: WebSocket;
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('Connected to Donation Stream');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_DONATION') {
            const { member, contribution } = data.payload;
            
            // Update State with new donation
            setMembers(prev => {
              const exists = prev.find(m => m.id === member.id);
              if (exists) return prev;
              return [member, ...prev];
            });
            
            setContributions(prev => [contribution, ...prev]);
            
            // Optional: Show toast notification here
          }
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from Donation Stream. Reconnecting...');
        setTimeout(connectWebSocket, 3000); // Auto-reconnect
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleLogin = async (identifier: string, pass: string) => {
    try {
      const { user, token } = await api.login(identifier, pass);
      localStorage.setItem('token', token);
      setCurrentUser(user);
      if (user.role === UserRole.ADMIN) {
        setCurrentView('admin');
      } else {
        setCurrentView('member-dashboard');
      }
    } catch (error) {
      alert("Erreur de connexion : Identifiants incorrects.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleRegister = async (newMember: Member) => {
    try {
      const { user, token } = await api.register(newMember);
      localStorage.setItem('token', token);
      setMembers(prev => [...prev, user]);
      setCurrentUser(user);
      setCurrentView('member-dashboard');
    } catch (error) {
      alert("Erreur lors de l'inscription.");
    }
  };

  const handleAddContribution = async (newContribution: Contribution) => {
    try {
      const savedContrib = await api.addContribution(newContribution);
      setContributions(prev => [savedContrib, ...prev]);
    } catch (error) {
      alert("Impossible d'ajouter la contribution");
    }
  };

  // --- ADMIN SIMULATION HANDLERS ---
  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-emerald-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <Layout 
      currentView={currentView} 
      setCurrentView={setCurrentView} 
      currentUser={currentUser}
      onLogout={handleLogout}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
    >
      {currentView === 'home' && (
        <Home 
          members={members} 
          contributions={contributions} 
          onNavigate={setCurrentView}
          globalSettings={globalSettings}
        />
      )}
      {currentView === 'presentation' && (
        <Presentation onNavigate={setCurrentView} />
      )}
      {currentView === 'register' && (
        <Register onRegister={handleRegister} />
      )}
      {currentView === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      {currentView === 'member-dashboard' && currentUser && (
        <MemberDashboard 
          member={currentUser} 
          allContributions={contributions}
        />
      )}
      {currentView === 'admin' && currentUser?.role === UserRole.ADMIN && (
        <AdminDashboard 
          members={members} 
          contributions={contributions}
          onAddContribution={handleAddContribution}
          globalSettings={globalSettings}
          setGlobalSettings={setGlobalSettings}
          onUpdateMember={handleUpdateMember}
        />
      )}
      {currentView === 'contact' && (
        <Contact />
      )}
      {currentView === 'donation' && (
        <Donation />
      )}
      {currentView === 'legal-mentions' && (
        <LegalPageView slug="mentions-legales" />
      )}
      {currentView === 'legal-privacy' && (
        <LegalPageView slug="politique-confidentialite" />
      )}
      {currentView === 'legal-cgu' && (
        <LegalPageView slug="cgu" />
      )}
      {currentView === 'legal-transparency' && (
        <LegalPageView slug="transparence" />
      )}
    </Layout>
  );
};

export default App;
