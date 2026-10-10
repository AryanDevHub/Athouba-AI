import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { 
  Database, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, Download, FileSpreadsheet,
  CheckCircle2, AlertCircle, Zap, Shield, Activity
} from 'lucide-react';

// Format seconds into MM:SS.ms
function formatTimestamp(sec) {
  if (sec == null || isNaN(sec)) return '-';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 100);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

export default function FootballTelemetryGrid() {
  const [activeTable, setActiveTable] = useState('player_observations');
  const [data, setData] = useState([]);
  const [columnsList, setColumnsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });

  // Fetch telemetry from backend API
  const fetchTelemetry = (tableName) => {
    setLoading(true);
    setError(null);
    fetch(`/api/football/telemetry/${tableName}?limit=100`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json.data || []);
        setColumnsList(json.columns || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load football telemetry:', err);
        setError(err.message || 'Failed to fetch telemetry data from database');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTelemetry(activeTable);
  }, [activeTable]);

  // Define column definitions based on active table
  const columns = useMemo(() => {
    if (activeTable === 'player_observations') {
      return [
        {
          accessorKey: 'frame_number',
          header: 'Frame #',
          cell: (info) => (
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e3a8a' }}>
              #{info.getValue()}
            </span>
          ),
        },
        {
          accessorKey: 'player_id',
          header: 'Player ID',
          cell: (info) => (
            <span 
              className="badge" 
              style={{ background: '#f1f5f9', color: '#0f172a', fontWeight: 800, padding: '2px 8px' }}
            >
              Player {info.getValue()}
            </span>
          ),
        },
        {
          accessorKey: 'team_id',
          header: 'Team',
          cell: (info) => {
            const val = info.getValue();
            const isTeam1 = val === 1;
            return (
              <span 
                className="badge" 
                style={{ 
                  background: isTeam1 ? '#eff6ff' : '#fef2f2', 
                  color: isTeam1 ? '#1e3a8a' : '#991b1b',
                  border: isTeam1 ? '1px solid #bfdbfe' : '1px solid #fecaca',
                  fontWeight: 800 
                }}
              >
                Team {val}
              </span>
            );
          },
        },
        {
          accessorKey: 'speed_kmh',
          header: 'Speed (km/h)',
          cell: (info) => {
            const raw = info.getValue();
            if (raw == null || isNaN(raw)) return '-';
            const val = Number(raw).toFixed(1);
            const isSprint = Number(raw) >= 25.0;
            return isSprint ? (
              <span 
                className="badge" 
                style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontWeight: 800 }}
              >
                ⚡ {val} km/h (Sprint)
              </span>
            ) : (
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                🏃 {val} km/h
              </span>
            );
          },
        },
        {
          accessorKey: 'has_ball',
          header: 'Ball Possession',
          cell: (info) => {
            const hasBall = Number(info.getValue()) === 1;
            return hasBall ? (
              <span 
                className="badge" 
                style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontWeight: 800 }}
              >
                ⚽ In Possession
              </span>
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>—</span>
            );
          },
        },
        {
          accessorKey: 'distance_m',
          header: 'Cumulative Dist.',
          cell: (info) => {
            const val = info.getValue();
            return val != null ? `${Number(val).toFixed(2)} m` : '-';
          },
        },
        {
          id: 'field_coords',
          header: 'Pitch Pos (X, Y)',
          accessorFn: (row) => `${row.field_x != null ? Number(row.field_x).toFixed(1) : '-'}, ${row.field_y != null ? Number(row.field_y).toFixed(1) : '-'}`,
          cell: (info) => (
            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
              ({info.getValue()} m)
            </span>
          ),
        },
        {
          id: 'image_coords',
          header: 'BBox Center',
          accessorFn: (row) => `${Math.round(row.image_x || 0)}, ${Math.round(row.image_y || 0)}`,
          cell: (info) => (
            <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#94a3b8' }}>
              [{info.getValue()}]
            </span>
          ),
        },
      ];
    }

    if (activeTable === 'frame_observations') {
      return [
        {
          accessorKey: 'frame_number',
          header: 'Frame #',
          cell: (info) => (
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e3a8a' }}>
              #{info.getValue()}
            </span>
          ),
        },
        {
          accessorKey: 'timestamp_seconds',
          header: 'Match Clock (MM:SS.ms)',
          cell: (info) => (
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
              ⏱️ {formatTimestamp(info.getValue())}
            </span>
          ),
        },
        {
          id: 'ball_coords',
          header: 'Ball Position (X, Y)',
          accessorFn: (row) => `${row.ball_x != null ? Number(row.ball_x).toFixed(1) : '-'}, ${row.ball_y != null ? Number(row.ball_y).toFixed(1) : '-'}`,
          cell: (info) => (
            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 600 }}>
              ⚽ ({info.getValue()})
            </span>
          ),
        },
        {
          accessorKey: 'possession_team',
          header: 'Team in Possession',
          cell: (info) => {
            const val = info.getValue();
            if (val == null) {
              return (
                <span className="badge" style={{ background: '#f1f5f9', color: '#64748b', fontWeight: 700 }}>
                  Contested / Air Ball
                </span>
              );
            }
            const isTeam1 = val === 1;
            return (
              <span 
                className="badge" 
                style={{ 
                  background: isTeam1 ? '#eff6ff' : '#fef2f2', 
                  color: isTeam1 ? '#1e3a8a' : '#991b1b',
                  border: isTeam1 ? '1px solid #bfdbfe' : '1px solid #fecaca',
                  fontWeight: 800 
                }}
              >
                Team {val} Control
              </span>
            );
          },
        },
        {
          accessorKey: 'match_id',
          header: 'Match ID',
          cell: (info) => (
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#94a3b8' }}>
              {String(info.getValue()).slice(0, 8)}...
            </span>
          ),
        },
      ];
    }

    // Default: 'matches'
    return [
      {
        accessorKey: 'match_id',
        header: 'Match UUID',
        cell: (info) => (
          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a' }}>
            {String(info.getValue()).slice(0, 13)}...
          </span>
        ),
      },
      {
        accessorKey: 'source_video',
        header: 'Source Footage File',
        cell: (info) => (
          <span style={{ fontWeight: 600, color: '#0f172a' }}>
            📹 {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'frame_count',
        header: 'Total Frames',
        cell: (info) => (
          <span className="badge" style={{ background: '#f0fdf4', color: '#15803d', fontWeight: 800 }}>
            {info.getValue()} frames
          </span>
        ),
      },
      {
        accessorKey: 'frame_rate',
        header: 'Sampling FPS',
        cell: (info) => (
          <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
            {Number(info.getValue()).toFixed(1)} FPS
          </span>
        ),
      },
      {
        accessorKey: 'processed_at',
        header: 'CV Ingestion Timestamp',
        cell: (info) => {
          const val = info.getValue();
          try {
            return new Date(val).toLocaleString();
          } catch {
            return String(val);
          }
        },
      },
    ];
  }, [activeTable]);

  // TanStack Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Export current table view to CSV
  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((h) => {
          const val = row[h];
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `football_${activeTable}_top100.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Table Selector Sub-tabs & Summary Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#f8fafc',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Table Switching Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'player_observations', label: 'Player Tracking', icon: '🏃', count: '52.9k rows' },
            { id: 'frame_observations', label: 'Frame & Ball Pos', icon: '⚽', count: '2.8k rows' },
            { id: 'matches', label: 'Match Index', icon: '📋', count: '4 rows' },
          ].map((t) => {
            const isActive = activeTable === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTable(t.id);
                  setPagination({ pageIndex: 0, pageSize: 15 });
                  setGlobalFilter('');
                }}
                style={{
                  padding: '7px 13px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #1e3a8a' : '1px solid #cbd5e1',
                  background: isActive ? '#1e3a8a' : '#ffffff',
                  color: isActive ? '#ffffff' : '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                <span 
                  style={{
                    fontSize: '0.68rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b'
                  }}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls: Refresh & CSV Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => fetchTelemetry(activeTable)}
            disabled={loading}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Refresh database records"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportCsv}
            disabled={loading || data.length === 0}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: '1px solid #15803d',
              background: '#f0fdf4',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Export top 100 rows as CSV"
          >
            <FileSpreadsheet size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Filter and Data Info Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Quick Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
          <Search 
            size={14} 
            color="#94a3b8" 
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={`Filter ${activeTable} (e.g. frame, player ID, speed)...`}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              fontSize: '0.8rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Record count indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#64748b' }}>
          <span className="badge" style={{ background: '#eff6ff', color: '#1e3a8a', fontWeight: 800 }}>
            Showing top {data.length} observations
          </span>
          <span>from SQLite DB</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          padding: '10px 14px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>Error loading tracking table: {error}</span>
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '8px' }}>
            <RefreshCw size={24} color="#1e3a8a" />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Querying SQLite Tracking Database...</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Extracting top 100 entries from {activeTable}</div>
        </div>
      ) : (
        /* Data Grid Table with Sticky Header & Scrollable Container */
        <div style={{
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            maxHeight: '410px',
            overflowX: 'auto',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <table className="gov-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', margin: 0 }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const isSorted = header.column.getIsSorted();
                      return (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            padding: '10px 12px',
                            textAlign: 'left',
                            fontWeight: 800,
                            color: '#1e3a8a',
                            borderBottom: '2px solid #cbd5e1',
                            cursor: canSort ? 'pointer' : 'default',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            background: '#f8fafc'
                          }}
                        >
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <span style={{ color: isSorted ? '#1e3a8a' : '#cbd5e1' }}>
                                {isSorted === 'asc' ? <ArrowUp size={13} /> : isSorted === 'desc' ? <ArrowDown size={13} /> : <ArrowUpDown size={12} />}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row, rIdx) => (
                    <tr 
                      key={row.id} 
                      style={{ 
                        background: rIdx % 2 === 0 ? '#ffffff' : '#fcfdfe',
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.1s ease'
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td 
                          key={cell.id} 
                          style={{ 
                            padding: '8px 12px', 
                            whiteSpace: 'nowrap',
                            verticalAlign: 'middle'
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={columns.length} 
                      style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}
                    >
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Rows-Per-Page Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '10px 14px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            gap: '10px',
            fontSize: '0.78rem'
          }}>
            {/* Rows info */}
            <div style={{ color: '#64748b' }}>
              Showing{' '}
              <strong>
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </strong>{' '}
              to{' '}
              <strong>
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </strong>{' '}
              of <strong>{table.getFilteredRowModel().rows.length}</strong> filtered rows
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Page size selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#64748b' }}>Show:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  style={{
                    padding: '3px 6px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.75rem',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {[10, 15, 25, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize} rows
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Navigator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  style={{
                    padding: '4px 6px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                    opacity: table.getCanPreviousPage() ? 1 : 0.4
                  }}
                  title="First page"
                >
                  <ChevronsLeft size={14} />
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                    opacity: table.getCanPreviousPage() ? 1 : 0.4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.74rem'
                  }}
                >
                  <ChevronLeft size={14} /> Prev
                </button>

                <span style={{ padding: '0 6px', color: '#1e3a8a', fontWeight: 800 }}>
                  Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
                </span>

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                    opacity: table.getCanNextPage() ? 1 : 0.4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.74rem'
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  style={{
                    padding: '4px 6px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                    opacity: table.getCanNextPage() ? 1 : 0.4
                  }}
                  title="Last page"
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
