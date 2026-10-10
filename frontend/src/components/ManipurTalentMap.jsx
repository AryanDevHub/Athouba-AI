import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, Users, Award, Trophy, Compass, Eye, Filter, 
  RotateCcw, Sparkles, ChevronDown, ChevronUp, Layers, 
  Zap, ArrowRight, ShieldCheck, Activity, Globe
} from 'lucide-react';

// Real Geographic Coordinates for Manipur's 10 Official Districts
export const MANIPUR_DISTRICTS_GEO = [
  {
    name: "Imphal West",
    type: "Valley",
    lat: 24.8170,
    lng: 93.9368,
    elevation: "786 m",
    hq: "Lamphelpat",
    hub: "SAI NCOE Takyelpat & Khuman Lampak Sports Complex",
    description: "State capital nursery; premier multi-sport hub with Olympic-caliber training centers.",
    radiusMeters: 14000
  },
  {
    name: "Imphal East",
    type: "Valley",
    lat: 24.8350,
    lng: 94.0200,
    elevation: "790 m",
    hq: "Porompat",
    hub: "Luwangsangbam Sports Complex & Eastern Polo Ground",
    description: "High-density football and combat sports talent cradle.",
    radiusMeters: 15000
  },
  {
    name: "Bishnupur",
    type: "Valley",
    lat: 24.6300,
    lng: 93.7600,
    elevation: "770 m",
    hq: "Bishnupur",
    hub: "Moirang Multipurpose Indoor Hall & Loktak Aquatic Nursery",
    description: "Home of Olympic weightlifting legends & Sepak Takraw champions.",
    radiusMeters: 16000
  },
  {
    name: "Thoubal",
    type: "Valley",
    lat: 24.6400,
    lng: 94.0100,
    elevation: "775 m",
    hq: "Thoubal",
    hub: "Thoubal District Mini Stadium & Athokpam Ground",
    description: "Fast-rising grassroots athletics, wushu, and football nursery.",
    radiusMeters: 15000
  },
  {
    name: "Kakching",
    type: "Valley",
    lat: 24.4900,
    lng: 93.9800,
    elevation: "776 m",
    hq: "Kakching",
    hub: "Kakching SAG Weightlifting Training Hub & Chumnang Arena",
    description: "Renowned powerlifting, archery, and physical endurance nursery.",
    radiusMeters: 14000
  },
  {
    name: "Churachandpur",
    type: "Hill",
    lat: 24.3300,
    lng: 93.6800,
    elevation: "922 m",
    hq: "Tuibong",
    hub: "Tuibong Multipurpose Sports Complex & Lamka Ground",
    description: "Rugged south-western hills; prolific boxing, football, and endurance talent.",
    radiusMeters: 26000
  },
  {
    name: "Ukhrul",
    type: "Hill",
    lat: 25.1100,
    lng: 94.3600,
    elevation: "1,660 m",
    hq: "Ukhrul",
    hub: "Ukhrul District Grassroots Archery Ground & Shirui Nursery",
    description: "High-altitude hill district with exceptional natural VO2 max & archery tradition.",
    radiusMeters: 28000
  },
  {
    name: "Tamenglong",
    type: "Hill",
    lat: 24.9800,
    lng: 93.4900,
    elevation: "1,260 m",
    hq: "Tamenglong",
    hub: "Tamenglong District Sports Association Ground",
    description: "Western rainforested hills producing resilient middle-distance sprinters.",
    radiusMeters: 26000
  },
  {
    name: "Senapati",
    type: "Hill",
    lat: 25.2700,
    lng: 94.0200,
    elevation: "1,450 m",
    hq: "Senapati",
    hub: "Senapati District Indoor Stadium & Mao Youth Ground",
    description: "Northern hill corridor; disciplined football and tactical field prospects.",
    radiusMeters: 24000
  },
  {
    name: "Chandel",
    type: "Hill",
    lat: 24.3200,
    lng: 94.0400,
    elevation: "870 m",
    hq: "Chandel",
    hub: "Maha Union Sports Arena & Komlathabi Cell",
    description: "South-eastern border district; focused archery and explosive speed recruits.",
    radiusMeters: 24000
  },
  {
    name: "Kangpokpi",
    type: "Hill",
    lat: 25.0100,
    lng: 93.9700,
    elevation: "1,020 m",
    hq: "Kangpokpi",
    hub: "Kangpokpi Youth Sporting Arena & Keithelmanbi Field",
    description: "Sadar hills nursery linking northern ridges with the central valley.",
    radiusMeters: 18000
  }
];

