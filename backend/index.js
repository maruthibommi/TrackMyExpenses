const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const userDataFilePath = './userdata.json';

// Read the existing user data from the JSON file
let userData = [];
try {
  const data = fs.readFileSync(userDataFilePath);
  userData = JSON.parse(data);
} catch (error) {
  console.error('Error reading user data file:', error);
}

app.post('/api/users', (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = userData.find((user) => user.username === username);
  const existingEmail = userData.find((user) => user.email === email);

  if (existingUser) {
    res.status(409).json({ error: 'Username already exists' });
  } else if (existingEmail) {
    res.status(409).json({ error: 'Email already in use' });
  } else {
    userData.push({ username, email, password });
    const userExpensesFilePath = `./${username}.json`;
    fs.writeFileSync(userExpensesFilePath, JSON.stringify([])); // Add an empty array to the file
    fs.writeFileSync(userDataFilePath, JSON.stringify(userData));
    res.status(201).json({ message: 'User created successfully' });
  }
});

app.post('/api/forgotpassword', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = userData.find((user) => user.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User does not exist' });
  }

  // Update the user's password
  user.password = password;

  // Save the updated user data back to the JSON file
  fs.writeFileSync(userDataFilePath, JSON.stringify(userData));

  return res.status(200).json({ message: 'Password updated successfully' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username or email
  const user = userData.find(
    (user) => user.username === username || user.email === username
  );

  if (!user) {
    return res.status(404).json({ error: 'User does not exist' });
  }

  // Check if password matches
  if (user.password !== password) {
    return res.status(401).json({ error: 'Password does not match' });
  }

  return res.status(200).json({ message: 'Password matched' });
});

app.post('/api/:username/expenses', (req, res) => {
  const { username } = req.params;
  const { expenses } = req.body;

  try {
    const expensesFilePath = `./${username}.json`;
    let expensesData = [];

    if (fs.existsSync(expensesFilePath)) {
      // If the expenses file exists, read its content
      const data = fs.readFileSync(expensesFilePath);
      expensesData = JSON.parse(data);
    }

    // Update the expenses data with the new array
    expensesData = expenses;

    fs.writeFileSync(expensesFilePath, JSON.stringify(expensesData));

    res.status(201).json({ message: 'Expense data updated successfully' });
  } catch (error) {
    console.error('Error writing expenses data:', error);
    res.status(500).json({ error: 'Failed to update expense data' });
  }
});

app.get('/api/:username/expenses', (req, res) => {
  const { username } = req.params;

  try {
    const expensesFilePath = `./${username}.json`;

    if (!fs.existsSync(expensesFilePath)) {
      // If the expenses file does not exist, return an empty array
      return res.status(200).json([]);
    }

    const data = fs.readFileSync(expensesFilePath);
    const expenses = JSON.parse(data);

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error reading expenses data:', error);
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
