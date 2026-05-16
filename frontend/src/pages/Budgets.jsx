import { useEffect, useState } from "react";
import BudgetModal from "../components/BudgetModal";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../services/budgetService";
import toast from "react-hot-toast";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      let params = `?month=${month}&year=${year}`;
      const res = await getBudgets(params);
      setBudgets(res.budgets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

const handleAdd = async (data) => {
  try {
    await createBudget(data);
    toast.success("Budget added");
    setModalOpen(false);
    fetchBudgets();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to add budget");
  }
};

const handleEdit = async (data) => {
  try {
    await updateBudget(editingBudget._id, data);
    toast.success("Budget updated");
    setEditingBudget(null);
    setModalOpen(false);
    fetchBudgets();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update budget");
  }
};

const handleDelete = async (id) => {
  const confirm = window.confirm("Delete this budget?");
  if (!confirm) return;

  try {
    await deleteBudget(id);
    toast.success("Budget deleted");
    fetchBudgets();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete budget");
  }
};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500"
            placeholder="Month"
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500"
            placeholder="Year"
          />
          <button
            onClick={fetchBudgets}
            className="rounded-xl bg-indigo-500 px-4 py-3 font-medium hover:bg-indigo-600"
          >
            Load Budgets
          </button>
        </div>

        <button
          onClick={() => {
            setEditingBudget(null);
            setModalOpen(true);
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium hover:bg-white/10"
        >
          + Add Budget
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
          Loading budgets...
        </div>
      ) : budgets.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
          No budgets found for this month.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {budgets.map((budget) => (
            <div
              key={budget._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{budget.category}</h3>
                  <p className="text-sm text-slate-400">
                    {budget.month}/{budget.year}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingBudget(budget);
                      setModalOpen(true);
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Spent</span>
                  <span>₹{Number(budget.spent || 0).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-300">
                  <span>Budget</span>
                  <span>₹{Number(budget.amount).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-300">
                  <span>Remaining</span>
                  <span>₹{Number(budget.remaining || 0).toLocaleString()}</span>
                </div>

                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{ width: `${Math.min(budget.progress || 0, 100)}%` }}
                  />
                </div>

                <p className="text-right text-xs text-slate-400">
                  {Math.round(budget.progress || 0)}% used
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <BudgetModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={editingBudget ? handleEdit : handleAdd}
        initialData={editingBudget}
      />
    </div>
  );
}

export default Budgets;