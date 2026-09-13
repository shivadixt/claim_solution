export default function LoginPage() {
  return (
    <main className="container section">
      <h1>Sign in</h1>
      <form method="post" action="/api/v1/auth/login">
        <p>
          <label htmlFor="email">Email</label>
          <br />
          <input id="email" name="email" type="email" autoComplete="email" required />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <br />
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </p>
        <button className="button" type="submit">Sign in</button>
      </form>
    </main>
  );
}
