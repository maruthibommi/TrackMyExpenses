import React, { useState } from 'react';
import axios from 'axios';
import 'animate.css'
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }

    const userCredentials = {
      username,
      password,
    };

    axios
      .post('https://expensesbackend.onrender.com/api/login', userCredentials)
      .then(response => {
        alert(response.data.message);
        // Save the login response in cache before redirecting
        localStorage.setItem('loginResponse', JSON.stringify(response.data));
        // Redirect to the MyExpenses page
        window.location = `/myExpenses?username=${userCredentials.username}`;
      })
      .catch(error => {
        alert(error.response.data.error);
      });
  };

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  const handleCreateAccount = () => {
    if (!newUsername || !email || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const newUser = {
      username: newUsername,
      email,
      password: newPassword,
    };

    axios
      .post('https://expensesbackend.onrender.com/api/users', newUser)
      .then(response => {
        console.log('User created successfully');
        alert('User created successfully');
        // Optionally, you can handle success behavior here (e.g., show a success message, redirect, etc.)
      })
      .catch(error => {
        if (error.response.data.error.includes('Username')) {
          alert('Username already exists');
        } else if (error.response.data.error.includes('Email')) {
          alert('Email already in use');
        } else {
          console.error('Error creating user:', error);
        }
        // Optionally, you can handle error behavior here (e.g., show an error message, etc.)
      });
  };

  const handleInputChange = (event, setState) => {
    setState(event.target.value);
    handleFormCompletion();
  };

  const handleFormCompletion = () => {
    setIsFormComplete(newUsername && email && newPassword && confirmPassword);
  };

  return (
    <div className="container">
      <div className="bg-white shadow-lg rounded px-8 py-10">
        <h2 className="text-2xl mb-6">{showSignUp ? 'Create New Account' : 'Login'}</h2>
        <div className="form">
          {showSignUp ? (
            <React.Fragment>
              <input
                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={e => handleInputChange(e, setNewUsername)}
              />
              <input
                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => handleInputChange(e, setEmail)}
              />
              <input
                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={e => handleInputChange(e, setNewPassword)}
              />
              <input
                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => handleInputChange(e, setConfirmPassword)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={handleCreateAccount}
                disabled={!isFormComplete}
              >
                Create Account
              </button>
              <button
                className="text-blue-500 hover:text-blue-600 font-semibold"
                onClick={toggleSignUp}
              >
                Go back to Login
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <input
                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => handleInputChange(e, setUsername)}
              />
              <input
                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => handleInputChange(e, setPassword)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="text-blue-500 hover:text-blue-600 font-semibold"
                onClick={toggleSignUp}
              >
                Sign Up
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
