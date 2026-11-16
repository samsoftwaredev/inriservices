import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="container not-found">
      <p className="eyebrow">Page not found</p>
      <h1>We could not find that page.</h1>
      <p>
        Some older website and internal application pages have been retired.
        Explore our current painting and drywall services instead.
      </p>
      <Link className="button primary" href="/services">
        View Services
      </Link>
    </main>
  );
}
