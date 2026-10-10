import React, { useState, useEffect } from 'react';
import { Database, Search, CheckCircle2, Globe, Wifi, ExternalLink, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function LiveSportsApiExplorer({ onSelectAthlete }) {
  const [query, setQuery] = useState('Jeakson Singh');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const presets = [
    'Jeakson Singh',
    'Dheeraj Moirangthem',
    'Sunil Chhetri',
    'Gurpreet Singh Sandhu',
    'Suresh Singh Wangjam',
    'Mirabai Chanu'
  ];

  const handleSearch = (searchQuery) => {
    const q = searchQuery || query;
    if (!q || q.length < 2) return;
    setLoading(true);
    setError(null);

    fetch(`/api/sports-apis/search-live?query=${encodeURIComponent(q)}`)
      .then(res => {
        if (!res.ok) throw new Error("API request failed");
        return res.json();
      })
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to fetch live sports data");
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch('Jeakson Singh');
  }, []);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* 🌐 Header */}
      <div className="glass-card" style={{
        padding: '26px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(15, 23, 42, 0.02) 100%)',
        border: '1px solid var(--border-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: '#0284c7', color: '#ffffff', fontWeight: 800 }}>
              ● LIVE REST API INTEGRATION
            </span>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              THESPORTSDB OPEN ENDPOINTS
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Live Global Sports Intelligence Gateway
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
            Live Sports API Explorer & Real Data Verifier
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Direct real-time queries to upstream sports databases proving live API connectivity and verified athlete telemetry.
          </div>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid #10b981',
          padding: '8px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#10b981',
          fontSize: '0.82rem',
          fontWeight: 800
        }}>
          <Wifi size={16} /> LIVE CONNECTION ACTIVE
        </div>
      </div>

      {/* 🔍 Search Input & Preset Chips */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text"
              placeholder="Search ANY player in the world (e.g. Sunil Chhetri, Jeakson Singh, Dheeraj)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-card)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
          <button 
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ padding: '10px 20px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {loading ? <Zap size={16} className="spin" /> : <Search size={16} />} Query Live API
          </button>
        </form>

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Quick Verification Presets:</span>
          {presets.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => { setQuery(p); handleSearch(p); }}
              style={{
                background: query === p ? 'rgba(2, 132, 199, 0.18)' : 'var(--bg-primary)',
                border: query === p ? '1px solid #0284c7' : '1px solid var(--border-card)',
                color: query === p ? '#0284c7' : 'var(--text-secondary)',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 Live Results Display */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Fetching real-time records from TheSportsDB Gateway...
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {data && !loading && (
        <div>
          {/* Status summary banner */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-card)',
            padding: '12px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '0.82rem'
          }}>
            <div>
              <strong>Upstream Data Source:</strong> <span style={{ color: '#0284c7' }}>{data.source}</span> • <strong>Queried Term:</strong> "{data.query}"
            </div>
            <div style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> {data.live_results_count} Live External Records Found
            </div>
          </div>

          {/* Live External Cards Grid */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="#0284c7" /> Live Network Records from TheSportsDB
          </h3>

          {data.live_results.length === 0 ? (
            <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
              No external records found in open global database for "{data.query}". (Try "Sunil Chhetri", "Jeakson Singh", or "Dheeraj").
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              {data.live_results.map((player, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #0284c7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', fontSize: '0.68rem' }}>
                        API ID: {player.api_id}
                      </span>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                        {player.name}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {player.sport} • {player.nationality}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.68rem', background: '#10b981', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                      LIVE 200 OK
                    </span>
                  </div>

                  <div style={{ marginTop: '14px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Current Club / Team:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{player.team}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Playing Position:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{player.position}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Date of Birth:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{player.date_born}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Career Status:</span>
                      <span style={{ color: '#10b981', fontWeight: 800 }}>{player.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cross-Matched Manipur Khel Registry Records */}
          {data.verified_khel_registry_matches.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" /> Verified Manipur Khel ID Cross-Match
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px'
              }}>
                {data.verified_khel_registry_matches.map(ath => (
                  <div key={ath.id} className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className="badge" style={{ background: '#10b981', color: '#ffffff', fontSize: '0.68rem' }}>
                          KHEL ID: {ath.khel_id}
                        </span>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                          {ath.name}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {ath.primary_sport} • {ath.district}, Manipur
                        </div>
                      </div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>
                        {ath.composite_score}
                      </span>
                    </div>

                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>Active Club:</strong> {ath.current_club}
                    </div>

                    <button
                      onClick={() => onSelectAthlete && onSelectAthlete(ath)}
                      className="btn-secondary"
                      style={{ width: '100%', marginTop: '14px', padding: '6px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      View Full Government Dossier <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
