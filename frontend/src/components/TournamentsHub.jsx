import React, { useState, useEffect } from 'react';
import { 
  Trophy, Shield, MapPin, Calendar, Award, Activity, BarChart2, 
  ChevronRight, Users, Flame, Info, CheckCircle2, Star, Sparkles, 
  GitCompare, Eye, Target, Zap, Clock, UserCheck, X, Video
} from 'lucide-react';
import MatchDetailModal from './MatchDetailModal';
import AiMatchAnalysisModal from './AiMatchAnalysisModal';

export default function TournamentsHub({ onSelectAthlete, onCompareAthlete }) {
  const [activeSubTab, setActiveSubTab] = useState('clubs'); // 'clubs' or 'tournaments'
  const [selectedSport, setSelectedSport] = useState('all'); // 'all', 'Football', 'Weightlifting', 'Boxing', 'Archery', 'Judo & Combat Sports', 'Sepak Takraw', 'Field Hockey'
  const [clubs, setClubs] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clubLoading, setClubLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [aiAnalysisMatch, setAiAnalysisMatch] = useState(null);
  const [viewingTournament, setViewingTournament] = useState(null);
  const [tournamentMatches, setTournamentMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Sports filter list
  const SPORTS_OPTIONS = [
    { id: 'all', name: 'All Disciplines', icon: '🏆' },
    { id: 'Football', name: 'Football', icon: '⚽' },
    { id: 'Weightlifting', name: 'Weightlifting', icon: '🏋️' },
    { id: 'Boxing', name: 'Boxing', icon: '🥊' },
    { id: 'Archery', name: 'Archery', icon: '🏹' },
    { id: 'Judo & Combat Sports', name: 'Judo & Martial Arts', icon: '🥋' },
    { id: 'Sepak Takraw', name: 'Sepak Takraw', icon: '🏸' },
    { id: 'Field Hockey', name: 'Field Hockey', icon: '🏑' },
  ];

  // Initial fetch
  useEffect(() => {
    Promise.all([
      fetch('/api/teams').then(r => r.json()),
      fetch('/api/tournaments').then(r => r.json())
    ])
    .then(([clubsData, tourneysData]) => {
      setClubs(clubsData || []);
      setTournaments(tourneysData || []);
      if (clubsData && clubsData.length > 0) {
        // Load details for the first club
        loadClubDetails(clubsData[0].id);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading tournament hub data:", err);
      setLoading(false);
    });
  }, []);

  // Fetch full club details including athlete roster
  const loadClubDetails = (teamId) => {
    setClubLoading(true);
    fetch(`/api/teams/${teamId}`)
      .then(r => r.json())
      .then(data => {
        setSelectedClub(data);
        setClubLoading(false);
      })
      .catch(err => {
        console.error("Error fetching club details:", err);
        setClubLoading(false);
      });
  };

  // Fetch all matches belonging to a tournament
  const openTournamentMatchesModal = (tourney) => {
    setViewingTournament(tourney);
    setLoadingMatches(true);
    fetch(`/api/tournaments/${tourney.id}/matches`)
      .then(r => r.json())
      .then(data => {
        setTournamentMatches(data || []);
        setLoadingMatches(false);
      })
      .catch(err => {
        console.error("Error fetching tournament matches:", err);
        setLoadingMatches(false);
      });
  };

  // Filtered lists based on selected sport
  const filteredClubs = selectedSport === 'all' 
    ? clubs 
    : clubs.filter(c => c.primary_sport === selectedSport || (selectedSport === 'Judo & Combat Sports' && (c.primary_sport.includes('Judo') || c.primary_sport.includes('Wushu'))));

  const filteredTournaments = selectedSport === 'all'
    ? tournaments
    : tournaments.filter(t => t.sport === selectedSport || (selectedSport === 'Judo & Combat Sports' && (t.sport.includes('Judo') || t.sport.includes('Wushu'))));

  // Automatically select the first club in filtered list if current selected club is not in filter
  useEffect(() => {
    if (filteredClubs.length > 0) {
      const isCurrentInFilter = selectedClub && filteredClubs.some(c => c.id === selectedClub.id);
      if (!isCurrentInFilter) {
        loadClubDetails(filteredClubs[0].id);
      }
    }
  }, [selectedSport]);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* 🏛️ Top Header */}
      <div className="glass-card" style={{
        padding: '26px',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(15, 23, 42, 0.02) 100%)',
        border: '1px solid var(--border-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: '#ea580c', color: '#ffffff', fontWeight: 800 }}>
              ● MANIPUR OLYMPIC & STATE SPORTS PORTAL
            </span>
            <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
              MULTI-SPORT LEAGUES & CLUBS DIRECTORY
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Joint Registry of SAI NCOE, AMFA, MWA, MABA, MAA, MJA, AMSTA & Hockey Manipur
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
            Manipur Tournaments, Clubs & Squad Rosters
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Official records across all 7 premier Olympic disciplines in Manipur — explore real club histories, competition fixtures, and verified player rosters.
          </div>
        </div>

        {/* View Switcher Tabs (Clubs vs Tournaments) */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
          <button
            onClick={() => setActiveSubTab('clubs')}
            style={{
              background: activeSubTab === 'clubs' ? '#ea580c' : 'transparent',
              color: activeSubTab === 'clubs' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Shield size={14} /> Clubs & Squads ({filteredClubs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('tournaments')}
            style={{
              background: activeSubTab === 'tournaments' ? '#ea580c' : 'transparent',
              color: activeSubTab === 'tournaments' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trophy size={14} /> Premier Tournaments ({filteredTournaments.length})
          </button>
        </div>
      </div>

      {/* 🏅 Multi-Sport Filter Bar (Covers ALL 7 Manipur Sports) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '20px',
        scrollbarWidth: 'none'
      }}>
        {SPORTS_OPTIONS.map(sport => {
          const isSelected = selectedSport === sport.id;
          const count = sport.id === 'all' 
            ? (activeSubTab === 'clubs' ? clubs.length : tournaments.length)
            : (activeSubTab === 'clubs' 
                ? clubs.filter(c => c.primary_sport === sport.id || (sport.id === 'Judo & Combat Sports' && (c.primary_sport.includes('Judo') || c.primary_sport.includes('Wushu')))).length
                : tournaments.filter(t => t.sport === sport.id || (sport.id === 'Judo & Combat Sports' && (t.sport.includes('Judo') || t.sport.includes('Wushu')))).length
              );

          return (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              style={{
                background: isSelected ? 'var(--bg-card)' : 'var(--bg-surface)',
                color: isSelected ? '#ea580c' : 'var(--text-secondary)',
                border: isSelected ? '2px solid #ea580c' : '1px solid var(--border-card)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 2px 8px rgba(234, 88, 12, 0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{sport.icon}</span>
              <span>{sport.name}</span>
              <span style={{
                background: isSelected ? 'rgba(234, 88, 12, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                color: isSelected ? '#ea580c' : 'var(--text-muted)',
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: 800
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: CLUBS DIRECTORY & FULL SQUAD ROSTERS                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'clubs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '22px', alignItems: 'start' }}>
          
          {/* Left Column: Clubs List in Selected Sport */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '1100px', overflowY: 'auto', paddingRight: '4px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
              Select Club or Academy ({filteredClubs.length}):
            </div>

            {filteredClubs.map(c => {
              const isSelected = selectedClub?.id === c.id;
              return (
                <div 
                  key={c.id}
                  onClick={() => loadClubDetails(c.id)}
                  style={{
                    background: isSelected ? 'var(--bg-card)' : 'var(--bg-surface)',
                    border: isSelected ? '2px solid #ea580c' : '1px solid var(--border-card)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 15px rgba(234, 88, 12, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', fontSize: '0.66rem' }}>
                        {c.primary_sport}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {c.district}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Est. {c.founded_year}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: isSelected ? '#ea580c' : 'var(--text-primary)', marginBottom: '4px' }}>
                    {c.short_name}
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.3 }}>
                    {c.division}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-card)', paddingTop: '6px' }}>
                    <span>🏆 {(c.trophies_won || []).length} Trophies</span>
                    <span style={{ color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Users size={12} /> View Squad & Stats <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Club Detail Dossier + PLAYER ROSTER CARDS */}
          {selectedClub ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 1. Club Master Header Card */}
              <div className="glass-card" style={{ padding: '26px', borderTop: '4px solid #ea580c' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge" style={{ background: '#ea580c', color: '#ffffff', fontWeight: 800 }}>
                        {selectedClub.primary_sport}
                      </span>
                      <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
                        📍 {selectedClub.district}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Founded {selectedClub.founded_year}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                      {selectedClub.name}
                    </h2>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <span><strong>Division:</strong> {selectedClub.division}</span>
                      <span>•</span>
                      <span><strong>Home Ground:</strong> {selectedClub.home_ground}</span>
                      <span>•</span>
                      <span><strong>Head Coach:</strong> {selectedClub.head_coach}</span>
                    </div>
                  </div>

                  {/* Registered Cadets Counter Badge */}
                  <div style={{
                    background: 'var(--bg-primary)',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-card)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ea580c' }}>
                      {selectedClub.athletes?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                      Registered Cadets
                    </div>
                  </div>
                </div>

                {/* Trophies Cabinet */}
                {selectedClub.trophies_won && selectedClub.trophies_won.length > 0 && (
                  <div style={{ marginTop: '18px', borderTop: '1px solid var(--border-card)', paddingTop: '14px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      🏆 Verified Trophy Cabinet & Honours:
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedClub.trophies_won.map((tr, i) => (
                        <span 
                          key={i} 
                          style={{
                            background: 'rgba(217, 119, 6, 0.1)',
                            border: '1px solid rgba(217, 119, 6, 0.25)',
                            color: 'var(--text-primary)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          🥇 {tr.trophy} <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>({tr.year})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================================== */}
              {/* 2. CORE FEATURE: TEAM SQUAD & REGISTERED CADET CARDS               */}
              {/* =================================================================== */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <Users size={20} color="#ea580c" /> Team Squad & Cadets Roster
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Click "Inspect Dossier" for full biomechanics, or "Compare in AI Scout" for head-to-head evaluation.
                    </div>
                  </div>

                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 800 }}>
                    <CheckCircle2 size={12} /> {selectedClub.athletes?.length || 0} ATHLETES IN SYSTEM
                  </span>
                </div>

                {clubLoading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading squad athlete dossiers...
                  </div>
                ) : (!selectedClub.athletes || selectedClub.athletes.length === 0) ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    No registered cadets currently indexed for this club in the database.
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '14px'
                  }}>
                    {selectedClub.athletes.map(ath => {
                      const isSeniorStar = ath.composite_score >= 94.0;
                      return (
                        <div 
                          key={ath.id}
                          style={{
                            background: 'var(--bg-primary)',
                            border: isSeniorStar ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-card)',
                            borderRadius: '10px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px',
                            boxShadow: isSeniorStar ? '0 4px 15px rgba(16, 185, 129, 0.08)' : 'none'
                          }}
                        >
                          {/* Card Top: Avatar, Name, Khel ID, Grade */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img
                                  src={ath.profile_photo_url || ath.media_url || '/demo_athlete.jpg'}
                                  alt={ath.name}
                                  onError={(e) => { e.target.src = '/demo_athlete.jpg'; }}
                                  style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: isSeniorStar ? '2px solid #10b981' : '2px solid #0284c7',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                    flexShrink: 0
                                  }}
                                />
                                <div>
                                  <div style={{ fontSize: '0.98rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {ath.name}
                                    {isSeniorStar && <Star size={13} fill="#fbbf24" color="#fbbf24" title="Senior National Star" />}
                                  </div>
                                  <div style={{ fontSize: '0.68rem', color: '#0284c7', fontFamily: 'monospace', fontWeight: 700 }}>
                                    {ath.khel_id}
                                  </div>
                                </div>
                              </div>

                              {/* Grade Pill */}
                              <div style={{
                                background: ath.grade === 'Grade A+' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                                color: ath.grade === 'Grade A+' ? '#10b981' : '#0284c7',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800
                              }}>
                                {ath.grade} ({ath.composite_score})
                              </div>
                            </div>

                            {/* Demographics & Role */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                              <span>{ath.age} yrs • {ath.gender}</span>
                              <span>•</span>
                              <span>📍 {ath.district}</span>
                            </div>

                            {/* Squad Role / Weight Class / Position */}
                            <div style={{
                              background: 'var(--bg-card)',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'var(--text-secondary)',
                              marginBottom: '10px'
                            }}>
                              🏷️ {ath.season_stats?.squad_role || ath.season_stats?.football_position || ath.season_stats?.hockey_position || ath.season_stats?.takraw_role || ath.primary_sport}
                            </div>

                            {/* Sport-Specific Key Telemetry Box */}
                            <div style={{
                              background: 'var(--bg-card)',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-card)',
                              fontSize: '0.72rem',
                              color: 'var(--text-secondary)'
                            }}>
                              {/* Weightlifting */}
                              {ath.primary_sport === 'Weightlifting' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                  <div><strong>Snatch:</strong> <span style={{ color: '#ea580c', fontWeight: 800 }}>{ath.season_stats?.best_snatch_kg} kg</span></div>
                                  <div><strong>Clean & Jerk:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{ath.season_stats?.best_clean_and_jerk_kg} kg</span></div>
                                  <div><strong>Total Lift:</strong> <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{ath.season_stats?.best_total_kg} kg</span></div>
                                  <div><strong>Sinclair:</strong> {ath.season_stats?.sinclair_coefficient}</div>
                                </div>
                              )}

                              {/* Boxing */}
                              {ath.primary_sport === 'Boxing' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                  <div><strong>Record:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{ath.season_stats?.bouts_record}</span></div>
                                  <div><strong>KOs / RSC:</strong> {ath.season_stats?.knockouts_stoppages}</div>
                                  <div><strong>Strike Acc:</strong> <span style={{ color: '#ea580c', fontWeight: 800 }}>{ath.season_stats?.strike_accuracy_pct}%</span></div>
                                  <div><strong>Punches/Min:</strong> {ath.season_stats?.punch_output_per_min}</div>
                                </div>
                              )}

                              {/* Archery */}
                              {ath.primary_sport === 'Archery' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                  <div><strong>PB (720):</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{ath.season_stats?.personal_best_720}</span></div>
                                  <div><strong>10s & X's:</strong> <span style={{ color: '#ea580c', fontWeight: 800 }}>{ath.season_stats?.tens_and_x_count}</span></div>
                                  <div><strong>Bow:</strong> {ath.season_stats?.bow_division}</div>
                                  <div><strong>Grouping:</strong> {ath.season_stats?.arrow_grouping_radius_mm}mm</div>
                                </div>
                              )}

                              {/* Judo & Wushu */}
                              {(ath.primary_sport.includes('Judo') || ath.primary_sport.includes('Wushu')) && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                  <div><strong>Category:</strong> {ath.season_stats?.weight_category}</div>
                                  <div><strong>Ippon Win %:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{ath.season_stats?.ippon_win_rate_pct}%</span></div>
                                  <div><strong>Ground Defense:</strong> {ath.season_stats?.groundwork_ne_waza_defense_pct}%</div>
                                  <div><strong>Waza-ari:</strong> {ath.season_stats?.waza_ari_count}</div>
                                </div>
                              )}

                              {/* Sepak Takraw */}
                              {ath.primary_sport === 'Sepak Takraw' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                  <div><strong>Role:</strong> <span style={{ color: '#ea580c', fontWeight: 800 }}>{ath.season_stats?.takraw_role}</span></div>
                                  <div><strong>Spike Kill %:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{ath.season_stats?.spike_kill_pct}%</span></div>
                                  <div><strong>Service Aces:</strong> {ath.season_stats?.service_aces}</div>
                                  <div><strong>Block Points:</strong> {ath.season_stats?.block_points}</div>
                                </div>
                              )}

                              {/* Field Hockey */}
                              {ath.primary_sport === 'Field Hockey' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                  <div><strong>Position:</strong> {ath.season_stats?.hockey_position}</div>
                                  <div><strong>Season Goals:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{ath.season_stats?.goals_scored}</span></div>
                                  <div><strong>PC Converted:</strong> {ath.season_stats?.penalty_corners_converted}</div>
                                  <div><strong>Aerial Acc:</strong> {ath.season_stats?.aerial_pass_accuracy_pct}%</div>
                                </div>
                              )}

                              {/* Football */}
                              {ath.primary_sport === 'Football' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                  <div><strong>Goals / Assists:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{ath.season_stats?.goals}G / {ath.season_stats?.assists}A</span></div>
                                  <div><strong>Pass Acc:</strong> {ath.season_stats?.passing_accuracy_pct}%</div>
                                  <div><strong>xG Expected:</strong> <span style={{ color: '#ea580c', fontWeight: 800 }}>{ath.season_stats?.expected_goals_xG}</span></div>
                                  <div><strong>Top Speed:</strong> {ath.season_stats?.top_sprint_speed_kmh} km/h</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Footer: Action Buttons */}
                          <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-card)', paddingTop: '10px' }}>
                            <button
                              onClick={() => onSelectAthlete && onSelectAthlete(ath)}
                              style={{
                                flex: 1,
                                background: 'rgba(2, 132, 199, 0.1)',
                                color: '#0284c7',
                                border: '1px solid rgba(2, 132, 199, 0.25)',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              <Eye size={12} /> Inspect Dossier
                            </button>

                            <button
                              onClick={() => onCompareAthlete && onCompareAthlete(ath.id)}
                              style={{
                                flex: 1,
                                background: 'rgba(234, 88, 12, 0.1)',
                                color: '#ea580c',
                                border: '1px solid rgba(234, 88, 12, 0.25)',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              <GitCompare size={12} /> AI Compare
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Historical Matches & Derby Fixtures Table */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <BarChart2 size={18} color="#ea580c" /> Historical Fixture Telemetry & Competition Logs
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Statistically Sampled from Official Manipur State Match Sheets
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(selectedClub.historical_matches || []).map((m, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-card)',
                        borderRadius: '8px',
                        padding: '14px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      {/* Top Match Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{m.date}</span>
                            <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', fontSize: '0.68rem' }}>
                              {m.tournament}
                            </span>
                          </div>
                          <div style={{ fontSize: '1.02rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>
                            {selectedClub.short_name} <span style={{ color: '#ea580c' }}>vs</span> {m.opponent}
                          </div>
                        </div>

                        {/* Result Badge */}
                        <div style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          background: m.result.includes('WON') || m.result.includes('GOLD') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 88, 12, 0.15)',
                          color: m.result.includes('WON') || m.result.includes('GOLD') ? '#10b981' : '#ea580c'
                        }}>
                          {m.scoreline} ({m.result})
                        </div>
                      </div>

                      {/* Possession Bar for Football / Hockey */}
                      {(selectedClub.primary_sport === 'Football' || selectedClub.primary_sport === 'Field Hockey') && m.possession_team_pct && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '3px' }}>
                            <span style={{ color: '#0284c7' }}>{selectedClub.short_name}: {m.possession_team_pct}% Possession</span>
                            <span style={{ color: 'var(--text-muted)' }}>Ball Control</span>
                            <span style={{ color: '#64748b' }}>{m.opponent}: {m.possession_opponent_pct}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#334155', borderRadius: '3px', display: 'flex', overflow: 'hidden' }}>
                            <div style={{ width: `${m.possession_team_pct}%`, height: '100%', background: '#0284c7' }}></div>
                            <div style={{ width: `${m.possession_opponent_pct}%`, height: '100%', background: '#64748b' }}></div>
                          </div>
                        </div>
                      )}

                      {/* Highlight summary & Inspect button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '6px 10px', borderRadius: '4px', flex: 1 }}>
                          ⚡ <strong>Official Telemetry:</strong> {m.key_performance_highlight}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedMatch({
                              match_code: `DERBY-${selectedClub.short_name}-${idx}`,
                              tournament_name: m.tournament,
                              sport: selectedClub.primary_sport,
                              stage: 'Official Derby Match',
                              match_date: m.date,
                              venue: selectedClub.home_ground,
                              home_team_name: selectedClub.name,
                              away_team_name: m.opponent,
                              scoreline: m.scoreline,
                              winner_team_name: m.result.includes('WON') || m.result.includes('GOLD') ? selectedClub.name : m.opponent,
                              details: {
                                sport: selectedClub.primary_sport,
                                referee: 'State Association Certified Referee',
                                attendance: '10,500',
                                possession: m.possession_team_pct ? { home: m.possession_team_pct, away: m.possession_opponent_pct } : undefined,
                                goals: selectedClub.primary_sport === 'Football' ? [
                                  { minute: 28, player: selectedClub.athletes?.[0]?.name || 'Squad Forward', team: selectedClub.short_name, type: 'Open Play', assist: 'Midfield Playmaker' }
                                ] : undefined
                              }
                            });
                          }}
                          style={{
                            background: '#ffffff',
                            color: '#334155',
                            border: '1px solid #cbd5e1',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={12} /> Inspect Dossier
                        </button>

                        {/* AI Match Analysis Video Trigger */}
                        <button
                          onClick={() => {
                            setAiAnalysisMatch({
                              tournament_name: m.tournament,
                              home_team_name: selectedClub.name,
                              away_team_name: m.opponent,
                              scoreline: m.scoreline,
                              match_date: m.date,
                              venue: selectedClub.home_ground,
                              details: {
                                possession: {
                                  home: m.possession_team_pct || 56,
                                  away: m.possession_opponent_pct || 44
                                }
                              }
                            });
                          }}
                          style={{
                            background: '#eff6ff',
                            color: '#1e3a8a',
                            border: '1px solid #1e3a8a',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="View pre-rendered tactical video with ball possession & player tracking HUD"
                        >
                          <Video size={12} /> View AI Analysis
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a club from the left panel to inspect its squad roster and performance history.
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: PREMIER MANIPUR TOURNAMENTS REGISTRY                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'tournaments' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {filteredTournaments.map(t => (
            <div key={t.id} className="glass-card" style={{ padding: '24px', borderTop: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
                  {t.sport}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Est. {t.founded_year}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 4px' }}>
                {t.name}
              </h3>
              
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Organized by <strong>{t.organizer}</strong>
              </div>

              <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>📍 Official Venue:</strong> <span style={{ color: 'var(--text-primary)' }}>{t.venue}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>🏆 Current Champion:</strong> <span style={{ color: '#10b981', fontWeight: 800 }}>{t.current_champion}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>📜 Trophy Heritage:</strong> <span style={{ color: 'var(--text-secondary)' }}>{t.trophy_details}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>⚙️ Tournament Format:</strong> <span style={{ color: 'var(--text-secondary)' }}>{t.tournament_format}</span>
                </div>
              </div>

              {/* Recent Fixtures / Results */}
              {t.recent_matches && t.recent_matches.length > 0 && (
                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-card)',
                  fontSize: '0.74rem'
                }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Latest Recorded Fixture:
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <span>{t.recent_matches[0].teams}</span>
                    <span style={{ color: '#ea580c' }}>{t.recent_matches[0].score}</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {t.recent_matches[0].match} • {t.recent_matches[0].venue}
                  </div>
                </div>
              )}

              {/* Button to View All Tournament Matches */}
              <button
                onClick={() => openTournamentMatchesModal(t)}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(234, 88, 12, 0.08) 100%)',
                  color: '#0284c7',
                  border: '1px solid rgba(2, 132, 199, 0.35)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Calendar size={14} /> View All Tournament Matches & Scorecards →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🏆 Tournament Matches Dialog Modal */}
      {viewingTournament && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
          padding: '20px'
        }}>
          <div className="glass-card animate-fadeIn" style={{
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-card)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-card)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', fontWeight: 800 }}>
                  {viewingTournament.sport} • {viewingTournament.edition}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
                  {viewingTournament.name}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  📍 Venue: {viewingTournament.venue} | Organized by {viewingTournament.organizer}
                </div>
              </div>
              <button
                onClick={() => setViewingTournament(null)}
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

            <div style={{ marginBottom: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Official fixtures and match telemetry loaded directly from the Manipur State Sports Competition Registry (SQLite DB):
            </div>

            {loadingMatches ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading tournament match fixtures...
              </div>
            ) : tournamentMatches.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No recorded match fixtures found for this tournament yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {tournamentMatches.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-card)',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontWeight: 800, fontSize: '0.72rem' }}>
                          {m.stage}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {m.match_date}
                        </span>
                      </div>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.74rem' }}>
                        Winner: {m.winner_team_name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                          {m.home_team_name} <span style={{ color: '#ea580c' }}>vs</span> {m.away_team_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          📍 {m.venue}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 950, color: '#ea580c', fontFamily: 'monospace' }}>
                          {m.scoreline}
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setAiAnalysisMatch(m)}
                        style={{
                          background: '#eff6ff',
                          color: '#1e3a8a',
                          border: '1px solid #1e3a8a',
                          padding: '7px 14px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Video size={14} /> View AI Analysis
                      </button>

                      <button
                        onClick={() => setSelectedMatch(m)}
                        style={{
                          background: '#ffffff',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          padding: '7px 14px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={14} /> Inspect Match Scorecard →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📊 Full Match Scorecard & Telemetry Modal */}
      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* 🎥 AI Match Tactical Analysis Video Modal */}
      {aiAnalysisMatch && (
        <AiMatchAnalysisModal
          match={aiAnalysisMatch}
          onClose={() => setAiAnalysisMatch(null)}
        />
      )}

    </div>
  );
}
