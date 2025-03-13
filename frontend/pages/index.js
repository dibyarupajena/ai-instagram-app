import { useEffect, useState } from "react";  // React Hook for running code when the component loads
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { fetchPosts, generatePost } from "../redux/postSlice"; // Import actions

export default function Home() {
  const dispatch = useDispatch(); // Allows dispatching Redux actions
  const posts = useSelector((state) => state.posts?.items || []); 


  // #*0001*# State to track request limit error
  const [error, setError] = useState(null);
  // #*0001*#
  
  useEffect(() => {
    dispatch(fetchPosts()); // Fetch posts when component loads
  }, [dispatch]);

  // #*0001*# Handle post generation and limit errors
  const handleGeneratePost = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "technology" }),
      });

      if (response.status === 429) {
        setError("Request limit reached (10 per day). Try again tomorrow.");
      } else {
        dispatch(fetchPosts()); // Refresh posts after generating
        setError(null); // Clear error if successful
      }
    } catch (err) {
      console.error("Error generating post:", err);
      setError("Something went wrong. Please try again.");
    }
  };
  // #*0001*#

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      <h1 className="text-3xl font-bold text-blue-500">🚀 AI-Powered Instagram</h1>

      {/* #*0001*# Show error message if request limit exceeded */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {/* #*0001*# */}

      {/* Generate Post Button */}
      <button 
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
        onClick={handleGeneratePost} 
        disabled={error !== null} // #*0001*# Disable button if error exists
      >
        Generate Tech Post
      </button>

      {/* Display Posts */}
      <div className="mt-6 space-y-4 w-full max-w-md">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post._id} 
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <p className="text-lg text-gray-800">{post.text}</p>
              <span className="text-gray-600 text-sm">❤️ Likes: {post.likes}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>

    </div>
  );
}
