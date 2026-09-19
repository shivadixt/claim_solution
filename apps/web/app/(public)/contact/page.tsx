'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to submit enquiry. Please check your inputs.');
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
      setIsLoading(false);
    } catch (err) {
      setError('An unexpected network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header Navigation */}
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand-logo">
            <span>ARD</span>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>
              CLAIM SOLUTION
            </span>
          </Link>

          <div className="header-actions">
            <Link href="/" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
              ← Home
            </Link>
            <Link href="/login" className="btn btn-navy" style={{ fontSize: '0.875rem' }}>
              Client Login
            </Link>
          </div>
        </div>
      </header>

      <main className="section" style={{ minHeight: 'calc(100vh - 160px)' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="overline-tag">B2B Consultation</span>
            <h1 className="section-title" style={{ margin: '0 0 12px 0' }}>
              Request a Consultation
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Connect with our healthcare claims investigation, audit, and recovery team to discuss your organization&apos;s requirements.
            </p>
          </div>

          {isSubmitted ? (
            <div
              role="status"
              id="contact-success-message"
              style={{
                padding: '36px',
                borderRadius: '20px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #10b981',
                color: '#065f46',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✓</div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 700 }}>
                Enquiry Submitted Successfully
              </h2>
              <p style={{ margin: '0 0 24px 0', fontSize: '1rem', lineHeight: 1.5, color: '#047857' }}>
                Thank you for reaching out. Our claims operations team will review your details and respond within 1 business day.
              </p>
              <button
                type="button"
                className="btn btn-navy"
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setCompany('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
              >
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(11, 25, 44, 0.05)',
              }}
            >
              {error && (
                <div
                  role="alert"
                  id="contact-error-message"
                  style={{
                    padding: '12px 16px',
                    marginBottom: '24px',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #ef4444',
                    color: '#991b1b',
                    fontSize: '0.875rem',
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="name" style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)' }}>
                    Full Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. Rahul Sharma"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="company" style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)' }}>
                    Company / Insurance Firm <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. Star Health Insurance"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)' }}>
                    Work Email Address <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="name@company.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="phone" style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)' }}>
                    Phone Number <span style={{ color: '#6b7280', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label htmlFor="message" style={{ fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--navy-dark)' }}>
                    Enquiry Details <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                    placeholder="Briefly describe your claims portfolio, volume, or specific investigation/audit requirements..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      outline: 'none',
                    }}
                  />
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
                  }}
                >
                  {isLoading ? 'Submitting enquiry...' : 'Submit Consultation Request'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
