import React from 'react';
import { Activity, ShieldCheck, Trophy, ArrowRight, CheckCircle2, ChevronRight, Award } from 'lucide-react';

export default function Hero({ onStartAssess, onExploreScout, onOpenBenchmarks }) {
  return (
    <section style={{ padding: '20px 16px 28px', maxWidth: '1380px', margin: '0 auto' }}>
      
      {/* 🇮🇳 Official Problem Statement Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderLeft: '4px solid #1e3a8a',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#1e3a8a',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.68rem',
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.4px'
          }}>
            MISSION YAS-01
          </span>
          <span style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
            <strong>National Problem Statement:</strong> Identifying grassroots sports talent who merit assessment by qualified coaches using objective fitness measurements and motion kinematics.
          </span>
        </div>

        <button 
          onClick={onOpenBenchmarks}
          style={{
            background: 'none',
            border: 'none',
            color: '#1e3a8a',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          View National SAI Benchmarks <ChevronRight size={14} />
        </button>
      </div>

      {/* Main Action Showcase Grid: 2 Primary User Journeys */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        
        {/* CARD 1: Athlete / Citizen Journey */}
        <div 
          className="gov-card animate-fadeIn"
          style={{
            padding: '26px',
            borderTop: '4px solid #1e3a8a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge" style={{ background: '#eff6ff', color: '#1e3a8a', fontWeight: 800 }}>
                ATHLETE PORTAL
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Open to All Grassroots Youth
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginBottom: '10px', lineHeight: 1.3 }}>
              Physical Fitness Battery & Talent Passport
            </h2>

            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '18px' }}>
              Record standard field tests (vertical jump, bodyweight squats, 30m sprint). Computer vision analyzes keypoint kinematics and normalizes your scores against nationwide SAI standards.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px', fontSize: '0.8rem', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#15803d" /> Age & Gender Normalized National Percentile
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#15803d" /> Fitness Attribute Radar (Speed, Power, Mobility)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#15803d" /> Top 3 Recommended Sports Matched by Benchmark
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#15803d" /> Direct Routing to SAI Mentor Coach
              </div>
            </div>
          </div>

          <button 
            onClick={onStartAssess}
            className="btn-primary" 
            style={{ 
              padding: '12px 20px', 
              fontSize: '0.88rem', 
              fontWeight: 800,
              width: '100%'
            }}
          >
            <Activity size={18} /> Start Assessment <ArrowRight size={16} />
          </button>
        </div>

        {/* CARD 2: Coach / Scout Discovery Journey */}
        <div 
          className="gov-card animate-fadeIn"
          style={{
            padding: '26px',
            borderTop: '4px solid #15803d',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge" style={{ background: '#f0fdf4', color: '#15803d', fontWeight: 800 }}>
                SCOUT / COACH PORTAL
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                SAI NCOE & State Federation Desk
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginBottom: '10px', lineHeight: 1.3 }}>
              Grassroots Scouting & Trial Shortlist
            </h2>

            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '18px' }}>
              Filter tested youth by Sport, District, and Percentile Tier. Review video evidence and joint kinematics to invite top performers to residential assessment camps.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px', fontSize: '0.8rem', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#15803d" /> Filter by Top 1%, 5%, and 10% National Tiers
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#15803d" /> Hill District High-Potential Candidates Highlighted
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#15803d" /> Verified Video Evidence & Kinematics Inspection
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#15803d" /> 1-Click Action: Invite to Physical Assessment Camp
              </div>
            </div>
          </div>

          <button 
            onClick={onExploreScout}
            className="btn-primary" 
            style={{ 
              padding: '12px 20px', 
              fontSize: '0.88rem', 
              fontWeight: 800,
              background: '#15803d',
              borderColor: '#15803d',
              width: '100%'
            }}
          >
            <Trophy size={18} /> Open Coach Discovery Portal <ArrowRight size={16} />
          </button>
        </div>

      </div>

      {/* 🏛️ 3 Key Methodological Pillars Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '14px'
      }}>
        <div className="gov-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: '#eff6ff', color: '#1e3a8a' }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>1. Field Fitness Battery</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Sprint, Jump, Depth & Mobility</div>
          </div>
        </div>

        <div className="gov-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: '#eff6ff', color: '#1e3a8a' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>2. Movement Kinematics</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Joint angles & movement symmetry</div>
          </div>
        </div>

        <div className="gov-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: '#f0fdf4', color: '#15803d' }}>
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>3. Qualified Coach Action</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Direct invitations to assessment camps</div>
          </div>
        </div>
      </div>

    </section>
  );
}
