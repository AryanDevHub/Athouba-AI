import React, { useState } from 'react';
import { Award, Shield, User, LogIn, Activity, Search, MapPin, Globe, PhoneCall, Sun, Moon, Sparkles, Database, Trophy, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenLogin, onLogout, theme, toggleTheme, onOpenApiInfo, onOpenLabs }) {
  const [lang, setLang] = useState('en');

  const isAthleteActive = activeTab === 'assess' || activeTab === 'athlete_portal';
  const isScoutActive = activeTab === 'scout';
  const isCoachActive = activeTab === 'coach_portal';

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      {/* 🇮🇳 Top Indian National Tricolor Ribbon (Always visible) */}
      <div style={{ height: '4px', display: 'flex', width: '100%' }}>
        <div style={{ flex: 1, background: '#FF9933' }}></div>
        <div style={{ flex: 1, background: '#FFFFFF' }}></div>
        <div style={{ flex: 1, background: '#138808' }}></div>
      </div>

      {/* ========================================================= */}
      {/* 📱 1. MOBILE-ONLY LEAN TOP BAR (< 768px)                  */}
      {/* Zero horizontal overflow, single-line brand + role pill   */}
      {/* ========================================================= */}
      <div 
        className="mobile-only"
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          height: '56px',
          padding: '0 12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        {/* Left: Official Emblem & Clean Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <img 
            src="/sai_logo.svg" 
            alt="SAI" 
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '5px', lineHeight: 1.2 }}>
              Athouba <span style={{ color: '#d97706' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600 }}>
              AI4Seva • SAI YAS-01
            </div>
          </div>
        </div>

        {/* Right: Compact Role Switcher Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            display: 'inline-flex',
            background: '#f1f5f9',
            borderRadius: '20px',
            padding: '2px',
            border: '1px solid #cbd5e1'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('assess')}
              style={{
                padding: '5px 10px',
                borderRadius: '16px',
                fontSize: '0.74rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                background: isAthleteActive ? '#1e3a8a' : 'transparent',
                color: isAthleteActive ? '#ffffff' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              🏃 Athlete
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('coach_portal')}
              style={{
                padding: '5px 10px',
                borderRadius: '16px',
                fontSize: '0.74rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                background: isCoachActive ? '#1e3a8a' : 'transparent',
                color: isCoachActive ? '#ffffff' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              📋 Coach
            </button>
          </div>

          {/* User Status / Login Icon on Mobile */}
          {user ? (
            <button 
              onClick={onLogout}
              title="Sign Out"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#1e3a8a',
                cursor: 'pointer'
              }}
            >
              {user.name.charAt(0)}
            </button>
          ) : (
            <button 
              onClick={onOpenLogin}
              style={{
                background: '#1e3a8a',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 8px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Official Sign-In"
            >
              <LogIn size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 💻 2. DESKTOP-ONLY OFFICIAL GOVERNMENT HEADER (>= 768px)  */}
      {/* ========================================================= */}
      <div className="desktop-only" style={{ flexDirection: 'column', width: '100%' }}>
        {/* 🏛️ Official Notification & Accessibility Ribbon */}
        <div style={{
          background: '#0f172a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '5px 24px',
          fontSize: '0.73rem',
          color: '#cbd5e1'
        }}>
          <div style={{
            maxWidth: '1380px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {/* Government Affiliations */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '0.3px' }}>
                भारत सरकार / Government of India
              </span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ fontWeight: 700, color: '#e2e8f0' }}>
                मणिपुर सरकार / Government of Manipur
              </span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#93c5fd', fontWeight: 600 }}>
                Ministry of Youth Affairs & Sports (MYAS)
              </span>
            </div>

            {/* Tools: Theme Toggle, Helpline, Language, API Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e2e8f0', fontWeight: 600 }}>
                <PhoneCall size={12} color="#10b981" /> Helpline: 1800-11-2024
              </span>
              <span style={{ color: '#475569' }}>|</span>
              
              {/* API Transparency Link */}
              <button
                onClick={onOpenApiInfo}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#93c5fd',
                  fontSize: '0.73rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: '2px 6px'
                }}
              >
                <Database size={12} /> Sports APIs & Data Access
              </button>
              <span style={{ color: '#475569' }}>|</span>

              {/* Language Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={12} color="#94a3b8" />
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value)}
                  style={{
                    background: 'transparent',
                    color: '#e2e8f0',
                    border: 'none',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="en" style={{ background: '#0f172a' }}>English</option>
                  <option value="mn" style={{ background: '#0f172a' }}>মৈতৈलोन् (Meiteilon)</option>
                  <option value="hi" style={{ background: '#0f172a' }}>हिन्दी (Hindi)</option>
                </select>
              </div>
              <span style={{ color: '#475569' }}>|</span>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                {theme === 'dark' ? (
                  <><Sun size={12} color="#fbbf24" /> Light</>
                ) : (
                  <><Moon size={12} color="#93c5fd" /> Dark</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 🏅 Main Brand Bar with Official Logos */}
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '10px 24px'
        }}>
          <div style={{
            maxWidth: '1380px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            
            {/* Official Logos Section */}
            <div 
              onClick={() => setActiveTab('home')}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            >
              {/* Ministry Logo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                paddingRight: '14px',
                borderRight: '1px solid #e2e8f0'
              }}>
                <img 
                  src="/myas_logo.svg" 
                  alt="MYAS" 
                  style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* SAI Logo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                paddingRight: '14px',
                borderRight: '1px solid #e2e8f0'
              }}>
                <img 
                  src="/sai_logo.svg" 
                  alt="Sports Authority of India" 
                  style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* Portal Title */}
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Athouba <span style={{ color: '#d97706' }}>AI</span>
                  <span className="badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.65rem', padding: '1px 7px', fontWeight: 800 }}>
                    AI4Seva
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} color="#15803d" />
                  <span>Sports Authority of India • Manipur Regional Talent Hub</span>
                </div>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div style={{
              display: 'inline-flex',
              background: '#f1f5f9',
              borderRadius: '24px',
              padding: '3px',
              border: '1px solid #cbd5e1'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('assess')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: isAthleteActive ? '#1e3a8a' : 'transparent',
                  color: isAthleteActive ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease',
                  minHeight: '36px'
                }}
              >
                🏃 Athlete View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('coach_portal')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: isCoachActive ? '#1e3a8a' : 'transparent',
                  color: isCoachActive ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease',
                  minHeight: '36px'
                }}
              >
                📋 Coach View
              </button>
            </div>

            {/* Navigation Links - YAS-01 Core Problem Statement */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setActiveTab('assess')}
                style={{
                  background: isAthleteActive ? '#eff6ff' : 'transparent',
                  color: isAthleteActive ? '#1e3a8a' : '#334155',
                  border: isAthleteActive ? '1px solid #bfdbfe' : '1px solid transparent',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px'
                }}
              >
                <Activity size={16} color={isAthleteActive ? '#1e3a8a' : 'currentColor'} />
                <span>Field Assessment (Athlete)</span>
              </button>

              <button 
                onClick={() => setActiveTab('scout')}
                style={{
                  background: isScoutActive ? '#eff6ff' : 'transparent',
                  color: isScoutActive ? '#1e3a8a' : '#334155',
                  border: isScoutActive ? '1px solid #bfdbfe' : '1px solid transparent',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px'
                }}
              >
                <MapPin size={16} color={isScoutActive ? '#ea580c' : 'currentColor'} />
                <span>Grassroots Map & Scouting</span>
              </button>

              <button 
                onClick={() => setActiveTab('coach_portal')}
                style={{
                  background: isCoachActive ? '#eff6ff' : 'transparent',
                  color: isCoachActive ? '#1e3a8a' : '#334155',
                  border: isCoachActive ? '1px solid #bfdbfe' : '1px solid transparent',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px'
                }}
              >
                <Search size={16} color={isCoachActive ? '#1e3a8a' : 'currentColor'} />
                <span>Coach Video Review</span>
              </button>

              <button 
                onClick={() => setActiveTab('benchmarks')}
                style={{
                  background: activeTab === 'benchmarks' ? '#f0fdf4' : 'transparent',
                  color: activeTab === 'benchmarks' ? '#15803d' : '#334155',
                  border: activeTab === 'benchmarks' ? '1px solid #bbf7d0' : '1px solid transparent',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px'
                }}
              >
                <Award size={16} color={activeTab === 'benchmarks' ? '#15803d' : 'currentColor'} />
                <span>Physical Benchmarks</span>
              </button>

              <button 
                onClick={onOpenLabs}
                style={{
                  background: 'none',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginLeft: '4px'
                }}
                title="Secondary Tools & Simulations"
              >
                <Layers size={14} />
                <span>More</span>
              </button>
            </nav>

            {/* Official Sign In */}
            <div>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    textAlign: 'right'
                  }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>{user.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#15803d', fontWeight: 700 }}>
                      ● {user.role.toUpperCase()} (Verified)
                    </div>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onOpenLogin}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  <LogIn size={14} /> Official Sign-In
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
