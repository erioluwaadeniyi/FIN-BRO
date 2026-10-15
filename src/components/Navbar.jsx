
import { Menu, CalendarDays } from "lucide-react";
import "../styles/Navbar.css";

function Navbar({
  title = "Dashboard",
  subtitle = "Here's an overview of your finances.",
  onMenuClick = () => {},
}) {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          type="button"
          className="navbar__menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-controls="finbro-sidebar"
        >
          <Menu size={23} />
        </button>

        <div className="navbar__heading">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="navbar__right">
        <div className="navbar__date">
          <CalendarDays size={17} strokeWidth={1.8} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
