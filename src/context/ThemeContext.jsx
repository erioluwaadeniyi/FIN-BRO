
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "finbro_theme";

function getInitialTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark"
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("FINBRO could not save the theme preference:", error);
    }
  }, [theme]);

  function setTheme(nextTheme) {
    if (nextTheme === "light" || nextTheme === "dark") {
      setThemeState(nextTheme);
    }
  }

  function toggleTheme() {
    setThemeState((current) =>
      current === "dark" ? "light" : "dark"
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider."
    );
  }

  return context;
}
