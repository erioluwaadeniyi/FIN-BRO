
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext.jsx";

import "../styles/Settings.css";

function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="dashboard settings-page">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="dashboard__main">
        <Navbar
          title="Settings"
          subtitle="Customize your FINBRO experience."
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="dashboard__content">
          <section className="dashboard__welcome">
            <div>
              <h2>Settings</h2>
              <p>Choose how FINBRO looks on your device.</p>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-theme-row">
              <div className="settings-theme-icon">
                {isDark ? (
                  <Moon size={21} />
                ) : (
                  <Sun size={21} />
                )}
              </div>

              <div className="settings-theme-info">
                <h3>Dark mode</h3>
                <p>
                  {isDark
                    ? "Dark theme is enabled."
                    : "Dark theme is disabled."}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label="Toggle dark mode"
                className={`settings-switch ${
                  isDark ? "settings-switch--on" : ""
                }`}
                onClick={toggleTheme}
              >
                <span className="settings-switch__thumb" />
              </button>
            </div>
          </section>

          <footer className="dashboard__footer">
            <span>FINBRO</span>
            <span>Take control of your finances.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Settings;
