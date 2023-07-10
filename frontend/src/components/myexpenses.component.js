import React, { useEffect, useState, useCallback } from 'react';

import '../StaticFiles/MyExpenses.css';

const MyExpenses = () => {

  const loginResponse = localStorage.getItem("loginResponse")

  
  const userName = JSON.parse(loginResponse).username
  console.log(JSON.parse(loginResponse).username)

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState('Select type');
  const [shortNote, setShortNote] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Enable or disable the button based on input field values
    const hasValidInput =
      name !== '' &&
      amount !== 0 &&
      type !== 'Select type' &&
      shortNote !== '' &&
      transactionDate !== '';
    setIsButtonDisabled(!hasValidInput);
  }, [name, amount, type, shortNote, transactionDate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      // Clear cache
      localStorage.removeItem('loginResponse');
      // Perform logout actions if necessary
      alert('Logged out successfully');
      window.location = '/';
    }
  };

  const handleSortChange = (column) => {
    setSortColumn(column);
    setSortOrder('asc');
  };

  const handlePostExpense = () => {
    const expenseData = {
      name,
      amount,
      type,
      shortNote,
      transactionDate,
    };
  
    const updatedExpenses = [...expenses, expenseData]; // Add the new expense to the existing expenses array
  
    fetch(`https://expensesbackend.onrender.com/api/${userName}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expenses: updatedExpenses }), // Send the updated expenses array
    })
      .then((response) => {
        if (response.ok) {
          alert('Expense created successfully');
          // Clear input fields
          setName('');
          setAmount(0);
          setType('Select type');
          setShortNote('');
          setTransactionDate('');
          // Update the expenses state with the updated array
          setExpenses(updatedExpenses);
        } else {
          throw new Error('Failed to create expense');
        }
      })
      .catch((error) => {
        console.error('Error creating expense:', error);
        alert('Failed to create expense');
      });
  };
  
  const fetchExpenses = useCallback(() => {
    fetch(`https://expensesbackend.onrender.com/api/${userName}/expenses`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch expenses');
        }
      })
      .then(data => {
        setExpenses(data); // Replace the expenses array with the fetched data
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
        alert('Failed to fetch expenses');
      });
  }, [userName]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDeleteExpense = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
  
    fetch(`https://expensesbackend.onrender.com/api/${userName}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expenses: updatedExpenses }), // Send the updated expenses array
    })
      .then((response) => {
        if (response.ok) {
          alert('Expense deleted successfully');
          // Update the expenses state with the updated array
          setExpenses(updatedExpenses);
        } else {
          throw new Error('Failed to delete expense');
        }
      })
      .catch((error) => {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      });
  };
  const handleDownloadExpenses = () => {
    const csvContent = [
      'Name,Amount,Type,Short Note,Transaction Date', // Header row
      ...expenses.map(
        expense =>
          `${expense.name},${expense.amount},${expense.type},${expense.shortNote},${expense.transactionDate}`
      ) // Expense data rows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortExpenses = (expenses, column, order) => {
    const compare = (a, b) => {
      const valueA = column === 'amount' ? parseFloat(a[column]) : a[column];
      const valueB = column === 'amount' ? parseFloat(b[column]) : b[column];
  
      if (order === 'asc') {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      } else {
        if (valueA > valueB) return -1;
        if (valueA < valueB) return 1;
        return 0;
      }
    };
  
    return expenses.sort(compare);
  };
  const sortedExpenses = sortExpenses(expenses, sortColumn, sortOrder);


  return (
    <div className='MainBody'>
      <header>
        <h1>Welcome {userName}</h1>
        <h1 className="header-title">Expenses</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="expense-form">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Type:</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="Select type">Select type</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
        </div>

        <div>
          <label>Short Note:</label>
          <input
            type="text"
            value={shortNote}
            onChange={e => setShortNote(e.target.value)}
          />
        </div>

        <div>
          <label>Transaction Date:</label>
          <input
            type="date"
            value={transactionDate}
            onChange={e => setTransactionDate(e.target.value)}
          />
        </div>

        <button onClick={handlePostExpense} disabled={isButtonDisabled}>
          Post Expense
        </button>
      </div>
      <div>
        <button className="download-button" onClick={handleDownloadExpenses}>
          Download Expenses
        </button>
      </div> 
      <div className="expense-table">
        <h2>Expense Table</h2>
        {/* Sort dropdown */}
        <div>
          <label>Sort by:</label>
          <select value={sortColumn}onChange={e => handleSortChange(e.target.value)}>
            <option value="">Select column</option>
            <option value="name">Name</option>
            <option value="amount">Amount</option>
            <option value="type">Type</option>
            <option value="shortNote">Short Note</option>
            <option value="transactionDate">Transaction Date</option>
          </select>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {sortedExpenses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Short Note</th>
                <th>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.name}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.type}</td>
                  <td>{expense.shortNote}</td>
                  <td>{expense.transactionDate}</td>
                  <td>
                  <button onClick={() => handleDeleteExpense(index)}>
                    Delete
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses found.</p>
        )}
      </div>
    </div>
  );
};

export default MyExpenses;
