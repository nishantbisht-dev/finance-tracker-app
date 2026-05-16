const Goal = require("../models/Goal");

// Create goal
const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline, note } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: "Title and targetAmount are required",
      });
    }

    if (targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Target amount must be greater than 0",
      });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      note,
      status: (currentAmount || 0) >= targetAmount ? "completed" : "active",
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });

    const goalsWithProgress = goals.map((goal) => ({
      ...goal.toObject(),
      progress:
        goal.targetAmount > 0
          ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
          : 0,
    }));

    res.status(200).json({
      success: true,
      count: goalsWithProgress.length,
      goals: goalsWithProgress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get goal by id
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.status(200).json({
      success: true,
      goal: {
        ...goal.toObject(),
        progress:
          goal.targetAmount > 0
            ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
            : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update goal
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
      updatedGoal.status = "completed";
      await updatedGoal.save();
    }

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      goal: updatedGoal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete goal
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};