import React, { useState, useEffect } from 'react';
import { X, Database, Key, CheckCircle, ExternalLink, ShieldCheck, Info } from 'lucide-react';

export default function ApiDocumentationModal({ isOpen, onClose }) {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/sports-apis/info')
        .then(res => res.json())
        .then(data => setApiData(data))
        .catch(err => console.error("API Info error:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="gov-card" style={{
        width: '100%',
        maxWidth: '840px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative'
      }}>
        {/* Close */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Database size={14} /> LIVE SPORTS DATA INTEGRATION & API ACCESS SPECIFICATION
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            Sports Data APIs & Khelo India Registry Protocols
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            Official architecture disclosure on data sources, open endpoints, registration requirements, and API keys.
          </p>
        </div>

        {/* Overview Box */}
        <div style={{ background: 'var(--bg-primary)', padding: '14px 18px', borderRadius: '8px', marginBottom: '22px', borderLeft: '4px solid #0284c7', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          <strong>Architecture Note:</strong> AI4Seva ingests match logs, club histories, and competition results through standardized sports schemas. For the hackathon demonstration, real-world match and lift records are synchronized locally in our SQLite repository so the portal runs with zero latency even during network outages.
        </div>

        {/* APIs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {apiData?.apis?.map((api, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-card)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 800, textTransform: 'uppercase' }}>
                    {api.sport}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {api.provider}
                  </h4>
                </div>

                <div style={{
                  background: api.registration_required ? 'rgba(234, 88, 12, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                  color: api.registration_required ? '#ea580c' : '#059669',
                  border: `1px solid ${api.registration_required ? 'rgba(234, 88, 12, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {api.registration_required ? 'Requires Free API Registration' : 'Open / Public Access'}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <strong>Key Endpoints:</strong> {api.endpoints_supported?.join(', ')}
              </div>

              {api.free_tier && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <strong>Rate Limits / Quota:</strong> {api.free_tier}
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                <CheckCircle size={12} color="#059669" /> Status in AI4Seva: {api.integration_status}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '22px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
            Close Specification
          </button>
        </div>

      </div>
    </div>
  );
}
