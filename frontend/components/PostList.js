import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, generatePost } from "../redux/postSlice";

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.items); // Access posts from Redux store
  const currentPage = useSelector((state) => state.posts.currentPage);
  const totalPages = useSelector((state) => state.posts.totalPages);

  const [page, setPage] = useState(1); // Track current page
  const observerRef = useRef(null); // Ref for IntersectionObserver

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 5 })); // Fetch first page
  }, [dispatch])

    // Infinite Scroll: Fetch next page when last post is visible
    useEffect(() => {
      if (page === 1) return; // Avoid duplicate first fetch
  
      dispatch(fetchPosts({ page, limit: 5 })); // Fetch next page when page state updates
    }, [page, dispatch]);
  
  // Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect(); // Cleanup old observer

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          setPage((prevPage) => prevPage + 1); // Load next page
        }
      },
      { threshold: 1.0 } // Trigger when fully visible
    );

    if (document.getElementById("last-post")) {
      observerRef.current.observe(document.getElementById("last-post"));
    }
  }, [posts, currentPage, totalPages]);


  return (
    <div>
      <h2>AI-Powered Instagram</h2>
      <button onClick={() => dispatch(generatePost("technology"))}>
        Generate Tech Post
      </button>

      <div>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post._id} id={index === posts.length - 1 ? "last-post" : null}>
              <p>{post.text}</p>
              <span>Likes: {post.likes}</span>
            </div>
          ))
        ) : (
          <p>No posts yet...</p>
        )}
      </div>
    </div>
  );
};

export default PostList;
