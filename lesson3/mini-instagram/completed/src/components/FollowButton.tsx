import { useState } from "react";

function FollowButton() {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <button
      className={isFollowing ? "follow-btn following" : "follow-btn"}
      onClick={() => setIsFollowing(!isFollowing)}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
