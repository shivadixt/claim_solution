'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Redirect user to their respective portal based on role
      if (data.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else if (data.role === 'CLIENT_ADMIN') {
        router.push('/client');
      } else if (data.role === 'OPERATIONS_ADMIN') {
        router.push('/ops');
      } else {
        router.push('/');
      }
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
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(11, 25, 44, 0.08)',
            padding: '40px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="overline-tag" style={{ marginBottom: '8px' }}>Portal Authentication</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-dark)', margin: '0 0 8px 0' }}>
              Sign in to Account
            </h1>
            <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-muted)' }}>
              Enter your credentials to access your portal.
            </p>
          </div>

          {error && (
            <div
              id="login-error-message"
              role="alert"
              style={{
                padding: '12px 16px',
                marginBottom: '24px',
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #f87171',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy-dark)', marginBottom: '6px' }}
              >
                Work Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="name@company.com"
                required
                disabled={isLoading}
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
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy-dark)', marginBottom: '6px' }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••••••"
                required
                disabled={isLoading}
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

            <button
              type="submit"
              className="btn btn-navy"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in to Portal'}
            </button>
          </form>

          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            Need assistance? <Link href="/contact" style={{ color: 'var(--gold-accent)', fontWeight: 600 }}>Request Support</Link>
          </div>
        </div>
      </main>
    </>
  );
}
