import { useEffect } from "react";
import { user } from "../data.js";
import FollowButton from "./FollowButton.jsx";
import Post from "./Post.jsx";

function Profile() {
  useEffect(() => {
    document.title = user.name + " · Mini Instagram";
  }, []);

  return (
    <section className="profile">
      <header className="profile-header">
        <img className="avatar" src={user.avatar} alt={user.name} />
        <div>
          <h2>{user.name}</h2>
          <p className="username">@{user.username}</p>
          <p>{user.bio}</p>
          <FollowButton />
        </div>
      </header>

      <div className="posts">
        {user.posts.map((post) => (
          <Post
            key={post.id}
            image={post.image}
            caption={post.caption}
            likes={post.likes}
          />
        ))}
      </div>
    </section>
  );
}

export default Profile;
