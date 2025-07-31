const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files if needed

// Serve the form page
app.get('/', (req, res) => {
  res.render('index'); // Renders views/index.ejs
});

// Optional JSON hello route
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
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Convert the user prompt into a structured Markdown outline suitable for a mind map.',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const markdown = completion.data.choices[0].message.content;
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

