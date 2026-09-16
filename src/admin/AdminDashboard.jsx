import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../supabase";
import techLogo from "../assets/tech.png";

import "./Admin.css";

const ADMIN_SESSION_KEY =
  "tech_crew_admin_logged_in";

/* =========================================================
   HELPERS
========================================================= */

function formatDate(dateString) {
  if (!dateString) return "—";

  try {
    return new Intl.DateTimeFormat(
      "en-NG",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(new Date(dateString));
  } catch {
    return "—";
  }
}

function getInitial(name) {
  return (
    name?.trim()?.charAt(0)?.toUpperCase() ||
    "?"
  );
}

/* =========================================================
   ICONS
========================================================= */

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle
        cx="9"
        cy="7"
        r="4"
      />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16v11H7l-3 3z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
    </svg>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const isUrl =
    typeof value === "string" &&
    /^https?:\/\//i.test(value);

  return (
    <div className="admin-detail-row">
      <span>{label}</span>

      {isUrl ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </a>
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  type,
  label,
  value,
  note,
}) {
  let icon = <DashboardIcon />;

  if (type === "users") {
    icon = <UsersIcon />;
  }

  if (type === "projects") {
    icon = <ProjectsIcon />;
  }

  if (type === "messages") {
    icon = <MessagesIcon />;
  }

  return (
    <div className="admin-stat-card">
      <div
        className={`admin-stat-icon ${type}`}
      >
        {icon}
      </div>

      <span>{label}</span>

      <strong>{value}</strong>

      <small>{note}</small>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const [activeTab, setActiveTab] =
    useState("overview");

  const [registrations, setRegistrations] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedItem, setSelectedItem] =
    useState(null);

  const [selectedType, setSelectedType] =
    useState(null);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /* =========================================================
     SESSION CHECK
  ========================================================= */

  const checkSession = useCallback(() => {
    const loggedIn =
      sessionStorage.getItem(
        ADMIN_SESSION_KEY
      );

    if (loggedIn !== "true") {
      window.location.href = "/admin";
      return false;
    }

    return true;
  }, []);

  /* =========================================================
     FETCH DATA
  ========================================================= */

  const fetchData = useCallback(
    async () => {
      if (!checkSession()) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [
          registrationsResponse,
          projectsResponse,
          messagesResponse,
        ] = await Promise.all([
          supabase
            .from("registrations")
            .select("*")
            .order("created_at", {
              ascending: false,
            }),

          supabase
            .from("project_proposals")
            .select("*")
            .order("created_at", {
              ascending: false,
            }),

          supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", {
              ascending: false,
            }),
        ]);

        if (registrationsResponse.error) {
          throw registrationsResponse.error;
        }

        if (projectsResponse.error) {
          throw projectsResponse.error;
        }

        if (messagesResponse.error) {
          throw messagesResponse.error;
        }

        setRegistrations(
          registrationsResponse.data || []
        );

        setProjects(
          projectsResponse.data || []
        );

        setMessages(
          messagesResponse.data || []
        );
      } catch (err) {
        console.error(
          "Dashboard fetch error:",
          err
        );

        setError(
          "Unable to load dashboard data. Check your Supabase permissions."
        );
      } finally {
        setLoading(false);
      }
    },
    [checkSession]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    sessionStorage.removeItem(
      ADMIN_SESSION_KEY
    );

    window.location.href = "/admin";
  };

  /* =========================================================
     TAB
  ========================================================= */

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setStatusFilter("all");
    setSelectedItem(null);
    setSelectedType(null);
    setMobileMenuOpen(false);
  };

  /* =========================================================
     UPDATE PROJECT STATUS
  ========================================================= */

  const updateProjectStatus = async (
    id,
    status
  ) => {
    setUpdatingId(id);
    setError("");

    try {
      const {
        error: updateError,
      } = await supabase
        .from("project_proposals")
        .update({ status })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      setProjects((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSelectedItem((current) =>
        current
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to update the project status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     UPDATE MESSAGE STATUS
  ========================================================= */

  const updateMessageStatus = async (
    id,
    status
  ) => {
    setUpdatingId(id);
    setError("");

    try {
      const {
        error: updateError,
      } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSelectedItem((current) =>
        current
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to update the message status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     FILTER REGISTRATIONS
  ========================================================= */

  const filteredRegistrations =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return registrations;
      }

      return registrations.filter(
        (member) =>
          [
            member.full_name,
            member.email,
            member.whatsapp,
            member.location,
            member.role,
            member.skill_level,
            member.skills,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            )
      );
    }, [
      registrations,
      search,
    ]);

  /* =========================================================
     FILTER PROJECTS
  ========================================================= */

  const filteredProjects =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return projects.filter(
        (item) => {
          const matchesSearch =
            !query ||
            [
              item.project_name,
              item.member_name,
              item.problem,
              item.solution,
              item.contact,
            ]
              .filter(Boolean)
              .some((value) =>
                String(value)
                  .toLowerCase()
                  .includes(query)
              );

          const matchesStatus =
            statusFilter === "all" ||
            item.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      projects,
      search,
      statusFilter,
    ]);

  /* =========================================================
     FILTER MESSAGES
  ========================================================= */

  const filteredMessages =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return messages.filter(
        (item) => {
          const matchesSearch =
            !query ||
            [
              item.name,
              item.email,
              item.message,
            ]
              .filter(Boolean)
              .some((value) =>
                String(value)
                  .toLowerCase()
                  .includes(query)
              );

          const matchesStatus =
            statusFilter === "all" ||
            item.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      messages,
      search,
      statusFilter,
    ]);

  /* =========================================================
     COUNTS
  ========================================================= */

  const pendingProjects =
    projects.filter(
      (item) =>
        item.status === "pending"
    ).length;

  const reviewingProjects =
    projects.filter(
      (item) =>
        item.status === "reviewing"
    ).length;

  const approvedProjects =
    projects.filter(
      (item) =>
        item.status === "approved"
    ).length;

  const newMessages =
    messages.filter(
      (item) => item.status === "new"
    ).length;

  /* =========================================================
     DETAILS
  ========================================================= */

  const openDetails = (
    item,
    type
  ) => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const closeDetails = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="admin-dashboard-page">
        <div className="admin-loading">
          <div className="admin-loading-spinner" />

          <p>
            Loading Tech Crew dashboard...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="admin-dashboard-page">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`admin-sidebar ${
          mobileMenuOpen
            ? "mobile-open"
            : ""
        }`}
      >
        <div className="admin-sidebar-top">
          <a
            href="/"
            className="admin-sidebar-brand"
          >
            <img
              src={techLogo}
              alt="Tech Crew"
            />

            <div>
              <strong>
                Tech Crew
              </strong>

              <span>
                Admin
              </span>
            </div>
          </a>

          <nav className="admin-nav">
            <button
              type="button"
              className={
                activeTab ===
                "overview"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchTab("overview")
              }
            >
              <DashboardIcon />
              <span>
                Overview
              </span>
            </button>

            <button
              type="button"
              className={
                activeTab ===
                "registrations"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchTab(
                  "registrations"
                )
              }
            >
              <UsersIcon />
              <span>
                Registrations
              </span>

              <em>
                {registrations.length}
              </em>
            </button>

            <button
              type="button"
              className={
                activeTab ===
                "projects"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchTab(
                  "projects"
                )
              }
            >
              <ProjectsIcon />
              <span>
                Project Proposals
              </span>

              {pendingProjects > 0 && (
                <em>
                  {pendingProjects}
                </em>
              )}
            </button>

            <button
              type="button"
              className={
                activeTab ===
                "messages"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchTab(
                  "messages"
                )
              }
            >
              <MessagesIcon />
              <span>
                Messages
              </span>

              {newMessages > 0 && (
                <em>
                  {newMessages}
                </em>
              )}
            </button>
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <a
            href="/"
            className="admin-sidebar-link"
          >
            ← View website
          </a>

          <button
            type="button"
            className="admin-logout"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="admin-main">
        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header className="admin-topbar">
          <div className="admin-mobile-title">
            <button
              type="button"
              className="admin-mobile-menu"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>

            <div>
              <span className="admin-page-kicker">
                TECH CREW / ADMIN
              </span>

              <h1>
                {activeTab ===
                  "overview" &&
                  "Dashboard"}

                {activeTab ===
                  "registrations" &&
                  "Registrations"}

                {activeTab ===
                  "projects" &&
                  "Project Proposals"}

                {activeTab ===
                  "messages" &&
                  "Messages"}
              </h1>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-refresh"
              onClick={fetchData}
              title="Refresh"
            >
              <RefreshIcon />
            </button>

            <div className="admin-user-badge">
              <span>
                TC
              </span>

              <div>
                <strong>
                  Admin
                </strong>

                <small>
                  Tech Crew
                </small>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="admin-global-error">
            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        {/* ===================================================
            OVERVIEW
        =================================================== */}

        {activeTab ===
          "overview" && (
          <section className="admin-content">
            <div className="admin-welcome">
              <div>
                <span>
                  CONTROL CENTER
                </span>

                <h2>
                  Keep the crew moving.
                </h2>

                <p>
                  Monitor members, project
                  ideas and communication
                  from one place.
                </p>
              </div>

              <div className="admin-welcome-decoration">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="admin-stats-grid">
              <StatCard
                type="users"
                label="Total registrations"
                value={
                  registrations.length
                }
                note="Registered crew members"
              />

              <StatCard
                type="projects"
                label="Project proposals"
                value={
                  projects.length
                }
                note={`${pendingProjects} pending · ${reviewingProjects} reviewing`}
              />

              <StatCard
                type="messages"
                label="Contact messages"
                value={
                  messages.length
                }
                note={`${newMessages} new · ${messages.filter((m) => m.status === "replied").length} replied`}
              />
            </div>

            <div className="admin-overview-grid">
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <span>
                      COMMUNITY
                    </span>

                    <h3>
                      Recent registrations
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      switchTab(
                        "registrations"
                      )
                    }
                  >
                    View all →
                  </button>
                </div>

                <div className="admin-mini-list">
                  {registrations
                    .slice(0, 6)
                    .map(
                      (member) => (
                        <button
                          type="button"
                          className="admin-mini-row"
                          key={
                            member.id
                          }
                          onClick={() =>
                            openDetails(
                              member,
                              "registration"
                            )
                          }
                        >
                          <span className="admin-avatar">
                            {getInitial(
                              member.full_name
                            )}
                          </span>

                          <div>
                            <strong>
                              {
                                member.full_name
                              }
                            </strong>

                            <small>
                              {member.role ||
                                "Tech Crew member"}
                            </small>
                          </div>

                          <time>
                            {formatDate(
                              member.created_at
                            )}
                          </time>
                        </button>
                      )
                    )}

                  {registrations.length ===
                    0 && (
                    <div className="admin-empty">
                      No registrations yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <span>
                      PROJECT STUDIO
                    </span>

                    <h3>
                      Recent proposals
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      switchTab(
                        "projects"
                      )
                    }
                  >
                    View all →
                  </button>
                </div>

                <div className="admin-mini-list">
                  {projects
                    .slice(0, 6)
                    .map(
                      (item) => (
                        <button
                          type="button"
                          className="admin-mini-row"
                          key={
                            item.id
                          }
                          onClick={() =>
                            openDetails(
                              item,
                              "project"
                            )
                          }
                        >
                          <span className="admin-project-icon">
                            ↗
                          </span>

                          <div>
                            <strong>
                              {
                                item.project_name
                              }
                            </strong>

                            <small>
                              by{" "}
                              {
                                item.member_name
                              }
                            </small>
                          </div>

                          <span
                            className={`status-pill ${item.status}`}
                          >
                            {item.status}
                          </span>
                        </button>
                      )
                    )}

                  {projects.length ===
                    0 && (
                    <div className="admin-empty">
                      No proposals yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="admin-panel admin-message-panel">
              <div className="admin-panel-header">
                <div>
                  <span>
                    INBOX
                  </span>

                  <h3>
                    Latest messages
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    switchTab(
                      "messages"
                    )
                  }
                >
                  View all →
                </button>
              </div>

              <div className="admin-mini-list">
                {messages
                  .slice(0, 6)
                  .map(
                    (item) => (
                      <button
                        type="button"
                        className="admin-mini-row"
                        key={
                          item.id
                        }
                        onClick={() =>
                          openDetails(
                            item,
                            "message"
                          )
                        }
                      >
                        <span className="admin-avatar message-avatar">
                          {getInitial(
                            item.name
                          )}
                        </span>

                        <div>
                          <strong>
                            {item.name}
                          </strong>

                          <small>
                            {
                              item.message
                            }
                          </small>
                        </div>

                        <span
                          className={`status-pill ${item.status}`}
                        >
                          {item.status}
                        </span>
                      </button>
                    )
                  )}

                {messages.length ===
                  0 && (
                  <div className="admin-empty">
                    No messages yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            REGISTRATIONS
        =================================================== */}

        {activeTab ===
          "registrations" && (
          <section className="admin-content">
            <div className="admin-toolbar">
              <div className="admin-search">
                <SearchIcon />

                <input
                  type="search"
                  placeholder="Search name, email, role, skills..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <span className="admin-result-count">
                {
                  filteredRegistrations.length
                }{" "}
                members
              </span>
            </div>

            <div className="admin-table-card">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>
                        Member
                      </th>
                      <th>
                        Role
                      </th>
                      <th>
                        Skill level
                      </th>
                      <th>
                        Location
                      </th>
                      <th>
                        Joined
                      </th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRegistrations.map(
                      (member) => (
                        <tr
                          key={
                            member.id
                          }
                        >
                          <td>
                            <div className="table-person">
                              <span className="admin-avatar">
                                {getInitial(
                                  member.full_name
                                )}
                              </span>

                              <div>
                                <strong>
                                  {
                                    member.full_name
                                  }
                                </strong>

                                <small>
                                  {
                                    member.email
                                  }
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            {member.role ||
                              "—"}
                          </td>

                          <td>
                            {member.skill_level ||
                              "—"}
                          </td>

                          <td>
                            {member.location ||
                              "—"}
                          </td>

                          <td>
                            {formatDate(
                              member.created_at
                            )}
                          </td>

                          <td>
                            <button
                              type="button"
                              className="table-view-button"
                              onClick={() =>
                                openDetails(
                                  member,
                                  "registration"
                                )
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {filteredRegistrations.length ===
                  0 && (
                  <div className="admin-empty table-empty">
                    No registrations
                    found.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            PROJECTS
        =================================================== */}

        {activeTab ===
          "projects" && (
          <section className="admin-content">
            <div className="admin-toolbar">
              <div className="admin-search">
                <SearchIcon />

                <input
                  type="search"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="admin-filter-group">
                {[
                  "all",
                  "pending",
                  "reviewing",
                  "approved",
                  "rejected",
                ].map(
                  (status) => (
                    <button
                      type="button"
                      key={
                        status
                      }
                      className={
                        statusFilter ===
                        status
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setStatusFilter(
                          status
                        )
                      }
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="admin-project-grid">
              {filteredProjects.map(
                (item) => (
                  <article
                    className="admin-project-card"
                    key={
                      item.id
                    }
                  >
                    <div className="admin-project-card-top">
                      <span className="admin-project-card-icon">
                        ↗
                      </span>

                      <span
                        className={`status-pill ${item.status}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <span className="admin-project-kicker">
                      {item.member_name}
                    </span>

                    <h3>
                      {
                        item.project_name
                      }
                    </h3>

                    <p>
                      {item.problem}
                    </p>

                    <div className="admin-project-card-footer">
                      <time>
                        {formatDate(
                          item.created_at
                        )}
                      </time>

                      <button
                        type="button"
                        onClick={() =>
                          openDetails(
                            item,
                            "project"
                          )
                        }
                      >
                        View details →
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>

            {filteredProjects.length ===
              0 && (
              <div className="admin-empty">
                No project proposals
                match your filters.
              </div>
            )}
          </section>
        )}

        {/* ===================================================
            MESSAGES
        =================================================== */}

        {activeTab ===
          "messages" && (
          <section className="admin-content">
            <div className="admin-toolbar">
              <div className="admin-search">
                <SearchIcon />

                <input
                  type="search"
                  placeholder="Search name, email or message..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="admin-filter-group">
                {[
                  "all",
                  "new",
                  "read",
                  "replied",
                ].map(
                  (status) => (
                    <button
                      type="button"
                      key={
                        status
                      }
                      className={
                        statusFilter ===
                        status
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setStatusFilter(
                          status
                        )
                      }
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="admin-table-card">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>
                        From
                      </th>
                      <th>
                        Message
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Received
                      </th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMessages.map(
                      (item) => (
                        <tr
                          key={
                            item.id
                          }
                        >
                          <td>
                            <div className="table-person">
                              <span className="admin-avatar message-avatar">
                                {getInitial(
                                  item.name
                                )}
                              </span>

                              <div>
                                <strong>
                                  {
                                    item.name
                                  }
                                </strong>

                                <small>
                                  {
                                    item.email
                                  }
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="message-preview">
                              {
                                item.message
                              }
                            </span>
                          </td>

                          <td>
                            <span
                              className={`status-pill ${item.status}`}
                            >
                              {
                                item.status
                              }
                            </span>
                          </td>

                          <td>
                            {formatDate(
                              item.created_at
                            )}
                          </td>

                          <td>
                            <button
                              type="button"
                              className="table-view-button"
                              onClick={() =>
                                openDetails(
                                  item,
                                  "message"
                                )
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {filteredMessages.length ===
                  0 && (
                  <div className="admin-empty table-empty">
                    No messages
                    found.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </section>

      {/* =====================================================
          DETAIL DRAWER
      ===================================================== */}

      {selectedItem && (
        <div
          className="admin-detail-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDetails();
            }
          }}
        >
          <aside className="admin-detail-panel">
            <button
              type="button"
              className="admin-detail-close"
              onClick={closeDetails}
              aria-label="Close details"
            >
              ×
            </button>

            {/* ===============================================
                REGISTRATION DETAILS
            =============================================== */}

            {selectedType ===
              "registration" && (
              <>
                <span className="admin-detail-kicker">
                  MEMBER PROFILE
                </span>

                <div className="admin-detail-avatar">
                  {getInitial(
                    selectedItem.full_name
                  )}
                </div>

                <h2>
                  {
                    selectedItem.full_name
                  }
                </h2>

                <p className="admin-detail-role">
                  {selectedItem.role ||
                    "Tech Crew member"}
                </p>

                <div className="admin-detail-list">
                  <DetailRow
                    label="Email"
                    value={
                      selectedItem.email
                    }
                  />

                  <DetailRow
                    label="WhatsApp"
                    value={
                      selectedItem.whatsapp
                    }
                  />

                  <DetailRow
                    label="Location"
                    value={
                      selectedItem.location
                    }
                  />

                  <DetailRow
                    label="Role"
                    value={
                      selectedItem.role
                    }
                  />

                  <DetailRow
                    label="Skill level"
                    value={
                      selectedItem.skill_level
                    }
                  />

                  <DetailRow
                    label="Skills"
                    value={
                      selectedItem.skills
                    }
                  />

                  <DetailRow
                    label="Learning goals"
                    value={
                      selectedItem.learning_goals
                    }
                  />

                  <DetailRow
                    label="Contribution"
                    value={
                      selectedItem.contribution
                    }
                  />

                  <DetailRow
                    label="GitHub"
                    value={
                      selectedItem.github
                    }
                  />

                  <DetailRow
                    label="LinkedIn"
                    value={
                      selectedItem.linkedin
                    }
                  />

                  <DetailRow
                    label="Joined"
                    value={formatDate(
                      selectedItem.created_at
                    )}
                  />
                </div>
              </>
            )}

            {/* ===============================================
                PROJECT DETAILS
            =============================================== */}

            {selectedType ===
              "project" && (
              <>
                <span className="admin-detail-kicker">
                  PROJECT PROPOSAL
                </span>

                <h2>
                  {
                    selectedItem.project_name
                  }
                </h2>

                <p className="admin-detail-role">
                  Proposed by{" "}
                  <strong>
                    {
                      selectedItem.member_name
                    }
                  </strong>
                </p>

                <div className="admin-detail-section">
                  <span>
                    PROBLEM
                  </span>

                  <p>
                    {
                      selectedItem.problem
                    }
                  </p>
                </div>

                <div className="admin-detail-section">
                  <span>
                    SOLUTION
                  </span>

                  <p>
                    {
                      selectedItem.solution
                    }
                  </p>
                </div>

                <DetailRow
                  label="Contact"
                  value={
                    selectedItem.contact
                  }
                />

                <DetailRow
                  label="Demo link"
                  value={
                    selectedItem.demo_link
                  }
                />

                <DetailRow
                  label="Submitted"
                  value={formatDate(
                    selectedItem.created_at
                  )}
                />

                <div className="admin-status-actions">
                  {[
                    "pending",
                    "reviewing",
                    "approved",
                    "rejected",
                  ].map(
                    (status) => (
                      <button
                        type="button"
                        key={
                          status
                        }
                        className={
                          selectedItem.status ===
                          status
                            ? "active"
                            : ""
                        }
                        disabled={
                          updatingId ===
                          selectedItem.id
                        }
                        onClick={() =>
                          updateProjectStatus(
                            selectedItem.id,
                            status
                          )
                        }
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </>
            )}

            {/* ===============================================
                MESSAGE DETAILS
            =============================================== */}

            {selectedType ===
              "message" && (
              <>
                <span className="admin-detail-kicker">
                  CONTACT MESSAGE
                </span>

                <div className="admin-detail-avatar message-large">
                  {getInitial(
                    selectedItem.name
                  )}
                </div>

                <h2>
                  {selectedItem.name}
                </h2>

                <p className="admin-detail-role">
                  {selectedItem.email}
                </p>

                <div className="admin-message-detail">
                  {
                    selectedItem.message
                  }
                </div>

                <DetailRow
                  label="Received"
                  value={formatDate(
                    selectedItem.created_at
                  )}
                />

                <div className="admin-status-actions">
                  {[
                    "new",
                    "read",
                    "replied",
                  ].map(
                    (status) => (
                      <button
                        type="button"
                        key={
                          status
                        }
                        className={
                          selectedItem.status ===
                          status
                            ? "active"
                            : ""
                        }
                        disabled={
                          updatingId ===
                          selectedItem.id
                        }
                        onClick={() =>
                          updateMessageStatus(
                            selectedItem.id,
                            status
                          )
                        }
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}