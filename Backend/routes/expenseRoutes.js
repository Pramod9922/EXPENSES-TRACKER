const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// ✅ ADD EXPENSE
router.post("/", authMiddleware, addExpense);

// ✅ GET ALL EXPENSES
router.get("/", authMiddleware, getExpenses);

// ✅ SINGLE EXPENSE
router.get("/:id", authMiddleware, getExpenseById);

// ✅ UPDATE EXPENSE
router.put("/:id", authMiddleware, updateExpense);

// ✅ DELETE EXPENSE
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
