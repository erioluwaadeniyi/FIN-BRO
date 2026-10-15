
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { ChartNoAxesCombined } from "lucide-react";

import "../styles/SpendingChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
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

function SpendingChart({ transactions = [] }) {
  const now = new Date();

  // Build the current month and previous five months.
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - 5 + index,
      1
    );

    return {
      key: `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`,
      label: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      income: 0,
      expenses: 0,
    };
  });

  const monthLookup = new Map(
    months.map((month) => [month.key, month])
  );

  transactions.forEach((transaction) => {
    const date = parseTransactionDate(transaction.date);
    const amount = Number(transaction.amount);
    const type = String(transaction.type || "").toLowerCase();

    if (
      !date ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return;
    }

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    const month = monthLookup.get(key);

    if (!month) return;

    if (type === "income") {
      month.income += amount;
    } else if (type === "expense") {
      month.expenses += amount;
    }
  });

  const hasTransactions = months.some(
    (month) => month.income > 0 || month.expenses > 0
  );

  const chartData = {
    labels: months.map((month) => month.label),
    datasets: [
      {
        label: "Income",
        data: months.map((month) => month.income),
        borderColor: "#087f6e",
        backgroundColor: "rgba(8, 127, 110, 0.10)",
        pointBackgroundColor: "#087f6e",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      },
      {
        label: "Expenses",
        data: months.map((month) => month.expenses),
        borderColor: "#e28a65",
        backgroundColor: "rgba(226, 138, 101, 0.08)",
        pointBackgroundColor: "#e28a65",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          color: "#718096",
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "#172536",
        padding: 12,
        callbacks: {
          label(context) {
            return `${context.dataset.label}: ${currencyFormatter.format(
              context.parsed.y
            )}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#8995a3",
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
          dash: [4, 4],
        },
        grid: {
          color: "#edf1f4",
        },
        ticks: {
          color: "#8995a3",
          maxTicksLimit: 6,
          font: {
            size: 10,
          },
          callback(value) {
            return `₦${new Intl.NumberFormat("en-NG", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(value)}`;
          },
        },
      },
    },
  };

  return (
    <article className="dashboard-panel spending-chart">
      <div className="dashboard-panel__header">
        <div>
          <h3>
            <ChartNoAxesCombined
              size={19}
              aria-hidden="true"
            />
            Income vs Expenses
          </h3>

          <p>Track your money movement over six months.</p>
        </div>

        <span className="dashboard-panel__period">
          Last 6 months
        </span>
      </div>

      {hasTransactions ? (
        <div className="spending-chart__canvas">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="spending-chart__empty">
          <div className="spending-chart__empty-icon">
            <ChartNoAxesCombined size={27} />
          </div>

          <h4>Your spending story starts here</h4>

          <p>
            Record your income and expenses to see your financial
            activity visualized here.
          </p>
        </div>
      )}
    </article>
  );
}

export default SpendingChart;
