const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use(cors({
    origin: 'http://localhost:3000' // Replace with the origin of your React application
  }));
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
      fs.writeFileSync('./userdata.json', JSON.stringify(userData));
      res.status(201).json({ message: 'User created successfully' });
    }
  })


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

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
