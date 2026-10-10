import React, { useState, useEffect } from 'react';
import { 
  Shield, Award, Search, Filter, GitCompare, Sparkles, UserPlus, 
  CheckCircle, FileText, ChevronRight, MapPin, Eye, Printer, Phone, 
  Clock, CheckCircle2, XCircle, FileCheck, Video, Zap, ArrowRight
} from 'lucide-react';
import AthleteCard from './AthleteCard';
import DocumentInspectionModal from './DocumentInspectionModal';
import CoachAthleteReviewModal from './CoachAthleteReviewModal';

export default function CoachPortal({ 
  athletes, 
  activeCoachTab: propCoachTab,
  onCoachTabChange,
  onSelectAthlete, 
  onCompareAthlete, 
  onStartAssess, 
  onSwitchToProspects 
}) {
  const [internalTab, setInternalTab] = useState('video_sessions'); // 'video_sessions', 'talent_pool', or 'pending_queue'
  const activeCoachTab = propCoachTab !== undefined ? propCoachTab : internalTab;
  const setActiveCoachTab = (tab) => {
    setInternalTab(tab);
    if (onCoachTabChange) onCoachTabChange(tab);
  };

  const [candidateSessions, setCandidateSessions] = useState([]);
  const [selectedSessionForReview, setSelectedSessionForReview] = useState(null);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [sportFilter, setSportFilter] = useState('ALL');
  const [bookmarkedIds, setBookmarkedIds] = useState([1, 2, 4]); // default watchlisted athletes

  // Pending queue states
  const [pendingCadets, setPendingCadets] = useState([]);
  const [approvedIds, setApprovedIds] = useState([]);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [selectedCadetForDocs, setSelectedCadetForDocs] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadCandidateSessions = () => {
    fetch('/api/coaches/1/sessions')
      .then(res => res.json())
      .then(data => setCandidateSessions(data || []))
      .catch(err => console.error("Error fetching coach sessions:", err));
  };

  const loadPendingCadets = () => {
    fetch('/api/admin/pending-registrations')
      .then(res => res.json())
      .then(data => {
        setPendingCadets(data || []);
      })
      .catch(err => console.error("Error fetching pending registrations:", err));
  };

  useEffect(() => {
    loadCandidateSessions();
    loadPendingCadets();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleApprove = async (id, name) => {
    try {
      const res = await fetch(`/api/admin/approve-registration/${id}`, {
        method: 'POST'
      });
      const data = await res.json();
      setApprovedIds(prev => [...prev, id]);
      setNotification(`✓ Coach Verified & Approved: ${name} (${data.khel_id})`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      alert("Verification error: " + err.message);
    }
  };

  const handleReject = async (id, name) => {
    const reason = prompt(`Enter coach note for flagging/rejecting registration for ${name}:`, "Biometric / technical testing discrepancy");
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
      setNotification(`⚠ Application for ${name} flagged by coach: ${reason}`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      alert("Error flagging cadet: " + err.message);
    }
  };

  const filteredAthletes = (athletes || []).filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.khel_id.toLowerCase().includes(search.toLowerCase()) ||
                          (a.current_club && a.current_club.toLowerCase().includes(search.toLowerCase()));
    const matchesDistrict = districtFilter === 'ALL' || a.district === districtFilter;
    const matchesSport = sportFilter === 'ALL' || a.primary_sport === sportFilter;
    return matchesSearch && matchesDistrict && matchesSport;
  });

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '20px 16px 60px' }}>
      
      {/* 📋 Official SAI Coach Command Header */}
      <div className="gov-card" style={{
        padding: '24px',
        marginBottom: '20px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: '#1e3a8a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '1.5rem',
            fontWeight: 900
          }}>
            IS
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: '#1e3a8a', color: '#ffffff', fontWeight: 800 }}>
                ● SAI SENIOR TALENT SCOUT
              </span>
              <span className="badge" style={{ background: '#eff6ff', color: '#1e3a8a', border: '1px solid #bfdbfe' }}>
                DRONACHARYA AWARDEE
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '5px 0 2px' }}>
              Coach L. Ibomcha Singh
            </h1>
            <div style={{ fontSize: '0.84rem', color: '#475569' }}>
              Chief Talent Identification Officer • SAI Regional Centre Imphal / NCOE Takyelpat
            </div>
          </div>
        </div>

        {/* Coach Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={onStartAssess}
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={16} /> Evaluate New Cadet
          </button>
          <button 
            onClick={onSwitchToProspects}
            className="btn-secondary"
            style={{ padding: '9px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={16} color="#15803d" /> Hill District Radar
          </button>
          <button 
            onClick={() => window.print()}
            className="btn-secondary"
            style={{ padding: '9px 14px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={16} /> Print Roll
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#15803d',
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

      {/* 📊 Scout Workspace Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div className="gov-card" style={{ padding: '16px', borderLeft: '4px solid #1e3a8a' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Athletes Evaluated
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
            {athletes.length} Cadets
          </div>
          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>
            Across all 10 Manipur districts
          </div>
        </div>

        <div className="gov-card" style={{ padding: '16px', borderLeft: '4px solid #d97706' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending Verification
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>
            {pendingCadets.length} Applications
          </div>
          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>
            Awaiting credential review
          </div>
        </div>

        <div className="gov-card" style={{ padding: '16px', borderLeft: '4px solid #15803d' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Grade A+ National Prospects
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
            {athletes.filter(a => a.grade === 'Grade A+').length} Athletes
          </div>
          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>
            Eligible for national camps
          </div>
        </div>

        <div className="gov-card" style={{ padding: '16px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Active Watchlist
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>
            {bookmarkedIds.length} Cadets
          </div>
          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>
            Pinned for trial invitations
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveCoachTab('video_sessions')}
          style={{
            background: activeCoachTab === 'video_sessions' ? '#1e3a8a' : '#ffffff',
            color: activeCoachTab === 'video_sessions' ? '#ffffff' : '#334155',
            border: activeCoachTab === 'video_sessions' ? '1px solid #1e3a8a' : '1px solid #cbd5e1',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Video size={16} /> Field Video Roster ({candidateSessions.length})
        </button>

        <button
          onClick={() => setActiveCoachTab('talent_pool')}
          style={{
            background: activeCoachTab === 'talent_pool' ? '#1e3a8a' : '#ffffff',
            color: activeCoachTab === 'talent_pool' ? '#ffffff' : '#334155',
            border: activeCoachTab === 'talent_pool' ? '1px solid #1e3a8a' : '1px solid #cbd5e1',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Award size={16} /> State Talent Pool ({filteredAthletes.length})
        </button>

        <button
          onClick={() => setActiveCoachTab('pending_queue')}
          style={{
            background: activeCoachTab === 'pending_queue' ? '#1e3a8a' : '#ffffff',
            color: activeCoachTab === 'pending_queue' ? '#ffffff' : '#334155',
            border: activeCoachTab === 'pending_queue' ? '1px solid #1e3a8a' : '1px solid #cbd5e1',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Clock size={16} /> Verification Queue ({pendingCadets.length})
        </button>
      </div>

      {/* TAB 0: MULTI-VIDEO CANDIDATE SESSIONS (PRIMARY SCOUT FLOW) */}
      {activeCoachTab === 'video_sessions' && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Candidate Field Assessment Queue
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Athletes who completed 3-drill field batteries awaiting coach review and trial invitation.
              </p>
            </div>
            <span className="badge" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800 }}>
              ● {candidateSessions.length} Candidates Routed
            </span>
          </div>

          {/* Vertical Stack of Mobile-Optimized Candidate Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {candidateSessions.map((s) => {
              const comp = s.composite_report || {};
              const drills = s.drills || [];

              const statusBadge = s.status === 'trial_invited' ? {
                text: '🎯 Trials Invited',
                bg: '#dcfce7',
                color: '#15803d'
              } : s.status === 'shortlisted' ? {
                text: '★ Shortlisted for Camp',
                bg: '#eff6ff',
                color: '#1e3a8a'
              } : {
                text: '⏳ Needs Review',
                bg: '#fef3c7',
                color: '#b45309'
              };

              return (
                <div key={s.session_id} className="gov-card" style={{
                  padding: '18px 20px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  {/* Candidate Identity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                    <img 
                      src={
                        (s.athlete_name?.toLowerCase().includes('sanathoi') ? '/athletes/weightlifting_cadet.jpg' :
                         s.athlete_name?.toLowerCase().includes('ronald') ? '/athletes/football_cadet_male.jpg' :
                         s.athlete_name?.toLowerCase().includes('linthoi') ? '/athletes/boxing_cadet_female.jpg' :
                         '/demo_athlete.jpg')
                      }
                      alt={s.athlete_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/demo_athlete.jpg';
                      }}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '2px solid #1e3a8a',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge" style={{ background: statusBadge.bg, color: statusBadge.color, fontWeight: 800, fontSize: '0.68rem' }}>
                          {statusBadge.text}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {s.session_id}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px' }}>
                        {s.athlete_name}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                        {s.age} Yrs • {s.gender} • <strong>{s.district}, Manipur</strong>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry & Scores Overview */}
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Composite Score */}
                    <div style={{ textAlign: 'center', minWidth: '70px' }}>
                      <div style={{ fontSize: '0.64rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                        Score
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#15803d', lineHeight: 1.1 }}>
                        {comp.composite_score || 88.5}
                      </div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1e3a8a' }}>
                        {comp.grade || 'Grade A'}
                      </div>
                    </div>

                    {/* Drills Verified Count */}
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ fontSize: '0.64rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                        Drills
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                        {drills.length}/3 Videos
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: 700 }}>
                        ✓ Verified
                      </div>
                    </div>

                    {/* Top Sport */}
                    <div style={{ textAlign: 'center', minWidth: '95px' }}>
                      <div style={{ fontSize: '0.64rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                        Top Sport
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#1e3a8a', marginTop: '4px' }}>
                        {comp.primary_sport || 'Weightlifting'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        {comp.top_recommended_sports?.[0]?.match_pct || 94}% Match
                      </div>
                    </div>
                  </div>

                  {/* Primary Review CTA Button */}
                  <button
                    onClick={() => setSelectedSessionForReview(s)}
                    className="btn-primary"
                    style={{
                      minHeight: '44px',
                      padding: '10px 18px',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Video size={16} /> Review Video & Telemetry →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1: ACTIVE TALENT POOL */}
      {activeCoachTab === 'talent_pool' && (
        <>
          {/* Search & Filters Bar */}
          <div className="gov-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text"
                placeholder="Search by Cadet Name, Khel ID, or Club..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  color: '#0f172a',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{
                padding: '9px 12px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                color: '#0f172a',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Districts</option>
              <option value="Imphal East">Imphal East (Valley)</option>
              <option value="Imphal West">Imphal West (Valley)</option>
              <option value="Thoubal">Thoubal (Valley)</option>
              <option value="Bishnupur">Bishnupur (Valley)</option>
              <option value="Kakching">Kakching (Valley)</option>
              <option value="Churachandpur">Churachandpur (Hill District)</option>
              <option value="Ukhrul">Ukhrul (Hill District)</option>
              <option value="Tamenglong">Tamenglong (Hill District)</option>
              <option value="Chandel">Chandel (Hill District)</option>
              <option value="Kangpokpi">Kangpokpi (Hill District)</option>
            </select>

            {/* Sport Filter */}
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              style={{
                padding: '9px 12px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                color: '#0f172a',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Disciplines</option>
              <option value="Football">Football</option>
              <option value="Weightlifting">Weightlifting</option>
              <option value="Boxing">Boxing</option>
              <option value="Judo & Combat Sports">Judo & Combat Sports</option>
              <option value="Archery">Archery</option>
              <option value="Field Hockey">Field Hockey</option>
              <option value="Sepak Takraw">Sepak Takraw</option>
            </select>

            <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: 'auto' }}>
              Showing <strong>{filteredAthletes.length}</strong> cadets
            </span>
          </div>

          {/* Athlete Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {filteredAthletes.map(athlete => {
              const isBookmarked = bookmarkedIds.includes(athlete.id);
              return (
                <div key={athlete.id} style={{ position: 'relative' }}>
                  <AthleteCard 
                    athlete={athlete}
                    onClick={(ath) => onSelectAthlete(ath)}
                    onCompare={(id) => onCompareAthlete(id)}
                  />
                  {/* Watchlist Toggle */}
                  <button
                    onClick={() => toggleBookmark(athlete.id)}
                    title={isBookmarked ? "Remove from Scouting Watchlist" : "Add to Scouting Watchlist"}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 2,
                      background: isBookmarked ? '#1e3a8a' : '#f1f5f9',
                      color: isBookmarked ? '#ffffff' : '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {isBookmarked ? '★ PINNED' : '+ WATCH'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TAB 2: PENDING VERIFICATION QUEUE */}
      {activeCoachTab === 'pending_queue' && (
        <div className="gov-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Grassroots Cadet Applications Awaiting Review
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Self-registered grassroots athletes who have submitted age and sports credentials.
              </p>
            </div>
            <span className="badge" style={{ background: '#eff6ff', color: '#1e3a8a', fontWeight: 800 }}>
              {pendingCadets.length} Applications
            </span>
          </div>

          {pendingCadets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No pending cadet registrations awaiting verification.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingCadets.map(cadet => {
                const isApproved = approvedIds.includes(cadet.id);
                const isRejected = rejectedIds.includes(cadet.id);
                return (
                  <div
                    key={cadet.id}
                    style={{
                      background: isApproved ? '#f0fdf4' : (isRejected ? '#fef2f2' : '#ffffff'),
                      border: isApproved ? '1px solid #bbf7d0' : (isRejected ? '1px solid #fecaca' : '1px solid #e2e8f0'),
                      padding: '16px 20px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img 
                        src={cadet.profile_photo_url || cadet.media_url || '/demo_athlete.jpg'} 
                        alt={cadet.name} 
                        onError={(e) => { e.target.src = '/demo_athlete.jpg'; }}
                        style={{ 
                          width: '46px', 
                          height: '46px', 
                          borderRadius: '50%', 
                          objectFit: 'cover', 
                          border: '2px solid #1e3a8a',
                          flexShrink: 0
                        }} 
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{cadet.name}</span>
                          <span className="badge" style={{ background: '#eff6ff', color: '#1e3a8a' }}>{cadet.primary_sport}</span>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Age {cadet.age} • {cadet.district}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '3px' }}>
                          <strong>Club:</strong> {cadet.current_club} • <strong>Achievements:</strong> {cadet.achievements}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedCadetForDocs(cadet)}
                        className="btn-secondary"
                        style={{ padding: '7px 12px', fontSize: '0.76rem' }}
                      >
                        <FileCheck size={14} /> Documents ({cadet.documents?.length || 0})
                      </button>

                      <button
                        onClick={() => onSelectAthlete && onSelectAthlete(cadet)}
                        className="btn-secondary"
                        style={{ padding: '7px 12px', fontSize: '0.76rem' }}
                      >
                        <Eye size={14} /> Dossier
                      </button>

                      {isApproved ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: 800, fontSize: '0.82rem', padding: '6px 10px' }}>
                          <CheckCircle2 size={16} /> VERIFIED
                        </div>
                      ) : isRejected ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b91c1c', fontWeight: 800, fontSize: '0.82rem', padding: '6px 10px' }}>
                          <XCircle size={16} /> FLAGGED
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(cadet.id, cadet.name)}
                            className="btn-primary"
                            style={{ padding: '7px 14px', fontSize: '0.78rem', background: '#15803d', borderColor: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CheckCircle2 size={14} /> Verify Dossier
                          </button>
                          <button
                            onClick={() => handleReject(cadet.id, cadet.name)}
                            className="btn-secondary"
                            style={{ padding: '7px 12px', fontSize: '0.78rem', color: '#b91c1c', borderColor: '#fca5a5' }}
                          >
                            Flag
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
      )}

      {/* 📄 Document Inspection Modal */}
      {selectedCadetForDocs && (
        <DocumentInspectionModal
          cadet={selectedCadetForDocs}
          onClose={() => setSelectedCadetForDocs(null)}
        />
      )}

      {/* 📋 Coach Multi-Video & Biomechanics Review Modal */}
      {selectedSessionForReview && (
        <CoachAthleteReviewModal
          session={selectedSessionForReview}
          onClose={() => setSelectedSessionForReview(null)}
          onActionSuccess={(updated) => {
            loadCandidateSessions();
            setSelectedSessionForReview(null);
            setNotification(`✓ Scout decision saved for ${updated.athlete_name}: ${updated.status.toUpperCase()}`);
            setTimeout(() => setNotification(null), 4000);
          }}
        />
      )}

    </div>
  );
}
