import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get("/transactions/dashboard");
  return res.data.data;
};

export const getMonthlyStats = async () => {
  const res = await api.get("/transactions/monthly-stats");
  return res.data.data;
};

export const getCategoryBreakdown = async () => {
  const res = await api.get("/transactions/category-breakdown");
  return res.data.data;
};

export const getRecentTransactions = async () => {
  const res = await api.get("/transactions?page=1&limit=5");
  return res.data.transactions;
};

export const getDashboardBudgets = async () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const res = await api.get(`/budgets?month=${month}&year=${year}`);
  return res.data.budgets;
};