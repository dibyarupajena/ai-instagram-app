import { useEffect } from "react";  // React Hook for running code when the component loads
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { fetchPosts, generatePost } from "../redux/postSlice"; // Import actions

export default function Home() {
  const dispatch = useDispatch(); // Allows dispatching Redux actions
  const posts = useSelector((state) => state.posts?.items || []); 

  useEffect(() => {
    dispatch(fetchPosts()); // Fetch posts when component loads
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      <h1 className="text-3xl font-bold text-blue-500">🚀 AI-Powered Instagram</h1>


      {/* Generate Post Button */}
      <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition" onClick={() => dispatch(generatePost("technology"))}>
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
