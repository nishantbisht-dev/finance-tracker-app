import { useEffect, useState } from "react";
import GoalModal from "../components/GoalModal";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../services/goalService";
import toast from "react-hot-toast";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await getGoals();
      setGoals(res.goals || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

const handleAdd = async (data) => {
  try {
    await createGoal(data);
    toast.success("Goal added");
    setModalOpen(false);
    fetchGoals();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to add goal");
  }
};

const handleEdit = async (data) => {
  try {
    await updateGoal(editingGoal._id, data);
    toast.success("Goal updated");
    setEditingGoal(null);
    setModalOpen(false);
    fetchGoals();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update goal");
  }
};

const handleDelete = async (id) => {
  const confirm = window.confirm("Delete this goal?");
  if (!confirm) return;

  try {
    await deleteGoal(id);
    toast.success("Goal deleted");
    fetchGoals();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete goal");
  }
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5">
        <div>
          <h2 className="text-xl font-semibold">Savings Goals</h2>
          <p className="text-sm text-slate-400">Track your financial goals and progress</p>
        </div>

        <button
          onClick={() => {
            setEditingGoal(null);
            setModalOpen(true);
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium hover:bg-white/10"
        >
          + Add Goal
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
          Loading goals...
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
          No goals found. Add your first savings goal.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {goals.map((goal) => (
            <div
              key={goal._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{goal.title}</h3>
                  <p className="text-sm text-slate-400">
                    {goal.deadline
                      ? `Deadline: ${new Date(goal.deadline).toLocaleDateString()}`
                      : "No deadline set"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingGoal(goal);
                      setModalOpen(true);
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Saved</span>
                  <span>₹{Number(goal.currentAmount || 0).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-300">
                  <span>Target</span>
                  <span>₹{Number(goal.targetAmount).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-300">
                  <span>Status</span>
                  <span className={goal.status === "completed" ? "text-emerald-400" : "text-amber-400"}>
                    {goal.status}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{
                      width: `${Math.min(goal.progress || 0, 100)}%`,
                    }}
                  />
                </div>

                <p className="text-right text-xs text-slate-400">
                  {Math.round(goal.progress || 0)}% completed
                </p>

                {goal.note && <p className="pt-2 text-sm text-slate-400">{goal.note}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <GoalModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={editingGoal ? handleEdit : handleAdd}
        initialData={editingGoal}
      />
    </div>
  );
}

export default Goals;