const MANIPUR_CENTER = [24.8170, 93.9368];
const DEFAULT_ZOOM = 8.5;

// 100% Free, reliable tile layers with NO API key requirements and NO watermarks
const MAP_TILES = {
  topo: {
    name: "Terrain Topo",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    subdomains: '',
    attribution: 'Tiles &copy; Esri &mdash; Topographic GIS'
  },
  street: {
    name: "Street Map",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    subdomains: '',
    attribution: 'Tiles &copy; Esri &mdash; World Street Map'
  },
  satellite: {
    name: "High-Res Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    subdomains: '',
    attribution: 'Tiles &copy; Esri &mdash; Satellite Imagery'
  },
  osm_hot: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    subdomains: 'abc',
    attribution: '&copy; OpenStreetMap contributors'
  }
};

export default function ManipurTalentMap({
  athletes = [],
  selectedDistrict = "All",
  onSelectDistrict,
  selectedSport = "All",
  onSelectSport,
  onSelectAthlete
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [activeTileKey, setActiveTileKey] = useState("topo");
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mapMode, setMapMode] = useState('mini'); // 'mini' (side-by-side) or 'expanded' (full-width)

  // Compute stats per district from incoming athletes array
  const districtStats = useMemo(() => {
    const stats = {};
    MANIPUR_DISTRICTS_GEO.forEach(d => {
      stats[d.name] = {
        name: d.name,
        type: d.type,
        lat: d.lat,
        lng: d.lng,
        count: 0,
        athletes: [],
        avgScore: 0,
        topScore: 0,
        topAthlete: null,
        topSport: 'N/A',
        sportsCount: {}
      };
    });

    athletes.forEach(ath => {
      const distName = ath.district;
      if (stats[distName]) {
        stats[distName].count += 1;
        stats[distName].athletes.push(ath);
        
        const sp = ath.primary_sport || 'General';
        stats[distName].sportsCount[sp] = (stats[distName].sportsCount[sp] || 0) + 1;

        if (ath.composite_score > stats[distName].topScore) {
          stats[distName].topScore = ath.composite_score;
          stats[distName].topAthlete = ath;
        }
      }
    });

    Object.values(stats).forEach(s => {
      if (s.count > 0) {
        const sum = s.athletes.reduce((acc, a) => acc + (a.composite_score || 0), 0);
        s.avgScore = Number((sum / s.count).toFixed(1));

        let maxSport = 'N/A';
        let maxCount = 0;
        Object.entries(s.sportsCount).forEach(([sport, count]) => {
          if (count > maxCount) {
            maxCount = count;
            maxSport = sport;
          }
        });
        s.topSport = maxSport;
      }
    });

    return stats;
  }, [athletes]);

  const maxCadetCount = useMemo(() => {
    return Math.max(...Object.values(districtStats).map(s => s.count), 1);
  }, [districtStats]);

  // Active district for details drawer
  const activeDetailDistrict = useMemo(() => {
    if (hoveredDistrict && districtStats[hoveredDistrict]) {
      return districtStats[hoveredDistrict];
    }
    if (selectedDistrict !== "All" && districtStats[selectedDistrict]) {
      return districtStats[selectedDistrict];
    }
    return districtStats["Imphal West"] || Object.values(districtStats)[0];
  }, [hoveredDistrict, selectedDistrict, districtStats]);

  // Overall counts
  const totalCadets = athletes.length;
  const valleyCadets = athletes.filter(a => ["Imphal West", "Imphal East", "Bishnupur", "Thoubal", "Kakching"].includes(a.district)).length;
  const hillCadets = totalCadets - valleyCadets;
  const valleyPct = totalCadets > 0 ? Math.round((valleyCadets / totalCadets) * 100) : 0;
  const hillPct = 100 - valleyPct;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MANIPUR_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 7.5,
        maxZoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Tile Layer
      const currentTile = MAP_TILES[activeTileKey] || MAP_TILES.topo;
      const tile = L.tileLayer(currentTile.url, {
        subdomains: currentTile.subdomains || '',
        maxZoom: 18,
        attribution: currentTile.attribution
      }).addTo(map);

      tileLayerRef.current = tile;

      // Layer group for our circles & markers
      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Switching
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const currentTile = MAP_TILES[activeTileKey] || MAP_TILES.topo;
    const newTile = L.tileLayer(currentTile.url, {
      subdomains: currentTile.subdomains || '',
      maxZoom: 18,
      attribution: currentTile.attribution
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [activeTileKey]);

  // Update Map Circles, Markers & Popups when stats or selection change
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    const layersGroup = layersGroupRef.current;
    layersGroup.clearLayers();

    // 1. Add Loktak Lake Landmark Marker
    const loktakCircle = L.circle([24.5500, 93.8000], {
      radius: 9000,
      color: '#0284c7',
      fillColor: '#06b6d4',
      fillOpacity: 0.35,
      weight: 1.5,
      dashArray: '4, 4'
    }).bindTooltip("🌊 Loktak Lake (Freshwater Nursery)", {
      permanent: false,
      direction: 'top',
      className: 'leaflet-loktak-tooltip'
    });
    layersGroup.addLayer(loktakCircle);

    // 2. Add District Circles & Interactive DivIcon Badges
    MANIPUR_DISTRICTS_GEO.forEach(d => {
      const stat = districtStats[d.name] || { count: 0, avgScore: 0, topSport: 'N/A' };
      const isSelected = selectedDistrict === d.name;
      const isHovered = hoveredDistrict === d.name;

      // Dynamic color based on district type & selection
      let strokeColor = '#3b82f6';
      let fillColor = '#60a5fa';

      if (isSelected) {
        strokeColor = '#ea580c';
        fillColor = '#f97316';
      } else if (d.type === 'Valley') {
        strokeColor = '#059669';
        fillColor = '#10b981';
      } else {
        strokeColor = '#1e3a8a';
        fillColor = '#0284c7';
      }

      const intensity = Math.min((stat.count / maxCadetCount) || 0.2, 1);
      const fillOpacity = isSelected ? 0.55 : (stat.count > 0 ? 0.25 + (intensity * 0.25) : 0.12);

      // Outer geographic boundary circle
      const circle = L.circle([d.lat, d.lng], {
        radius: d.radiusMeters,
        color: strokeColor,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        weight: isSelected ? 3.5 : 2
      });

      circle.on('click', () => {
        handleDistrictClick(d.name);
      });
      circle.on('mouseover', () => {
        setHoveredDistrict(d.name);
      });
      circle.on('mouseout', () => {
        setHoveredDistrict(null);
      });

      layersGroup.addLayer(circle);

      // Custom DivIcon HTML badge
      const pulseHtml = isSelected ? '<div class="leaflet-pulse-ring"></div>' : '';
      const customIcon = L.divIcon({
        className: 'custom-district-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
            ${pulseHtml}
            <div style="
              background: ${isSelected ? '#ea580c' : (stat.count > 0 ? (d.type === 'Valley' ? '#059669' : '#1e3a8a') : '#64748b')};
              color: #ffffff;
              width: ${isSelected ? '32px' : '26px'};
              height: ${isSelected ? '32px' : '26px'};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: ${isSelected ? '12px' : '10px'};
              border: 2px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.35);
              transition: transform 0.2s ease;
            ">
              ${stat.count}
            </div>
            <div style="
              background: ${isSelected ? '#ea580c' : '#0f172a'};
              color: #ffffff;
              padding: 2px 7px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 800;
              margin-top: 3px;
              white-space: nowrap;
              border: 1px solid rgba(255,255,255,0.4);
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
              letter-spacing: 0.2px;
            ">
              ${d.name}
            </div>
          </div>
        `,
        iconSize: [0, 0]
      });

      const marker = L.marker([d.lat, d.lng], { icon: customIcon });

      marker.on('click', () => {
        handleDistrictClick(d.name);
      });
      marker.on('mouseover', () => {
        setHoveredDistrict(d.name);
      });
      marker.on('mouseout', () => {
        setHoveredDistrict(null);
      });

      // Interactive popup
      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 190px; padding: 2px;">
          <div style="font-weight: 900; font-size: 14px; color: #0f172a; margin-bottom: 2px;">
            ${d.name}
          </div>
          <div style="font-size: 11px; color: #0284c7; font-weight: 700; margin-bottom: 6px;">
            ${d.type === 'Valley' ? '🌿 Central Valley Nursery' : '🏔️ High-Altitude Hill Nursery'}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            HQ: ${d.hq} • Alt: ${d.elevation}
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 10px; font-size: 11px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Registered Cadets:</span>
              <strong style="color: #10b981;">${stat.count}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Avg SAI Score:</span>
              <strong style="color: #0284c7;">${stat.avgScore || '—'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Leading Sport:</span>
              <strong style="color: #ea580c;">${stat.topSport}</strong>
            </div>
          </div>
          <div style="font-size: 10px; color: #94a3b8; text-align: center;">
            Click to focus scouting feed
          </div>
        </div>
      `);

      layersGroup.addLayer(marker);
    });

  }, [districtStats, selectedDistrict, hoveredDistrict]);

  // Pan & Zoom to selected district when changed
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (selectedDistrict === "All") {
      map.flyTo(MANIPUR_CENTER, DEFAULT_ZOOM, { duration: 1.2 });
    } else {
      const geo = MANIPUR_DISTRICTS_GEO.find(d => d.name === selectedDistrict);
      if (geo) {
        map.flyTo([geo.lat, geo.lng], 10, { duration: 1.2 });
      }
    }
  }, [selectedDistrict]);

  // Invalidate map size on mode switch or uncollapse
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 200);
    }
  }, [mapMode, isCollapsed]);

  const handleDistrictClick = (districtName) => {
    if (selectedDistrict === districtName) {
      onSelectDistrict("All");
    } else {
      onSelectDistrict(districtName);
    }
  };

  return (
    <div className="gov-card" style={{ 
      marginBottom: '26px', 
      padding: '20px 24px', 
      border: '1px solid var(--border-card)',
      background: 'var(--bg-card)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)'
    }}>
      {/* 🏛️ Top Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px', borderBottom: '1px solid var(--border-card)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)', 
            color: '#fff', 
            width: '38px', 
            height: '38px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)'
          }}>
            <Globe size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Manipur State Talent Geographic GIS Radar (Leaflet)
              </h3>
              <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', fontWeight: 800, fontSize: '0.68rem' }}>
                LIVE LEAFLET GIS
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              High-precision OpenStreetMap GIS • Click pins or circles to filter tested athletes across Manipur
            </div>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Quick Clear Filter Button */}
          {selectedDistrict !== "All" && (
            <button
              onClick={() => onSelectDistrict("All")}
              style={{
                background: 'rgba(234, 88, 12, 0.12)',
                color: '#ea580c',
                border: '1px solid rgba(234, 88, 12, 0.3)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={12} /> Reset to All Manipur ({totalCadets})
            </button>
          )}

          {/* Map Layer Switcher (Voyager vs OSM vs Dark) */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-primary)',
            borderRadius: '8px',
            padding: '2px',
            border: '1px solid var(--border-card)'
          }}>
            {Object.entries(MAP_TILES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setActiveTileKey(key)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTileKey === key ? '#1e3a8a' : 'transparent',
                  color: activeTileKey === key ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Mini vs Expanded Switcher */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-primary)',
            borderRadius: '8px',
            padding: '2px',
            border: '1px solid var(--border-card)'
          }}>
            <button
              onClick={() => setMapMode('mini')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: mapMode === 'mini' ? '#0284c7' : 'transparent',
                color: mapMode === 'mini' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              Mini Map
            </button>
            <button
              onClick={() => setMapMode('expanded')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: mapMode === 'expanded' ? '#0284c7' : 'transparent',
                color: mapMode === 'expanded' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              Wide Map
            </button>
          </div>

          {/* Minimize / Maximize Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isCollapsed ? "Expand Map" : "Collapse Map"}
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <>
          {/* 📊 Geographic KPI Summary Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            marginBottom: '18px'
          }}>
            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Active State Scope
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: selectedDistrict === "All" ? '#0284c7' : '#ea580c', marginTop: '2px' }}>
                {selectedDistrict === "All" ? "All Manipur (10 Dist)" : selectedDistrict}
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Indexed Cadets
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
                {selectedDistrict === "All" ? totalCadets : (districtStats[selectedDistrict]?.count || 0)} Cadets
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Valley vs Hill Outreach
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{valleyPct}% Valley</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: '#0284c7' }}>{hillPct}% Hill</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Dominant Sport Hub
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>
                {selectedDistrict === "All" ? "Football & Weightlifting" : (districtStats[selectedDistrict]?.topSport || "General")}
              </div>
            </div>
          </div>

          {/* 🗺️ Main Map & Inspector Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: mapMode === 'mini' ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
            gap: '20px',
            alignItems: 'start'
          }}>
            
            {/* LEFT / CENTER: Interactive Leaflet Map */}
            <div style={{
              borderRadius: '12px',
              border: '1px solid var(--border-card)',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              position: 'relative'
            }}>
              
              {/* Map Canvas */}
              <div 
                ref={mapContainerRef} 
                style={{ 
                  width: '100%', 
                  height: mapMode === 'mini' ? '460px' : '560px', 
                  background: '#f1f5f9',
                  zIndex: 1
                }} 
              />

              {/* In-Map Floating Legend / Watermark */}
              {/* <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                zIndex: 400,
                background: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', zIndex: 10 }}>
                  <ShieldCheck size={12} /> SAI Manipur Geographic Grid
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Valley Hub
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7', display: 'inline-block' }} /> Hill Nursery
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c', display: 'inline-block' }} /> Active Focus
                  </span>
                </div>
              </div> */}

            </div>

            {/* RIGHT: District Talent Dossier & Top Cadets Inspector */}
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid var(--border-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                {/* District Title & Region Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge" style={{ 
                        background: activeDetailDistrict.type === 'Valley' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)', 
                        color: activeDetailDistrict.type === 'Valley' ? '#10b981' : '#0284c7', 
                        fontWeight: 800 
                      }}>
                        {activeDetailDistrict.type === 'Valley' ? '🌿 Central Valley Nursery' : '🏔️ High-Altitude Hill Nursery'}
                      </span>
                      {selectedDistrict === activeDetailDistrict.name && (
                        <span className="badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontWeight: 800 }}>
                          FILTER ACTIVE
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
                      {activeDetailDistrict.name}
                    </h2>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      HQ: {MANIPUR_DISTRICTS_GEO.find(d => d.name === activeDetailDistrict.name)?.hq || 'District Nursery'} • Elevation: {MANIPUR_DISTRICTS_GEO.find(d => d.name === activeDetailDistrict.name)?.elevation || '780m'}
                    </div>
                  </div>

                  {/* Primary Sports Icon */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>LEADING SPORT</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0284c7' }}>
                      {activeDetailDistrict.topSport}
                    </div>
                  </div>
                </div>

                {/* Infrastructure Description */}
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px' }}>
                  {MANIPUR_DISTRICTS_GEO.find(d => d.name === activeDetailDistrict.name)?.description}
                </p>

                {/* District Key Numbers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '16px'
                }}>
                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>CADETS</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
                      {activeDetailDistrict.count}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>AVG TALENT</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>
                      {activeDetailDistrict.avgScore || '—'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>PEAK SCORE</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ea580c', marginTop: '2px' }}>
                      {activeDetailDistrict.topScore || '—'}
                    </div>
                  </div>
                </div>

                {/* Top Performer Card from this District */}
                {activeDetailDistrict.topAthlete && (
                  <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    border: '1px solid var(--border-card)',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={activeDetailDistrict.topAthlete.profile_photo_url || activeDetailDistrict.topAthlete.media_url || '/demo_athlete.jpg'}
                        alt={activeDetailDistrict.topAthlete.name}
                        onError={(e) => { e.target.src = '/demo_athlete.jpg'; }}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          border: '2px solid #ea580c'
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                            {activeDetailDistrict.topAthlete.name}
                          </span>
                          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.65rem', padding: '1px 5px' }}>
                            Top Prospect
                          </span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {activeDetailDistrict.topAthlete.primary_sport} • Score: <strong style={{ color: '#ea580c' }}>{activeDetailDistrict.topAthlete.composite_score} pts</strong>
                        </div>
                      </div>
                    </div>

                    {onSelectAthlete && (
                      <button
                        onClick={() => onSelectAthlete(activeDetailDistrict.topAthlete)}
                        style={{
                          background: 'rgba(2, 132, 199, 0.12)',
                          color: '#0284c7',
                          border: '1px solid rgba(2, 132, 199, 0.3)',
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
                        <Eye size={12} /> Dossier
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Quick Action: Focus or Clear Filter */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleDistrictClick(activeDetailDistrict.name)}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '9px 14px',
                    fontSize: '0.8rem',
                    justifyContent: 'center',
                    background: selectedDistrict === activeDetailDistrict.name ? '#ea580c' : '#1e3a8a'
                  }}
                >
                  {selectedDistrict === activeDetailDistrict.name ? (
                    <>✓ Showing {activeDetailDistrict.name} Only</>
                  ) : (
                    <>Filter Cards by {activeDetailDistrict.name} ({activeDetailDistrict.count})</>
                  )}
                </button>

                {selectedDistrict !== "All" && (
                  <button
                    onClick={() => onSelectDistrict("All")}
                    className="btn-secondary"
                    style={{ padding: '9px 14px', fontSize: '0.8rem' }}
                  >
                    Clear Filter
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* 🏷️ District Quick-Tap Selector Chips Bar */}
          <div style={{
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              DISTRICT SELECTOR:
            </span>

            <button
              onClick={() => onSelectDistrict("All")}
              style={{
                background: selectedDistrict === "All" ? '#1e3a8a' : 'var(--bg-primary)',
                color: selectedDistrict === "All" ? '#fff' : 'var(--text-secondary)',
                border: selectedDistrict === "All" ? '1px solid #1e3a8a' : '1px solid var(--border-card)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              All Manipur ({totalCadets})
            </button>

            {MANIPUR_DISTRICTS_GEO.map(d => {
              const count = districtStats[d.name]?.count || 0;
              const isSel = selectedDistrict === d.name;

              return (
                <button
                  key={d.name}
                  onClick={() => handleDistrictClick(d.name)}
                  style={{
                    background: isSel ? '#ea580c' : 'var(--bg-primary)',
                    color: isSel ? '#fff' : 'var(--text-secondary)',
                    border: isSel ? '1px solid #ea580c' : '1px solid var(--border-card)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{d.name}</span>
                  <span style={{ 
                    background: isSel ? 'rgba(0,0,0,0.25)' : 'rgba(2, 132, 199, 0.12)', 
                    color: isSel ? '#fff' : '#0284c7', 
                    padding: '1px 5px', 
                    borderRadius: '4px', 
                    fontSize: '0.65rem' 
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Global CSS for Leaflet Marker Animations */}
      <style>{`
        .leaflet-pulse-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #ea580c;
          animation: leafletPulse 1.8s infinite ease-out;
          pointer-events: none;
        }
        @keyframes leafletPulse {
          0% { transform: scale(0.9); opacity: 0.9; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .custom-district-marker:hover > div > div:first-child {
          transform: scale(1.15);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          border: 1px solid #e2e8f0;
        }
      `}</style>
    </div>
  );
}
