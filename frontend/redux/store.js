// Import Redux Toolkit's configureStore function
import { configureStore } from "@reduxjs/toolkit"; 
import postReducer from "./postSlice"; // Import postSlice reducer

// ✅ Create Redux store
const store = configureStore({
  reducer: {
    posts: postReducer, // Store posts in state
  },
});

// Export store to be used in the app
export default store;
