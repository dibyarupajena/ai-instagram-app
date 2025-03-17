import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, generatePost } from "../redux/postSlice";

console.log("✅ PostList Component Rendered!");

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
  ///***0000***////

  return (
    <div>
      <h2>AI-Powered Instagram</h2>
      <button onClick={() => dispatch(generatePost("technology"))}>
        Generate Tech Post
      </button>

      <div className="mt-6 space-y-4 w-full max-w-md">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div 
              key={post._id} 
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              ref={index === posts.length - 1 ? lastPostRef : null} // Set ref on last post
            >
              <p className="text-lg text-gray-800">{post.text}</p>
              <span className="text-gray-600 text-sm">❤️ Likes: {post.likes}</span>
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
