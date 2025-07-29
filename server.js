const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/ask", async (req, res) => {
  try {
    const { messages } = req.body;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages
    });
    res.json(chatCompletion);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
