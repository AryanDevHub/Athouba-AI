import React, { useState } from 'react';
import { Award, Shield, User, Activity, Calendar, Zap, CheckCircle2, TrendingUp, Trophy, FileText, Dumbbell, Heart, Download, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function AthletePortal({ athleteData, onStartTest, onCompare }) {
  // Fallback to Mirabai Chanu if athleteData is null or generic
  const athlete = athleteData || {
    id: 1,
    name: "Saikhom Mirabai Chanu",
    khel_id: "KHEL-IND-MN-2014-WLT-0049",
    nsis_id: "NSIS-MN-71049",
    state_reg_no: "IWLF-IND-2013-MC49",
    age: 30,
    gender: "Female",
    district: "Imphal East",
    primary_sport: "Weightlifting",
    current_club: "SAI National Centre of Excellence (NCOE) Imphal",
    former_clubs: ["Khuman Lampak Sports Complex", "Nongpok Kakching Village Training Cell"],
    composite_score: 99.2,
    grade: "Grade A+",
    grade_title: "Olympic Podium Standard (Global Elite)",
    height_cm: 150.0,
    weight_kg: 49.0,
    wingspan_cm: 154.0,
    vertical_jump_cm: 68.0,
    sprint_30m_sec: 4.05,
    beep_test_level: 13.2,
    flexibility_cm: 28.0,
    benchmark_percentile: 99.8,
    achievements: "Tokyo Olympic Silver Medalist (49kg), World Weightlifting Champion, 2x Commonwealth Games Gold Medalist, Major Dhyan Chand Khel Ratna",
    radar_metrics: {
      explosive_power: 100,
      speed_agility: 88.0,
      endurance: 92.0,
      flexibility: 96.0,
      posture_technique: 98.0
    },
    match_history: [
      { date: "07 Aug 2024", tournament: "Paris 2024 Olympic Games", opponent: "International 49kg Field", result: "4th Place (199kg)", stat: "Snatch: 88kg | C&J: 111kg | Total: 199kg" },
      { date: "01 Apr 2024", tournament: "IWF World Cup (Phuket)", opponent: "Olympic Qualifier", result: "Qualified for Paris", stat: "Snatch: 81kg | C&J: 103kg | Total: 184kg" },
      { date: "30 Jul 2022", tournament: "Commonwealth Games (Birmingham)", opponent: "49kg Category", result: "GOLD MEDAL 🥇", stat: "Snatch: 88kg (GR) | C&J: 113kg (GR) | Total: 201kg (GR)" },
      { date: "06 Dec 2022", tournament: "World Weightlifting Championships (Bogota)", opponent: "49kg Category", result: "SILVER MEDAL 🥈", stat: "Snatch: 87kg | C&J: 113kg | Total: 200kg" },
      { date: "24 Jul 2021", tournament: "Tokyo 2020 Olympic Games", opponent: "49kg Category", result: "SILVER MEDAL 🥈", stat: "Snatch: 87kg | C&J: 115kg | Total: 202kg" }
    ],
    season_stats: {
      weight_category: "Women's 49kg",
      best_snatch_kg: 88.0,
      best_clean_and_jerk_kg: 119.0,
      best_total_kg: 205.0,
      sinclair_coefficient: 312.4
    }
  };

  const radarData = [
    { subject: 'Explosive Power', value: athlete.radar_metrics?.explosive_power || 98 },
    { subject: 'Speed / Agility', value: athlete.radar_metrics?.speed_agility || 88 },
    { subject: 'VO2 Endurance', value: athlete.radar_metrics?.endurance || 92 },
    { subject: 'Flexibility', value: athlete.radar_metrics?.flexibility || 96 },
    { subject: 'Postural Technique', value: athlete.radar_metrics?.posture_technique || 98 }
  ];

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* 🏅 Top Athlete Banner */}
      <div className="glass-card" style={{
        padding: '28px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(15, 23, 42, 0.02) 100%)',
        border: '1px solid var(--border-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={athlete.profile_photo_url || '/athletes/mirabai_chanu.jpg'} 
              alt={athlete.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/demo_athlete.jpg';
              }}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #10B981',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#10B981',
              color: '#fff',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              border: '2px solid #fff'
            }}>✓</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: '#10B981', color: '#ffffff', fontWeight: 800 }}>
                ● VERIFIED NATIONAL CADET
              </span>
              <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                TOPS CORE SQUAD
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                NSIS: {athlete.nsis_id}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {athlete.name}
            </h1>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span>🏋️ {athlete.primary_sport} ({athlete.season_stats?.weight_category || "Olympic Squad"})</span>
              <span>•</span>
              <span>📍 {athlete.district}, Manipur</span>
              <span>•</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                Khel ID: {athlete.khel_id}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={onStartTest}
            className="btn-primary" 
            style={{ padding: '9px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Activity size={16} /> Submit Test (Form K-01)
          </button>
          <button 
            onClick={() => window.print()}
            className="btn-secondary" 
            style={{ padding: '9px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} /> Download Passport PDF
          </button>
        </div>
      </div>

      {/* 🏛️ TOPS Scheme & Ministry Scholarship Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Target Olympic Podium Scheme (TOPS)
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
            Core Olympic Group
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> Active & Compliant for LA 2028
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Monthly MYAS Out-of-Pocket Allowance
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
            ₹50,000 / month
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Disbursed via PFMS Direct Benefit Transfer
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #ea580c' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            National Assessment Composite Score
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ea580c', marginTop: '4px' }}>
            {athlete.composite_score} / 100 ({athlete.grade})
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Rank #{athlete.peer_rank || 1} in Manipur Regional Pool ({athlete.benchmark_percentile}th %ile)
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Current High-Performance Training Base
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            SAI NCOE Takyelpat / STC Imphal
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Chief Coach: Dronacharya L. Ibomcha Singh
          </div>
        </div>
      </div>

      {/* 📊 Main Split: Biometric Passport vs Verified Competition Records */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.35fr)', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left: Biometric Passport & Physical Battery Scores */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#0284c7" /> Biometric Fitness Passport
            </h3>
            <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
              SAI BATTERY K-01
            </span>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border-card)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-muted)" />
                <Radar name="Fitness DNA" dataKey="value" stroke="#0284c7" fill="#0284c7" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Biometric Scores Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stature & Bodyweight</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {athlete.height_cm} cm / {athlete.weight_kg} kg
              </div>
            </div>
            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sargent Vertical Jump</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {athlete.vertical_jump_cm} cm
              </div>
            </div>
            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>30m Acceleration Sprint</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {athlete.sprint_30m_sec} sec
              </div>
            </div>
            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Multistage Beep Test</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Level {athlete.beep_test_level}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Verified Real-World Competition & Medal Timeline */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={18} color="#f59e0b" /> Verified Competition & Medal History
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
              ● Official Federation Verified
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(athlete.match_history || []).map((m, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-card)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{m.date}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>{m.tournament}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {m.stat}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  background: m.result.includes('GOLD') || m.result.includes('WON') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                  color: m.result.includes('GOLD') || m.result.includes('WON') ? '#10b981' : '#0284c7',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  {m.result}
                </div>
              </div>
            ))}
          </div>

          {/* Career Lifts / Stats */}
          {athlete.season_stats?.best_clean_and_jerk_kg && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Personal Best Snatch</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f59e0b' }}>{athlete.season_stats.best_snatch_kg} kg</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Personal Best Clean & Jerk</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f59e0b' }}>{athlete.season_stats.best_clean_and_jerk_kg} kg</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Best (Competition)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f59e0b' }}>{athlete.season_stats.best_total_kg} kg</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📅 NCOE Training Schedule & AI Biomechanics Feedback */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Weekly Training Regimen */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calendar size={18} color="#059669" /> SAI NCOE Imphal Weekly Training Regimen
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #0284c7' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Mon / Wed / Fri — Morning (06:30 - 09:30)</div>
              <div style={{ color: 'var(--text-secondary)' }}>Olympic Snatch high-pulls, heavy front squats (90% 1RM), thoracic mobility drills.</div>
            </div>
            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Tue / Thu / Sat — Evening (16:00 - 18:30)</div>
              <div style={{ color: 'var(--text-secondary)' }}>Clean & Jerk split jerk balance, eccentric posterior chain strengthening, hydrotherapy pool recovery.</div>
            </div>
            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Sunday — Active Recovery & Sports Science Check</div>
              <div style={{ color: 'var(--text-secondary)' }}>Biomechanical video review with SAI STC biomechanist & nutritional body composition DEXA scan.</div>
            </div>
          </div>
        </div>

        {/* Gemini AI Biomechanics Feedback */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Zap size={18} color="#8b5cf6" /> AI Biomechanics Kinematics Analysis
          </h3>

          <div style={{
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '0.83rem',
            color: 'var(--text-primary)',
            lineHeight: '1.5'
          }}>
            <div style={{ fontWeight: 800, color: '#8b5cf6', marginBottom: '4px' }}>
              Kinematic Posture Assessment:
            </div>
            Bilateral hip-to-shoulder symmetry registered at <strong>92.0%</strong> during snatch receiving phase. Barbell vertical displacement velocity exceeds 1.82 m/s, meeting world championship baseline. Recommend maintaining active thoracic extension during deep overhead recovery to minimize lumbar stress.
          </div>

          <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => onCompare && onCompare(athlete.id)}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            >
              Compare with Peers <ArrowUpRight size={14} />
            </button>
            <button 
              onClick={onStartTest}
              className="btn-primary"
              style={{ flex: 1, padding: '8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            >
              Update Fitness Test <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
