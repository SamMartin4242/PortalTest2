const express = require('express');
const router = express.Router();
const path = require('path');
const { addUser, getUser, loginUser } = require('./cosmos');

// Home page route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register page route
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Login page route
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
      const newUser = await addUser(email, password);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      if (error.message === 'A user with this email already exists') {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error registering user', error: error.message });
      }
    }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  });
  
  router.get('/dashboard.html', (req, res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
  });

module.exports = router;
