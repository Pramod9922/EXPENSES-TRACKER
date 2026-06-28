function ExpenseCard({ expense, onDelete, onEdit }) {
  return (
    <div className="expense-item">

      <div>
        <h3>{expense.title}</h3>

        <p>₹ {expense.amount}</p>

        <span>{expense.category}</span>
      </div>

      <div className="expense-actions">

        <button className="edit-btn" onClick={() => onEdit(expense)}>
          Edit
        </button>

        <button className="delete-btn" onClick={() => onDelete(expense._id)}>
          Delete
        </button>

      </div>

    </div>
  );
}

export default ExpenseCard;