import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, FileText, CheckCircle2, XCircle, AlertTriangle, Download, RefreshCw, Building2, MapPin, BarChart3, Users, Clock, Eye, FileCheck } from 'lucide-react';
import DocumentInspectionModal from './DocumentInspectionModal';

export default function AdminPortal({ onSelectAthlete }) {
  const [pendingCadets, setPendingCadets] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvedIds, setApprovedIds] = useState([]);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [selectedCadetForDocs, setSelectedCadetForDocs] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadData = () => {
    setLoading(true);
    // Fetch pending registrations
    fetch('/api/admin/pending-registrations')
      .then(res => res.json())
      .then(data => {
        setPendingCadets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Pending cadets err:", err);
        setLoading(false);
      });

    // Fetch district analytics
    fetch('/api/admin/district-analytics')
      .then(res => res.json())
      .then(data => {
        setDistrictData(data.districts_data || []);
      })
      .catch(err => console.error("District analytics err:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id, name) => {
    try {
      const res = await fetch(`/api/admin/approve-registration/${id}`, {
        method: 'POST'
      });
      const data = await res.json();
      setApprovedIds(prev => [...prev, id]);
      setNotification(`✓ Khel ID Verified & Authenticated for ${name} (${data.khel_id})`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      alert("Approval error: " + err.message);
    }
  };

  const handleReject = async (id, name) => {
    const reason = prompt(`Enter reason for flagging/rejecting registration for ${name}:`, "Biometric / Document verification discrepancy");
    if (!reason) return;
    try {
      const data = new FormData();
      data.append('reason', reason);
      const res = await fetch(`/api/admin/reject-registration/${id}`, {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      setRejectedIds(prev => [...prev, id]);
      setNotification(`⚠ Application for ${name} flagged: ${reason}`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      alert("Rejection error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* 🏛️ Top Directorate Header */}
      <div className="glass-card" style={{
        padding: '26px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(15, 23, 42, 0.02) 100%)',
        border: '1px solid var(--border-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669, #064e3b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '1.6rem',
            fontWeight: 900,
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
          }}>
            DY
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: '#059669', color: '#ffffff', fontWeight: 800 }}>
                ● APEX STATE GOVERNANCE
              </span>
              <span className="badge" style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.3)' }}>
                KHELO INDIA STATE NODAL AGENCY
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Directorate of Youth Affairs & Sports, Khuman Lampak
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              Directorate of Youth Affairs & Sports, Govt. of Manipur
            </h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Executive Talent Governance • Official Khel ID Authentication & District Resource Allocations
            </div>
          </div>
        </div>

        {/* Admin Quick Export Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.print()}
            className="btn-primary"
            style={{ padding: '9px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px', background: '#059669' }}
          >
            <Download size={16} /> Export MYAS Annual Report
          </button>
          <button 
            onClick={loadData}
            className="btn-secondary"
            style={{ padding: '9px 14px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} /> Refresh Registry
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#10b981',
          padding: '12px 18px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: 700,
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

      {/* 📊 State Governance KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Statewide Registered Khel IDs
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>
            1,482 Cadets
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Across all 10 Manipur districts (Valley + Hill)
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Hill District Penetration Rate
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>
            42.8% Coverage
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Target: 50% under Khelo India Hill Initiative
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            KISCE Complex Utilization
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b', marginTop: '2px' }}>
            94.2% Capacity
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Khuman Lampak Main Stadium & Takyelpat
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Annual MYAS Khelo India Grant
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#8b5cf6', marginTop: '2px' }}>
            ₹14.85 Crore
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            76.3% Utilized (Audited under PFMS)
          </div>
        </div>
      </div>

      {/* 📋 Section 1: Official Khel ID Approval & Verification Queue */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={19} color="#ea580c" /> Official Khel ID Approval & Verification Queue
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Grassroots cadets registered by district associations requiring state authorization before issuance of verified Khel ID.
            </p>
          </div>
          <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', fontWeight: 800 }}>
            {pendingCadets.length} Pending State Review
          </span>
        </div>

        {pendingCadets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            All submitted applications have been authenticated by the Directorate.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pendingCadets.map(cadet => {
              const isApproved = approvedIds.includes(cadet.id);
              const isRejected = rejectedIds.includes(cadet.id);
              return (
                <div 
                  key={cadet.id}
                  style={{
                    background: isApproved ? 'rgba(16, 185, 129, 0.08)' : (isRejected ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-primary)'),
                    border: isApproved ? '1px solid #10b981' : (isRejected ? '1px solid #ef4444' : '1px solid var(--border-card)'),
                    padding: '18px 20px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img 
                      src={cadet.profile_photo_url || cadet.media_url || '/demo_athlete.jpg'} 
                      alt={cadet.name} 
                      onError={(e) => { e.target.src = '/demo_athlete.jpg'; }}
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '50%', 
                        objectFit: 'cover', 
                        border: '2px solid #ea580c',
                        flexShrink: 0
                      }} 
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)' }}>{cadet.name}</span>
                        <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>{cadet.primary_sport}</span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Age {cadet.age} • {cadet.district}</span>
                        {cadet.user_provided_khel_id && (
                          <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                            Khel ID: {cadet.user_provided_khel_id}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <strong>Submitting Unit:</strong> {cadet.current_club} • <strong>Achievements:</strong> {cadet.achievements}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'monospace' }}>
                        Application Ref: {cadet.khel_id} • Score: {cadet.composite_score}/100 ({cadet.grade}) • AI Prospect: {cadet.ai_prospect_rating}/100
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setSelectedCadetForDocs(cadet)}
                      style={{
                        background: 'rgba(2, 132, 199, 0.1)',
                        color: '#0284c7',
                        border: '1px solid rgba(2, 132, 199, 0.3)',
                        padding: '7px 12px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileCheck size={14} /> Documents ({cadet.documents?.length || 0})
                    </button>

                    <button
                      onClick={() => onSelectAthlete && onSelectAthlete(cadet)}
                      style={{
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-card)',
                        padding: '7px 12px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={14} /> Profile Dossier
                    </button>

                    {isApproved ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 800, fontSize: '0.82rem', padding: '6px 10px' }}>
                        <CheckCircle2 size={16} /> AUTHENTICATED
                      </div>
                    ) : isRejected ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 800, fontSize: '0.82rem', padding: '6px 10px' }}>
                        <XCircle size={16} /> REJECTED / FLAGGED
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(cadet.id, cadet.name)}
                          className="btn-primary"
                          style={{ padding: '7px 14px', fontSize: '0.78rem', background: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <CheckCircle2 size={14} /> Approve & Issue Khel ID
                        </button>
                        <button
                          onClick={() => handleReject(cadet.id, cadet.name)}
                          className="btn-secondary"
                          style={{ padding: '7px 12px', fontSize: '0.78rem', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                        >
                          Flag / Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🗺️ Section 2: 10-District Talent & Infrastructure Heatmap */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Building2 size={19} color="#0284c7" /> Manipur 10-District Talent & Infrastructure Matrix
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '2px solid var(--border-card)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>District</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Geography</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Registered Cadets</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Average Battery</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Key Infrastructure Hub</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Annual State Grant</th>
              </tr>
            </thead>
            <tbody>
              {districtData.map((d, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-card)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    📍 {d.district}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="badge" style={{
                      background: d.region_type === 'Hill' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(2, 132, 199, 0.12)',
                      color: d.region_type === 'Hill' ? '#8b5cf6' : '#0284c7'
                    }}>
                      {d.region_type} District
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {d.registered_cadets} Active Cadets
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#10b981' }}>
                    {d.avg_talent_score} / 100
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {d.infrastructure}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{d.state_budget_cr} Cr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📄 Document Inspection Modal */}
      {selectedCadetForDocs && (
        <DocumentInspectionModal
          cadet={selectedCadetForDocs}
          onClose={() => setSelectedCadetForDocs(null)}
        />
      )}

    </div>
  );
}
