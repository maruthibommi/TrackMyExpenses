import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login.component';
import MyExpenses from './components/myexpenses.component';
import './StaticFiles/App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/myExpenses" element={<MyExpenses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
