import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function IncomeExpenseChart({ data = [] }) {
  return (
    <div className="h-[360px] rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-semibold">Income vs Expense</h3>
      <p className="mt-1 text-sm text-slate-400">Monthly trend overview</p>

      <div className="mt-6 h-[280px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500">
            No chart data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default IncomeExpenseChart;