import React, { useEffect, useMemo, useState } from "react";
import techLogo from "./assets/tech.png";

// Paste the Web App URL from your Apps Script deployment here:
const WEBAPP_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

function splitTags(str) {
  if (!str) return [];
  return str
    .split(/[,/|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function Members() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    fetch(WEBAPP_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Could not reach directory");
        return res.json();
      })
      .then((data) => {
        setMembers(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return members;
    const q = query.toLowerCase();
    return members.filter(
      (m) =>
        (m.skillsStack || "").toLowerCase().includes(q) ||
        (m.fullName || "").toLowerCase().includes(q)
    );
  }, [members, query]);

  return (
    <section id="members" className="section members alt-bg">
      <div className="section-tag">The Crew</div>
      <h2 className="section-title">Find a <span className="gradient-text">collaborator</span></h2>

      <div className="member-search">
        <input
          type="text"
          placeholder="Search by skill — e.g. React, data analysis, UI design..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {status === "loading" && (
        <div className="member-empty">
          <div className="member-empty-spinner" />
          <p>Loading the crew…</p>
        </div>
      )}

      {status === "error" && (
        <div className="member-empty">
          <img src={techLogo} alt="" className="member-empty-icon" />
          <p>We couldn't load the member directory right now. Check back soon.</p>
        </div>
      )}

      {status === "ready" && members.length === 0 && (
        <div className="member-empty">
          <img src={techLogo} alt="" className="member-empty-icon" />
          <p>No members yet — be the first to join the crew.</p>
        </div>
      )}

      {status === "ready" && members.length > 0 && filtered.length === 0 && (
        <div className="member-empty">
          <p>No members match that skill yet.</p>
        </div>
      )}

      {status === "ready" && filtered.length > 0 && (
        <div className="member-grid">
          {filtered.map((m, i) => (
            <div className="member-card" key={i}>
              <img src={techLogo} alt={m.fullName} className="member-photo" />
              <h4>{m.fullName}</h4>

              {m.skillsStack && (
                <div className="tag-row member-tags">
                  {splitTags(m.skillsStack).map((t) => (
                    <span className="tag-pill" key={t}>{t}</span>
                  ))}
                </div>
              )}

              {m.currentProject && (
                <p className="member-bio"><strong>Currently:</strong> {m.currentProject}</p>
              )}
              {m.pastProjects && (
                <p className="member-bio"><strong>Past work:</strong> {m.pastProjects}</p>
              )}
              {m.experience && <p className="member-bio">{m.experience}</p>}

              {m.portfolioLink && (
                <a href={m.portfolioLink} target="_blank" rel="noreferrer" className="member-link">
                  View Portfolio →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}