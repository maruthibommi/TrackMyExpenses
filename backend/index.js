const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb+srv://admin:Pb3CApKnFULoTSQV@expenses.c4zwjbg.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

app.post('/api/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await client.connect();

    const db = client.db('myexpenses');
    const usersData = db.collection('usersdata');
    const expensesData = db.collection(username);

    const existingUser = await usersData.findOne({ username });
    const existingEmail = await usersData.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    if (existingEmail) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    await usersData.insertOne({ username, email, password });
    await expensesData.insertOne({ expenses: [] });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/forgotpassword', async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();

    const db = client.db('myexpenses');
    const usersData = db.collection('usersdata');

    const user = await usersData.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    await usersData.updateOne({ username }, { $set: { password } });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();

    const db = client.db('myexpenses');
    const usersData = db.collection('usersdata');

    const user = await usersData.findOne({
      $or: [{ username: username }, { email: username }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    res.status(200).json({ message: 'Password matched' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

app.post('/api/:username/expenses', async (req, res) => {
  const { username } = req.params;
  const { expenses } = req.body;

  try {
    await client.connect();

    const db = client.db('myexpenses');
    const expensesData = db.collection(username);

    await expensesData.updateOne({}, { $set: { expenses } }, { upsert: true });

    res.status(201).json({ message: 'Expense data updated successfully' });
  } catch (error) {
    console.error('Error updating expenses:', error);
    res.status(500).json({ error: 'Failed to update expenses' });
  }
});

app.get('/api/:username/expenses', async (req, res) => {
  const { username } = req.params;

  try {
    await client.connect();

    const db = client.db('myexpenses');
    const expensesData = db.collection(username);

    const result = await expensesData.findOne({}, { projection: { _id: 0 } });

    if (!result) {
      return res.status(200).json([]);
    }

    res.status(200).json(result.expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
