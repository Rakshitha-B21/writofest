import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminRegistrations,
  exportRegistrations,
  adminLogout,
} from '../services/api';
import {
  LogOut, Download, Search, RefreshCw,
  PenLine, Zap, Mic, BookOpen, ChevronLeft, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const EVENT_META = {
  writing: { icon: PenLine, label: 'Writing', color: '#873747' },
  'pop-up-quiz': { icon: Zap, label: 'Pop-Up Quiz', color: '#C69A69' },
  'open-mic': { icon: Mic, label: 'Open Mic', color: '#873747' },
  storytelling: { icon: BookOpen, label: 'Storytelling', color: '#C69A69' },
};

const PAGE_SIZE = 20;

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [total, setTotal] = useState(0);
  const [summaryStats, setSummaryStats] = useState({ total: 0, byEvent: {} });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;

    getAdminRegistrations({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      event: filterEvent || undefined,
    })
      .then((res) => {
        if (!active) return;
        const data = res.data?.data;
        setRegistrations(Array.isArray(data?.registrations) ? data.registrations : []);
        setTotal(data?.total ?? 0);
        setSummaryStats(data?.stats ?? { total: 0, byEvent: {} });
      })
      .catch(() => {
        if (active) toast.error('Failed to load registrations.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, search, filterEvent, refreshKey]);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
      toast.error('Could not reach the server; your local session has ended.');
    }
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await exportRegistrations({
        search: search || undefined,
        event: filterEvent || undefined,
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `writofest-registrations-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded!');
    } catch {
      toast.error('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const eventStats = Object.entries(EVENT_META).map(([slug, meta]) => ({
    slug,
    ...meta,
    count: summaryStats.byEvent?.[slug] || 0,
  }));

  return (
    <main className="min-h-screen bg-[#0D0B09]">
      {/* Top bar */}
      <header className="bg-[#101010] border-b border-[rgba(198,154,105,0.15)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/scriptink-logo.jpeg"
              alt="ScriptInk logo"
              className="h-10 w-10 object-contain"
              />
            <span
              className="text-xl text-[#F6EBDD]"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              ScriptInk
            </span>
            <span className="text-[#F6EBDD]/20 text-sm mx-1">/</span>
            <span className="text-[#C69A69] text-xs tracking-widest uppercase font-medium">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-[rgba(198,154,105,0.3)] text-[#C69A69] hover:bg-[rgba(198,154,105,0.08)] text-xs tracking-widest uppercase rounded-sm transition-all duration-200 disabled:opacity-50"
            >
              <Download size={13} />
              {exporting ? 'Exporting…' : 'Export CSV'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-[rgba(135,55,71,0.3)] text-[#873747] hover:bg-[rgba(135,55,71,0.1)] text-xs tracking-widest uppercase rounded-sm transition-all duration-200"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {eventStats.map(({ slug, icon: Icon, label, color, count }) => (
            <div
              key={slug}
              className="bg-[#1A1512] border border-[rgba(198,154,105,0.1)] rounded-sm p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Icon size={16} style={{ color }} strokeWidth={1.5} />
                <span
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color }}
                >
                  {count}
                </span>
              </div>
              <p className="text-[#F6EBDD]/50 text-xs tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* Total summary */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-[rgba(198,154,105,0.15)] to-transparent" />
          <span className="text-[#C69A69] text-xs tracking-widest uppercase">
            {summaryStats.total} Total Registrations
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-[rgba(198,154,105,0.15)] to-transparent" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F6EBDD]/30"
            />
            <input
              type="search"
              placeholder="Search by student name, USN, or registration ID…"
              value={search}
              onChange={(e) => {
                setLoading(true);
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#1A1512] border border-[rgba(198,154,105,0.15)] rounded-sm pl-9 pr-4 py-2.5 text-[#F6EBDD] placeholder-[#F6EBDD]/25 text-sm outline-none focus:border-[#C69A69] transition-colors"
            />
          </div>
          <select
            value={filterEvent}
            onChange={(e) => {
              setLoading(true);
              setFilterEvent(e.target.value);
              setPage(1);
            }}
            className="bg-[#1A1512] border border-[rgba(198,154,105,0.15)] rounded-sm px-4 py-2.5 text-[#F6EBDD]/80 text-sm outline-none focus:border-[#C69A69] transition-colors"
          >
            <option value="">All Events</option>
            {Object.entries(EVENT_META).map(([slug, { label }]) => (
              <option key={slug} value={slug}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setLoading(true);
              setRefreshKey((key) => key + 1);
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(198,154,105,0.2)] text-[#F6EBDD]/60 hover:text-[#C69A69] hover:border-[rgba(198,154,105,0.4)] text-sm rounded-sm transition-all duration-200"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#1A1512] border border-[rgba(198,154,105,0.1)] rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(198,154,105,0.1)]">
                  {[
                    '#',
                    'Registration ID',
                    'Name',
                    'USN',
                    'Email',
                    'Phone',
                    'Institution',
                    'Year',
                    'Event',
                    'Date',
                  ].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-[#C69A69] tracking-widest uppercase font-medium px-4 py-3"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={10} className="text-center py-12">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-[#C69A69] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[#F6EBDD]/40 text-xs">Loading…</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && registrations.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-12">
                      <p className="text-[#F6EBDD]/30 text-sm">No registrations found.</p>
                    </td>
                  </tr>
                )}
                {!loading &&
                  registrations.map((reg, idx) => {
                    const meta = EVENT_META[reg.event];
                    const Icon = meta?.icon;
                    return (
                      <tr
                        key={reg._id || reg.id || idx}
                        className="border-b border-[rgba(198,154,105,0.05)] hover:bg-[rgba(198,154,105,0.03)] transition-colors"
                      >
                        <td className="px-4 py-3 text-[#F6EBDD]/30 text-xs font-mono">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </td>
                        <td className="px-4 py-3 text-[#C69A69] text-xs font-mono whitespace-nowrap">
                          {reg.registrationId}
                        </td>
                        <td className="px-4 py-3 text-[#F6EBDD] font-medium whitespace-nowrap">
                          {reg.name}
                        </td>
                        <td className="px-4 py-3 text-[#F6EBDD]/60 text-xs font-mono whitespace-nowrap">
                          {reg.usn}
                        </td>
                        <td className="px-4 py-3 text-[#F6EBDD]/60 whitespace-nowrap">
                          {reg.email}
                        </td>
                        <td className="px-4 py-3 text-[#F6EBDD]/60 whitespace-nowrap">
                          {reg.phone}
                        </td>
                        <td className="px-4 py-3 text-[#F6EBDD]/60 max-w-[180px] truncate">
                          {reg.institution}
                        </td>
                        <td className="px-4 py-3 text-[#F6EBDD]/60 whitespace-nowrap">
                          {reg.year}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-sm"
                            style={{
                              color: meta?.color || '#F6EBDD',
                              background: `rgba(${meta?.color === '#873747' ? '135,55,71' : '198,154,105'},0.12)`,
                            }}
                          >
                            {Icon && <Icon size={11} strokeWidth={2} />}
                            {meta?.label || reg.event}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#F6EBDD]/40 text-xs whitespace-nowrap">
                          {reg.createdAt
                            ? new Date(reg.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-[rgba(198,154,105,0.1)] text-[#F6EBDD]/40 text-xs">
            {total} matching registration{total === 1 ? '' : 's'}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(198,154,105,0.1)]">
              <span className="text-[#F6EBDD]/30 text-xs">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setLoading(true);
                    setPage((p) => Math.max(1, p - 1));
                  }}
                  disabled={page === 1}
                  className="p-1.5 rounded-sm border border-[rgba(198,154,105,0.2)] text-[#F6EBDD]/50 hover:text-[#C69A69] hover:border-[rgba(198,154,105,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => {
                    setLoading(true);
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-sm border border-[rgba(198,154,105,0.2)] text-[#F6EBDD]/50 hover:text-[#C69A69] hover:border-[rgba(198,154,105,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
