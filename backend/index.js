// Import necessary modules
const express = require("express"); // Express framework for handling API requests
const mongoose = require("mongoose"); // Mongoose for MongoDB interactions
const cors = require("cors"); // Enables cross-origin requests
const dotenv = require("dotenv"); // Loads environment variables
const OpenAI = require("openai"); // OpenAI API for generating posts
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Allows API to handle JSON requests
app.use(cors()); // Enables requests from frontend

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// OpenAI API setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

// Post schema for MongoDB
const Post = mongoose.model("Post", new mongoose.Schema({
  text: String,
  likes: Number,
  category: String
}));

// // API to generate AI-powered posts
// app.post("/generate-post", async (req, res) => {
//   try {
//     const { category } = req.body;
    
//     // Call OpenAI API
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: `Generate an Instagram post about ${category}` }]
//     });

//     const generatedText = response.choices[0].message.content;

//     // Save to MongoDB
//     const newPost = await Post.create({ text: generatedText, likes: 0, category });

//     res.json(newPost);
//   } catch (error) {
//     console.error("Error generating post:", error);
//     res.status(500).json({ error: "Failed to generate post" });
//   }
// });

app.post("/generate-post", async (req, res) => {
  try {
    const { category } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content using Gemini API
    const result = await model.generateContent(`Write a short, engaging Instagram post about ${category}. It should sound natural, fit Instagram’s style, and include relevant hashtags.`);
    const generatedText = result.response.text(); // Extract generated text

    // Save to MongoDB
    const newPost = await Post.create({ text: generatedText, likes: 0, category });

    res.json(newPost);
  } catch (error) {
    console.error("Error generating post:", error);
    res.status(500).json({ error: "Failed to generate post" });
  }
});

// API to fetch posts
app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
