
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const TransactionsContext = createContext(null);

const TRANSACTIONS_KEY = "finbro_transactions";
const BUDGETS_KEY = "finbro_budgets";

function loadStoredArray(key) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`FINBRO could not load ${key}:`, error);
    return [];
  }
}

function createId(prefix) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function sameBudget(budget, category, month) {
  return (
    String(budget.category || "").trim().toLowerCase() ===
      String(category || "").trim().toLowerCase() &&
    String(budget.month || "") === String(month || "")
  );
}

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(() =>
    loadStoredArray(TRANSACTIONS_KEY)
  );

  const [budgets, setBudgets] = useState(() =>
    loadStoredArray(BUDGETS_KEY)
  );

  // Persist transactions independently from budgets.
  useEffect(() => {
    try {
      localStorage.setItem(
        TRANSACTIONS_KEY,
        JSON.stringify(transactions)
      );
    } catch (error) {
      console.error("FINBRO could not save transactions:", error);
    }
  }, [transactions]);

  // Persist budgets independently from transactions.
  useEffect(() => {
    try {
      localStorage.setItem(
        BUDGETS_KEY,
        JSON.stringify(budgets)
      );
    } catch (error) {
      console.error("FINBRO could not save budgets:", error);
    }
  }, [budgets]);

  function addTransaction(data) {
    const newTransaction = {
      ...data,
      id: createId("transaction"),
      createdAt: new Date().toISOString(),
    };

    setTransactions((current) => [
      newTransaction,
      ...current,
    ]);

    return newTransaction;
  }

  function updateTransaction(id, updates) {
    setTransactions((current) =>
      current.map((transaction) =>
        String(transaction.id) === String(id)
          ? {
              ...transaction,
              ...updates,
              id: transaction.id,
            }
          : transaction
      )
    );
  }

  function deleteTransaction(id) {
    setTransactions((current) =>
      current.filter(
        (transaction) =>
          String(transaction.id) !== String(id)
      )
    );
  }

  // One budget per category per month.
  // Saving an existing category/month pair updates its amount.
  function saveBudget(data) {
    const category = String(data.category || "").trim();
    const month = String(data.month || "");
    const amount = Number(data.amount);

    const budgetData = {
      category,
      month,
      amount,
      updatedAt: new Date().toISOString(),
    };

    setBudgets((current) => {
      const existing = current.find((budget) =>
        sameBudget(budget, category, month)
      );

      if (existing) {
        return current.map((budget) =>
          String(budget.id) === String(existing.id)
            ? { ...budget, ...budgetData }
            : budget
        );
      }

      return [
        {
          ...budgetData,
          id: createId("budget"),
          createdAt: new Date().toISOString(),
        },
        ...current,
      ];
    });
  }

  function deleteBudget(id) {
    setBudgets((current) =>
      current.filter(
        (budget) => String(budget.id) !== String(id)
      )
    );
  }

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    budgets,
    saveBudget,
    deleteBudget,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      "useTransactions must be used inside TransactionsProvider."
    );
  }

  return context;
}
