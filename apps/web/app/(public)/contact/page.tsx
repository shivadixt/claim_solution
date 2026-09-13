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
      <header className="container header">
        <strong>
          <Link href="/" style={{ textDecoration: 'none' }}>
            Claim Solution
          </Link>
        </strong>
        <nav aria-label="Main navigation">
          <Link href="/" style={{ marginRight: '16px' }}>
            Home
          </Link>
          <Link href="/login">Client login</Link>
        </nav>
      </header>

      <main>
        <section className="container section" style={{ maxWidth: '640px' }}>
          <h1>Request a Consultation</h1>
          <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '32px' }}>
            Connect with our healthcare claims investigation, audit, and recovery team to discuss your organization&apos;s requirements.
          </p>

          {isSubmitted ? (
            <div
              role="status"
              id="contact-success-message"
              style={{
                padding: '28px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #10b981',
                color: '#065f46',
              }}
            >
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>
                Enquiry Submitted
              </h2>
              <p style={{ margin: '0 0 20px 0', fontSize: '1rem', lineHeight: 1.5 }}>
                Thanks — we&apos;ll be in touch shortly.
              </p>
              <button
                type="button"
                className="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setCompany('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <div className="card" style={{ padding: '32px' }}>
              {error && (
                <div
                  role="alert"
                  id="contact-error-message"
                  style={{
                    padding: '12px 16px',
                    marginBottom: '24px',
                    borderRadius: '6px',
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
                <p style={{ marginTop: 0 }}>
                  <label htmlFor="name" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
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
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '1rem',
                    }}
                  />
                </p>

                <p>
                  <label htmlFor="company" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
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
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '1rem',
                    }}
                  />
                </p>

                <p>
                  <label htmlFor="email" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Work Email <span style={{ color: '#dc2626' }}>*</span>
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
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '1rem',
                    }}
                  />
                </p>

                <p>
                  <label htmlFor="phone" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
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
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '1rem',
                    }}
                  />
                </p>

                <p>
                  <label htmlFor="message" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
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
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </p>

                <button
                  type="submit"
                  className="button"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    marginTop: '8px',
                  }}
                >
                  {isLoading ? 'Submitting enquiry...' : 'Submit Consultation Request'}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
