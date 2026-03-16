"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

interface Candidate {
  id: string;
  name: string;
  email: string;
  date: string;
  city: string;
  skills: string;
  educational: string;
  jobHistory: string;
  summarize: string;
  vote: string;
  consideration: string;
}

interface Stats {
  total: number;
  avgVote: string;
  topCandidates: number;
  pending: number;
}

function VoteBadge({ vote }: { vote: string }) {
  const num = parseInt(vote);
  const cls = num >= 7 ? "vote-high" : num >= 5 ? "vote-mid" : "vote-low";
  return <span className={`vote-badge ${cls}`}>{vote}</span>;
}

function CandidateModal({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {candidate.name}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              {candidate.email} · {candidate.city} · Applied {candidate.date}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <VoteBadge vote={candidate.vote} />
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <p className="modal-section-title">AI Summary</p>
            <div className="modal-section-content">{candidate.summarize}</div>
          </div>
          <div className="modal-section">
            <p className="modal-section-title">HR Consideration</p>
            <div className="modal-section-content">
              {candidate.consideration}
            </div>
          </div>
          <div className="modal-section">
            <p className="modal-section-title">Educational Qualification</p>
            <div className="modal-section-content">{candidate.educational}</div>
          </div>
          <div className="modal-section">
            <p className="modal-section-title">Job History</p>
            <div className="modal-section-content">{candidate.jobHistory}</div>
          </div>
          <div className="modal-section">
            <p className="modal-section-title">Skills</p>
            <div
              className="modal-section-content"
              style={{ whiteSpace: "pre-line" }}
            >
              {candidate.skills}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "high" | "mid" | "low">("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<"vote" | "date">("vote");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check using hardcoded "admin123" — matches .env.local
    if (password === "admin123") {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Hint: admin123");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetch("/api/candidates")
      .then((r) => {
        if (!r.ok) throw new Error("Could not fetch candidates");
        return r.json();
      })
      .then((data) => {
        setCandidates(data.candidates || []);
        setStats(data.stats || null);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to connect to candidate database. Please ensure n8n workflow is active.");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const filtered = (candidates || [])
    .filter((c) => {
      if (!c) return false;
      const v = parseInt(c.vote);
      if (filter === "high") return v >= 7;
      if (filter === "mid") return v >= 5 && v < 7;
      if (filter === "low") return v < 5;
      return true;
    })
    .sort((a, b) => {
      const vA = parseInt(a.vote) || 0;
      const vB = parseInt(b.vote) || 0;
      return sortBy === "vote"
        ? vB - vA
        : (b.date || "").localeCompare(a.date || "");
    });

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="login-page">
          <div className="glass-card login-form">
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔐</div>
            <h2 className="login-title">Rysera Admin</h2>
            <p className="login-subtitle">
              Secure access to global talent evaluations.
            </p>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-password">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  className={`form-input ${passwordError ? "error" : ""}`}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  autoFocus
                />
                {passwordError && <p className="form-error">{passwordError}</p>}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
                id="admin-login"
              >
                Access Dashboard →
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Talent Intelligence</h1>
            <p className="admin-subtitle">
              AI-evaluated applicants for Rysera Open Positions
            </p>
          </div>
          <a href="/" className="btn btn-ghost btn-sm">
            ← Back to Job Post
          </a>
        </div>

        {/* Stats */}
        {stats && (
          <div className="stats-strip">
            <div className="glass-card stat-card">
              <div
                className="stat-value"
                style={{
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stats.total}
              </div>
              <div className="stat-label">Total Applicants</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-value" style={{ color: "#34d399" }}>
                {stats.topCandidates}
              </div>
              <div className="stat-label">Top Candidates (7+)</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-value" style={{ color: "#fbbf24" }}>
                {stats.avgVote}
              </div>
              <div className="stat-label">Average AI Score</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-value" style={{ color: "#a78bfa" }}>
                GPT-4o Mini
              </div>
              <div className="stat-label">AI Model Used</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="admin-filters">
          {(["all", "high", "mid", "low"] as const).map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all"
                ? "All Candidates"
                : f === "high"
                  ? "⭐ Top Match (7-10)"
                  : f === "mid"
                    ? "⚡ Good Match (5-6)"
                    : "⚠️ Low Match (1-4)"}
            </button>
          ))}
          <button
            className={`filter-btn ${sortBy === "vote" ? "active" : ""}`}
            onClick={() => setSortBy(sortBy === "vote" ? "date" : "vote")}
            style={{ marginLeft: "auto" }}
          >
            Sort by: {sortBy === "vote" ? "Score ↓" : "Date ↓"}
          </button>
        </div>

        {/* Content */}
        {error ? (
          <div className="glass-card empty-state" style={{ borderColor: "rgba(248, 113, 113, 0.2)" }}>
            <div className="empty-state-icon">⚠️</div>
            <p className="empty-state-text" style={{ color: "#f87171" }}>{error}</p>
            <button 
              className="btn btn-ghost btn-sm" 
              style={{ marginTop: 16 }}
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "var(--text-muted)",
            }}
          >
            <div className="spinner" style={{ margin: "0 auto 16px" }} />
            <p>Loading candidates...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">No candidates match this filter.</p>
          </div>
        ) : (
          <div
            className="table-wrapper glass-card"
            style={{
              borderRadius: "var(--radius-lg)",
              padding: 0,
              border: "1px solid var(--border)",
            }}
          >
            <table className="candidate-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>City</th>
                  <th>Date Applied</th>
                  <th>Skills</th>
                  <th>AI Score</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedCandidate(c)}>
                    <td>
                      <div className="candidate-name">{c.name}</div>
                      <div className="candidate-email">{c.email}</div>
                    </td>
                    <td>📍 {c.city}</td>
                    <td>{c.date}</td>
                    <td style={{ maxWidth: 200 }}>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
                      >
                        {c.skills
                          .split("\n")
                          .slice(0, 3)
                          .map((s, i) => (
                            <span
                              key={i}
                              className="skill-tag"
                              style={{ fontSize: "0.72rem" }}
                            >
                              {s.replace("• ", "")}
                            </span>
                          ))}
                        {c.skills.split("\n").length > 3 && (
                          <span
                            className="skill-tag"
                            style={{ fontSize: "0.72rem" }}
                          >
                            +{c.skills.split("\n").length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <VoteBadge vote={c.vote} />
                    </td>
                    <td
                      style={{
                        maxWidth: 220,
                        color: "var(--text-secondary)",
                        fontSize: "0.82rem",
                      }}
                    >
                      {c.summarize.slice(0, 90)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p
          style={{
            marginTop: 16,
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          Click any row to view full candidate evaluation
        </p>
      </div>

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

      <footer className="footer">
        <p>© 2026 Rysera HR — Recruitment Intelligence Dashboard</p>
      </footer>
    </>
  );
}
