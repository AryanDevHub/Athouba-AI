import React, { useState } from 'react';
import { X, Trophy, Building2, GitCompare, Globe, FileCode, Layers, Shield, Sparkles } from 'lucide-react';
import TournamentsHub from './TournamentsHub';
import AdminPortal from './AdminPortal';
import AthleteComparisonView from './AthleteComparisonView';
import LiveSportsApiExplorer from './LiveSportsApiExplorer';
import ApiDocumentationModal from './ApiDocumentationModal';

export default function ExtendedLabsModal({ isOpen, onClose, athletes, onSelectAthlete, compareA1, compareA2, onTriggerCompare, onSwitchSimulation }) {
  if (!isOpen) return null;

  const [activeLabTab, setActiveLabTab] = useState('tournaments'); // 'tournaments', 'governance', 'compare', 'live_apis'
  const [showApiDoc, setShowApiDoc] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(5, 10, 20, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        className="glass-card animate-fadeIn" 
        style={{
          width: '100%',
          maxWidth: '1320px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-card)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-surface)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontWeight: 800 }}>
                EXTENDED MODULES & LABS
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Secondary Tools, State Governance & Competitions
              </h2>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Peripheral modules contained outside primary Talent ID flows (Tournaments, District Budget Analytics, Live APIs, Head-to-Head Compare, and Role Dashboards).
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowApiDoc(true)}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '6px' }}
            >
              <FileCode size={13} /> API Schemas
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Role Simulation Bar (Contained cleanly inside Labs) */}
        {onSwitchSimulation && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid var(--border-card)',
            padding: '8px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '0.74rem'
          }}>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
              ⚖️ Hackathon Role Portals Simulation:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => { onSwitchSimulation('athlete'); onClose(); }}
                className="btn-secondary"
                style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                🏅 Athlete Portal (Mirabai Chanu)
              </button>
              <button
                onClick={() => { onSwitchSimulation('coach'); onClose(); }}
                className="btn-secondary"
                style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                🛡️ SAI Coach Workspace (Coach Ibomcha)
              </button>
              <button
                onClick={() => { onSwitchSimulation('admin'); onClose(); }}
                className="btn-secondary"
                style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                🏛️ State Governance Desk (Director)
              </button>
            </div>
          </div>
        )}

        {/* Labs Tab Navigation Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '10px 24px',
          borderBottom: '1px solid var(--border-card)',
          background: 'var(--bg-primary)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveLabTab('tournaments')}
            className={activeLabTab === 'tournaments' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Trophy size={14} /> Tournaments & Matches
          </button>

          <button
            onClick={() => setActiveLabTab('governance')}
            className={activeLabTab === 'governance' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Building2 size={14} /> State Governance & District Budget
          </button>

          <button
            onClick={() => setActiveLabTab('compare')}
            className={activeLabTab === 'compare' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <GitCompare size={14} /> Head-to-Head Compare Simulator
          </button>

          <button
            onClick={() => setActiveLabTab('live_apis')}
            className={activeLabTab === 'live_apis' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Globe size={14} /> Live Sports APIs Gateway
          </button>
        </div>

        {/* Labs Tab Content Viewport */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {activeLabTab === 'tournaments' && (
            <TournamentsHub onSelectAthlete={onSelectAthlete} />
          )}

          {activeLabTab === 'governance' && (
            <AdminPortal onSelectAthlete={onSelectAthlete} />
          )}

          {activeLabTab === 'compare' && (
            <AthleteComparisonView
              athletes={athletes}
              preselectId1={compareA1}
              preselectId2={compareA2}
              onSelectAthlete={onSelectAthlete}
            />
          )}

          {activeLabTab === 'live_apis' && (
            <LiveSportsApiExplorer />
          )}
        </div>
      </div>

      {showApiDoc && (
        <ApiDocumentationModal onClose={() => setShowApiDoc(false)} />
      )}
    </div>
  );
}
