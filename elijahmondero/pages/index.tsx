import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import BlogSummary from '../components/BlogSummary';
import fs from 'fs';
import path from 'path';
import { useTheme } from '../context/ThemeContext';

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
  image_path?: string;
}

interface PostMetadata {
  id: string;
  title: string;
  excerpt: string;
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'posts', 'index.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const posts = JSON.parse(jsonData);
  return {
    props: {
      posts,
    },
  };
}

const Home = ({ posts }: { posts: PostMetadata[] }) => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const [fullPosts, setFullPosts] = useState<{ [key: string]: Post }>({});

  useEffect(() => {
    // Dynamic import of @microsoft/clarity to ensure it runs only on the client side
    import('@microsoft/clarity').then(module => {
      const Clarity = module.default;
      Clarity.init('qcrqd14u1f');
    });

    // Fetch additional data for each post
    posts.forEach((post: PostMetadata) => {
      fetchBlogPost(post.id);
    });
  }, [posts]);

  const fetchBlogPost = (id: string) => {
    if (!fullPosts[id]) {
      fetch(`/posts/${id}.json`)
        .then(response => response.json())
        .then(data => setFullPosts(prev => ({ ...prev, [id]: data })));
    }
  };

  return (
    <>
      <Head>
        <title>The Tech Oracle by Elijah Mondero</title>
        <meta name="description" content="A blog about the latest in technology by Elijah Mondero" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="App">
        <header className="App-header">
          <h1><Link href="/" className="home-link">The Tech Oracle</Link></h1>
          <label className="switch">
            <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </header>
        <main>
          {posts.map(post => {
            const fullPost = fullPosts[post.id];
            return (
              <BlogSummary
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                link={`/post/${post.id}`}
                datePosted={fullPost ? fullPost.datePosted : ''}
                dateModified={fullPost ? fullPost.dateModified : undefined}
                postedBy={fullPost ? fullPost.postedBy : ''}
                modifiedBy={fullPost ? fullPost.modifiedBy : undefined}
                image_path={fullPost ? fullPost.image_path : undefined}
                isDarkTheme={isDarkTheme}
              />
            );
          })}
        </main>
      </div>
    </>
  );
};

export default Home;