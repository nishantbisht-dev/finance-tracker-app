import { useEffect, useState } from "react";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import {
  getDashboardStats,
  getMonthlyStats,
  getCategoryBreakdown,
  getRecentTransactions,
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
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statsRes, monthlyRes, categoryRes, recentRes] = await Promise.all([
          getDashboardStats(),
          getMonthlyStats(),
          getCategoryBreakdown(),
          getRecentTransactions(),
        ]);

        setStats(statsRes);
        setMonthlyData(monthlyRes || []);
        setCategoryData(categoryRes || []);
        setRecentTransactions(recentRes || []);
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={`₹ ${balance.toLocaleString()}`}
          subtext="Current available amount"
        />
        <StatCard
          title="Total Income"
          value={`₹ ${totalIncome.toLocaleString()}`}
          subtext={`${totalTransactions} transactions tracked`}
        />
        <StatCard
          title="Total Expense"
          value={`₹ ${totalExpense.toLocaleString()}`}
          subtext="Money spent so far"
        />
        <StatCard
          title="Total Transactions"
          value={totalTransactions}
          subtext="All income and expenses"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={monthlyData} />
        </div>

        <CategoryPieChart data={categoryData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <p className="text-sm text-slate-400">Latest activity from your account</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left">
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
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((t) => (
                    <tr key={t._id} className="text-sm">
                      <td className="px-4 py-3">{t.title}</td>
                      <td className="px-4 py-3 text-slate-400">{t.category}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            t.type === "income"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-rose-500/15 text-rose-400"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Budget Progress</h3>
          <p className="mt-1 text-sm text-slate-400">Monthly usage overview</p>

          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Food</span>
                <span>₹5,000 / ₹10,000</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-1/2 rounded-full bg-indigo-500"></div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Travel</span>
                <span>₹3,000 / ₹8,000</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[37%] rounded-full bg-emerald-500"></div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Bills</span>
                <span>₹7,000 / ₹12,000</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[58%] rounded-full bg-amber-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;