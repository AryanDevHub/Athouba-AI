import React from 'react';
import { ClipboardList, BarChart2, UserCheck, Users, Search, Award, Compass } from 'lucide-react';

export default function MobileBottomNav({ 
  currentRole, 
  activeTab, 
  setActiveTab, 
  wizardStep, 
  setWizardStep,
  coachSubTab,
  setCoachSubTab 
}) {
  const isAthlete = currentRole === 'athlete';

  return (
    <nav 
      className="mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      {isAthlete ? (
        <>
          {/* 1. Athlete Tests */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('assess');
              if (setWizardStep && (wizardStep === 0 || wizardStep === 4)) {
                setWizardStep(1); // Jump to active test
              }
            }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: (activeTab === 'assess' && wizardStep >= 1 && wizardStep <= 3) ? '#1e3a8a' : '#64748b',
              padding: '6px 0'
            }}
          >
            <ClipboardList size={20} color={(activeTab === 'assess' && wizardStep >= 1 && wizardStep <= 3) ? '#1e3a8a' : '#64748b'} />
            <span style={{ fontSize: '11px', fontWeight: (activeTab === 'assess' && wizardStep >= 1 && wizardStep <= 3) ? 800 : 600 }}>
              Field Tests
            </span>
          </button>

          {/* 2. My Report & Passport */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('assess');
              if (setWizardStep) setWizardStep(4); // Jump to Passport
            }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: (activeTab === 'assess' && wizardStep === 4) ? '#15803d' : '#64748b',
              padding: '6px 0'
            }}
          >
            <BarChart2 size={20} color={(activeTab === 'assess' && wizardStep === 4) ? '#15803d' : '#64748b'} />
            <span style={{ fontSize: '11px', fontWeight: (activeTab === 'assess' && wizardStep === 4) ? 800 : 600 }}>
              Talent Report
            </span>
          </button>

          {/* 3. My Mentor Coach */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('assess');
              if (setWizardStep) setWizardStep(0); // Jump to Profile / Coach Selection
            }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: (activeTab === 'assess' && wizardStep === 0) ? '#1e3a8a' : '#64748b',
              padding: '6px 0'
            }}
          >
            <UserCheck size={20} color={(activeTab === 'assess' && wizardStep === 0) ? '#1e3a8a' : '#64748b'} />
            <span style={{ fontSize: '11px', fontWeight: (activeTab === 'assess' && wizardStep === 0) ? 800 : 600 }}>
              My Coach
            </span>
          </button>
        </>
      ) : (
        <>
          {/* 1. Coach Candidate Roster */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('coach_portal');
              if (setCoachSubTab) setCoachSubTab('video_sessions');
            }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: (activeTab === 'coach_portal' && coachSubTab === 'video_sessions') ? '#1e3a8a' : '#64748b',
              padding: '6px 0'
            }}
          >
            <Users size={20} color={(activeTab === 'coach_portal' && coachSubTab === 'video_sessions') ? '#1e3a8a' : '#64748b'} />
            <span style={{ fontSize: '11px', fontWeight: (activeTab === 'coach_portal' && coachSubTab === 'video_sessions') ? 800 : 600 }}>
              Roster
            </span>
          </button>

          {/* 2. Coach Talent Search / Pool */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('coach_portal');
              if (setCoachSubTab) setCoachSubTab('talent_pool');
            }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: (activeTab === 'coach_portal' && coachSubTab === 'talent_pool') ? '#1e3a8a' : '#64748b',
              padding: '6px 0'
            }}
          >
            <Search size={20} color={(activeTab === 'coach_portal' && coachSubTab === 'talent_pool') ? '#1e3a8a' : '#64748b'} />
            <span style={{ fontSize: '11px', fontWeight: (activeTab === 'coach_portal' && coachSubTab === 'talent_pool') ? 800 : 600 }}>
              Talent Search
            </span>
          </button>

          {/* 3. Coach Camp Shortlist */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('coach_portal');
              if (setCoachSubTab) setCoachSubTab('pending_queue');
            }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: (activeTab === 'coach_portal' && coachSubTab === 'pending_queue') ? '#15803d' : '#64748b',
              padding: '6px 0'
            }}
          >
            <Award size={20} color={(activeTab === 'coach_portal' && coachSubTab === 'pending_queue') ? '#15803d' : '#64748b'} />
            <span style={{ fontSize: '11px', fontWeight: (activeTab === 'coach_portal' && coachSubTab === 'pending_queue') ? 800 : 600 }}>
              Shortlist
            </span>
          </button>

          {/* 4. Grassroots Manipur Map */}
          <button
            type="button"
            onClick={() => setActiveTab('scout')}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'scout' ? '#ea580c' : '#64748b',
              padding: '6px 0'
            }}
          >
            <Compass size={20} color={activeTab === 'scout' ? '#ea580c' : '#64748b'} />
            <span style={{ fontSize: '11px', fontWeight: activeTab === 'scout' ? 800 : 600 }}>
              State Map
            </span>
          </button>
        </>
      )}
    </nav>
  );
}
