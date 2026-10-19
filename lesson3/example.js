// Worked example: Mini Instagram, built one step at a time.
// files(step) returns every file in the project at that step. The slides show
// the files that changed and highlight the new lines.
// `node build-example.js` writes step 1 into mini-instagram/starter/ and the
// last step into mini-instagram/completed/.
(function (root) {
  const last = 11;

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
      '    <script type="module" src="/src/main.jsx"></script>',
      '  </body>',
      '</html>'
    ].join('\n') + '\n';
  }

  function mainJsx(step) {
    const l = lines(step);
    l.push('import { createRoot } from "react-dom/client";');
    l.add(9, 'import { BrowserRouter } from "react-router";');
    l.push('import App from "./App.jsx";');
    l.add(2, 'import "./style.css";');
    l.push('');
    if (step < 9) l.push('createRoot(document.getElementById("root")).render(<App />);');
    else l.push(
      'createRoot(document.getElementById("root")).render(',
      '  <BrowserRouter>',
      '    <App />',
      '  </BrowserRouter>',
      ');');
    return l.text();
  }

  function appJsx(step) {
    const l = lines(step);
    if (step >= 9) l.push('import { Routes, Route } from "react-router";');
    if (step >= 10) l.push('import Navbar from "./components/Navbar.jsx";');
    if (step >= 9) l.push('import Home from "./components/Home.jsx";');
    if (step >= 3) l.push('import Profile from "./components/Profile.jsx";', '');
    l.push('function App() {');
    if (step === 1) {
      l.push('  return <h1>Mini Instagram</h1>;');
    } else {
      l.push('  return (', '    <div className="app">');
      if (step < 10) l.push('      <h1 className="logo">Mini Instagram</h1>');
      else l.push('      <Navbar />');
      if (step >= 3 && step < 9) l.push('      <Profile />');
      if (step >= 9) l.push(
        '      <Routes>',
        '        <Route path="/" element={<Home />} />',
        '        <Route path="/profile" element={<Profile />} />',
        '      </Routes>');
      l.push('    </div>', '  );');
    }
    l.push('}', '', 'export default App;');
    return l.text();
  }

  function dataJs() {
    return [
      '// The data for our app. Any component can import it.',
      'export const user = {',
      '  name: "CS + SG",',
      '  username: "cssg.education",',
      '  bio: "We build real websites as a team.",',
      '  avatar: "https://picsum.photos/seed/cssg-avatar/200",',
      '  posts: [',
      '    { id: 1, image: "https://picsum.photos/seed/cssg-1/600", caption: "First day of CS + SG!", likes: 42 },',
      '    { id: 2, image: "https://picsum.photos/seed/cssg-2/600", caption: "Shipped our first React app", likes: 18 },',
      '    { id: 3, image: "https://picsum.photos/seed/cssg-3/600", caption: "Team dinner after demo day", likes: 27 },',
      '    { id: 4, image: "https://picsum.photos/seed/cssg-4/600", caption: "Whiteboard full of ideas", likes: 9 },',
      '  ],',
      '};'
    ].join('\n') + '\n';
  }

  function postLines(l, step, indent) {
    l.push(indent + '{user.posts.map((post) => (',
      indent + '  <Post',
      indent + '    key={post.id}',
      indent + '    image={post.image}',
      indent + '    caption={post.caption}');
    l.add(6, indent + '    likes={post.likes}');
    l.push(indent + '  />', indent + '))}');
  }

  function profileJsx(step) {
    const l = lines(step);
    if (step >= 11) l.push('import { useEffect } from "react";');
    if (step >= 8) l.push('import { user } from "../data.js";');
    if (step >= 7) l.push('import FollowButton from "./FollowButton.jsx";');
    if (step >= 4) l.push('import Post from "./Post.jsx";');
    if (step >= 4) l.push('');
    if (step < 8) {
      l.push('const user = {',
        '  name: "CS + SG",',
        '  username: "cssg.education",',
        '  bio: "We build real websites as a team.",',
        '  avatar: "https://picsum.photos/seed/cssg-avatar/200",');
      if (step >= 5) l.push('  posts: [',
        '    { id: 1, image: "https://picsum.photos/seed/cssg-1/600", caption: "First day of CS + SG!", likes: 42 },',
        '    { id: 2, image: "https://picsum.photos/seed/cssg-2/600", caption: "Shipped our first React app", likes: 18 },',
        '    { id: 3, image: "https://picsum.photos/seed/cssg-3/600", caption: "Team dinner after demo day", likes: 27 },',
        '    { id: 4, image: "https://picsum.photos/seed/cssg-4/600", caption: "Whiteboard full of ideas", likes: 9 },',
        '  ],');
      l.push('};', '');
    }
    l.push('function Profile() {');
    if (step >= 11) l.push('  useEffect(() => {',
      '    document.title = user.name + " · Mini Instagram";',
      '  }, []);', '');
    l.push('  return (',
      '    <section className="profile">',
      '      <header className="profile-header">',
      '        <img className="avatar" src={user.avatar} alt={user.name} />',
      '        <div>',
      '          <h2>{user.name}</h2>',
      '          <p className="username">@{user.username}</p>',
      '          <p>{user.bio}</p>');
    l.add(7, '          <FollowButton />');
    l.push('        </div>', '      </header>');
    if (step === 4) l.push('',
      '      <div className="posts">',
      '        <Post image="https://picsum.photos/seed/cssg-1/600" caption="First day of CS + SG!" />',
      '        <Post image="https://picsum.photos/seed/cssg-2/600" caption="Shipped our first React app" />',
      '      </div>');
    if (step >= 5) {
      l.push('', '      <div className="posts">');
      postLines(l, step, '        ');
      l.push('      </div>');
    }
    l.push('    </section>', '  );', '}', '', 'export default Profile;');
    return l.text();
  }

  function postJsx(step) {
    const l = lines(step);
    if (step >= 6) l.push('import { useState } from "react";', '');
    l.push(step >= 6 ? 'function Post({ image, caption, likes }) {' : 'function Post({ image, caption }) {');
    if (step >= 6) l.push('  const [likeCount, setLikeCount] = useState(likes);', '',
      '  const handleLike = () => setLikeCount(likeCount + 1);', '');
    l.push('  return (',
      '    <article className="post">',
      '      <img src={image} alt={caption} />',
      '      <div className="post-body">');
    l.add(6, '        <button className="like-btn" onClick={handleLike}>♥ Like</button>',
      '        <p className="likes">{likeCount} likes</p>');
    l.push('        <p className="caption">{caption}</p>',
      '      </div>',
      '    </article>',
      '  );', '}', '', 'export default Post;');
    return l.text();
  }

  function followButtonJsx() {
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

  function homeJsx(step) {
    const l = lines(step);
    if (step >= 11) l.push('import { useEffect } from "react";');
    l.push('import { user } from "../data.js";', 'import Post from "./Post.jsx";', '', 'function Home() {');
    if (step >= 11) l.push('  useEffect(() => {',
      '    document.title = "Home · Mini Instagram";',
      '  }, []);', '');
    l.push('  return (', '    <section className="feed">', '      <h2>Home feed</h2>');
    postLines(l, step, '      ');
    l.push('    </section>', '  );', '}', '', 'export default Home;');
    return l.text();
  }

  function navbarJsx() {
    return [
      'import { Link } from "react-router";',
      '',
      'function Navbar() {',
      '  return (',
      '    <nav className="navbar">',
      '      <Link to="/" className="logo">Mini Instagram</Link>',
      '      <div className="nav-links">',
      '        <Link to="/">Home</Link>',
      '        <Link to="/profile">Profile</Link>',
      '      </div>',
      '    </nav>',
      '  );',
      '}',
      '',
      'export default Navbar;'
    ].join('\n') + '\n';
  }

  function styleCss(step) {
    const blocks = [];
    const add = (from, text) => { if (step >= from) blocks.push(text); };
    add(2, '/* Global styles: every component can use these classes. */\n' +
      'body {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  background: #fafafa;\n  color: #222;\n}\n\n' +
      '.app {\n  max-width: 640px;\n  margin: 0 auto;\n  padding: 16px;\n}\n\n' +
      '.logo {\n  font-size: 24px;\n}');
    add(3, '.profile-header {\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  background: white;\n' +
      '  border-radius: 12px;\n  padding: 20px;\n  margin-bottom: 16px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);\n}\n\n' +
      '.avatar {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n}\n\n' +
      '.username {\n  color: #888;\n  margin: 0;\n}');
    add(4, '.posts {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 12px;\n}\n\n' +
      '.post {\n  background: white;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  overflow: hidden;\n}\n\n' +
      '.post img {\n  width: 100%;\n  display: block;\n}\n\n' +
      '.post-body {\n  padding: 10px 12px;\n}\n\n' +
      '.caption {\n  margin: 0;\n}');
    add(6, '.like-btn {\n  border: none;\n  background: none;\n  font-size: 16px;\n  padding: 0;\n  cursor: pointer;\n}\n\n' +
      '.likes {\n  font-weight: bold;\n  margin: 4px 0;\n}');
    add(7, '.follow-btn {\n  background: #0095f6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n' +
      '  padding: 8px 16px;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n' +
      '.follow-btn.following {\n  background: #ddd;\n  color: #222;\n}');
    add(9, '.feed {\n  display: grid;\n  gap: 16px;\n}');
    add(10, '.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n' +
      '  padding: 12px 0;\n  margin-bottom: 16px;\n  border-bottom: 1px solid #ddd;\n}\n\n' +
      '.navbar a {\n  color: #222;\n  text-decoration: none;\n  margin-left: 16px;\n}\n\n' +
      '.navbar .logo {\n  margin-left: 0;\n  font-weight: bold;\n}');
    return blocks.join('\n\n') + (blocks.length ? '\n' : '');
  }

  // Every file in the project at this step, in the order a file tree shows them.
  function files(step) {
    const f = { 'index.html': indexHtml(), 'src/main.jsx': mainJsx(step), 'src/App.jsx': appJsx(step) };
    if (step >= 2) f['src/style.css'] = styleCss(step);
    if (step >= 8) f['src/data.js'] = dataJs();
    if (step >= 9) f['src/components/Home.jsx'] = homeJsx(step);
    if (step >= 10) f['src/components/Navbar.jsx'] = navbarJsx();
    if (step >= 3) f['src/components/Profile.jsx'] = profileJsx(step);
    if (step >= 4) f['src/components/Post.jsx'] = postJsx(step);
    if (step >= 7) f['src/components/FollowButton.jsx'] = followButtonJsx();
    return f;
  }

  // title, the files the class edits this step (first one opens), and the URL the
  // preview starts on.
  const steps = [
    null,
    { title: 'Clean slate', files: ['src/App.jsx', 'src/main.jsx', 'index.html'] },
    { title: 'Global CSS', files: ['src/style.css', 'src/main.jsx', 'src/App.jsx'] },
    { title: 'Profile', files: ['src/components/Profile.jsx', 'src/App.jsx', 'src/style.css'] },
    { title: 'Post + props', files: ['src/components/Post.jsx', 'src/components/Profile.jsx', 'src/style.css'] },
    { title: 'map()', files: ['src/components/Profile.jsx'] },
    { title: 'Likes', files: ['src/components/Post.jsx', 'src/components/Profile.jsx', 'src/style.css'] },
    { title: 'Follow', files: ['src/components/FollowButton.jsx', 'src/components/Profile.jsx', 'src/style.css'] },
    { title: 'data.js', files: ['src/data.js', 'src/components/Profile.jsx'] },
    { title: 'Routes', files: ['src/App.jsx', 'src/main.jsx', 'src/components/Home.jsx', 'src/style.css'] },
    { title: 'Navbar', files: ['src/components/Navbar.jsx', 'src/App.jsx', 'src/style.css'], path: '/profile' },
    { title: 'useEffect', files: ['src/components/Profile.jsx', 'src/components/Home.jsx'], path: '/profile' }
  ];

  const api = { files, steps, last };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MiniInsta = api;
})(this);
