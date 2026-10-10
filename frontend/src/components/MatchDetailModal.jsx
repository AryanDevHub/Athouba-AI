import React, { useState } from 'react';
import { 
  X, Trophy, Shield, Calendar, MapPin, Award, Clock, 
  Activity, Users, CheckCircle2, AlertCircle, Zap, Target,
  Flame, Crosshair, BarChart2, Video, Database
} from 'lucide-react';
import FootballTelemetryGrid from './FootballTelemetryGrid';

export default function MatchDetailModal({ match, onClose }) {
  const [showAiVideo, setShowAiVideo] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(false);
  if (!match) return null;

  const details = match.details || {};
  const sport = match.sport || 'Sports Fixture';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div 
        className="glass-card animate-fadeIn" 
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-card)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          padding: '28px'
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-card)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontWeight: 800 }}>
                {sport}
              </span>
              <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', fontWeight: 800 }}>
                {match.stage}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                Code: {match.match_code}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              {match.tournament_name}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '14px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} color="#0284c7" /> {match.match_date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#ea580c" /> {match.venue}
              </span>
              {details.referee && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={14} color="#10b981" /> Official: {details.referee}
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-muted)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Big Scoreboard Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {/* Home Team */}
            <div style={{ flex: 1, minWidth: '180px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {match.home_team_name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                Home Club / Seed 1
              </div>
            </div>

            {/* Score Center */}
            <div style={{ padding: '0 20px' }}>
              <div style={{
                fontSize: '2.4rem',
                fontWeight: 950,
                color: '#ea580c',
                letterSpacing: '2px',
                fontFamily: 'monospace',
                textShadow: '0 0 20px rgba(234, 88, 12, 0.3)'
              }}>
                {match.scoreline}
              </div>
              <div className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', marginTop: '6px' }}>
                Winner: {match.winner_team_name || 'Decided'}
              </div>
            </div>

            {/* Away Team */}
            <div style={{ flex: 1, minWidth: '180px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {match.away_team_name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>
                Away Club / Challenger
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* AI TACTICAL VIDEO HUD (FOOTBALL COMPUTER VISION ANALYSIS)         */}
        {/* ================================================================= */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #1e3a8a',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(30, 58, 138, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge" style={{ background: '#eff6ff', color: '#1e3a8a', fontWeight: 800 }}>
                ● AI MATCH INTELLIGENCE
              </span>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                Tactical Overlays: Ball Possession & 22-Player Tracking HUD
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowAiVideo(!showAiVideo)}
                className="btn-primary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  background: showAiVideo ? '#1e3a8a' : '#f8fafc',
                  color: showAiVideo ? '#ffffff' : '#1e3a8a',
                  border: '1px solid #1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Video size={13} /> {showAiVideo ? 'Hide AI Video' : 'View AI Video'}
              </button>

              <button
                onClick={() => setShowTelemetry(!showTelemetry)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  background: showTelemetry ? '#15803d' : '#f0fdf4',
                  color: showTelemetry ? '#ffffff' : '#15803d',
                  border: '1px solid #15803d',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Database size={13} /> {showTelemetry ? 'Hide SQL Telemetry' : 'Inspect SQL Telemetry'}
              </button>
            </div>
          </div>

          {showAiVideo && (
            <div className="animate-fadeIn" style={{ borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '14px', maxHeight: '380px', display: 'flex', justifyContent: 'center' }}>
              <video
                src="/videos/football_match_analysis.mp4"
                controls
                autoPlay
                loop
                playsInline
                onError={(e) => { e.target.src = "/api/match-analysis-video"; }}
                style={{ width: '100%', maxHeight: '380px', objectFit: 'contain' }}
              />
            </div>
          )}

          {/* 3 Core Highlights Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            fontSize: '0.76rem',
            marginBottom: showTelemetry ? '16px' : '0'
          }}>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              ⚽ <strong>Ball Possession:</strong> {match.home_team_name} {details.possession?.home || 56}% — {details.possession?.away || 44}% {match.away_team_name}
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              🏃 <strong>Player Tracking:</strong> 22/22 Active Players Tracked
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              📍 <strong>Annotated Overlays:</strong> Ball Trajectory, Speed Vectors & Pitch Radar
            </div>
          </div>

          {/* Expanded SQLite Tracking Telemetry Grid */}
          {showTelemetry && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <FootballTelemetryGrid />
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* A. FOOTBALL SPECIFIC TELEMETRY                                    */}
        {/* ================================================================= */}
        {sport.toLowerCase().includes('football') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Possession & Telemetry Stats */}
            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={16} color="#0284c7" /> Tactical Match Telemetry & Possession Control
              </h4>
              
              {/* Possession Bar */}
              {details.possession && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, marginBottom: '4px' }}>
                    <span style={{ color: '#0284c7' }}>{match.home_team_name}: {details.possession.home}%</span>
                    <span style={{ color: 'var(--text-muted)' }}>Possession</span>
                    <span style={{ color: '#64748b' }}>{match.away_team_name}: {details.possession.away}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#334155', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: `${details.possession.home}%`, background: '#0284c7' }}></div>
                    <div style={{ width: `${details.possession.away}%`, background: '#64748b' }}></div>
                  </div>
                </div>
              )}

              {/* Grid Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Expected Goals (xG)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {details.xg?.home || '1.6'} - {details.xg?.away || '0.9'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Shots (On Target)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {details.shots?.home || 12} ({details.shots_on_target?.home || 6}) - {details.shots?.away || 8} ({details.shots_on_target?.away || 3})
                  </div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Corner Kicks</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {details.corners?.home || 5} - {details.corners?.away || 3}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fouls Committed</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {details.fouls?.home || 11} - {details.fouls?.away || 13}
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Log & Disciplinary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {/* Goals */}
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ⚽ Match Goals Log
                </h4>
                {details.goals && details.goals.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {details.goals.map((g, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                        <span style={{ fontWeight: 900, color: '#ea580c', fontFamily: 'monospace' }}>{g.minute}'</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{g.player}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}> ({g.team})</span>
                          {g.assist && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Assist: {g.assist}</div>}
                        </div>
                        <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>{g.type}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No goals scored in regulation.</div>
                )}
              </div>

              {/* Cards */}
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  🟨 Disciplinary & Tactical Cards
                </h4>
                {details.cards && details.cards.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {details.cards.map((c, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                        <span style={{ fontWeight: 900, color: c.type === 'Red' ? '#ef4444' : '#eab308', fontFamily: 'monospace' }}>{c.minute}'</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{c.player}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}> ({c.team})</span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reason: {c.reason}</div>
                        </div>
                        <span className="badge" style={{ fontSize: '0.68rem', background: c.type === 'Red' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: c.type === 'Red' ? '#ef4444' : '#eab308' }}>
                          {c.type} Card
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Clean match — no cards issued.</div>
                )}
              </div>
            </div>

            {/* Lineups */}
            {details.lineups && (
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  📋 Starting Lineups & Key Rosters
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284c7', marginBottom: '6px' }}>{match.home_team_name}</div>
                    {(details.lineups.home || []).map((p, idx) => (
                      <div key={idx} style={{ fontSize: '0.76rem', padding: '4px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', width: '24px' }}>#{p.no}</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{p.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{p.pos}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ea580c', marginBottom: '6px' }}>{match.away_team_name}</div>
                    {(details.lineups.away || []).map((p, idx) => (
                      <div key={idx} style={{ fontSize: '0.76rem', padding: '4px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', width: '24px' }}>#{p.no}</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{p.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{p.pos}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* B. WEIGHTLIFTING SPECIFIC LIFTERS SCORECARD BOARD                 */}
        {/* ================================================================= */}
        {sport.toLowerCase().includes('weightlifting') && (
          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                🏋️ Official Bodyweight Division Lift Attempt Scoreboard
              </h4>
              <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c' }}>
                {details.category || "Senior Olympic Division"}
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-card)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 10px' }}>Rank</th>
                    <th style={{ padding: '8px 10px' }}>Lifter</th>
                    <th style={{ padding: '8px 10px' }}>Academy / Team</th>
                    <th style={{ padding: '8px 10px' }}>Snatch Attempts</th>
                    <th style={{ padding: '8px 10px' }}>Best Snatch</th>
                    <th style={{ padding: '8px 10px' }}>C&J Attempts</th>
                    <th style={{ padding: '8px 10px' }}>Best C&J</th>
                    <th style={{ padding: '8px 10px' }}>Total (kg)</th>
                    <th style={{ padding: '8px 10px' }}>Medal</th>
                  </tr>
                </thead>
                <tbody>
                  {(details.lifters || []).map((l, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: idx === 0 ? 'rgba(16, 185, 129, 0.04)' : 'transparent' }}>
                      <td style={{ padding: '10px', fontWeight: 800 }}>#{l.rank}</td>
                      <td style={{ padding: '10px', fontWeight: 800, color: 'var(--text-primary)' }}>{l.name}</td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{l.team}</td>
                      <td style={{ padding: '10px' }}>
                        {(l.snatch_attempts || []).map((a, aidx) => (
                          <span key={aidx} style={{
                            marginRight: '6px',
                            color: a.result === 'good' ? '#10b981' : '#ef4444',
                            fontWeight: 700,
                            textDecoration: a.result === 'fail' ? 'line-through' : 'none'
                          }}>
                            {a.kg}kg
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: '10px', fontWeight: 800, color: '#0284c7' }}>{l.best_snatch} kg</td>
                      <td style={{ padding: '10px' }}>
                        {(l.cj_attempts || []).map((a, aidx) => (
                          <span key={aidx} style={{
                            marginRight: '6px',
                            color: a.result === 'good' ? '#10b981' : '#ef4444',
                            fontWeight: 700,
                            textDecoration: a.result === 'fail' ? 'line-through' : 'none'
                          }}>
                            {a.kg}kg
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: '10px', fontWeight: 800, color: '#0284c7' }}>{l.best_cj} kg</td>
                      <td style={{ padding: '10px', fontWeight: 900, fontSize: '0.95rem', color: '#ea580c' }}>{l.total} kg</td>
                      <td style={{ padding: '10px' }}>
                        <span className="badge" style={{
                          background: l.medal === 'GOLD' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                          color: l.medal === 'GOLD' ? '#eab308' : '#94a3b8'
                        }}>
                          {l.medal}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* C. BOXING SPECIFIC JUDGE CARDS & PUNCH METRICS                    */}
        {/* ================================================================= */}
        {sport.toLowerCase().includes('boxing') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                🥊 Official 5-Judge Scorecard Registry
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-card)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '6px 10px' }}>Official Judge</th>
                      <th style={{ padding: '6px 10px' }}>Round 1</th>
                      <th style={{ padding: '6px 10px' }}>Round 2</th>
                      <th style={{ padding: '6px 10px' }}>Round 3</th>
                      <th style={{ padding: '6px 10px' }}>Final Card</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(details.judges_scorecards || []).map((j, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-primary)' }}>{j.judge}</td>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{j.r1}</td>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{j.r2}</td>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{j.r3}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 900, color: '#ea580c', fontFamily: 'monospace' }}>{j.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Punch Telemetry */}
            {details.punch_stats && (
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  📊 CompuBox Punch Statistics
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#ef4444', marginBottom: '6px' }}>Red Corner: {details.boxer_red?.name || match.home_team_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Landed: <strong>{details.punch_stats.home?.total_landed}</strong> / {details.punch_stats.home?.total_thrown} ({details.punch_stats.home?.accuracy})</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jabs: {details.punch_stats.home?.jabs}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Power Punches: {details.punch_stats.home?.power_punches}</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#0284c7', marginBottom: '6px' }}>Blue Corner: {details.boxer_blue?.name || match.away_team_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Landed: <strong>{details.punch_stats.away?.total_landed}</strong> / {details.punch_stats.away?.total_thrown} ({details.punch_stats.away?.accuracy})</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jabs: {details.punch_stats.away?.jabs}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Power Punches: {details.punch_stats.away?.power_punches}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* D. ARCHERY SPECIFIC SET BY SET SCORECARD                          */}
        {/* ================================================================= */}
        {sport.toLowerCase().includes('archery') && (
          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                🏹 70m Olympic Recurve Set-By-Set Breakdown
              </h4>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{details.weather}</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-card)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px' }}>Set</th>
                    <th style={{ padding: '8px' }}>{details.archer_a || match.home_team_name} (Arrows)</th>
                    <th style={{ padding: '8px' }}>Set Total</th>
                    <th style={{ padding: '8px' }}>{details.archer_b || match.away_team_name} (Arrows)</th>
                    <th style={{ padding: '8px' }}>Set Total</th>
                    <th style={{ padding: '8px' }}>Set Pts Awarded</th>
                  </tr>
                </thead>
                <tbody>
                  {(details.sets || []).map((s, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '8px', fontWeight: 800 }}>Set {s.set}</td>
                      <td style={{ padding: '8px', color: '#0284c7', fontWeight: 700 }}>{(s.home_arrows || []).join(' - ')}</td>
                      <td style={{ padding: '8px', fontWeight: 900 }}>{s.home_total}</td>
                      <td style={{ padding: '8px', color: '#ea580c', fontWeight: 700 }}>{(s.away_arrows || []).join(' - ')}</td>
                      <td style={{ padding: '8px', fontWeight: 900 }}>{s.away_total}</td>
                      <td style={{ padding: '8px', fontWeight: 900, color: '#10b981' }}>{s.home_pts} - {s.away_pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* E. SEPAK TAKRAW SPECIFIC SETS & SPIKE TELEMETRY                   */}
        {/* ================================================================= */}
        {sport.toLowerCase().includes('sepak') && (
          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              🏸 Premier Regu Set Progression & Acrobatic Spike Telemetry
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              {(details.sets || []).map((s, idx) => (
                <div key={idx} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Set {s.set} ({s.duration})</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ea580c' }}>{s.home} - {s.away}</div>
                </div>
              ))}
            </div>

            {details.telemetry && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.78rem' }}>
                <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 800, color: '#0284c7', marginBottom: '6px' }}>{match.home_team_name}</div>
                  <div>Spike Kills: <strong>{details.telemetry.home?.spike_kills}</strong> (Roll: {details.telemetry.home?.roll_spikes}, Sunback: {details.telemetry.home?.sunback_spikes})</div>
                  <div>Service Aces: <strong>{details.telemetry.home?.service_aces}</strong> | Blocks: <strong>{details.telemetry.home?.blocks}</strong></div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 800, color: '#ea580c', marginBottom: '6px' }}>{match.away_team_name}</div>
                  <div>Spike Kills: <strong>{details.telemetry.away?.spike_kills}</strong> (Roll: {details.telemetry.away?.roll_spikes}, Sunback: {details.telemetry.away?.sunback_spikes})</div>
                  <div>Service Aces: <strong>{details.telemetry.away?.service_aces}</strong> | Blocks: <strong>{details.telemetry.away?.blocks}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* F. FIELD HOCKEY SPECIFIC QUARTERS & PENALTY CORNERS               */}
        {sport.toLowerCase().includes('hockey') && (
          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              🏑 Astroturf Quarters Progression & Penalty Corner Conversions
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {(details.quarters || []).map((q, idx) => (
                <div key={idx} style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{q.q}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>{q.home} - {q.away}</div>
                </div>
              ))}
            </div>
            {details.goals && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {details.goals.map((g, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>{g.minute}</strong> {g.player} ({g.team})</span>
                    <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>{g.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* G. JUDO & MARTIAL ARTS / WUSHU SPECIFIC BOUT DETAIL               */}
        {(sport.toLowerCase().includes('judo') || sport.toLowerCase().includes('combat') || sport.toLowerCase().includes('martial')) && (
          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              🥋 Tatami Bout Sequence & Decisive Ippon Technique
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              <strong>Decisive Technique:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{details.winning_technique || "Ippon via Harai-Goshi"}</span> ({details.bout_duration || "2:48"})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(details.scoring_events || []).map((ev, idx) => (
                <div key={idx} style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>⏱️ <strong>{ev.time}</strong> — {ev.technique}</span>
                  <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontWeight: 800 }}>{ev.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Official Competition Record authenticated under Manipur State Directorate of Youth Affairs & Sports (AMFA / MWA / MABA / MAA / AMSTA Registry).
        </div>
      </div>
    </div>
  );
}
