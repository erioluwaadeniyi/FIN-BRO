import React, { useState } from "react";
import { supabase } from "./supabase";
import "./Register.css";

const WHATSAPP_LINK =
  "https://chat.whatsapp.com/IKpHaLyaCQx5FxlA2ddKip";

const initialForm = {
  full_name: "",
  email: "",
  whatsapp: "",
  location: "",
  role: "",
  skill_level: "",
  skills: "",
  learning_goals: "",
  contribution: "",
  github: "",
  linkedin: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!form.full_name.trim()) {
      return "Please enter your full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (!form.whatsapp.trim()) {
      return "Please enter your WhatsApp number.";
    }

    if (form.whatsapp.trim().length < 7) {
      return "Please enter a valid WhatsApp number.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const registration = {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        whatsapp: form.whatsapp.trim(),
        location: form.location.trim(),
        role: form.role,
        skill_level: form.skill_level,
        skills: form.skills.trim(),
        learning_goals: form.learning_goals.trim(),
        contribution: form.contribution.trim(),
        github: form.github.trim(),
        linkedin: form.linkedin.trim(),
      };

      const { error: insertError } = await supabase
        .from("registrations")
        .insert([registration]);

      if (insertError) {
        console.error("Supabase registration error:", insertError);

        if (insertError.code === "23505") {
          throw new Error(
            "This email has already been registered."
          );
        }

        throw new Error(
          "We couldn't complete your registration. Please try again."
        );
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="register-page">
        <div className="register-background">
          <div className="register-orb register-orb-one" />
          <div className="register-orb register-orb-two" />
          <div className="register-grid" />
        </div>

        <div className="success-wrapper">
          <section className="success-card">
            <div className="success-check">
              ✓
            </div>

            <span className="success-label">
              REGISTRATION COMPLETE
            </span>

            <h1>
              Welcome to{" "}
              <span className="gradient-text">
                Tech Crew.
              </span>
            </h1>

            <p>
              Your registration has been successfully
              submitted. You're now one step away from
              joining the Tech Crew community.
            </p>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="register-button whatsapp-button"
            >
              <span>Join the WhatsApp Community</span>
              <span>→</span>
            </a>

            <a href="/" className="return-link">
              ← Back to Tech Crew
            </a>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="register-page">
      <div className="register-background">
        <div className="register-orb register-orb-one" />
        <div className="register-orb register-orb-two" />
        <div className="register-grid" />
      </div>

      <div className="register-container">
        <header className="register-navbar">
          <a href="/" className="register-brand">
            <div className="register-logo">
              TC
            </div>

            <div>
              <span>Tech</span>{" "}
              <strong>Crew</strong>
            </div>
          </a>

          <a href="/" className="return-link">
            ← Back to website
          </a>
        </header>

        <section className="register-hero">
          <span className="register-label">
            JOIN THE CREW
          </span>

          <h1>
            Let's build
            <br />
            <span className="gradient-text">
              together.
            </span>
          </h1>

          <p>
            Tell us a little about yourself, your skills
            and what you hope to get from Tech Crew.
          </p>
        </section>

        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >
          {/* =====================================================
              SECTION 01
          ===================================================== */}

          <section className="form-section">
            <div className="form-section-header">
              <span className="form-section-number">
                01
              </span>

              <div>
                <h2>About you</h2>

                <p>
                  Basic information to help us know you.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field full">
                <label htmlFor="full_name">
                  Full Name
                  <span>*</span>
                </label>

                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">
                  Email Address
                  <span>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="whatsapp">
                  WhatsApp Number
                  <span>*</span>
                </label>

                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Lagos, Nigeria"
                  autoComplete="address-level2"
                />
              </div>

              <div className="form-field">
                <label htmlFor="role">
                  What do you do?
                </label>

                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="">
                    Select your role
                  </option>

                  <option value="Frontend Developer">
                    Frontend Developer
                  </option>

                  <option value="Backend Developer">
                    Backend Developer
                  </option>

                  <option value="Full Stack Developer">
                    Full Stack Developer
                  </option>

                  <option value="Data Analyst">
                    Data Analyst
                  </option>

                  <option value="Data Scientist">
                    Data Scientist
                  </option>

                  <option value="UI/UX Designer">
                    UI/UX Designer
                  </option>

                  <option value="Product Manager">
                    Product Manager
                  </option>

                  <option value="DevOps Engineer">
                    DevOps Engineer
                  </option>

                  <option value="Cybersecurity">
                    Cybersecurity
                  </option>

                  <option value="Cloud Engineer">
                    Cloud Engineer
                  </option>

                  <option value="Student">
                    Student
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* =====================================================
              SECTION 02
          ===================================================== */}

          <section className="form-section">
            <div className="form-section-header">
              <span className="form-section-number">
                02
              </span>

              <div>
                <h2>Your skills</h2>

                <p>
                  Tell us what you know and what you
                  want to learn.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="skill_level">
                  Skill Level
                </label>

                <select
                  id="skill_level"
                  name="skill_level"
                  value={form.skill_level}
                  onChange={handleChange}
                >
                  <option value="">
                    Select your level
                  </option>

                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>

                  <option value="Expert">
                    Expert
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="skills">
                  Skills / Technologies
                </label>

                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Python, Figma..."
                />
              </div>

              <div className="form-field full">
                <label htmlFor="learning_goals">
                  What do you want to learn?
                </label>

                <textarea
                  id="learning_goals"
                  name="learning_goals"
                  value={form.learning_goals}
                  onChange={handleChange}
                  placeholder="Tell us what you want to learn or improve..."
                  rows="5"
                />
              </div>

              <div className="form-field full">
                <label htmlFor="contribution">
                  What can you contribute?
                </label>

                <textarea
                  id="contribution"
                  name="contribution"
                  value={form.contribution}
                  onChange={handleChange}
                  placeholder="How would you like to contribute to Tech Crew?"
                  rows="5"
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              SECTION 03
          ===================================================== */}

          <section className="form-section">
            <div className="form-section-header">
              <span className="form-section-number">
                03
              </span>

              <div>
                <h2>Your profiles</h2>

                <p>
                  Optional — help other builders find you.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="github">
                  GitHub
                </label>

                <input
                  id="github"
                  name="github"
                  type="url"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="form-field">
                <label htmlFor="linkedin">
                  LinkedIn
                </label>

                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (
            <div className="form-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* =====================================================
              SUBMIT
          ===================================================== */}

          <div className="form-submit">
            <div className="submit-info">
              <span className="submit-lock">
                ✓
              </span>

              <p>
                Your information is used only for
                Tech Crew community registration.
              </p>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Complete Registration"}

              {!loading && <span>→</span>}
            </button>
          </div>
        </form>

        <footer className="register-footer">
          <span>
            © {new Date().getFullYear()} Tech Crew
          </span>

          <span>
            Connecting. Learning. Building.
          </span>
        </footer>
      </div>
    </main>
  );
}