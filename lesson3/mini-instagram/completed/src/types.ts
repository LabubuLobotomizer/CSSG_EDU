// The shapes of our data. No JSX in here, so it is a .ts file.
export type Tag = "club" | "code" | "food" | "travel";

export type Post = {
  id: number;
  image: string;
  caption: string;
  likes: number;
  tags: Tag[];
  location?: string; // optional: not every post has one
};

export type User = {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  stats: {
    followers: number;
    following: number;
  };
  posts: Post[];
};

// Every tag, in the order the filter buttons show them.
export const TAGS: Tag[] = ["club", "code", "food", "travel"];
