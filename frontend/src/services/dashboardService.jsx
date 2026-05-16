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