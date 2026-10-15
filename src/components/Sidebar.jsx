
import { NavLink } from "react-router-dom";
import {
  WalletCards,
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Settings,
  X,
} from "lucide-react";

import "../styles/Sidebar.css";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Budgets",
    path: "/budgets",
    icon: PiggyBank,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar({ isOpen = false, onClose = () => {} }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          className="sidebar__overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        id="finbro-sidebar"
        className={`sidebar ${isOpen ? "sidebar--open" : ""}`}
        aria-label="Main navigation"
      >
        {/* FINBRO branding */}
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">
            <WalletCards size={25} strokeWidth={2.2} />
          </div>

          <div className="sidebar__brand-text">
            <h2>FINBRO</h2>
            <span>PERSONAL FINANCE</span>
          </div>

          <button
            type="button"
            className="sidebar__close"
            aria-label="Close sidebar"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="sidebar__section">
          <p className="sidebar__section-label">WORKSPACE</p>

          <nav className="sidebar__nav">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar__link ${
                      isActive ? "sidebar__link--active" : ""
                    }`
                  }
                >
                  <Icon size={20} strokeWidth={1.9} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Finance tip */}
        <div className="sidebar__bottom">
          <div className="sidebar__tip">
            <div className="sidebar__tip-icon">
              <PiggyBank size={22} />
            </div>

            <h3>Money with purpose.</h3>

            <p>
              Track your spending, understand your habits, and
              stay within your budget.
            </p>
          </div>

          {/* Sidebar footer */}
          <div className="sidebar__footer">
            <span className="sidebar__footer-dot" />
            <span>Your personal finance workspace</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
