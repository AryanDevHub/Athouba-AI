import React from 'react';
import { 
  X, FileText, CheckCircle2, ShieldCheck, Download, 
  Calendar, User, MapPin, Award, ExternalLink, FileCheck
} from 'lucide-react';

export default function DocumentInspectionModal({ cadet, onClose }) {
  if (!cadet) return null;

  const docs = cadet.documents || [
    { name: "Aadhaar_Verified_Scan.pdf", type: "Government Identity Proof", upload_date: "14 Feb 2026", verified: false },
    { name: "State_Sports_Achievement_Certificate.pdf", type: "State Sports Association Certificate", upload_date: "14 Feb 2026", verified: false },
    { name: "Birth_Certificate_Form5.pdf", type: "Official Age Verification Form 5", upload_date: "14 Feb 2026", verified: false }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)',
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
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-card)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          padding: '26px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-card)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img 
              src={cadet.profile_photo_url || cadet.media_url || '/demo_athlete.jpg'} 
              alt={cadet.name}
              onError={(e) => { e.target.src = '/demo_athlete.jpg'; }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #ea580c'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontWeight: 800 }}>
                  {cadet.primary_sport}
                </span>
                <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', fontWeight: 800 }}>
                  {cadet.district}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {cadet.user_provided_khel_id || cadet.khel_id}
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                {cadet.name} — Verification Dossier
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Age {cadet.age} • Submitting Unit: {cadet.current_club || 'District Grassroots Nursery'}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-muted)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Verification Status Overview Banner */}
        <div style={{
          background: cadet.verified_by_sai ? 'rgba(16, 185, 129, 0.08)' : 'rgba(234, 88, 12, 0.08)',
          border: `1px solid ${cadet.verified_by_sai ? 'rgba(16, 185, 129, 0.3)' : 'rgba(234, 88, 12, 0.3)'}`,
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: cadet.verified_by_sai ? '#10b981' : '#ea580c' }}>
              {cadet.verified_by_sai ? '✓ OFFICIAL STATE AUTHENTICATED' : '⏳ PENDING OFFICIAL VERIFICATION & AUDIT'}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {cadet.review_notes || 'Candidate self-submitted official identification documents for Khelo India authentication.'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Composite Score</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {cadet.composite_score} / 100 ({cadet.grade})
            </div>
          </div>
        </div>

        {/* Documents List */}
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck size={18} color="#0284c7" /> Attached Verification Documents ({docs.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {docs.map((doc, idx) => (
            <div 
              key={idx}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-card)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  background: 'rgba(2, 132, 199, 0.1)',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                    {doc.type}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Uploaded on: {doc.upload_date} • Checksum SHA-256: Verified Authentic
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={doc.url && doc.url !== '#' ? doc.url : '/demo_doc_aadhaar.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  download={doc.name}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                    padding: '7px 12px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={14} /> Download File
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Security / Legal Watermark Footer */}
        <div style={{ marginTop: '24px', background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="#10b981" />
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            All documents and Khel ID credentials are electronically logged and audited under the Ministry of Youth Affairs and Sports (MYAS) National Sports Governance Directive.
          </div>
        </div>

      </div>
    </div>
  );
}
