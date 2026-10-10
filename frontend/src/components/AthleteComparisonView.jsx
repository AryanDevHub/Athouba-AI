import React, { useState, useEffect } from 'react';
import { GitCompare, Trophy, Award, MapPin, Activity, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AthleteComparisonView({ athletes, initialA1Id, initialA2Id }) {
  const [a1Id, setA1Id] = useState(initialA1Id || (athletes[0]?.id || 1));
  const [a2Id, setA2Id] = useState(initialA2Id || (athletes[1]?.id || 2));
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchComparison = async (id1, id2) => {
    if (!id1 || !id2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/compare?id1=${id1}&id2=${id2}`);
      const data = await res.json();
      setComparison(data);
    } catch (err) {
      console.error("Comparison error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (athletes.length >= 2) {
      fetchComparison(a1Id, a2Id);
    }
  }, [a1Id, a2Id]);

  if (!athletes || athletes.length < 2) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading athlete registry for comparison...</div>;
  }

  const athlete1 = athletes.find(a => a.id === parseInt(a1Id)) || athletes[0];
  const athlete2 = athletes.find(a => a.id === parseInt(a2Id)) || athletes[1];

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto 60px', padding: '24px' }}>
      
      {/* Official Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)', padding: '3px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
          <GitCompare size={14} /> YAS-01 TALENT IDENTIFICATION ENGINE • OBJECTIVE COHORT BENCHMARKING
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          AI Head-to-Head Athlete Comparison & Prospect Evaluation
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
          Compare performance match records, physical battery measurements, and AI prospect ratings across Manipur's talent pool.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="gov-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <label className="input-label">Select Athlete 1 (Candidate A)</label>
            <select 
              value={a1Id} 
              onChange={(e) => setA1Id(e.target.value)}
              className="input-field"
              style={{ fontWeight: 700 }}
            >
              {athletes.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.district}) — {a.primary_sport} [{a.khel_id}]</option>
              ))}
            </select>
          </div>

          <div style={{ textAlign: 'center', padding: '0 8px' }}>
            <span style={{ background: '#0284c7', color: '#fff', padding: '6px 12px', borderRadius: '50%', fontWeight: 900, fontSize: '0.8rem' }}>VS</span>
          </div>

          <div>
            <label className="input-label">Select Athlete 2 (Candidate B)</label>
            <select 
              value={a2Id} 
              onChange={(e) => setA2Id(e.target.value)}
              className="input-field"
              style={{ fontWeight: 700 }}
            >
              {athletes.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.district}) — {a.primary_sport} [{a.khel_id}]</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Computing comparative physical deltas and AI prospect analysis...
        </div>
      ) : comparison ? (
        <div>
          {/* AI Comparative Verdict Box */}
          <div className="gov-card" style={{
            padding: '20px 24px',
            marginBottom: '24px',
            borderLeft: '4px solid #0284c7',
            background: 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0284c7', fontWeight: 800, fontSize: '0.88rem' }}>
              <Sparkles size={16} /> Official AI Head-to-Head Scout Verdict
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 500 }}>
              {comparison.ai_comparison_verdict}
            </p>
          </div>

          {/* Side-by-Side Profiles Comparison Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            
            {/* Candidate 1 Card */}
            <div className="gov-card" style={{ padding: '24px', borderTop: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img 
                    src={athlete1.profile_photo_url || athlete1.media_url || '/demo_athlete.jpg'} 
                    alt={athlete1.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/demo_athlete.jpg';
                    }}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '2px solid #0284c7',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                      CANDIDATE A • {athlete1.grade}
                    </span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                      {athlete1.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Khel ID: <strong>{athlete1.khel_id}</strong> • {athlete1.district}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                      Club: {athlete1.current_club}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0284c7', lineHeight: 1 }}>
                    {athlete1.composite_score}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>TALENT SCORE</div>
                </div>
              </div>

              {/* Physical Metrics Breakdown */}
              <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  SAI BATTERY MEASUREMENTS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                  <div>Vertical Jump: <strong>{athlete1.vertical_jump_cm} cm</strong></div>
                  <div>30m Sprint: <strong>{athlete1.sprint_30m_sec} s</strong></div>
                  <div>VO2 Beep Test: <strong>Lvl {athlete1.beep_test_level}</strong></div>
                  <div>Flexibility: <strong>{athlete1.flexibility_cm} cm</strong></div>
                  <div>Height / Weight: <strong>{athlete1.height_cm}cm / {athlete1.weight_kg}kg</strong></div>
                  <div>Wingspan: <strong>{athlete1.wingspan_cm} cm</strong></div>
                </div>
              </div>

              {/* Match / Tournament History */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  RECENT MATCH / COMPETITION RECORDS
                </div>
                {athlete1.match_history?.slice(0, 3).map((m, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-card)', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, gap: '6px' }}>
                      <span style={{ color: '#0f172a' }}>{m.tournament}</span>
                      <span style={{
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: m.result.includes('Won') || m.result.includes('GOLD') ? 'rgba(16, 185, 129, 0.12)' : m.result.includes('SILVER') ? 'rgba(2, 132, 199, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                        color: m.result.includes('Won') || m.result.includes('GOLD') ? '#047857' : m.result.includes('SILVER') ? '#0369a1' : '#475569',
                        border: m.result.includes('Won') || m.result.includes('GOLD') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(2, 132, 199, 0.3)'
                      }}>
                        {m.result}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'monospace' }}>{m.date}</span> vs <strong>{m.opponent}</strong> • {m.stat}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate 2 Card */}
            <div className="gov-card" style={{ padding: '24px', borderTop: '4px solid #ea580c' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img 
                    src={athlete2.profile_photo_url || athlete2.media_url || '/demo_athlete.jpg'} 
                    alt={athlete2.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/demo_athlete.jpg';
                    }}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '2px solid #ea580c',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
                      CANDIDATE B • {athlete2.grade}
                    </span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                      {athlete2.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Khel ID: <strong>{athlete2.khel_id}</strong> • {athlete2.district}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                      Club: {athlete2.current_club}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ea580c', lineHeight: 1 }}>
                    {athlete2.composite_score}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>TALENT SCORE</div>
                </div>
              </div>

              {/* Physical Metrics Breakdown */}
              <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  SAI BATTERY MEASUREMENTS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                  <div>Vertical Jump: <strong>{athlete2.vertical_jump_cm} cm</strong></div>
                  <div>30m Sprint: <strong>{athlete2.sprint_30m_sec} s</strong></div>
                  <div>VO2 Beep Test: <strong>Lvl {athlete2.beep_test_level}</strong></div>
                  <div>Flexibility: <strong>{athlete2.flexibility_cm} cm</strong></div>
                  <div>Height / Weight: <strong>{athlete2.height_cm}cm / {athlete2.weight_kg}kg</strong></div>
                  <div>Wingspan: <strong>{athlete2.wingspan_cm} cm</strong></div>
                </div>
              </div>

              {/* Match / Tournament History */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  RECENT MATCH / COMPETITION RECORDS
                </div>
                {athlete2.match_history?.slice(0, 3).map((m, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-card)', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, gap: '6px' }}>
                      <span style={{ color: '#0f172a' }}>{m.tournament}</span>
                      <span style={{
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: m.result.includes('Won') || m.result.includes('GOLD') ? 'rgba(16, 185, 129, 0.12)' : m.result.includes('SILVER') ? 'rgba(2, 132, 199, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                        color: m.result.includes('Won') || m.result.includes('GOLD') ? '#047857' : m.result.includes('SILVER') ? '#0369a1' : '#475569',
                        border: m.result.includes('Won') || m.result.includes('GOLD') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(2, 132, 199, 0.3)'
                      }}>
                        {m.result}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'monospace' }}>{m.date}</span> vs <strong>{m.opponent}</strong> • {m.stat}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Comparative Deltas Table */}
          <div className="gov-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Direct Metric Differential Table
            </div>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Test Parameter</th>
                  <th>{athlete1.name} (Candidate A)</th>
                  <th>{athlete2.name} (Candidate B)</th>
                  <th>Advantage Delta</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sargent Vertical Jump</td>
                  <td>{athlete1.vertical_jump_cm} cm</td>
                  <td>{athlete2.vertical_jump_cm} cm</td>
                  <td style={{ fontWeight: 700, color: athlete1.vertical_jump_cm >= athlete2.vertical_jump_cm ? '#0284c7' : '#ea580c' }}>
                    {athlete1.vertical_jump_cm >= athlete2.vertical_jump_cm ? `Candidate A (+${roundDiff(athlete1.vertical_jump_cm, athlete2.vertical_jump_cm)} cm)` : `Candidate B (+${roundDiff(athlete2.vertical_jump_cm, athlete1.vertical_jump_cm)} cm)`}
                  </td>
                </tr>
                <tr>
                  <td>30m Sprint (Speed)</td>
                  <td>{athlete1.sprint_30m_sec} s</td>
                  <td>{athlete2.sprint_30m_sec} s</td>
                  <td style={{ fontWeight: 700, color: athlete1.sprint_30m_sec <= athlete2.sprint_30m_sec ? '#0284c7' : '#ea580c' }}>
                    {athlete1.sprint_30m_sec <= athlete2.sprint_30m_sec ? `Candidate A (-${roundDiff(athlete2.sprint_30m_sec, athlete1.sprint_30m_sec)} s faster)` : `Candidate B (-${roundDiff(athlete1.sprint_30m_sec, athlete2.sprint_30m_sec)} s faster)`}
                  </td>
                </tr>
                <tr>
                  <td>Beep Test Aerobic VO2</td>
                  <td>Level {athlete1.beep_test_level}</td>
                  <td>Level {athlete2.beep_test_level}</td>
                  <td style={{ fontWeight: 700, color: athlete1.beep_test_level >= athlete2.beep_test_level ? '#0284c7' : '#ea580c' }}>
                    {athlete1.beep_test_level >= athlete2.beep_test_level ? `Candidate A (+${roundDiff(athlete1.beep_test_level, athlete2.beep_test_level)} lvl)` : `Candidate B (+${roundDiff(athlete2.beep_test_level, athlete1.beep_test_level)} lvl)`}
                  </td>
                </tr>
                <tr>
                  <td>AI Breakthrough Prospect Rating</td>
                  <td>{athlete1.ai_prospect_rating} / 100</td>
                  <td>{athlete2.ai_prospect_rating} / 100</td>
                  <td style={{ fontWeight: 700, color: athlete1.ai_prospect_rating >= athlete2.ai_prospect_rating ? '#0284c7' : '#ea580c' }}>
                    {athlete1.ai_prospect_rating >= athlete2.ai_prospect_rating ? `Candidate A (+${roundDiff(athlete1.ai_prospect_rating, athlete2.ai_prospect_rating)} pts)` : `Candidate B (+${roundDiff(athlete2.ai_prospect_rating, athlete1.ai_prospect_rating)} pts)`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Multi-Sport Performance & Tactical Telemetry Comparison */}
          <div className="gov-card" style={{ padding: '20px', marginTop: '20px', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#10b981" /> Discipline-Specific Match & Performance Telemetry
            </div>

            {/* WEIGHTLIFTING */}
            {(athlete1.primary_sport === 'Weightlifting' || athlete2.primary_sport === 'Weightlifting') && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Snatch Lift Record (kg)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.best_snatch_kg || 'N/A'} kg</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.best_snatch_kg || 'N/A'} kg</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Clean & Jerk Record (kg)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.best_clean_and_jerk_kg || 'N/A'} kg</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.best_clean_and_jerk_kg || 'N/A'} kg</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Olympic Lift & Sinclair Coeff
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.best_total_kg || 'N/A'} kg (Sinclair: {athlete1.season_stats?.sinclair_coefficient})</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.best_total_kg || 'N/A'} kg (Sinclair: {athlete2.season_stats?.sinclair_coefficient})</span>
                  </div>
                </div>
              </div>
            )}

            {/* BOXING */}
            {(athlete1.primary_sport === 'Boxing' || athlete2.primary_sport === 'Boxing') && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Bout Record & Stoppages
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.bouts_record || 'N/A'} ({athlete1.season_stats?.knockouts_stoppages || 0} KOs)</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.bouts_record || 'N/A'} ({athlete2.season_stats?.knockouts_stoppages || 0} KOs)</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Strike Accuracy %
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.strike_accuracy_pct || 65}%</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.strike_accuracy_pct || 65}%</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Punches Output / Minute
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.punch_output_per_min || 58} strikes/min</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.punch_output_per_min || 56} strikes/min</span>
                  </div>
                </div>
              </div>
            )}

            {/* ARCHERY */}
            {(athlete1.primary_sport === 'Archery' || athlete2.primary_sport === 'Archery') && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Personal Best (720 Round)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.personal_best_720 || 670} / 720</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.personal_best_720 || 665} / 720</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Tens & X-Ring Hits
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.tens_and_x_count || 32} Tens & Xs</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.tens_and_x_count || 30} Tens & Xs</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Arrow Grouping Precision
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.arrow_grouping_radius_mm || 34} mm radius</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.arrow_grouping_radius_mm || 36} mm radius</span>
                  </div>
                </div>
              </div>
            )}

            {/* SEPAK TAKRAW */}
            {(athlete1.primary_sport === 'Sepak Takraw' || athlete2.primary_sport === 'Sepak Takraw') && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Regu Specialization
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.takraw_role || 'Spiker'}</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.takraw_role || 'Tekong'}</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Spike Kill Conversion %
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.spike_kill_pct || 82}%</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.spike_kill_pct || 80}%</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Service Aces & Blocks
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.service_aces || 18} Aces / {athlete1.season_stats?.block_points || 12} Blocks</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.service_aces || 16} Aces / {athlete2.season_stats?.block_points || 10} Blocks</span>
                  </div>
                </div>
              </div>
            )}

            {/* JUDO & MARTIAL ARTS */}
            {(athlete1.primary_sport.includes('Judo') || athlete2.primary_sport.includes('Judo') || athlete1.primary_sport.includes('Wushu') || athlete2.primary_sport.includes('Wushu')) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Weight Division
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.weight_category || '57kg Division'}</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.weight_category || '52kg Division'}</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Ippon Direct Win Rate %
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.ippon_win_rate_pct || 82}%</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.ippon_win_rate_pct || 78}%</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Groundwork (Ne-waza) Defense %
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.groundwork_ne_waza_defense_pct || 91}%</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.groundwork_ne_waza_defense_pct || 88}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* FIELD HOCKEY */}
            {(athlete1.primary_sport === 'Field Hockey' || athlete2.primary_sport === 'Field Hockey') && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Hockey Position
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.hockey_position || 'Midfielder'}</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.hockey_position || 'Defender'}</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Goals & PC Conversions
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.goals_scored || 8} Goals ({athlete1.season_stats?.penalty_corners_converted || 4} PCs)</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.goals_scored || 6} Goals ({athlete2.season_stats?.penalty_corners_converted || 3} PCs)</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Aerial Pass Accuracy %
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.aerial_pass_accuracy_pct || 84}%</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.aerial_pass_accuracy_pct || 82}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTBALL */}
            {(athlete1.primary_sport === 'Football' || athlete2.primary_sport === 'Football') && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Passing Accuracy %
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.name.split(' ')[0]}: {athlete1.season_stats?.passing_accuracy_pct || 82}%</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.name.split(' ')[0]}: {athlete2.season_stats?.passing_accuracy_pct || 80}%</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Offensive Output / Expected Goals
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.goals || 0}G / {athlete1.season_stats?.assists || 0}A (xG {athlete1.season_stats?.expected_goals_xG || 0})</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.goals || 0}G / {athlete2.season_stats?.assists || 0}A (xG {athlete2.season_stats?.expected_goals_xG || 0})</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Top Sprint Speed (km/h)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    <span style={{ color: '#0284c7' }}>{athlete1.season_stats?.top_sprint_speed_kmh || 32.2} km/h</span>
                    <span style={{ color: '#ea580c' }}>{athlete2.season_stats?.top_sprint_speed_kmh || 31.8} km/h</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : null}

    </div>
  );
}

function roundDiff(a, b) {
  return Math.abs(Math.round((a - b) * 100) / 100);
}
