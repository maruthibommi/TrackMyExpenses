import React  from 'react';
import { Link } from 'react-router-dom';

const Navbar = ()=>{

 
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">MyExpenses</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/myExpenses/" className="nav-link">Home</Link>
          </li>
          <li className="navbar-item">
          <Link to="/myExpenses/AddExpenses" className="nav-link">AddExpenses</Link>
          </li>
          <li className="navbar-item">
          <Link to="/myExpenses/AddIncome" className="nav-link">AddIncome</Link>
          </li>
          <li className="navbar-item">
          <Link to="/myExpenses/AddPayments" className="nav-link">AddPayments</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  
}

export default Navbar;