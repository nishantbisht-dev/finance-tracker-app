const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// Create budget
const createBudget = async (req, res) => {
  try {
    const { category, amount, month, year, note } = req.body;

    if (!category || !amount || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Category, amount, month and year are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget amount must be greater than 0",
      });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount,
      month,
      year,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all budgets with spent calculation
const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;

    const query = { user: req.user._id };
    if (month) query.month = Number(month);
    if (year) query.year = Number(year);

    const budgets = await Budget.find(query).sort({ createdAt: -1 });

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(budget.year, budget.month - 1, 1);
        const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59, 999);

        const transactions = await Transaction.find({
          user: req.user._id,
          type: "expense",
          category: { $regex: `^${budget.category}$`, $options: "i" },
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        });

        const spent = transactions.reduce((acc, t) => acc + t.amount, 0);

        return {
          ...budget.toObject(),
          spent,
          remaining: budget.amount - spent,
          progress: budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: budgetsWithSpent.length,
      budgets: budgetsWithSpent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get budget by id
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      user: req.user._id,
      type: "expense",
      category: { $regex: `^${budget.category}$`, $options: "i" },
      date: { $gte: startDate, $lte: endDate },
    });

    const spent = transactions.reduce((acc, t) => acc + t.amount, 0);

    res.status(200).json({
      success: true,
      budget: {
        ...budget.toObject(),
        spent,
        remaining: budget.amount - spent,
        progress: budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update budget
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget: updatedBudget,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};