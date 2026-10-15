
import {
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import "../styles/SummaryCards.css";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const cards = [
  {
    title: "Total Balance",
    description: "Your available balance",
    type: "balance",
    icon: Wallet,
  },
  {
    title: "Total Income",
    description: "Money received",
    type: "income",
    icon: TrendingUp,
  },
  {
    title: "Total Expenses",
    description: "Money spent",
    type: "expense",
    icon: TrendingDown,
  },
];

function SummaryCards({
  balance = 0,
  income = 0,
  expenses = 0,
}) {
  const amounts = {
    balance,
    income,
    expense: expenses,
  };

  return (
    <section
      className="dashboard__summary-grid"
      aria-label="Financial summary"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const value = Number(amounts[card.type]);
        const amount = Number.isFinite(value) ? value : 0;

        return (
          <article
            className={`summary-card summary-card--${card.type}`}
            key={card.type}
          >
            <div className="summary-card__top">
              <span className="summary-card__title">
                {card.title}
              </span>

              <div className="summary-card__icon">
                <Icon size={21} strokeWidth={1.9} />
              </div>
            </div>

            <h3 className="summary-card__amount">
              {currencyFormatter.format(amount)}
            </h3>

            <p className="summary-card__description">
              {card.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}

export default SummaryCards;
