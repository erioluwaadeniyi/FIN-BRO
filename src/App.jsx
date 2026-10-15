
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";

import { TransactionsProvider } from "./context/TransactionsContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import "./styles/Dashboard.css";
import "./styles/Theme.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TransactionsProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route path="/budgets" element={<Budgets />} />

            <Route path="/settings" element={<Settings />} />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </TransactionsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
