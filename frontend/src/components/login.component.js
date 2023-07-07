import React, { useState } from 'react';
import axios from 'axios';
import '../StaticFiles/Login.css'; // Import the CSS file

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
        password
      };
      


      axios.post('https://expensesbackend.onrender.com/api/login', userCredentials)
        .then(response => {
         
            alert(response.data.message);
            window.location=`/myExpenses?username=${userCredentials.username}`;
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
      password: newPassword
    };

    axios.post('https://expensesbackend.onrender.com/api/users', newUser)
      .then(response => {
        console.log('User created successfully');
        alert('User created successfully')
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
    setIsFormComplete(
      newUsername && email && newPassword && confirmPassword
    );
  };

  return (
    <div className="container">
      <h2>{showSignUp ? 'Create New Account' : 'Login'}</h2>
      <div className="form">
        {showSignUp ? (
          <React.Fragment>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => handleInputChange(e, setNewUsername)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
            />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => handleInputChange(e, setNewPassword)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, setConfirmPassword)}
            />
            <button onClick={handleCreateAccount} disabled={!isFormComplete}>
              Create Account
            </button>
            <button onClick={toggleSignUp}>Go back to Login</button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => handleInputChange(e, setUsername)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handleInputChange(e, setPassword)}
            />
            <button onClick={handleLogin}>
              Login
            </button>
            <button onClick={toggleSignUp}>Sign Up</button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Login;
