import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MapPin, Award, Trophy, Users, BarChart2, RefreshCw, 
  ShieldCheck, Download, ChevronRight, GitCompare, Sparkles, CheckCircle2, 
  Send, UserCheck, Flame, Zap, Eye, Calendar
} from 'lucide-react';
import AthleteDetailModal from './AthleteDetailModal';
import ManipurTalentMap from './ManipurTalentMap';

const MANIPUR_DISTRICTS = [
  "All", "Imphal East", "Imphal West", "Bishnupur", "Churachandpur",
  "Thoubal", "Ukhrul", "Kakching", "Senapati", "Tamenglong", "Chandel", "Kangpokpi"
];

const MANIPUR_SPORTS = [
  "All", "Weightlifting", "Boxing", "Football", "Archery", "Field Hockey", "Sepak Takraw", "Judo & Combat Sports"
];

export default function ScoutDashboard({ onSelectAthlete, onCompareAthlete }) {
  const [athletes, setAthletes] = useState([]);
  const [allAthletes, setAllAthletes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [district, setDistrict] = useState("All");
  const [sport, setSport] = useState("All");
  const [ageGroup, setAgeGroup] = useState("All"); // "All", "U-14", "U-17", "U-21", "Senior"
  const [percentileTier, setPercentileTier] = useState("All"); // "All", "top1", "top5", "top10"
  const [superpower, setSuperpower] = useState("All"); // "All", "jump", "sprint", "hill_prospects"
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("composite_score");

  // Shortlisted Cadets for Residential Camp
  const [shortlistedIds, setShortlistedIds] = useState([1, 2]); // pre-shortlist Mirabai & Mary Kom for demo
  const [notification, setNotification] = useState(null);

  const fetchAthletes = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      // Fetch matching cohort across state without district constraint so the map shows full distribution
      if (sport !== "All") queryParams.append("sport", sport);
      if (search) queryParams.append("search", search);
      queryParams.append("sort_by", sortBy);

      const res = await fetch(`/api/athletes?${queryParams.toString()}`);
      let data = await res.json();

      // Client-side filtering for fine-grained Age and Percentile Tiers
      if (ageGroup !== "All") {
        data = data.filter(a => {
          if (ageGroup === "U-14") return a.age <= 14;
          if (ageGroup === "U-17") return a.age >= 15 && a.age <= 17;
          if (ageGroup === "U-21") return a.age >= 18 && a.age <= 21;
          if (ageGroup === "Senior") return a.age > 21;
          return true;
        });
      }

      if (percentileTier !== "All") {
        data = data.filter(a => {
          if (percentileTier === "top1") return a.composite_score >= 88;
          if (percentileTier === "top5") return a.composite_score >= 82;
          if (percentileTier === "top10") return a.composite_score >= 76;
          return true;
        });
      }

      if (superpower !== "All") {
        data = data.filter(a => {
          if (superpower === "jump") return a.vertical_jump_cm >= 62;
          if (superpower === "sprint") return a.sprint_30m_sec <= 4.05;
          if (superpower === "hill_prospects") return ["Churachandpur", "Ukhrul", "Tamenglong", "Senapati", "Chandel", "Kangpokpi"].includes(a.district);
          return true;
        });
      }

      // Preserve statewide cohort matching current sport and filters for the map
      setAllAthletes(data);

      // Filter by active district selection for the card feed
      const filteredByDistrict = district === "All" ? data : data.filter(a => a.district === district);
      setAthletes(filteredByDistrict);
    } catch (err) {
      console.error("Failed to fetch athletes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics`);
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  useEffect(() => {
    fetchAthletes();
    fetchAnalytics();
  }, [district, sport, ageGroup, percentileTier, superpower, search, sortBy]);

  const handleToggleShortlist = (athlete) => {
    const isAlready = shortlistedIds.includes(athlete.id);
    if (isAlready) {
      setShortlistedIds(prev => prev.filter(x => x !== athlete.id));
      setNotification(`Removed ${athlete.name} from Assessment Camp Shortlist.`);
    } else {
      setShortlistedIds(prev => [...prev, athlete.id]);
      setNotification(`✓ Official Camp Invite Dispatched: ${athlete.name} shortlisted for 5-Day Residential Assessment Camp at SAI NCOE Imphal!`);
    }
    setTimeout(() => setNotification(null), 4500);
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto 60px', padding: '0 24px' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#071526',
          border: '1px solid #10b981',
          color: '#fff',
          padding: '14px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.86rem',
          maxWidth: '520px'
        }}>
          <CheckCircle2 color="#10b981" size={20} />
          <span>{notification}</span>
        </div>
      )}

      {/* Official Government Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.25)', color: '#0284c7', padding: '3px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <ShieldCheck size={14} /> SAI NCOE IMPHAL • COACH TALENT DISCOVERY PORTAL (YAS-01)
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px' }}>
            Grassroots Scouting Heatmap & Qualified Coach Discovery
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Discover and evaluate tested athletes across Manipur's 10 districts based on objective fitness batteries, movement symmetry, and AI prospect ratings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 800 }}>
            <UserCheck size={16} /> Shortlisted for Assessment Camp: {shortlistedIds.length} Cadets
          </div>

          <button onClick={fetchAthletes} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
            <RefreshCw size={13} /> Refresh Stream
          </button>
        </div>
      </div>

      {/* Multi-Filter Bar: Percentile Tiers, Superpowers, Districts, Sports */}
      <div className="gov-card" style={{ padding: '18px 22px', marginBottom: '24px' }}>
        
        {/* Row 1: Percentile Tier & Superpower Quick Toggles */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--border-card)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={14} color="#ea580c" /> PERCENTILE TIER:
          </span>
          {[
            { id: 'All', label: 'All Percentiles' },
            { id: 'top1', label: 'Top 1% Elite (TOPS Caliber)' },
            { id: 'top5', label: 'Top 5% Priority Breakthrough' },
            { id: 'top10', label: 'Top 10% State Standard' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPercentileTier(p.id)}
              style={{
                background: percentileTier === p.id ? '#0284c7' : 'var(--bg-primary)',
                color: percentileTier === p.id ? '#fff' : 'var(--text-secondary)',
                border: percentileTier === p.id ? '1px solid #0284c7' : '1px solid var(--border-card)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}

          <span style={{ margin: '0 6px', color: 'var(--border-card)' }}>|</span>

          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} color="#10b981" /> SUPERPOWER:
          </span>
          {[
            { id: 'All', label: 'All' },
            { id: 'jump', label: 'Top Vertical Jump (>62cm)' },
            { id: 'sprint', label: 'Sub-4.05s Sprint Speed' },
            { id: 'hill_prospects', label: 'Hill District Prospects' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSuperpower(s.id)}
              style={{
                background: superpower === s.id ? '#10b981' : 'var(--bg-primary)',
                color: superpower === s.id ? '#fff' : 'var(--text-secondary)',
                border: superpower === s.id ? '1px solid #10b981' : '1px solid var(--border-card)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Row 2: Standard Filter Dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search cadet, Khel ID, club..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '34px', fontSize: '0.82rem' }}
            />
          </div>

          {/* District Filter */}
          <div>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="input-field" style={{ fontSize: '0.82rem' }}>
              {MANIPUR_DISTRICTS.map(d => (
                <option key={d} value={d}>District: {d}</option>
              ))}
            </select>
          </div>

          {/* Sport Filter */}
          <div>
            <select value={sport} onChange={(e) => setSport(e.target.value)} className="input-field" style={{ fontSize: '0.82rem' }}>
              {MANIPUR_SPORTS.map(s => (
                <option key={s} value={s}>Sport: {s}</option>
              ))}
            </select>
          </div>

          {/* Age Group Filter */}
          <div>
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="input-field" style={{ fontSize: '0.82rem' }}>
              <option value="All">Age: All Categories</option>
              <option value="U-14">Under-14 Cadet</option>
              <option value="U-17">Under-17 Youth</option>
              <option value="U-21">Under-21 Junior</option>
              <option value="Senior">Senior (22+)</option>
            </select>
          </div>

          {/* Sort By Mode */}
          <div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>
              <option value="composite_score">Sort: SAI Talent Index</option>
              <option value="ai_prospect_rating">Sort: Breakthrough Potential</option>
            </select>
          </div>
        </div>

      </div>

      {/* 🗺️ Interactive Manipur State Talent Mini Map & Grassroots Radar */}
      <ManipurTalentMap
        athletes={allAthletes.length > 0 ? allAthletes : athletes}
        selectedDistrict={district}
        onSelectDistrict={setDistrict}
        selectedSport={sport}
        onSelectSport={setSport}
        onSelectAthlete={onSelectAthlete}
      />

      {/* Discovery Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
          Showing <strong>{athletes.length}</strong> identified athletes matching scouting criteria
        </div>
      </div>

      {/* Athletes Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Running scouting queries across state registry...
        </div>
      ) : athletes.length === 0 ? (
        <div className="gov-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          No athlete records found matching your selected criteria. Try adjusting your filters.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
          gap: '20px'
        }}>
          {athletes.map(athlete => {
            const isShortlisted = shortlistedIds.includes(athlete.id);
            const poseMetrics = athlete.pose_metrics || {};
            const symmetry = poseMetrics.symmetry_score || 93.4;

            return (
              <div 
                key={athlete.id}
                className="gov-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `3px solid ${athlete.badge_color || '#0284c7'}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Top Header Strip */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img 
                        src={athlete.profile_photo_url || athlete.media_url || '/demo_athlete.jpg'} 
                        alt={athlete.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/demo_athlete.jpg';
                        }}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: `2px solid ${athlete.badge_color ? athlete.badge_color + '60' : 'var(--border-card)'}`,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          flexShrink: 0
                        }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                          {athlete.name}
                        </h3>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={11} color="#059669" /> {athlete.district} • {athlete.age}y ({athlete.gender})
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 950, color: athlete.badge_color || '#0284c7', lineHeight: 1 }}>
                        {athlete.composite_score}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        {athlete.grade}
                      </div>
                    </div>
                  </div>

                  {/* Khel ID & Verification Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', background: 'var(--bg-primary)', padding: '6px 10px', borderRadius: '6px', marginBottom: '12px' }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                      {athlete.khel_id}
                    </span>
                    <span className="badge" style={{
                      background: athlete.verified_by_sai ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 88, 12, 0.15)',
                      color: athlete.verified_by_sai ? '#10b981' : '#ea580c',
                      fontSize: '0.64rem'
                    }}>
                      {athlete.verified_by_sai ? '✓ UIDAI / Video Verified' : 'Self-Assessed'}
                    </span>
                  </div>

                  {/* Physical Key Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px', textAlign: 'center' }}>
                    <div style={{ background: 'var(--bg-primary)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>V-JUMP</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>{athlete.vertical_jump_cm} cm</div>
                    </div>
                    <div style={{ background: 'var(--bg-primary)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>30M SPRINT</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>{athlete.sprint_30m_sec} s</div>
                    </div>
                    <div style={{ background: 'var(--bg-primary)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>BEEP TEST</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>L-{athlete.beep_test_level}</div>
                    </div>
                  </div>

                  {/* AI Scout Recommendation Badge */}
                  <div style={{ background: 'rgba(2, 132, 199, 0.06)', border: '1px solid rgba(2, 132, 199, 0.2)', padding: '8px 10px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.74rem' }}>
                    <span style={{ fontWeight: 800, color: '#0284c7' }}>AI Scout Note: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Top {Math.max(1, Math.round(100 - athlete.benchmark_percentile))}% {athlete.primary_sport} prospective ceiling with {symmetry}% movement symmetry.
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-card)' }}>
                  <button
                    onClick={() => onSelectAthlete(athlete)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '8px 10px', fontSize: '0.76rem', justifyContent: 'center' }}
                  >
                    <Eye size={13} />  Dossier
                  </button>

                  <button
                    onClick={() => handleToggleShortlist(athlete)}
                    style={{
                      flex: 1.2,
                      background: isShortlisted ? 'rgba(16, 185, 129, 0.15)' : '#0284c7',
                      color: isShortlisted ? '#10b981' : '#fff',
                      border: isShortlisted ? '1px solid #10b981' : '1px solid #0284c7',
                      padding: '8px 10px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    {isShortlisted ? (
                      <>✓ Shortlisted</>
                    ) : (
                      <><Send size={12} /> Invite to Camp</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
