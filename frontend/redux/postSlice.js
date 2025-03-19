// Import Redux Toolkit utilities for creating slice and async actions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "axios"; // Axios for making API requests


// 🎯 Generate AI-powered post (POST request)
export const generatePost = createAsyncThunk("posts/generatePost", async (category) => {
  console.log("📤 Sending category:", category);

  const response = await axios.post("https://ai-instagram-app.onrender.com/generate-post", { category }); 
  // console.log(" Received response:", response.data);
  return response.data; // Return generated post
});

// #*0000*# Modify fetchPosts to support pagination
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async ({ page, limit }) => {
  const response = await axios.get(`https://ai-instagram-app.onrender.com/posts?page=${page}&limit=${limit}`);
  return response.data; // Return paginated posts data
});
// #*0000*#

// ✅ Create Redux slice to manage state
const postSlice = createSlice({
  name: "posts",
  initialState: { items: [], status: "idle", error: null, currentPage: 1, totalPages: 1 }, // Added pagination state

  reducers: {
        ///***0000***////
        likePost: (state, action) => {
          const post = state.items.find((p) => p._id === action.payload); // Find post by ID
          if (post) {
            post.likes += 1; // Increment likes count
          }
        }
        ///***0000***////
  }, 

  // Handle async actions inside extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading"; // Set loading state
      })

      
      // #*0000*# Append new posts instead of replacing old ones
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.meta.arg.page === 1) {
          state.items = action.payload.posts; // First page replaces items
        } else {
          state.items = [...state.items, ...action.payload.posts]; // Append new posts
        }
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      // #*0000*#
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"; // Handle failure
        state.error = action.error.message;
      })

      .addCase(generatePost.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // Add new post at the top
      });

      
  }
});

// Export the action
export const { likePost } = postSlice.actions;

// Export the reducer to be used in the store
export default postSlice.reducer;
