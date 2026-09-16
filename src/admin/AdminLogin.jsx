import React, { useEffect, useState } from "react";
import techLogo from "../assets/tech.png";
import "./Admin.css";

const ADMIN_EMAIL = "techcrewsorg@gmail.com";
const ADMIN_PASSWORD = "techcrews2026";

const ADMIN_SESSION_KEY =
  "tech_crew_admin_logged_in";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  useEffect(() => {
    const loggedIn =
      sessionStorage.getItem(
        ADMIN_SESSION_KEY
      );

    if (loggedIn === "true") {
      window.location.href =
        "/admin/dashboard";
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );

      setLoading(false);
      return;
    }

    if (
      cleanEmail !==
        ADMIN_EMAIL.toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      setError(
        "Incorrect admin email or password."
      );

      setLoading(false);
      return;
    }

    sessionStorage.setItem(
      ADMIN_SESSION_KEY,
      "true"
    );

    window.location.href =
      "/admin/dashboard";
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-background">
        <div className="admin-bg-orb admin-bg-orb-one" />
        <div className="admin-bg-orb admin-bg-orb-two" />
        <div className="admin-bg-grid" />
      </div>

      <div className="admin-login-shell">
        <a
          href="/"
          className="admin-brand"
        >
          <img
            src={techLogo}
            alt="Tech Crew"
          />

          <span>
            Tech <strong>Crew</strong>
          </span>
        </a>

        <section className="admin-login-card">
          <div className="admin-login-icon">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="10"
                rx="2"
              />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <div className="admin-login-heading">
            <span>
              PRIVATE AREA
            </span>

            <h1>
              Admin
              <br />
              <strong>
                Dashboard
              </strong>
            </h1>

            <p>
              Sign in to manage Tech Crew
              registrations, project
              proposals and messages.
            </p>
          </div>

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-field">
              <label htmlFor="admin-email">
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Enter admin email"
                autoComplete="username"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-password-wrap">
                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>
            </div>

            {error && (
              <div className="admin-login-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </span>

              {!loading && (
                <span>→</span>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <span>
              TECH CREW
            </span>

            <span>
              Authorized access only
            </span>
          </div>
        </section>

        <a
          href="/"
          className="admin-back-home"
        >
          ← Back to Tech Crew
        </a>
      </div>
    </main>
  );
}