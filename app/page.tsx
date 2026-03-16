"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Navbar from "./components/Navbar";

type FormState = "idle" | "submitting" | "success" | "error";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    cv?: string;
    jobId?: string;
  }>({});
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState("frontend-developer"); // Default to the first job

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setCvFile(acceptedFiles[0]);
      setErrors((e) => ({ ...e, cv: undefined }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
      disabled: formState === "submitting",
    });

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email";
    if (!cvFile) newErrors.cv = "Please upload your CV (PDF)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("submitting");
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Email", email);
      formData.append("CV", cvFile!);
      formData.append("jobId", jobId);

      setProgress(50);

      const res = await fetch("/api/submit-cv", {
        method: "POST",
        body: formData,
      });

      setProgress(90);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setProgress(100);
      setTimeout(() => setFormState("success"), 400);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      setErrorMsg(message);
      setFormState("error");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setCvFile(null);
    setErrors({});
    setFormState("idle");
    setProgress(0);
  };

  const getDropzoneClass = () => {
    let cls = "dropzone";
    if (isDragActive) cls += " active";
    else if (cvFile) cls += " accepted";
    else if (fileRejections.length > 0) cls += " rejected";
    return cls;
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="dot-pattern" />
        <div className="hero-badge animate-fade-up">
          <span className="hero-badge-dot" />
          Next-Gen AI Recruitment
        </div>
        <h1 className="hero-title animate-fade-up delay-100">
          Unlock Your Future
          <br />
          <span className="hero-title-gradient">
            with RYSERA HR Intelligence
          </span>
        </h1>
        <p className="hero-subtitle animate-fade-up delay-200">
          Our specialized AI talent engine evaluates your unique potential,
          matching your skills with world-class opportunities in seconds.
        </p>
        <div className="hero-stats animate-fade-up delay-300">
          <div className="hero-stat">
            <div className="hero-stat-number">100%</div>
            <div className="hero-stat-label">AI Analyzed</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">Real-time</div>
            <div className="hero-stat-label">Feedback</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">Global</div>
            <div className="hero-stat-label">Standards</div>
          </div>
        </div>
        <a
          href="#apply"
          className="btn btn-primary btn-lg animate-fade-up delay-400"
        >
          Begin Application →
        </a>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-heading">
          <p className="section-label">How it works</p>
          <h2 className="section-title">
            Three steps to your next opportunity
          </h2>
        </div>
        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon">📁</div>
            <h3 className="feature-title">Digital Submission</h3>
            <p className="feature-desc">
              Securely upload your CV. Our system immediately begins
              high-precision data extraction for technical assessment.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">🧪</div>
            <h3 className="feature-title">Intelligence Scan</h3>
            <p className="feature-desc">
              Advanced neural networks map your skills and experiences against
              specialized job requirements in real-time.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Dynamic Matching</h3>
            <p className="feature-desc">
              Receive a comprehensive evaluation and score, powered by our
              custom Rysera AI hiring protocols.
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Job Description + Form */}
      <section id="apply" className="form-section">
        <div className="form-container">
          {/* Job Card */}
          <div className="glass-card job-card">
            <div className="job-card-header">
              <div className="job-card-icon">💼</div>
              <div>
                <p className="job-card-company">Open Position</p>
                <h3 className="job-card-title">Full-Stack Web Developer</h3>
              </div>
            </div>
            <div className="job-card-meta">
              <span className="job-tag">🌍 Northern Italy</span>
              <span className="job-tag">💻 Full-Time</span>
              <span className="job-tag">🏢 Web Agency</span>
            </div>
            <p className="job-card-desc">
              We are a web agency looking for a full-stack web developer with
              experience in PHP, Python, and JavaScript. You should have solid
              industry experience and ideally be based in Northern Italy.
            </p>
            <div className="job-skills">
              {["PHP", "Python", "JavaScript", "Full-Stack", "Web Agency"].map(
                (s) => (
                  <span key={s} className="skill-tag">
                    {s}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Form / Status */}
          <div className="glass-card" style={{ padding: "32px" }}>
            {formState === "idle" || formState === "submitting" ? (
              <>
                <div className="form-header">
                  <h2 className="form-title">Apply for this Position</h2>
                  <p className="form-subtitle">
                    Fill in your details and upload your CV. Our AI will analyze
                    your profile and match it to the job requirements.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label className="form-label" htmlFor="jobId">
                      Position Applying For <span>*</span>
                    </label>
                    <select
                      id="jobId"
                      className="form-input"
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      disabled={formState === "submitting"}
                    >
                      <option value="frontend-developer">
                        Senior Frontend Developer
                      </option>
                      <option value="backend-developer">
                        Backend Systems Engineer
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Full Name <span>*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`form-input ${errors.name ? "error" : ""}`}
                      placeholder="John Smith"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors((err) => ({ ...err, name: undefined }));
                      }}
                      disabled={formState === "submitting"}
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email Address <span>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`form-input ${errors.email ? "error" : ""}`}
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((err) => ({ ...err, email: undefined }));
                      }}
                      disabled={formState === "submitting"}
                    />
                    {errors.email && (
                      <p className="form-error">{errors.email}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      CV / Resume <span>*</span>
                    </label>
                    <div {...getRootProps()} className={getDropzoneClass()}>
                      <input {...getInputProps()} id="cv-upload" />
                      {!cvFile ? (
                        <>
                          <div className="dropzone-icon">📁</div>
                          <p className="dropzone-title">
                            {isDragActive
                              ? "Drop your PDF here"
                              : "Drag & drop your CV"}
                          </p>
                          <p className="dropzone-subtitle">
                            or{" "}
                            <span style={{ color: "var(--accent-purple)" }}>
                              click to browse
                            </span>{" "}
                            — PDF only, max 10MB
                          </p>
                        </>
                      ) : (
                        <div
                          className="dropzone-file"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span style={{ fontSize: "1.5rem" }}>📄</span>
                          <span className="dropzone-file-name">
                            {cvFile.name}
                          </span>
                          <button
                            type="button"
                            className="dropzone-file-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCvFile(null);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                    {fileRejections.length > 0 && (
                      <p className="form-error">
                        Only PDF files under 10MB are accepted.
                      </p>
                    )}
                    {errors.cv && <p className="form-error">{errors.cv}</p>}
                  </div>

                  {formState === "submitting" && (
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", marginTop: "8px" }}
                    disabled={formState === "submitting"}
                    id="submit-application"
                  >
                    {formState === "submitting" ? (
                      <>
                        <span className="spinner spinner-sm" />
                        Analyzing your CV...
                      </>
                    ) : (
                      "Submit Application →"
                    )}
                  </button>
                </form>
              </>
            ) : formState === "success" ? (
              <div className="status-card">
                <div className="status-icon success">✅</div>
                <h3 className="status-title">Application Submitted!</h3>
                <p className="status-subtitle">
                  Your CV is being analyzed by our AI system. You&apos;ll
                  receive a response once the evaluation is complete. Thank you,{" "}
                  <strong>{name}</strong>!
                </p>
                <button className="btn btn-outline" onClick={resetForm}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <div className="status-card">
                <div className="status-icon error">⚠️</div>
                <h3 className="status-title">Submission Failed</h3>
                <p className="status-subtitle">
                  {errorMsg ||
                    "Something went wrong. Please try again or contact us directly."}
                </p>
                <button className="btn btn-primary" onClick={resetForm}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Rysera HR — Redefining Global Recruitment Intelligence</p>
      </footer>
    </>
  );
}
