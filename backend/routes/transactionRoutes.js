const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getDashboardData,
  getMonthlyStats,
  getCategoryBreakdown,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getDashboardData);
router.get("/monthly-stats", protect, getMonthlyStats);
router.get("/category-breakdown", protect, getCategoryBreakdown);

router.post("/", protect, createTransaction);
router.get("/", protect, getTransactions);
router.get("/:id", protect, getTransactionById);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

module.exports = router;