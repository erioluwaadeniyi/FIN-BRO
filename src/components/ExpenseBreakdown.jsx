
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { PieChart, ReceiptText } from "lucide-react";

import "../styles/ExpenseBreakdown.css";

ChartJS.register(ArcElement, Tooltip);

const CATEGORY_COLORS = [
  "#087f6e",
  "#6c7ce7",
  "#e28a65",
  "#d7ae40",
  "#9b78c9",
  "#4d9bc1",
  "#db7292",
  "#7c9290",
  "#a2aab5",
];

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function ExpenseBreakdown({ transactions = [] }) {
  const categoryTotals = new Map();

  transactions.forEach((transaction) => {
    const type = String(transaction.type || "").toLowerCase();
    const amount = Number(transaction.amount);

    if (
      type !== "expense" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return;
    }

    const category =
      String(transaction.category || "").trim() || "Other";

    categoryTotals.set(
      category,
      (categoryTotals.get(category) || 0) + amount
    );
  });

  const categories = Array.from(
    categoryTotals,
    ([name, amount]) => ({ name, amount })
  ).sort((a, b) => b.amount - a.amount);

  const totalExpenses = categories.reduce(
    (total, category) => total + category.amount,
    0
  );

  const hasExpenses = totalExpenses > 0;

  const chartData = {
    labels: categories.map((category) => category.name),
    datasets: [
      {
        data: categories.map((category) => category.amount),
        backgroundColor: categories.map(
          (_, index) =>
            CATEGORY_COLORS[index % CATEGORY_COLORS.length]
        ),
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#172536",
        padding: 12,
        callbacks: {
          label(context) {
            const value = Number(context.parsed) || 0;
            const percentage = totalExpenses
              ? ((value / totalExpenses) * 100).toFixed(1)
              : "0.0";

            return `${context.label}: ${currencyFormatter.format(
              value
            )} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <article className="dashboard-panel expense-breakdown">
      <div className="dashboard-panel__header">
        <div>
          <h3>
            <PieChart size={19} aria-hidden="true" />
            Expense Breakdown
          </h3>

          <p>See where your money goes.</p>
        </div>
      </div>

      {hasExpenses ? (
        <>
          <div className="expense-breakdown__chart">
            <Doughnut
              data={chartData}
              options={chartOptions}
              aria-label="Doughnut chart showing expenses by category"
              role="img"
            />

            <div className="expense-breakdown__center">
              <span>Total spent</span>
              <strong>
                {currencyFormatter.format(totalExpenses)}
              </strong>
            </div>
          </div>

          <div className="expense-breakdown__categories">
            {categories.map((category, index) => {
              const percentage =
                (category.amount / totalExpenses) * 100;

              return (
                <div
                  className="expense-breakdown__category"
                  key={category.name}
                >
                  <div className="expense-breakdown__category-info">
                    <span
                      className="expense-breakdown__dot"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[
                            index % CATEGORY_COLORS.length
                          ],
                      }}
                    />

                    <span className="expense-breakdown__name">
                      {category.name}
                    </span>
                  </div>

                  <div className="expense-breakdown__category-values">
                    <strong>
                      {currencyFormatter.format(category.amount)}
                    </strong>

                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="expense-breakdown__empty">
          <div className="expense-breakdown__empty-icon">
            <ReceiptText size={25} />
          </div>

          <h4>No expenses yet</h4>

          <p>
            Once you record expenses, your spending categories and
            their proportions will appear here.
          </p>
        </div>
      )}
    </article>
  );
}

export default ExpenseBreakdown;
