const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const OpenAI = require('openai');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the form page
app.get('/', (req, res) => {
  res.render('index');
});

// Optional hello route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from VillageMind!' });
});

// Handle form submission
app.post('/submit', (req, res) => {
  const userInput = req.body.input;
  console.log('Received:', userInput);
  res.render('thankyou', { userInput });
});

// Generate mind map outline
app.post('/generate', async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Convert the user prompt into a structured Markdown outline suitable for a mind map.' },
        { role: 'user', content: userPrompt }
      ]
    });

    const markdown = completion.choices[0].message.content;
    res.json({ markdown });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Failed to generate mind map.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

