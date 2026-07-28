// Next.js Server Component (App Router)
async function fetchLeaveData() {
  console.log('[NEXT.JS SERVER] Triggering uncached SSR fetch to backend...');
  

  const res = await fetch('http://localhost:5001/api/leave/all', {
    cache: 'no-store' 
  });

  if (!res.ok) throw new Error('Failed to fetch leave records');
  return res.json();
}

export default async function DashboardPage() {
  const leaves = await fetchLeaveData();

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>HR Leave Request Portal (Next.js TR3 Challenge)</h1>
      <p style={{ color: '#666' }}>Total Leave Records Loaded: {leaves.length}</p>

      <div style={{ marginTop: '20px' }}>
        <h3>Recent Leave Submissions</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {leaves.slice(0, 10).map((item) => (
            <li key={item._id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <strong>{item.employeeName}</strong> ({item.leaveType}) - Status: <em>{item.status}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}