import React, { useState } from 'react';
import { ShieldCheck, Award, Target, Activity, Zap, Info, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function BenchmarkStandards() {
  const [selectedGender, setSelectedGender] = useState('Male');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('15-17');

  const benchmarks = {
    'Male': {
      '12-14': [
        { test: '30m Acceleration Sprint', metric: 'Speed', top1: '< 4.10s', top5: '< 4.30s', top10: '< 4.50s', avg: '4.85s', unit: 'Seconds' },
        { test: 'Standing Vertical Jump', metric: 'Explosive Power', top1: '> 58 cm', top5: '> 52 cm', top10: '> 48 cm', avg: '38 cm', unit: 'cm' },
        { test: 'Multistage Beep Test (VO2)', metric: 'Aerobic Endurance', top1: '> Level 12.0', top5: '> Level 10.5', top10: '> Level 9.5', avg: 'Level 7.5', unit: 'Level' },
        { test: '4x10m Shuttle Run', metric: 'Agility', top1: '< 9.80s', top5: '< 10.20s', top10: '< 10.60s', avg: '11.40s', unit: 'Seconds' },
        { test: 'Sit & Reach Flexibility', metric: 'Mobility', top1: '> 28 cm', top5: '> 24 cm', top10: '> 20 cm', avg: '14 cm', unit: 'cm' },
        { test: 'Push-ups in 60s', metric: 'Upper Body Strength', top1: '> 42 reps', top5: '> 36 reps', top10: '> 30 reps', avg: '20 reps', unit: 'Reps' },
      ],
      '15-17': [
        { test: '30m Acceleration Sprint', metric: 'Speed', top1: '< 3.85s', top5: '< 4.02s', top10: '< 4.18s', avg: '4.55s', unit: 'Seconds' },
        { test: 'Standing Vertical Jump', metric: 'Explosive Power', top1: '> 70 cm', top5: '> 64 cm', top10: '> 58 cm', avg: '46 cm', unit: 'cm' },
        { test: 'Multistage Beep Test (VO2)', metric: 'Aerobic Endurance', top1: '> Level 14.5', top5: '> Level 13.0', top10: '> Level 11.5', avg: 'Level 9.0', unit: 'Level' },
        { test: '4x10m Shuttle Run', metric: 'Agility', top1: '< 9.20s', top5: '< 9.60s', top10: '< 9.95s', avg: '10.80s', unit: 'Seconds' },
        { test: 'Sit & Reach Flexibility', metric: 'Mobility', top1: '> 32 cm', top5: '> 27 cm', top10: '> 23 cm', avg: '16 cm', unit: 'cm' },
        { test: 'Push-ups in 60s', metric: 'Upper Body Strength', top1: '> 54 reps', top5: '> 46 reps', top10: '> 40 reps', avg: '28 reps', unit: 'Reps' },
      ],
      '18-21': [
        { test: '30m Acceleration Sprint', metric: 'Speed', top1: '< 3.75s', top5: '< 3.90s', top10: '< 4.05s', avg: '4.38s', unit: 'Seconds' },
        { test: 'Standing Vertical Jump', metric: 'Explosive Power', top1: '> 76 cm', top5: '> 70 cm', top10: '> 65 cm', avg: '52 cm', unit: 'cm' },
        { test: 'Multistage Beep Test (VO2)', metric: 'Aerobic Endurance', top1: '> Level 15.5', top5: '> Level 14.0', top10: '> Level 12.8', avg: 'Level 10.2', unit: 'Level' },
        { test: '4x10m Shuttle Run', metric: 'Agility', top1: '< 8.85s', top5: '< 9.25s', top10: '< 9.60s', avg: '10.35s', unit: 'Seconds' },
        { test: 'Sit & Reach Flexibility', metric: 'Mobility', top1: '> 35 cm', top5: '> 30 cm', top10: '> 25 cm', avg: '18 cm', unit: 'cm' },
        { test: 'Push-ups in 60s', metric: 'Upper Body Strength', top1: '> 62 reps', top5: '> 52 reps', top10: '> 45 reps', avg: '34 reps', unit: 'Reps' },
      ]
    },
    'Female': {
      '12-14': [
        { test: '30m Acceleration Sprint', metric: 'Speed', top1: '< 4.30s', top5: '< 4.50s', top10: '< 4.70s', avg: '5.10s', unit: 'Seconds' },
        { test: 'Standing Vertical Jump', metric: 'Explosive Power', top1: '> 50 cm', top5: '> 45 cm', top10: '> 40 cm', avg: '32 cm', unit: 'cm' },
        { test: 'Multistage Beep Test (VO2)', metric: 'Aerobic Endurance', top1: '> Level 10.5', top5: '> Level 9.2', top10: '> Level 8.2', avg: 'Level 6.5', unit: 'Level' },
        { test: '4x10m Shuttle Run', metric: 'Agility', top1: '< 10.20s', top5: '< 10.65s', top10: '< 11.00s', avg: '11.85s', unit: 'Seconds' },
        { test: 'Sit & Reach Flexibility', metric: 'Mobility', top1: '> 32 cm', top5: '> 27 cm', top10: '> 23 cm', avg: '17 cm', unit: 'cm' },
        { test: 'Push-ups in 60s', metric: 'Upper Body Strength', top1: '> 32 reps', top5: '> 26 reps', top10: '> 20 reps', avg: '14 reps', unit: 'Reps' },
      ],
      '15-17': [
        { test: '30m Acceleration Sprint', metric: 'Speed', top1: '< 4.05s', top5: '< 4.22s', top10: '< 4.38s', avg: '4.80s', unit: 'Seconds' },
        { test: 'Standing Vertical Jump', metric: 'Explosive Power', top1: '> 62 cm', top5: '> 56 cm', top10: '> 50 cm', avg: '38 cm', unit: 'cm' },
        { test: 'Multistage Beep Test (VO2)', metric: 'Aerobic Endurance', top1: '> Level 12.8', top5: '> Level 11.5', top10: '> Level 10.2', avg: 'Level 8.0', unit: 'Level' },
        { test: '4x10m Shuttle Run', metric: 'Agility', top1: '< 9.60s', top5: '< 10.05s', top10: '< 10.40s', avg: '11.20s', unit: 'Seconds' },
        { test: 'Sit & Reach Flexibility', metric: 'Mobility', top1: '> 36 cm', top5: '> 31 cm', top10: '> 26 cm', avg: '20 cm', unit: 'cm' },
        { test: 'Push-ups in 60s', metric: 'Upper Body Strength', top1: '> 42 reps', top5: '> 34 reps', top10: '> 28 reps', avg: '18 reps', unit: 'Reps' },
      ],
      '18-21': [
        { test: '30m Acceleration Sprint', metric: 'Speed', top1: '< 3.95s', top5: '< 4.12s', top10: '< 4.28s', avg: '4.65s', unit: 'Seconds' },
        { test: 'Standing Vertical Jump', metric: 'Explosive Power', top1: '> 68 cm', top5: '> 61 cm', top10: '> 55 cm', avg: '42 cm', unit: 'cm' },
        { test: 'Multistage Beep Test (VO2)', metric: 'Aerobic Endurance', top1: '> Level 13.8', top5: '> Level 12.4', top10: '> Level 11.0', avg: 'Level 8.8', unit: 'Level' },
        { test: '4x10m Shuttle Run', metric: 'Agility', top1: '< 9.30s', top5: '< 9.75s', top10: '< 10.10s', avg: '10.90s', unit: 'Seconds' },
        { test: 'Sit & Reach Flexibility', metric: 'Mobility', top1: '> 38 cm', top5: '> 33 cm', top10: '> 28 cm', avg: '22 cm', unit: 'cm' },
        { test: 'Push-ups in 60s', metric: 'Upper Body Strength', top1: '> 48 reps', top5: '> 38 reps', top10: '> 32 reps', avg: '22 reps', unit: 'Reps' },
      ]
    }
  };

  const currentTable = benchmarks[selectedGender]?.[selectedAgeGroup] || [];

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto 60px', padding: '0 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.25)', color: '#0284c7', padding: '3px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
          <ShieldCheck size={14} /> OFFICIAL NATIONAL REFERENCE • NSTSS / KITI NORMATIVE DATA
        </div>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Sports Authority of India (SAI) Physical Battery Benchmarks
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '840px', margin: 0, lineHeight: 1.5 }}>
          Official age and gender-normalized percentile cutoffs used by the AI4Seva scoring engine. This mathematical calibration ensures grassroots youth from rural hill districts are evaluated objectively against nationwide standards.
        </p>
      </div>

      {/* Selector Controls */}
      <div className="gov-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)' }}>GENDER:</span>
          {['Male', 'Female'].map(g => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={selectedGender === g ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px' }}
            >
              {g}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)' }}>AGE BRACKET:</span>
          {['12-14', '15-17', '18-21'].map(a => (
            <button
              key={a}
              onClick={() => setSelectedAgeGroup(a)}
              className={selectedAgeGroup === a ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px' }}
            >
              {a} Years
            </button>
          ))}
        </div>
      </div>

      {/* Percentile Normative Table */}
      <div className="gov-card" style={{ padding: '24px', overflowX: 'auto', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-card)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 14px' }}>Physical Test Parameter</th>
              <th style={{ padding: '12px 14px' }}>Target Athletic Attribute</th>
              <th style={{ padding: '12px 14px', color: '#10b981' }}>Top 1% (Elite TOPS Caliber)</th>
              <th style={{ padding: '12px 14px', color: '#0284c7' }}>Top 5% (Priority Breakthrough)</th>
              <th style={{ padding: '12px 14px', color: '#ea580c' }}>Top 10% (State Academy Standard)</th>
              <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>National Population Average</th>
            </tr>
          </thead>
          <tbody>
            {currentTable.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-card)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)' }}>
                <td style={{ padding: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {row.test}
                </td>
                <td style={{ padding: '14px' }}>
                  <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
                    {row.metric}
                  </span>
                </td>
                <td style={{ padding: '14px', fontWeight: 900, color: '#10b981', fontFamily: 'monospace', fontSize: '0.92rem' }}>
                  {row.top1}
                </td>
                <td style={{ padding: '14px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                  {row.top5}
                </td>
                <td style={{ padding: '14px', fontWeight: 700, color: '#ea580c', fontFamily: 'monospace' }}>
                  {row.top10}
                </td>
                <td style={{ padding: '14px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {row.avg}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Official SAI Normative Guidance Notes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="gov-card" style={{ padding: '18px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#10b981', marginBottom: '6px' }}>
            Top 1% Tier: National Residential Academy
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Cadets meeting Top 1% physical test cutoffs are automatically flagged for SAI National Centre of Excellence (NCOE) residential academy scholarships under the Target Olympic Podium Scheme (TOPS) Junior development pipeline.
          </p>
        </div>

        <div className="gov-card" style={{ padding: '18px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0284c7', marginBottom: '6px' }}>
            Top 5% Tier: Priority Rural Breakthrough
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Athletes from hill districts (Churachandpur, Ukhrul, Tamenglong) with Top 5% parameters in explosive power or sprint acceleration are highlighted directly to coaches, even if they lack formal academy coaching.
          </p>
        </div>

        <div className="gov-card" style={{ padding: '18px', borderLeft: '4px solid #ea580c' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ea580c', marginBottom: '6px' }}>
            Cross-Discipline Sport Transfer
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            The AI engine maps these attribute clusters into Olympic sport profiles. For example, high vertical jump with compact height maps to Weightlifting, while high ape index maps to Boxing, Archery, and Combat disciplines.
          </p>
        </div>
      </div>

    </div>
  );
}
