const express = require('express')
require('dotenv').config();
const { CohereClient } = require("cohere-ai");

const app = express()
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }))
app.use(express.static('src'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/src/views/index.html')
})


const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt: message,
      maxTokens: 200,
    });

    const reply = response.generations[0].text.trim();
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error al contactar con la IA." });
  }
});


app.listen(port, function () { })