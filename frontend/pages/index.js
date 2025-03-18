import { useEffect, useState } from "react";  // React Hook for running code when the component loads
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { fetchPosts, generatePost } from "../redux/postSlice"; // Import actions
// import clickSound from "../public/click-sound.mp3"; // Import the sound file

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

  const handleClick = () => {
    const audio = new Audio("/click-sound.mp3");
    audio.play(); // Play click sound
    handleGeneratePost(); // Call existing function
  };
  
  // #*0001*#

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center px-4 pt-12">

<h1 
  className="text-4xl font-semibold tracking-wide text-white 
             relative px-8 py-4 inline-block"
>
  <span className="relative z-10 font-thin" style={{ fontFamily: "'Space_Grotesk', serif", letterSpacing: "0.3em" }}>
    <span className="text-blue-500">Mind</span>ful
    <span className="text-gray-300"> Scrolling</span> 
  </span>

  {/* Oval Glow Effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 
                  opacity-25 blur-2xl rounded-full w-[250px] h-[80px] 
                  mx-auto -z-10 left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
  </div>
</h1>








      {/* #*0001*# Show error message if request limit exceeded */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {/* #*0001*# */}

      {/* Generate Post Button */}
      



<button 
  className="relative mt-4 px-20 py-2 text-white font-semibold shadow-lg 
             bg-blue-500 border-2 border-blue-700 
             transition-all duration-300 ease-in-out 
             overflow-hidden group text-lg tracking-wide 
             active:scale-95 hover:shadow-2xl hover:scale-110 rounded-lg"
  onClick={handleClick} 
  disabled={error !== null}
>
  <span className="relative z-10 font-extralight tracking-widest opacity-80" style={{ letterSpacing: "0.15em" }}>Generate Tech Post</span>

  {/* Shiny Reflection Overlay */}
  <div className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20 transition-all duration-500"></div>

  {/* Moving Light Streak */}
  <div className="absolute -top-1 left-0 w-full h-full 
                  bg-gradient-to-r from-blue-300/0 via-white/30 to-blue-300/0 
                  opacity-30 rotate-[-15deg] translate-x-[-100%] 
                  group-hover:translate-x-[150%] transition-all duration-700 ease-in-out"></div>

  {/* Pulsing Neon Glow */}
  <div className="absolute inset-0 w-full h-full 
                  transition-all duration-500 
                  animate-[pulse_2s_infinite] 
                  before:absolute before:inset-0 before:bg-blue-700/30 
                  before:blur-lg before:rounded-full 
                  before:transition-all before:duration-500 
                  before:group-hover:blur-2xl"></div>

  {/* Outer Neon Ring Effect */}
  <div className="absolute inset-0 w-full h-full 
                  group-hover:ring-4 group-hover:ring-blue-400/70 
                  transition-all duration-500"></div>
</button>











      <div className="mt-6 w-full max-w-md">
      <PostList />
      </div>
     
    </div>
  );
}
