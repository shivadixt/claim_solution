import Link from 'next/link';

const services = [
  {
    name: 'Investigation Services',
    icon: '🔍',
    description: 'On-ground field verification for Cashless, Reimbursement & Hospital check claims with secure evidence capture.',
  },
  {
    name: 'Audit Services',
    icon: '⚖️',
    description: 'Clinical medical reviews, claim file audits, provider profiling, and analytical anomaly detection.',
  },
  {
    name: 'Recovery Support',
    icon: '🛡️',
    description: 'Evidence-led claims recovery support, exception resolution, and end-to-end audit tracking for insurers.',
  },
];

const pillars = [
  {
    title: 'Faster Investigation TAT',
    desc: 'Automated SLA tracking and field investigator tasking ensure swift turnaround times for claim decisions.',
  },
  {
    title: 'Central Evidence Repository',
    desc: 'Tamper-proof storage of hospital verification documents, staff statements, and field photographic proof.',
  },
  {
    title: 'Multi-Tier QC & Audit',
    desc: 'Every investigation undergoes medical reviewer audit and quality control before final report delivery.',
  },
  {
    title: 'Real-Time Case Tracking',
    desc: 'Transparent real-time progress updates from intake through field verification, audit, and final action.',
  },
];

export default function HomePage() {
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
            <span className="brand-badge">B2B</span>
          </Link>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#investigation">Investigation</a>
            <a href="#audit">Audit</a>
            <a href="#recovery">Recovery</a>
            <a href="#about">About</a>
          </nav>

          <div className="header-actions">
            <Link href="/login" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
              Client Login
            </Link>
            <Link href="/contact" className="btn btn-navy">
              Request Consultation
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-wrapper">
          <div className="container hero-grid">
            <div>
              <span className="overline-tag">Healthcare Claims Intelligence</span>
              <h1 className="hero-title">
                Investigation.
                <br />
                Audit. Recovery.
              </h1>
              <p className="hero-subtitle">
                Technology-enabled healthcare claims support for insurers, TPAs, hospitals and enterprise partners.
              </p>
              <div className="hero-buttons">
                <Link href="/contact" className="btn btn-navy" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  Request Consultation
                </Link>
                <a href="#services" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  Explore Services
                </a>
              </div>
            </div>

            {/* Right Hero Feature Card */}
            <div className="hero-dark-card">
              <div className="card-check-icon">✓</div>
              <h3 className="card-title">Evidence-led workflow</h3>
              <p className="card-flow-text">
                Case intake → Investigation → Audit → QC → Report → Recovery
              </p>
              <div
                style={{
                  marginTop: '32px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span className="badge badge-gold">TENANT-SCOPED</span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Enterprise RBAC & SLA Concurrency
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Services Section */}
        <section id="services" className="container section">
          <span className="overline-tag">Our Capabilities</span>
          <h2 className="section-title">Core Claims Support Services</h2>
          <p className="section-subtitle">
            Comprehensive end-to-end investigation, audit, and recovery solutions tailored for health insurance providers.
          </p>

          <div className="cards-grid">
            {services.map((s) => (
              <article className="card-light" key={s.name}>
                <span className="card-icon">{s.icon}</span>
                <h3 className="card-heading">{s.name}</h3>
                <p className="card-body">{s.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Investigation Services Section */}
        <section id="investigation" className="container section" style={{ borderTop: '1px solid #e2e8f0' }}>
          <span className="overline-tag">Field Operations</span>
          <h2 className="section-title">Claims Investigation</h2>
          <p className="section-subtitle">
            On-ground field verification across hospital networks and claimant addresses.
          </p>

          <div className="cards-grid">
            <div className="card-light">
              <h3 className="card-heading">Cashless Claim Verification</h3>
              <p className="card-body">
                Real-time active hospital admission checks, patient bed verification, and treating doctor interview documentation.
              </p>
            </div>
            <div className="card-light">
              <h3 className="card-heading">Reimbursement Claim Audit</h3>
              <p className="card-body">
                Post-discharge bill verification, pharmacy invoice validation, lab report authentication, and address verification.
              </p>
            </div>
            <div className="card-light">
              <h3 className="card-heading">Hospital & Doctor Checks</h3>
              <p className="card-body">
                Institutional registration verification, treating physician credentials audit, and historical claim frequency checks.
              </p>
            </div>
          </div>
        </section>

        {/* Audit Services Section */}
        <section id="audit" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container section">
            <span className="overline-tag">Clinical & Fraud Intelligence</span>
            <h2 className="section-title">Medical & Claim Audit</h2>
            <p className="section-subtitle">
              Specialized medical reviewers auditing clinical necessity and bill justification.
            </p>

            <div className="cards-grid">
              <div className="card-light" style={{ backgroundColor: '#fafafc' }}>
                <h3 className="card-heading">Claim File Audit</h3>
                <p className="card-body">
                  Deep review of line-item billing, excessive hospital charges, non-payable items, and treatment protocol adherence.
                </p>
              </div>
              <div className="card-light" style={{ backgroundColor: '#fafafc' }}>
                <h3 className="card-heading">Provider Profiling</h3>
                <p className="card-body">
                  Data-driven analysis of hospital billing anomalies, suspicious admission spikes, and network provider compliance.
                </p>
              </div>
              <div className="card-light" style={{ backgroundColor: '#fafafc' }}>
                <h3 className="card-heading">Analytical Audit</h3>
                <p className="card-body">
                  Algorithmic scoring of risk levels and automated anomaly flagging before final claim settlement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recovery Support Section */}
        <section id="recovery" className="container section">
          <span className="overline-tag">Financial Resolution</span>
          <h2 className="section-title">Recovery Support</h2>
          <p className="section-subtitle">
            Evidence-backed recovery assistance for fraudulent or inflated claims.
          </p>

          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="card-light">
              <h3 className="card-heading">Evidence Repository & Legal Docket</h3>
              <p className="card-body">
                Comprehensive case compilation including field photographs, signed statements, hospital register extracts, and medical audit notes.
              </p>
            </div>
            <div className="card-light">
              <h3 className="card-heading">Dispute & Recovery Tracking</h3>
              <p className="card-body">
                Structured workflow tracking for insurer recovery teams to track settlement recoveries and provider fraud actions.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="about" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container section">
            <span className="overline-tag">Why Claim Solution</span>
            <h2 className="section-title">Built for Enterprise Precision</h2>
            <p className="section-subtitle">
              Delivering standardized quality control, tamper-evident record verification, and predictable SLAs.
            </p>

            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {pillars.map((p) => (
                <div className="card-light" key={p.title} style={{ backgroundColor: '#fafafc' }}>
                  <h3 className="card-heading" style={{ fontSize: '1.15rem' }}>
                    {p.title}
                  </h3>
                  <p className="card-body">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="container section">
          <span className="overline-tag">End-to-End Execution</span>
          <h2 className="section-title">The 6-Step Case Lifecycle</h2>
          <p className="section-subtitle">
            From client submission to final report approval and recovery tracking.
          </p>

          <div className="pipeline-grid">
            <div className="pipeline-step">
              <span className="step-number">STEP 01</span>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--navy-dark)' }}>Client Intake</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Client submits cashless or reimbursement claim case.
              </p>
            </div>
            <div className="pipeline-step">
              <span className="step-number">STEP 02</span>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--navy-dark)' }}>Ops Triage</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Ops team tags priority/risk and sets SLA due date.
              </p>
            </div>
            <div className="pipeline-step">
              <span className="step-number">STEP 03</span>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--navy-dark)' }}>Field Assignment</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Investigator assigned for hospital & claimant verification.
              </p>
            </div>
            <div className="pipeline-step">
              <span className="step-number">STEP 04</span>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--navy-dark)' }}>Audit & Delivery</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Medical review and QC approval for client report delivery.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">ARD Claim Solution</div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8', maxWidth: '360px' }}>
                Technology-enabled healthcare claims support for insurers, TPAs, hospitals and enterprise partners across India.
              </p>
            </div>

            <div>
              <div className="footer-links-title">Services</div>
              <ul className="footer-links">
                <li><a href="#investigation">Investigation</a></li>
                <li><a href="#audit">Audit Services</a></li>
                <li><a href="#recovery">Recovery Support</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-links-title">Portals</div>
              <ul className="footer-links">
                <li><Link href="/login">Client Portal Login</Link></li>
                <li><Link href="/login">Ops Admin Login</Link></li>
                <li><Link href="/login">Super Admin Console</Link></li>
              </ul>
            </div>

            <div>
              <div className="footer-links-title">Contact</div>
              <ul className="footer-links">
                <li><Link href="/contact">Request Consultation</Link></li>
                <li>support@claimsolution.test</li>
                <li>+91 (022) 800-CLAIM</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© {new Date().getFullYear()} ARD Claim Solution. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security Audit</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
