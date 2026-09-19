'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type CaseItem = {
  id: string;
  claimNumber: string;
  policyNumber: string;
  claimType: string;
  claimAmount: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'ASSIGNED' | string;
  dueDate: string | null;
  createdAt: string;
  claimant: {
    firstName: string;
    lastName: string;
  };
  provider: {
    name: string;
    hospital: {
      name: string;
    };
  };
};

export default function ClientPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to fetch cases');
        setIsLoading(false);
        return;
      }

      setCases(data.cases || []);
    } catch (err) {
      setError('Network error loading cases.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <>
      {/* Header Navigation */}
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/client" className="brand-logo">
            <span>ARD</span>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>
              CLIENT PORTAL
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <span className="overline-tag" style={{ marginBottom: '4px' }}>Client Dashboard</span>
            <h1 className="section-title" style={{ margin: '0 0 6px 0' }}>
              Submitted Healthcare Claims
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Track investigation progress, triage status, and audit reports for your portfolio.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={fetchCases}
              disabled={isLoading}
              className="btn btn-outline"
              style={{ fontSize: '0.9rem' }}
            >
              🔄 Refresh
            </button>
            <Link href="/client/cases/new" className="btn btn-navy">
              + Create New Case
            </Link>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              padding: '12px 16px',
              marginBottom: '24px',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              border: '1px solid #f87171',
            }}
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading submitted claims...
          </div>
        ) : cases.length === 0 ? (
          <div
            style={{
              padding: '56px 40px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--navy-dark)' }}>
              No cases submitted yet
            </h3>
            <p style={{ fontSize: '0.95rem', margin: '0 0 24px 0', color: 'var(--text-muted)' }}>
              You have not submitted any healthcare claims for investigation.
            </p>
            <Link href="/client/cases/new" className="btn btn-navy">
              Create Your First Case
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.9rem',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Claim / Policy</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Type & Amount</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Claimant & Hospital</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Priority</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Status</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Due Date</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => {
                  const isNew = c.status === 'NEW';
                  const formattedDueDate = c.dueDate
                    ? new Date(c.dueDate).toLocaleDateString()
                    : null;
                  const formattedCreatedDate = new Date(c.createdAt).toLocaleDateString();

                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ display: 'block', color: 'var(--navy-dark)' }}>
                          {c.claimNumber}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Pol: {c.policyNumber}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          className={`badge ${c.claimType === 'CASHLESS' ? 'badge-gold' : 'badge-blue'}`}
                        >
                          {c.claimType}
                        </span>
                        <div style={{ fontWeight: 700, color: '#059669', marginTop: '4px' }}>
                          ₹{Number(c.claimAmount).toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div>
                          <strong>
                            {c.claimant?.firstName} {c.claimant?.lastName}
                          </strong>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          🏥 {c.provider?.hospital?.name || c.provider?.name}
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          className={`badge ${c.priority === 'CRITICAL' || c.priority === 'HIGH' ? 'badge-red' : 'badge-blue'}`}
                        >
                          {c.priority}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          className={`badge ${isNew ? 'badge-amber' : 'badge-blue'}`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>
                        {formattedDueDate ? (
                          <span style={{ color: 'var(--navy-dark)', fontWeight: 600 }}>
                            {formattedDueDate}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                            Pending Triage
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {formattedCreatedDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
