"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <div className="navbar-logo">🏢</div>
        <span className="navbar-title">RYSERA HR</span>
      </Link>
      <div className="navbar-actions">
        <Link href="/admin" className="btn btn-ghost btn-sm">
          Admin Dashboard
        </Link>
        <a href="#apply" className="btn btn-primary btn-sm">
          Apply Now
        </a>
      </div>
    </nav>
  );
}
