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
  const filePath = path.join(process.cwd(), 'public', 'posts', 'trending_posts.json');
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
  const [displayedPosts, setDisplayedPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const postsPerPage = 10; // Number of posts to load per scroll
  const [nextPostIndex, setNextPostIndex] = useState(postsPerPage); // Index of the next post to load

  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(1); // Speed in ms

  useEffect(() => {
    // Dynamic import of @microsoft/clarity to ensure it runs only on the client side
    import('@microsoft/clarity').then(module => {
      const Clarity = module.default;
      Clarity.init('qcrqd14u1f');
    });

    setDisplayedPosts(posts.slice(0, postsPerPage));

    // Fetch additional data for the initially displayed posts
    posts.slice(0, postsPerPage).forEach((post: PostMetadata) => {
      fetchBlogPost(post.id);
    });

  }, [posts]);

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const fullText = `${posts[currentPostIndex].title}: ${posts[currentPostIndex].excerpt}`;
    const words = fullText.split(' ');
    const currentWords = displayText.split(' ');

    let timer;

    if (isDeleting) {
      // Deleting word by word
      timer = setTimeout(() => {
        if (currentWords.length > 1) {
          setDisplayText(currentWords.slice(0, -1).join(' '));
        } else {
          // Last word removed, set to empty and switch
          setDisplayText('');
          setIsDeleting(false);
          setCurrentPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
        }
      }, 50); // Faster deleting speed
    } else {
      // Typing word by word
      if (currentWords.length < words.length) {
        timer = setTimeout(() => {
          const nextWords = words.slice(0, currentWords.length + 1);
          setDisplayText(nextWords.join(' '));
        }, 100); // Typing speed
      } else {
        // Typing complete, pause
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); // Pause duration
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPostIndex, posts]);


  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && // 100px from bottom
          nextPostIndex < posts.length && // Check if there are more posts to load
          !loading) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedPosts, loading, posts, nextPostIndex]); // Add dependencies

  const fetchBlogPost = (id: string) => {
    if (!fullPosts[id]) {
      fetch(`/posts/${id}.json`)
        .then(response => response.json())
        .then(data => setFullPosts(prev => ({ ...prev, [id]: data })));
    }
  };

  const loadMorePosts = () => {
    if (loading || nextPostIndex >= posts.length) return; // Prevent multiple loads or loading beyond available posts
    setLoading(true);

    const endIndex = nextPostIndex + postsPerPage;
    const nextPosts = posts.slice(nextPostIndex, endIndex);

    if (nextPosts.length > 0) {
      setDisplayedPosts(prevPosts => [...prevPosts, ...nextPosts]);
      setNextPostIndex(endIndex);
      // Fetch full post data for the newly added posts
      nextPosts.forEach((post: PostMetadata) => {
        fetchBlogPost(post.id);
      });
    }

    setLoading(false);
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
        <div className="trending-animation-container">
          <span className="trending-label">Trending: </span>
          <Link href={`/post/${posts[currentPostIndex]?.id}`} className="trending-link">
            <span className="typing-text">{displayText}</span>
            <span className="cursor"></span>
          </Link>
        </div>
        <main>
          {displayedPosts.map(post => {
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
          {loading && <div>Loading more posts...</div>}
        </main>
      </div>
    </>
  );
};

export default Home;
