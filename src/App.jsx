import React, { useEffect, useRef, useState } from "react";

import techLogo from "./assets/tech.png";
import leader from "./assets/leader.jpeg";
import vice from "./assets/vice.jpeg";
import secretary from "./assets/secretary.jpeg";
import project from "./assets/project.jpeg";

import { supabase } from "./supabase";

import "./App.css";

/* =========================================================
   ONLINE TECH IMAGES
========================================================= */

const techImages = {
  collaboration:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85",

  coding:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85",

  team:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=85",
};

/* =========================================================
   SOCIAL ICONS
========================================================= */

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.08 19.77h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.93c.57.1.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.08.78 2.17v3.22c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

function Reveal({
  children,
  className = "",
  delay = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${
        visible ? "reveal-visible" : ""
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   CURSOR GLOW
========================================================= */

function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const handleMove = (event) => {
      if (!ref.current) return;

      ref.current.style.transform = `
        translate(
          ${event.clientX - 250}px,
          ${event.clientY - 250}px
        )
      `;
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-glow"
    />
  );
}

/* =========================================================
   TILT CARD
========================================================= */

function TiltCard({
  children,
  className = "",
}) {
  const ref = useRef(null);

  const handleMove = (event) => {
    if (!ref.current) return;

    const rect =
      ref.current.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;

    const rotateX =
      ((y - rect.height / 2) /
        (rect.height / 2)) *
      -3;

    const rotateY =
      ((x - rect.width / 2) /
        (rect.width / 2)) *
      3;

    ref.current.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-4px)
    `;
  };

  const handleLeave = () => {
    if (!ref.current) return;

    ref.current.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const closeMenu = () =>
    setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <a
          href="#top"
          className="brand"
          onClick={closeMenu}
        >
          <img
            src={techLogo}
            alt="Tech Crew"
            className="nav-logo"
          />

          <span className="nav-title">
            Tech <span>Crew</span>
          </span>
        </a>

        <div
          className={`nav-links ${
            menuOpen ? "open" : ""
          }`}
        >
          <a
            href="#about"
            onClick={closeMenu}
          >
            About
          </a>

          <a
            href="#offer"
            onClick={closeMenu}
          >
            What We Do
          </a>

          <a
            href="#how"
            onClick={closeMenu}
          >
            How It Works
          </a>

          <a
            href="#team"
            onClick={closeMenu}
          >
            Leadership
          </a>

          <a
            href="#projects"
            onClick={closeMenu}
          >
            Projects
          </a>

          <a
            href="#contact"
            onClick={closeMenu}
          >
            Contact
          </a>

          <a
            href="#faq"
            onClick={closeMenu}
          >
            FAQ
          </a>

          <a
            href="/register"
            className="nav-cta"
            onClick={closeMenu}
          >
            Join the Crew
          </a>
        </div>

        <button
          type="button"
          className={`menu-button ${
            menuOpen ? "active" : ""
          }`}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero() {
  return (
    <header
      id="top"
      className="hero"
    >
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="hero-grid" />

      <div className="container hero-inner">
        <div className="hero-content">
          <Reveal>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              BUILD • LEARN • COLLABORATE
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="hero-title">
              Stop building
              <br />
              <span className="gradient-text">
                alone.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="hero-description">
              Tech Crew is where tech people
              find real collaborators, build
              meaningful projects, sharpen their
              skills and create opportunities
              together.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="hero-buttons">
              <a
                href="/register"
                className="btn btn-primary"
              >
                Join the Crew
                <span>→</span>
              </a>

              <a
                href="#about"
                className="btn btn-secondary"
              >
                Explore Tech Crew
              </a>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>100%</strong>
                <span>
                  Community-driven
                </span>
              </div>

              <div className="hero-stat">
                <strong>REAL</strong>
                <span>
                  Projects & collaboration
                </span>
              </div>

              <div className="hero-stat">
                <strong>OPEN</strong>
                <span>
                  To all skill levels
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="hero-visual-wrap"
          delay={150}
        >
          <div className="hero-visual">
            <div className="visual-glow" />

            <div className="visual-ring ring-large" />
            <div className="visual-ring ring-medium" />
            <div className="visual-ring ring-small" />

            <div className="visual-core">
              <img
                src={techLogo}
                alt="Tech Crew Logo"
              />
            </div>

            <div className="floating-chip chip-one">
              <span>⌘</span>
              <div>
                <strong>Build</strong>
                <small>
                  Real projects
                </small>
              </div>
            </div>

            <div className="floating-chip chip-two">
              <span>✦</span>
              <div>
                <strong>Learn</strong>
                <small>
                  Grow together
                </small>
              </div>
            </div>

            <div className="floating-chip chip-three">
              <span>↗</span>
              <div>
                <strong>Connect</strong>
                <small>
                  Create opportunities
                </small>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="hero-scroll">
        <span>Scroll to explore</span>
        <div />
      </div>
    </header>
  );
}

/* =========================================================
   ABOUT
========================================================= */

const aboutPoints = [
  {
    number: "01",
    title: "Learn from one another",
    description:
      "Every member has something to teach and something to gain.",
  },
  {
    number: "02",
    title: "Build real things",
    description:
      "Turn ideas into working products instead of keeping them theoretical.",
  },
  {
    number: "03",
    title: "Create real impact",
    description:
      "Use technology, creativity and collaboration to solve meaningful problems.",
  },
];

function About() {
  return (
    <section
      id="about"
      className="section"
    >
      <div className="container">
        <Reveal>
          <div className="section-heading">
            <span className="section-label">
              OUR MISSION
            </span>

            <h2>
              Growth in tech happens
              <br />
              faster{" "}
              <span className="gradient-text">
                together.
              </span>
            </h2>

            <p>
              Tech Crew is a working community
              built around participation,
              collaboration and action — not
              just another place to consume
              tech content.
            </p>
          </div>
        </Reveal>

        <div className="about-layout">
          <Reveal delay={80}>
            <TiltCard className="about-card">
              <span className="card-label">
                TECH CREW / 01
              </span>

              <div className="about-card-content">
                <div className="quote-mark">
                  “
                </div>

                <p>
                  Tech Crew brings ambitious
                  people together to learn,
                  collaborate, build real
                  projects and create
                  opportunities together.
                </p>

                <p>
                  The difference is
                  participation:
                  <strong>
                    {" "}
                    everyone learns,
                    everyone teaches,
                    everyone builds.
                  </strong>
                </p>
              </div>

              <div className="card-bottom-line" />
            </TiltCard>
          </Reveal>

          <div className="about-list">
            {aboutPoints.map(
              (point, index) => (
                <Reveal
                  key={point.number}
                  delay={
                    120 + index * 80
                  }
                >
                  <div className="about-item">
                    <span className="about-number">
                      {point.number}
                    </span>

                    <div>
                      <h3>
                        {point.title}
                      </h3>

                      <p>
                        {point.description}
                      </p>
                    </div>

                    <span className="about-arrow">
                      ↗
                    </span>
                  </div>
                </Reveal>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   WHAT WE OFFER
========================================================= */

const offerings = [
  {
    number: "01",
    icon: "◈",
    title: "Find collaborators",
    description:
      "The skill you need might already be in the crew. Find people who complement what you're building.",
    tags: [
      "Frontend",
      "Backend",
      "Data",
      "Design",
    ],
  },
  {
    number: "02",
    icon: "□",
    title: "Build real things",
    description:
      "Move beyond tutorials and create products, projects and experiences worth putting in your portfolio.",
    tags: [
      "Projects",
      "GitHub",
      "Portfolio",
    ],
  },
  {
    number: "03",
    icon: "✦",
    title: "Learn faster",
    description:
      "Real feedback, practical experience and peer learning help you sharpen your skills faster.",
    tags: [
      "Mentorship",
      "Feedback",
    ],
  },
  {
    number: "04",
    icon: "↗",
    title: "Create opportunities",
    description:
      "Strong relationships lead to jobs, freelance work, partnerships and new possibilities.",
    tags: [
      "Jobs",
      "Gigs",
      "Partnerships",
    ],
  },
];

function Offer() {
  return (
    <section
      id="offer"
      className="section section-alt"
    >
      <div className="container">
        <Reveal>
          <div className="section-heading section-heading-wide">
            <div>
              <span className="section-label">
                WHAT WE OFFER
              </span>

              <h2>
                More than a community —
                <br />
                <span className="gradient-text">
                  a working crew.
                </span>
              </h2>
            </div>

            <p>
              Everything is designed around
              one thing: helping people move
              from learning to doing.
            </p>
          </div>
        </Reveal>

        <div className="offer-grid">
          {offerings.map(
            (item, index) => (
              <Reveal
                key={item.number}
                delay={index * 70}
              >
                <TiltCard className="offer-card">
                  <div className="offer-header">
                    <span className="offer-number">
                      {item.number}
                    </span>

                    <div className="offer-icon">
                      {item.icon}
                    </div>
                  </div>

                  <div className="offer-content">
                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.description}
                    </p>
                  </div>

                  <div className="tag-row">
                    {item.tags.map(
                      (tag) => (
                        <span key={tag}>
                          {tag}
                        </span>
                      )
                    )}
                  </div>

                  <div className="offer-arrow">
                    ↗
                  </div>
                </TiltCard>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOW IT WORKS
========================================================= */

const steps = [
  {
    number: "01",
    title: "Join the Crew",
    description:
      "Come with curiosity, ambition and the willingness to contribute.",
  },
  {
    number: "02",
    title: "Bring your skills",
    description:
      "Share what you know, what you're learning and what you want to build.",
  },
  {
    number: "03",
    title: "Find your people",
    description:
      "Connect with people whose skills and ideas complement yours.",
  },
  {
    number: "04",
    title: "Build & ship",
    description:
      "Turn ideas into real repositories, products and deliverables.",
  },
  {
    number: "05",
    title: "Grow your portfolio",
    description:
      "Build proof of work that demonstrates what you can actually do.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how"
      className="section"
    >
      <div className="container narrow-container">
        <Reveal>
          <div className="section-heading centered">
            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              From joining
              <br />
              to{" "}
              <span className="gradient-text">
                shipping.
              </span>
            </h2>

            <p>
              A simple process designed to
              turn connections into meaningful
              work.
            </p>
          </div>
        </Reveal>

        <div className="steps-list">
          {steps.map(
            (step, index) => (
              <Reveal
                key={step.number}
                delay={index * 60}
              >
                <div className="step-item">
                  <span className="step-number">
                    {step.number}
                  </span>

                  <div className="step-content">
                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.description}
                    </p>
                  </div>

                  <span className="step-arrow">
                    →
                  </span>
                </div>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LEADERSHIP
========================================================= */

const team = [
  {
    role: "President",
    description:
      "Leading the vision, culture and strategic direction of the crew.",
    image: leader,
  },
  {
    role: "Vice President",
    description:
      "Strengthening community, communication and member engagement.",
    image: vice,
  },
  {
    role: "Technical / Project Lead",
    description:
      "Driving technical execution and helping turn ideas into working products.",
    image: project,
  },
  {
    role: "General Secretary",
    description:
      "Keeping operations, records and internal coordination organized.",
    image: secretary,
  },
];

function Team() {
  return (
    <section
      id="team"
      className="section section-alt team-section"
    >
      <div className="container">
        <Reveal>
          <div className="section-heading centered">
            <span className="section-label">
              LEADERSHIP
            </span>

            <h2>
              The people behind
              <br />
              the{" "}
              <span className="gradient-text">
                crew.
              </span>
            </h2>

            <p>
              A focused leadership team
              helping shape the direction
              while the wider crew builds
              alongside us.
            </p>
          </div>
        </Reveal>

        <div className="leadership-grid">
          {team.map(
            (member, index) => (
              <Reveal
                key={member.role}
                delay={index * 80}
              >
                <TiltCard className="leader-card">
                  <div className="leader-image">
                    <img
                      src={member.image}
                      alt={member.role}
                    />

                    <div className="leader-image-overlay" />

                    <span className="leader-number">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="leader-card-content">
                    <span className="leader-kicker">
                      TECH CREW LEADERSHIP
                    </span>

                    <h3>
                      {member.role}
                    </h3>

                    <p>
                      {member.description}
                    </p>

                    <div className="leader-bottom">
                      <span>
                        TECH CREW
                      </span>

                      <span className="leader-arrow">
                        ↗
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PROJECT PROPOSAL MODAL
========================================================= */

function ProjectProposalModal({
  onClose,
}) {
  const [members, setMembers] =
    useState([]);

  const [loadingMembers, setLoadingMembers] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    member_name: "",
    project_name: "",
    problem: "",
    solution: "",
    demo_link: "",
    contact: "",
  });

  useEffect(() => {
    const loadMembers = async () => {
      setLoadingMembers(true);
      setError("");

      try {
        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "get_crew_member_names"
        );

        if (rpcError) {
          throw rpcError;
        }

        const names = [
          ...new Set(
            (data || [])
              .map(
                (item) =>
                  item.full_name?.trim()
              )
              .filter(Boolean)
          ),
        ];

        setMembers(names);
      } catch (err) {
        console.error(
          "Member lookup error:",
          err
        );

        setError(
          "We couldn't load registered crew members right now."
        );
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [onClose]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.member_name) {
      setError(
        "Please select your registered name."
      );
      return;
    }

    if (!form.project_name.trim()) {
      setError(
        "Please enter the project name."
      );
      return;
    }

    if (!form.problem.trim()) {
      setError(
        "Please describe the problem."
      );
      return;
    }

    if (!form.solution.trim()) {
      setError(
        "Please describe the solution."
      );
      return;
    }

    if (!form.contact.trim()) {
      setError(
        "Please provide an email or WhatsApp number."
      );
      return;
    }

    if (
      form.demo_link.trim() &&
      !/^https?:\/\//i.test(
        form.demo_link.trim()
      )
    ) {
      setError(
        "The demo link must start with http:// or https://."
      );
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: membersAgain,
        error: verifyError,
      } = await supabase.rpc(
        "get_crew_member_names"
      );

      if (verifyError) {
        throw verifyError;
      }

      const memberExists =
        (membersAgain || []).some(
          (item) =>
            item.full_name ===
            form.member_name
        );

      if (!memberExists) {
        throw new Error(
          "That registered name could not be verified."
        );
      }

      const {
        error: proposalError,
      } = await supabase
        .from("project_proposals")
        .insert([
          {
            member_name:
              form.member_name,

            project_name:
              form.project_name.trim(),

            problem:
              form.problem.trim(),

            solution:
              form.solution.trim(),

            demo_link:
              form.demo_link.trim() ||
              null,

            contact:
              form.contact.trim(),
          },
        ]);

      if (proposalError) {
        throw proposalError;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(
        "Project proposal error:",
        err
      );

      setError(
        err.message ||
          "We couldn't submit the project proposal."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="project-modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <button
          type="button"
          className="project-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {!submitted ? (
          <>
            <div className="project-modal-header">
              <span className="section-label">
                PROJECT STUDIO
              </span>

              <h2 id="project-modal-title">
                Start something
                <br />
                <span className="gradient-text">
                  meaningful.
                </span>
              </h2>

              <p>
                Have an idea that could
                become a real Tech Crew
                project? Tell us about it.
              </p>
            </div>

            <form
              className="project-form"
              onSubmit={handleSubmit}
            >
              <div className="project-form-field">
                <label htmlFor="member_name">
                  Your registered name
                  <span>*</span>
                </label>

                <select
                  id="member_name"
                  name="member_name"
                  value={form.member_name}
                  onChange={handleChange}
                  disabled={
                    loadingMembers ||
                    members.length === 0
                  }
                >
                  <option value="">
                    {loadingMembers
                      ? "Loading registered members..."
                      : members.length === 0
                      ? "No registered members found"
                      : "Select your name"}
                  </option>

                  {members.map(
                    (name) => (
                      <option
                        key={name}
                        value={name}
                      >
                        {name}
                      </option>
                    )
                  )}
                </select>

                <small>
                  Only registered Tech Crew
                  members can propose projects.
                </small>
              </div>

              <div className="project-form-field">
                <label htmlFor="project_name">
                  Project name
                  <span>*</span>
                </label>

                <input
                  id="project_name"
                  name="project_name"
                  type="text"
                  value={form.project_name}
                  onChange={handleChange}
                  placeholder="e.g. Tech Crew Jobs Hub"
                />
              </div>

              <div className="project-form-field">
                <label htmlFor="problem">
                  What problem are you solving?
                  <span>*</span>
                </label>

                <textarea
                  id="problem"
                  name="problem"
                  value={form.problem}
                  onChange={handleChange}
                  placeholder="Describe the problem clearly..."
                  rows="4"
                />
              </div>

              <div className="project-form-field">
                <label htmlFor="solution">
                  What is your solution?
                  <span>*</span>
                </label>

                <textarea
                  id="solution"
                  name="solution"
                  value={form.solution}
                  onChange={handleChange}
                  placeholder="Explain how your idea solves the problem..."
                  rows="4"
                />
              </div>

              <div className="project-form-grid">
                <div className="project-form-field">
                  <label htmlFor="demo_link">
                    Demo link
                    <span className="optional">
                      Optional
                    </span>
                  </label>

                  <input
                    id="demo_link"
                    name="demo_link"
                    type="url"
                    value={form.demo_link}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="project-form-field">
                  <label htmlFor="contact">
                    Email or WhatsApp
                    <span>*</span>
                  </label>

                  <input
                    id="contact"
                    name="contact"
                    type="text"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="How can we reach you?"
                  />
                </div>
              </div>

              {error && (
                <div className="project-form-error">
                  <span>!</span>

                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary project-submit"
                disabled={
                  submitting ||
                  loadingMembers ||
                  members.length === 0
                }
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Project Proposal"}

                {!submitting && (
                  <span>→</span>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="project-success">
            <div className="project-success-icon">
              ✓
            </div>

            <span className="section-label">
              PROPOSAL RECEIVED
            </span>

            <h2>
              Great idea.
              <br />
              <span className="gradient-text">
                Let's build.
              </span>
            </h2>

            <p>
              Your project proposal has
              been submitted successfully.
              The Tech Crew team can now
              review the idea and contact
              you through the details you
              provided.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PROJECTS
========================================================= */

function Projects({
  onProposeProject,
}) {
  return (
    <section
      id="projects"
      className="section projects-section"
    >
      <div className="container">
        <Reveal>
          <div className="projects-layout">
            <div className="projects-content">
              <span className="section-label">
                PROJECTS
              </span>

              <h2>
                Ideas become
                <br />
                <span className="gradient-text">
                  real work.
                </span>
              </h2>

              <p>
                Bring a meaningful problem,
                propose a solution and find
                people who can help turn the
                idea into something real.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={onProposeProject}
              >
                Start / Propose a Project
                <span>→</span>
              </button>
            </div>

            <div className="projects-visual">
              <img
                src={techImages.collaboration}
                alt="Tech team collaborating"
              />

              <div className="projects-visual-overlay" />

              <div className="projects-visual-card">
                <span>
                  TECH CREW / PROJECT STUDIO
                </span>

                <strong>
                  Build with people.
                </strong>

                <small>
                  Not alone.
                </small>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="projects-bottom">
            <div>
              <span>
                HAVE AN IDEA?
              </span>

              <h3>
                Submit the problem.
                <strong>
                  Find the crew.
                </strong>
              </h3>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onProposeProject}
            >
              Propose your idea
              <span>→</span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   CONTACT
========================================================= */

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sending, setSending] =
    useState(false);

  const [sent, setSent] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError(
        "Please enter your name."
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (
      !/^\S+@\S+\.\S+$/.test(
        form.email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!form.message.trim()) {
      setError(
        "Please tell us what you'd like to say."
      );
      return;
    }

    setSending(true);

    try {
      const {
        error: insertError,
      } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: form.name.trim(),
            email:
              form.email
                .trim()
                .toLowerCase(),
            message:
              form.message.trim(),
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      setSent(true);

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error(
        "Contact form error:",
        err
      );

      setError(
        "We couldn't send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="section contact-section"
    >
      <div className="container">
        <div className="contact-layout">
          <Reveal>
            <div className="contact-content">
              <span className="section-label">
                GET IN TOUCH
              </span>

              <h2>
                Have something
                <br />
                <span className="gradient-text">
                  to say?
                </span>
              </h2>

              <p>
                Have a question, idea,
                partnership opportunity or
                just want to say hello?
                We'd love to hear from you.
              </p>

              <div className="contact-image">
                <img
                  src={techImages.team}
                  alt="Tech team working together"
                />

                <div className="contact-image-overlay" />

                <div className="contact-image-text">
                  <span>
                    TECH CREW
                  </span>

                  <strong>
                    Let's connect.
                  </strong>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {!sent ? (
              <form
                className="contact-card"
                onSubmit={handleSubmit}
              >
                <div className="contact-card-heading">
                  <h3>
                    Send us a message
                  </h3>

                  <p>
                    We'll get back to you
                    as soon as we can.
                  </p>
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-name">
                    Name
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">
                    Email
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-message">
                    What would you like to say to us?
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    rows="7"
                    required
                  />
                </div>

                {error && (
                  <div className="contact-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary contact-submit"
                  disabled={sending}
                >
                  {sending
                    ? "Sending..."
                    : "Send Message"}

                  {!sending && (
                    <span>→</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="contact-success">
                <div className="contact-success-icon">
                  ✓
                </div>

                <span className="section-label">
                  MESSAGE SENT
                </span>

                <h3>
                  Thanks for reaching
                  out.
                </h3>

                <p>
                  Your message has been
                  received successfully.
                  We'll get back to you soon.
                </p>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setSent(false)
                  }
                >
                  Send another message
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FAQ
========================================================= */

const faqs = [
  {
    question:
      "Is it free to join?",
    answer:
      "Yes. Tech Crew is free and mission-driven. Membership itself remains focused on learning, collaboration and community.",
  },
  {
    question:
      "Do I need to be experienced?",
    answer:
      "No. We welcome beginners, intermediate builders and experienced professionals. Everyone has something to learn and something to contribute.",
  },
  {
    question:
      "What's expected of me?",
    answer:
      "Participation. Show up, contribute what you know, stay open to learning and help make the community useful for everyone.",
  },
  {
    question:
      "How do I find a collaborator?",
    answer:
      "Get involved, share what you are building and let people know what skills you need. Collaboration starts with visibility and conversation.",
  },
];

function FAQ() {
  const [open, setOpen] =
    useState(null);

  return (
    <section
      id="faq"
      className="section"
    >
      <div className="container faq-container">
        <Reveal>
          <div className="section-heading">
            <span className="section-label">
              FAQ
            </span>

            <h2>
              Good to
              <br />
              <span className="gradient-text">
                know.
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="faq-list">
          {faqs.map(
            (faq, index) => {
              const isOpen =
                open === index;

              return (
                <Reveal
                  key={faq.question}
                  delay={index * 60}
                >
                  <div
                    className={`faq-item ${
                      isOpen
                        ? "open"
                        : ""
                    }`}
                    onClick={() =>
                      setOpen(
                        isOpen
                          ? null
                          : index
                      )
                    }
                  >
                    <div className="faq-question">
                      <span>
                        {
                          faq.question
                        }
                      </span>

                      <span className="faq-icon">
                        {isOpen
                          ? "−"
                          : "+"}
                      </span>
                    </div>

                    <div className="faq-answer">
                      <p>
                        {
                          faq.answer
                        }
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   JOIN
========================================================= */

function Join() {
  return (
    <section
      id="join"
      className="section"
    >
      <div className="container">
        <Reveal>
          <div className="join-panel">
            <div className="join-orb join-orb-one" />
            <div className="join-orb join-orb-two" />

            <div className="join-content">
              <span className="section-label">
                YOUR NEXT MOVE
              </span>

              <h2>
                Stop building{" "}
                <span className="gradient-text">
                  alone.
                </span>
              </h2>

              <p>
                Whether you're here to
                learn, collaborate or
                build your next big idea —
                there's a seat for you.
              </p>

              <div className="join-buttons">
                <a
                  href="/register"
                  className="btn btn-primary"
                >
                  Join the Community
                  <span>→</span>
                </a>

                <a
                  href="https://github.com/techcrewsorg/tech-crews"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   FOOTER
========================================================= */

const socials = [
  {
    name: "X",
    url:
      "https://x.com/TechCrewsorg",
    icon: <XIcon />,
  },
  {
    name: "LinkedIn",
    url:
      "https://www.linkedin.com/in/tech-crews-57a430437",
    icon: <LinkedInIcon />,
  },
  {
    name: "GitHub",
    url:
      "https://github.com/techcrewsorg/tech-crews",
    icon: <GitHubIcon />,
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-main">
          <a
            href="#top"
            className="brand"
          >
            <img
              src={techLogo}
              alt="Tech Crew"
              className="nav-logo"
            />

            <span className="nav-title">
              Tech <span>Crew</span>
            </span>
          </a>

          <p>
            Connecting, learning,
            building and creating
            impact together.
          </p>

          <div className="socials">
            {socials.map(
              (social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={
                    social.name
                  }
                  title={
                    social.name
                  }
                >
                  {social.icon}
                </a>
              )
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            ©{" "}
            {new Date().getFullYear()}{" "}
            Tech Crew. All rights
            reserved.
          </span>

          <span>
            Built by the crew.
          </span>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [
    projectModalOpen,
    setProjectModalOpen,
  ] = useState(false);

  useEffect(() => {
    document.body.style.overflow =
      projectModalOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [projectModalOpen]);

  return (
    <div className="app">
      <CursorGlow />

      <Navbar />

      <main>
        <Hero />

        <About />

        <Offer />

        <HowItWorks />

        <Team />

        <Projects
          onProposeProject={() =>
            setProjectModalOpen(true)
          }
        />

        <Contact />

        <FAQ />

        <Join />
      </main>

      <Footer />

      {projectModalOpen && (
        <ProjectProposalModal
          onClose={() =>
            setProjectModalOpen(false)
          }
        />
      )}
    </div>
  );
}