import React, { useEffect, useState } from 'react';
import './App.css';
import BlogPost from './Components/BlogPost';
import FullPost from './Components/FullPost';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

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
}

interface PostMetadata {
  id: string; // Change id type to string
  title: string;
  excerpt: string;
}

function App() {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [fullPosts, setFullPosts] = useState<{ [key: string]: Post }>({}); // Change key type to string

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

  const fetchFullPost = (id: string) => { // Change id type to string
    if (!fullPosts[id]) {
      fetch(`/posts/${id}.json`)
        .then(response => response.json())
        .then(data => setFullPosts(prev => ({ ...prev, [id]: data })));
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1><Link to="/" className="home-link">The Tech Oracle</Link></h1>
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
                    />
                  );
                })}
              </>
            } />
            <Route path="/post/:id" element={<FullPost posts={fullPosts} fetchFullPost={fetchFullPost} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;