import React, { useEffect, useState } from 'react';
import './App.css';
import BlogPost from './Components/BlogPost';
import FullPost from './Components/FullPost';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import Clarity from '@microsoft/clarity';

Clarity.init('qcrqd14u1f');

interface Post {
  title: string;
  excerpt: string;
  fullPost: string;
  datePosted: string;
  dateModified?: string;
  modifiedBy?: string;
  postedBy: string;
  tags: string[];
  sources: string[];
  image_path?: string; // Add image_path property
}

interface PostMetadata {
  id: string; // Change id type to string
  title: string;
  excerpt: string;
}

function App() {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [fullPosts, setFullPosts] = useState<{ [key: string]: Post }>({}); // Change key type to string
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = Cookies.get('theme');
    return savedTheme === 'dark';
  }); // State to manage theme

  useEffect(() => {
    fetch('/posts/index.json')
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        data.forEach((post: PostMetadata) => {
          fetchFullPost(post.id);
        });
      });
  }, []);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
    Cookies.set('theme', isDarkTheme ? 'dark' : 'light', { expires: 365 });
  }, [isDarkTheme]);

  const fetchFullPost = (id: string) => { // Change id type to string
    if (!fullPosts[id]) {
      fetch(`/posts/${id}.json`)
        .then(response => response.json())
        .then(data => setFullPosts(prev => ({ ...prev, [id]: data })));
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  return (
    <Router>
      <div className="App">
        <Helmet>
          <title>The Tech Oracle by Elijah Mondero</title>
          <meta name="description" content="A blog about the latest in technology by Elijah Mondero" />
        </Helmet>
        <header className="App-header">
          <h1><Link to="/" className="home-link">The Tech Oracle</Link></h1>
          <label className="switch">
            <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <>
                {posts.map(post => {
                  const fullPost = fullPosts[post.id];
                  return (
                    <BlogPost
                      key={post.id}
                      title={post.title}
                      excerpt={post.excerpt}
                      link={`/post/${post.id}`}
                      datePosted={fullPost ? fullPost.datePosted : ''}
                      dateModified={fullPost ? fullPost.dateModified : undefined}
                      postedBy={fullPost ? fullPost.postedBy : ''}
                      modifiedBy={fullPost ? fullPost.modifiedBy : undefined}
                      image_path={fullPost ? fullPost.image_path : undefined} // Pass image_path as a prop
                      isDarkTheme={isDarkTheme} // Pass isDarkTheme as a prop
                    />
                  );
                })}
              </>
            } />
            <Route path="/post/:id" element={<FullPost posts={fullPosts} fetchFullPost={fetchFullPost} isDarkTheme={isDarkTheme} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;