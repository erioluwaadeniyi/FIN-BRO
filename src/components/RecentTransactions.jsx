
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";

import "../styles/RecentTransactions.css";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseTransactionDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const dateString = String(value);
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);

  const date = dateOnly
    ? new Date(
        Number(dateOnly[1]),
        Number(dateOnly[2]) - 1,
        Number(dateOnly[3])
      )
    : new Date(dateString);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTransactionDate(value) {
  const date = parseTransactionDate(value);

  if (!date) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RecentTransactions({ transactions = [] }) {
  const safeTransactions = Array.isArray(transactions)
    ? transactions.filter(
        (transaction) =>
          transaction && typeof transaction === "object"
      )
    : [];

  const recentTransactions = [...safeTransactions]
    .sort((a, b) => {
      const dateA = parseTransactionDate(a.date)?.getTime() ?? 0;
      const dateB = parseTransactionDate(b.date)?.getTime() ?? 0;

      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <section
      className="recent-transactions"
      aria-labelledby="recent-transactions-title"
    >
      <div className="recent-transactions__header">
        <div>
          <h3 id="recent-transactions-title">
            Recent Transactions
          </h3>

          <p>Your latest income and expenses.</p>
        </div>

        <Link
          className="recent-transactions__view-all"
          to="/transactions"
        >
          View all
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="recent-transactions__table-wrap">
        <table className="recent-transactions__table">
          <thead>
            <tr>
              <th scope="col">Transaction</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>

          <tbody>
            {recentTransactions.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="recent-transactions__empty">
                    <div className="recent-transactions__empty-icon">
                      <ReceiptText size={25} />
                    </div>

                    <h4>No transactions yet</h4>

                    <p>
                      Your recent income and expenses will appear
                      here once you add your first transaction.
                    </p>

                    <Link
                      className="recent-transactions__empty-link"
                      to="/transactions"
                    >
                      Go to transactions
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              recentTransactions.map((transaction, index) => {
                const isExpense =
                  String(transaction.type || "").toLowerCase() ===
                  "expense";

                const amount = Number(transaction.amount);
                const safeAmount = Number.isFinite(amount)
                  ? Math.abs(amount)
                  : 0;

                const Icon = isExpense
                  ? ArrowUpRight
                  : ArrowDownLeft;

                return (
                  <tr
                    key={
                      transaction.id ??
                      `${transaction.date}-${transaction.description}-${index}`
                    }
                  >
                    <td>
                      <div className="recent-transactions__name-cell">
                        <span
                          className={`recent-transactions__type-icon ${
                            isExpense
                              ? "recent-transactions__type-icon--expense"
                              : "recent-transactions__type-icon--income"
                          }`}
                        >
                          <Icon size={17} />
                        </span>

                        <div className="recent-transactions__name-details">
                          <span className="recent-transactions__name">
                            {transaction.description || "Transaction"}
                          </span>

                          <span className="recent-transactions__type">
                            {isExpense ? "Expense" : "Income"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="recent-transactions__category">
                        {transaction.category || "Other"}
                      </span>
                    </td>

                    <td className="recent-transactions__date">
                      {formatTransactionDate(transaction.date)}
                    </td>

                    <td
                      className={`recent-transactions__amount ${
                        isExpense
                          ? "recent-transactions__amount--expense"
                          : "recent-transactions__amount--income"
                      }`}
                    >
                      {isExpense ? "−" : "+"}
                      {currencyFormatter.format(safeAmount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentTransactions;
