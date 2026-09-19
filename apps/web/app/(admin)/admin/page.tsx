import Link from 'next/link';

export default function AdminPage() {
  return (
    <>
      {/* Header Navigation */}
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/admin" className="brand-logo">
            <span>ARD</span>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>
              ADMIN CONSOLE
            </span>
          </Link>

          <div className="header-actions">
            <Link href="/" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
              Main Site
            </Link>
          </div>
        </div>
      </header>

      <main className="container section">
        <div style={{ marginBottom: '32px' }}>
          <span className="overline-tag">System Administration</span>
          <h1 className="section-title" style={{ margin: '0 0 6px 0' }}>
            Super Admin Console
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            System-wide configuration, tenant management, user management, and security audit trail.
          </p>
        </div>

        <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="card-light">
            <div className="card-icon">👥</div>
            <h3 className="card-heading">Users & Roles</h3>
            <p className="card-body">
              Manage accounts for Client Admins, Ops Admins, and Field Investigators across tenants.
            </p>
          </div>

          <div className="card-light">
            <div className="card-icon">🏢</div>
            <h3 className="card-heading">Client Companies</h3>
            <p className="card-body">
              Configure insurance clients, SLA TAT targets (days), and billing tier assignments.
            </p>
          </div>

          <div className="card-light">
            <div className="card-icon">📜</div>
            <h3 className="card-heading">Audit & Security Logs</h3>
            <p className="card-body">
              Review immutable audit trail, authentication logs, and case status transition history.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
