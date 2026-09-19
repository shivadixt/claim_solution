'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewCasePage() {
  const [claimNumber, setClaimNumber] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [claimType, setClaimType] = useState<'CASHLESS' | 'REIMBURSEMENT'>(
    'CASHLESS',
  );
  const [claimAmount, setClaimAmount] = useState('');
  const [priority, setPriority] = useState<
    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  >('MEDIUM');
  const [claimantFirstName, setClaimantFirstName] = useState('');
  const [claimantLastName, setClaimantLastName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [hospitalName, setHospitalName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCase, setCreatedCase] = useState<{
    id: string;
    claimNumber: string;
    claimType: string;
    status: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setCreatedCase(null);

    // Client-side Validation
    if (
      !claimNumber.trim() ||
      !policyNumber.trim() ||
      !claimAmount.trim() ||
      !claimantFirstName.trim() ||
      !claimantLastName.trim() ||
      !providerName.trim() ||
      !hospitalName.trim()
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    const numAmount = parseFloat(claimAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Claim amount must be a positive number.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claimNumber: claimNumber.trim(),
          policyNumber: policyNumber.trim(),
          claimType,
          claimAmount: numAmount,
          priority,
          claimant: {
            firstName: claimantFirstName.trim(),
            lastName: claimantLastName.trim(),
          },
          provider: {
            name: providerName.trim(),
            hospitalName: hospitalName.trim(),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create case');
        setIsLoading(false);
        return;
      }

      setCreatedCase({
        id: data.case.id,
        claimNumber: data.case.claimNumber,
        claimType: data.case.claimType,
        status: data.case.status,
      });

      // Reset form fields
      setClaimNumber('');
      setPolicyNumber('');
      setClaimAmount('');
      setClaimantFirstName('');
      setClaimantLastName('');
      setProviderName('');
      setHospitalName('');
    } catch (err) {
      setError('An unexpected network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Link href="/client" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
              ← Back to Case List
            </Link>
          </div>
        </div>
      </header>

      <main className="section">
        <div className="container" style={{ maxWidth: '680px' }}>
          <div style={{ marginBottom: '32px' }}>
            <span className="overline-tag">Case Intake Form</span>
            <h1 className="section-title" style={{ margin: '0 0 6px 0' }}>
              Create New Investigation Case
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Submit a new healthcare claim for field investigation and verification.
            </p>
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
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          {createdCase && (
            <div
              role="status"
              style={{
                padding: '24px',
                marginBottom: '28px',
                borderRadius: '16px',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #10b981',
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', fontWeight: 700 }}>
                ✓ Case Created Successfully!
              </h3>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                <p style={{ margin: '2px 0' }}><strong>Case ID:</strong> {createdCase.id}</p>
                <p style={{ margin: '2px 0' }}><strong>Claim Number:</strong> {createdCase.claimNumber}</p>
                <p style={{ margin: '2px 0' }}><strong>Claim Type:</strong> {createdCase.claimType}</p>
                <p style={{ margin: '2px 0' }}><strong>Status:</strong> {createdCase.status}</p>
              </div>
              <div style={{ marginTop: '16px' }}>
                <Link href="/client" className="btn btn-navy" style={{ fontSize: '0.85rem' }}>
                  View in Case List
                </Link>
              </div>
            </div>
          )}

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              padding: '40px',
              boxShadow: '0 20px 40px rgba(11, 25, 44, 0.05)',
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label
                    htmlFor="claimNumber"
                    style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)', fontSize: '0.9rem' }}
                  >
                    Claim Number <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="claimNumber"
                    type="text"
                    value={claimNumber}
                    onChange={(e) => setClaimNumber(e.target.value)}
                    placeholder="e.g. CLM-2026-8801"
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="policyNumber"
                    style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)', fontSize: '0.9rem' }}
                  >
                    Policy Number <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="policyNumber"
                    type="text"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    placeholder="e.g. POL-998811"
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label
                    htmlFor="claimType"
                    style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)', fontSize: '0.9rem' }}
                  >
                    Claim Type <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    id="claimType"
                    value={claimType}
                    onChange={(e) =>
                      setClaimType(e.target.value as 'CASHLESS' | 'REIMBURSEMENT')
                    }
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      backgroundColor: '#fff',
                      outline: 'none',
                    }}
                  >
                    <option value="CASHLESS">CASHLESS</option>
                    <option value="REIMBURSEMENT">REIMBURSEMENT</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)', fontSize: '0.9rem' }}
                  >
                    Priority <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) =>
                      setPriority(
                        e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
                      )
                    }
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      backgroundColor: '#fff',
                      outline: 'none',
                    }}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="claimAmount"
                  style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)', fontSize: '0.9rem' }}
                >
                  Claim Amount (₹) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  id="claimAmount"
                  type="number"
                  step="0.01"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="e.g. 75000"
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label
                    htmlFor="claimantFirstName"
                    style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)', fontSize: '0.9rem' }}
                  >
                    Claimant First Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="claimantFirstName"
                    type="text"
                    value={claimantFirstName}
                    onChange={(e) => setClaimantFirstName(e.target.value)}
                    placeholder="e.g. Rajesh"
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="claimantLastName"
                    style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)', fontSize: '0.9rem' }}
                  >
                    Claimant Last Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="claimantLastName"
                    type="text"
                    value={claimantLastName}
                    onChange={(e) => setClaimantLastName(e.target.value)}
                    placeholder="e.g. Sharma"
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label
                    htmlFor="providerName"
                    style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)', fontSize: '0.9rem' }}
                  >
                    Doctor / Provider Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="providerName"
                    type="text"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder="e.g. Dr. A. K. Verma"
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="hospitalName"
                    style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)', fontSize: '0.9rem' }}
                  >
                    Hospital Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="hospitalName"
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. Max Super Speciality"
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-navy"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  marginTop: '8px',
                }}
              >
                {isLoading ? 'Submitting Case...' : 'Submit Case Intake'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
