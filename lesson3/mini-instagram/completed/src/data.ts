import type { User } from "./types.ts";

// The data for our app. Any component can import it.
export const user: User = {
  name: "CS + SG",
  username: "cssg.education",
  bio: "We build real websites as a team.",
  avatar: "https://picsum.photos/seed/cssg-avatar/200",
  stats: { followers: 120, following: 48 },
  posts: [
    { id: 1, image: "https://picsum.photos/seed/cssg-1/600", caption: "First day of CS + SG!", likes: 42, tags: ["club"], location: "Room 204" },
    { id: 2, image: "https://picsum.photos/seed/cssg-2/600", caption: "Shipped our first React app", likes: 18, tags: ["code", "club"] },
    { id: 3, image: "https://picsum.photos/seed/cssg-3/600", caption: "Team dinner after demo day", likes: 27, tags: ["food", "club"], location: "Noodle Bar" },
    { id: 4, image: "https://picsum.photos/seed/cssg-4/600", caption: "Whiteboard full of ideas", likes: 9, tags: ["code"] },
    { id: 5, image: "https://picsum.photos/seed/cssg-5/600", caption: "Field trip to the science museum", likes: 31, tags: ["travel", "club"] },
  ],
};
