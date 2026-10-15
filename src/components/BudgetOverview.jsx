
import { Link } from "react-router-dom";
import { ArrowRight, PiggyBank } from "lucide-react";

import { useTransactions } from "../context/TransactionsContext.jsx";
import "../styles/BudgetOverview.css";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function getCurrentMonth() {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
}

function BudgetOverview() {
  const { budgets, transactions } = useTransactions();
  const month = getCurrentMonth();

  const monthlyBudgets = budgets.filter(
    (budget) => budget.month === month
  );

  const monthExpenses = transactions.filter(
    (transaction) =>
      String(transaction.type || "").toLowerCase() === "expense" &&
      String(transaction.date || "").startsWith(month) &&
      Number.isFinite(Number(transaction.amount)) &&
      Number(transaction.amount) > 0
  );

  const budgetRows = monthlyBudgets.map((budget) => {
    const categoryKey = String(budget.category || "")
      .trim()
      .toLowerCase();

    const spent = monthExpenses
      .filter(
        (transaction) =>
          String(transaction.category || "Other")
            .trim()
            .toLowerCase() === categoryKey
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const limit = Number(budget.amount) || 0;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;

    return {
      ...budget,
      limit,
      spent,
      percentage,
      remaining: limit - spent,
    };
  });

  const totalLimit = budgetRows.reduce(
    (total, budget) => total + budget.limit,
    0
  );

  const totalSpent = budgetRows.reduce(
    (total, budget) => total + budget.spent,
    0
  );

  const remaining = totalLimit - totalSpent;

  const monthLabel = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5, 7)) - 1,
    1
  ).toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className="budget-overview"
      aria-labelledby="budget-overview-title"
    >
      <div className="budget-overview__header">
        <div className="budget-overview__heading">
          <div className="budget-overview__icon">
            <PiggyBank size={22} />
          </div>

          <div>
            <h3 id="budget-overview-title">Monthly Budget</h3>
            <p>{monthLabel}</p>
          </div>
        </div>

        <Link to="/budgets" className="budget-overview__view-all">
          Manage budgets
          <ArrowRight size={16} />
        </Link>
      </div>

      {budgetRows.length === 0 ? (
        <div className="budget-overview__empty">
          <h4>Give your money a plan.</h4>

          <p>
            Set monthly spending limits for food, rent, transport,
            entertainment, and other categories.
          </p>

          <Link to="/budgets" className="budget-overview__create">
            Set your first budget
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="budget-overview__summary">
            <div>
              <span>Total budgeted</span>
              <strong>{currencyFormatter.format(totalLimit)}</strong>
            </div>

            <div>
              <span>Spent in budgeted categories</span>
              <strong>{currencyFormatter.format(totalSpent)}</strong>
            </div>

            <div>
              <span>Remaining</span>
              <strong
                className={
                  remaining < 0
                    ? "budget-overview__negative"
                    : ""
                }
              >
                {currencyFormatter.format(remaining)}
              </strong>
            </div>
          </div>

          <div className="budget-overview__list">
            {budgetRows
              .sort((a, b) => b.percentage - a.percentage)
              .slice(0, 4)
              .map((budget) => {
                const isOverBudget = budget.percentage > 100;
                const isAtLimit = budget.percentage >= 80;

                return (
                  <div
                    className="budget-overview__item"
                    key={budget.id}
                  >
                    <div className="budget-overview__item-top">
                      <span className="budget-overview__category">
                        {budget.category}
                      </span>

                      <span className="budget-overview__amounts">
                        {currencyFormatter.format(budget.spent)}
                        <span>
                          {" "}
                          / {currencyFormatter.format(budget.limit)}
                        </span>
                      </span>
                    </div>

                    <div
                      className="budget-overview__track"
                      role="progressbar"
                      aria-label={`${budget.category} budget used`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.min(
                        100,
                        Math.round(budget.percentage)
                      )}
                    >
                      <div
                        className={`budget-overview__fill ${
                          isOverBudget
                            ? "budget-overview__fill--over"
                            : isAtLimit
                              ? "budget-overview__fill--warning"
                              : ""
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, budget.percentage)
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="budget-overview__item-bottom">
                      <span>
                        {budget.percentage.toFixed(0)}% used
                      </span>

                      <span
                        className={
                          budget.remaining < 0
                            ? "budget-overview__negative"
                            : ""
                        }
                      >
                        {budget.remaining < 0
                          ? `${currencyFormatter.format(
                              Math.abs(budget.remaining)
                            )} over budget`
                          : `${currencyFormatter.format(
                              budget.remaining
                            )} left`}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {budgetRows.length > 4 && (
            <Link
              to="/budgets"
              className="budget-overview__more"
            >
              View all {budgetRows.length} category budgets
            </Link>
          )}
        </>
      )}
    </section>
  );
}

export default BudgetOverview;
