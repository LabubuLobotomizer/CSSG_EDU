import type { User } from "../types.ts";
import FollowButton from "./FollowButton.tsx";

type ProfileProps = {
  user: User;
};

function Profile({ user }: ProfileProps) {
  return (
    <header className="profile">
      <img className="avatar" src={user.avatar} alt={user.name} />
      <div>
        <h2>{user.name}</h2>
        <p className="username">@{user.username}</p>
        <p>{user.bio}</p>
        <p className="stats">
          <b>{user.posts.length}</b> posts · <b>{user.stats.followers}</b> followers ·{" "}
          <b>{user.stats.following}</b> following
        </p>
        <FollowButton />
      </div>
    </header>
  );
}

export default Profile;
