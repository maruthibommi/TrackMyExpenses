import React  from 'react';
import '../StaticFiles/MyExpenses.css';

const MyExpenses = () => {
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      // Perform logout actions if necessary
      alert('Logged out successfully');
      window.location = '/';
    }
  };



  return (
    <div>
      <header>
        <h1 className="header-title">My Expenses</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
          
        
      </header>

    </div>
  );
};

export default MyExpenses;
