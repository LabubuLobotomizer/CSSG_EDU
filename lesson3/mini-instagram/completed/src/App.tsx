import { useState } from "react";
import { user } from "./data.ts";
import { TAGS, type Tag } from "./types.ts";
import Profile from "./components/Profile.tsx";
import PostCard from "./components/PostCard.tsx";
import Section from "./components/Section.tsx";

function App() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<Tag | null>(null);

  function toggleFavorite(id: number) {
    setFavorites(
      favorites.includes(id)
        ? favorites.filter((f) => f !== id) // remove: a new, shorter array
        : [...favorites, id] // add: a new, longer array
    );
  }

  // Derived: worked out from state on every render. Never stored in state.
  const visible = user.posts.filter(
    (post) =>
      post.caption.toLowerCase().includes(query.toLowerCase()) &&
      (activeTag === null || post.tags.includes(activeTag))
  );

  return (
    <main className="app">
      <header className="header">
        <h1 className="logo">Mini Instagram</h1>
        <p>
          ★ {favorites.length} favorites · showing {visible.length} of {user.posts.length} posts
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search captions…"
          aria-label="Search captions"
        />
      </header>
      <Profile user={user} />

      <nav className="tags" aria-label="Filter by tag">
        {TAGS.map((tag) => (
          <button
            key={tag}
            className={tag === activeTag ? "tag active" : "tag"}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
          >
            #{tag}
          </button>
        ))}
      </nav>

      <Section title="Posts">
        {visible.length === 0 ? (
          <p className="empty">No posts match. Try another search or tag.</p>
        ) : (
          <div className="posts">
            {visible.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isFavorite={favorites.includes(post.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}

export default App;
