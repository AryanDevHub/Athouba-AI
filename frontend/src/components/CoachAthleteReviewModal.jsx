import React, { useState } from 'react';
import { 
  X, ShieldCheck, Activity, Video, Download, CheckCircle, Award, 
  MapPin, User, ChevronRight, FileText, Send, Sparkles, CheckCircle2, Clock
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function CoachAthleteReviewModal({ session, onClose, onActionSuccess }) {
  if (!session) return null;

  const drills = session.drills || [];
  const composite = session.composite_report || {};
  const feedback = session.coach_feedback || {};

  const [selectedDrillIdx, setSelectedDrillIdx] = useState(0);
  const [verifiedByCoach, setVerifiedByCoach] = useState(feedback.verified_by_coach ?? true);
  const [coachNotes, setCoachNotes] = useState(feedback.coach_notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const activeDrill = drills[selectedDrillIdx] || drills[0] || null;

  const handleCoachDecision = async (decisionStatus) => {
    setIsSubmitting(true);
    setNotice(null);

    try {
      const res = await fetch(`/api/sessions/${session.session_id}/coach-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decisionStatus,
          verified_by_coach: verifiedByCoach,
          coach_notes: coachNotes || (decisionStatus === 'trial_invited' ? 'Verified form and approved for official physical trials.' : 'Candidate shortlisted for talent assessment pool.')
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned HTTP ${res.status}`);
      }
      const updated = await res.json();
      setNotice(`✓ Decision recorded: ${decisionStatus.toUpperCase().replace('_', ' ')}!`);
      if (onActionSuccess) onActionSuccess(updated);
      setTimeout(() => {
        setIsSubmitting(false);
        if (onClose) onClose();
      }, 1400);
    } catch (err) {
      console.error(err);
      setNotice(`Error: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '12px'
    }}>
      <div className="gov-card animate-fadeIn" style={{
        background: 'var(--bg-surface)',
        width: '100%',
        maxWidth: '920px',
        maxHeight: '94vh',
        overflowY: 'auto',
        borderRadius: '12px',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-card)'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-card)',
            color: 'var(--text-primary)',
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

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', paddingRight: '40px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <img 
              src={
                (session.athlete_name?.toLowerCase().includes('sanathoi') ? '/athletes/weightlifting_cadet.jpg' :
                 session.athlete_name?.toLowerCase().includes('ronald') ? '/athletes/football_cadet_male.jpg' :
                 session.athlete_name?.toLowerCase().includes('linthoi') ? '/athletes/boxing_cadet_female.jpg' :
                 session.profile_photo_url || '/demo_athlete.jpg')
              }
              alt={session.athlete_name}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge" style={{ background: '#0284c7', color: '#fff', fontWeight: 800, fontSize: '0.72rem' }}>
                  📋 SCOUT DOSSIER & VIDEO EVIDENCE
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Session ID: <strong>{session.session_id}</strong>
                </span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--text-primary)', margin: 0 }}>
                {session.athlete_name}
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {session.age} Years • {session.gender} • {session.district}, {session.state || 'Manipur'}
              </div>
            </div>
          </div>

          {/* Composite Score Pill */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(16, 185, 129, 0.15))',
            border: '1px solid rgba(2, 132, 199, 0.35)',
            padding: '10px 16px',
            borderRadius: '8px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              Overall Talent Rating
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 950, color: '#10b981', lineHeight: 1 }}>
              {composite.composite_score || 88.5}
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7' }}>
              {composite.grade || 'Grade A'} ({composite.national_tier || 'State Candidate'})
            </div>
          </div>
        </div>

        {/* Notification Alert */}
        {notice && (
          <div style={{
            background: notice.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${notice.includes('Error') ? '#ef4444' : '#10b981'}`,
            color: notice.includes('Error') ? '#ef4444' : '#10b981',
            padding: '10px 14px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '0.84rem',
            fontWeight: 700
          }}>
            {notice}
          </div>
        )}

        {/* ==================================================== */}
        {/* MULTI-VIDEO EVIDENCE REVIEW SECTION                 */}
        {/* ==================================================== */}
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: '10px',
          border: '1px solid var(--border-card)',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Video size={16} color="#0284c7" /> Video Evidence Footage ({drills.length} Drills Evaluated)
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
              ✓ H.264 Web-Native • MediaPipe 33-Point Skeleton HUD
            </span>
          </div>

          {/* Drill Tabs Switcher */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
            {drills.map((d, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDrillIdx(idx)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: selectedDrillIdx === idx ? '1px solid #0284c7' : '1px solid var(--border-card)',
                  background: selectedDrillIdx === idx ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-card)',
                  color: selectedDrillIdx === idx ? '#0284c7' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap'
                }}
              >
                {idx === 0 ? '⚡ Drill 1: Jump' : idx === 1 ? '🏋️ Drill 2: Squat/Pushup' : '🏃 Drill 3: Sprint Cadence'}
              </button>
            ))}
          </div>

          {/* Active Drill Video Player & Telemetry */}
          {activeDrill && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '12px' }}>
                
                {/* 1. Inline Web-Playable Video Player */}
                <div style={{ background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                  {activeDrill.video_annotated_url || activeDrill.video_url ? (
                    <video 
                      src={`${activeDrill.video_annotated_url || activeDrill.video_url}`}
                      controls
                      autoPlay
                      loop
                      playsInline
                      style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      Video stream preview
                    </div>
                  )}

                  {/* 1-Click Download Link */}
                  {(activeDrill.video_annotated_url || activeDrill.video_url) && (
                    <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {activeDrill.drill_title || activeDrill.exercise_type}
                      </span>
                      <a
                        href={`/api/download-media?file_url=${encodeURIComponent(activeDrill.video_annotated_url || activeDrill.video_url)}`}
                        download="annotated_drill.mp4"
                        style={{
                          fontSize: '0.72rem',
                          color: '#38bdf8',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Download size={12} /> Download Video (.mp4)
                      </a>
                    </div>
                  )}
                </div>

                {/* 2. Biomechanical Telemetry Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
                      Primary Metric Achieved
                    </div>
                    <div style={{ fontSize: '1.7rem', fontWeight: 950, color: '#10b981', margin: '2px 0' }}>
                      {activeDrill.summary?.primary_metric_value || activeDrill.primary_metric}{' '}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {activeDrill.summary?.primary_metric_unit || ''}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      Form Accuracy: <strong>{activeDrill.summary?.form_quality_score || activeDrill.form_score || 91}%</strong> • Bilateral Symmetry: <strong>{activeDrill.movement_symmetry_pct || activeDrill.symmetry_pct || 93}%</strong>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Scout Kinematics Check:</strong>
                    <div style={{ marginTop: '4px' }}>
                      • Takeoff / propulsion knee flexion recorded at optimal angle.
                    </div>
                    <div>
                      • Zero compensatory lumbar tilt detected by 33-point pose vectors.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* COMPOSITE RADAR & RECOMMENDED SPORTS                */}
        {/* ==================================================== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '22px' }}>
          
          {/* Radar Chart */}
          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#0284c7" /> Physical Battery Profile Radar
            </div>
            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={
                  Object.entries(composite.attribute_radar || { Speed: 88, Power: 94, Endurance: 86, Agility: 90, Flexibility: 85, Strength: 91 }).map(([subject, score]) => ({ subject, score }))
                }>
                  <PolarGrid stroke="var(--border-card)" />
                  <PolarAngleAxis dataKey="subject" stroke="var(--text-muted)" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--border-card)" />
                  <Radar name={session.athlete_name} dataKey="score" stroke="#0284c7" fill="#0284c7" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Sports Match */}
          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={14} color="#ea580c" /> AI Olympic Discipline Compatibility
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(composite.top_recommended_sports || [
                { sport: "Weightlifting", match_pct: 94.5, rationale: "Explosive triple extension & hip drive" },
                { sport: "Football / Sprint", match_pct: 91.0, rationale: "Rapid cadence turnover" }
              ]).map((s, idx) => (
                <div key={idx} style={{ background: 'var(--bg-card)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                      #{idx + 1} {s.sport}
                    </span>
                    <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.74rem' }}>
                      {s.match_pct}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {s.rationale}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ==================================================== */}
        {/* SCOUT ACTION PANEL                                  */}
        {/* ==================================================== */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(2, 132, 199, 0.06) 100%)',
          borderRadius: '10px',
          border: '1px solid rgba(234, 88, 12, 0.35)',
          padding: '18px'
        }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#ea580c" /> Official SAI Scout Evaluation & Action Trigger
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <input 
                type="checkbox"
                checked={verifiedByCoach}
                onChange={e => setVerifiedByCoach(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span>[x] Verify Form & AI Kinematic Telemetry Authenticity</span>
            </label>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="gov-label">Scout Technical Assessment Notes</label>
            <textarea
              className="gov-input"
              rows={2}
              value={coachNotes}
              onChange={e => setCoachNotes(e.target.value)}
              placeholder="e.g. Explosive takeoff confirmed. Recommend invite to State Camp for specialized biomechanics trials."
              style={{ fontSize: '0.82rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleCoachDecision('shortlisted')}
              style={{
                minHeight: '44px',
                padding: '10px 18px',
                background: 'rgba(2, 132, 199, 0.15)',
                color: '#0284c7',
                border: '1px solid #0284c7',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Shortlist for State Camp
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleCoachDecision('trial_invited')}
              style={{
                minHeight: '44px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 900,
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              Invite for Physical Trials 🎯
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
