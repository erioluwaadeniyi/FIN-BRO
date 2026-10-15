
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import BudgetOverview from "../components/BudgetOverview";
import SpendingChart from "../components/SpendingChart";
import ExpenseBreakdown from "../components/ExpenseBreakdown";
import RecentTransactions from "../components/RecentTransactions";

import { useTransactions } from "../context/TransactionsContext.jsx";
import "../styles/Dashboard.css";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { transactions } = useTransactions();

  const totalIncome = transactions.reduce((total, transaction) => {
    const amount = Number(transaction.amount);

    if (
      String(transaction.type || "").toLowerCase() !== "income" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return total;
    }

    return total + amount;
  }, 0);

  const totalExpenses = transactions.reduce((total, transaction) => {
    const amount = Number(transaction.amount);

    if (
      String(transaction.type || "").toLowerCase() !== "expense" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return total;
    }

    return total + amount;
  }, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="dashboard">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="dashboard__main">
        <Navbar
          title="Dashboard"
          subtitle="Here's an overview of your finances."
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="dashboard__content">
          <section className="dashboard__welcome">
            <div>
              <span className="dashboard__eyebrow">
                YOUR FINANCIAL OVERVIEW
              </span>

              <h2>Manage your money with clarity.</h2>

              <p>
                Keep track of what comes in, what goes out, and
                what you have left.
              </p>
            </div>
          </section>

          <SummaryCards
            balance={balance}
            income={totalIncome}
            expenses={totalExpenses}
          />

          {/* Monthly budget progress */}
          <BudgetOverview />

          {/* Financial analytics */}
          <section className="dashboard__analytics">
            <SpendingChart transactions={transactions} />

            <ExpenseBreakdown transactions={transactions} />
          </section>

          {/* Recent activity */}
          <RecentTransactions transactions={transactions} />

          <footer className="dashboard__footer">
            <span>FINBRO</span>
            <span>Take control of your finances.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
