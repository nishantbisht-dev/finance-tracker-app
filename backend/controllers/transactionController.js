const Transaction = require("../models/Transaction");

// Create transaction
// const createTransaction = async (req, res) => {
//   try {
//     const { title, amount, type, category, note, date } = req.body;

//     if (!title || !amount || !type || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, amount, type and category are required",
//       });
//     }

//     const transaction = await Transaction.create({
//       user: req.user._id,
//       title,
//       amount,
//       type,
//       category,
//       note,
//       date,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Transaction created successfully",
//       transaction,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, note, date } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, amount, type and category are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be income or expense",
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      note,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// Get all transactions for logged-in user
// const getTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.find({ user: req.user._id }).sort({
//       date: -1,
//     });

//     res.status(200).json({
//       success: true,
//       count: transactions.length,
//       transactions,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const getTransactions = async (req, res) => {
  try {
    const { type, category, search, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = {
      user: req.user._id,
    };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DASHBOARD DATA
const getDashboardData = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance,
        totalTransactions: transactions.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMonthlyStats = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    const monthlyData = {};

    transactions.forEach((transaction) => {
      const month = transaction.date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expense += transaction.amount;
      }
    });

    const result = Object.keys(monthlyData).map((month) => ({
      month,
      income: monthlyData[month].income,
      expense: monthlyData[month].expense,
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategoryBreakdown = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    const categoryData = {};

    transactions.forEach((transaction) => {
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = 0;
      }

      categoryData[transaction.category] += transaction.amount;
    });

    const result = Object.keys(categoryData).map((category) => ({
      category,
      amount: categoryData[category],
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get single transaction

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getDashboardData,
  getMonthlyStats,
  getCategoryBreakdown,
};