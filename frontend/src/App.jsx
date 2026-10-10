import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AthleteAssessmentForm from './components/AthleteAssessmentForm';
import AssessmentWizard from './components/AssessmentWizard';
import ScoutDashboard from './components/ScoutDashboard';
import BenchmarkStandards from './components/BenchmarkStandards';
import ExtendedLabsModal from './components/ExtendedLabsModal';
import AthleteDetailModal from './components/AthleteDetailModal';
import AthleteComparisonView from './components/AthleteComparisonView';
import ProspectFinder from './components/ProspectFinder';
import ApiDocumentationModal from './components/ApiDocumentationModal';
import LoginModal from './components/LoginModal';
import MobileBottomNav from './components/MobileBottomNav';

// Dedicated Role Portals & Hubs
import AthletePortal from './components/AthletePortal';
import CoachPortal from './components/CoachPortal';
import AdminPortal from './components/AdminPortal';
import LiveSportsApiExplorer from './components/LiveSportsApiExplorer';
import TournamentsHub from './components/TournamentsHub';

import { User, Shield, Award, Building2, Globe, Database, Sparkles, CheckCircle2, Trophy } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'assess', 'scout', 'benchmarks', 'athlete_portal', 'coach_portal', 'admin_portal'
  const [assessmentMode, setAssessmentMode] = useState('wizard'); // 'wizard' or 'manual'
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isApiInfoOpen, setIsApiInfoOpen] = useState(false);
  const [isLabsOpen, setIsLabsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [athletes, setAthletes] = useState([]);
  
  // Mobile Navigation Sub-states
  const [wizardStep, setWizardStep] = useState(1);
  const [coachSubTab, setCoachSubTab] = useState('video_sessions');
  
  // Head-to-Head Comparison IDs
  const [compareA1, setCompareA1] = useState(null);
  const [compareA2, setCompareA2] = useState(null);

  // Theme Management (Light by default for official Gov look, Dark mode switchable)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portal_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portal_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Fetch athletes once for shared views like comparison
  const loadAthletes = () => {
    fetch('/api/athletes')
      .then(res => res.json())
      .then(data => setAthletes(data))
      .catch(err => console.error("Athlete fetch err:", err));
  };

  useEffect(() => {
    loadAthletes();
  }, []);

  const handleAssessmentSuccess = (newAthleteData) => {
    setSelectedAthlete(newAthleteData);
    loadAthletes();
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'athlete') {
      setActiveTab('athlete_portal');
    } else if (userData.role === 'coach') {
      setActiveTab('coach_portal');
    } else if (userData.role === 'admin') {
      setActiveTab('admin_portal');
    }
  };

  // Quick Role Simulator Switcher for Hackathon Judges
  const handleSwitchSimulation = (roleType) => {
    if (roleType === 'public') {
      setUser(null);
      setActiveTab('home');
    } else if (roleType === 'athlete') {
      setUser({
        user_id: 1,
        username: "athlete",
        role: "athlete",
        name: "Saikhom Mirabai Chanu",
        district: "Imphal East"
      });
      setActiveTab('athlete_portal');
    } else if (roleType === 'coach') {
      setUser({
        user_id: 2,
        username: "coach",
        role: "coach",
        name: "Coach L. Ibomcha Singh (Dronacharya Awardee)",
        district: "Imphal West"
      });
      setActiveTab('coach_portal');
    } else if (roleType === 'admin') {
      setUser({
        user_id: 3,
        username: "admin",
        role: "admin",
        name: "Director of Youth Affairs & Sports, Govt. of Manipur",
        district: "Imphal West"
      });
      setActiveTab('admin_portal');
    } else if (roleType === 'live_api') {
      setActiveTab('live_api');
    }
  };

  const handleTriggerCompare = (id) => {
    setCompareA1(id);
    const other = athletes.find(a => a.id !== id);
    if (other) setCompareA2(other.id);
    setActiveTab('compare');
    if (selectedAthlete) setSelectedAthlete(null);
  };

  const handleCompareWithStar = (prospectId) => {
    const prospect = athletes.find(a => a.id === prospectId);
    const star = athletes.find(a => a.id !== prospectId && a.primary_sport === prospect?.primary_sport) || athletes[0];
    setCompareA1(prospectId);
    setCompareA2(star?.id || 1);
    setActiveTab('compare');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Official Government Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenApiInfo={() => setIsApiInfoOpen(true)}
        onOpenLabs={() => setIsLabsOpen(true)}
      />

      {/* Active User Session Indicator (Subtle single line when signed in) */}
      {user && (
        <div style={{
          background: 'rgba(2, 132, 199, 0.1)',
          borderBottom: '1px solid rgba(2, 132, 199, 0.25)',
          padding: '6px 24px',
          fontSize: '0.76rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Logged in as <strong>{user.name}</strong> ({user.role.toUpperCase()})
          </span>
          <button 
            onClick={handleLogout} 
            style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}
          >
            Exit to Public Portal
          </button>
        </div>
      )}

      {/* Main Content View with mobile bottom padding */}
      <main style={{ flex: 1, paddingBottom: '76px' }}>
        
        {/* 1. PUBLIC HOMEPAGE (HERO SHOWCASE + LIVE SCOUTING LEADERBOARD) */}
        {activeTab === 'home' && !user && (
          <>
            <Hero 
              onStartAssess={() => setActiveTab('assess')} 
              onExploreScout={() => setActiveTab('scout')} 
              onOpenBenchmarks={() => setActiveTab('benchmarks')}
            />
            <ScoutDashboard 
              onSelectAthlete={(ath) => setSelectedAthlete(ath)} 
              onCompareAthlete={handleTriggerCompare}
            />
          </>
        )}

        {/* 2. ATHLETE / CITIZEN FITNESS ASSESSMENT & INSTANT AI TALENT PASSPORT */}
        {activeTab === 'assess' && (
          <div style={{ padding: '20px 0' }}>
            {/* Mode Switcher */}
            <div style={{ maxWidth: '980px', margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                display: 'inline-flex',
                background: 'var(--bg-surface)',
                borderRadius: '24px',
                padding: '4px',
                border: '1px solid var(--border-card)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <button
                  type="button"
                  onClick={() => setAssessmentMode('wizard')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: assessmentMode === 'wizard' ? '#1e3a8a' : 'transparent',
                    color: assessmentMode === 'wizard' ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    minHeight: '40px'
                  }}
                >
                  ⚡ Sequential 3-Drill Video Battery (Mobile & AI Vision)
                </button>
                <button
                  type="button"
                  onClick={() => setAssessmentMode('manual')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: assessmentMode === 'manual' ? '#1e3a8a' : 'transparent',
                    color: assessmentMode === 'manual' ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    minHeight: '40px'
                  }}
                >
                  📝 Manual Form Battery & Registration
                </button>
              </div>
            </div>

            {assessmentMode === 'wizard' ? (
              <AssessmentWizard 
                step={wizardStep}
                onStepChange={setWizardStep}
                onSwitchToCoach={() => setActiveTab('coach_portal')}
              />
            ) : (
              <AthleteAssessmentForm onAssessmentSuccess={handleAssessmentSuccess} />
            )}
          </div>
        )}

        {/* 3. COACH / SCOUT TALENT DISCOVERY HEATMAP & DOSSIERS */}
        {activeTab === 'scout' && (
          <div style={{ padding: '24px 0' }}>
            <ScoutDashboard 
              onSelectAthlete={(ath) => setSelectedAthlete(ath)} 
              onCompareAthlete={handleTriggerCompare}
            />
          </div>
        )}

        {/* 4. OFFICIAL SAI / KHELO INDIA BENCHMARK STANDARDS */}
        {activeTab === 'benchmarks' && (
          <div style={{ padding: '24px 0' }}>
            <BenchmarkStandards />
          </div>
        )}

        {/* ROLE 1: DEDICATED ATHLETE VIEW (WHEN LOGGED IN OR SIMULATED) */}
        {(activeTab === 'athlete_portal' || (user?.role === 'athlete' && activeTab === 'home')) && (
          <AthletePortal 
            athleteData={athletes[0]} 
            onStartTest={() => setActiveTab('assess')}
            onCompare={handleTriggerCompare}
          />
        )}

        {/* ROLE 2: DEDICATED SAI COACH & SCOUT WORKSPACE */}
        {(activeTab === 'coach_portal' || (user?.role === 'coach' && activeTab === 'home')) && (
          <CoachPortal 
            athletes={athletes} 
            activeCoachTab={coachSubTab}
            onCoachTabChange={setCoachSubTab}
            onSelectAthlete={(ath) => setSelectedAthlete(ath)}
            onCompareAthlete={handleTriggerCompare}
            onStartAssess={() => setActiveTab('assess')}
            onSwitchToProspects={() => setActiveTab('prospects')}
          />
        )}

        {/* ROLE 3: DEDICATED STATE ADMIN GOVERNANCE CENTER */}
        {(activeTab === 'admin_portal' || (user?.role === 'admin' && activeTab === 'home')) && (
          <AdminPortal 
            onSelectAthlete={(ath) => setSelectedAthlete(ath)}
          />
        )}

        {/* SECONDARY / EXTENDED STANDALONE VIEWS IF DIRECTLY LINKED */}
        {activeTab === 'tournaments' && (
          <TournamentsHub 
            onSelectAthlete={(ath) => setSelectedAthlete(ath)}
            onCompareAthlete={handleTriggerCompare}
          />
        )}

        {activeTab === 'compare' && (
          <div style={{ paddingTop: '20px' }}>
            <AthleteComparisonView 
              athletes={athletes} 
              initialA1Id={compareA1} 
              initialA2Id={compareA2} 
            />
          </div>
        )}

        {activeTab === 'prospects' && (
          <div style={{ paddingTop: '20px' }}>
            <ProspectFinder 
              onSelectAthlete={(ath) => setSelectedAthlete(ath)}
              onCompareWithStar={handleCompareWithStar}
            />
          </div>
        )}

        {activeTab === 'live_api' && (
          <LiveSportsApiExplorer 
            onSelectAthlete={(ath) => setSelectedAthlete(ath)}
          />
        )}
      </main>

      {/* Extended Modules & Secondary Tools Labs Modal */}
      <ExtendedLabsModal 
        isOpen={isLabsOpen} 
        onClose={() => setIsLabsOpen(false)} 
        athletes={athletes} 
        onSelectAthlete={(ath) => setSelectedAthlete(ath)} 
        compareA1={compareA1} 
        compareA2={compareA2} 
        onTriggerCompare={handleTriggerCompare} 
        onSwitchSimulation={handleSwitchSimulation} 
      />

      {/* Athlete Detail Modal */}
      {selectedAthlete && (
        <AthleteDetailModal 
          athlete={selectedAthlete} 
          onClose={() => setSelectedAthlete(null)} 
          onCompare={handleTriggerCompare}
        />
      )}

      {/* Official Sign-In Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {/* Sports APIs & Data Access Documentation Modal */}
      <ApiDocumentationModal 
        isOpen={isApiInfoOpen} 
        onClose={() => setIsApiInfoOpen(false)} 
      />

      {/* Official Government Footer */}
      <footer style={{
        background: 'var(--bg-header)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px',
        color: '#94a3b8',
        fontSize: '0.78rem'
      }}>
        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div>
            <strong style={{ color: '#f8fafc' }}>National Sports Talent Assessment & Intelligence Portal</strong>
            <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '2px' }}>
              Joint Initiative of Sports Authority of India (SAI) & Dept. of Youth Affairs & Sports, Government of Manipur
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              onClick={() => setIsApiInfoOpen(true)}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sports API & Open Data Specs
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <span>Problem Statement <strong>YAS-01</strong>: Sports Talent Identification</span>
          </div>
        </div>
      </footer>

      {/* 📱 Mobile Docked Bottom Navigation Bar (< 768px) */}
      <MobileBottomNav 
        currentRole={(activeTab === 'coach_portal' || activeTab === 'scout' || user?.role === 'coach') ? 'coach' : 'athlete'}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wizardStep={wizardStep}
        setWizardStep={setWizardStep}
        coachSubTab={coachSubTab}
        setCoachSubTab={setCoachSubTab}
      />

    </div>
  );
}
