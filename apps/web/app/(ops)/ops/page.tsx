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
  version: number;
  createdAt: string;
  client: {
    companyName: string;
  };
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
  assignments?: Array<{
    id: string;
    investigator: {
      email: string;
      firstName: string;
      lastName: string;
    };
  }>;
};

type InvestigatorUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export default function OpsQueuePage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [investigators, setInvestigators] = useState<InvestigatorUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Active Action Modal/Panel State
  const [activeTriageCase, setActiveTriageCase] = useState<CaseItem | null>(
    null,
  );
  const [triagePriority, setTriagePriority] = useState<
    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  >('MEDIUM');
  const [triageRiskLevel, setTriageRiskLevel] = useState<
    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  >('MEDIUM');

  const [activeAssignCase, setActiveAssignCase] = useState<CaseItem | null>(
    null,
  );
  const [selectedInvestigatorId, setSelectedInvestigatorId] =
    useState<string>('');
  const [assignNotes, setAssignNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQueueData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [casesRes, invRes] = await Promise.all([
        fetch('/api/cases'),
        fetch('/api/users/investigators'),
      ]);

      const casesData = await casesRes.json();
      const invData = await invRes.json();

      if (!casesRes.ok || !casesData.success) {
        setError(casesData.error || 'Failed to fetch cases queue');
        setIsLoading(false);
        return;
      }

      setCases(casesData.cases || []);

      if (invRes.ok && invData.success && invData.investigators) {
        setInvestigators(invData.investigators);
        if (invData.investigators.length > 0) {
          setSelectedInvestigatorId(invData.investigators[0].id);
        }
      }
    } catch (err) {
      setError('Network error loading Operations Queue data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, []);

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTriageCase) return;

    setIsSubmitting(true);
    setBannerNotice(null);

    try {
      const res = await fetch(`/api/cases/${activeTriageCase.id}/triage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: triagePriority,
          riskLevel: triageRiskLevel,
          version: activeTriageCase.version,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setBannerNotice(
          '⚠️ Version Conflict: Another user updated this case. Refreshing queue...',
        );
        setActiveTriageCase(null);
        await fetchQueueData();
        return;
      }

      if (!res.ok || !data.success) {
        setBannerNotice(`❌ Triage Error: ${data.error || 'Failed to triage'}`);
        return;
      }

      // Update case state in local queue
      setCases((prev) =>
        prev.map((c) => (c.id === data.case.id ? data.case : c)),
      );
      setBannerNotice(
        `✓ Case ${data.case.claimNumber} triaged successfully! SLA Due Date: ${new Date(data.case.dueDate).toLocaleDateString()}`,
      );
      setActiveTriageCase(null);
    } catch (err) {
      setBannerNotice('❌ Unexpected error during triage submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignCase || !selectedInvestigatorId) return;

    setIsSubmitting(true);
    setBannerNotice(null);

    try {
      const res = await fetch(`/api/cases/${activeAssignCase.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investigatorId: selectedInvestigatorId,
          version: activeAssignCase.version,
          notes: assignNotes.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setBannerNotice(
          '⚠️ Version Conflict: Another user updated this case. Refreshing queue...',
        );
        setActiveAssignCase(null);
        await fetchQueueData();
        return;
      }

      if (!res.ok || !data.success) {
        setBannerNotice(`❌ Assignment Error: ${data.error || 'Failed to assign'}`);
        return;
      }

      // Update case state in local queue
      setCases((prev) =>
        prev.map((c) => (c.id === data.case.id ? data.case : c)),
      );
      setBannerNotice(
        `✓ Case ${data.case.claimNumber} assigned to field investigator! Status: ${data.case.status}`,
      );
      setActiveAssignCase(null);
      setAssignNotes('');
    } catch (err) {
      setBannerNotice('❌ Unexpected error during assignment submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header Navigation */}
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/ops" className="brand-logo">
            <span>ARD</span>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>
              OPERATIONS PORTAL
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
            <span className="overline-tag" style={{ marginBottom: '4px' }}>Queue Management</span>
            <h1 className="section-title" style={{ margin: '0 0 6px 0' }}>
              Operations Case Queue
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Triage new incoming claims, calculate SLA due dates, and assign field investigators.
            </p>
          </div>

          <button
            onClick={fetchQueueData}
            disabled={isLoading}
            className="btn btn-outline"
            style={{ fontSize: '0.9rem' }}
          >
            🔄 Refresh Queue
          </button>
        </div>

        {bannerNotice && (
          <div
            role="status"
            style={{
              padding: '14px 20px',
              marginBottom: '24px',
              borderRadius: '10px',
              backgroundColor: bannerNotice.startsWith('✓') ? '#ecfdf5' : '#fee2e2',
              color: bannerNotice.startsWith('✓') ? '#047857' : '#b91c1c',
              border: `1px solid ${bannerNotice.startsWith('✓') ? '#10b981' : '#f87171'}`,
              fontWeight: 600,
              fontSize: '0.925rem',
            }}
          >
            {bannerNotice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            style={{
              padding: '14px 20px',
              marginBottom: '24px',
              borderRadius: '10px',
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
            Loading Operations Queue...
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
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📥</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--navy-dark)' }}>
              No cases found in the queue
            </h3>
            <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-muted)' }}>
              All client claims have been processed or none have been submitted yet.
            </p>
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
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Client</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Claimant & Provider</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Priority & Risk</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Status & SLA</th>
                  <th style={{ padding: '16px 20px', color: 'var(--navy-dark)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => {
                  const isNew = c.status === 'NEW';
                  const formattedDueDate = c.dueDate
                    ? new Date(c.dueDate).toLocaleDateString()
                    : null;

                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: isNew ? '#ffffff' : '#fafafc',
                      }}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ display: 'block', color: 'var(--navy-dark)' }}>
                          {c.claimNumber}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Pol: {c.policyNumber} | {c.claimType}
                        </span>
                        <div style={{ fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                          ₹{Number(c.claimAmount).toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--navy-dark)' }}>
                        {c.client?.companyName}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div>
                          <strong>
                            {c.claimant?.firstName} {c.claimant?.lastName}
                          </strong>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          🏥 {c.provider?.hospital?.name} ({c.provider?.name})
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ marginBottom: '4px' }}>
                          <span className={`badge ${c.priority === 'CRITICAL' || c.priority === 'HIGH' ? 'badge-red' : 'badge-blue'}`}>
                            P: {c.priority}
                          </span>
                        </div>
                        <div>
                          <span className={`badge ${c.riskLevel === 'CRITICAL' || c.riskLevel === 'HIGH' ? 'badge-amber' : 'badge-gold'}`}>
                            R: {c.riskLevel || 'UNSET'}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ marginBottom: '4px' }}>
                          <span className={`badge ${isNew ? 'badge-amber' : 'badge-blue'}`}>
                            {c.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {formattedDueDate ? (
                            <span>📅 Due: <strong>{formattedDueDate}</strong></span>
                          ) : (
                            <span style={{ color: '#d97706', fontStyle: 'italic' }}>
                              Needs Triage (No SLA)
                            </span>
                          )}
                        </div>
                        {c.assignments && c.assignments.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '2px', fontWeight: 600 }}>
                            👤 {c.assignments[0].investigator.firstName}{' '}
                            {c.assignments[0].investigator.lastName}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => {
                              setActiveTriageCase(c);
                              setTriagePriority(c.priority);
                              setTriageRiskLevel(c.riskLevel || 'MEDIUM');
                            }}
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Triage SLA
                          </button>
                          {isNew && (
                            <button
                              onClick={() => {
                                setActiveAssignCase(c);
                              }}
                              className="btn btn-navy"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              Assign Field
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Triage Modal Dialog */}
        {activeTriageCase && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(11, 25, 44, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <h3 style={{ margin: '0 0 6px 0', color: 'var(--navy-dark)', fontSize: '1.35rem' }}>
                Triage Case #{activeTriageCase.claimNumber}
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Updating priority and risk level will calculate SLA due date based on client tier.
              </p>

              <form onSubmit={handleTriageSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--navy-dark)' }}>
                    Priority Level
                  </label>
                  <select
                    value={triagePriority}
                    onChange={(e) => setTriagePriority(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--navy-dark)' }}>
                    Risk Level
                  </label>
                  <select
                    value={triageRiskLevel}
                    onChange={(e) => setTriageRiskLevel(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTriageCase(null)}
                    className="btn btn-outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-navy"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Triage'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assignment Modal Dialog */}
        {activeAssignCase && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(11, 25, 44, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <h3 style={{ margin: '0 0 6px 0', color: 'var(--navy-dark)', fontSize: '1.35rem' }}>
                Assign Investigator to Case #{activeAssignCase.claimNumber}
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Select an active field investigator for on-ground verification.
              </p>

              <form onSubmit={handleAssignSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--navy-dark)' }}>
                    Field Investigator
                  </label>
                  <select
                    value={selectedInvestigatorId}
                    onChange={(e) => setSelectedInvestigatorId(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  >
                    {investigators.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.firstName} {inv.lastName} ({inv.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--navy-dark)' }}>
                    Assignment Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={assignNotes}
                    onChange={(e) => setAssignNotes(e.target.value)}
                    placeholder="Specific hospital check directions or patient verification notes..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setActiveAssignCase(null)}
                    className="btn btn-outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-navy"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
