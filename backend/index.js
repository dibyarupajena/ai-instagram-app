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
.then(async () => {
  console.log('MongoDB Connected');
  
  // 🗑 Delete all old posts when the server starts
  try {
    await Post.deleteMany({});
    console.log("🗑 All old posts deleted on server restart.");
  } catch (error) {
    console.error("Error deleting old posts:", error);
  }
})
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

// #*0001*# Add a request limit per user using their IP address
const userRequestCounts = new Map(); // Stores IP-based request counts

// Reset request limits every 24 hours
setInterval(() => {
  userRequestCounts.clear();
  console.log("🔄 Request limits reset for all users.");
}, 24 * 60 * 60 * 1000);
// #*0001*#

app.post("/generate-post", async (req, res) => {
  try {
    const { category } = req.body;

   // #*0001*# Enforce request limit
    const userIp = req.ip; // Get the user's IP address

    if (!userRequestCounts.has(userIp)) {
      userRequestCounts.set(userIp, 0);
    }

    if (userRequestCounts.get(userIp) >= 10) {
      return res.status(429).json({ error: "Request limit reached (10 per day)" });
    }

    userRequestCounts.set(userIp, userRequestCounts.get(userIp) + 1);
    console.log(`📌 ${userIp} has made ${userRequestCounts.get(userIp)} requests today.`);
    // #*0001*#
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content using Gemini API
    const result = await model.generateContent(`Write a short, engaging 2-3 liner about ${category}. 
      It should sound either educational(something novel) or inspiring or act like a quote, only of the following. 
      Should be of 2-3 lines, within 20 words)`);
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
// #*0000*# Modify /posts route to support pagination
app.get("/posts", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query; // Get pagination parameters
    page = parseInt(page);
    limit = parseInt(limit);

    const totalPosts = await Post.countDocuments(); // Get total number of posts
    const posts = await Post.find()
      .sort({ _id: -1 }) // Show latest posts first
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page
    });

  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});
// #*0000*#
app.get("/", (req, res) => {
  res.send("Backend is running!");
});


// Start the server
const PORT = process.env.PORT || 5000; // Use Render's assigned port or default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
