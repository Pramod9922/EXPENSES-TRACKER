import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState, useEffect } from "react";
import "./Dashboard.css";
import ExpenseCard from "../components/ExpenseCard";

function Dashboard() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    navigate("/");
  };

  // ---------------- ADD / UPDATE EXPENSE ----------------
  const handleAddExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      if (editId) {
        // UPDATE
        await api.put(
          `/expenses/${editId}`,
          { title, amount, category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Expense Updated Successfully");
      } else {
        // ADD
        await api.post(
          "/expenses",
          { title, amount, category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Expense Added Successfully");
      }

      setTitle("");
      setAmount("");
      setCategory("");
      setEditId(null);

      fetchExpenses();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // ---------------- DELETE ----------------
  const handleDeleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Expense Deleted Successfully");
      fetchExpenses();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  // ---------------- EDIT ----------------
  const handleEditExpense = (expense) => {
    setEditId(expense._id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
  };

  // ---------------- FETCH EXPENSES ----------------
  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      const response = await api.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(response.data);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchExpenses();
  }, []);

  // ---------------- TOTAL ----------------
  const totalExpense = expenses.reduce((total, expense) => {
    return total + Number(expense.amount);
  }, 0);

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Expense Tracker</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dashboard-content">
        {/* SUMMARY */}
        <div className="summary-card">
          <h3>Total Expense</h3>
          <p>Total Entries: {expenses.length}</p>
          <h1>₹ {totalExpense}</h1>
        </div>

        {/* LIST + FORM */}
        <div className="expense-card">
          <div className="expense-list">
            <h2>Your Expenses</h2>

            {loading ? (
              <h3>Loading...</h3>
            ) : expenses.length === 0 ? (
              <h3>No Expenses Added Yet</h3>
            ) : (
              expenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onDelete={handleDeleteExpense}
                  onEdit={handleEditExpense}
                />
              ))
            )}
          </div>

          <h2>{editId ? "Update Expense" : "Add Expense"}</h2>

          <input
            type="text"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <button onClick={handleAddExpense}>
            {editId ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
