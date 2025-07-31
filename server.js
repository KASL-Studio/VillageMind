const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // serve static files if needed

// ✅ Serve the form page
app.get('/', (req, res) => {
  res.render('index'); // Renders views/index.ejs
});

// Optional JSON hello route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from VillageMind!' });
});

// ✅ Handle form submission
app.post('/submit', (req, res) => {
  const userInput = req.body.input;
  console.log('Received:', userInput);
  res.render('thankyou', { userInput });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

