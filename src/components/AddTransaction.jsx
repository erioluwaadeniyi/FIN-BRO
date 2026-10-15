
import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Plus, Save, X } from "lucide-react";

import "../styles/AddTransaction.css";

const EXPENSE_CATEGORIES = [
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

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createEmptyForm() {
  return {
    type: "expense",
    description: "",
    amount: "",
    category: "Food",
    date: getLocalDate(),
  };
}

function AddTransaction({
  initialTransaction = null,
  onSubmitTransaction = () => {},
  onCancel = () => {},
}) {
  const [formData, setFormData] = useState(createEmptyForm);
  const [error, setError] = useState("");

  const isEditing = Boolean(initialTransaction);
  const categories =
    formData.type === "income"
      ? INCOME_CATEGORIES
      : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (initialTransaction) {
      const type =
        String(initialTransaction.type).toLowerCase() === "income"
          ? "income"
          : "expense";

      const availableCategories =
        type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

      const savedCategory = initialTransaction.category || "Other";

      setFormData({
        type,
        description: initialTransaction.description || "",
        amount: String(initialTransaction.amount ?? ""),
        category: availableCategories.includes(savedCategory)
          ? savedCategory
          : "Other",
        date: initialTransaction.date || getLocalDate(),
      });
    } else {
      setFormData(createEmptyForm());
    }

    setError("");
  }, [initialTransaction]);

  function handleTypeChange(type) {
    const nextCategories =
      type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    setFormData((current) => ({
      ...current,
      type,
      category: nextCategories.includes(current.category)
        ? current.category
        : nextCategories[0],
    }));

    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const description = formData.description.trim();
    const amount = Number(formData.amount);

    if (!description) {
      setError("Enter a description for this transaction.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (!formData.category || !formData.date) {
      setError("Choose a category and transaction date.");
      return;
    }

    onSubmitTransaction({
      type: formData.type,
      description,
      amount,
      category: formData.category,
      date: formData.date,
    });

    if (!isEditing) {
      setFormData(createEmptyForm());
    }

    setError("");
  }

  return (
    <section
      className="add-transaction-panel"
      aria-labelledby="add-transaction-title"
    >
      <div className="add-transaction__header">
        <div>
          <span className="add-transaction__eyebrow">
            TRANSACTION MANAGEMENT
          </span>

          <h3 id="add-transaction-title">
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </h3>

          <p>
            {isEditing
              ? "Update your transaction details."
              : "Record money coming in or going out."}
          </p>
        </div>
      </div>

      <form
        className="add-transaction__form"
        onSubmit={handleSubmit}
        noValidate
      >
        <fieldset className="add-transaction__type-selector">
          <legend>Transaction type</legend>

          <div className="add-transaction__type-options">
            <button
              type="button"
              className={`add-transaction__type-button ${
                formData.type === "expense"
                  ? "add-transaction__type-button--active-expense"
                  : ""
              }`}
              onClick={() => handleTypeChange("expense")}
              aria-pressed={formData.type === "expense"}
            >
              <ArrowUpRight size={18} />
              Expense
            </button>

            <button
              type="button"
              className={`add-transaction__type-button ${
                formData.type === "income"
                  ? "add-transaction__type-button--active-income"
                  : ""
              }`}
              onClick={() => handleTypeChange("income")}
              aria-pressed={formData.type === "income"}
            >
              <ArrowDownLeft size={18} />
              Income
            </button>
          </div>
        </fieldset>

        <div className="add-transaction__field">
          <label htmlFor="transaction-description">
            Description
          </label>

          <input
            id="transaction-description"
            name="description"
            type="text"
            placeholder="e.g. Monthly salary or groceries"
            value={formData.description}
            onChange={handleChange}
            maxLength={120}
            required
          />
        </div>

        <div className="add-transaction__field">
          <label htmlFor="transaction-amount">
            Amount (₦)
          </label>

          <div className="add-transaction__amount-input">
            <span aria-hidden="true">₦</span>

            <input
              id="transaction-amount"
              name="amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="add-transaction__field">
          <label htmlFor="transaction-category">
            Category
          </label>

          <select
            id="transaction-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="add-transaction__field">
          <label htmlFor="transaction-date">
            Transaction date
          </label>

          <input
            id="transaction-date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p className="add-transaction__error" role="alert">
            {error}
          </p>
        )}

        <div className="add-transaction__actions">
          <button
            className="add-transaction__submit"
            type="submit"
          >
            {isEditing ? <Save size={17} /> : <Plus size={18} />}

            {isEditing ? "Save Changes" : "Add Transaction"}
          </button>

          {isEditing && (
            <button
              className="add-transaction__cancel"
              type="button"
              onClick={onCancel}
            >
              <X size={17} />
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AddTransaction;
