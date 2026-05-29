import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import {
  getDashboardStats,
  getMonthlyStats,
  getCategoryBreakdown,
  getRecentTransactions,
  getDashboardBudgets,
} from "../services/dashboardService";

function StatCard({ title, value, subtext }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-2xl font-semibold">{value}</h3>
      <p className="mt-1 text-sm text-slate-500">{subtext}</p>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsRes, monthlyRes, categoryRes, recentRes, budgetRes] =
          await Promise.all([
            getDashboardStats(),
            getMonthlyStats(),
            getCategoryBreakdown(),
            getRecentTransactions(),
            getDashboardBudgets(),
          ]);

        setStats(statsRes);
        setMonthlyData(monthlyRes || []);
        setCategoryData(categoryRes || []);
        setRecentTransactions(recentRes || []);
        setBudgets(budgetRes || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-300">
        {error}
      </div>
    );
  }

  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;
  const balance = stats?.balance || 0;
  const totalTransactions = stats?.totalTransactions || 0;

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Financial Overview</h2>
          <p className="text-sm text-slate-400">
            Add income or expenses to update your balance.
          </p>
        </div>

        <button
          onClick={() => navigate("/transactions")}
          className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-600"
        >
          + Add Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={`₹ ${Number(balance).toLocaleString()}`}
          subtext="Current available amount"
        />

        <StatCard
          title="Total Income"
          value={`₹ ${Number(totalIncome).toLocaleString()}`}
          subtext={`${totalTransactions} transactions tracked`}
        />

        <StatCard
          title="Total Expense"
          value={`₹ ${Number(totalExpense).toLocaleString()}`}
          subtext="Money spent so far"
        />

        <StatCard
          title="Total Transactions"
          value={totalTransactions}
          subtext="All income and expenses"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={monthlyData} />
        </div>

        <CategoryPieChart data={categoryData} />
      </div>

      {/* Recent Transactions + Budget Progress */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <p className="text-sm text-slate-400">
                Latest activity from your account
              </p>
            </div>

            <button
              onClick={() => navigate("/transactions")}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              View All
            </button>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-[650px] w-full text-left">
              <thead className="bg-white/5 text-sm text-slate-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td className="px-4 py-5 text-slate-400" colSpan="4">
                      No transactions found. Add your first income or expense.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((transaction) => (
                    <tr key={transaction._id} className="text-sm">
                      <td className="px-4 py-3">{transaction.title}</td>

                      <td className="px-4 py-3 text-slate-400">
                        {transaction.category}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-rose-500/15 text-rose-400"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right font-medium">
                        {transaction.type === "income" ? "+" : "-"}₹
                        {Number(transaction.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Budget Progress</h3>
          <p className="mt-1 text-sm text-slate-400">Monthly usage overview</p>

          <div className="mt-5 space-y-4">
            {budgets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-5 text-center">
                <p className="text-sm text-slate-400">No budgets added yet.</p>
                <p className="mt-1 text-xs text-slate-500">
                  Add budgets from the Budgets page.
                </p>

                <button
                  onClick={() => navigate("/budgets")}
                  className="mt-4 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium transition hover:bg-indigo-600"
                >
                  + Add Budget
                </button>
              </div>
            ) : (
              budgets.slice(0, 3).map((budget) => (
                <div key={budget._id}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="capitalize">{budget.category}</span>

                    <span className="text-slate-300">
                      ₹{Number(budget.spent || 0).toLocaleString()} / ₹
                      {Number(budget.amount || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full ${
                        budget.progress >= 90
                          ? "bg-rose-500"
                          : budget.progress >= 70
                          ? "bg-amber-500"
                          : "bg-indigo-500"
                      }`}
                      style={{
                        width: `${Math.min(budget.progress || 0, 100)}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-right text-xs text-slate-500">
                    {Math.round(budget.progress || 0)}% used
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;