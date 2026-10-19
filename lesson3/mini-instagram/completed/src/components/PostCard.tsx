import { useState } from "react";
import type { Post } from "../types.ts";

type PostCardProps = {
  post: Post;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void; // an action that goes back up
};

function PostCard({ post, isFavorite, onToggleFavorite }: PostCardProps) {
  // The likes prop is only the starting value. This card owns its own count.
  const [likes, setLikes] = useState(post.likes);

  return (
    <article className="post">
      <img src={post.image} alt={post.caption} />
      <div className="post-body">
        <button className="like-btn" onClick={() => setLikes(likes + 1)}>
          ♥ Like
        </button>
        <button
          className={isFavorite ? "fav on" : "fav"}
          onClick={() => onToggleFavorite(post.id)}
        >
          {isFavorite ? "★ Favorite" : "☆ Favorite"}
        </button>
        <p className="likes">{likes} likes</p>
        <p className="caption">{post.caption}</p>
        {post.location && <p className="location">📍 {post.location}</p>}
        <p className="tags">{post.tags.map((tag) => "#" + tag).join(" ")}</p>
      </div>
    </article>
  );
}

export default PostCard;
