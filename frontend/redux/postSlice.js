// Import Redux Toolkit utilities for creating slice and async actions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "axios"; // Axios for making API requests

// 🎯 Fetch posts from backend (GET request)
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("http://localhost:5000/posts"); // Replace with your backend URL
  return response.data; // Return fetched posts
});

// 🎯 Generate AI-powered post (POST request)
export const generatePost = createAsyncThunk("posts/generatePost", async (category) => {
  const response = await axios.post("http://localhost:5000/generate-post", { category }); 
  return response.data; // Return generated post
});

// ✅ Create Redux slice to manage state
const postSlice = createSlice({
  name: "posts",
  initialState: { items: [], status: "idle", error: null }, // Default state

  reducers: {}, // No direct reducers since we're using async actions

  // Handle async actions inside extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading"; // Set loading state
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded"; // Set success state
        state.items = action.payload; // Store fetched posts
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"; // Handle failure
        state.error = action.error.message;
      })

      .addCase(generatePost.fulfilled, (state, action) => {
        state.items.push(action.payload); // Add new post to existing list
      });
  }
});

// Export the reducer to be used in the store
export default postSlice.reducer;
