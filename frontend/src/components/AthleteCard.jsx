import React from 'react';
import { Trophy, MapPin, Activity, ChevronRight, Zap, Award, ShieldCheck, GitCompare } from 'lucide-react';

export default function AthleteCard({ athlete, onClick, onCompare }) {
  const {
    id,
    khel_id,
    name,
    age,
    gender,
    district,
    primary_sport,
    current_club,
    match_history,
    composite_score,
    grade,
    grade_title,
    badge_color,
    vertical_jump_cm,
    sprint_30m_sec,
    beep_test_level,
    ai_prospect_rating
  } = athlete;

  const lastMatch = match_history && match_history.length > 0 ? match_history[0] : null;

  return (
    <div 
      className="gov-card gov-card-interactive"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div>
        {/* Top Header: Grade Badge & Score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{
              background: `${badge_color}18`,
              color: badge_color,
              border: `1px solid ${badge_color}45`,
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '0.72rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Award size={12} /> {grade} • {grade_title}
            </div>

            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
              Khel ID: <strong style={{ color: '#0284c7' }}>{khel_id}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
              {composite_score}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800 }}>SAI SCORE</div>
          </div>
        </div>

        {/* Athlete Identity & Photo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <img
            src={athlete.profile_photo_url || athlete.media_url || '/demo_athlete.jpg'}
            alt={name}
            onError={(e) => { e.target.src = '/demo_athlete.jpg'; }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: `2px solid ${badge_color || '#0284c7'}`,
              flexShrink: 0
            }}
          />
          <div>
            <h3 
              onClick={() => onClick(athlete)}
              style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, cursor: 'pointer' }}
            >
              {name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.76rem', marginTop: '2px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#059669', fontWeight: 600 }}>
                <MapPin size={11} /> {district}
              </span>
              <span>•</span>
              <span>{age}y</span>
              <span>•</span>
              <span style={{ color: '#0284c7', fontWeight: 700 }}>{primary_sport}</span>
            </div>
          </div>
        </div>

        {/* Current Club / Academy */}
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          <strong>Club:</strong> {current_club}
        </div>

        {/* Last Match Snapshot */}
        {lastMatch && (
          <div style={{ background: 'var(--bg-primary)', padding: '7px 10px', borderRadius: '6px', fontSize: '0.72rem', marginBottom: '12px', border: '1px solid var(--border-card)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.64rem', fontWeight: 700 }}>RECENT FIXTURE:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>vs {lastMatch.opponent}</span>
              <span style={{ color: lastMatch.result.includes('Won') || lastMatch.result.includes('GOLD') ? '#059669' : '#0284c7' }}>{lastMatch.result}</span>
            </div>
          </div>
        )}

        {/* Physical Stats Chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          background: 'var(--bg-primary)',
          padding: '8px',
          borderRadius: '6px',
          marginBottom: '14px',
          border: '1px solid var(--border-card)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>VERT JUMP</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>{vertical_jump_cm}cm</div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-card)', borderRight: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>30M SPRINT</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7' }}>{sprint_30m_sec}s</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>PROSPECT</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ea580c' }}>{ai_prospect_rating}</div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border-card)',
        paddingTop: '10px',
        gap: '8px'
      }}>
        {onCompare && (
          <button
            onClick={(e) => { e.stopPropagation(); onCompare(id); }}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#334155',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <GitCompare size={12} /> Compare
          </button>
        )}

        <button
          onClick={() => onClick(athlete)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1e3a8a',
            fontWeight: 800,
            fontSize: '0.76rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            marginLeft: 'auto'
          }}
        >
          View Full Dossier <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
