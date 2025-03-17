import { useEffect, useState } from "react";  // React Hook for running code when the component loads
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { fetchPosts, generatePost } from "../redux/postSlice"; // Import actions

///***0002***/// Import PostList component
import PostList from "../components/PostList";
///***0002***///

export default function Home() {
  const dispatch = useDispatch(); // Allows dispatching Redux actions
  const posts = useSelector((state) => state.posts?.items || []); 


  // #*0001*# State to track request limit error
  const [error, setError] = useState(null);
  // #*0001*#
  
  useEffect(() => {
    dispatch(fetchPosts()); // Fetch posts when component loads
  }, [dispatch]);


  const handleGeneratePost = async () => {
    try {
      const result = await dispatch(generatePost("technology")).unwrap(); // Dispatch Redux action
  
      if (result?.message === "Request limit reached") { // Check API response
        setError("Request limit reached (10 per day). Try again tomorrow.");
      } else {
        setError(null); // Clear error if successful
      }
    } catch (err) {
      console.error("Error generating post:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  
  
  // #*0001*#

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 pt-12">

      <h1 className="text-3xl font-bold text-blue-500 mt-6"> AI-Powered Instagram</h1>

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



      <div className="mt-6 w-full max-w-md">
      <PostList />
      </div>
     
    </div>
  );
}
