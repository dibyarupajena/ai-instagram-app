import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, generatePost } from "../redux/postSlice";

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.items); // Access posts from Redux store

  useEffect(() => {
    dispatch(fetchPosts()); // Fetch posts when component mounts
  }, [dispatch]);

  return (
    <div>
      <h2>AI-Powered Instagram</h2>
      <button onClick={() => dispatch(generatePost("technology"))}>
        Generate Tech Post
      </button>

      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
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
