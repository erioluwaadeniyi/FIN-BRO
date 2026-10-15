
import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddTransaction from "../components/AddTransaction";
import { useTransactions } from "../context/TransactionsContext";

import "../styles/Transactions.css";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDate(value) {
  if (!value) return "—";

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));

  const date = match
    ? new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
      )
    : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Transactions() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [notice, setNotice] = useState("");

  const categories = useMemo(
    () =>
      [...new Set(
        transactions
          .map((transaction) => transaction.category)
          .filter(Boolean)
      )].sort((a, b) => a.localeCompare(b)),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = transactions.filter((transaction) => {
      const type = String(transaction.type || "").toLowerCase();
      const description = String(
        transaction.description || ""
      ).toLowerCase();
      const category = String(
        transaction.category || "Other"
      );

      if (typeFilter !== "all" && type !== typeFilter) {
        return false;
      }

      if (
        categoryFilter !== "all" &&
        category !== categoryFilter
      ) {
        return false;
      }

      if (dateFrom && transaction.date < dateFrom) {
        return false;
      }

      if (dateTo && transaction.date > dateTo) {
        return false;
      }

      if (
        query &&
        !description.includes(query) &&
        !category.toLowerCase().includes(query)
      ) {
        return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return String(a.date || "").localeCompare(
            String(b.date || "")
          );

        case "category":
          return String(a.category || "").localeCompare(
            String(b.category || "")
          );

        case "highest":
          return Number(b.amount || 0) - Number(a.amount || 0);

        case "lowest":
          return Number(a.amount || 0) - Number(b.amount || 0);

        case "newest":
        default:
          return String(b.date || "").localeCompare(
            String(a.date || "")
          );
      }
    });
  }, [
    transactions,
    search,
    typeFilter,
    categoryFilter,
    dateFrom,
    dateTo,
    sortBy,
  ]);

  function handleSaveTransaction(data) {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
      setNotice("Transaction updated successfully.");
    } else {
      addTransaction(data);
      setNotice("Transaction added successfully.");
    }
  }

  function handleDeleteTransaction(transaction) {
    const confirmed = window.confirm(
      `Delete "${transaction.description}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    deleteTransaction(transaction.id);

    if (
      editingTransaction &&
      String(editingTransaction.id) === String(transaction.id)
    ) {
      setEditingTransaction(null);
    }

    setNotice("Transaction deleted.");
  }

  function resetFilters() {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("newest");
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="dashboard transactions-page">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="dashboard__main">
        <Navbar
          title="Transactions"
          subtitle="Manage and review your income and expenses."
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="dashboard__content">
          <section className="dashboard__welcome transactions-page__welcome">
            <div>
              <span className="dashboard__eyebrow">
                YOUR MONEY ACTIVITY
              </span>

              <h2>Every transaction, in one place.</h2>

              <p>
                Record your money movement and keep your financial
                records organized.
              </p>
            </div>

            <div className="transactions-page__count">
              <span>Total records</span>
              <strong>{transactions.length}</strong>
            </div>
          </section>

          {notice && (
            <div
              className="transactions-page__notice"
              role="status"
            >
              <span>{notice}</span>

              <button
                type="button"
                aria-label="Dismiss message"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="transactions-page__layout">
            <AddTransaction
              initialTransaction={editingTransaction}
              onSubmitTransaction={handleSaveTransaction}
              onCancel={() => setEditingTransaction(null)}
            />

            <section className="transactions-list-panel">
              <div className="transactions-list-panel__header">
                <div>
                  <h3>Transaction History</h3>
                  <p>
                    Showing {filteredTransactions.length} of{" "}
                    {transactions.length} transactions.
                  </p>
                </div>
              </div>

              {/* Search and filters */}
              <div className="transactions-filters">
                <div className="transactions-filters__search">
                  <Search size={17} />

                  <input
                    type="search"
                    aria-label="Search transactions"
                    placeholder="Search description or category"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <div className="transactions-filters__row">
                  <div className="transactions-filters__field">
                    <label htmlFor="filter-type">Type</label>

                    <select
                      id="filter-type"
                      value={typeFilter}
                      onChange={(event) =>
                        setTypeFilter(event.target.value)
                      }
                    >
                      <option value="all">All types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expenses</option>
                    </select>
                  </div>

                  <div className="transactions-filters__field">
                    <label htmlFor="filter-category">
                      Category
                    </label>

                    <select
                      id="filter-category"
                      value={categoryFilter}
                      onChange={(event) =>
                        setCategoryFilter(event.target.value)
                      }
                    >
                      <option value="all">All categories</option>

                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="transactions-filters__dates">
                  <div className="transactions-filters__field">
                    <label htmlFor="filter-date-from">
                      From date
                    </label>

                    <input
                      id="filter-date-from"
                      type="date"
                      value={dateFrom}
                      max={dateTo || undefined}
                      onChange={(event) =>
                        setDateFrom(event.target.value)
                      }
                    />
                  </div>

                  <div className="transactions-filters__field">
                    <label htmlFor="filter-date-to">
                      To date
                    </label>

                    <input
                      id="filter-date-to"
                      type="date"
                      value={dateTo}
                      min={dateFrom || undefined}
                      onChange={(event) =>
                        setDateTo(event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="transactions-filters__bottom">
                  <div className="transactions-filters__field">
                    <label htmlFor="filter-sort">Sort by</label>

                    <select
                      id="filter-sort"
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(event.target.value)
                      }
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="category">Category A–Z</option>
                      <option value="highest">Highest amount</option>
                      <option value="lowest">Lowest amount</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="transactions-filters__reset"
                    onClick={resetFilters}
                  >
                    Reset filters
                  </button>
                </div>
              </div>

              {/* Transaction table */}
              <div className="transactions-table-wrap">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th scope="col">Transaction</th>
                      <th scope="col">Category</th>
                      <th scope="col">Date</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="transactions-table__empty">
                            <div className="transactions-table__empty-icon">
                              <CalendarDays size={24} />
                            </div>

                            <h4>
                              {transactions.length === 0
                                ? "No transactions yet"
                                : "No matching transactions"}
                            </h4>

                            <p>
                              {transactions.length === 0
                                ? "Add your first income or expense using the form."
                                : "Try changing your search or filters."}
                            </p>

                            {transactions.length > 0 && (
                              <button
                                type="button"
                                onClick={resetFilters}
                              >
                                Clear filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((transaction) => {
                        const isExpense =
                          String(transaction.type).toLowerCase() ===
                          "expense";

                        const numericAmount = Number(
                          transaction.amount
                        );

                        const amount = Number.isFinite(numericAmount)
                          ? Math.abs(numericAmount)
                          : 0;

                        return (
                          <tr key={transaction.id}>
                            <td>
                              <div className="transactions-table__name">
                                <span
                                  className={`transactions-table__type-icon ${
                                    isExpense
                                      ? "transactions-table__type-icon--expense"
                                      : "transactions-table__type-icon--income"
                                  }`}
                                >
                                  {isExpense ? (
                                    <ArrowUpRight size={16} />
                                  ) : (
                                    <ArrowDownLeft size={16} />
                                  )}
                                </span>

                                <div>
                                  <strong>
                                    {transaction.description ||
                                      "Transaction"}
                                  </strong>

                                  <span>
                                    {isExpense ? "Expense" : "Income"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className="transactions-table__category">
                                {transaction.category || "Other"}
                              </span>
                            </td>

                            <td className="transactions-table__date">
                              {formatDate(transaction.date)}
                            </td>

                            <td
                              className={`transactions-table__amount ${
                                isExpense
                                  ? "transactions-table__amount--expense"
                                  : "transactions-table__amount--income"
                              }`}
                            >
                              {isExpense ? "−" : "+"}
                              {currencyFormatter.format(amount)}
                            </td>

                            <td>
                              <div className="transactions-table__actions">
                                <button
                                  type="button"
                                  className="transactions-table__action transactions-table__action--edit"
                                  aria-label={`Edit ${transaction.description}`}
                                  title="Edit transaction"
                                  onClick={() => {
                                    setEditingTransaction(transaction);
                                    setNotice("");
                                  }}
                                >
                                  <Pencil size={15} />
                                </button>

                                <button
                                  type="button"
                                  className="transactions-table__action transactions-table__action--delete"
                                  aria-label={`Delete ${transaction.description}`}
                                  title="Delete transaction"
                                  onClick={() =>
                                    handleDeleteTransaction(transaction)
                                  }
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <footer className="dashboard__footer">
            <span>FINBRO</span>
            <span>Take control of your finances.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Transactions;
