import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, generatePost, likePost } from "../redux/postSlice";



const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.items);
  const currentPage = useSelector((state) => state.posts.currentPage);
  const totalPages = useSelector((state) => state.posts.totalPages);
  const status = useSelector((state) => state.posts.status); // Track loading state

  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const lastPostRef = useRef(null); // Reference for the last post

  useEffect(() => {
    console.log("Fetching first batch of posts...");
    dispatch(fetchPosts({ page: 1, limit: 5 })); // Initial fetch
  }, [dispatch]);

  useEffect(() => {
    if (page === 1) return;
    console.log(`Fetching page: ${page}`);
    dispatch(fetchPosts({ page, limit: 5 }));
  }, [page, dispatch]);

  ///***0000***////
  // Optimized observer function
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      console.log("Observer triggered:", target.isIntersecting);
      if (target.isIntersecting && currentPage < totalPages && status !== "loading") {
        console.log("Loading next page...");
        setPage((prevPage) => prevPage + 1);
      }
    },
    [currentPage, totalPages, status]
  );

  useEffect(() => {
    if (!lastPostRef.current) {
      console.log("No last post found!");
      return;
    }
    console.log("Observing last post...");
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.5 }); // Trigger when half-visible
    observer.observe(lastPostRef.current);

    return () => observer.disconnect(); // Cleanup observer
  }, [handleObserver, posts]);

  const handleLike = (postId) => {
    dispatch(likePost(postId)); // Dispatch the like action
  };

  
  return (

<div>
  <div className="mt-6 space-y-4 w-full max-w-md">
    {posts.length > 0 ? (
      posts.map((post, index) => (
        <div 
          key={post._id} 
          className="p-4 rounded-lg shadow-md border  
                    bg-[#dfe5f0] bg-opacity-30 backdrop-blur-md transition-all duration-300 
                    transform hover:scale-[1.02] hover:shadow-lg"
          ref={index === posts.length - 1 ? lastPostRef : null} // Set ref on last post
        >
          <p className="text-lg text-gray-500">{post.text}</p>
          <span className="text-gray-500 text-sm flex items-center gap-1">
            <span 
              className="cursor-pointer text-lg transition-transform transform hover:scale-125 
                        active:scale-110 animate-pulse"
                  onClick={() => handleLike(post._id)} // Like button click
            >
              ❤️
            </span> 
            Likes: {post.likes}
          </span>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No posts yet...</p>
    )}
  </div>
</div>



  );
};

export default PostList;
