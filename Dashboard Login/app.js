const express = require("express");


const app = express();

// Import the routes module
const routes = require('./routes');

// Serve static files
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/json


// Use the routes
app.use('/', routes);

app.listen(3000, () => {
  console.log("Server Started on Port 3000");
});