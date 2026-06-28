const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
    console.log("req user:", req.user);
    console.log("req body:", req.body);
    const { title, amount, category } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense Not Found",
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense Not Found",
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    expense.title = req.body.title || expense.title;

    expense.amount = req.body.amount || expense.amount;

    expense.category = req.body.category || expense.category;

    await expense.save();

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense Not Found",
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      message: "Expense Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
