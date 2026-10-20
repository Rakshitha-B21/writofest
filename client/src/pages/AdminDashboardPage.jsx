
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminRegistrations,
  exportRegistrations,
  adminLogout,
} from '../services/api';
import {
  LogOut,
  Download,
  Search,
  RefreshCw,
  PenLine,
  Mic,
  Brain,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

// IMPORTANT: These keys must match the backend event slugs.
const EVENT_META = {
  writing: {
    icon: PenLine,
    label: 'Ink Your Script',
    color: '#873747',
  },
  'open-mic': {
    icon: Mic,
    label: 'Open Mic',
    color: '#C69A69',
  },
  quiz: {
    icon: Brain,
    label: 'The Art of Knowing',
    color: '#873747',
  },
};

const PAGE_SIZE = 20;

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [total, setTotal] = useState(0);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    byEvent: {},
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);

    getAdminRegistrations({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      event: filterEvent || undefined,
    })
      .then((res) => {
        if (!active) return;

        const data = res.data?.data;

        setRegistrations(
          Array.isArray(data?.registrations)
            ? data.registrations
            : []
        );

        setTotal(data?.total ?? 0);
        setSummaryStats(
          data?.stats ?? { total: 0, byEvent: {} }
        );
      })
      .catch(() => {
        if (active) {
          toast.error('Failed to load registrations.');
        }
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
      toast.error(
        'Could not reach the server; your local session has ended.'
      );
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

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success('Export downloaded!');
    } catch {
      toast.error('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  const eventStats = Object.entries(EVENT_META).map(
    ([slug, meta]) => ({
      slug,
      ...meta,
      count: Number(summaryStats.byEvent?.[slug] ?? 0),
    })
  );

  // Supports both the current events array and older records
  // that store selected events as a comma-separated string.
  const getRegistrationEvents = (reg) => {
    const selectedEvents = Array.isArray(reg.events)
      ? reg.events
      : typeof reg.event === 'string'
        ? reg.event.split(',')
        : [];

    return [
      ...new Set(
        selectedEvents
          .map((event) => String(event).trim())
          .filter(Boolean)
      ),
    ];
  };

  return (
    <main className="min-h-screen bg-[#0D0B09]">
      <header className="sticky top-0 z-40 border-b border-[rgba(198,154,105,0.15)] bg-[#101010]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
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

            <span className="mx-1 text-sm text-[#F6EBDD]/20">
              /
            </span>

            <span className="text-xs font-medium uppercase tracking-widest text-[#C69A69]">
              Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="hidden items-center gap-2 rounded-sm border border-[rgba(198,154,105,0.3)] px-4 py-2 text-xs uppercase tracking-widest text-[#C69A69] transition-all duration-200 hover:bg-[rgba(198,154,105,0.08)] disabled:opacity-50 sm:flex"
            >
              <Download size={13} />
              {exporting ? 'Exporting…' : 'Export CSV'}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-sm border border-[rgba(135,55,71,0.3)] px-4 py-2 text-xs uppercase tracking-widest text-[#873747] transition-all duration-200 hover:bg-[rgba(135,55,71,0.1)]"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        {/* Event statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {eventStats.map(
            ({ slug, icon: Icon, label, color, count }) => (
              <div
                key={slug}
                className="space-y-2 rounded-sm border border-[rgba(198,154,105,0.1)] bg-[#1A1512] p-4"
              >
                <div className="flex items-center justify-between">
                  <Icon
                    size={16}
                    style={{ color }}
                    strokeWidth={1.5}
                  />

                  <span
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color,
                    }}
                  >
                    {count}
                  </span>
                </div>

                <p className="text-xs tracking-wide text-[#F6EBDD]/50">
                  {label}
                </p>
              </div>
            )
          )}
        </div>

        {/* Total registrations */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-[rgba(198,154,105,0.15)] to-transparent" />

          <span className="text-xs uppercase tracking-widest text-[#C69A69]">
            {summaryStats.total} Total Registrations
          </span>

          <div className="h-px flex-1 bg-gradient-to-l from-[rgba(198,154,105,0.15)] to-transparent" />
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
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
              className="w-full rounded-sm border border-[rgba(198,154,105,0.15)] bg-[#1A1512] py-2.5 pl-9 pr-4 text-sm text-[#F6EBDD] outline-none transition-colors placeholder:text-[#F6EBDD]/25 focus:border-[#C69A69]"
            />
          </div>

          <select
            value={filterEvent}
            onChange={(e) => {
              setLoading(true);
              setFilterEvent(e.target.value);
              setPage(1);
            }}
            className="rounded-sm border border-[rgba(198,154,105,0.15)] bg-[#1A1512] px-4 py-2.5 text-sm text-[#F6EBDD]/80 outline-none transition-colors focus:border-[#C69A69]"
          >
            <option value="">All Events</option>

            {Object.entries(EVENT_META).map(
              ([slug, { label }]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              )
            )}
          </select>

          <button
            onClick={() => {
              setLoading(true);
              setRefreshKey((key) => key + 1);
            }}
            className="flex items-center gap-2 rounded-sm border border-[rgba(198,154,105,0.2)] px-4 py-2.5 text-sm text-[#F6EBDD]/60 transition-all duration-200 hover:border-[rgba(198,154,105,0.4)] hover:text-[#C69A69]"
          >
            <RefreshCw
              size={14}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {/* Registrations table */}
        <div className="overflow-hidden rounded-sm border border-[rgba(198,154,105,0.1)] bg-[#1A1512]">
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
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#C69A69]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#C69A69] border-t-transparent" />

                        <span className="text-xs text-[#F6EBDD]/40">
                          Loading…
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && registrations.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center">
                      <p className="text-sm text-[#F6EBDD]/30">
                        No registrations found.
                      </p>
                    </td>
                  </tr>
                )}

                {!loading &&
                  registrations.map((reg, idx) => {
                    const selectedEvents = getRegistrationEvents(reg);

                    return (
                      <tr
                        key={reg._id || reg.id || idx}
                        className="border-b border-[rgba(198,154,105,0.05)] transition-colors hover:bg-[rgba(198,154,105,0.03)]"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#F6EBDD]/30">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#C69A69]">
                          {reg.registrationId}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 font-medium text-[#F6EBDD]">
                          {reg.name}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#F6EBDD]/60">
                          {reg.usn}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-[#F6EBDD]/60">
                          {reg.email}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-[#F6EBDD]/60">
                          {reg.phone}
                        </td>

                        <td className="max-w-[180px] truncate px-4 py-3 text-[#F6EBDD]/60">
                          {reg.institution}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-[#F6EBDD]/60">
                          {reg.year}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex min-w-max flex-wrap gap-1.5">
                            {selectedEvents.length > 0 ? (
                              selectedEvents.map((event) => {
                                const meta = EVENT_META[event];
                                const Icon = meta?.icon;
                                const color = meta?.color || '#F6EBDD';

                                return (
                                  <span
                                    key={event}
                                    className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium"
                                    style={{
                                      color,
                                      background:
                                        color === '#873747'
                                          ? 'rgba(135,55,71,0.12)'
                                          : color === '#C69A69'
                                            ? 'rgba(198,154,105,0.12)'
                                            : 'rgba(246,235,221,0.08)',
                                    }}
                                  >
                                    {Icon && (
                                      <Icon
                                        size={11}
                                        strokeWidth={2}
                                      />
                                    )}

                                    {meta?.label || event}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-[#F6EBDD]/40">
                                —
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-xs text-[#F6EBDD]/40">
                          {reg.createdAt
                            ? new Date(reg.createdAt).toLocaleDateString(
                                'en-IN',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-[rgba(198,154,105,0.1)] px-4 py-3 text-xs text-[#F6EBDD]/40">
            {total} matching registration
            {total === 1 ? '' : 's'}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[rgba(198,154,105,0.1)] px-4 py-3">
              <span className="text-xs text-[#F6EBDD]/30">
                Page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-sm border border-[rgba(198,154,105,0.2)] p-1.5 text-[#F6EBDD]/50 transition-all hover:border-[rgba(198,154,105,0.4)] hover:text-[#C69A69] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                  className="rounded-sm border border-[rgba(198,154,105,0.2)] p-1.5 text-[#F6EBDD]/50 transition-all hover:border-[rgba(198,154,105,0.4)] hover:text-[#C69A69] disabled:cursor-not-allowed disabled:opacity-30"
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
