import { useEffect } from "react";
import { user } from "../data.js";
import Post from "./Post.jsx";

function Home() {
  useEffect(() => {
    document.title = "Home · Mini Instagram";
  }, []);

  return (
    <section className="feed">
      <h2>Home feed</h2>
      {user.posts.map((post) => (
        <Post
          key={post.id}
          image={post.image}
          caption={post.caption}
          likes={post.likes}
        />
      ))}
    </section>
  );
}

export default Home;
