
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Pencil,
  PiggyBank,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTransactions } from "../context/TransactionsContext.jsx";

import "../styles/Budgets.css";

const BASE_CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

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

function getMonthLabel(month) {
  const match = /^(\d{4})-(\d{2})$/.exec(month);

  if (!match) return month;

  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    1
  ).toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });
}

function Budgets() {
  const {
    budgets,
    transactions,
    saveBudget,
    deleteBudget,
  } = useTransactions();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [editingBudget, setEditingBudget] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const categories = useMemo(() => {
    const extras = [
      ...budgets.map((budget) => budget.category),
      ...transactions
        .filter(
          (transaction) =>
            String(transaction.type || "").toLowerCase() === "expense"
        )
        .map((transaction) => transaction.category),
    ].filter(Boolean);

    return [...new Set([...BASE_CATEGORIES, ...extras])];
  }, [budgets, transactions]);

  const monthBudgets = useMemo(
    () =>
      budgets
        .filter((budget) => budget.month === selectedMonth)
        .map((budget) => ({
          ...budget,
          amount: Number(budget.amount) || 0,
        }))
        .sort((a, b) => a.category.localeCompare(b.category)),
    [budgets, selectedMonth]
  );

  const monthExpenses = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          String(transaction.type || "").toLowerCase() === "expense" &&
          String(transaction.date || "").startsWith(selectedMonth) &&
          Number.isFinite(Number(transaction.amount)) &&
          Number(transaction.amount) > 0
      ),
    [transactions, selectedMonth]
  );

  const spendingByCategory = useMemo(() => {
    return monthExpenses.reduce((totals, transaction) => {
      const key = String(transaction.category || "Other")
        .trim()
        .toLowerCase();

      totals[key] = (totals[key] || 0) + Number(transaction.amount);

      return totals;
    }, {});
  }, [monthExpenses]);

  function getSpent(categoryName) {
    return (
      spendingByCategory[
        String(categoryName || "").trim().toLowerCase()
      ] || 0
    );
  }

  const budgetRows = monthBudgets.map((budget) => {
    const spent = getSpent(budget.category);
    const percentage =
      budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

    return {
      ...budget,
      spent,
      percentage,
      remaining: budget.amount - spent,
    };
  });

  const totalAllocated = budgetRows.reduce(
    (total, budget) => total + budget.amount,
    0
  );

  const totalSpentInBudgetedCategories = budgetRows.reduce(
    (total, budget) => total + budget.spent,
    0
  );

  const totalMonthlyExpenses = monthExpenses.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );

  const budgetedCategoryKeys = new Set(
    monthBudgets.map((budget) =>
      String(budget.category || "").trim().toLowerCase()
    )
  );

  const unbudgetedSpending = monthExpenses.reduce(
    (total, transaction) => {
      const key = String(transaction.category || "Other")
        .trim()
        .toLowerCase();

      return budgetedCategoryKeys.has(key)
        ? total
        : total + Number(transaction.amount);
    },
    0
  );

  const remaining =
    totalAllocated - totalSpentInBudgetedCategories;

  const overBudgetCount = budgetRows.filter(
    (budget) => budget.spent > budget.amount
  ).length;

  const existingBudgetForSelection = monthBudgets.find(
    (budget) =>
      String(budget.category).trim().toLowerCase() ===
      category.trim().toLowerCase()
  );

  function handleMonthChange(event) {
    setSelectedMonth(event.target.value);
    setEditingBudget(null);
    setAmount("");
    setError("");
    setNotice("");
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setEditingBudget(null);
    setError("");
    setNotice("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!selectedMonth) {
      setError("Choose the month for this budget.");
      return;
    }

    if (!category.trim()) {
      setError("Choose a spending category.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a budget amount greater than zero.");
      return;
    }

    const wasEditing = Boolean(editingBudget);

    saveBudget({
      category: category.trim(),
      month: selectedMonth,
      amount: numericAmount,
    });

    setEditingBudget(null);
    setAmount("");
    setError("");
    setNotice(
      wasEditing
        ? "Budget updated successfully."
        : existingBudgetForSelection
          ? "Existing budget updated successfully."
          : "Monthly budget saved successfully."
    );
  }

  function startEditing(budget) {
    setSelectedMonth(budget.month);
    setCategory(budget.category);
    setAmount(String(budget.amount));
    setEditingBudget(budget);
    setError("");
    setNotice("");
  }

  function cancelEditing() {
    setEditingBudget(null);
    setAmount("");
    setError("");
    setNotice("");
  }

  function handleDelete(budget) {
    const confirmed = window.confirm(
      `Delete the ${budget.category} budget for ${getMonthLabel(
        budget.month
      )}?`
    );

    if (!confirmed) return;

    deleteBudget(budget.id);

    if (
      editingBudget &&
      String(editingBudget.id) === String(budget.id)
    ) {
      cancelEditing();
    }

    setNotice(`${budget.category} budget deleted.`);
    setError("");
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="dashboard budgets-page">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="dashboard__main">
        <Navbar
          title="Budgets"
          subtitle="Plan your monthly spending and stay in control."
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="dashboard__content">
          <section className="dashboard__welcome budgets-page__welcome">
            <div>
              <span className="dashboard__eyebrow">
                PLAN YOUR SPENDING
              </span>

              <h2>Give every naira a purpose.</h2>

              <p>
                Set limits for your spending categories and track
                how much of each budget you use.
              </p>
            </div>

            <div className="budgets-page__month">
              <label htmlFor="budget-month">Budget month</label>
              <input
                id="budget-month"
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                required
              />
            </div>
          </section>

          {notice && (
            <div className="budgets-page__notice" role="status">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          <section
            className="budgets-page__stats"
            aria-label="Monthly budget summary"
          >
            <article className="budgets-stat">
              <div className="budgets-stat__icon budgets-stat__icon--planned">
                <PiggyBank size={21} />
              </div>
              <span>Total budgeted</span>
              <strong>{currencyFormatter.format(totalAllocated)}</strong>
              <p>{monthBudgets.length} category budgets</p>
            </article>

            <article className="budgets-stat">
              <div className="budgets-stat__icon budgets-stat__icon--spent">
                <Wallet size={21} />
              </div>
              <span>Spent in budgeted categories</span>
              <strong>
                {currencyFormatter.format(
                  totalSpentInBudgetedCategories
                )}
              </strong>
              <p>
                Total monthly expenses:{" "}
                {currencyFormatter.format(totalMonthlyExpenses)}
              </p>
            </article>

            <article className="budgets-stat">
              <div
                className={`budgets-stat__icon ${
                  remaining < 0
                    ? "budgets-stat__icon--over"
                    : "budgets-stat__icon--remaining"
                }`}
              >
                {remaining < 0 ? (
                  <AlertTriangle size={21} />
                ) : (
                  <CheckCircle2 size={21} />
                )}
              </div>
              <span>Remaining in budgeted categories</span>
              <strong
                className={
                  remaining < 0 ? "budgets-page__over-text" : ""
                }
              >
                {currencyFormatter.format(remaining)}
              </strong>
              <p>
                {overBudgetCount > 0
                  ? `${overBudgetCount} category budget${
                      overBudgetCount === 1 ? "" : "s"
                    } exceeded`
                  : "Compared with your category limits"}
              </p>
            </article>

            <article className="budgets-stat">
              <div className="budgets-stat__icon budgets-stat__icon--unbudgeted">
                <AlertTriangle size={21} />
              </div>
              <span>Unbudgeted spending</span>
              <strong>{currencyFormatter.format(unbudgetedSpending)}</strong>
              <p>Spending in categories without a limit</p>
            </article>
          </section>

          <div className="budgets-page__layout">
            <section className="budgets-form-panel">
              <div className="budgets-form-panel__heading">
                <span className="budgets-form-panel__icon">
                  {editingBudget ? (
                    <Pencil size={20} />
                  ) : (
                    <Plus size={21} />
                  )}
                </span>

                <div>
                  <h3>
                    {editingBudget ? "Edit Budget" : "Set a Monthly Budget"}
                  </h3>

                  <p>
                    {getMonthLabel(selectedMonth)}
                  </p>
                </div>
              </div>

              <form
                className="budgets-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="budgets-form__field">
                  <label htmlFor="budget-category">Category</label>

                  <select
                    id="budget-category"
                    value={category}
                    onChange={handleCategoryChange}
                    disabled={Boolean(editingBudget)}
                    required
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  {editingBudget && (
                    <span className="budgets-form__hint">
                      Cancel editing to choose another category.
                    </span>
                  )}
                </div>

                <div className="budgets-form__field">
                  <label htmlFor="budget-amount">
                    Monthly limit (₦)
                  </label>

                  <div className="budgets-form__amount">
                    <span aria-hidden="true">₦</span>
                    <input
                      id="budget-amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="e.g. 50000"
                      value={amount}
                      onChange={(event) =>
                        setAmount(event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="budgets-form__error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="budgets-form__submit"
                >
                  {editingBudget ? (
                    <Pencil size={17} />
                  ) : (
                    <Plus size={18} />
                  )}

                  {editingBudget
                    ? "Save Changes"
                    : existingBudgetForSelection
                      ? "Update Existing Budget"
                      : "Set Budget"}
                </button>

                {editingBudget && (
                  <button
                    type="button"
                    className="budgets-form__cancel"
                    onClick={cancelEditing}
                  >
                    Cancel editing
                  </button>
                )}
              </form>

              <div className="budgets-form-panel__tip">
                <PiggyBank size={18} />
                <p>
                  A category can have one budget per month. Setting
                  the same category again updates its existing limit.
                </p>
              </div>
            </section>

            <section className="budgets-list-panel">
              <div className="budgets-list-panel__header">
                <div>
                  <h3>Category Budgets</h3>
                  <p>
                    {getMonthLabel(selectedMonth)} ·{" "}
                    {budgetRows.length} budget
                    {budgetRows.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              {budgetRows.length === 0 ? (
                <div className="budgets-list__empty">
                  <div className="budgets-list__empty-icon">
                    <PiggyBank size={27} />
                  </div>

                  <h4>No budgets for this month</h4>

                  <p>
                    Set your first category limit using the form.
                    Your recorded expenses will then be tracked
                    against that limit.
                  </p>
                </div>
              ) : (
                <div className="budgets-list">
                  {budgetRows.map((budget) => {
                    const percentage =
                      budget.amount > 0
                        ? (budget.spent / budget.amount) * 100
                        : 0;

                    const isOver = budget.spent > budget.amount;
                    const isWarning = percentage >= 80;

                    return (
                      <article
                        className="budget-card"
                        key={budget.id}
                      >
                        <div className="budget-card__top">
                          <div className="budget-card__category">
                            <span className="budget-card__icon">
                              <PiggyBank size={19} />
                            </span>

                            <div>
                              <h4>{budget.category}</h4>
                              <span>
                                Limit:{" "}
                                {currencyFormatter.format(budget.amount)}
                              </span>
                            </div>
                          </div>

                          <div className="budget-card__actions">
                            <button
                              type="button"
                              aria-label={`Edit ${budget.category} budget`}
                              title="Edit budget"
                              onClick={() => startEditing(budget)}
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              aria-label={`Delete ${budget.category} budget`}
                              title="Delete budget"
                              onClick={() => handleDelete(budget)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="budget-card__amount-row">
                          <div>
                            <span>Spent</span>
                            <strong>
                              {currencyFormatter.format(budget.spent)}
                            </strong>
                          </div>

                          <div className="budget-card__right-amount">
                            <span>
                              {isOver ? "Over budget" : "Available"}
                            </span>
                            <strong
                              className={
                                isOver ? "budgets-page__over-text" : ""
                              }
                            >
                              {currencyFormatter.format(
                                Math.abs(budget.remaining)
                              )}
                            </strong>
                          </div>
                        </div>

                        <div
                          className="budget-card__track"
                          role="progressbar"
                          aria-label={`${budget.category} budget progress`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.min(
                            100,
                            Math.round(percentage)
                          )}
                        >
                          <div
                            className={`budget-card__fill ${
                              isOver
                                ? "budget-card__fill--over"
                                : isWarning
                                  ? "budget-card__fill--warning"
                                  : ""
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, percentage)
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="budget-card__footer">
                          <span>{percentage.toFixed(0)}% used</span>

                          <span>
                            {isOver
                              ? "Limit exceeded"
                              : percentage >= 80
                                ? "Approaching limit"
                                : "Within budget"}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <footer className="dashboard__footer">
            <span>FINBRO</span>
            <span>Plan your spending. Stay in control.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Budgets;
