// Worked example: Mini Instagram in React + TypeScript, built one step at a time.
// files(step) returns every file in the project at that step. The slides show
// the files that changed and highlight the new lines.
// `node build-example.js` writes step 1 into mini-instagram/starter/ and the
// last step into mini-instagram/completed/.
(function (root) {
  const last = 12;

  // Each helper builds a list of lines. add(from, ...) only adds the lines
  // once the class has reached that step.
  function lines(step) {
    const out = [];
    out.add = (from, ...text) => { if (step >= from) out.push(...text); return out; };
    out.text = () => out.join('\n') + '\n';
    return out;
  }

  function indexHtml() {
    return [
      '<!doctype html>',
      '<html lang="en">',
      '  <head>',
      '    <meta charset="UTF-8" />',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      '    <title>Mini Instagram</title>',
      '  </head>',
      '  <body>',
      '    <div id="root"></div>',
      '    <script type="module" src="/src/main.tsx"></script>',
      '  </body>',
      '</html>'
    ].join('\n') + '\n';
  }

  function mainTsx() {
    return [
      'import { createRoot } from "react-dom/client";',
      'import App from "./App.tsx";',
      'import "./index.css";',
      '',
      '// The ! tells TypeScript "this element exists". getElementById could return null.',
      'createRoot(document.getElementById("root")!).render(<App />);'
    ].join('\n') + '\n';
  }

  function typesTs(step) {
    const l = lines(step);
    l.push('// The shapes of our data. No JSX in here, so it is a .ts file.',
      'export type Tag = "club" | "code" | "food" | "travel";',
      '',
      'export type Post = {',
      '  id: number;',
      '  image: string;',
      '  caption: string;',
      '  likes: number;',
      '  tags: Tag[];',
      '  location?: string; // optional: not every post has one',
      '};',
      '',
      'export type User = {',
      '  name: string;',
      '  username: string;',
      '  bio: string;',
      '  avatar: string;',
      '  stats: {',
      '    followers: number;',
      '    following: number;',
      '  };',
      '  posts: Post[];',
      '};');
    l.add(11, '', '// Every tag, in the order the filter buttons show them.',
      'export const TAGS: Tag[] = ["club", "code", "food", "travel"];');
    return l.text();
  }

  function dataTs() {
    return [
      'import type { User } from "./types.ts";',
      '',
      '// The data for our app. Any component can import it.',
      'export const user: User = {',
      '  name: "CS + SG",',
      '  username: "cssg.education",',
      '  bio: "We build real websites as a team.",',
      '  avatar: "https://picsum.photos/seed/cssg-avatar/200",',
      '  stats: { followers: 120, following: 48 },',
      '  posts: [',
      '    { id: 1, image: "https://picsum.photos/seed/cssg-1/600", caption: "First day of CS + SG!", likes: 42, tags: ["club"], location: "Room 204" },',
      '    { id: 2, image: "https://picsum.photos/seed/cssg-2/600", caption: "Shipped our first React app", likes: 18, tags: ["code", "club"] },',
      '    { id: 3, image: "https://picsum.photos/seed/cssg-3/600", caption: "Team dinner after demo day", likes: 27, tags: ["food", "club"], location: "Noodle Bar" },',
      '    { id: 4, image: "https://picsum.photos/seed/cssg-4/600", caption: "Whiteboard full of ideas", likes: 9, tags: ["code"] },',
      '    { id: 5, image: "https://picsum.photos/seed/cssg-5/600", caption: "Field trip to the science museum", likes: 31, tags: ["travel", "club"] },',
      '  ],',
      '};'
    ].join('\n') + '\n';
  }

  function profileTsx(step) {
    const l = lines(step);
    l.push('import type { User } from "../types.ts";');
    l.add(8, 'import FollowButton from "./FollowButton.tsx";');
    l.push('', 'type ProfileProps = {', '  user: User;', '};', '',
      'function Profile({ user }: ProfileProps) {',
      '  return (',
      '    <header className="profile">',
      '      <img className="avatar" src={user.avatar} alt={user.name} />',
      '      <div>',
      '        <h2>{user.name}</h2>',
      '        <p className="username">@{user.username}</p>',
      '        <p>{user.bio}</p>',
      '        <p className="stats">',
      '          <b>{user.posts.length}</b> posts · <b>{user.stats.followers}</b> followers ·{" "}',
      '          <b>{user.stats.following}</b> following',
      '        </p>');
    l.add(8, '        <FollowButton />');
    l.push('      </div>', '    </header>', '  );', '}', '', 'export default Profile;');
    return l.text();
  }

  function postCardTsx(step) {
    const l = lines(step);
    if (step >= 7) l.push('import { useState } from "react";');
    l.push('import type { Post } from "../types.ts";', '',
      'type PostCardProps = {',
      '  post: Post;');
    l.add(9, '  isFavorite: boolean;',
      '  onToggleFavorite: (id: number) => void; // an action that goes back up');
    l.push('};', '');
    l.push(step >= 9
      ? 'function PostCard({ post, isFavorite, onToggleFavorite }: PostCardProps) {'
      : 'function PostCard({ post }: PostCardProps) {');
    l.add(7, '  // The likes prop is only the starting value. This card owns its own count.',
      '  const [likes, setLikes] = useState(post.likes);', '');
    l.push('  return (',
      '    <article className="post">',
      '      <img src={post.image} alt={post.caption} />',
      '      <div className="post-body">');
    l.add(7, '        <button className="like-btn" onClick={() => setLikes(likes + 1)}>',
      '          ♥ Like',
      '        </button>');
    l.add(9, '        <button',
      '          className={isFavorite ? "fav on" : "fav"}',
      '          onClick={() => onToggleFavorite(post.id)}',
      '        >',
      '          {isFavorite ? "★ Favorite" : "☆ Favorite"}',
      '        </button>');
    l.push(step >= 7 ? '        <p className="likes">{likes} likes</p>' : '        <p className="likes">{post.likes} likes</p>',
      '        <p className="caption">{post.caption}</p>',
      '        {post.location && <p className="location">📍 {post.location}</p>}',
      '        <p className="tags">{post.tags.map((tag) => "#" + tag).join(" ")}</p>',
      '      </div>',
      '    </article>',
      '  );', '}', '', 'export default PostCard;');
    return l.text();
  }

  function followButtonTsx() {
    return [
      'import { useState } from "react";',
      '',
      'function FollowButton() {',
      '  const [isFollowing, setIsFollowing] = useState(false);',
      '',
      '  return (',
      '    <button',
      '      className={isFollowing ? "follow-btn following" : "follow-btn"}',
      '      onClick={() => setIsFollowing(!isFollowing)}',
      '    >',
      '      {isFollowing ? "Following" : "Follow"}',
      '    </button>',
      '  );',
      '}',
      '',
      'export default FollowButton;'
    ].join('\n') + '\n';
  }

  function sectionTsx() {
    return [
      'import type { ReactNode } from "react";',
      '',
      'type SectionProps = {',
      '  title: string;',
      '  children: ReactNode; // whatever is written between <Section> and </Section>',
      '};',
      '',
      'function Section({ title, children }: SectionProps) {',
      '  return (',
      '    <section className="section">',
      '      <h2>{title}</h2>',
      '      {children}',
      '    </section>',
      '  );',
      '}',
      '',
      'export default Section;'
    ].join('\n') + '\n';
  }

  function cardLines(l, step, list, indent) {
    l.push(indent + '{' + list + '.map((post) => (');
    if (step >= 9) l.push(indent + '  <PostCard',
      indent + '    key={post.id}',
      indent + '    post={post}',
      indent + '    isFavorite={favorites.includes(post.id)}',
      indent + '    onToggleFavorite={toggleFavorite}',
      indent + '  />');
    else l.push(indent + '  <PostCard key={post.id} post={post} />');
    l.push(indent + '))}');
  }

  function appTsx(step) {
    const l = lines(step);
    if (step >= 9) l.push('import { useState } from "react";');
    if (step >= 3) l.push('import { user } from "./data.ts";');
    if (step >= 11) l.push('import { TAGS, type Tag } from "./types.ts";');
    else if (step >= 9) l.push('import type { Tag } from "./types.ts";');
    if (step >= 4) l.push('import Profile from "./components/Profile.tsx";');
    if (step >= 5) l.push('import PostCard from "./components/PostCard.tsx";');
    if (step >= 6) l.push('import Section from "./components/Section.tsx";');
    if (step >= 3) l.push('');
    l.push('function App() {');
    if (step >= 9) l.push(
      '  const [favorites, setFavorites] = useState<number[]>([]);',
      '  const [query, setQuery] = useState("");',
      '  const [activeTag, setActiveTag] = useState<Tag | null>(null);',
      '',
      '  function toggleFavorite(id: number) {',
      '    setFavorites(',
      '      favorites.includes(id)',
      '        ? favorites.filter((f) => f !== id) // remove: a new, shorter array',
      '        : [...favorites, id] // add: a new, longer array',
      '    );',
      '  }',
      '',
      '  // Derived: worked out from state on every render. Never stored in state.',
      '  const visible = user.posts.filter(',
      '    (post) =>',
      '      post.caption.toLowerCase().includes(query.toLowerCase()) &&',
      '      (activeTag === null || post.tags.includes(activeTag))',
      '  );',
      '');
    l.push('  return (', '    <main className="app">');
    if (step < 10) l.push('      <h1 className="logo">Mini Instagram</h1>');
    else l.push(
      '      <header className="header">',
      '        <h1 className="logo">Mini Instagram</h1>',
      '        <p>',
      '          ★ {favorites.length} favorites · showing {visible.length} of {user.posts.length} posts',
      '        </p>',
      '        <input',
      '          type="search"',
      '          value={query}',
      '          onChange={(e) => setQuery(e.target.value)}',
      '          placeholder="Search captions…"',
      '          aria-label="Search captions"',
      '        />',
      '      </header>');
    if (step === 3) l.push('      <p>{user.posts.length} posts by @{user.username}</p>');
    if (step >= 4) l.push('      <Profile user={user} />');
    if (step >= 11) l.push('',
      '      <nav className="tags" aria-label="Filter by tag">',
      '        {TAGS.map((tag) => (',
      '          <button',
      '            key={tag}',
      '            className={tag === activeTag ? "tag active" : "tag"}',
      '            onClick={() => setActiveTag(tag === activeTag ? null : tag)}',
      '          >',
      '            #{tag}',
      '          </button>',
      '        ))}',
      '      </nav>');
    if (step === 5) l.push('      <PostCard post={user.posts[0]} />');
    if (step >= 6) {
      l.push('', '      <Section title="Posts">');
      if (step >= 12) {
        l.push('        {visible.length === 0 ? (',
          '          <p className="empty">No posts match. Try another search or tag.</p>',
          '        ) : (',
          '          <div className="posts">');
        cardLines(l, step, 'visible', '            ');
        l.push('          </div>', '        )}');
      } else {
        l.push('        <div className="posts">');
        cardLines(l, step, 'user.posts', '          ');
        l.push('        </div>');
      }
      l.push('      </Section>');
    }
    l.push('    </main>', '  );', '}', '', 'export default App;');
    return l.text();
  }

  function indexCss(step) {
    const blocks = [];
    const add = (from, text) => { if (step >= from) blocks.push(text); };
    add(1, '/* Global styles: every component can use these classes. */\n' +
      'body {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  background: #fafafa;\n  color: #222;\n}\n\n' +
      '.app {\n  max-width: 640px;\n  margin: 0 auto;\n  padding: 16px;\n}\n\n' +
      '.logo {\n  font-size: 24px;\n}');
    add(4, '.profile {\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  background: white;\n' +
      '  border-radius: 12px;\n  padding: 20px;\n  margin-bottom: 16px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);\n}\n\n' +
      '.avatar {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n}\n\n' +
      '.username {\n  color: #888;\n  margin: 0;\n}\n\n' +
      '.stats {\n  font-size: 14px;\n}');
    add(5, '.post {\n  background: white;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  overflow: hidden;\n}\n\n' +
      '.post img {\n  width: 100%;\n  display: block;\n}\n\n' +
      '.post-body {\n  padding: 10px 12px;\n}\n\n' +
      '.likes {\n  font-weight: bold;\n  margin: 4px 0;\n}\n\n' +
      '.caption {\n  margin: 0;\n}\n\n' +
      '.location,\n.tags {\n  color: #888;\n  font-size: 13px;\n  margin: 4px 0 0;\n}');
    add(6, '.posts {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 12px;\n}');
    add(7, '.like-btn {\n  border: none;\n  background: none;\n  font-size: 16px;\n  padding: 0;\n  cursor: pointer;\n}');
    add(8, '.follow-btn {\n  background: #0095f6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n' +
      '  padding: 8px 16px;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n' +
      '.follow-btn.following {\n  background: #ddd;\n  color: #222;\n}');
    add(9, '.fav {\n  border: 1px solid #ccc;\n  background: white;\n  border-radius: 6px;\n  padding: 2px 8px;\n' +
      '  margin-left: 8px;\n  cursor: pointer;\n}\n\n' +
      '.fav.on {\n  background: #fff4c2;\n  border-color: #e0b300;\n}');
    add(10, '.header input {\n  width: 100%;\n  box-sizing: border-box;\n  font: inherit;\n  padding: 8px 10px;\n' +
      '  margin-bottom: 16px;\n  border: 1px solid #ccc;\n  border-radius: 6px;\n}');
    add(11, 'nav.tags {\n  display: flex;\n  gap: 8px;\n  margin: 0 0 12px;\n}\n\n' +
      '.tag {\n  border: 1px solid #ccc;\n  background: white;\n  border-radius: 999px;\n  padding: 4px 12px;\n  cursor: pointer;\n}\n\n' +
      '.tag.active {\n  background: #222;\n  color: white;\n}');
    add(12, '.empty {\n  color: #888;\n  font-style: italic;\n}');
    return blocks.join('\n\n') + '\n';
  }

  // Every file in the project at this step, in the order a file tree shows them.
  function files(step) {
    const f = { 'index.html': indexHtml(), 'src/main.tsx': mainTsx(), 'src/App.tsx': appTsx(step), 'src/index.css': indexCss(step) };
    if (step >= 2) f['src/types.ts'] = typesTs(step);
    if (step >= 3) f['src/data.ts'] = dataTs();
    if (step >= 4) f['src/components/Profile.tsx'] = profileTsx(step);
    if (step >= 5) f['src/components/PostCard.tsx'] = postCardTsx(step);
    if (step >= 6) f['src/components/Section.tsx'] = sectionTsx();
    if (step >= 8) f['src/components/FollowButton.tsx'] = followButtonTsx();
    return f;
  }

  // title, and the files the class edits this step (the first one opens).
  const steps = [
    null,
    { title: 'Clean slate', files: ['src/App.tsx', 'src/main.tsx', 'src/index.css', 'index.html'] },
    { title: 'Types', files: ['src/types.ts'] },
    { title: 'Data', files: ['src/data.ts', 'src/App.tsx'] },
    { title: 'Profile', files: ['src/components/Profile.tsx', 'src/App.tsx', 'src/index.css'] },
    { title: 'PostCard', files: ['src/components/PostCard.tsx', 'src/App.tsx', 'src/index.css'] },
    { title: 'List', files: ['src/App.tsx', 'src/components/Section.tsx', 'src/index.css'] },
    { title: 'Likes', files: ['src/components/PostCard.tsx', 'src/index.css'] },
    { title: 'Follow', files: ['src/components/FollowButton.tsx', 'src/components/Profile.tsx', 'src/index.css'] },
    { title: 'Part 1 · state', files: ['src/App.tsx', 'src/components/PostCard.tsx', 'src/index.css'] },
    { title: 'Part 2 · search', files: ['src/App.tsx', 'src/index.css'] },
    { title: 'Part 3 · tags', files: ['src/App.tsx', 'src/types.ts', 'src/index.css'] },
    { title: 'Part 4 · list', files: ['src/App.tsx', 'src/index.css'] }
  ];

  const api = { files, steps, last };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MiniInsta = api;
})(this);
