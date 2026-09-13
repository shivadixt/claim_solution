import Link from 'next/link';

const services = [
  ['Investigation', 'Field verification and intelligence.'],
  ['Audit', 'Claim and provider audit services.'],
  ['Recovery', 'Evidence-led recovery support.'],
];

export default function HomePage() {
  return (
    <>
      <header className="container header">
        <strong>Claim Solution</strong>
        <nav aria-label="Main navigation"><Link href="/login">Client login</Link></nav>
      </header>
      <main>
        <section className="hero">
          <div className="container">
            <h1>Healthcare Claims Investigation · Audit · Recovery</h1>
            <p>Protecting your bottom line with evidence-led claims management.</p>
            <Link className="button" href="/contact">Request consultation</Link>
          </div>
        </section>
        <section className="container section" aria-labelledby="services-title">
          <h2 id="services-title">Our Core Services</h2>
          <div className="cards">
            {services.map(([name, description]) => <article className="card" key={name}><h3>{name}</h3><p>{description}</p></article>)}
          </div>
        </section>
      </main>
    </>
  );
}

