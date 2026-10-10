import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Award, MapPin, ArrowRight, ShieldCheck, CheckCircle, TrendingUp, GitCompare } from 'lucide-react';

export default function ProspectFinder({ onSelectAthlete, onCompareWithStar }) {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prospects')
      .then(res => res.json())
      .then(data => {
        setProspects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Prospect fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto 60px', padding: '24px' }}>
      
      {/* Official Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.3)', padding: '3px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
          <Sparkles size={14} /> PROBLEM STATEMENT YAS-01 FOCUS • GRASSROOTS TALENT DISCOVERY
        </div>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          AI Talent Discovery & Breakthrough Prospects Console
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Flagging under-the-radar athletes from Manipur's remote and hill districts whose physical test standards and match statistics merit national camp trials.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading AI prospective talent pool...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px'
        }}>
          {prospects.map((p, idx) => (
            <div 
              key={p.id}
              className="gov-card"
              style={{
                padding: '22px',
                borderLeft: idx < 3 ? '4px solid #ea580c' : '4px solid #059669',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Top Badge: Rank & Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge" style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.3)' }}>
                    Rank #{idx + 1} • {p.ai_breakthrough_probability}
                  </span>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0284c7' }}>
                      {p.ai_prospect_rating}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>AI PROSPECT RATING</span>
                  </div>
                </div>

                {/* Athlete Name & Basic Bio with Photo Thumbnail */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                  <img 
                    src={p.profile_photo_url || p.media_url || '/demo_athlete.jpg'} 
                    alt={p.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/demo_athlete.jpg';
                    }}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      border: '2px solid rgba(2, 132, 199, 0.4)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                      {p.name}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <MapPin size={11} /> {p.district}
                      </span>
                      <span>•</span>
                      <span>{p.age} yrs</span>
                      <span>•</span>
                      <span style={{ color: '#0284c7', fontWeight: 700 }}>{p.primary_sport}</span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <strong>Club / Academy:</strong> {p.current_club}
                </div>

                {/* Key Metric Highlights */}
                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '6px',
                  textAlign: 'center',
                  marginBottom: '14px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>VERT JUMP</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>{p.vertical_jump_cm}cm</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>30M SPRINT</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0284c7' }}>{p.sprint_30m_sec}s</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>BEEP TEST</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ea580c' }}>Lvl {p.beep_test_level}</div>
                  </div>
                </div>

                {/* AI Scout Recommendation */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
                  <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px' }}>AI Talent Projection:</strong>
                  {p.ai_report?.coach_verdict || p.achievements}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-card)', paddingTop: '12px' }}>
                <button 
                  onClick={() => onSelectAthlete(p)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem', justifyContent: 'center' }}
                >
                  View Dossier
                </button>

                <button 
                  onClick={() => onCompareWithStar(p.id)}
                  className="btn-primary"
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem', justifyContent: 'center' }}
                >
                  <GitCompare size={12} /> Compare Side-by-Side
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
