import Link from 'next/link';
import { redirect } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { getToken, getSession } from '../../lib/auth';
import { logoutAction } from '../actions';
import ApproveButton from './ApproveButton';

const PAGE_SIZE = 10;
const STATUSES = ['', 'Pending', 'Approved', 'Rejected'];

// User-specific, auth-scoped data: don't share a cache across users.
export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }) {
  const session = getSession();
  if (!session) redirect('/login');

  const token = getToken();
  const page = Math.max(1, parseInt(searchParams?.page || '1', 10) || 1);
  const status = STATUSES.includes(searchParams?.status || '') ? searchParams?.status || '' : '';

  const qs = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (status) qs.set('status', status);

  let data;
  try {
    // Fetch only the page we render (10 rows) instead of the whole collection.
    data = await apiFetch(`/api/leave/all?${qs.toString()}`, { token, cache: 'no-store' });
  } catch (err) {
    if (err.status === 401) redirect('/login');
    throw err;
  }

  const { items, pagination } = data;
  const isAdmin = session.role === 'Admin';

  const linkFor = (p) => {
    const params = new URLSearchParams();
    params.set('page', String(p));
    if (status) params.set('status', status);
    return `/dashboard?${params.toString()}`;
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header-row">
          <div>
            <h1>HR Leave Request Portal</h1>
            <p className="muted">
              Signed in as <strong>{session.userId}</strong> ({session.role}) · Showing{' '}
              {items.length} of {pagination.total} records
            </p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="btn">Sign out</button>
          </form>
        </div>

        <div className="header-row" style={{ marginTop: 16 }}>
          <div className="muted">Filter by status:</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {STATUSES.map((s) => (
              <Link
                key={s || 'all'}
                href={`/dashboard?${new URLSearchParams(s ? { status: s } : {}).toString()}`}
                className="btn"
                style={s === status ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : undefined}
              >
                {s || 'All'}
              </Link>
            ))}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Status</th>
              {isAdmin && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="muted">No leave records found.</td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <strong>{item.employeeName}</strong>
                  <div className="muted">{item.employeeId}</div>
                </td>
                <td>{item.leaveType}</td>
                <td>{item.startDate} → {item.endDate}</td>
                <td><span className={`badge ${item.status}`}>{item.status}</span></td>
                {isAdmin && (
                  <td>{item.status === 'Pending' ? <ApproveButton id={item._id} /> : <span className="muted">—</span>}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {page > 1 ? (
            <Link href={linkFor(page - 1)} className="btn">← Prev</Link>
          ) : (
            <span className="btn" aria-disabled="true">← Prev</span>
          )}
          <span className="muted">Page {pagination.page} of {pagination.totalPages}</span>
          {page < pagination.totalPages ? (
            <Link href={linkFor(page + 1)} className="btn">Next →</Link>
          ) : (
            <span className="btn" aria-disabled="true">Next →</span>
          )}
        </div>
      </div>
    </div>
  );
}
