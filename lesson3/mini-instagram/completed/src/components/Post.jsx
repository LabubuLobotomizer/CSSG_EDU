import { useState } from "react";

function Post({ image, caption, likes }) {
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => setLikeCount(likeCount + 1);

  return (
    <article className="post">
      <img src={image} alt={caption} />
      <div className="post-body">
        <button className="like-btn" onClick={handleLike}>♥ Like</button>
        <p className="likes">{likeCount} likes</p>
        <p className="caption">{caption}</p>
      </div>
    </article>
  );
}

export default Post;
